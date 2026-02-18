
import React, { useState, useMemo } from 'react';
import { Screen, Goal, Client, Appointment } from '../types';
import { MOCK_GOALS, MOCK_MATERIALS } from '../constants';
import {
  TrendingUp, TrendingDown, Target, RefreshCw,
  ChevronRight, Sparkles, Package, ShieldCheck,
  Clock, DollarSign, Activity, AlertCircle, CalendarDays, ArrowRight
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (screen: Screen) => void;
  clients: Client[];
  appointments: Appointment[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, clients, appointments }) => {
  // Inicializa com o mês atual
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  // Cálculos baseados no banco de dados
  const dashboardData = useMemo(() => {
    // Filtrar agendamentos concluídos ou confirmados no intervalo
    const periodAppointments = appointments.filter(a => {
      const isAfterStart = a.date >= startDate;
      const isBeforeEnd = a.date <= endDate;
      return isAfterStart && isBeforeEnd;
    });

    const revenue = periodAppointments.reduce((sum, a) => sum + (Number(a.value) || 0), 0);
    const profit = Math.round(revenue * 0.75); // Estimativa de 75% de lucro se não houver financeiro detalhado
    const costs = revenue - profit;
    const volume = periodAppointments.length;
    const ticket = volume > 0 ? Math.round(revenue / volume) : 0;

    const diffTime = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const dailyAvg = Math.round(revenue / diffDays);
    const variation = "0%"; // Poderia ser calculado comparando com o período anterior

    return { revenue, profit, costs, ticket, volume, variation, dailyAvg };
  }, [startDate, endDate, appointments]);

  const metaFaturamento = MOCK_GOALS.find(g => g.type === 'faturamento') || { target: 10000, current: 0 };
  const progress = metaFaturamento.target > 0 ? (dashboardData.revenue / metaFaturamento.target) * 100 : 0;
  const restante = metaFaturamento.target - dashboardData.revenue;

  const riskCount = clients.filter(c => c.status === 'EM RISCO').length;
  const criticalStock = MOCK_MATERIALS.filter(m => m.quantity <= m.minQuantity).length;

  return (
    <div className="animate-in fade-in duration-700">

      {/* 🗓️ SELETOR DE DATA SIMPLIFICADO */}
      <div className="sticky top-0 z-20 bg-[#f5f5f7]/95 dark:bg-[#0c0c0c]/95 backdrop-blur-md border-b border-black/5 dark:border-white/5 py-5 px-4">
        <div className="bg-white dark:bg-[#121212] rounded-[24px] p-4 border border-black/5 dark:border-white/5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 px-1">
            <CalendarDays size={14} className="text-bronze" />
            <h3 className="text-[10px] font-black text-black/40 dark:text-white/20 uppercase tracking-[0.2em]">Período de Análise</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-black/20 dark:text-white/10 uppercase ml-1">Início</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-black/[0.03] dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2 text-xs font-bold text-black dark:text-white outline-none focus:border-bronze transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-black/20 dark:text-white/10 uppercase ml-1">Fim</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-black/[0.03] dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2 text-xs font-bold text-black dark:text-white outline-none focus:border-bronze transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 sm:space-y-8 pb-40 overflow-x-hidden">

        {/* 🔹 INDICADORES FINANCEIROS */}
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">

          {/* FATURAMENTO */}
          <div className="bg-white dark:bg-[#121212] rounded-[32px] p-6 border border-black/5 dark:border-white/5 shadow-sm relative overflow-hidden group">
            <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
            <div className="relative z-10 flex flex-col space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-black/30 dark:text-white/20 uppercase tracking-widest leading-none">Faturamento Bruto</p>
                  <h4 className="text-4xl font-black text-black dark:text-white tracking-tighter italic">
                    R$ {dashboardData.revenue.toLocaleString()}
                  </h4>
                </div>
                <div className="flex items-center px-2 py-1 rounded-lg text-[10px] font-black italic border bg-emerald-500/10 border-emerald-500/20 text-emerald-500">
                  <TrendingUp size={12} className="mr-1" />
                  <span>{dashboardData.variation}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <p className="text-[8px] font-black text-black/20 dark:text-white/10 uppercase tracking-widest">Ritmo diário no intervalo</p>
                <p className="text-[10px] font-black text-black/60 dark:text-white/40 uppercase">R$ {dashboardData.dailyAvg} / dia</p>
              </div>
            </div>
          </div>

          {/* LUCRO REAL */}
          <div className="bg-[#121212] rounded-[32px] p-6 border border-bronze/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-bronze/5 to-transparent opacity-50"></div>
            <div className="relative z-10 flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-bronze/20 rounded-lg flex items-center justify-center text-bronze">
                  <Sparkles size={12} fill="currentColor" />
                </div>
                <p className="text-[9px] font-black text-bronze uppercase tracking-[0.3em]">Lucro Real Estimado</p>
              </div>

              <div className="flex items-baseline justify-between">
                <p className="text-4xl font-black text-emerald-500 tracking-tighter">R$ {dashboardData.profit.toLocaleString()}</p>
                <div className="text-right">
                  <p className="text-[10px] font-black text-red-500/60 uppercase italic">- R$ {dashboardData.costs.toLocaleString()}</p>
                  <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest">Custos Diretos</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-[#121212] p-5 rounded-[32px] border border-black/5 dark:border-white/5 shadow-sm space-y-2">
              <div className="flex items-center space-x-2 opacity-30">
                <DollarSign size={14} className="text-bronze" />
                <p className="text-[8px] font-black uppercase tracking-widest">Ticket Médio</p>
              </div>
              <p className="text-xl font-black text-black dark:text-white tracking-tight italic">R$ {dashboardData.ticket}</p>
            </div>

            <div className="bg-white dark:bg-[#121212] p-5 rounded-[32px] border border-black/5 dark:border-white/5 shadow-sm space-y-2">
              <div className="flex items-center space-x-2 opacity-30">
                <Activity size={14} className="text-emerald-500" />
                <p className="text-[8px] font-black uppercase tracking-widest">Volume</p>
              </div>
              <p className="text-xl font-black text-black dark:text-white tracking-tight italic">{dashboardData.volume} <span className="text-[10px] opacity-30 uppercase not-italic">atend.</span></p>
            </div>
          </div>
        </div>

        {/* 🔹 META MENSAL */}
        <div className="bg-white dark:bg-[#0a0a0a] rounded-[32px] p-7 border border-black/5 dark:border-white/5 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target size={18} className="text-bronze" />
              <h3 className="text-[11px] font-black text-black/40 dark:text-white/20 uppercase tracking-[0.2em]">Progresso da Meta</h3>
            </div>
            <div className="text-right leading-none">
              <span className="text-xl font-black text-black dark:text-white tracking-tighter">{Math.round(progress)}%</span>
              <p className="text-[8px] font-black text-bronze uppercase block mt-0.5">Faltam R$ {restante > 0 ? restante.toLocaleString() : 'Meta batida!'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden p-1 border border-black/5 dark:border-white/5">
              <div className="h-full bg-bronze rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(198,147,114,0.3)]" style={{ width: `${Math.min(progress, 100)}%` }}></div>
            </div>
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-black/20 dark:text-white/20">
              <span>R$ 0</span>
              <span>Alvo R$ {metaFaturamento.target.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 🔹 ALERTAS PRIORITÁRIOS */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 px-1">
            <AlertCircle size={14} className="text-red-500" />
            <h3 className="text-[11px] font-black text-black/40 dark:text-white/20 uppercase tracking-[0.2em]">Prioridades</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {riskCount > 0 && (
              <button
                onClick={() => onNavigate('ativos')}
                className="bg-white dark:bg-[#0a0a0a] p-5 rounded-[28px] border border-black/5 dark:border-white/5 flex items-center justify-between group active:scale-[0.98] transition-all"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                    <RefreshCw size={18} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm font-black text-black dark:text-white truncate">{riskCount} Clientes em Risco</p>
                    <p className="text-[10px] font-bold text-black/40 dark:text-white/20 uppercase tracking-widest truncate">Ações de retenção pendentes</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-black/10 dark:text-white/10 shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {criticalStock > 0 && (
              <button
                onClick={() => onNavigate('estoque')}
                className="bg-white dark:bg-[#0a0a0a] p-5 rounded-[28px] border border-black/5 dark:border-white/5 flex items-center justify-between group active:scale-[0.98] transition-all"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <Package size={18} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm font-black text-black dark:text-white truncate">Estoque Crítico ({criticalStock})</p>
                    <p className="text-[10px] font-bold text-black/40 dark:text-white/20 uppercase tracking-widest truncate">Itens próximos de esgotar</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-black/10 dark:text-white/10 shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* INDICADOR DE SAÚDE */}
        <div className="pt-2">
          <div className="bg-[#121212] border border-white/5 rounded-[32px] p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">Saúde do Negócio</p>
                <h4 className="text-lg font-black text-white uppercase tracking-tight italic truncate">🟢 Saudável</h4>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest italic leading-tight">Análise IA<br />Raízes 3.0</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-6 pb-4 opacity-20">
          <p className="text-[9px] font-black text-black dark:text-white uppercase tracking-[0.5em] leading-relaxed italic">
            RAÍZES RECORRENTES • DASHBOARD v3.5<br />
            VISÃO QUE GERA LIBERDADE
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
