
import React, { useState, useEffect } from 'react';
import { AppView, User } from './types';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ToolPage from './pages/ToolPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    // Garantimos que o modo claro seja o padrão
    document.documentElement.classList.remove('dark');
  }, []);

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

  const handleLogout = () => {
    setUser(null);
    setView(AppView.LOGIN);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

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
            <ToolPage toolId={selectedToolId} onBack={handleGoHome} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
