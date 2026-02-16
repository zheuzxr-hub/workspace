
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
    <header className="h-[64px] bg-[#f8f9fa] flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center">
        <button 
          onClick={onGoHome}
          className="w-10 h-10 text-gray-500 hover:text-gray-900 flex items-center justify-center hover:bg-gray-200 rounded-full transition-all"
        >
          <i className="fas fa-bars text-lg"></i>
        </button>
      </div>

      <div className="flex items-center">
        <button 
          onClick={onLogout}
          className="flex items-center space-x-2 text-gray-500 hover:text-red-600 hover:bg-gray-200 px-3 py-2 rounded-lg transition-all text-[13px] font-medium"
          title="Sair da conta"
        >
          <i className="fas fa-arrow-right-from-bracket text-sm"></i>
          <span className="hidden lg:inline">Sair</span>
        </button>
      </div>
    </header>
  );
};

export default Header;