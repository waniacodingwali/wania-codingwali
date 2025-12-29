
import React from 'react';
import { Video, LogIn, User as UserIcon, LogOut, ChevronRight } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onOpenAuth, onLogout }) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#0b0f1a]/80 backdrop-blur-xl sticky top-0 z-[100]">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              SubGen <span className="text-indigo-400">AI</span>
            </h1>
          </div>
        </div>
        
        <nav className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-slate-300">{user.name}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={onOpenAuth}
                className="text-xs font-bold text-slate-400 hover:text-white px-4 py-2 transition-colors"
              >
                Login
              </button>
              <button 
                onClick={onOpenAuth}
                className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
              >
                Sign Up
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
