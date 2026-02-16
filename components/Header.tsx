
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onGoHome: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, isDarkMode, onToggleTheme, onGoHome, onLogout }) => {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onGoHome}
          className="bg-gray-100 border border-gray-200 text-black px-4 py-1.5 rounded-md text-xs font-bold flex items-center space-x-2 hover:bg-gray-200 transition-all"
        >
          <i className="fas fa-bars text-[10px]"></i>
          <span>Menu</span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-1.5 space-x-4">
          <div className="flex items-center space-x-2">
             <i className="fas fa-microchip text-brand-500 text-xs"></i>
             <span className="text-xs text-gray-600 font-medium">Modelo:</span>
             <span className="text-xs text-black font-bold">Gemini 3 Flash Preview</span>
          </div>
          <i className="fas fa-chevron-down text-[10px] text-gray-400"></i>
        </div>

        <button className="btn-pill-yellow shadow-sm h-8">
          <i className="fas fa-bolt"></i>
          <span>+{user?.credits || 0}</span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 text-gray-500">
          <button className="hover:text-black" title="Microfone"><i className="fas fa-microphone"></i></button>
          <button className="hover:text-black" title="Novo"><i className="fas fa-plus-circle"></i></button>
        </div>
      </div>
    </header>
  );
};

export default Header;
