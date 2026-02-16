
import React, { useState, useEffect } from 'react';
import { AppView, User } from './types';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ToolPage from './pages/ToolPage';
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

  useEffect(() => {
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
        setView(AppView.DASHBOARD);
      } else {
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert([{ id: userId, full_name: 'Professor', credits: 100 }])
          .select()
          .single();
        
        if (newProfile) {
          setUser({
            id: userId,
            name: newProfile.full_name,
            email: email,
            credits: newProfile.credits
          });
        }
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
      <div className={`${isSidebarVisible ? 'w-[240px]' : 'w-0'} transition-all duration-300 overflow-hidden shrink-0 border-r border-gray-200 bg-white/50 backdrop-blur-md`}>
        <Sidebar 
          currentView={view} 
          user={user}
          onNavigate={handleGoHome} 
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
            <Dashboard onSelectTool={handleSelectTool} />
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
