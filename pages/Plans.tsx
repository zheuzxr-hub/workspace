import React, { useState } from 'react';
import { Plan } from '../types';
import { handleStripeCheckout } from '../services/stripeService';

interface PlansPageProps {
  userEmail?: string;
  onClose?: () => void;
}

const Plans: React.FC<PlansPageProps> = ({ userEmail, onClose }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  const features = [
    { name: '70+ Ferramentas IA', sub: 'Slides, mapas mentais...', basico: '~100 créditos', premium: '∞ ilimitado', semestral: '∞ ilimitado' },
    { name: 'Avaliação', sub: '', basico: '~100 créditos', premium: '∞ ilimitado', semestral: '∞ ilimitado' },
    { name: 'Correção', sub: 'por questão ou redação', basico: '~100 créditos', premium: '∞ ilimitado', semestral: '∞ ilimitado' },
    { name: 'Aula Mágica', sub: '', basico: '~150 créditos', premium: '∞ ilimitado', semestral: '∞ ilimitado' },
    { name: 'Planejamento Calendário', sub: '', basico: '~200 créditos', premium: '∞ ilimitado', semestral: '∞ ilimitado' },
    { name: 'Temas Básicos de Slides', sub: '', basico: 'check', premium: 'check', semestral: 'check' },
    { name: 'Temas Premium de Slides', sub: '', basico: 'dash', premium: 'check', semestral: 'check' },
    { name: 'Calendário Escolar', sub: '', basico: 'dash', premium: 'dash', semestral: 'check' },
    { name: 'Biblioteca Digital Escolar', sub: '', basico: 'dash', premium: 'dash', semestral: 'check' },
    { name: 'Tema da Escola', sub: '', basico: 'dash', premium: 'dash', semestral: 'check' },
    { name: 'Rubricas Personalizadas', sub: '', basico: 'dash', premium: 'dash', semestral: 'check' },
  ];

  const renderIcon = (type: string) => {
    if (type === 'check') return <i className="fas fa-check text-blue-500 text-sm"></i>;
    if (type === 'dash') return <span className="text-gray-300">—</span>;
    if (type.includes('ilimitado')) return <span className="text-blue-600 font-bold text-xs">{type}</span>;
    return <span className="text-gray-500 font-medium text-xs">{type}</span>;
  };

  return (
    <div className="min-h-screen bg-[#f8faff] py-10 px-4 flex flex-col items-center relative animate-in fade-in duration-500">
      
      {/* Botão de fechar */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 md:right-12 w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-black transition-all z-50 shadow-lg"
      >
        <i className="fas fa-times"></i>
      </button>

      <div className="w-full max-w-[1000px] mt-10">
        <div className="grid grid-cols-4 gap-0 items-end">
          <div className="p-4"></div>

          {/* Header Básico */}
          <div className="bg-white rounded-t-3xl border-t border-l border-r border-gray-100 p-6 text-center shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.02)]">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
               <i className="fas fa-file-alt text-blue-400"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-6">Básico</h3>
            <div className="mb-6">
              <span className="text-lg font-bold text-gray-800">Grátis</span>
            </div>
            <button className="w-full py-1 px-2 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              Convide um amigo <span className="text-blue-500">+400</span>
            </button>
          </div>

          {/* Header Premium (Agora focado no mensal 19/mês) */}
          <div className="bg-[#edf2ff] rounded-t-3xl border-t border-l border-r border-blue-100 p-6 text-center relative shadow-[0_-10px_30px_-5px_rgba(59,130,246,0.08)]">
            <div className="absolute -top-10 left-0 right-0 py-2 bg-[#dbeafe] rounded-t-xl text-[10px] font-bold text-blue-600 uppercase tracking-widest border-t border-l border-r border-blue-100">
              Aulas!
            </div>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center mx-auto mb-4">
               <i className="fas fa-crown text-yellow-500"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Premium</h3>
            
            <div className="flex items-center justify-center gap-2 mb-4">
               <div 
                 onClick={() => setIsAnnual(!isAnnual)}
                 className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${isAnnual ? 'bg-blue-500' : 'bg-gray-300'}`}
               >
                 <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${isAnnual ? 'translate-x-5' : ''}`}></div>
               </div>
               <span className="text-[9px] font-bold text-gray-500">{isAnnual ? 'Plano Anual' : 'Plano Mensal'}</span>
            </div>

            <div className="mb-6">
              {isAnnual ? (
                <div className="flex flex-col items-center">
                  <p className="text-gray-300 line-through text-xs font-bold decoration-gray-300/50">R$ 228,00</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-lg font-black text-gray-800">R$ 149</span>
                    <span className="text-xs font-bold text-gray-800 mt-1">/anual</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-gray-300 line-through text-xs font-bold decoration-gray-300/50">R$ 29,90</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-lg font-black text-gray-800">R$ 19</span>
                    <span className="text-xs font-bold text-gray-800 mt-1">/mês</span>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full scale-[0.6] origin-center -my-3">
               <stripe-buy-button
                 buy-button-id={isAnnual ? "buy_btn_1T1XY9By5CbLzFagshLEWdq8" : "buy_btn_1T1XDDBy5CbLzFag5JzCkL0A"}
                 publishable-key="pk_test_51SziEQBy5CbLzFagbv31DKFG4kfqkI6bosfSMyxcQf58dkwUE4S5MysqJLHXkz0DYAVVw64jAaXKHrzgF2pjTOwP00QIefM5G8"
               >
               </stripe-buy-button>
            </div>
          </div>

          {/* Header Semestral */}
          <div className="bg-white rounded-t-3xl border-t border-l border-r border-gray-100 p-6 text-center shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.02)]">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
               <i className="fas fa-calendar-alt text-blue-600"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-6">Semestral</h3>
            <div className="mb-6">
              <div className="flex flex-col items-center">
                <p className="text-gray-300 line-through text-xs font-bold decoration-gray-300/50">R$ 114,00</p>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-lg font-black text-gray-800">R$ 59</span>
                  <span className="text-xs font-bold text-gray-800 mt-1">/semestre</span>
                </div>
              </div>
            </div>
            <div className="w-full scale-[0.6] origin-center -my-3">
               <stripe-buy-button
                 buy-button-id="buy_btn_1T1Y7qBy5CbLzFagVAKcllxm"
                 publishable-key="pk_test_51SziEQBy5CbLzFagbv31DKFG4kfqkI6bosfSMyxcQf58dkwUE4S5MysqJLHXkz0DYAVVw64jAaXKHrzgF2pjTOwP00QIefM5G8"
               >
               </stripe-buy-button>
            </div>
          </div>
        </div>

        {/* Tabela de Features */}
        <div className="bg-white border-l border-r border-b border-gray-100 rounded-b-3xl shadow-sm overflow-hidden">
          {features.map((feature, idx) => (
            <div key={idx} className={`grid grid-cols-4 items-center border-t border-gray-50 ${idx === features.length - 1 ? 'rounded-b-3xl' : ''}`}>
              <div className="p-4 pl-8">
                <p className="text-xs font-bold text-gray-700">{feature.name}</p>
                {feature.sub && <p className="text-[9px] text-gray-400 mt-0.5">{feature.sub}</p>}
              </div>
              <div className="p-4 text-center border-l border-gray-50">
                {renderIcon(feature.basico)}
              </div>
              <div className="p-4 text-center bg-[#f5f8ff] border-l border-blue-50 h-full flex items-center justify-center">
                {renderIcon(feature.premium)}
              </div>
              <div className="p-4 text-center border-l border-gray-50">
                {renderIcon(feature.semestral)}
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé Seguro */}
        <div className="mt-12 flex flex-col items-center">
          <i className="fab fa-stripe text-4xl text-gray-300 opacity-50 mb-2"></i>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pagamentos Seguros Processados pelo Stripe</p>
        </div>
      </div>
    </div>
  );
};

export default Plans;