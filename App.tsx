
import React, { useState, useEffect } from 'react';
import { AppView, User } from './types';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ToolPage from './pages/ToolPage';
import Plans from './pages/Plans';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { supabase, isConfigured } from './services/supabaseClient';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    // Lógica para detectar se o usuário voltou de um pagamento bem-sucedido no Stripe
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setShowSuccessToast(true);
      // Limpa os parâmetros da URL para evitar que a mensagem reapareça no refresh
      window.history.replaceState({}, document.title, window.location.pathname);
      // Esconde o aviso após 8 segundos
      setTimeout(() => setShowSuccessToast(false), 8000);
    }

    const checkUser = async () => {
      if (!isConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
          await fetchProfile(session.user.id, session.user.email || '');
        }
      } catch (e) {
        console.warn("Supabase connection skipped or failed:", e);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    if (isConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
          await fetchProfile(session.user.id, session.user.email || '');
          setView(AppView.DASHBOARD);
        } else {
          setUser(null);
          setView(AppView.LOGIN);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    if (!isConfigured) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setUser({
          id: userId,
          name: data.full_name || 'Professor',
          email: email,
          credits: data.credits || 0
        });
      }
    } catch (e) {
      console.error("Error loading profile:", e);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setView(AppView.DASHBOARD);
  };

  const handleSelectTool = (id: string) => {
    setSelectedToolId(id);
    setView(AppView.TOOL_VIEW);
  };

  const handleNavigate = (newView: AppView) => {
    setSelectedToolId(null);
    setView(newView);
  };

  const handleGoHome = () => {
    setSelectedToolId(null);
    setView(AppView.DASHBOARD);
  };

  const handleLogout = async () => {
    if (isConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error(e);
      }
    }
    setUser(null);
    setView(AppView.LOGIN);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0f1115] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin mb-4"></div>
          <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Iniciando Workspace</span>
        </div>
      </div>
    );
  }

  if (view === AppView.LOGIN) {
    return <Login onLogin={handleLogin} isDarkMode={isDarkMode} />;
  }

  return (
    <div className="h-screen w-screen flex text-black overflow-hidden bg-transparent">
      {/* Notificação de Sucesso de Pagamento */}
      {showSuccessToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-4 animate-in slide-in-from-top-4 duration-500 border border-green-400">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <i className="fas fa-check text-sm"></i>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">Pagamento Aprovado!</p>
            <p className="text-[10px] opacity-90 font-bold">Seus recursos premium já estão liberados.</p>
          </div>
        </div>
      )}

      <div className={`${isSidebarVisible ? 'w-[240px]' : 'w-0'} transition-all duration-300 overflow-hidden shrink-0 border-r border-gray-200 bg-white/50 backdrop-blur-md`}>
        <Sidebar 
          currentView={view} 
          user={user}
          onNavigate={handleNavigate} 
          onLogout={handleLogout} 
        />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          user={user} 
          isDarkMode={isDarkMode} 
          onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
          onGoHome={toggleSidebar} 
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {view === AppView.DASHBOARD && (
            <Dashboard onSelectTool={handleSelectTool} userEmail={user?.email} />
          )}
          {view === AppView.PLANS && (
            <Plans userEmail={user?.email} />
          )}
          {view === AppView.TOOL_VIEW && selectedToolId && (
            <ToolPage toolId={selectedToolId} onBack={handleGoHome} user={user} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
