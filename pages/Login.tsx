
import React, { useState } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabaseClient';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // Tentativa de Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Se falhar e for erro de credenciais inválidas, tentamos o SignUp (Fluxo simplificado para este app)
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
      if (err.message === 'Failed to fetch') {
        setErrorMsg('Erro de conexão: Verifique a configuração do Supabase.');
      } else {
        setErrorMsg(err.message || 'Erro ao autenticar');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-screen text-white overflow-hidden flex flex-col font-['Inter'] bg-[#0f1115]">
      {/* Background Gradient / Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#0f1115_70%)] opacity-80"></div>

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
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

      {/* Central Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="mb-8 animate-in fade-in zoom-in duration-1000">
          <h1 className="text-[120px] md:text-[160px] font-black leading-none tracking-tighter mb-0 select-none text-white">WS</h1>
          <p className="text-[10px] tracking-[0.8em] font-black text-white/50 -mt-4 uppercase ml-[0.8em]">W O R K S P A C E</p>
        </div>

        <h2 className="text-xl md:text-2xl font-medium max-w-xl leading-tight mb-12 text-white/80">
          O futuro da produtividade docente<br />
          começa com o <span className="font-bold">workspace</span>
        </h2>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="group relative border border-white/20 px-12 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500"
        >
          <span className="relative z-10">Crie com o Workspace</span>
        </button>

        <div className="mt-24 space-y-4 animate-in fade-in duration-1000 delay-500">
          <p className="text-[9px] font-black tracking-widest text-white/30 uppercase">
            CONHEÇA AS <button className="text-white/60 hover:text-white underline underline-offset-4 decoration-white/20">ASSINATURAS DE PLANOS COM IA DO GOOGLE</button>. VEJA AS <button className="text-white/60 hover:text-white underline underline-offset-4 decoration-white/20">PERGUNTAS FREQUENTES</button>.
          </p>
          <div className="flex flex-col items-center space-y-2 pt-6">
             <span className="text-[8px] font-black text-white/20 tracking-[0.3em] uppercase">Scroll to explore</span>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={() => !loading && setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-sm bg-[#1a1d23] border border-white/5 rounded-3xl p-10 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors">
              <i className="fas fa-times"></i>
            </button>

            <div className="mb-10 text-center">
               <div className="inline-flex items-center justify-center w-12 h-12 bg-white text-black rounded-xl font-black text-xl mb-6">ws</div>
               <h3 className="text-2xl font-black tracking-tight text-white">Bem-vindo</h3>
               <p className="text-xs text-white/40 mt-1 font-medium tracking-wide">Entre com seu e-mail de docente</p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold uppercase tracking-wider text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">E-mail corporativo</label>
                <input 
                  required
                  disabled={loading}
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white/30 transition-all text-sm font-bold text-white disabled:opacity-50"
                  placeholder="nome@escola.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Senha</label>
                <input 
                  required
                  disabled={loading}
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white/30 transition-all text-sm font-bold text-white disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-white/90 transition-all shadow-lg text-xs uppercase tracking-[0.2em] mt-4 flex items-center justify-center space-x-3 disabled:opacity-50"
              >
                {loading && <i className="fas fa-spinner fa-spin"></i>}
                <span>{loading ? 'Acessando...' : 'Entrar / Criar conta'}</span>
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                Precisa de ajuda? <button className="text-white/40 hover:text-white">Suporte</button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
