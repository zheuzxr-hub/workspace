
import React from 'react';
import { AppView, User } from '../types';

interface SidebarProps {
  currentView: AppView;
  user: User | null;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, user, onNavigate, onLogout }) => {
  const menuItems = [
    { icon: 'fa-rocket', label: 'Início', active: currentView === AppView.DASHBOARD, view: AppView.DASHBOARD },
    { icon: 'fa-images', label: 'Galeria', active: false, view: AppView.DASHBOARD },
    { icon: 'fa-th-large', label: 'Seus apps', active: false, view: AppView.DASHBOARD },
    { icon: 'fa-question-circle', label: 'Dúvidas (FAQ)', active: false, view: AppView.DASHBOARD },
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
            onClick={() => onNavigate(item.view)}
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
        <div className="flex items-center space-x-3 px-4 py-1">
          <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-[10px] text-white font-bold">
            {user?.name.charAt(0)}
          </div>
          <span className="text-xs text-black font-semibold truncate flex-1">{user?.email}</span>
        </div>

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

        <div className="px-4 pb-2 flex flex-col space-y-2">
          <button 
            onClick={() => onNavigate(AppView.PLANS)}
            className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              currentView === AppView.PLANS 
                ? 'bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-500/20' 
                : 'bg-white border-gray-200 text-gray-500 hover:border-brand-500 hover:text-brand-600'
            }`}
          >
            <i className="fas fa-credit-card"></i>
            <span>Planos</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
