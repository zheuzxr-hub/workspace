
import React from 'react';
import { AppView, User } from '../types';

interface SidebarProps {
  currentView: AppView;
  user: User | null;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, user, onNavigate, onLogout }) => {
  return (
    <aside className="w-[260px] flex flex-col bg-[#131314] h-screen text-[#e3e3e3] border-r border-[#3c4043]/30 shrink-0 overflow-hidden">
      <div className="p-4 mb-4">
        <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#2d2f31] rounded-lg transition-colors group">
          <div className="flex items-center space-x-3">
             <div className="w-6 h-6 bg-[#8ab4f8] rounded-md flex items-center justify-center text-[#131314] text-[10px] font-black">WS</div>
             <span className="font-normal text-[15px] text-[#e3e3e3]">WS Workspace</span>
          </div>
          <i className="fas fa-chevron-down text-[10px] text-[#9aa0a6] group-hover:text-white"></i>
        </button>
      </div>

      <div className="px-3 mb-2 flex-1 overflow-y-auto custom-scrollbar">
        <nav className="space-y-0.5">
          <button
            onClick={() => onNavigate(AppView.DASHBOARD)}
            className={`w-full flex items-center px-4 py-2.5 rounded-full text-[14px] transition-all font-medium ${
              currentView === AppView.DASHBOARD 
                ? 'bg-[#1a73e81a] text-[#8ab4f8]' 
                : 'text-[#e3e3e3] hover:bg-[#2d2f31]'
            }`}
          >
            <i className="fas fa-house-chimney mr-4 text-[14px]"></i>
            Início
          </button>
          
          <button className="w-full flex items-center px-4 py-2.5 rounded-full text-[14px] text-[#e3e3e3] hover:bg-[#2d2f31] font-medium">
            <i className="fas fa-compass mr-4 text-[14px]"></i>
            Galeria
          </button>
          
          <button className="w-full flex items-center px-4 py-2.5 rounded-full text-[14px] text-[#e3e3e3] hover:bg-[#2d2f31] font-medium">
            <i className="fas fa-clock-rotate-left mr-4 text-[14px]"></i>
            Seus projetos
          </button>
          
          <div className="h-[1px] bg-[#3c4043]/50 my-4 mx-4"></div>
          
          <button className="w-full flex items-center px-4 py-2.5 rounded-full text-[14px] text-[#e3e3e3] hover:bg-[#2d2f31] font-medium">
            <i className="fas fa-circle-question mr-4 text-[14px]"></i>
            FAQ
          </button>
        </nav>
      </div>

      <div className="p-4 space-y-1 mt-auto border-t border-[#3c4043]/30">
        <button className="w-full flex items-center space-x-4 px-4 py-2 text-[13px] text-[#e3e3e3] hover:bg-[#2d2f31] rounded-full transition-all">
          <i className="fas fa-gear text-[#9aa0a6]"></i>
          <span>Configurações</span>
        </button>
        
        <div className="flex items-center justify-between px-4 py-3 mt-2">
          <div className="flex items-center space-x-3 truncate">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name || 'Professor'}&background=8ab4f8&color=131314&bold=true`} 
              className="w-6 h-6 rounded-full border border-white/10" 
              alt="Avatar" 
            />
            <span className="truncate text-[12px] text-[#9aa0a6]">{user?.email || 'usuario@email.com'}</span>
          </div>
        </div>

        <div className="px-2 pb-2">
          <button 
            onClick={() => onNavigate(AppView.PLANS)}
            className="w-full flex items-center justify-between bg-[#f9ab0026] text-[#f9ab00] px-4 py-2 rounded-full text-[12px] font-bold hover:bg-[#f9ab003d] transition-all border border-[#f9ab0022]"
          >
            <div className="flex items-center space-x-3">
              <i className="fas fa-bolt-lightning text-[12px]"></i>
              <span>{user?.credits || 0} créditos</span>
            </div>
            <i className="fas fa-plus text-[9px] opacity-60"></i>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
