
import React from 'react';
import { ICONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user?: { name: string; role: string };
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-950">
      <header className="bg-slate-900 border-b border-white/5 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-2xl flex-none">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <ICONS.Code className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent tracking-tight">
              POLYGLOT GUILD
            </h1>
            <div className="flex items-center gap-3 mt-0.5">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Firebase Online</span>
              </div>
              <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Gemini-3-Flash Connected</span>
              </div>
            </div>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-white tracking-tight">{user.name}</p>
              <p className="text-[9px] text-indigo-400 uppercase tracking-widest font-black">{user.role}</p>
            </div>
            <button 
              onClick={onLogout}
              className="px-4 py-2 text-[10px] font-black text-slate-400 hover:text-red-400 transition-all uppercase tracking-widest border border-white/5 hover:border-red-500/50 rounded-lg"
            >
              Sign Out
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        {children}
      </main>

      <footer className="bg-slate-900 border-t border-white/5 py-3 px-6 text-center text-slate-600 text-[8px] uppercase font-black tracking-[0.2em] flex-none">
        &copy; {new Date().getFullYear()} POLYGLOT GUILD ACADEMY • INTERNAL SECURITY CLEARANCE REQUIRED
      </footer>
    </div>
  );
};

export default Layout;
