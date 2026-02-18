
import React from 'react';
import { Bell, ChevronLeft, Info, Calendar as CalendarIcon, Target } from 'lucide-react';
import { Screen } from '../types';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  isDark: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate, isDark }) => {
  const getTitle = () => {
    switch (currentScreen) {
      case 'dashboard': return 'Início';
      case 'ativos': return 'Meus Clientes';
      case 'client-detail': return 'Perfil da Cliente';
      case 'agenda': return 'Agenda IA';
      case 'servicos': return 'Serviços';
      case 'financeiro': return 'Margem Real';
      case 'estoque': return 'Gestão de Estoque';
      case 'recorrencia': return 'Retenção IA';
      case 'metas': return 'Minhas Metas';
      case 'mais': return 'Mais';
      case 'ajustes': return 'Ajustes';
      case 'alertas': return 'Alertas';
      case 'previsao': return 'Previsão';
      case 'ai-analysis': return 'Raízes Recorrentes';
      default: return 'Raízes Recorrentes';
    }
  };

  const showBack = ['alertas', 'previsao', 'ai-analysis', 'client-detail', 'servicos', 'estoque', 'recorrencia', 'metas', 'ajustes'].includes(currentScreen);

  const handleBack = () => {
    if (currentScreen === 'client-detail') {
      onNavigate('ativos');
    } else if (['servicos', 'estoque', 'recorrencia', 'metas', 'ajustes'].includes(currentScreen)) {
      onNavigate('mais');
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-[60] pt-safe bg-white/90 dark:bg-[#0c0c0c]/90 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
      <div className="h-16 px-5 flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-3">
          {showBack ? (
            <button 
              onClick={handleBack} 
              className="p-2 -ml-2 active:scale-90 transition-transform touch-manipulation"
              aria-label="Voltar"
            >
              <ChevronLeft size={24} className="text-[#C69372]" />
            </button>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 overflow-hidden ring-1 ring-black/10 dark:ring-white/10 shrink-0">
               <img src="https://picsum.photos/seed/user/100" alt="Avatar" className="w-full h-full object-cover grayscale brightness-125" />
            </div>
          )}
          <h1 className="font-black text-xl tracking-tighter text-black dark:text-white truncate">{getTitle()}</h1>
        </div>

        <div className="flex items-center space-x-1">
          {currentScreen === 'ai-analysis' && <Info size={20} className="text-black/20 dark:text-white/20 mr-2" />}
          {currentScreen === 'agenda' && <CalendarIcon size={20} className="text-black/20 dark:text-white/20 mr-2" />}
          {currentScreen === 'ajustes' && <Target size={20} className="text-[#C69372] mr-2" />}
          {!['ai-analysis', 'ajustes', 'alertas'].includes(currentScreen) && (
            <button 
              onClick={() => onNavigate('alertas')} 
              className="p-2 relative active:scale-90 transition-transform touch-manipulation"
              aria-label="Notificações"
            >
              <Bell size={22} className="text-black/60 dark:text-white/60" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#0c0c0c]"></span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
