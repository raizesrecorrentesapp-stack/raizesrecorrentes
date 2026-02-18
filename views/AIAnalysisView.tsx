
import React from 'react';
import { X, Zap, BarChart3, TrendingDown, ArrowRight, FileText } from 'lucide-react';
import { Screen } from '../types';

interface AIAnalysisViewProps {
  onClose: () => void;
  onAction: (filter: string) => void;
  onNavigate?: (screen: Screen) => void;
}

const AIAnalysisView: React.FC<AIAnalysisViewProps> = ({ onClose, onAction, onNavigate }) => {
  return (
    <div className="p-5 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header matching image aesthetics */}
      <div className="space-y-2 mt-4">
        <h2 className="text-5xl font-black text-white tracking-tighter leading-none">Raízes Recorrentes</h2>
        <p className="text-white/30 text-lg font-medium leading-tight">Antecipação e estratégia para seu negócio.</p>
      </div>

      {/* Main Action Buttons matching image precisely */}
      <div className="space-y-4 mt-8">
        <button 
          onClick={() => onNavigate?.('previsao')}
          className="w-full h-24 bg-[#a98467] rounded-[40px] px-8 flex items-center justify-between text-white active:scale-95 transition-all shadow-xl shadow-[#a98467]/20 group"
        >
          <span className="text-xl font-black uppercase tracking-tight">ANALISAR SEMANA</span>
          <div className="bg-white/20 p-2 rounded-xl">
            <BarChart3 size={28} className="text-white" />
          </div>
        </button>
        
        <button 
          onClick={() => onNavigate?.('alertas')}
          className="w-full h-24 bg-[#0a0a0a] border border-white/10 rounded-[40px] px-8 flex items-center justify-between text-white active:scale-95 transition-all"
        >
          <span className="text-xl font-bold text-white/90">Vazamentos de Receita</span>
          <div className="bg-red-500/10 p-2 rounded-xl">
            <TrendingDown size={28} className="text-red-500" />
          </div>
        </button>
      </div>

      <div className="space-y-5 pt-4">
        <div className="flex items-center justify-between px-1">
           <h3 className="text-xl font-black text-white tracking-tight uppercase">Insight Prioritário</h3>
           <span className="text-[10px] font-black text-[#a98467] uppercase tracking-[0.3em]">IA RAÍZES</span>
        </div>
        
        {/* INSIGHT CARD - FUNCTIONAL VERSION */}
        <div className="bg-[#121212] border border-[#3d2b1f] rounded-[40px] p-8 space-y-8 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#a98467]/5 rounded-full blur-3xl"></div>
           
           <div className="flex items-center space-x-3 relative z-10">
              <Zap size={22} fill="#a98467" className="text-[#a98467]" />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Fidelidade em Alerta</span>
           </div>

           <h4 className="text-2xl font-black leading-[1.15] text-white tracking-tight relative z-10">
              Você tem <span className="text-[#a98467]">3 clientes VIP</span> perdendo o ciclo de retorno.
           </h4>

           <div className="flex items-center justify-between gap-6 relative z-10">
              {/* Bar Visual */}
              <div className="flex-1 h-28 bg-white/[0.03] border border-white/5 rounded-3xl p-5 flex items-end justify-between space-x-1.5">
                  {[35, 55, 25, 75, 45, 95, 65].map((v, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 rounded-full transition-all duration-1000 delay-${i * 100} ${i === 5 ? 'bg-[#a98467]' : 'bg-[#a98467]/20'}`} 
                      style={{ height: `${v}%` }}
                    ></div>
                  ))}
              </div>

              {/* Action Info */}
              <div className="flex-1 space-y-5">
                 <div className="space-y-1">
                    <p className="text-[13px] text-red-500 font-black leading-snug">Risco de perda:</p>
                    <p className="text-lg font-black text-white leading-tight">R$ 850,00</p>
                 </div>
                 <button 
                  onClick={() => onAction('risco')}
                  className="bg-[#1e1a17] border border-[#3d2b1f] px-5 py-3 rounded-2xl flex items-center justify-center space-x-2 text-white/80 font-black text-[11px] uppercase tracking-widest active:bg-[#a98467] active:text-white transition-all shadow-lg group"
                 >
                    <span>AGIR AGORA</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-5 space-y-1">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Retenção</p>
            <div className="flex items-baseline space-x-2">
               <span className="text-2xl font-black text-white">68%</span>
               <span className="text-[10px] font-bold text-red-500">-4%</span>
            </div>
         </div>
         <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-5 space-y-1">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Recorrência</p>
            <div className="flex items-baseline space-x-2">
               <span className="text-2xl font-black text-white">R$ 4k</span>
               <span className="text-[10px] font-bold text-emerald-500">+12%</span>
            </div>
         </div>
      </div>

      <div className="pt-4 pb-4">
         <button className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black flex items-center justify-center space-x-3 shadow-xl active:scale-95 transition-transform uppercase tracking-widest text-xs">
           <FileText size={18} className="text-[#a98467]" />
           <span>Exportar Auditoria PDF</span>
         </button>
      </div>
    </div>
  );
};

export default AIAnalysisView;
