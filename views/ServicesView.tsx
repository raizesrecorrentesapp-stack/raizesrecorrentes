
import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { Service, Screen } from '../types';
import { MOCK_SERVICES } from '../constants';
import {
  TrendingUp, Clock, DollarSign, Zap, Plus,
  Award, Search, Filter, ChevronRight,
  BarChart4, X, AlertCircle, Info, Calculator,
  History, Scissors, Check, Save, Sparkles,
  ArrowUpDown, Trophy, Timer, Trash2, Loader2, AlertTriangle
} from 'lucide-react';

interface ServicesViewProps {
  onNavigate?: (screen: Screen) => void;
  onSetFinanceFilter?: (filter: string) => void;
  services: Service[];
  onUpdateServices: () => void;
}

type FilterOption = 'all' | 'sold' | 'profit' | 'time';

const ServicesView: React.FC<ServicesViewProps> = ({ onNavigate, onSetFinanceFilter, services, onUpdateServices }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [simCount, setSimCount] = useState(20);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Form State para Novo Serviço
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    category: 'Tranças',
    duration: '2h',
    durationMinutes: 120,
    price: 0,
    materialCost: 0,
    indirectCost: 0,
    repetition: '4 semanas',
    description: '',
    tag: 'Popular'
  });

  // Cálculos Automáticos para o Form
  const profit = (newService.price || 0) - (newService.materialCost || 0) - (newService.indirectCost || 0);
  const margin = newService.price ? Math.round((profit / newService.price) * 100) : 0;
  const profitPerHour = newService.durationMinutes ? Math.round((profit / newService.durationMinutes) * 60) : 0;

  // Métrica calculadas para os cards de topo
  const ticketMedio = services.length > 0 ? services.reduce((acc, s) => acc + s.price, 0) / services.length : 0;
  const tempoMedio = services.length > 0 ? services.reduce((acc, s) => acc + s.durationMinutes, 0) / services.length / 60 : 0;
  const maisRentavel = services.length > 0 ? services.reduce((prev, current) => (prev.profitPerHour! > current.profitPerHour! ? prev : current)) : { name: '-', profitPerHour: 0 };
  const maisVendido = services.length > 0 ? services.reduce((prev, current) => (prev.timesPerformedThisMonth! > current.timesPerformedThisMonth! ? prev : current)) : { name: '-', timesPerformedThisMonth: 0 };

  // Lógica de Filtragem e Ordenação
  const getFilteredServices = () => {
    let result = services.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (activeFilter) {
      case 'sold':
        result = [...result].sort((a, b) => (b.timesPerformedThisMonth || 0) - (a.timesPerformedThisMonth || 0));
        break;
      case 'profit':
        result = [...result].sort((a, b) => (b.profitPerHour || 0) - (a.profitPerHour || 0));
        break;
      case 'time':
        result = [...result].sort((a, b) => b.durationMinutes - a.durationMinutes);
        break;
      default:
        break;
    }

    return result;
  };

  const filteredServices = getFilteredServices();

  const getTagColor = (tag?: string) => {
    switch (tag) {
      case 'Alta margem': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Popular': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Demorado': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Baixa rentabilidade': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  const handleViewUsageHistory = (service: Service) => {
    if (onSetFinanceFilter && onNavigate) {
      onSetFinanceFilter(service.name);
      onNavigate('financeiro');
    }
  };

  const handleSaveService = async () => {
    try {
      if (!newService.name) {
        alert('Por favor, digite o nome do serviço.');
        return;
      }

      await dataService.updateService(newService as Service);
      await onUpdateServices();

      setShowSuccessToast(true);
      setIsAddModalOpen(false);
      setTimeout(() => setShowSuccessToast(false), 3000);
      setNewService({
        name: '', category: 'Tranças', duration: '2h', durationMinutes: 120,
        price: 0, materialCost: 0, indirectCost: 0, repetition: '4 semanas',
        description: '', tag: 'Popular'
      });
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Erro ao salvar serviço. Verifique sua conexão.');
    }
  };

  const handleDeleteService = async () => {
    if (!selectedService) return;

    setIsDeleting(true);
    try {
      await dataService.deleteService(selectedService.id);
      await onUpdateServices();
      setSelectedService(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Erro ao excluir serviço. Verifique se existem agendamentos vinculados a ele.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filterOptions = [
    { id: 'all', label: 'Todos', icon: <ArrowUpDown size={18} /> },
    { id: 'sold', label: 'Mais Vendidos', icon: <Trophy size={18} /> },
    { id: 'profit', label: 'Maior Lucro/Hora', icon: <TrendingUp size={18} /> },
    { id: 'time', label: 'Mais Demorados', icon: <Timer size={18} /> },
  ];

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-500 pb-32">

      {/* Toast Feedback */}
      {showSuccessToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-emerald-500 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top">
          <Check size={14} strokeWidth={4} />
          <span>Serviço Adicionado com Sucesso</span>
        </div>
      )}

      {/* HEADER ESTRATÉGICO */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-black dark:text-white tracking-tighter italic">Portfólio</h2>
          <p className="text-[10px] font-black text-[#C69372] uppercase tracking-[0.3em]">Gestão de Rentabilidade 2.0</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#C69372] text-white w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-[#0a0a0a] p-4 rounded-[28px] border border-black/5 dark:border-white/5 space-y-1 shadow-sm">
          <p className="text-[8px] font-black text-black/30 dark:text-white/20 uppercase tracking-widest">Ticket Médio</p>
          <p className="text-xl font-black text-black dark:text-white">R$ {Math.round(ticketMedio)}</p>
        </div>
        <div className="bg-white dark:bg-[#0a0a0a] p-4 rounded-[28px] border border-black/5 dark:border-white/5 space-y-1 shadow-sm">
          <p className="text-[8px] font-black text-black/30 dark:text-white/20 uppercase tracking-widest">Tempo Médio</p>
          <p className="text-xl font-black text-black dark:text-white">{tempoMedio.toFixed(1)}h</p>
        </div>
        <div className="bg-[#121212] p-4 rounded-[28px] border border-emerald-500/20 space-y-1 shadow-xl col-span-1">
          <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Mais Rentável</p>
          <p className="text-sm font-black text-white truncate">{maisRentavel.name}</p>
          <p className="text-xs font-bold text-emerald-500">R$ {maisRentavel.profitPerHour}/h</p>
        </div>
        <div className="bg-[#121212] p-4 rounded-[28px] border-[#C69372]/20 border space-y-1 shadow-xl col-span-1">
          <p className="text-[8px] font-black text-[#C69372] uppercase tracking-widest">Mais Vendido</p>
          <p className="text-sm font-black text-white truncate">{maisVendido.name}</p>
          <p className="text-xs font-bold text-[#C69372]">{maisVendido.timesPerformedThisMonth} Atend.</p>
        </div>
      </div>

      {/* BUSCA E FILTRO */}
      <div className="flex space-x-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 dark:text-white/10" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar serviço..."
            className="w-full h-12 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl pl-12 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-[#C69372]"
          />
        </div>
        <button
          onClick={() => setIsFilterMenuOpen(true)}
          className={`w-12 h-12 border rounded-2xl flex items-center justify-center transition-all ${activeFilter !== 'all'
            ? 'bg-[#C69372] border-[#C69372] text-white'
            : 'bg-white dark:bg-[#0a0a0a] border-black/5 dark:border-white/10 text-black/40 dark:text-white/20'
            }`}
        >
          <Filter size={18} />
        </button>
      </div>

      {/* LISTA DE SERVIÇOS ESTRATÉGICA */}
      <div className="space-y-4">
        {filteredServices.map(service => (
          <div
            key={service.id}
            onClick={() => setSelectedService(service)}
            className="bg-white dark:bg-[#0a0a0a] rounded-[32px] border border-black/5 dark:border-white/5 overflow-hidden shadow-sm group active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all border border-black/5">
                    <img src={service.image} className="w-full h-full object-cover" alt={service.name} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-lg font-black text-black dark:text-white tracking-tight leading-tight truncate">{service.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${getTagColor(service.tag)}`}>
                        {service.tag}
                      </span>
                      <span className="text-[9px] text-black/30 dark:text-white/20 font-bold uppercase">{service.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-[#C69372]">R$ {service.price}</p>
                  <p className="text-[8px] font-black text-emerald-500 uppercase">Lucro R$ {service.price - service.materialCost - (service.indirectCost || 0)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-black/[0.03] dark:border-white/5">
                <div className="flex items-center space-x-1 text-blue-500">
                  <TrendingUp size={12} />
                  <span className="text-[10px] font-black uppercase tracking-widest">R$ {service.profitPerHour}/h</span>
                </div>
                <ChevronRight size={16} className="text-black/10 dark:text-white/10" />
              </div>
            </div>
          </div>
        ))}
        {filteredServices.length === 0 && (
          <div className="py-20 text-center text-white/10 italic text-sm">
            Nenhum serviço encontrado.
          </div>
        )}
      </div>

      {/* 🌪️ MODAL: MENU DE FILTROS */}
      {isFilterMenuOpen && (
        <div className="fixed inset-0 z-[160] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setIsFilterMenuOpen(false)}></div>
          <div className="bg-[#0c0c0c] border-t border-white/10 w-full rounded-t-[40px] p-8 pb-12 space-y-6 relative z-10 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-2"></div>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white">Ordenar Serviços</h3>
              <button onClick={() => setIsFilterMenuOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              {filterOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => { setActiveFilter(opt.id as FilterOption); setIsFilterMenuOpen(false); }}
                  className={`w-full flex items-center space-x-4 p-5 rounded-[24px] border transition-all ${activeFilter === opt.id
                    ? 'bg-[#C69372]/20 border-[#C69372]/40 text-[#C69372]'
                    : 'bg-white/5 border-white/5 text-white/40'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeFilter === opt.id ? 'bg-[#C69372] text-white' : 'bg-white/5'}`}>
                    {opt.icon}
                  </div>
                  <span className="font-black text-sm uppercase tracking-widest">{opt.label}</span>
                  {activeFilter === opt.id && <Check className="ml-auto" size={18} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ➕ MODAL: NOVO SERVIÇO */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[150] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="bg-[#0c0c0c] border-t border-white/10 w-full rounded-t-[40px] p-8 pb-12 space-y-8 relative z-10 animate-in slide-in-from-bottom duration-500 max-h-[95dvh] overflow-y-auto hide-scrollbar shadow-2xl">
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-2"></div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white tracking-tight">Novo Serviço</h3>
                <p className="text-[10px] text-[#C69372] font-black uppercase tracking-[0.2em]">Configuração de Rentabilidade</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 active:scale-90 transition-transform"><X size={20} /></button>
            </div>

            {/* Form Fields... */}
            <div className="space-y-5">
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] px-1 flex items-center">
                <Info size={12} className="mr-2" /> Informações Básicas
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Nome do Procedimento</label>
                  <input
                    type="text"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    placeholder="Ex: Box Braids Média"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold outline-none focus:border-[#C69372]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Categoria</label>
                  <select
                    value={newService.category}
                    onChange={(e) => setNewService({ ...newService, category: e.target.value as any })}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold outline-none appearance-none"
                  >
                    <option value="Tranças">Tranças</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Retoque">Retoque</option>
                    <option value="Tratamento">Tratamento</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Valor Cobrado (R$)</label>
                  <input
                    type="number"
                    value={newService.price || ''}
                    onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                    placeholder="0,00"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-emerald-500 font-black outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Tempo (minutos)</label>
                  <input
                    type="number"
                    value={newService.durationMinutes || ''}
                    onChange={(e) => setNewService({ ...newService, durationMinutes: Number(e.target.value), duration: `${Math.floor(Number(e.target.value) / 60)}h` })}
                    placeholder="Ex: 360"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold outline-none focus:border-[#C69372]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Frequência sugerida</label>
                  <select
                    value={newService.repetition}
                    onChange={(e) => setNewService({ ...newService, repetition: e.target.value })}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold outline-none appearance-none"
                  >
                    <option value="4 semanas">4 semanas</option>
                    <option value="6 semanas">6 semanas</option>
                    <option value="8 semanas">8 semanas</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <h4 className="text-[10px] font-black text-[#C69372] uppercase tracking-[0.3em] px-1 flex items-center">
                <DollarSign size={12} className="mr-2" /> Inteligência de Custos
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Custo de Material (R$)</label>
                  <input
                    type="number"
                    value={newService.materialCost || ''}
                    onChange={(e) => setNewService({ ...newService, materialCost: Number(e.target.value) })}
                    placeholder="Ex: 80"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-red-500 font-black outline-none focus:border-red-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Custos Indiretos (R$)</label>
                  <input
                    type="number"
                    value={newService.indirectCost || ''}
                    onChange={(e) => setNewService({ ...newService, indirectCost: Number(e.target.value) })}
                    placeholder="Luz, aluguel, etc"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-red-400 font-bold outline-none"
                  />
                </div>
              </div>

              <div className="bg-[#121212] border border-[#C69372]/20 rounded-[32px] p-6 space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#C69372]/5 rounded-full blur-2xl"></div>
                <div className="flex items-center space-x-2 text-[10px] font-black text-[#C69372] uppercase tracking-[0.2em] relative z-10">
                  <Calculator size={14} />
                  <span>Análise Prévia de Lucro</span>
                </div>
                <div className="grid grid-cols-3 gap-2 relative z-10">
                  <div className="text-center">
                    <p className="text-[8px] font-black text-white/20 uppercase">Lucro Real</p>
                    <p className="text-lg font-black text-emerald-500">R$ {profit}</p>
                  </div>
                  <div className="text-center border-x border-white/5">
                    <p className="text-[8px] font-black text-white/20 uppercase">Margem</p>
                    <p className="text-lg font-black text-[#C69372]">{margin}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-black text-white/20 uppercase">Lucro/Hora</p>
                    <p className="text-lg font-black text-blue-400">R$ {profitPerHour}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <button
                onClick={handleSaveService}
                className="w-full py-5 bg-[#C69372] text-white rounded-[24px] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center space-x-3 shadow-xl active:scale-95 transition-transform"
              >
                <Save size={20} />
                <span>Salvar Estratégia</span>
              </button>
              <button onClick={() => setIsAddModalOpen(false)} className="w-full py-4 text-white/20 font-black text-[10px] uppercase tracking-widest">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PERFORMANCE E SIMULAÇÃO */}
      {selectedService && (
        <div className="fixed inset-0 z-[110] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in" onClick={() => setSelectedService(null)}></div>
          <div className="bg-[#0c0c0c] border-t border-white/10 w-full rounded-t-[40px] p-6 pb-12 space-y-6 relative z-10 animate-in slide-in-from-bottom duration-500 max-h-[90dvh] overflow-y-auto hide-scrollbar shadow-2xl">
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-2"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-[24px] overflow-hidden border-2 border-[#C69372]/30 shrink-0 shadow-lg">
                  <img src={selectedService.image} alt="Serviço" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white leading-tight">{selectedService.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-[#C69372] font-black uppercase tracking-[0.2em]">{selectedService.category}</span>
                    <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                    <span className="text-[10px] text-white/30 font-bold uppercase">{selectedService.duration}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedService(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 active:scale-90 transition-transform"><X size={20} /></button>
            </div>

            {/* PAINEL DE PERFORMANCE */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-[#C69372] uppercase tracking-[0.3em] px-2">Performance Mensal</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#121212] p-5 rounded-[32px] border border-white/5 space-y-1">
                  <p className="text-[9px] font-black text-white/20 uppercase">Realizados</p>
                  <p className="text-2xl font-black text-white">{selectedService.timesPerformedThisMonth}</p>
                </div>
                <div className="bg-[#121212] p-5 rounded-[32px] border border-white/5 space-y-1">
                  <p className="text-[9px] font-black text-white/20 uppercase">Receita Bruta</p>
                  <p className="text-2xl font-black text-emerald-500">R$ {selectedService.totalRevenueMonth}</p>
                </div>
                <div className="bg-[#121212] p-5 rounded-[32px] border border-white/5 space-y-1">
                  <p className="text-[9px] font-black text-white/20 uppercase">Tempo Investido</p>
                  <p className="text-2xl font-black text-white">{Math.round((selectedService.timesPerformedThisMonth! * selectedService.durationMinutes) / 60)}h</p>
                </div>
                <div className="bg-[#121212] p-5 rounded-[32px] border border-white/5 space-y-1">
                  <p className="text-[9px] font-black text-white/20 uppercase">Margem Real</p>
                  <p className="text-2xl font-black text-[#C69372]">{selectedService.profitMargin}%</p>
                </div>
              </div>
            </div>

            {/* ALERTAS INTELIGENTES */}
            <div className="bg-[#C69372]/5 border border-[#C69372]/20 p-5 rounded-[32px] flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-[#C69372]/10 flex items-center justify-center text-[#C69372] shrink-0">
                <Zap size={18} fill="currentColor" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-white uppercase tracking-wider italic">Insight da IA Raízes</p>
                <p className="text-xs text-white/60 leading-relaxed font-medium">
                  {selectedService.tag === 'Alta margem'
                    ? "Este serviço é altamente rentável. Considere promovê-lo no Instagram para aumentar seu faturamento sem ocupar toda a agenda."
                    : "Serviço com tempo de execução alto. Tente otimizar os processos ou ajustar o valor para manter a lucratividade desejada."}
                </p>
              </div>
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => setIsSimulatorOpen(true)}
                className="w-full py-5 bg-[#C69372] text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center space-x-3 shadow-xl active:scale-95 transition-transform"
              >
                <BarChart4 size={18} />
                <span>Simular Crescimento</span>
              </button>

              <button
                onClick={() => handleViewUsageHistory(selectedService)}
                className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center space-x-3 shadow-xl active:scale-95 transition-transform"
              >
                <History size={18} />
                <span>Ver Histórico de Uso</span>
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-5 bg-red-500/5 border border-red-500/20 text-red-500 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center space-x-3 shadow-xl active:scale-95 transition-transform"
              >
                <Trash2 size={18} />
                <span>Excluir Serviço</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⚠️ DELETE CONFIRMATION ALERT */}
      {showDeleteConfirm && selectedService && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => !isDeleting && setShowDeleteConfirm(false)}></div>
          <div className="bg-[#0c0c0c] border border-red-900/20 w-full max-w-xs rounded-[32px] p-8 space-y-8 relative z-10 animate-in zoom-in duration-300 shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto border border-red-500/20">
              <AlertTriangle size={40} />
            </div>
            <div className="space-y-3">
              <h4 className="text-2xl font-black text-white uppercase tracking-tight leading-none italic">Excluir?</h4>
              <p className="text-sm text-white/40 leading-relaxed font-medium">Tem certeza que deseja apagar permanentemente o serviço <span className="text-white font-bold">{selectedService.name}</span>?</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteService}
                disabled={isDeleting}
                className="w-full py-5 bg-red-500 text-white font-black rounded-2xl active:scale-95 transition-transform uppercase tracking-widest text-xs flex items-center justify-center space-x-2"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                <span>{isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}</span>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="w-full py-5 bg-white/5 text-white/60 font-black rounded-2xl active:bg-white/10 transition-colors uppercase tracking-widest text-xs"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIMULADOR DE CRESCIMENTO */}
      {isSimulatorOpen && selectedService && (
        <div className="fixed inset-0 z-[120] flex flex-col justify-center p-6">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-2xl animate-in fade-in" onClick={() => setIsSimulatorOpen(false)}></div>
          <div className="bg-[#0c0c0c] border border-white/10 rounded-[40px] p-8 space-y-10 relative z-10 animate-in zoom-in duration-300 shadow-2xl text-center">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-[#C69372]/10 rounded-full flex items-center justify-center text-[#C69372] mx-auto mb-4 border border-[#C69372]/20">
                <Calculator size={32} />
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Simulador Raízes</h3>
              <p className="text-xs text-white/30 font-medium leading-relaxed">Projeção baseada em: <span className="text-white font-bold">{selectedService.name}</span></p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                  <span>Volume mensal</span>
                  <span className="text-[#C69372]">{simCount} atendimentos</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={simCount}
                  onChange={(e) => setSimCount(Number(e.target.value))}
                  className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#C69372]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-left">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Receita Estimada</p>
                  <p className="text-xl font-black text-emerald-500">R$ {(simCount * selectedService.price).toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-left">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Lucro Real</p>
                  <p className="text-xl font-black text-white">R$ {(simCount * (selectedService.price - selectedService.materialCost - (selectedService.indirectCost || 0))).toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-left col-span-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Tempo de Agenda</p>
                      <p className="text-xl font-black text-blue-400">{Math.round((simCount * selectedService.durationMinutes) / 60)} horas/mês</p>
                    </div>
                    <div className="bg-blue-500/10 p-2 rounded-xl text-blue-400">
                      <Clock size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsSimulatorOpen(false)}
              className="w-full py-5 bg-white text-black font-black rounded-2xl active:scale-95 transition-transform uppercase tracking-widest text-xs"
            >
              Fechar Simulação
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesView;
