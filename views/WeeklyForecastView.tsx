
import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Zap, ChevronRight } from 'lucide-react';
import { Screen } from '../types';

interface WeeklyForecastViewProps {
  onBack: () => void;
  onNavigate?: (screen: Screen) => void;
}

const WeeklyForecastView: React.FC<WeeklyForecastViewProps> = ({ onBack, onNavigate }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationStep, setOptimizationStep] = useState('');

  const handleOptimize = () => {
    setIsOptimizing(true);
    setOptimizationStep('Analisando agenda...');
    setTimeout(() => setOptimizationStep('Identificando janelas...'), 800);
    setTimeout(() => {
      setIsOptimizing(false);
      if (onNavigate) onNavigate('agenda');
    }, 1800);
  };

  return (
    <div className="p-5 space-y-8 animate-in slide-in-from-right duration-500 relative">
      {isOptimizing && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#a98467]/20 border-t-[#a98467] rounded-full animate-spin"></div>
            <Zap className="absolute inset-0 m-auto text-[#a98467]" size={32} fill="currentColor" />
          </div>
          <div className="text-center space-y-2">
            <h4 className="text-xl font-black text-white uppercase tracking-tighter italic italic">Otimizando Raízes</h4>
            <p className="text-[#a98467] text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">{optimizationStep}</p>
          </div>
        </div>
      )}

      <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 space-y-10 shadow-2xl">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Fluxo Projetado (30d)</p>
          <div className="flex items-center space-x-3">
             <h2 className="text-4xl font-black text-white tracking-tighter">R$ 4.280</h2>
             <div className="flex items-center text-emerald-500 font-black text-xs">
                <TrendingUp size={14} className="mr-1" /> <span>+12%</span>
             </div>
          </div>
        </div>

        {/* Forecast Chart - Responsive bars */}
        <div className="flex justify-between items-end h-44 gap-2">
           {[
             { label: 'S1', bars: [60, 30, 10], color: '#10b981' },
             { label: 'S2', bars: [75, 15, 10], color: '#10b981' },
             { label: 'S3', bars: [20, 10, 5], color: '#ef4444', risk: true },
             { label: 'S4', bars: [40, 25, 20], color: '#10b981' },
           ].map((col, i) => (
             <div key={i} className="flex flex-col items-center space-y-4 flex-1">
               <div className="w-full max-w-[40px] space-y-1 flex flex-col justify-end h-32">
                  {col.bars.map((h, j) => (
                    <div 
                      key={j} 
                      className="w-full rounded-sm transition-all duration-700" 
                      style={{ 
                        height: `${h}%`, 
                        backgroundColor: j === 0 ? col.color : j === 1 ? 'rgba(169, 132, 103, 0.4)' : 'rgba(239, 68, 68, 0.2)'
                      }}
                    ></div>
                  ))}
               </div>
               <span className={`text-[10px] font-black uppercase tracking-widest ${col.risk ? 'text-red-500' : 'text-white/20'}`}>{col.label}</span>
             </div>
           ))}
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center pt-6 border-t border-white/5">
           <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Confirmado</span>
           </div>
           <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#a98467]"></span>
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Sinal</span>
           </div>
           <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Cancelado</span>
           </div>
        </div>
      </div>

      <div className="space-y-5">
        <h3 className="text-sm font-black text-white/40 px-2 tracking-[0.3em] uppercase">Análise de Perdas</h3>

        <div className="space-y-4">
          <div className="bg-[#1a0a0a] border border-red-900/10 p-6 rounded-[32px] flex items-center space-x-5 shadow-xl relative overflow-hidden">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 shrink-0 border border-red-500/20">
               <AlertTriangle size={24} />
            </div>
            <div className="space-y-0.5">
               <h4 className="text-lg font-black text-white uppercase tracking-tight">Lacuna na SEM 3</h4>
               <p className="text-[12px] text-white/40 leading-snug font-medium">Cancelamentos acima da média. Sugerimos antecipar contatos VIP.</p>
            </div>
          </div>

          <button 
            onClick={handleOptimize}
            className="w-full bg-[#0a0a0a] border border-white/5 p-6 rounded-[32px] flex items-center justify-between group active:scale-[0.98] transition-all shadow-2xl touch-manipulation"
          >
            <div className="flex items-center space-x-4">
               <Zap size={20} fill="#a98467" className="text-[#a98467]" />
               <span className="text-xs font-black uppercase tracking-[0.2em] text-[#a98467]">OTIMIZAR PREENCHIMENTO</span>
            </div>
            <ChevronRight size={20} className="text-white/20 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>

      <div className="text-center pt-8 pb-10">
         <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em]">Antecipação gera Liberdade</p>
      </div>
    </div>
  );
};

export default WeeklyForecastView;
