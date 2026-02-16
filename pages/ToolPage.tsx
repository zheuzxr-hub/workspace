
import React, { useState, useEffect, useRef } from 'react';
import { DISCIPLINAS, ANOS_ESCOLARIDADE, BNCC_DATA } from '../constants';
import { generateQuestions, generateSlidesOutline, generateThematicImage, suggestBnccSkills, generateLessonPlan } from '../services/geminiService';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import pptxgen from 'pptxgenjs';

interface ToolPageProps {
  toolId: string;
  onBack: () => void;
}

interface SlideData {
  title: string;
  content: string;
}

const ToolPage: React.FC<ToolPageProps> = ({ toolId, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [suggestingSkills, setSuggestingSkills] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  // States for Questionnaire
  const [qSubject, setQSubject] = useState('');
  const [qGrade, setQGrade] = useState(ANOS_ESCOLARIDADE[5]); // Default to 5º ano
  const [qCountType, setQCountType] = useState<'5' | '10' | '15' | '20' | 'custom'>('10');
  const [qCountCustom, setQCountCustom] = useState(10);
  const [qDiscipline, setQDiscipline] = useState(DISCIPLINAS[0]);
  const [qContext, setQContext] = useState('');
  const [qBnccSkills, setQBnccSkills] = useState<string[]>([]);
  const [qBnccManualDetails, setQBnccManualDetails] = useState('');
  const [qLanguage, setQLanguage] = useState('Português (Brasil)');
  const [qDetails, setQDetails] = useState('');
  const [qWebSearch, setQWebSearch] = useState(false);
  const [qFile, setQFile] = useState<{name: string, data: string, mimeType: string} | null>(null);

  // States for Slides
  const [sSubject, setSSubject] = useState('');
  const [sDiscipline, setSDiscipline] = useState(DISCIPLINAS[0]);
  const [sGrade, setSGrade] = useState(ANOS_ESCOLARIDADE[6]);
  const [sCountType, setSCountType] = useState<'5' | '10' | '15' | '20' | 'custom'>('10');
  const [sCountCustom, setSCountCustom] = useState(10);
  const [sDuration, setSDuration] = useState('50 min');
  const [sBnccSkills, setSBnccSkills] = useState<string[]>([]);
  const [sContext, setSContext] = useState('');
  const [sDetails, setSDetails] = useState('');
  const [sLanguage, setSLanguage] = useState('Português (Brasil)');
  const [sWebSearch, setSWebSearch] = useState(false);
  const [sIncludeImages, setSIncludeImages] = useState(false);
  const [sFile, setSFile] = useState<{name: string, data: string, mimeType: string} | null>(null);

  // States for Lesson Plan
  const [lpPeriod, setLpPeriod] = useState('Próximas 2 semanas');
  const [lpSubject, setLpSubject] = useState('');
  const [lpGrade, setLpGrade] = useState(ANOS_ESCOLARIDADE[6]);
  const [lpDiscipline, setLpDiscipline] = useState(DISCIPLINAS[0]);
  const [lpMultidisciplinary, setLpMultidisciplinary] = useState(false);
  const [lpDays, setLpDays] = useState<Record<string, boolean>>({
    'Segunda-feira': true,
    'Terça-feira': true,
    'Quarta-feira': true,
    'Quinta-feira': true,
    'Sexta-feira': true,
    'Sábado': false,
    'Domingo': false,
  });
  const [lpBnccSkills, setLpBnccSkills] = useState<string[]>([]);

  // Dynamic BNCC Skills
  const [availableSkillsQ, setAvailableSkillsQ] = useState<string[]>([]);
  const [availableSkillsS, setAvailableSkillsS] = useState<string[]>([]);
  const [availableSkillsLp, setAvailableSkillsLp] = useState<string[]>([]);

  useEffect(() => {
    const skills = BNCC_DATA[qDiscipline]?.[qGrade] || [];
    setAvailableSkillsQ(skills);
    setQBnccSkills([]);
  }, [qGrade, qDiscipline]);

  useEffect(() => {
    const skills = BNCC_DATA[sDiscipline]?.[sGrade] || [];
    setAvailableSkillsS(skills);
    setSBnccSkills([]);
  }, [sGrade, sDiscipline]);

  useEffect(() => {
    const skills = BNCC_DATA[lpDiscipline]?.[lpGrade] || [];
    setAvailableSkillsLp(skills);
    setLpBnccSkills([]);
  }, [lpGrade, lpDiscipline]);

  const handleAutoSuggestSkills = async (target: 'Q' | 'S' | 'LP') => {
    const subject = target === 'Q' ? qSubject : (target === 'S' ? sSubject : lpSubject || 'Planejamento de aulas');
    const grade = target === 'Q' ? qGrade : (target === 'S' ? sGrade : lpGrade);
    const discipline = target === 'Q' ? qDiscipline : (target === 'S' ? sDiscipline : lpDiscipline);
    const available = target === 'Q' ? availableSkillsQ : (target === 'S' ? availableSkillsS : availableSkillsLp);

    if (target === 'Q' && !qSubject) return;

    setSuggestingSkills(true);
    try {
      const suggested = await suggestBnccSkills(grade, discipline, subject, available);
      const filtered = suggested.filter(s => available.includes(s));
      const finalSelection = filtered.length > 0 ? filtered : [suggested[0]];
      
      if (target === 'Q') setQBnccSkills(finalSelection);
      else if (target === 'S') setSBnccSkills(finalSelection);
      else setLpBnccSkills(finalSelection);
    } catch (e) {
      console.error(e);
    } finally {
      setSuggestingSkills(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'Q' | 'S') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const base64Content = base64.split(',')[1];
      const fileObj = {
        name: file.name,
        data: base64Content,
        mimeType: file.type
      };
      if (target === 'Q') setQFile(fileObj);
      else setSFile(fileObj);
    };
    reader.readAsDataURL(file);
  };

  const parseSlides = (text: string) => {
    const slideBlocks = text.split(/--- SLIDE \d+ ---/i).filter(b => b.trim().length > 10);
    return slideBlocks.map(block => {
      const titleMatch = block.match(/TÍTULO:\s*(.*)/i);
      const contentMatch = block.match(/CONTEÚDO:\s*([\s\S]*)/i);
      return {
        title: titleMatch ? titleMatch[1].trim() : "Slide sem título",
        content: contentMatch ? contentMatch[1].trim() : block.trim()
      };
    });
  };

  const handleGenerateQuestions = async () => {
    setLoading(true);
    setResult(null);
    const finalCount = qCountType === 'custom' ? qCountCustom : parseInt(qCountType);
    try {
      const output = await generateQuestions({
        grade: qGrade,
        subject: qSubject,
        count: finalCount,
        discipline: qDiscipline,
        context: qContext,
        language: qLanguage,
        bnccSkills: qBnccSkills,
        bnccManualDetails: qBnccManualDetails,
        additionalDetails: qDetails,
        webSearch: qWebSearch,
        fileData: qFile ? { data: qFile.data, mimeType: qFile.mimeType } : null
      });
      setResult(output || 'Erro na geração.');
    } catch (e) { alert("Falha ao gerar conteúdo."); } finally { setLoading(false); }
  };

  const handleGenerateSlides = async () => {
    setLoading(true);
    setResult(null);
    setSlides([]);
    setGeneratedImages([]);
    const finalCount = sCountType === 'custom' ? sCountCustom : parseInt(sCountType);
    try {
      const output = await generateSlidesOutline({
        subject: sSubject,
        discipline: sDiscipline,
        grade: sGrade,
        count: finalCount,
        duration: sDuration,
        language: sLanguage,
        bnccSkills: sBnccSkills,
        context: sContext,
        additionalDetails: sDetails,
        webSearch: sWebSearch,
        includeImages: sIncludeImages,
        fileData: sFile ? { data: sFile.data, mimeType: sFile.mimeType } : null
      });
      if (output) {
        setResult(output);
        setSlides(parseSlides(output));
      }
      if (sIncludeImages) {
        const imageUrl = await generateThematicImage(sSubject, sDiscipline);
        if (imageUrl) setGeneratedImages([imageUrl]);
      }
    } catch (e) { alert("Falha ao gerar slides."); } finally { setLoading(false); }
  };

  const handleGenerateLessonPlanAction = async () => {
    setLoading(true);
    setResult(null);
    try {
      const selectedDays = Object.keys(lpDays).filter(day => lpDays[day]);
      const output = await generateLessonPlan({
        period: lpPeriod,
        grade: lpGrade,
        discipline: lpDiscipline,
        multidisciplinary: lpMultidisciplinary,
        days: selectedDays,
        bnccSkills: lpBnccSkills
      });
      setResult(output);
    } catch (e) { alert("Falha ao gerar plano de aula."); } finally { setLoading(false); }
  };

  const handleExportPPTX = () => {
    if (slides.length === 0) return;
    setLoading(true);
    try {
      const pptx = new pptxgen();
      slides.forEach((slide, idx) => {
        const pSlide = pptx.addSlide();
        pSlide.addText(slide.title, { x: 0.5, y: 0.5, w: '90%', fontSize: 28, bold: true, color: '475569', fontFace: 'Arial' });
        pSlide.addText(slide.content, { x: 0.5, y: 1.5, w: '90%', fontSize: 16, color: '333333', bullet: true, fontFace: 'Arial', valign: 'top' });
        if ((idx === 0 || idx === Math.floor(slides.length / 2)) && generatedImages.length > 0) {
          pSlide.addImage({ data: generatedImages[0], x: 0.5, y: 3.8, w: 9, h: 1.5, sizing: { type: 'contain', w: 9, h: 1.5 } });
        }
        pSlide.addText('WS Workspace AI - BNCC Criativo', { x: 0.5, y: 5.3, w: '40%', fontSize: 8, color: '94a3b8' });
        pSlide.addText(`${idx + 1}`, { x: 9.0, y: 5.3, w: '5%', fontSize: 8, color: '94a3b8', align: 'right' });
      });
      pptx.writeFile({ fileName: `WS-Slides-${sSubject.replace(/\s+/g, '-')}-${Date.now()}.pptx` });
    } catch (error) { alert("Erro ao exportar para PowerPoint."); } finally { setLoading(false); }
  };

  const handleDownloadPDF = async () => {
    if (!resultRef.current) return;
    setLoading(true);
    const pdf = new jsPDF('p', 'mm', 'a4'); 
    try {
      if (toolId === 'slides-ia' && slides.length > 0) {
        const slideElements = document.querySelectorAll('.slide-card');
        for (let i = 0; i < slideElements.length; i++) {
          if (i > 0) pdf.addPage('a4', 'l');
          const canvas = await htmlToImage.toCanvas(slideElements[i] as HTMLElement, { backgroundColor: '#ffffff' });
          const imgData = canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
        }
      } else {
        const canvas = await htmlToImage.toCanvas(resultRef.current, { backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      }
      pdf.save(`ws-workspace-${toolId}-${Date.now()}.pdf`);
    } catch (error) { window.print(); } finally { setLoading(false); }
  };

  const renderQuestionnaireForm = () => (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      <section className="space-y-6">
        <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-widest border-l-2 border-brand-400 pl-3">Informações Iniciais</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ano de escolaridade</label>
            <select value={qGrade} onChange={(e) => setQGrade(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 text-black font-semibold shadow-sm transition-all text-sm">
              {ANOS_ESCOLARIDADE.map(ano => <option key={ano} value={ano}>{ano}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Disciplina</label>
            <select value={qDiscipline} onChange={(e) => setQDiscipline(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 text-black font-semibold shadow-sm transition-all text-sm">
              {DISCIPLINAS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Assunto</label>
            <div className="relative group">
              <input value={qSubject} onChange={(e) => setQSubject(e.target.value)} type="text" placeholder="Ex: Ciclo da Água, Equações..." className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3 pr-44 outline-none focus:border-brand-500 text-black font-bold shadow-sm transition-all text-sm" />
              <button onClick={() => handleAutoSuggestSkills('Q')} disabled={suggestingSkills || !qSubject} className="absolute right-2 top-2 bottom-2 bg-brand-500 text-white px-4 rounded-lg text-[10px] font-black uppercase hover:bg-brand-600 disabled:opacity-50 transition-all flex items-center space-x-2">
                {suggestingSkills ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
                <span>Sugerir BNCC</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-widest border-l-2 border-brand-400 pl-3">Configurações do Material</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quantidade de questões</label>
            <div className="flex flex-wrap gap-2">
              {['5', '10', '15', '20'].map(val => (
                <button key={val} onClick={() => setQCountType(val as any)} className={`px-5 py-2 rounded-lg text-[10px] font-black transition-all border ${qCountType === val ? 'bg-brand-500 border-brand-500 text-white shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:border-brand-200 hover:text-brand-600'}`}>
                  {val}
                </button>
              ))}
              <button onClick={() => setQCountType('custom')} className={`px-5 py-2 rounded-lg text-[10px] font-black transition-all border ${qCountType === 'custom' ? 'bg-brand-500 border-brand-500 text-white shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:border-brand-200 hover:text-brand-600'}`}>
                Personalizado
              </button>
              {qCountType === 'custom' && (
                <input type="number" min="1" max="50" value={qCountCustom} onChange={(e) => setQCountCustom(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))} className="ml-2 w-16 bg-white border border-brand-500 rounded-lg px-2 py-1 text-center font-black text-xs outline-none shadow-sm" />
              )}
            </div>
            <p className="text-[9px] text-gray-400 italic">Até 50 questões no modo personalizado.</p>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Idioma do material</label>
            <select value={qLanguage} onChange={(e) => setQLanguage(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 text-black font-bold shadow-sm transition-all text-sm">
              <option>Português (Brasil)</option>
              <option>Inglês</option>
              <option>Espanhol</option>
              <option>Francês</option>
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-widest border-l-2 border-brand-400 pl-3">Base Nacional Comum Curricular (BNCC)</h4>
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Habilidades encontradas:</label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-3 bg-white rounded-xl border border-gray-200 custom-scrollbar">
            {availableSkillsQ.length > 0 ? availableSkillsQ.map((skill, idx) => (
              <label key={idx} className="flex items-start space-x-3 text-sm text-black cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-all font-semibold">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded accent-brand-500 border-gray-300" checked={qBnccSkills.includes(skill)} onChange={(e) => e.target.checked ? setQBnccSkills([...qBnccSkills, skill]) : setQBnccSkills(qBnccSkills.filter(s => s !== skill))} />
                <span className="leading-tight">{skill}</span>
              </label>
            )) : <p className="text-[10px] text-gray-400 italic py-1">Selecione disciplina primeiro.</p>}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-widest border-l-2 border-brand-400 pl-3">Contexto & Adicionais</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contexto</label>
            <textarea value={qContext} onChange={(e) => setQContext(e.target.value)} placeholder="Ex: Turma com dificuldades em interpretação..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 text-black font-medium h-24 resize-none shadow-sm text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Detalhes adicionais</label>
            <textarea value={qDetails} onChange={(e) => setQDetails(e.target.value)} placeholder="Ex: Focar em questões de múltipla escolha..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 text-black font-medium h-24 resize-none shadow-sm text-sm" />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
          <div className="flex-1 w-full">
            <input type="file" id="qFile" onChange={(e) => handleFileUpload(e, 'Q')} className="hidden" accept=".txt,.pdf,.doc,.docx,image/*" />
            <label htmlFor="qFile" className={`flex items-center justify-between w-full px-5 py-3.5 border border-dashed rounded-xl cursor-pointer transition-all ${qFile ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-300 hover:bg-slate-50'}`}>
               <span className="text-[10px] font-black text-gray-500 truncate max-w-[250px]">
                 {qFile ? qFile.name : 'Anexar arquivo como conteúdo extra'}
               </span>
               <i className={`fas ${qFile ? 'fa-check-circle text-brand-500' : 'fa-paperclip text-gray-400'}`}></i>
            </label>
          </div>
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-10 h-5 rounded-full relative transition-colors ${qWebSearch ? 'bg-brand-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${qWebSearch ? 'translate-x-5' : ''}`}></div>
                <input type="checkbox" className="hidden" checked={qWebSearch} onChange={() => setQWebSearch(!qWebSearch)} />
              </div>
              <span className="text-[10px] font-black text-black uppercase tracking-wider">Buscar na web</span>
            </label>
          </div>
        </div>
      </section>

      <button onClick={handleGenerateQuestions} disabled={loading || !qSubject} className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-black py-5 rounded-xl shadow-lg shadow-brand-500/10 transition-all uppercase tracking-widest text-xs flex items-center justify-center space-x-4">
        {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-brain"></i>}
        <span>Criar Questionário</span>
      </button>
    </div>
  );

  const renderSlidesForm = () => (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      <section className="space-y-6">
        <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-widest border-l-2 border-brand-400 pl-3">Informações Básicas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ano de Escolaridade</label>
            <select value={sGrade} onChange={(e) => setSGrade(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 text-black font-bold shadow-sm text-sm">
              {ANOS_ESCOLARIDADE.map(ano => <option key={ano} value={ano}>{ano}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Disciplina</label>
            <select value={sDiscipline} onChange={(e) => setSDiscipline(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 text-black font-bold shadow-sm text-sm">
              {DISCIPLINAS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Assunto / Tema da Aula</label>
            <div className="relative">
              <input value={sSubject} onChange={(e) => setSSubject(e.target.value)} type="text" placeholder="Ex: Fotossíntese..." className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 pr-44 outline-none focus:border-brand-500 text-black font-bold shadow-sm text-sm" />
              <button onClick={() => handleAutoSuggestSkills('S')} disabled={suggestingSkills || !sSubject} className="absolute right-2 top-2 bottom-2 bg-brand-500 text-white px-4 rounded-lg text-[10px] font-black uppercase hover:bg-brand-600 disabled:opacity-50 transition-all flex items-center space-x-2">
                {suggestingSkills ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
                <span>Auto-BNCC</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-widest border-l-2 border-brand-400 pl-3">Personalização da Apresentação</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quantidade de Páginas (Slides)</label>
            <div className="flex flex-wrap gap-2">
              {['5', '10', '15', '20'].map(val => (
                <button key={val} onClick={() => setSCountType(val as any)} className={`px-5 py-2 rounded-lg text-[10px] font-black transition-all border ${sCountType === val ? 'bg-brand-500 border-brand-500 text-white shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:border-brand-200 hover:text-brand-600'}`}>
                  {val}
                </button>
              ))}
              <button onClick={() => setSCountType('custom')} className={`px-5 py-2 rounded-lg text-[10px] font-black transition-all border ${sCountType === 'custom' ? 'bg-brand-500 border-brand-500 text-white shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:border-brand-200 hover:text-brand-600'}`}>
                Outro
              </button>
              {sCountType === 'custom' && (
                <input type="number" min="1" max="50" value={sCountCustom} onChange={(e) => setSCountCustom(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))} className="ml-2 w-16 bg-white border border-brand-500 rounded-lg px-2 py-1 text-center font-black text-xs outline-none shadow-sm" />
              )}
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Idioma do Material</label>
            <select value={sLanguage} onChange={(e) => setSLanguage(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 text-black font-bold shadow-sm text-sm">
              <option>Português (Brasil)</option>
              <option>Inglês</option>
              <option>Espanhol</option>
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-widest border-l-2 border-brand-400 pl-3">Conteúdo & Contexto</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contexto</label>
            <textarea value={sContext} onChange={(e) => setSContext(e.target.value)} placeholder="Ex: Aula introdutória..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 text-black font-medium h-24 resize-none shadow-sm text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Detalhes Adicionais</label>
            <textarea value={sDetails} onChange={(e) => setSDetails(e.target.value)} placeholder="Ex: Atividade final..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 text-black font-medium h-24 resize-none shadow-sm text-sm" />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
          <div className="flex-1 w-full">
            <input type="file" id="sFile" onChange={(e) => handleFileUpload(e, 'S')} className="hidden" accept=".txt,.pdf,.doc,.docx,image/*" />
            <label htmlFor="sFile" className={`flex items-center justify-between w-full px-5 py-3.5 border border-dashed rounded-xl cursor-pointer transition-all ${sFile ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-300 hover:bg-slate-50'}`}>
               <span className="text-[10px] font-black text-gray-500 truncate max-w-[200px]">{sFile ? sFile.name : 'Anexar arquivo'}</span>
               <i className={`fas ${sFile ? 'fa-check-circle text-brand-500' : 'fa-paperclip text-gray-400'}`}></i>
            </label>
          </div>
          <div className="flex flex-col space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <div className={`w-10 h-5 rounded-full relative transition-colors ${sWebSearch ? 'bg-brand-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${sWebSearch ? 'translate-x-5' : ''}`}></div>
                <input type="checkbox" className="hidden" onChange={() => setSWebSearch(!sWebSearch)} />
              </div>
              <span className="text-[10px] font-black text-black uppercase tracking-wider">Buscar Web</span>
            </label>
          </div>
        </div>
      </section>

      <button onClick={handleGenerateSlides} disabled={loading || !sSubject} className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-black py-4 rounded-xl shadow-lg shadow-brand-500/10 transition-all uppercase tracking-widest text-xs flex items-center justify-center space-x-4">
        <span>Gerar Apresentação</span>
      </button>
    </div>
  );

  const renderLessonPlanForm = () => (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      <section className="space-y-6">
        <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-widest border-l-2 border-brand-400 pl-3">Planejar Aulas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Período</label>
            <select value={lpPeriod} onChange={(e) => setLpPeriod(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 text-black font-bold shadow-sm text-sm">
              <option>Próximas 2 semanas</option>
              <option>Próximo trimestre</option>
              <option>Próximo semestre</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ano de Escolaridade</label>
            <select value={lpGrade} onChange={(e) => setLpGrade(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 text-black font-bold shadow-sm text-sm">
              {ANOS_ESCOLARIDADE.map(ano => <option key={ano} value={ano}>{ano}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Disciplina</label>
            <select value={lpDiscipline} onChange={(e) => setLpDiscipline(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 text-black font-bold shadow-sm text-sm">
              {DISCIPLINAS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex items-center space-x-4 h-full pt-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <div className={`w-10 h-5 rounded-full relative transition-colors ${lpMultidisciplinary ? 'bg-brand-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${lpMultidisciplinary ? 'translate-x-5' : ''}`}></div>
                <input type="checkbox" className="hidden" onChange={() => setLpMultidisciplinary(!lpMultidisciplinary)} />
              </div>
              <span className="text-[10px] font-black text-black uppercase tracking-wider">Planejamento multidisciplinar</span>
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-widest border-l-2 border-brand-400 pl-3">Assunto / Tema Central</h4>
        <input 
          value={lpSubject} 
          onChange={(e) => setLpSubject(e.target.value)} 
          type="text" 
          placeholder="Ex: Ciclo da Água, Brasil Colônia..." 
          className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 outline-none focus:border-brand-500 text-black font-bold shadow-sm text-sm" 
        />
      </section>

      <section className="space-y-6">
        <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-widest border-l-2 border-brand-400 pl-3">Para quais dias da semana?</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.keys(lpDays).map(day => (
            <label key={day} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-slate-50 transition-all cursor-pointer">
              <span className="text-xs font-bold text-gray-700">{day}</span>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${lpDays[day] ? 'bg-brand-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${lpDays[day] ? 'translate-x-5' : ''}`}></div>
                <input type="checkbox" className="hidden" checked={lpDays[day]} onChange={() => setLpDays({...lpDays, [day]: !lpDays[day]})} />
              </div>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-widest border-l-2 border-brand-400 pl-3">Habilidades BNCC</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-3 bg-white rounded-xl border border-gray-200 custom-scrollbar">
            {availableSkillsLp.length > 0 ? availableSkillsLp.map((skill, idx) => (
              <label key={idx} className="flex items-start space-x-3 text-sm text-black cursor-pointer hover:bg-slate-50 p-2.5 rounded-lg transition-all font-semibold">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded accent-brand-500 border-gray-300" checked={lpBnccSkills.includes(skill)} onChange={(e) => e.target.checked ? setLpBnccSkills([...lpBnccSkills, skill]) : setLpBnccSkills(lpBnccSkills.filter(s => s !== skill))} />
                <span className="leading-tight">{skill}</span>
              </label>
            )) : <p className="text-[10px] text-gray-400 italic">Nenhuma habilidade encontrada para este ano/disciplina.</p>}
          </div>
          <button onClick={() => handleAutoSuggestSkills('LP')} disabled={suggestingSkills || !lpSubject} className="w-full py-2 bg-brand-100 text-brand-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-200 transition-all flex items-center justify-center space-x-2">
            {suggestingSkills ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
            <span>{suggestingSkills ? 'Sugerindo...' : 'Sugerir habilidades relevantes'}</span>
          </button>
        </div>
      </section>

      <button onClick={handleGenerateLessonPlanAction} disabled={loading} className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-black py-4 rounded-xl shadow-lg shadow-brand-500/10 transition-all uppercase tracking-widest text-xs flex items-center justify-center space-x-4">
        <span>Gerar Plano de Aula</span>
      </button>
    </div>
  );

  const getFormToRender = () => {
    switch (toolId) {
      case 'questoes-ia': return renderQuestionnaireForm();
      case 'slides-ia': return renderSlidesForm();
      case 'plano-aula': return renderLessonPlanForm();
      default: return <p className="text-gray-400 text-center py-20 italic">Ferramenta em desenvolvimento.</p>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 p-6">
      <button onClick={onBack} className="flex items-center text-brand-600 font-black mb-8 group no-print text-[10px] uppercase tracking-widest hover:text-brand-700">
        <i className="fas fa-arrow-left mr-2 transition-transform group-hover:-translate-x-1"></i>
        Voltar
      </button>

      <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-xl relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-slate-50 rounded-full blur-[100px] opacity-60"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 no-print relative z-10">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/10">
              <i className={`fas ${toolId === 'questoes-ia' ? 'fa-brain' : (toolId === 'slides-ia' ? 'fa-file-powerpoint' : 'fa-calendar-check')} text-white text-3xl`}></i>
            </div>
            <div>
              <h2 className="text-3xl font-black text-black tracking-tight leading-none mb-2">
                {toolId === 'questoes-ia' ? 'Questionários IA' : (toolId === 'slides-ia' ? 'Apresentação IA' : 'Plano de Aula')}
              </h2>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Metodologia BNCC • 2025</p>
            </div>
          </div>
          <div className="bg-brand-50 text-brand-600 border border-brand-100 px-4 py-1.5 rounded-lg flex items-center space-x-2 self-start md:self-center">
            <i className="fas fa-shield-alt text-xs"></i>
            <span className="text-[10px] font-black uppercase tracking-widest">Profissional</span>
          </div>
        </div>

        {result ? (
          <div className="space-y-8 animate-in zoom-in duration-300">
             <div className="flex items-center justify-between no-print border-b border-gray-50 pb-6">
                <h3 className="text-xl font-black text-black">Material Gerado ✨</h3>
                <div className="flex space-x-2">
                   {toolId === 'slides-ia' && slides.length > 0 && (
                     <button onClick={handleExportPPTX} className="px-5 py-2.5 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-all border border-brand-200 flex items-center space-x-2 shadow-sm">
                        <i className="fas fa-file-powerpoint text-xs"></i>
                        <span className="text-[10px] font-black uppercase tracking-widest">PowerPoint</span>
                     </button>
                   )}
                   <button onClick={handleDownloadPDF} className="p-3 rounded-xl bg-white text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-all border border-gray-200 shadow-sm">
                      <i className="fas fa-file-pdf"></i>
                   </button>
                </div>
             </div>
             
             <div id="printable-result" ref={resultRef} className="space-y-10">
                {toolId === 'slides-ia' && slides.length > 0 ? (
                  <div className="grid grid-cols-1 gap-12">
                    {slides.map((slide, idx) => (
                      <div key={idx} className="slide-card bg-white border border-gray-100 aspect-video rounded-2xl p-12 shadow-md flex flex-col relative overflow-hidden text-black transition-all hover:border-brand-200">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-500"></div>
                        <div className="flex-1 flex flex-col">
                          <h4 className="text-3xl font-black mb-8 text-brand-600 uppercase tracking-tight border-b border-slate-50 pb-4">{slide.title}</h4>
                          <div className="flex-1 text-xl leading-relaxed whitespace-pre-wrap font-medium text-slate-700 custom-scrollbar overflow-y-auto pr-2">{slide.content}</div>
                        </div>
                        {(idx === 0 || idx === slides.length - 1) && generatedImages.length > 0 && (
                          <div className="mt-6 h-48 w-full rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                             <img src={generatedImages[0]} className="w-full h-full object-cover" alt="Visual" />
                          </div>
                        )}
                        <div className="mt-8 flex justify-between items-center border-t border-slate-50 pt-6 opacity-30">
                           <span className="text-[7px] font-black uppercase tracking-[0.4em]">WS WORKSPACE AI • BNCC</span>
                           <span className="text-[7px] font-black">{idx + 1} / {slides.length}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-slate-100 rounded-2xl p-10 prose max-w-none font-sans text-base leading-relaxed text-slate-800 whitespace-pre-wrap shadow-sm min-h-[500px]">
                    {result}
                  </div>
                )}
             </div>

             <div className="pt-8 no-print">
               <button onClick={() => { setResult(null); setSlides([]); setGeneratedImages([]); setQFile(null); setSFile(null); }} className="w-full py-4 rounded-xl border-2 border-brand-500 text-brand-500 font-black hover:bg-brand-50 transition-all uppercase tracking-widest text-[10px]">
                  Recomeçar
               </button>
             </div>
          </div>
        ) : getFormToRender()}
      </div>
    </div>
  );
};

export default ToolPage;
