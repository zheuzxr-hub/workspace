
import React, { useState, useRef } from 'react';
import { User, Plan } from '../types';
import { supabase, isConfigured } from '../services/supabaseClient';

const COMPARISON_FEATURES = [
  { name: '70+ Ferramentas IA', sub: 'Slides, mapas mentais...', basico: '~100 créditos', premium: '∞ ilimitado', semestral: '∞ ilimitado' },
  { name: 'Avaliação', sub: '', basico: 'check', premium: 'check', semestral: 'check' },
  { name: 'Correção', sub: 'por questão ou redação', basico: 'dash', premium: 'check', semestral: 'check' },
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen text-white flex flex-col font-sans bg-[#0f1115] overflow-y-auto custom-scrollbar">
      
      {/* Header seguindo a Imagem 1 */}
      <header className="relative z-10 flex items-center justify-between px-10 py-8 shrink-0">
        <div className="flex items-center">
          <span className="text-xl font-black tracking-tighter uppercase">ws</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-md text-[9px] font-bold text-yellow-500 uppercase tracking-widest flex items-center">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Modo de Demonstração
          </div>
          <button className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[9px] font-black hover:bg-white/10 transition-all uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            <span>WS TV</span>
          </button>
          <button className="text-white/40 hover:text-white transition-colors"><i className="fas fa-search text-xs"></i></button>
          <button className="text-white/40 hover:text-white transition-colors"><i className="fas fa-bars text-xs"></i></button>
        </div>
      </header>

      {/* Hero Section - Exatamente como na Imagem 1 */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="mb-10 flex flex-col items-center">
          <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter select-none">WS</h1>
          <p className="text-[10px] tracking-[1em] font-black text-white/40 uppercase -mt-2 ml-[1em]">W O R K S P A C E</p>
        </div>

        <h2 className="text-xl md:text-2xl font-medium max-w-2xl leading-relaxed mb-16 text-white/80">
          O futuro da produtividade docente<br />
          começa com o <span className="font-bold">workspace</span>
        </h2>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="border border-white/20 px-14 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500"
        >
          Crie com o Workspace
        </button>

        <div className="mt-32 flex flex-col items-center space-y-2 opacity-30 text-[9px] font-bold uppercase tracking-[0.3em]">
           <p>Conheça as <span className="underline">Assinaturas de Planos com IA do Google</span>. Veja as <span className="underline">Perguntas Frequentes</span>.</p>
           <p className="mt-8 animate-pulse">Scroll to explore</p>
        </div>
      </main>

      {/* Modal de Login */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-[400px] bg-[#1a1d23] border border-white/5 rounded-3xl p-10 shadow-2xl animate-in zoom-in-95">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-10">
                <h3 className="text-lg font-black uppercase tracking-widest mb-1">Acessar Workspace</h3>
                <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Login de Professor</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">E-mail</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0f1115] border border-white/5 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-white/20" placeholder="nome@escola.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Senha</label>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0f1115] border border-white/5 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-white/20" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-white text-black font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all">
                {loading ? 'Acessando...' : 'Acessar Workspace'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
