
import React, { useState } from 'react';
import { Client, Screen } from '../types';
import { 
  RefreshCw, Zap, TrendingUp, AlertTriangle, MessageSquare, 
  Users, UserPlus, Star, Clock, ArrowRight, Target, 
  BarChart3, Sparkles, Megaphone, Heart, ShieldCheck
} from 'lucide-react';

interface RecurrenceViewProps {
  clients: Client[];
  studioName: string;
  onNavigate?: (screen: Screen) => void;
}

type Segment = 'all' | 'vip' | 'new' | 'inactive' | 'loyal';

const RecurrenceView: React.FC<RecurrenceViewProps> = ({ clients, studioName, onNavigate }) => {
  const [activeSegment, setActiveSegment] = useState<Segment>('all');
  
  // Cálculos de Negócio (Mockados baseados em MOCK_CLIENTS)
  const totalClients = clients.length;
  const actives = clients.filter(c => c.status === 'ATIVA').length;
  const returnRate = Math.round((actives / totalClients) * 100);
  
  const riskyClients = clients.filter(c => c.status === 'EM RISCO' || c.status === 'INATIVA');
  const revenueAtRisk = riskyClients.reduce((acc, c) => acc + c.avgTicket, 0);
  
  const statusColor = returnRate > 70 ? 'text-emerald-500' : returnRate > 40 ? 'text-amber-500' : 'text-red-500';
  const statusLabel = returnRate > 70 ? 'Recorrência Forte' : returnRate > 40 ? 'Recorrência Instável' : 'Recorrência Crítica';

  const segments = [
    { id: 'all', label: 'Todos', icon: <Users size={14} /> },
    { id: 'vip', label: 'VIPs', icon: <Star size={14} /> },
    { id: 'loyal', label: 'Fiéis', icon: <Heart size={14} /> },
    { id: 'new', label: 'Novos', icon: <UserPlus size={14} /> },
    { id: 'inactive', label: 'Inativos', icon: <Clock size={14} /> },
  ];

  const getFilteredClients = () => {
    switch(activeSegment) {
      case 'vip': return clients.filter(c => c.avgTicket > 400);
      case 'loyal': return clients.filter(c => c.totalVisits > 5);
      case 'new': return clients.filter(c => c.totalVisits <= 2);
      case 'inactive': return clients.filter(c => c.status === 'INATIVA');
      default: return clients;
    }
  };

  const campaignOptions = [
    { title: 'Volta com 10% OFF', desc: 'Para inativos há +60 dias', icon: <Zap size={18} /> },
    { title: 'Manutenção Preventiva', desc: 'Para clientes em ciclo de 45 dias', icon: <RefreshCw size={18} /> },
    { title: 'Upgrade de Serviço', desc: 'Nagô Design para clientes VIP', icon: <Sparkles size={18} /> },
  ];

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-500 pb-32">
      
      {/* 1️⃣ CARD PRINCIPAL: SAÚDE DA RECORRÊNCIA */}
      <div className="bg-white dark:bg-[#0a0a0a] rounded-[40px] p-8 border border-black/5 dark:border-white/5 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-bronze/5 rounded-full blur-3xl"></div>
        
        <div className="text-center space-y-4 relative z-10">
          <div className="flex flex-col items-center space-y-2">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusColor.replace('text', 'bg').replace('500', '500/10')} ${statusColor.replace('text', 'border').replace('500', '500/20')} ${statusColor}`}>
              <ShieldCheck size={12} />
              <span>{statusLabel}</span>
            </div>
            <h3 className="text-7xl font-black text-black dark:text-white tracking-tighter">{returnRate}%</h3>
            <p className="text-[11px] font-black text-bronze uppercase tracking-[0.3em]">Taxa de Retorno Mensal</p>
            <p className="text-[10px] text-black/30 dark:text-white/20 font-medium px-8 italic leading-tight">
              % de clientes que retornaram dentro do ciclo ideal de atendimento.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-6 border-t border-black/5 dark:border-white/5 relative z-10">
          <div className="text-center space-y-1">
            <p className="text-[8px] font-black text-black/20 dark:text-white/20 uppercase tracking-widest">Média Ciclo</p>
            <p className="text-sm font-black text-black dark:text-white">45 dias</p>
          </div>
          <div className="text-center space-y-1 border-x border-black/5 dark:border-white/5">
            <p className="text-[8px] font-black text-black/20 dark:text-white/20 uppercase tracking-widest">Prev. 30d</p>
            <p className="text-sm font-black text-emerald-500">R$ 12.4k</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-[8px] font-black text-black/20 dark:text-white/20 uppercase tracking-widest">Mensal</p>
            <p className="text-sm font-black text-bronze">+8%</p>
          </div>
        </div>
      </div>

      {/* 2️⃣ PREVISÃO DE PERDA (IA INSIGHT) */}
      <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-[32px] space-y-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-5">
           <AlertTriangle size={120} />
        </div>
        <div className="flex items-center space-x-2 text-red-500 relative z-10">
           <AlertTriangle size={16} fill="currentColor" />
           <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Se nada mudar...</h4>
        </div>
        <p className="text-sm font-medium text-black/70 dark:text-white/70 leading-relaxed relative z-10">
          Você pode perder <span className="font-black text-red-500">{riskyClients.length} clientes</span> nos próximos 30 dias. 
          Impacto financeiro: <span className="font-black">R$ {revenueAtRisk.toLocaleString()}</span>.
        </p>
        <button 
          onClick={() => setActiveSegment('inactive')}
          className="bg-red-500 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 active:scale-95 transition-transform relative z-10 shadow-lg shadow-red-500/20"
        >
          <span>Criar Campanha de Reativação</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 3️⃣ FIDELIZAÇÃO & KPI */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-[32px] border border-black/5 dark:border-white/5 space-y-3">
          <div className="flex items-center space-x-2 text-bronze">
             <Target size={14} />
             <p className="text-[9px] font-black uppercase tracking-widest">Índice Fidelidade</p>
          </div>
          <div className="space-y-1">
             <h4 className="text-3xl font-black text-black dark:text-white">68<span className="text-sm text-black/30 dark:text-white/20">/100</span></h4>
             <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-bronze rounded-full" style={{ width: '68%' }}></div>
             </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-[32px] border border-black/5 dark:border-white/5 space-y-3">
          <div className="flex items-center space-x-2 text-blue-500">
             <BarChart3 size={14} />
             <p className="text-[9px] font-black uppercase tracking-widest">Engajamento</p>
          </div>
          <div className="space-y-1">
             <h4 className="text-3xl font-black text-black dark:text-white">74%</h4>
             <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '74%' }}></div>
             </div>
          </div>
        </div>
      </div>

      {/* 4️⃣ SEGMENTAÇÃO INTELIGENTE */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-1">
           <h3 className="text-[11px] font-black text-black/40 dark:text-white/20 uppercase tracking-[0.2em]">Segmentação Estratégica</h3>
           <Users size={16} className="text-black/20 dark:text-white/10" />
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar -mx-4 px-4">
          {segments.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSegment(s.id as Segment)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all border ${
                activeSegment === s.id 
                ? 'bg-bronze border-bronze text-white shadow-lg shadow-bronze/20' 
                : 'bg-white dark:bg-[#0a0a0a] border-black/5 dark:border-white/5 text-black/40 dark:text-white/40 active:bg-black/5'
              }`}
            >
              {s.icon}
              <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {getFilteredClients().map(client => (
            <div 
              key={client.id} 
              className="bg-white dark:bg-[#0a0a0a] p-4 rounded-[28px] border border-black/5 dark:border-white/5 flex items-center justify-between shadow-sm group active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 grayscale group-hover:grayscale-0 transition-all">
                  <img src={client.avatar} className="w-full h-full object-cover" alt={client.name} />
                </div>
                <div>
                  <h4 className="font-black text-sm text-black dark:text-white">{client.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest ${
                      client.status === 'ATIVA' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {client.status}
                    </span>
                    <span className="text-[8px] text-black/20 dark:text-white/20 font-bold uppercase tracking-widest">
                      {client.totalVisits} visitas
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${client.phone.replace(/\D/g,'')}`, '_blank'); }}
                className="w-10 h-10 bg-black/[0.03] dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl flex items-center justify-center text-bronze active:scale-90 transition-transform"
              >
                <MessageSquare size={18} fill="currentColor" />
              </button>
            </div>
          ))}
          {getFilteredClients().length === 0 && (
            <div className="py-12 text-center text-black/10 dark:text-white/10 italic text-xs">
              Nenhuma cliente encontrada neste segmento.
            </div>
          )}
        </div>
      </div>

      {/* 5️⃣ CAMPANHAS DE VENDAS */}
      <div className="space-y-5">
        <div className="flex items-center space-x-2 px-1">
           <Megaphone size={16} className="text-bronze" />
           <h3 className="text-[11px] font-black text-black/40 dark:text-white/20 uppercase tracking-[0.2em]">Campanhas de Vendas</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {campaignOptions.map((opt, i) => (
            <button 
              key={i}
              className="bg-white dark:bg-[#0a0a0a] p-5 rounded-[32px] border border-black/5 dark:border-white/5 flex items-center justify-between group active:scale-[0.98] transition-all text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-bronze/10 flex items-center justify-center text-bronze shadow-inner transition-transform group-hover:scale-110">
                   {opt.icon}
                </div>
                <div>
                   <h5 className="text-sm font-black text-black dark:text-white uppercase tracking-tight">{opt.title}</h5>
                   <p className="text-[9px] text-black/40 dark:text-white/20 font-black uppercase tracking-widest leading-tight">{opt.desc}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-black/10 dark:text-white/10 group-hover:text-bronze transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* QUICK ACTIONS FIXED FOOTER (SIMULADO) */}
      <div className="pt-4 text-center">
         <p className="text-[8px] font-black text-black/10 dark:text-white/10 uppercase tracking-[0.5em] leading-relaxed italic">
           SISTEMA DE ANTECIPAÇÃO RAÍZES v3.0<br/>
           DADOS ANALISADOS EM TEMPO REAL
         </p>
      </div>
    </div>
  );
};

export default RecurrenceView;
