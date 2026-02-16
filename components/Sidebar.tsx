
import React from 'react';
import { AppView, User } from '../types';

interface SidebarProps {
  currentView: AppView;
  user: User | null;
  onNavigate: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, user, onNavigate, onLogout }) => {
  const menuItems = [
    { icon: 'fa-rocket', label: 'Início', active: currentView === AppView.DASHBOARD, action: onNavigate },
    { icon: 'fa-images', label: 'Galeria', active: false },
    { icon: 'fa-th-large', label: 'Seus apps', active: false },
    { icon: 'fa-question-circle', label: 'Dúvidas (FAQ)', active: false },
  ];

  return (
    <aside className="w-[240px] flex flex-col bg-white border-r border-gray-200 h-screen transition-colors">
      <div className="p-4 flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-black font-bold text-lg google-font">WorkSpace AI</span>
          <i className="fas fa-chevron-down text-xs text-gray-400"></i>
        </div>
        <button className="text-gray-400 hover:text-black">
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className={`w-full flex items-center space-x-4 px-4 py-2 rounded-r-full text-sm font-semibold transition-all ${
              item.active 
                ? 'bg-brand-50 text-brand-600' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-black'
            }`}
          >
            <div className="w-5 flex justify-center">
              <i className={`fas ${item.icon}`}></i>
            </div>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 space-y-4">
        <button className="flex items-center space-x-4 px-4 py-2 text-sm text-gray-600 hover:text-black w-full transition-colors font-medium">
          <div className="w-5 flex justify-center">
             <i className="fas fa-cog"></i>
          </div>
          <span>Configurações</span>
        </button>

        <button 
          onClick={onLogout}
          className="flex items-center space-x-4 px-4 py-2 text-sm text-gray-600 hover:text-red-600 w-full transition-colors font-medium"
        >
          <div className="w-5 flex justify-center">
             <i className="fas fa-sign-out-alt"></i>
          </div>
          <span>Sair</span>
        </button>
        
        <div className="flex items-center space-x-3 px-4 py-1">
          <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-[10px] text-white font-bold">
            {user?.name.charAt(0)}
          </div>
          <span className="text-xs text-black font-semibold truncate flex-1">{user?.email}</span>
        </div>

        <div className="px-4 pb-2">
          <button className="btn-pill-yellow shadow-sm">
            <i className="fas fa-bolt"></i>
            <span>+{user?.credits || 0}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
