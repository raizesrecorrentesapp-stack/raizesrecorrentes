
import React from 'react';
import { Screen } from '../types';
import { 
  Package, Target, RefreshCw, Scissors, 
  Settings, ChevronRight, User, ShieldCheck, 
  DollarSign, HelpCircle, Star, Sparkles,
  Smartphone, Bell, Zap, TrendingUp, ShieldAlert,
  ArrowRight, CreditCard, Lock, Fingerprint
} from 'lucide-react';

interface MoreViewProps {
  onNavigate: (screen: Screen) => void;
}

const MoreView: React.FC<MoreViewProps> = ({ onNavigate }) => {
  const sections = [
    { 
      title: 'CRESCIMENTO DO NEGÓCIO',
      subtitle: 'Estratégia & Expansão',
      items: [
        { id: 'servicos', label: 'Catálogo de Serviços', icon: <Scissors size={20} />, desc: 'Preços, duração, margem e posicionamento', color: 'text-bronze' },
        { id: 'metas', label: 'Minhas Metas', icon: <Target size={20} />, desc: 'Planejamento de faturamento e lucro', color: 'text-emerald-500' },
        { id: 'recorrencia', label: 'IA de Retenção', icon: <RefreshCw size={20} />, desc: 'Clientes em risco e previsibilidade', color: 'text-blue-500' },
      ]
    },
    { 
      title: 'CONTROLE OPERACIONAL',
      subtitle: 'Operação Diária',
      items: [
        { id: 'estoque', label: 'Gestão de Estoque', icon: <Package size={20} />, desc: 'Materiais, insumos e impacto no lucro', color: 'text-amber-500' },
        { id: 'financeiro', label: 'Fluxo Financeiro', icon: <DollarSign size={20} />, desc: 'Entradas, saídas e extratos detalhados', color: 'text-emerald-600' },
        { id: 'alertas', label: 'Central de Alertas', icon: <Bell size={20} />, desc: 'Avisos inteligentes e preventivos', color: 'text-red-500' },
      ]
    }
  ];

  return (
    <div className="p-5 space-y-12 animate-in fade-in duration-500 pb-32">
      {/* Header Premium */}
      <div className="flex items-end justify-between px-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} className="text-bronze" />
            <span className="text-[10px] font-black text-bronze uppercase tracking-[0.4em]">Business Center</span>
          </div>
          <h2 className="text-4xl font-black text-black dark:text-white tracking-tighter italic leading-none">Gestão</h2>
          <p className="text-[11px] font-bold text-black/30 dark:text-white/20 uppercase tracking-widest">Evolua seu estúdio</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/5 shadow-inner">
           <Smartphone size={20} className="text-black/20 dark:text-white/20" />
        </div>
      </div>

      {/* Seções Dinâmicas (Crescimento e Controle) */}
      <div className="space-y-14">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <div className="px-4 space-y-0.5">
              <h4 className="text-[11px] font-black text-black dark:text-white tracking-[0.2em]">{section.title}</h4>
              <p className="text-[9px] font-black text-bronze uppercase tracking-[0.1em] opacity-60 italic">{section.subtitle}</p>
            </div>
            <div className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-[40px] overflow-hidden shadow-sm card-shadow">
              {section.items.map((item, i) => (
                <React.Fragment key={item.id + i}>
                  <button 
                    onClick={() => onNavigate(item.id as Screen)}
                    className="w-full px-6 py-7 flex items-center justify-between active:bg-black/[0.02] dark:active:bg-white/[0.02] transition-colors group touch-manipulation"
                  >
                    <div className="flex items-center space-x-5">
                      <div className={`w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center ${item.color} border border-black/5 dark:border-white/5 shadow-inner transition-transform group-active:scale-90`}>
                        {item.icon}
                      </div>
                      <div className="text-left">
                        <span className="block font-black text-[15px] text-black dark:text-white uppercase tracking-tight leading-none mb-1.5">{item.label}</span>
                        <span className="text-[10px] text-black/40 dark:text-white/20 uppercase tracking-widest font-black italic">{item.desc}</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-black/10 dark:text-white/10 transition-all group-hover:text-bronze group-active:translate-x-1">
                      <ChevronRight size={20} />
                    </div>
                  </button>
                  {i < section.items.length - 1 && (
                    <div className="h-px bg-black/[0.03] dark:bg-white/[0.03] mx-6"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* BLOCO 3 — PROTEÇÃO DO NEGÓCIO (Card Diferenciado) */}
      <div className="space-y-4">
        <div className="px-4 space-y-0.5">
          <h4 className="text-[11px] font-black text-black dark:text-white tracking-[0.2em]">PROTEÇÃO DO NEGÓCIO</h4>
          <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.1em] opacity-60 italic">Segurança & Continuidade</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Card Premium de Assinatura */}
          <button className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0c0c0c] border border-white/10 rounded-[40px] p-7 text-left shadow-2xl overflow-hidden group active:scale-[0.98] transition-all">
             <div className="absolute -right-6 -top-6 w-32 h-32 bg-bronze/10 rounded-full blur-3xl group-hover:bg-bronze/20 transition-colors"></div>
             <div className="relative z-10 flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-bronze rounded-2xl flex items-center justify-center text-white shadow-lg shadow-bronze/20">
                   <Star size={22} fill="currentColor" />
                </div>
                <div className="bg-bronze/10 border border-bronze/30 px-3 py-1 rounded-full">
                   <span className="text-[9px] font-black text-bronze uppercase tracking-[0.2em]">Assinante Pro</span>
                </div>
             </div>
             <div className="relative z-10 space-y-1">
                <h5 className="text-lg font-black text-white uppercase tracking-tight">Assinatura Premium</h5>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest leading-relaxed italic">Gerenciar plano e recursos ativos</p>
             </div>
             <div className="relative z-10 pt-4 flex items-center text-bronze text-[10px] font-black uppercase tracking-widest">
                <span>Acessar Benefícios</span>
                <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
             </div>
          </button>

          {/* Card de Segurança */}
          <button 
            onClick={() => onNavigate('ajustes')}
            className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-[32px] p-6 flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center space-x-5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-inner">
                <ShieldCheck size={20} />
              </div>
              <div className="text-left">
                <span className="block font-black text-sm text-black dark:text-white uppercase tracking-tight">Segurança</span>
                <span className="text-[9px] text-black/40 dark:text-white/20 uppercase tracking-widest font-black italic">Acessos, senha e backup</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-black/10 dark:text-white/10 group-hover:text-blue-500" />
          </button>
        </div>
      </div>

      {/* BLOCO 4 — CONFIGURAÇÃO DO ESTÚDIO */}
      <div className="space-y-4">
        <div className="px-4 space-y-0.5">
          <h4 className="text-[11px] font-black text-black dark:text-white tracking-[0.2em]">CONFIGURAÇÃO DO ESTÚDIO</h4>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.1em] opacity-60 italic">Identidade & Preferências</p>
        </div>
        
        <div className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-[40px] overflow-hidden shadow-sm">
          <button 
            onClick={() => onNavigate('ajustes')}
            className="w-full px-6 py-6 flex items-center justify-between active:bg-black/[0.02] dark:active:bg-white/[0.02] transition-colors group"
          >
            <div className="flex items-center space-x-5">
              <div className="w-10 h-10 rounded-xl bg-bronze/10 flex items-center justify-center text-bronze">
                <User size={20} />
              </div>
              <div className="text-left">
                <span className="block font-black text-sm text-black dark:text-white uppercase tracking-tight">Perfil Profissional</span>
                <span className="text-[9px] text-black/40 dark:text-white/20 uppercase tracking-widest font-black italic">Identidade do seu estúdio</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-black/10" />
          </button>
          
          <div className="h-px bg-black/[0.03] dark:bg-white/[0.03] mx-6"></div>

          <button 
            onClick={() => onNavigate('ajustes')}
            className="w-full px-6 py-6 flex items-center justify-between active:bg-black/[0.02] dark:active:bg-white/[0.02] transition-colors group"
          >
            <div className="flex items-center space-x-5">
              <div className="w-10 h-10 rounded-xl bg-gray-500/10 flex items-center justify-center text-gray-500">
                <Settings size={20} />
              </div>
              <div className="text-left">
                <span className="block font-black text-sm text-black dark:text-white uppercase tracking-tight">Preferências do App</span>
                <span className="text-[9px] text-black/40 dark:text-white/20 uppercase tracking-widest font-black italic">Temas e notificações</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-black/10" />
          </button>
        </div>
      </div>

      {/* Footer / Info do App */}
      <div className="pt-10 flex flex-col items-center space-y-6 opacity-30">
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-1 text-[9px] font-black uppercase tracking-widest">
            <HelpCircle size={14} />
            <span>Suporte</span>
          </button>
          <div className="w-1 h-1 bg-black/20 dark:bg-white/20 rounded-full"></div>
          <button className="text-[9px] font-black uppercase tracking-widest">Legal</button>
          <div className="w-1 h-1 bg-black/20 dark:bg-white/20 rounded-full"></div>
          <button className="text-[9px] font-black uppercase tracking-widest">Sair</button>
        </div>
        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-center leading-relaxed italic">
          RAÍZES RECORRENTES • BUSINESS CENTER v3.2<br/>
          GESTÃO QUE GERA LIBERDADE
        </p>
      </div>
    </div>
  );
};

export default MoreView;
