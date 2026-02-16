import React, { useState, useRef } from 'react';
import { User, Plan } from '../types';
import { supabase, isConfigured } from '../services/supabaseClient';
import { handleStripeCheckout } from '../services/stripeService';

const PLANS: Plan[] = [
  {
    id: 'basico',
    name: 'Plano Gratuito',
    price: 'R$0',
    period: '',
    stripePriceId: 'price_basico',
    features: ['100 Créditos mensais', 'IA Gemini 3 Flash', 'Exportação PDF/JPEG', 'Suporte via e-mail']
  },
  {
    id: 'start',
    name: 'Start',
    price: 'R$19',
    period: '/mês',
    stripePriceId: 'buy_btn_1T1XDDBy5CbLzFag5JzCkL0A',
    highlight: true,
    features: ['Créditos Ilimitados*', 'IA Gemini 3 Pro', 'Exportação PPTX/PDF', 'Acesso à Galeria Premium', 'Suporte Prioritário']
  },
  {
    id: 'premium',
    name: 'Start Premium',
    price: 'R$149',
    period: '/anual',
    stripePriceId: 'buy_btn_1T1XY9By5CbLzFagshLEWdq8',
    features: ['Tudo do Plano Start', 'Criação de Imagens IA', 'Multi-usuário (Escola)', 'Treinamento Individual', 'Consultoria BNCC']
  }
];

