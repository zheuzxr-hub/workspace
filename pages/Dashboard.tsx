
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
      color: "text-[#8ab4f8]"
    },
    {
      id: 'slides-ia',
      title: "Apresentação de Slides",
      desc: "Crie roteiros e estruturas de slides em segundos. Otimize sua aula com conteúdos visuais e estruturados automaticamente.",
      icon: "fa-file-powerpoint",
      color: "text-[#8ab4f8]"
    },
    {
      id: 'plano-aula',
      title: "Plano de Aula Mágico",
      desc: "Planeje sua sequência didática completa com objetivos claros e códigos da BNCC integrados em um clique.",
      icon: "fa-calendar-check",
      color: "text-[#8ab4f8]"
    },
    {
      id: 'corretor-ia',
      title: "Corretor de Redação",
      desc: "Feedback produtivo e detalhado para seus estudantes. Analise competências e sugira melhorias com auxílio da IA.",
      icon: "fa-pen-nib",
      color: "text-[#8ab4f8]"
    }
  ];

  return (
    <div className="min-h-full bg-[#131314] text-[#e3e3e3] px-10 py-12 animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1400px] mx-auto space-y-16">
        
        {/* Section 1: Supercharge your apps with AI */}
        <section className="space-y-6">
          <h2 className="text-[20px] font-normal text-[#e3e3e3] mb-4">Potencialize suas aulas com IA</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {toolsSection1.map((card, idx) => (
              <button 
                key={`s1-${idx}`}
                onClick={() => onSelectTool(card.id)}
                className="group relative bg-[#1e1f20] border border-transparent hover:border-[#3c4043] px-6 py-6 rounded-[12px] text-left transition-all hover:bg-[#282a2d] flex flex-col min-h-[180px] w-full"
              >
                {/* Small icon at the top left like AI Studio */}
                <div className={`text-[16px] mb-4 ${card.color}`}>
                  <i className={`fas ${card.icon}`}></i>
                </div>
                
                {/* Title */}
                <h3 className="text-[15px] font-medium mb-2 text-[#e3e3e3] leading-tight">
                  {card.title}
                </h3>
                
                {/* Description */}
                <p className="text-[12px] text-[#9aa0a6] leading-[1.6] font-normal line-clamp-4">
                  {card.desc}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Section 2: Discover and remix app ideas */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-normal text-[#e3e3e3]">Descubra novas ideias pedagógicas</h2>
            <button className="bg-[#1e1f20] text-[#e3e3e3] text-[13px] font-medium hover:bg-[#282a2d] px-5 py-2 rounded-full transition-all flex items-center border border-[#3c4043]">
              <span>Ver galeria de modelos</span>
              <i className="fas fa-arrow-right ml-3 text-[10px]"></i>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Same layout as above to maintain the visual language */}
            {toolsSection1.map((card, idx) => (
              <button 
                key={`s2-${idx}`}
                onClick={() => onSelectTool(card.id)}
                className="group relative bg-[#1e1f20] border border-transparent hover:border-[#3c4043] px-6 py-6 rounded-[12px] text-left transition-all hover:bg-[#282a2d] flex flex-col min-h-[180px] w-full"
              >
                <div className={`text-[16px] mb-4 ${card.color}`}>
                  <i className={`fas ${card.icon}`}></i>
                </div>
                <h3 className="text-[15px] font-medium mb-2 text-[#e3e3e3] leading-tight">
                  {card.title}
                </h3>
                <p className="text-[12px] text-[#9aa0a6] leading-[1.6] font-normal line-clamp-4">
                  {card.desc}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Footer info consistent with the minimal theme */}
        <div className="pt-20 pb-10 text-center">
          <p className="text-[11px] text-[#9aa0a6] uppercase tracking-[0.2em] opacity-40">
            Workspace Education • Versão Experimental
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
