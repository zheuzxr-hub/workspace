
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
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setShowSuccessToast(true);
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => setShowSuccessToast(false), 8000);
    }

    const initAuth = async () => {
      if (!isConfigured) {
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchProfile(session.user.id, session.user.email || '');
        setView(AppView.DASHBOARD);
      }
      setLoading(false);
    };

    initAuth();

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
          name: data.full_name || email.split('@')[0],
          email: email,
          credits: data.credits ?? 100
        });
      }
    } catch (e) { console.error(e); }
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
    if (isConfigured) await supabase.auth.signOut();
    setUser(null);
    setView(AppView.LOGIN);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (view === AppView.LOGIN) {
    return <Login onLogin={handleLogin} isDarkMode={isDarkMode} />;
  }

  return (
    <div className="h-screen w-screen flex text-[#3c4043] overflow-hidden bg-[#f8f9fa]">
      {showSuccessToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-4">
          <p className="text-xs font-black uppercase tracking-widest">Pagamento Aprovado!</p>
        </div>
      )}

      <div className={`${isSidebarVisible ? 'w-[240px]' : 'w-0'} transition-all duration-300 overflow-hidden shrink-0 border-r border-gray-200 bg-white`}>
        <Sidebar currentView={view} user={user} onNavigate={handleNavigate} onLogout={handleLogout} />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa]">
        <Header 
          user={user} 
          isDarkMode={isDarkMode} 
          onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
          onGoHome={() => setIsSidebarVisible(!isSidebarVisible)} 
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {view === AppView.DASHBOARD && <Dashboard onSelectTool={handleSelectTool} userEmail={user?.email} />}
          {view === AppView.PLANS && <Plans userEmail={user?.email} onClose={() => setView(AppView.DASHBOARD)} />}
          {view === AppView.TOOL_VIEW && selectedToolId && <ToolPage toolId={selectedToolId} onBack={handleGoHome} user={user} />}
        </main>
      </div>
    </div>
  );
};

export default App;