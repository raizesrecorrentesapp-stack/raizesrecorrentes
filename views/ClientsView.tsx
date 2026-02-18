
import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, MessageSquare, ChevronRight, Zap, 
  Clock, AlertTriangle, Users, UserPlus, Info, BarChart3, Briefcase, 
  CheckCircle2, Sparkles, RefreshCw, BarChart4
} from 'lucide-react';
import { Client, Screen } from '../types';

interface ClientsViewProps {
  clients: Client[];
  onSelectClient: (id: string) => void;
  onNavigate?: (screen: Screen) => void;
}

type ClientFilter = 'all' | 'active' | 'risk' | 'vip' | 'new' | 'inactive';

const ClientsView: React.FC<ClientsViewProps> = ({ clients, onSelectClient, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<ClientFilter>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter(c => c.status === 'ATIVA').length,
    risk: clients.filter(c => c.status === 'EM RISCO').length,
    inactive: clients.filter(c => c.status === 'INATIVA').length,
  }), [clients]);

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = 
        activeFilter === 'all' || 
        (activeFilter === 'active' && c.status === 'ATIVA') ||
        (activeFilter === 'risk' && c.status === 'EM RISCO') ||
        (activeFilter === 'inactive' && c.status === 'INATIVA') ||
        (activeFilter === 'vip' && c.avgTicket >= 400) ||
        (activeFilter === 'new' && c.totalVisits <= 2);
      return matchesSearch && matchesFilter;
    });
  }, [clients, searchTerm, activeFilter]);

  const handleWhatsApp = (client: Client) => {
    const msg = encodeURIComponent(`Oi ${client.name} 💛 já faz algum tempo desde sua última trança. Quer reservar um horário para essa semana?`);
    window.open(`https://wa.me/${client.phone.replace(/\D/g,'')}?text=${msg}`, '_blank');
  };

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-500 pb-32 overflow-x-hidden">
      
      {/* 💼 VISÃO GERAL DA CARTEIRA */}
      <div className="bg-[#121212] rounded-[32px] p-6 border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-bronze/5 rounded-full blur-[80px]"></div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-bronze/20 rounded-xl flex items-center justify-center text-bronze">
                <Briefcase size={18} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">Gestão de Carteira</h3>
                <p className="text-xs font-bold text-white/90">Saúde da sua base</p>
              </div>
            </div>
            <BarChart4 size={18} className="text-white/10" />
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <div className="space-y-0.5">
              <p className="text-4xl font-black text-white tracking-tighter italic">{stats.total}</p>
              <div className="flex items-center space-x-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                 <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Total Clientes</p>
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-4xl font-black text-emerald-500 tracking-tighter italic">{stats.active}</p>
              <div className="flex items-center space-x-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                 <p className="text-[8px] font-black text-emerald-500/60 uppercase tracking-widest">Ativos</p>
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-4xl font-black text-red-500 tracking-tighter italic">{stats.risk}</p>
              <div className="flex items-center space-x-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                 <p className="text-[8px] font-black text-red-500/60 uppercase tracking-widest">Em Risco</p>
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-4xl font-black text-white/20 tracking-tighter italic">{stats.inactive}</p>
              <div className="flex items-center space-x-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                 <p className="text-[8px] font-black text-white/10 uppercase tracking-widest">Inativas</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => onNavigate?.('ai-analysis')}
            className="w-full py-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-2xl text-[9px] font-black text-bronze uppercase tracking-[0.2em] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles size={12} fill="currentColor" />
            <span>VER RELATÓRIO COMPLETO</span>
          </button>
        </div>
      </div>

      {/* 🔎 BUSCA + FILTROS */}
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 dark:text-white/10" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome..." 
            className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-2xl pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-bronze/30 transition-all shadow-sm"
          />
        </div>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border ${activeFilter !== 'all' ? 'bg-bronze text-white border-bronze shadow-lg' : 'bg-white dark:bg-[#0a0a0a] border-black/10 dark:border-white/10 text-black/40 dark:text-white/20 shadow-sm'}`}
        >
          <Filter size={20} />
        </button>
      </div>

      {isFilterOpen && (
        <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar -mx-4 px-4 animate-in slide-in-from-top-4 duration-300">
          {[
            { id: 'all', label: 'Todos', icon: <Users size={12} /> },
            { id: 'active', label: 'Ativas', icon: <CheckCircle2 size={12} /> },
            { id: 'risk', label: 'Em Risco', icon: <AlertTriangle size={12} /> },
            { id: 'vip', label: 'VIPs', icon: <BarChart3 size={12} /> },
            { id: 'new', label: 'Novos', icon: <UserPlus size={12} /> },
            { id: 'inactive', label: 'Inativos', icon: <Clock size={12} /> },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as ClientFilter)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all border font-black text-[10px] uppercase tracking-widest ${activeFilter === f.id ? 'bg-bronze border-bronze text-white shadow-lg' : 'bg-white dark:bg-[#0a0a0a] border-black/5 dark:border-white/5 text-black/40 dark:text-white/30'}`}
            >
              {f.icon}
              <span>{f.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* 🔥 REATIVAÇÃO INTELIGENTE */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 px-1">
          <Zap size={14} className="text-bronze" fill="currentColor" />
          <h3 className="text-[11px] font-black text-bronze uppercase tracking-[0.2em]">Reativação Recomendada</h3>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4">
          {clients.filter(c => c.status === 'EM RISCO').map(client => (
            <div key={client.id} className="min-w-[300px] bg-[#121212] border border-red-500/20 rounded-[32px] p-6 space-y-5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden grayscale border border-white/10">
                    <img src={client.avatar} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-white font-black leading-tight">{client.name}</h4>
                    <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">Ciclo Vencido</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Última Visita</p>
                  <p className="text-xs font-black text-white">{client.lastVisit}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4">
                 <div>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Frequência</p>
                    <p className="text-sm font-black text-white">{client.frequency}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Atendimentos</p>
                    <p className="text-sm font-black text-bronze">{client.totalVisits} sessões</p>
                 </div>
              </div>
              <div className="flex space-x-2 pt-1">
                <button 
                  onClick={() => handleWhatsApp(client)}
                  className="flex-1 py-3.5 bg-bronze text-white rounded-xl font-black text-[10px] uppercase tracking-[0.1em] flex items-center justify-center space-x-2 active:scale-95 transition-all shadow-lg shadow-bronze/20"
                >
                  <MessageSquare size={14} fill="currentColor" />
                  <span>Enviar Mensagem</span>
                </button>
                <button 
                  onClick={() => onSelectClient(client.id)}
                  className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 active:bg-white/10 transition-colors"
                >
                  <Info size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[11px] font-black text-black/40 dark:text-white/20 uppercase tracking-[0.2em]">Fichas de Clientes</h3>
          <span className="text-[9px] font-black text-bronze uppercase">{filteredClients.length} Cadastros</span>
        </div>
        <div className="space-y-3 pb-10">
          {filteredClients.map(client => (
            <div 
              key={client.id} 
              onClick={() => onSelectClient(client.id)}
              className="bg-white dark:bg-[#0a0a0a] p-5 rounded-[28px] border border-black/5 dark:border-white/5 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 grayscale group-hover:grayscale-0 transition-all shrink-0 shadow-inner">
                  <img src={client.avatar} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-black text-base leading-tight truncate">{client.name}</h4>
                    <div className={`w-2 h-2 rounded-full ${client.status === 'ATIVA' ? 'bg-emerald-500' : client.status === 'EM RISCO' ? 'bg-red-500' : 'bg-black/20 dark:bg-white/10'}`}></div>
                  </div>
                  <div className="flex items-center space-x-3 mt-1.5">
                    <div className="flex items-center space-x-1">
                      <BarChart3 size={10} className="text-bronze" />
                      <span className="text-[9px] text-black/40 dark:text-white/30 font-bold uppercase">{client.totalVisits} visitas</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RefreshCw size={10} className="text-blue-500" />
                      <span className="text-[9px] text-black/40 dark:text-white/30 font-bold uppercase">{client.frequency}</span>
                    </div>
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="text-black/10 dark:text-white/10 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientsView;
