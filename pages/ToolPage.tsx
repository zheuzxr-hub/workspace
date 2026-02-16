
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
    <div className="flex h-full bg-[#f8f9fa] text-[#3c4043] overflow-hidden">
      {/* Left Sidebar: System Instructions / BNCC Context */}
      <aside className="w-[300px] border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-white">
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Contexto BNCC</label>
          <div className="space-y-4 pt-2">
            <div>
              <p className="text-[12px] text-gray-500 mb-2">Disciplina</p>
              <select 
                value={params.discipline}
                onChange={(e) => setParams({...params, discipline: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-brand-500 transition-all"
              >
                {DISCIPLINAS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <p className="text-[12px] text-gray-500 mb-2">Série/Ano</p>
              <select 
                value={params.grade}
                onChange={(e) => setParams({...params, grade: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-brand-500 transition-all"
              >
                {ANOS_ESCOLARIDADE.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Habilidades Sugeridas</label>
            <button 
              onClick={handleSuggestSkills}
              disabled={suggesting}
              className="text-[11px] text-brand-500 hover:underline disabled:opacity-50"
            >
              {suggesting ? 'Sugerindo...' : 'Sugerir p/ IA'}
            </button>
          </div>
          <div className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
            {availableSkills.length > 0 ? availableSkills.map(skill => (
              <label key={skill} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                <input 
                  type="checkbox" 
                  checked={params.bnccSkills.includes(skill)}
                  onChange={() => {
                    const exists = params.bnccSkills.includes(skill);
                    setParams({...params, bnccSkills: exists ? params.bnccSkills.filter(s => s !== skill) : [...params.bnccSkills, skill]});
                  }}
                  className="mt-1 accent-brand-500"
                />
                <span className="text-[11px] text-gray-700 leading-relaxed">{skill}</span>
              </label>
            )) : (
              <p className="text-[11px] text-gray-400 italic">Selecione disciplina e série.</p>
            )}
          </div>
        </div>

        {/* Manual Input Section */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Inclusão Manual</label>
          <div className="space-y-3">
            <p className="text-[11px] text-gray-500">Insira habilidades, temas ou palavras-chave manualmente:</p>
            <textarea 
              value={params.bnccManualDetails}
              onChange={(e) => setParams({...params, bnccManualDetails: e.target.value})}
              placeholder="Ex: Habilidade X, Tema de Sustentabilidade..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-[12px] text-gray-700 outline-none focus:border-brand-500 min-h-[100px] resize-none transition-all placeholder:text-gray-300"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Material de Apoio</label>
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="w-full bg-gray-50 border border-dashed border-gray-300 hover:border-brand-500 rounded-xl py-6 text-[12px] text-gray-500 hover:text-gray-700 transition-all flex flex-col items-center justify-center space-y-2"
          >
            <i className={`fas ${params.fileData ? 'fa-check-circle text-green-500' : 'fa-cloud-arrow-up'}`}></i>
            <span>{params.fileData ? 'Arquivo carregado' : 'Anexar PDF/Imagem'}</span>
          </button>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
        </div>
      </aside>

      {/* Main Content: Prompt & Result Area */}
      <main className="flex-1 flex flex-col bg-[#f8f9fa] relative">
        {/* Top bar for ToolPage */}
        <div className="h-[64px] border-b border-gray-200 flex items-center justify-between px-8 bg-white">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className="text-gray-500 hover:text-gray-900 text-sm">
              <i className="fas fa-chevron-left mr-2"></i> Voltar
            </button>
            <div className="h-4 w-[1px] bg-gray-200"></div>
            <h2 className="text-[14px] font-medium text-gray-900">Gerador de Questionários IA</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleGenerate}
              disabled={loading || (!params.subject && !params.bnccManualDetails)}
              className="bg-brand-500 hover:bg-blue-700 text-white px-6 py-1.5 rounded-full text-[13px] font-semibold transition-all flex items-center disabled:opacity-30"
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
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
               <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                 <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Definição do Assunto Principal</p>
               </div>
               <textarea 
                  value={params.subject}
                  onChange={(e) => setParams({...params, subject: e.target.value})}
                  placeholder="Descreva o assunto do questionário..."
                  className="w-full bg-transparent p-6 text-[15px] text-gray-800 outline-none min-h-[120px] resize-none placeholder:text-gray-300"
               />
            </div>

            {/* Result Area (The Document) */}
            {result ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white text-gray-900 rounded-2xl p-12 shadow-xl font-serif text-[16px] leading-relaxed whitespace-pre-wrap min-h-[600px] border border-gray-100">
                  {result}
                </div>
                <div className="flex justify-center mt-8 space-x-4">
                  <button className="bg-white hover:bg-gray-50 border border-gray-200 px-6 py-2 rounded-full text-[12px] transition-all flex items-center">
                    <i className="fas fa-download mr-2 text-brand-500"></i> Baixar PDF
                  </button>
                  <button className="bg-white hover:bg-gray-50 border border-gray-200 px-6 py-2 rounded-full text-[12px] transition-all flex items-center">
                    <i className="fas fa-copy mr-2 text-brand-500"></i> Copiar Texto
                  </button>
                </div>
              </div>
            ) : !loading && (
              <div className="flex flex-col items-center justify-center py-20 opacity-10 select-none">
                <i className="fas fa-sparkles text-6xl mb-6"></i>
                <p className="text-[14px] uppercase tracking-[0.2em] font-medium text-gray-900">Aguardando comando...</p>
              </div>
            )}

            {/* Loading Placeholder */}
            {loading && (
              <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-white rounded w-3/4"></div>
                <div className="h-4 bg-white rounded w-1/2"></div>
                <div className="h-[400px] bg-white rounded w-full"></div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Right Sidebar: Settings / Config */}
      <aside className="w-[280px] border-l border-gray-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-white">
        <div className="space-y-6">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Configurações da IA</label>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[12px] text-gray-500">Número de Questões</span>
                <span className="text-[12px] font-bold text-brand-500">{params.count}</span>
              </div>
              <input 
                type="range" 
                min="1" max="20" 
                value={params.count}
                onChange={(e) => setParams({...params, count: parseInt(e.target.value)})}
                className="w-full accent-brand-500" 
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center space-x-3">
                <i className="fab fa-google text-brand-500 text-[14px]"></i>
                <span className="text-[12px] font-medium text-gray-700">Google Search</span>
              </div>
              <input 
                type="checkbox" 
                checked={params.webSearch}
                onChange={(e) => setParams({...params, webSearch: e.target.checked})}
                className="w-4 h-4 accent-brand-500"
              />
            </div>

            <div className="space-y-2">
               <p className="text-[12px] text-gray-500">Idioma de Saída</p>
               <select 
                value={params.language}
                onChange={(e) => setParams({...params, language: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[12px] outline-none"
              >
                <option value="Português">Português</option>
                <option value="Inglês">Inglês</option>
                <option value="Espanhol">Espanhol</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <div className="bg-[#e8f0fe] border border-[#d2e3fc] p-4 rounded-xl">
            <div className="flex items-center space-x-3 text-brand-500 mb-2">
              <i className="fas fa-lightbulb text-[12px]"></i>
              <span className="text-[12px] font-bold uppercase tracking-wider">Dica do Mago</span>
            </div>
            <p className="text-[11px] text-blue-700/80 leading-relaxed">
              Use a "Inclusão Manual" para adicionar detalhes específicos que não estão na lista padrão da BNCC.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ToolPage;