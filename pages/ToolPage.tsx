
import React, { useState, useEffect, useRef } from 'react';
import { DISCIPLINAS, ANOS_ESCOLARIDADE, BNCC_DATA } from '../constants';
import { generateQuestions, suggestBnccSkills } from '../services/geminiService';
import { User, QuestionParams } from '../types';

interface ToolPageProps {
  toolId: string;
  onBack: () => void;
  user: User | null;
}

const ToolPage: React.FC<ToolPageProps> = ({ toolId, onBack, user }) => {
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const [params, setParams] = useState<QuestionParams>({
    grade: ANOS_ESCOLARIDADE[5],
    discipline: DISCIPLINAS[0],
    subject: '',
    count: 5,
    context: '',
    language: 'Português',
    bnccSkills: [],
    bnccManualDetails: '',
    additionalDetails: '',
    webSearch: false,
    fileData: null
  });

  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const disciplineSkills = BNCC_DATA[params.discipline] || {};
    const gradeSkills = disciplineSkills[params.grade] || [];
    setAvailableSkills(gradeSkills);
  }, [params.grade, params.discipline]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setParams({
          ...params,
          fileData: { mimeType: file.type, data: base64String }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSuggestSkills = async () => {
    if (!params.subject) return alert("Por favor, informe o assunto primeiro.");
    setSuggesting(true);
    try {
      const suggestions = await suggestBnccSkills(params.grade, params.discipline, params.subject, availableSkills);
      setParams(p => ({ ...p, bnccSkills: suggestions }));
    } catch (error) { console.error(error); } finally { setSuggesting(false); }
  };

  const handleGenerate = async () => {
    if (!params.subject && !params.bnccManualDetails) return alert("Preencha o assunto ou insira detalhes manuais.");
    setLoading(true);
    setResult(null); 
    try {
      const generatedText = await generateQuestions(params);
      setResult(generatedText);
    } catch (error) { alert("Erro ao gerar. Tente novamente."); } finally { setLoading(false); }
  };

  return (
    <div className="flex h-full bg-[#131314] text-[#e3e3e3] overflow-hidden">
      {/* Left Sidebar: System Instructions / BNCC Context */}
      <aside className="w-[300px] border-r border-[#3c4043]/50 flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-[#131314]">
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#9aa0a6]">Contexto BNCC</label>
          <div className="space-y-4 pt-2">
            <div>
              <p className="text-[12px] text-[#9aa0a6] mb-2">Disciplina</p>
              <select 
                value={params.discipline}
                onChange={(e) => setParams({...params, discipline: e.target.value})}
                className="w-full bg-[#1e1f20] border border-[#3c4043] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#8ab4f8] transition-all"
              >
                {DISCIPLINAS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <p className="text-[12px] text-[#9aa0a6] mb-2">Série/Ano</p>
              <select 
                value={params.grade}
                onChange={(e) => setParams({...params, grade: e.target.value})}
                className="w-full bg-[#1e1f20] border border-[#3c4043] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#8ab4f8] transition-all"
              >
                {ANOS_ESCOLARIDADE.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#9aa0a6]">Habilidades Sugeridas</label>
            <button 
              onClick={handleSuggestSkills}
              disabled={suggesting}
              className="text-[11px] text-[#8ab4f8] hover:underline disabled:opacity-50"
            >
              {suggesting ? 'Sugerindo...' : 'Sugerir p/ IA'}
            </button>
          </div>
          <div className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
            {availableSkills.length > 0 ? availableSkills.map(skill => (
              <label key={skill} className="flex items-start space-x-3 p-3 bg-[#1e1f20] hover:bg-[#2d2f31] rounded-lg cursor-pointer transition-colors border border-transparent hover:border-[#3c4043]">
                <input 
                  type="checkbox" 
                  checked={params.bnccSkills.includes(skill)}
                  onChange={() => {
                    const exists = params.bnccSkills.includes(skill);
                    setParams({...params, bnccSkills: exists ? params.bnccSkills.filter(s => s !== skill) : [...params.bnccSkills, skill]});
                  }}
                  className="mt-1 accent-[#8ab4f8]"
                />
                <span className="text-[11px] text-[#e3e3e3] leading-relaxed">{skill}</span>
              </label>
            )) : (
              <p className="text-[11px] text-[#9aa0a6] italic">Selecione disciplina e série.</p>
            )}
          </div>
        </div>

        {/* New Manual Input Section as requested */}
        <div className="space-y-4 pt-4 border-t border-[#3c4043]/30">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#9aa0a6]">Inclusão Manual</label>
          <div className="space-y-3">
            <p className="text-[11px] text-[#9aa0a6]">Insira habilidades, temas ou palavras-chave manualmente:</p>
            <textarea 
              value={params.bnccManualDetails}
              onChange={(e) => setParams({...params, bnccManualDetails: e.target.value})}
              placeholder="Ex: Habilidade X, Tema de Sustentabilidade, Palavra-chave: Ecologia..."
              className="w-full bg-[#1e1f20] border border-[#3c4043] rounded-xl p-3 text-[12px] text-[#e3e3e3] outline-none focus:border-[#8ab4f8] min-h-[100px] resize-none transition-all placeholder:text-[#3c4043]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#9aa0a6]">Material de Apoio</label>
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="w-full bg-[#1e1f20] border border-dashed border-[#3c4043] hover:border-[#8ab4f8] rounded-xl py-6 text-[12px] text-[#9aa0a6] hover:text-[#e3e3e3] transition-all flex flex-col items-center justify-center space-y-2"
          >
            <i className={`fas ${params.fileData ? 'fa-check-circle text-[#8ab4f8]' : 'fa-cloud-arrow-up'}`}></i>
            <span>{params.fileData ? 'Arquivo carregado' : 'Anexar PDF/Imagem'}</span>
          </button>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
        </div>
      </aside>

      {/* Main Content: Prompt & Result Area */}
      <main className="flex-1 flex flex-col bg-[#0f1115] relative">
        {/* Top bar for ToolPage */}
        <div className="h-[64px] border-b border-[#3c4043]/50 flex items-center justify-between px-8 bg-[#131314]">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className="text-[#9aa0a6] hover:text-[#e3e3e3] text-sm">
              <i className="fas fa-chevron-left mr-2"></i> Voltar
            </button>
            <div className="h-4 w-[1px] bg-[#3c4043]"></div>
            <h2 className="text-[14px] font-medium text-[#e3e3e3]">Gerador de Questionários IA</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleGenerate}
              disabled={loading || (!params.subject && !params.bnccManualDetails)}
              className="bg-[#8ab4f8] hover:bg-[#a1c2fa] text-[#131314] px-6 py-1.5 rounded-full text-[13px] font-semibold transition-all flex items-center disabled:opacity-30"
            >
              {loading ? (
                <><i className="fas fa-spinner fa-spin mr-2"></i> Processando...</>
              ) : (
                <><i className="fas fa-play mr-2 text-[10px]"></i> Executar Prompt</>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Editor Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-[850px] mx-auto space-y-8 pb-20">
            {/* Input Subject Section */}
            <div className="bg-[#1e1f20] rounded-2xl border border-[#3c4043]/50 overflow-hidden">
               <div className="px-6 py-4 border-b border-[#3c4043]/50 bg-[#1a1b1c]">
                 <p className="text-[11px] font-bold uppercase tracking-widest text-[#9aa0a6]">Definição do Assunto Principal</p>
               </div>
               <textarea 
                  value={params.subject}
                  onChange={(e) => setParams({...params, subject: e.target.value})}
                  placeholder="Descreva o assunto do questionário (ex: Ciclo da Água no 5º ano)..."
                  className="w-full bg-transparent p-6 text-[15px] text-[#e3e3e3] outline-none min-h-[120px] resize-none placeholder:text-[#3c4043]"
               />
            </div>

            {/* Result Area (The Document) */}
            {result ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white text-[#131314] rounded-2xl p-12 shadow-2xl font-serif text-[16px] leading-relaxed whitespace-pre-wrap min-h-[600px] border border-white/10">
                  {result}
                </div>
                <div className="flex justify-center mt-8 space-x-4">
                  <button className="bg-[#1e1f20] hover:bg-[#2d2f31] border border-[#3c4043] px-6 py-2 rounded-full text-[12px] transition-all flex items-center">
                    <i className="fas fa-download mr-2"></i> Baixar PDF
                  </button>
                  <button className="bg-[#1e1f20] hover:bg-[#2d2f31] border border-[#3c4043] px-6 py-2 rounded-full text-[12px] transition-all flex items-center">
                    <i className="fas fa-copy mr-2"></i> Copiar Texto
                  </button>
                </div>
              </div>
            ) : !loading && (
              <div className="flex flex-col items-center justify-center py-20 opacity-20 select-none">
                <i className="fas fa-sparkles text-6xl mb-6"></i>
                <p className="text-[14px] uppercase tracking-[0.2em] font-medium">Aguardando comando...</p>
              </div>
            )}

            {/* Loading Placeholder */}
            {loading && (
              <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-[#1e1f20] rounded w-3/4"></div>
                <div className="h-4 bg-[#1e1f20] rounded w-1/2"></div>
                <div className="h-[400px] bg-[#1e1f20] rounded w-full"></div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Right Sidebar: Settings / Config */}
      <aside className="w-[280px] border-l border-[#3c4043]/50 flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-[#131314]">
        <div className="space-y-6">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#9aa0a6]">Configurações da IA</label>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[12px] text-[#9aa0a6]">Número de Questões</span>
                <span className="text-[12px] font-bold text-[#8ab4f8]">{params.count}</span>
              </div>
              <input 
                type="range" 
                min="1" max="20" 
                value={params.count}
                onChange={(e) => setParams({...params, count: parseInt(e.target.value)})}
                className="w-full accent-[#8ab4f8]" 
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#1e1f20] rounded-xl border border-[#3c4043]">
              <div className="flex items-center space-x-3">
                <i className="fab fa-google text-[#8ab4f8] text-[14px]"></i>
                <span className="text-[12px] font-medium">Google Search</span>
              </div>
              <input 
                type="checkbox" 
                checked={params.webSearch}
                onChange={(e) => setParams({...params, webSearch: e.target.checked})}
                className="w-4 h-4 accent-[#8ab4f8]"
              />
            </div>

            <div className="space-y-2">
               <p className="text-[12px] text-[#9aa0a6]">Idioma de Saída</p>
               <select 
                value={params.language}
                onChange={(e) => setParams({...params, language: e.target.value})}
                className="w-full bg-[#1e1f20] border border-[#3c4043] rounded-lg px-3 py-2 text-[12px] outline-none"
              >
                <option value="Português">Português</option>
                <option value="Inglês">Inglês</option>
                <option value="Espanhol">Espanhol</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#3c4043]/50">
          <div className="bg-[#1a73e81a] border border-[#1a73e833] p-4 rounded-xl">
            <div className="flex items-center space-x-3 text-[#8ab4f8] mb-2">
              <i className="fas fa-lightbulb text-[12px]"></i>
              <span className="text-[12px] font-bold uppercase tracking-wider">Dica do Mago</span>
            </div>
            <p className="text-[11px] text-[#8ab4f8]/80 leading-relaxed">
              Use a "Inclusão Manual" para adicionar detalhes específicos que não estão na lista padrão da BNCC.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ToolPage;
