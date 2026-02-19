
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_SERVICES } from '../constants';
import { Appointment, Client, Service } from '../types';
import {
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  Zap,
  Check,
  X,
  Clock,
  Plus,
  Info,
  Search,
  TrendingUp,
  CalendarDays
} from 'lucide-react';

type ViewMode = 'month' | 'week' | 'day';

interface AgendaViewProps {
  clients: Client[];
  appointments: Appointment[];
  services: Service[];
  onAddAppointment: (appt: Appointment, newClientData?: Partial<Client>) => void;
  onUpdateStatus: (id: string, status: Appointment['status'], payStatus?: Appointment['paymentStatus']) => void;
}

const AgendaView: React.FC<AgendaViewProps> = ({ clients, appointments, services, onAddAppointment, onUpdateStatus }) => {
  // Inicialização com a data real de hoje
  const now = new Date();
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [isNewClient, setIsNewClient] = useState(false);

  // Fix: Added missing state for new appointment
  const [newAppt, setNewAppt] = useState({
    date: `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`,
    time: '09:00',
    serviceId: services[0]?.id || '',
    paymentStatus: 'PENDENTE' as Appointment['paymentStatus'],
    depositValue: 0
  });

  // Update newAppt date when selected day changes
  useEffect(() => {
    setNewAppt(prev => ({
      ...prev,
      date: `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`
    }));
  }, [selectedDay, selectedMonth, selectedYear]);

  // Fix: Added missing handleConfirmAdd function
  const handleConfirmAdd = () => {
    if (!clientSearch) return;

    const service = services.find(s => s.id === newAppt.serviceId) || services[0];
    if (!service) return; // Não permite sem serviço

    const appt: Appointment = {
      id: `a-${Date.now()}`,
      clientId: `c-${Date.now()}`,
      clientName: clientSearch,
      date: newAppt.date,
      time: newAppt.time,
      serviceId: service.id,
      serviceName: service.name,
      value: service.price,
      status: newAppt.paymentStatus === 'PAGO_SINAL' ? 'PAGO_SINAL' : 'CONFIRMADO',
      paymentStatus: newAppt.paymentStatus,
      depositValue: newAppt.depositValue
    };

    onAddAppointment(appt, { name: clientSearch });
    setShowAddModal(false);
    setShowSuccessToast(true);
    setClientSearch('');
    // Reset selection for next use
    setNewAppt(prev => ({
      ...prev,
      serviceId: services[0]?.id || '',
      paymentStatus: 'PENDENTE',
      depositValue: 0,
      date: `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`
    }));
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleUpdateStatus = async (apptId: string, newStatus: Appointment['status'], payStatus?: Appointment['paymentStatus']) => {
    try {
      onUpdateStatus(apptId, newStatus, payStatus);
      setSelectedAppointment(null);
    } catch (error) {
      console.error(error);
    }
  };


  const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  const fullMonths = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Gera os dias da semana dinamicamente ao redor da data selecionada para a barra do topo
  const dynamicDays = useMemo(() => {
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(selectedYear, selectedMonth, selectedDay + i);
      days.push({
        name: dayNames[d.getDay()],
        date: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear()
      });
    }
    return days;
  }, [selectedDay, selectedMonth, selectedYear]);

  const getDayStats = (day: number, month: number, year: number) => {
    const monthStr = (month + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const dateKey = `${year}-${monthStr}-${dayStr}`;

    const dayAppts = appointments.filter(a => a.date === dateKey);
    const revenue = dayAppts.reduce((acc, a) => acc + a.value, 0);
    const materialCost = dayAppts.reduce((acc, a) => {
      const s = services.find(s => s.id === a.serviceId);
      return acc + (s?.materialCost || 0);
    }, 0);
    const profit = revenue - materialCost;
    return { revenue, profit, count: dayAppts.length, appts: dayAppts };
  };

  const dailyStats = useMemo(() => getDayStats(selectedDay, selectedMonth, selectedYear), [selectedDay, selectedMonth, selectedYear, appointments]);

  const handlePrevDay = () => {
    const prev = new Date(selectedYear, selectedMonth, selectedDay - 1);
    setSelectedDay(prev.getDate());
    setSelectedMonth(prev.getMonth());
    setSelectedYear(prev.getFullYear());
  };

  const handleNextDay = () => {
    const next = new Date(selectedYear, selectedMonth, selectedDay + 1);
    setSelectedDay(next.getDate());
    setSelectedMonth(next.getMonth());
    setSelectedYear(next.getFullYear());
  };

  const handleMonthSelect = (index: number) => {
    setSelectedMonth(index);
    setShowDatePicker(false);
    // Se mudar o mês, resetamos o dia para o 1 para evitar erros de data
    setSelectedDay(1);
  };

  const renderDayView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 p-4">
      <div className="bg-[#121212] rounded-[32px] p-6 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
        <div className="space-y-4 relative z-10">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Resumo de {selectedDay}/{selectedMonth + 1}</p>
              <h3 className="text-2xl font-black text-white tracking-tighter italic">Receita: R$ {dailyStats.revenue}</h3>
            </div>
            {dailyStats.count > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                <span className="text-[10px] font-black text-emerald-500 uppercase italic">Dia Forte 🔥</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
            <div><p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5">Lucro Est.</p><p className="text-sm font-black text-emerald-500">R$ {dailyStats.profit}</p></div>
            <div className="border-l border-white/5 pl-3"><p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5">Atendimentos</p><p className="text-sm font-black text-white">{dailyStats.count}</p></div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {dailyStats.appts.length > 0 ? dailyStats.appts.map((app) => (
          <div key={app.id} onClick={() => setSelectedAppointment(app)} className="bg-white dark:bg-[#0a0a0a] rounded-[32px] border border-black/5 dark:border-white/5 shadow-sm active:scale-[0.98] transition-all cursor-pointer group p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/5">
                  <img src={`https://picsum.photos/seed/${app.clientId}/200`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-bronze tabular-nums">{app.time}</span>
                    <h4 className="font-black text-black dark:text-white truncate max-w-[120px]">{app.clientName}</h4>
                  </div>
                  <p className="text-[9px] text-black/40 dark:text-white/20 font-black uppercase tracking-widest">{app.serviceName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-black dark:text-white leading-none">R$ {app.value}</p>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center flex flex-col items-center space-y-4 opacity-20">
            <CalendarIcon size={48} />
            <p className="text-sm font-black uppercase tracking-widest italic">Nenhum atendimento<br />neste dia</p>
          </div>
        )}
      </div>

      <div className="pt-2 pb-10">
        <button onClick={() => setShowAddModal(true)} className="w-full py-5 bg-bronze text-white rounded-2xl font-black text-sm flex items-center justify-center space-x-3 shadow-xl active:scale-95 transition-transform uppercase tracking-[0.2em]">
          <Plus size={20} />
          <span>Novo Agendamento</span>
        </button>
      </div>
    </div>
  );

  const renderWeekView = () => (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right duration-400">
      <div className="flex items-center space-x-2 mb-2">
        <TrendingUp size={16} className="text-bronze" />
        <h3 className="text-[10px] font-black text-black/40 dark:text-white/20 uppercase tracking-[0.2em]">Fluxo da Semana</h3>
      </div>
      {Array.from({ length: 7 }, (_, i) => {
        const d = new Date(selectedYear, selectedMonth, selectedDay + i);
        const stats = getDayStats(d.getDate(), d.getMonth(), d.getFullYear());
        return (
          <button
            key={i}
            onClick={() => {
              setSelectedDay(d.getDate());
              setSelectedMonth(d.getMonth());
              setSelectedYear(d.getFullYear());
              setViewMode('day');
            }}
            className={`w-full bg-white dark:bg-[#0a0a0a] rounded-[28px] p-5 border flex items-center justify-between transition-all active:scale-[0.98] ${selectedDay === d.getDate() && selectedMonth === d.getMonth() ? 'border-bronze ring-1 ring-bronze/20 shadow-lg' : 'border-black/5 dark:border-white/5 shadow-sm'}`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black ${selectedDay === d.getDate() && selectedMonth === d.getMonth() ? 'bg-bronze text-white' : 'bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/20'}`}>
                <span className="text-[8px] uppercase">{dayNames[d.getDay()]}</span>
                <span className="text-lg leading-none">{d.getDate()}</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-black dark:text-white">{stats.count} atendimentos</p>
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Prev. Lucro: R$ {stats.profit}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-black/10 dark:text-white/10" />
          </button>
        );
      })}
    </div>
  );

  const renderMonthView = () => {
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: startingDayOfWeek }, (_, i) => i);

    return (
      <div className="p-4 space-y-6 animate-in fade-in duration-500">
        <div className="bg-white dark:bg-[#0a0a0a] rounded-[32px] p-6 border border-black/5 dark:border-white/5 shadow-sm">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
              <div key={d} className="text-center text-[9px] font-black text-black/20 dark:text-white/20 uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {blanks.map(b => (
              <div key={`blank-${b}`} className="h-11"></div>
            ))}
            {daysArray.map(d => {
              const hasAppt = appointments.some(a => {
                const parts = a.date.split('-');
                return parseInt(parts[2]) === d && parseInt(parts[1]) === (selectedMonth + 1) && parseInt(parts[0]) === selectedYear;
              });
              const isSelected = selectedDay === d;
              return (
                <button
                  key={d}
                  onClick={() => { setSelectedDay(d); setViewMode('day'); }}
                  className={`h-11 rounded-xl flex flex-col items-center justify-center transition-all relative ${isSelected ? 'bg-bronze text-white shadow-lg' : 'hover:bg-black/5 dark:hover:bg-white/5 text-black/60 dark:text-white/60'}`}
                >
                  <span className="text-xs font-black">{d}</span>
                  {hasAppt && (
                    <div className={`w-1 h-1 rounded-full absolute bottom-1.5 ${isSelected ? 'bg-white' : 'bg-bronze'}`}></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-bronze/5 border border-bronze/10 rounded-[28px] p-5 flex items-start space-x-3">
          <Info size={18} className="text-bronze shrink-0 mt-0.5" />
          <p className="text-[11px] font-medium text-black/60 dark:text-white/60 leading-relaxed">
            Navegue pelos dias para ver os detalhes da sua agenda de <span className="font-black text-bronze">{fullMonths[selectedMonth]} {selectedYear}</span>.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-500 h-full relative">
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#0c0c0c]/95 backdrop-blur-md border-b border-black/5 dark:border-white/5 py-3 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-1 bg-black/5 dark:bg-white/5 p-1 rounded-2xl">
          {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === mode ? 'bg-bronze text-white shadow-md' : 'text-black/30 dark:text-white/20'
                }`}
            >
              {mode === 'month' ? 'Mês' : mode === 'week' ? 'Semana' : 'Dia'}
            </button>
          ))}
        </div>

        {/* DISPLAY MMM/AAAA COM SELETOR */}
        <button
          onClick={() => setShowDatePicker(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-black/[0.03] dark:bg-white/5 active:scale-95 transition-all group"
        >
          <span className="text-[11px] font-black uppercase tracking-widest text-black dark:text-white">
            {months[selectedMonth]}/{selectedYear}
          </span>
          <CalendarDays size={14} className="text-bronze group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {viewMode === 'day' && (
          <div className="bg-white/90 dark:bg-[#0c0c0c]/90 py-2 border-b border-black/5 dark:border-white/5 sticky top-0 z-10">
            <div className="flex items-center justify-between px-2">
              <button
                onClick={handlePrevDay}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/[0.03] dark:bg-white/5 text-bronze active:scale-90 transition-transform"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </button>

              <div className="flex items-center space-x-1 overflow-x-hidden py-1">
                {dynamicDays.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedDay(day.date);
                      setSelectedMonth(day.month);
                      setSelectedYear(day.year);
                    }}
                    className={`flex flex-col items-center min-w-[48px] py-2.5 rounded-2xl transition-all relative ${selectedDay === day.date && selectedMonth === day.month ? 'bg-bronze/10' : 'opacity-40 scale-90'}`}
                  >
                    <span className={`text-[8px] font-black uppercase tracking-widest mb-1 ${selectedDay === day.date && selectedMonth === day.month ? 'text-bronze' : 'text-black/20 dark:text-white/20'}`}>
                      {day.name}
                    </span>
                    <span className={`text-sm font-black w-9 h-9 flex items-center justify-center rounded-xl transition-all ${selectedDay === day.date && selectedMonth === day.month ? 'bg-bronze text-white shadow-lg shadow-bronze/30 scale-105' : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60'}`}>
                      {day.date}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextDay}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/[0.03] dark:bg-white/5 text-bronze active:scale-90 transition-transform"
              >
                <ChevronRight size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}

        {viewMode === 'day' && renderDayView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && renderMonthView()}
      </div>

      {/* SELETOR DE MÊS E ANO (MODAL ANUAL) */}
      {showDatePicker && (
        <div className="fixed inset-0 z-[160] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in" onClick={() => setShowDatePicker(false)}></div>
          <div className="bg-white dark:bg-[#0c0c0c] border-t border-black/10 dark:border-white/10 w-full rounded-t-[40px] p-8 pb-12 space-y-8 relative z-10 animate-in slide-in-from-bottom duration-500 shadow-2xl">
            <div className="w-12 h-1.5 bg-black/10 dark:bg-white/10 rounded-full mx-auto mb-2 shrink-0"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedYear(prev => prev - 1)}
                  className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/40 dark:text-white/40 active:scale-90"
                >
                  <ChevronLeft size={20} />
                </button>
                <h3 className="text-3xl font-black text-black dark:text-white tracking-tighter italic">{selectedYear}</h3>
                <button
                  onClick={() => setSelectedYear(prev => prev + 1)}
                  className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/40 dark:text-white/40 active:scale-90"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <button onClick={() => setShowDatePicker(false)} className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/40 dark:text-white/40 active:scale-90 transition-transform">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {months.map((m, idx) => {
                const isSelected = selectedMonth === idx;
                return (
                  <button
                    key={m}
                    onClick={() => handleMonthSelect(idx)}
                    className={`h-16 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${isSelected
                      ? 'bg-bronze border-bronze text-white shadow-lg shadow-bronze/30 scale-105'
                      : 'bg-black/5 dark:bg-white/5 border-transparent text-black/40 dark:text-white/20'
                      }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setSelectedDay(now.getDate());
                setSelectedMonth(now.getMonth());
                setSelectedYear(now.getFullYear());
                setShowDatePicker(false);
              }}
              className="w-full py-5 bg-black/[0.03] dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-bronze active:scale-95 transition-all"
            >
              Voltar para HOJE
            </button>
          </div>
        </div>
      )}

      {/* MODAL NOVO AGENDAMENTO */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="bg-white dark:bg-[#0a0a0a] border-t sm:border border-black/10 dark:border-white/10 w-full sm:max-w-lg sm:rounded-[32px] rounded-t-[40px] p-6 pb-10 sm:p-8 space-y-6 relative z-10 animate-in slide-in-from-bottom duration-300 max-h-[90dvh] overflow-y-auto hide-scrollbar">
            <div className="w-12 h-1.5 bg-black/10 dark:bg-white/10 rounded-full mx-auto mb-2 shrink-0 sm:hidden"></div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tight">Novo Agendamento</h3>
              <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/40 dark:text-white/40 active:scale-90 transition-transform"><X size={20} /></button>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-black/20 uppercase tracking-widest ml-2">Cliente</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                  <input type="text" value={clientSearch} onChange={(e) => setClientSearch(e.target.value)} placeholder="Nome da cliente..." className="w-full h-14 bg-black/5 dark:bg-white/5 border border-black/10 rounded-2xl pl-12 pr-5 font-bold outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Fix: Added onChange handlers to update newAppt state */}
                <input
                  type="date"
                  value={newAppt.date}
                  onChange={(e) => setNewAppt(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full h-14 bg-black/5 rounded-2xl px-5 font-bold"
                />
                <input
                  type="time"
                  value={newAppt.time}
                  onChange={(e) => setNewAppt(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full h-14 bg-black/5 rounded-2xl px-5 font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-black/20 uppercase tracking-widest ml-2">Serviço</label>
                {services.length > 0 ? (
                  <select
                    value={newAppt.serviceId}
                    onChange={(e) => setNewAppt(prev => ({ ...prev, serviceId: e.target.value }))}
                    className="w-full h-14 bg-black/5 dark:bg-white/5 border border-black/10 rounded-2xl px-5 font-bold outline-none appearance-none cursor-pointer"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} - R$ {s.price}</option>
                    ))}
                  </select>
                ) : (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                    <p className="text-[10px] font-black text-amber-500 uppercase italic">
                      ⚠ Nenhum serviço cadastrado. Cadastre um serviço no Portfólio primeiro.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border border-black/5">
                  <button
                    onClick={() => setNewAppt(prev => ({ ...prev, paymentStatus: 'PENDENTE' }))}
                    className={`flex-1 py-3.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${newAppt.paymentStatus === 'PENDENTE' ? 'bg-white dark:bg-zinc-800 shadow-sm text-black' : 'text-black/30 dark:text-white/20'}`}
                  >Pendente</button>
                  <button
                    onClick={() => setNewAppt(prev => ({ ...prev, paymentStatus: 'PAGO_SINAL' }))}
                    className={`flex-1 py-3.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${newAppt.paymentStatus === 'PAGO_SINAL' ? 'bg-white dark:bg-zinc-800 shadow-sm text-amber-500' : 'text-black/30 dark:text-white/20'}`}
                  >Sinal</button>
                  <button
                    onClick={() => setNewAppt(prev => ({ ...prev, paymentStatus: 'PAGO_TOTAL' }))}
                    className={`flex-1 py-3.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${newAppt.paymentStatus === 'PAGO_TOTAL' ? 'bg-white dark:bg-zinc-800 shadow-sm text-emerald-500' : 'text-black/30 dark:text-white/20'}`}
                  >Total</button>
                </div>

                {newAppt.paymentStatus === 'PAGO_SINAL' && (
                  <div className="animate-in zoom-in-95 duration-200">
                    <label className="text-[9px] font-black text-black/20 uppercase tracking-widest ml-2">Valor do Sinal (R$)</label>
                    <input
                      type="number"
                      value={newAppt.depositValue}
                      onChange={(e) => setNewAppt(prev => ({ ...prev, depositValue: Number(e.target.value) }))}
                      placeholder="Ex: 50"
                      className="w-full h-14 bg-black/5 border border-amber-500/20 rounded-2xl px-5 font-bold outline-none mt-2"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={() => handleConfirmAdd()}
                disabled={!clientSearch || services.length === 0}
                className={`w-full py-5 bg-bronze text-white font-black text-sm rounded-2xl uppercase tracking-widest shadow-xl transition-all ${(!clientSearch || services.length === 0) ? 'opacity-30 grayscale cursor-not-allowed' : 'active:scale-95'}`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-emerald-500 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top">
          <Check size={14} />
          <span>Agendamento Realizado</span>
        </div>
      )}

      {/* MODAL DETALHE AGENDAMENTO */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-[150] flex flex-col justify-end sm:justify-center sm:p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedAppointment(null)}></div>
          <div className="bg-white dark:bg-[#0a0a0a] border-t sm:border border-black/10 dark:border-white/10 w-full sm:max-w-md sm:rounded-[32px] rounded-t-[40px] p-6 pb-12 sm:p-8 space-y-8 relative z-10 animate-in slide-in-from-bottom duration-400">
            <div className="w-12 h-1.5 bg-black/10 dark:bg-white/10 rounded-full mx-auto mb-2 shrink-0 sm:hidden"></div>

            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-black text-black dark:text-white tracking-tighter italic">{selectedAppointment.clientName}</h3>
                <p className="text-[10px] font-black text-bronze uppercase tracking-[0.2em]">{selectedAppointment.serviceName}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${selectedAppointment.status === 'CONCLUÍDO' ? 'bg-emerald-500/10 text-emerald-500' :
                selectedAppointment.status === 'CANCELADO' ? 'bg-red-500/10 text-red-500' :
                  'bg-bronze/10 text-bronze'
                }`}>
                {selectedAppointment.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl">
                <p className="text-[8px] font-black text-black/20 dark:text-white/20 uppercase tracking-widest mb-1">Horário</p>
                <div className="flex items-center space-x-2">
                  <Clock size={14} className="text-bronze" />
                  <span className="font-black text-black dark:text-white">{selectedAppointment.time}</span>
                </div>
              </div>
              <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl">
                <p className="text-[8px] font-black text-black/20 dark:text-white/20 uppercase tracking-widest mb-1">Valor</p>
                <span className="font-black text-black dark:text-white">R$ {selectedAppointment.value}</span>
              </div>
            </div>

            {selectedAppointment.paymentStatus !== 'PENDENTE' && (
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="text-[8px] font-black text-emerald-500/40 uppercase tracking-widest">Pagamento</p>
                  <p className="text-[10px] font-black text-emerald-500">{selectedAppointment.paymentStatus}</p>
                </div>
                {selectedAppointment.depositValue > 0 && (
                  <div className="text-right">
                    <p className="text-[8px] font-black text-emerald-500/40 uppercase tracking-widest">Sinal</p>
                    <p className="text-xs font-black text-black dark:text-white">R$ {selectedAppointment.depositValue}</p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              {selectedAppointment.status !== 'CONCLUÍDO' && selectedAppointment.status !== 'CANCELADO' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment.id, 'CONCLUÍDO', 'PAGO_TOTAL')}
                    className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2"
                  >
                    <Check size={18} />
                    <span>Confirmar Execução</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment.id, 'CANCELADO')}
                    className="w-full py-5 bg-black/5 dark:bg-white/5 text-red-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] active:scale-95 transition-all flex items-center justify-center space-x-2"
                  >
                    <X size={18} />
                    <span>Cancelar Agendamento</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-full py-4 text-[10px] font-black text-black/20 dark:text-white/20 uppercase tracking-widest"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaView;
