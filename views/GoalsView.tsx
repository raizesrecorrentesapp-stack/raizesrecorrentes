
import React, { useState, useEffect } from 'react';
import { MOCK_GOALS, MOCK_SERVICES } from '../constants';
import { Goal } from '../types';
import {
  Target, TrendingUp, Zap, ChevronRight, Plus,
  BarChart3, Calculator, Calendar, Clock,
  DollarSign, X, Check, ArrowRight, Sparkles,
  Award, Heart, Users
} from 'lucide-react';

const GoalsView: React.FC = () => {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Estado das Metas
  const [monthlyGoal, setMonthlyGoal] = useState({
    revenue: 5000,
    profit: 0,
    workingDays: 22,
    hoursPerDay: 8,
    currentRevenue: 0,
  });

  // Estado do Simulador
  const [simValues, setSimValues] = useState({
    increaseTicket: 0,
    addDays: 0,
    focusProfit: false
  });

  // Cálculos Automáticos
  const ticketMedioAtual = 350;
  const progress = (monthlyGoal.currentRevenue / monthlyGoal.revenue) * 100;
  const missingRevenue = monthlyGoal.revenue - monthlyGoal.currentRevenue;
  const appointmentsNeeded = Math.ceil(missingRevenue / ticketMedioAtual);

  // Cálculo do Simulador
  const simTicket = ticketMedioAtual * (1 + simValues.increaseTicket / 100);
  const simDays = monthlyGoal.workingDays + simValues.addDays;
  const simCapacity = simDays * (monthlyGoal.hoursPerDay / 4); // assumindo 4h por atendimento médio
  const projectedRevenue = simCapacity * simTicket;

  const triggerSuccess = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleSaveConfig = () => {
    setIsConfigModalOpen(false);
    triggerSuccess();
  };

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-500 pb-32">

      {/* Feedback Toast */}
      {showSuccessToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-emerald-500 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top">
          <Check size={14} strokeWidth={4} />
          <span>Planejamento Atualizado</span>
        </div>
      )}

      {/* HEADER ESTRATÉGICO */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-black dark:text-white tracking-tighter italic">Meu Plano</h2>
          <p className="text-[10px] font-black text-[#C69372] uppercase tracking-[0.3em]">Faturamento & Liberdade</p>
        </div>
        <button
          onClick={() => setIsConfigModalOpen(true)}
          className="bg-[#C69372] text-white w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        >
          <Target size={24} />
        </button>
      </div>

      {/* CARD PRINCIPAL: PROGRESSO REAL */}
      <div className="bg-[#121212] rounded-[40px] p-8 border border-white/5 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#C69372]/5 rounded-full blur-3xl"></div>

        <div className="text-center space-y-2 relative z-10">
          <p className="text-[10px] font-black text-[#C69372] uppercase tracking-[0.4em]">Faturamento Mensal</p>
          <h3 className="text-6xl font-black text-white tracking-tighter">R$ {monthlyGoal.currentRevenue.toLocaleString()}</h3>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 mt-2">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Alvo: R$ {monthlyGoal.revenue.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-[#C69372] to-[#e0b18f] rounded-full shadow-[0_0_20px_rgba(198,147,114,0.3)] transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className="text-white/20">0%</span>
            <span className="text-[#C69372]">{Math.round(progress)}% Concluído</span>
            <span className="text-white/20">100%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 relative z-10">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Lucro Estimado</p>
            <p className="text-xl font-black text-emerald-500">R$ {Math.round(monthlyGoal.currentRevenue * 0.7).toLocaleString()}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Faltam</p>
            <p className="text-xl font-black text-white">R$ {missingRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* 🎯 PLANO DE AÇÃO IA RAÍZES */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 px-1">
          <Zap size={16} className="text-[#C69372]" fill="currentColor" />
          <h3 className="text-[11px] font-black text-black/40 dark:text-white/20 uppercase tracking-[0.2em]">Caminho para o Alvo</h3>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] rounded-[32px] p-6 border border-black/5 dark:border-white/5 space-y-6 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
              <TrendingUp size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-black dark:text-white leading-relaxed">
                Para atingir os <span className="text-[#C69372] font-black">R$ {monthlyGoal.revenue.toLocaleString()}</span>, você precisa de:
              </p>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-black dark:text-white">{appointmentsNeeded}</span>
                <span className="text-[10px] font-black text-black/40 dark:text-white/30 uppercase">Atendimentos restantes</span>
              </div>
            </div>
          </div>

          <div className="bg-black/[0.02] dark:bg-white/[0.02] p-5 rounded-2xl border border-black/5 dark:border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#C69372] uppercase tracking-widest">Sugestão de Mix:</span>
              <Sparkles size={14} className="text-[#C69372]" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-black/60 dark:text-white/60">Box Braids (R$ 450)</span>
                <span className="font-black text-black dark:text-white">{Math.ceil(appointmentsNeeded * 0.6)}x</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-black/60 dark:text-white/60">Manutenções (R$ 150)</span>
                <span className="font-black text-black dark:text-white">{Math.ceil(appointmentsNeeded * 0.4)}x</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="w-full py-4 bg-[#C69372] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-transform"
          >
            <Calculator size={16} />
            <span>Simular Nova Estratégia</span>
          </button>
        </div>
      </div>

      {/* METAS DE CRESCIMENTO & RECORRÊNCIA */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-[32px] border border-black/5 dark:border-white/5 space-y-3">
          <div className="flex items-center space-x-2 text-[#C69372]">
            <Users size={14} />
            <p className="text-[9px] font-black uppercase tracking-widest">Clientes Fixas</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl font-black text-black dark:text-white">12/20</h4>
            <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#C69372] rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-[32px] border border-black/5 dark:border-white/5 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-500">
            <Heart size={14} />
            <p className="text-[9px] font-black uppercase tracking-widest">Taxa Retorno</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl font-black text-black dark:text-white">68%</h4>
            <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* ⚙️ MODAL: CONFIGURAR METAS */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-[150] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in" onClick={() => setIsConfigModalOpen(false)}></div>
          <div className="bg-[#0c0c0c] border-t border-white/10 w-full rounded-t-[40px] p-8 pb-12 space-y-8 relative z-10 animate-in slide-in-from-bottom duration-500 max-h-[90dvh] overflow-y-auto hide-scrollbar shadow-2xl">
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-2"></div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white tracking-tight italic">Configurar Alvos</h3>
                <p className="text-[10px] text-[#C69372] font-black uppercase tracking-[0.2em]">Planejamento Financeiro</p>
              </div>
              <button onClick={() => setIsConfigModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 active:scale-90 transition-transform"><X size={20} /></button>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Meta de Faturamento Bruto (R$)</label>
                <input
                  type="number"
                  value={monthlyGoal.revenue}
                  onChange={(e) => setMonthlyGoal({ ...monthlyGoal, revenue: Number(e.target.value) })}
                  className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-xl font-black outline-none focus:border-[#C69372]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Dias de Trabalho / Mês</label>
                  <input
                    type="number"
                    value={monthlyGoal.workingDays}
                    onChange={(e) => setMonthlyGoal({ ...monthlyGoal, workingDays: Number(e.target.value) })}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Horas por Dia</label>
                  <input
                    type="number"
                    value={monthlyGoal.hoursPerDay}
                    onChange={(e) => setMonthlyGoal({ ...monthlyGoal, hoursPerDay: Number(e.target.value) })}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold outline-none"
                  />
                </div>
              </div>

              <div className="bg-[#121212] border border-[#C69372]/20 p-6 rounded-[32px] space-y-4">
                <div className="flex items-center space-x-2 text-[10px] font-black text-[#C69372] uppercase tracking-widest">
                  <Award size={14} />
                  <span>Resumo do Compromisso</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed font-medium italic">
                  "Ao definir esta meta, você se compromete a gerar um valor médio de <span className="text-white font-black">R$ {Math.round(monthlyGoal.revenue / monthlyGoal.workingDays)} por dia</span> trabalhado."
                </p>
              </div>

              <button
                onClick={handleSaveConfig}
                className="w-full py-5 bg-[#C69372] text-white rounded-[24px] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center space-x-3 shadow-xl active:scale-95 transition-transform"
              >
                <Check size={20} />
                <span>Salvar Planejamento</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📊 MODAL: SIMULADOR ESTRATÉGICO */}
      {isSimulatorOpen && (
        <div className="fixed inset-0 z-[160] flex flex-col justify-center p-6">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-2xl animate-in fade-in" onClick={() => setIsSimulatorOpen(false)}></div>
          <div className="bg-[#0c0c0c] border border-white/10 rounded-[40px] p-8 space-y-10 relative z-10 animate-in zoom-in duration-300 shadow-2xl text-center">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-[#C69372]/10 rounded-full flex items-center justify-center text-[#C69372] mx-auto mb-4 border border-[#C69372]/20">
                <Sparkles size={32} />
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Simulador Raízes 2.0</h3>
              <p className="text-xs text-white/30 font-medium leading-relaxed italic">"Meta não é desejo. É cálculo."</p>
            </div>

            <div className="space-y-8">
              {/* Slider 1: Aumentar Ticket */}
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                  <span>Aumentar Ticket Médio</span>
                  <span className="text-[#C69372]">+{simValues.increaseTicket}% (R$ {Math.round(simTicket)})</span>
                </div>
                <input
                  type="range" min="0" max="50" step="5"
                  value={simValues.increaseTicket}
                  onChange={(e) => setSimValues({ ...simValues, increaseTicket: Number(e.target.value) })}
                  className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#C69372]"
                />
              </div>

              {/* Slider 2: Dias Extras */}
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                  <span>Adicionar Dias de Trabalho</span>
                  <span className="text-blue-400">+{simValues.addDays} dias ({simDays} total)</span>
                </div>
                <input
                  type="range" min="0" max="8" step="1"
                  value={simValues.addDays}
                  onChange={(e) => setSimValues({ ...simValues, addDays: Number(e.target.value) })}
                  className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-400"
                />
              </div>

              {/* Resultado Projetado */}
              <div className="bg-[#121212] border border-white/5 p-6 rounded-[32px] space-y-4 text-left relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-white/5 rotate-12"><TrendingUp size={80} /></div>
                <div className="relative z-10">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Novo Faturamento Projetado</p>
                  <p className="text-4xl font-black text-emerald-500">R$ {Math.round(projectedRevenue).toLocaleString()}</p>
                  <p className="text-[10px] text-white/40 mt-2 font-bold uppercase tracking-widest italic">
                    {projectedRevenue > monthlyGoal.revenue ? '🔥 Supera sua meta atual!' : '⏳ Quase lá! Ajuste os valores.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setMonthlyGoal({ ...monthlyGoal, revenue: Math.round(projectedRevenue), workingDays: simDays }); setIsSimulatorOpen(false); triggerSuccess(); }}
                className="w-full py-5 bg-[#C69372] text-white font-black rounded-2xl active:scale-95 transition-transform uppercase tracking-widest text-xs"
              >
                Aplicar Estratégia
              </button>
              <button
                onClick={() => setIsSimulatorOpen(false)}
                className="w-full py-4 text-white/20 font-black uppercase tracking-widest text-[10px]"
              >
                Descartar Simulação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsView;
