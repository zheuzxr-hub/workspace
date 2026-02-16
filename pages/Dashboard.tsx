
import React from 'react';

interface DashboardProps {
  onSelectTool: (id: string) => void;
  userEmail?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool, userEmail }) => {
  const toolsSection1 = [
    {
      id: 'questoes-ia',
      title: "Criar Questionários IA",
      desc: "Gere questões automáticas e personalizadas seguindo a BNCC. Economize horas de planejamento com um assistente especializado.",
      icon: "fa-brain",
      color: "text-[#1a73e8]"
    },
    {
      id: 'slides-ia',
      title: "Apresentação de Slides",
      desc: "Crie roteiros e estruturas de slides em segundos. Otimize sua aula com conteúdos visuais e estruturados automaticamente.",
      icon: "fa-file-powerpoint",
      color: "text-[#1a73e8]"
    },
    {
      id: 'plano-aula',
      title: "Plano de Aula Mágico",
      desc: "Planeje sua sequência didática completa com objetivos claros e códigos da BNCC integrados em um clique.",
      icon: "fa-calendar-check",
      color: "text-[#1a73e8]"
    },
    {
      id: 'corretor-ia',
      title: "Corretor de Redação",
      desc: "Feedback produtivo e detalhado para seus estudantes. Analise competências e sugira melhorias com auxílio da IA.",
      icon: "fa-pen-nib",
      color: "text-[#1a73e8]"
    }
  ];

  return (
    <div className="min-h-full bg-[#f8f9fa] text-[#3c4043] px-10 py-12 animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1400px] mx-auto space-y-16">
        
        {/* Section 1: Supercharge your apps with AI */}
        <section className="space-y-6">
          <h2 className="text-[20px] font-normal text-[#3c4043] mb-4">Potencialize suas aulas com IA</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {toolsSection1.map((card, idx) => (
              <button 
                key={`s1-${idx}`}
                onClick={() => onSelectTool(card.id)}
                className="group relative bg-white border border-gray-200 hover:border-gray-300 px-6 py-6 rounded-[12px] text-left transition-all hover:shadow-md flex flex-col min-h-[180px] w-full"
              >
                <div className={`text-[16px] mb-4 ${card.color}`}>
                  <i className={`fas ${card.icon}`}></i>
                </div>
                
                <h3 className="text-[15px] font-medium mb-2 text-[#3c4043] leading-tight">
                  {card.title}
                </h3>
                
                <p className="text-[12px] text-[#5f6368] leading-[1.6] font-normal line-clamp-4">
                  {card.desc}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Section 2: Discover and remix app ideas */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-normal text-[#3c4043]">Descubra novas ideias pedagógicas</h2>
            <button className="bg-white text-[#3c4043] text-[13px] font-medium hover:bg-gray-50 px-5 py-2 rounded-full transition-all flex items-center border border-gray-200">
              <span>Ver galeria de modelos</span>
              <i className="fas fa-arrow-right ml-3 text-[10px]"></i>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {toolsSection1.map((card, idx) => (
              <button 
                key={`s2-${idx}`}
                onClick={() => onSelectTool(card.id)}
                className="group relative bg-white border border-gray-200 hover:border-gray-300 px-6 py-6 rounded-[12px] text-left transition-all hover:shadow-md flex flex-col min-h-[180px] w-full"
              >
                <div className={`text-[16px] mb-4 ${card.color}`}>
                  <i className={`fas ${card.icon}`}></i>
                </div>
                <h3 className="text-[15px] font-medium mb-2 text-[#3c4043] leading-tight">
                  {card.title}
                </h3>
                <p className="text-[12px] text-[#5f6368] leading-[1.6] font-normal line-clamp-4">
                  {card.desc}
                </p>
              </button>
            ))}
          </div>
        </section>

        <div className="pt-20 pb-10 text-center">
          <p className="text-[11px] text-[#9aa0a6] uppercase tracking-[0.2em] opacity-60">
            Workspace Education • Versão Experimental
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;