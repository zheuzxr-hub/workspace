
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  isDarkMode: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isDarkMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('professor@exemplo.com');
  const [password, setPassword] = useState('123456');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: 'Prof. Anderson Silva',
      email: email,
      credits: 100
    });
  };

  return (
    <div className="relative min-h-screen w-screen text-black overflow-hidden flex flex-col font-['Inter']">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f1f5f9] via-[#f8fafc] to-[#ffffff] opacity-90"></div>

      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center">
          <span className="text-2xl font-black tracking-tighter text-brand-600">ws</span>
        </div>
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 border border-slate-200 bg-white px-4 py-1.5 rounded-full text-[9px] font-black hover:bg-slate-50 transition-all uppercase tracking-widest text-slate-700 shadow-sm">
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full"></span>
            <span>WS TV</span>
          </button>
          <button className="text-slate-400 hover:text-brand-600 transition-colors">
            <i className="fas fa-search text-xs"></i>
          </button>
          <button className="text-slate-400 hover:text-brand-600 transition-colors">
            <i className="fas fa-bars text-xs"></i>
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="mb-8 animate-in fade-in zoom-in duration-700">
          <h1 className="text-[100px] md:text-[140px] font-black leading-none tracking-tighter mb-0 select-none text-slate-900">WS</h1>
          <p className="text-[9px] tracking-[0.5em] font-black text-brand-500 -mt-2 uppercase">W O R K S P A C E</p>
        </div>

        <h2 className="text-xl md:text-2xl font-medium max-w-xl leading-tight mb-12 text-slate-600">
          Eficiência e inovação para o<br />
          seu cotidiano <span className="font-black text-slate-900">docente</span>
        </h2>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="group relative border border-brand-500 px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all duration-300 shadow-lg shadow-brand-500/10"
        >
          <span className="relative z-10">Acesse o Workspace</span>
        </button>

        <div className="mt-20 space-y-4 animate-in fade-in duration-1000 delay-500">
          <p className="text-[8px] font-black tracking-widest text-slate-400 uppercase">
            DESCUBRA O <button className="text-brand-600 hover:underline">PLANO ACADÊMICO</button> • <button className="text-brand-600 hover:underline">FAQ</button>
          </p>
          <div className="flex flex-col items-center space-y-2 pt-4">
             <i className="fas fa-chevron-down text-[10px] text-brand-400 animate-bounce"></i>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-sm bg-white border border-slate-100 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-300 hover:text-brand-600 transition-colors">
              <i className="fas fa-times"></i>
            </button>

            <div className="mb-8 text-center">
               <div className="inline-flex items-center justify-center w-10 h-10 bg-brand-500 text-white rounded-lg font-black text-lg mb-4 shadow-lg shadow-brand-500/10">ws</div>
               <h3 className="text-xl font-black tracking-tight text-slate-900">Bem-vindo</h3>
               <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">Entre com seu acesso institucional</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">E-mail corporativo</label>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:border-brand-500 transition-all text-xs font-bold text-slate-800"
                  placeholder="nome@escola.com"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Senha</label>
                </div>
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:border-brand-500 transition-all text-xs font-bold text-slate-800"
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-500 text-white font-black py-4 rounded-xl hover:bg-brand-600 transition-all shadow-md text-xs uppercase tracking-[0.2em] mt-2"
              >
                Entrar
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Precisa de ajuda? <button className="text-brand-600 hover:underline">Suporte</button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
