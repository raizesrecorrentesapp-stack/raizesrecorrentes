
import React from 'react';
import { Screen } from '../types';
import { NAV_ITEMS, PRIMARY_BRONZE } from '../constants';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  isDark: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate, isDark }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white/80 dark:bg-[#0c0c0c]/90 backdrop-blur-2xl border-black/5 dark:border-white/5 z-50 transition-all pb-[var(--sab)] shadow-[0_-10px_40px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around h-20 sm:h-24 px-2 max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as Screen)}
              className={`flex flex-col items-center justify-center space-y-1 transition-all flex-1 h-full touch-manipulation select-none active:opacity-70 ${isActive ? 'text-[#C69372]' : 'text-black/20 dark:text-white/20'}`}
            >
              <div className={`p-2.5 sm:p-3 rounded-2xl transition-all duration-300 ${isActive ? 'bg-[#C69372]/10 scale-105 shadow-inner' : 'scale-100 hover:bg-black/5 dark:hover:bg-white/5'}`}>
                {React.cloneElement(item.icon as React.ReactElement, { 
                  size: 22,
                  strokeWidth: isActive ? 3 : 2
                })}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider leading-tight text-center transition-opacity duration-300 min-h-[1.2em] px-1 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
