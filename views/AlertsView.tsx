
import React, { useState } from 'react';
import { 
  AlertCircle, 
  TrendingDown, 
  Package, 
  Zap, 
  Clock, 
  ArrowRight, 
  CheckCircle2,
  AlertTriangle,
  X,
  Check
} from 'lucide-react';
import { Screen } from '../types';

interface AlertsViewProps {
  onBack: () => void;
  onNavigate?: (screen: Screen) => void;
}

const AlertsView: React.FC<AlertsViewProps> = ({ onBack, onNavigate }) => {
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });

  const triggerToast = (msg: string) => {
    setToast({ message: msg, show: true });
    setTimeout(() => setToast({ message: '', show: false }), 3000);
  };

  const handleAction = (id: number, type: string) => {
    switch (id) {
      case 1: // Cobrar agora (Financeiro)
        triggerToast("Cobranda de sinal enviada via WhatsApp!");
        setTimeout(() => onNavigate?.('agenda'), 1000);
        break;
      case 2: // Comprar (Estoque)
        onNavigate?.('estoque');
        break;
      case 3: // Recuperar (Fidelidade)
        onNavigate?.('ativos'); // Navega para a lista de clientes para agir
        break;
      case 4: // Promover (Agenda)
        onNavigate?.('agenda');
        break;
      default:
        triggerToast("Ação processada com sucesso!");
    }
  };

  const categories = [
    {
      title: 'Críticos (Imediato)',
      alerts: [
        {
          id: 1,
          type: 'financeiro',
          label: 'Vazamento de Receita',
          title: '3 Sinais Pendentes',
          desc: 'Agendamentos para amanhã sem confirmação de sinal. Risco: R$ 540.',
          icon: <TrendingDown size={18} className="text-red-500" />,
          color: 'red',
          action: 'Cobrar agora'
        },
        {
          id: 2,
          type: 'estoque',
          label: 'Estoque Crítico',
          title: 'Lastex & Agulhas',
          desc: 'Seu material acaba em 2 dias se mantiver o fluxo atual.',
          icon: <Package size={18} className="text-amber-500" />,
          color: 'amber',
          action: 'Comprar'
        }
      ]
    },
    {
      title: 'IA Raízes (Estratégico)',
      alerts: [
        {
          id: 3,
          type: 'fidelidade',
          label: 'Risco de Churn',
          title: 'Juliana Silva ausente',
          desc: 'Cliente VIP passou do ciclo de 45 dias. Sugestão: Enviar cupom manutenção.',
          icon: <Zap size={18} className="text-[#C69372]" fill="currentColor" />,
          color: 'bronze',
          action: 'Recuperar'
        },
        {
          id: 4,
          type: 'agenda',
          label: 'Otimização',
          title: 'Janela de 2h na Quinta',
          desc: 'Horário ocioso detectado. IA sugere promover "Nagô Express" para este slot.',
          icon: <Clock size={18} className="text-blue-500" />,
          color: 'blue',
          action: 'Promover'
        }
      ]
    }
  ];

  return (
    <div className="p-5 space-y-8 animate-in fade-in slide-in-from-right duration-500 relative">
      {/* Toast Feedback */}
      {toast.show && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-black text-white px-6 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center space-x-3 animate-in slide-in-from-top border border-white/10">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check size={14} strokeWidth={4} />
          </div>
          <span>{toast.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-black dark:text-white tracking-tighter">Central de Insights</h2>
          <p className="text-[10px] font-black text-[#C69372] uppercase tracking-[0.3em]">IA Analisando dados em tempo real</p>
        </div>
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/40 dark:text-white/40 active:scale-90 transition-transform">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-10">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-[11px] font-black text-black/30 dark:text-white/20 uppercase tracking-[0.2em] px-1">{cat.title}</h3>
            
            <div className="space-y-4">
              {cat.alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`bg-white dark:bg-[#0a0a0a] rounded-[32px] p-6 border shadow-sm space-y-5 transition-all ${
                    alert.color === 'red' ? 'border-red-500/20 shadow-red-500/5' : 
                    alert.color === 'amber' ? 'border-amber-500/20 shadow-amber-500/5' :
                    'border-black/5 dark:border-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        alert.color === 'red' ? 'bg-red-500/10' : 
                        alert.color === 'amber' ? 'bg-amber-500/10' :
                        alert.color === 'blue' ? 'bg-blue-500/10' : 'bg-[#C69372]/10'
                      }`}>
                        {alert.icon}
                      </div>
                      <div className="space-y-0.5">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                          alert.color === 'red' ? 'text-red-500' : 
                          alert.color === 'amber' ? 'text-amber-600' :
                          alert.color === 'blue' ? 'text-blue-500' : 'text-[#C69372]'
                        }`}>{alert.label}</span>
                        <h4 className="font-black text-black dark:text-white text-lg leading-tight">{alert.title}</h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-black/50 dark:text-white/40 leading-relaxed font-medium">
                    {alert.desc}
                  </p>

                  <button 
                    onClick={() => handleAction(alert.id, alert.type)}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center space-x-2 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${
                    alert.color === 'red' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 
                    'bg-black/5 dark:bg-white/5 text-black dark:text-white hover:bg-[#C69372] hover:text-white'
                  }`}>
                    <span>{alert.action}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#C69372]/5 border border-[#C69372]/10 rounded-[32px] p-6 flex items-center space-x-4">
        <CheckCircle2 size={24} className="text-[#C69372] shrink-0" />
        <p className="text-[11px] text-[#C69372] font-medium leading-tight">
          Sua saúde financeira está <span className="font-black">Estável</span>. Resolva os alertas críticos para aumentar o faturamento em até 18%.
        </p>
      </div>

      <div className="py-10 text-center">
        <p className="text-[9px] font-black text-black/10 dark:text-white/10 uppercase tracking-[0.5em]">Central de Inteligência v2.5</p>
      </div>
    </div>
  );
};

export default AlertsView;
