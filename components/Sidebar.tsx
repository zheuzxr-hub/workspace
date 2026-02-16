
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
    <aside className="w-[260px] flex flex-col bg-white h-screen text-[#3c4043] border-r border-gray-200 shrink-0 overflow-hidden">
      <div className="p-4 mb-4">
        <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors group">
          <div className="flex items-center space-x-3">
             <div className="w-6 h-6 bg-brand-500 rounded-md flex items-center justify-center text-white text-[10px] font-black">WS</div>
             <span className="font-normal text-[15px] text-[#3c4043]">WS Workspace</span>
          </div>
          <i className="fas fa-chevron-down text-[10px] text-gray-400 group-hover:text-gray-600"></i>
        </button>
      </div>

      <div className="px-3 mb-2 flex-1 overflow-y-auto custom-scrollbar">
        <nav className="space-y-0.5">
          <button
            onClick={() => onNavigate(AppView.DASHBOARD)}
            className={`w-full flex items-center px-4 py-2.5 rounded-full text-[14px] transition-all font-medium ${
              currentView === AppView.DASHBOARD 
                ? 'bg-[#e8f0fe] text-[#1a73e8]' 
                : 'text-[#3c4043] hover:bg-gray-100'
            }`}
          >
            <i className="fas fa-house-chimney mr-4 text-[14px]"></i>
            Início
          </button>
          
          <button className="w-full flex items-center px-4 py-2.5 rounded-full text-[14px] text-[#3c4043] hover:bg-gray-100 font-medium">
            <i className="fas fa-compass mr-4 text-[14px]"></i>
            Galeria
          </button>
          
          <button className="w-full flex items-center px-4 py-2.5 rounded-full text-[14px] text-[#3c4043] hover:bg-gray-100 font-medium">
            <i className="fas fa-clock-rotate-left mr-4 text-[14px]"></i>
            Seus projetos
          </button>
          
          <div className="h-[1px] bg-gray-100 my-4 mx-4"></div>
          
          <button className="w-full flex items-center px-4 py-2.5 rounded-full text-[14px] text-[#3c4043] hover:bg-gray-100 font-medium">
            <i className="fas fa-circle-question mr-4 text-[14px]"></i>
            FAQ
          </button>
        </nav>
      </div>

      <div className="p-4 space-y-1 mt-auto border-t border-gray-100">
        <button className="w-full flex items-center space-x-4 px-4 py-2 text-[13px] text-[#3c4043] hover:bg-gray-100 rounded-full transition-all">
          <i className="fas fa-gear text-gray-400"></i>
          <span>Configurações</span>
        </button>
        
        <div className="flex items-center justify-between px-4 py-3 mt-2">
          <div className="flex items-center space-x-3 truncate">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name || 'Professor'}&background=e8f0fe&color=1a73e8&bold=true`} 
              className="w-6 h-6 rounded-full border border-gray-200" 
              alt="Avatar" 
            />
            <span className="truncate text-[12px] text-gray-500">{user?.email || 'usuario@email.com'}</span>
          </div>
        </div>

        <div className="px-2 pb-2">
          <button 
            onClick={() => onNavigate(AppView.PLANS)}
            className="w-full flex items-center justify-between bg-[#fef7e0] text-[#b06000] px-4 py-2 rounded-full text-[12px] font-bold hover:bg-[#feefc3] transition-all border border-[#fde293]"
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