const COMPARISON_FEATURES = [
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

interface LoginProps {
  onLogin: (user: User) => void;
  isDarkMode: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isDarkMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  
  const plansRef = useRef<HTMLDivElement>(null);

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderIcon = (type: string) => {
    if (type === 'check') return <i className="fas fa-check text-blue-500 text-sm"></i>;
    if (type === 'dash') return <span className="text-gray-300">—</span>;
    if (type.includes('ilimitado')) return <span className="text-blue-600 font-bold text-[10px]">{type}</span>;
    return <span className="text-gray-500 font-medium text-[10px]">{type}</span>;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!isConfigured) {
      setTimeout(() => {
        onLogin({
          id: 'guest-user',
          name: 'Professor Convidado',
          email: email || 'convidado@workspace.ai',
          credits: 100
        });
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });
          
          if (signUpError) throw signUpError;
          if (signUpData.user) {
            alert('Conta criada com sucesso! Verifique seu e-mail se necessário.');
          }
        } else {
          throw error;
        }
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setErrorMsg(err.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen text-white flex flex-col font-['Inter'] bg-[#0f1115] overflow-y-auto custom-scrollbar snap-y snap-mandatory">
      
      {/* Background Gradient */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#0f1115_70%)] opacity-80 pointer-events-none z-0"></div>

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 shrink-0">
        <div className="flex items-center">
          <span className="text-xl font-black tracking-tighter">ws</span>
        </div>
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-3 border border-white/10 bg-white/5 px-4 py-1.5 rounded-full text-[9px] font-black hover:bg-white/10 transition-all uppercase tracking-widest text-white shadow-sm">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            <span>WS TV</span>
          </button>
          <button className="text-white/40 hover:text-white transition-colors">
            <i className="fas fa-search text-xs"></i>
          </button>
          <button className="text-white/40 hover:text-white transition-colors">
            <i className="fas fa-bars text-xs"></i>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 h-screen shrink-0 flex flex-col items-center justify-center text-center px-4 snap-start">
        <div className="mb-12 animate-in fade-in zoom-in duration-1000">
          <h1 className="text-[100px] md:text-[130px] font-black leading-none tracking-normal mb-0 select-none text-white">WS</h1>
          <p className="text-[8px] tracking-[0.8em] font-black text-white/50 mt-6 uppercase ml-[0.8em]">W O R K S P A C E</p>
        </div>

        <h2 className="text-lg md:text-xl font-medium max-w-xl leading-loose mb-20 text-white/80">
          O futuro da produtividade docente<br />
          começa com o <span className="font-bold">workspace</span>
        </h2>

        <div className="flex flex-col items-center space-y-12">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative border border-white/20 px-12 py-3.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500"
          >
            <span className="relative z-10">Crie com o Workspace</span>
          </button>

          <button 
            onClick={scrollToPlans}
            className="mt-24 animate-bounce flex flex-col items-center space-y-2 text-white/30 hover:text-white/60 transition-colors"
          >
            <p className="text-[8px] font-black tracking-[0.3em] uppercase">Conheça os Planos</p>
            <i className="fas fa-chevron-down text-sm"></i>
          </button>
        </div>
      </main>

      {/* Plans Section */}
      <section ref={plansRef} className="relative z-10 bg-[#f8faff] py-[600px] px-6 snap-start min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-[1000px] w-full">
          <div className="text-center mb-24">
            <span className="text-blue-600 font-black text-[9px] uppercase tracking-[0.3em] mb-4 block">Comparativo de Acesso</span>
            <h2 className="text-3xl font-black text-black tracking-tight">Potência ideal para sua rotina</h2>
          </div>

          <div className="grid grid-cols-4 gap-0 items-end">
            <div className="p-4"></div>

            {/* Básico */}
            <div className="bg-white rounded-t-3xl border-t border-l border-r border-gray-100 p-6 text-center shadow-sm">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-file-alt text-blue-400"></i>
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-4">Básico</h3>
              <div className="mb-6">
                <span className="text-xl font-black text-gray-800">Grátis</span>
              </div>
              <button className="w-full py-1 px-2 bg-white border border-gray-100 rounded-full text-[9px] font-bold text-gray-500 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                Convide um amigo <span className="text-blue-500">+400</span>
              </button>
            </div>

            {/* Premium (Toggle 19 Mensal / 149 Anual) */}
            <div className="bg-[#edf2ff] rounded-t-3xl border-t border-l border-r border-blue-100 p-6 text-center relative shadow-lg">
              <div className="absolute -top-10 left-0 right-0 py-2 bg-[#dbeafe] rounded-t-xl text-[9px] font-black text-blue-600 uppercase tracking-widest border-t border-l border-r border-blue-100">
                Aulas!
              </div>
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-crown text-yellow-500"></i>
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-3">Premium</h3>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <div onClick={() => setIsAnnual(!isAnnual)} className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${isAnnual ? 'bg-blue-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${isAnnual ? 'translate-x-4' : ''}`}></div>
                </div>
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{isAnnual ? 'Anual' : 'Mensal'}</span>
              </div>

              <div className="mb-6 h-12 flex flex-col items-center justify-center">
                {isAnnual ? (
                  <>
                    <p className="text-gray-300 line-through text-[10px] font-bold decoration-gray-300/50">R$ 228,00</p>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xl font-black text-gray-800">R$ 149</span>
                      <span className="text-[10px] font-bold text-gray-800 mt-1">/anual</span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-300 line-through text-[10px] font-bold decoration-gray-300/50">R$ 29,90</p>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xl font-black text-gray-800">R$ 19</span>
                      <span className="text-[10px] font-bold text-gray-800 mt-1">,90 /mês</span>
                    </div>
                  </>
                )}
              </div>

              <div className="w-full scale-[0.55] origin-center -my-4">
                <stripe-buy-button
                  buy-button-id={isAnnual ? "buy_btn_1T1XY9By5CbLzFagshLEWdq8" : "buy_btn_1T1XDDBy5CbLzFag5JzCkL0A"}
                  publishable-key="pk_test_51SziEQBy5CbLzFagbv31DKFG4kfqkI6bosfSMyxcQf58dkwUE4S5MysqJLHXkz0DYAVVw64jAaXKHrzgF2pjTOwP00QIefM5G8"
                >
                </stripe-buy-button>
              </div>
            </div>

            {/* Semestral (59) */}
            <div className="bg-white rounded-t-3xl border-t border-l border-r border-gray-100 p-6 text-center shadow-sm">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-calendar-alt text-blue-600"></i>
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-6">Semestral</h3>
              <div className="mb-6">
                <div className="flex flex-col items-center">
                  <p className="text-gray-300 line-through text-[10px] font-bold decoration-gray-300/50">R$ 114,00</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xl font-black text-gray-800">R$ 59</span>
                    <span className="text-[10px] font-bold text-gray-800 mt-1">/semestre</span>
                  </div>
                </div>
              </div>
              <div className="w-full scale-[0.55] origin-center -my-4">
                <stripe-buy-button
                  buy-button-id="buy_btn_1T1Y7qBy5CbLzFagVAKcllxm"
                  publishable-key="pk_test_51SziEQBy5CbLzFagbv31DKFG4kfqkI6bosfSMyxcQf58dkwUE4S5MysqJLHXkz0DYAVVw64jAaXKHrzgF2pjTOwP00QIefM5G8"
                >
                </stripe-buy-button>
              </div>
            </div>
          </div>

          <div className="bg-white border-l border-r border-b border-gray-100 rounded-b-3xl shadow-sm overflow-hidden">
            {COMPARISON_FEATURES.map((feature, idx) => (
              <div key={idx} className={`grid grid-cols-4 items-center border-t border-gray-50 ${idx === COMPARISON_FEATURES.length - 1 ? 'rounded-b-3xl' : ''}`}>
                <div className="p-4 pl-8">
                  <p className="text-[11px] font-bold text-gray-700">{feature.name}</p>
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

          <div className="mt-16 flex flex-col items-center">
            <i className="fab fa-stripe text-3xl text-gray-300 opacity-50 mb-4"></i>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pagamentos seguros processados pelo Stripe</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#0f1115] py-24 px-8 border-t border-white/5 shrink-0 snap-start">
        <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
          <span className="text-sm font-black tracking-tighter text-white/40">ws workspace</span>
          <div className="flex space-x-12">
            <button className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Privacidade</button>
            <button className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Termos</button>
            <button className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Suporte</button>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">© 2025 WS WORKSPACE</p>
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] transition-opacity" onClick={() => !loading && setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-[400px] animate-in slide-in-from-bottom-8 fade-in duration-500">
            {errorMsg && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-[10px] font-bold uppercase tracking-wider text-center">
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-8 bg-[#1e2329] p-8 rounded-3xl shadow-2xl border border-white/5">
              <div className="text-center mb-8">
                <h3 className="text-lg font-black uppercase tracking-widest">Acessar Workspace</h3>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Ambiente do Professor</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block ml-1">E-mail Corporativo</label>
                <input required disabled={loading} type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0f1115] border border-white/5 rounded-lg px-5 py-4 outline-none focus:border-white/20 transition-all text-sm font-bold text-white disabled:opacity-50" placeholder="nome@escola.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block ml-1">Senha</label>
                <input required disabled={loading} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0f1115] border border-white/5 rounded-lg px-5 py-4 outline-none focus:border-white/20 transition-all text-sm font-bold text-white disabled:opacity-50" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-gray-100 transition-all shadow-xl text-[10px] uppercase tracking-[0.2em] mt-4 flex items-center justify-center space-x-3 disabled:opacity-50">
                {loading && <i className="fas fa-spinner fa-spin"></i>}
                <span>{loading ? 'ACESSANDO...' : 'ACESSAR AGORA'}</span>
              </button>
            </form>
            <button onClick={() => setIsModalOpen(false)} className="mt-8 w-full text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white/60 transition-colors">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;