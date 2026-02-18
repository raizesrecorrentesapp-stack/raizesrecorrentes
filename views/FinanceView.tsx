
import React, { useMemo, useState } from 'react';
import { MOCK_TRANSACTIONS, MOCK_SERVICES, MOCK_CLIENTS } from '../constants';
import {
  TrendingUp,
  TrendingDown,
  Scissors,
  Target,
  DollarSign,
  ThumbsUp,
  Plus,
  ArrowRight,
  X,
  Star,
  Settings2
} from 'lucide-react';
import { Client, Screen } from '../types';

type FinanceTab = 'resultado' | 'fluxo';

interface FinanceViewProps {
  onNavigate?: (screen: Screen) => void;
  initialFilter?: string;
  onClearFilter?: () => void;
  clients: Client[];
  onSelectClient?: (id: string) => void;
}

const FinanceView: React.FC<FinanceViewProps> = ({
  onNavigate,
  initialFilter,
  onClearFilter,
  clients,
  onSelectClient
}) => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('resultado');
  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);

  const [contas, setContas] = useState({
    aluguel: 800,
    luz: 150,
    internet: 100,
    outros: 150
  });

  const totalContas = (Object.values(contas) as number[]).reduce((a, b) => a + b, 0);

  const stats = useMemo(() => {
    const totalEntrou = MOCK_TRANSACTIONS.filter(t => t.type === 'RECEITA').reduce((acc, t) => acc + t.value, 0);
    const gastoMateriais = MOCK_TRANSACTIONS.filter(t => t.type === 'DESPESA' && t.category === 'Material').reduce((acc, t) => acc + t.value, 0);
    const sobraNoBolso = totalEntrou - totalContas - gastoMateriais;
    const porcentagemQueSobra = totalEntrou > 0 ? Math.round((sobraNoBolso / totalEntrou) * 100) : 0;

    return { totalEntrou, gastoMateriais, sobraNoBolso, porcentagemQueSobra };
  }, [totalContas]);

  const topClients = useMemo(() => {
    return clients.length > 0 ? [...clients].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 3) : [];
  }, [clients]);

  return (
    <div className="animate-in fade-in duration-500 pb-40">

      {/* 🧭 SELETOR DE ABA (Sticky) */}
      <div className="sticky top-0 z-30 bg-[#f5f5f7]/95 dark:bg-[#0c0c0c]/95 backdrop-blur-md px-4 py-4 border-b border-black/5 dark:border-white/5">
        <div className="bg-black/5 dark:bg-white/5 p-1 rounded-2xl flex items-center">
          <button
            onClick={() => setActiveTab('resultado')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'resultado' ? 'bg-white dark:bg-[#121212] text-bronze shadow-sm' : 'text-black/30 dark:text-white/30'}`}
          >
            Meu Resultado
          </button>
          <button
            onClick={() => setActiveTab('fluxo')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'fluxo' ? 'bg-white dark:bg-[#121212] text-bronze shadow-sm' : 'text-black/30 dark:text-white/30'}`}
          >
            Entradas e Saídas
          </button>
        </div>
      </div>

      <div className="p-4 pt-6 space-y-12">
        {activeTab === 'resultado' ? (
          <>
            {/* 💰 CARD DE RESULTADO FINAL */}
            <section className="space-y-4">
              <div className="bg-[#121212] rounded-[32px] p-8 border border-white/5 shadow-xl relative overflow-hidden text-center">
                <div className="relative z-10 space-y-2">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Total que sobrou no bolso</p>
                  <h3 className="text-5xl font-black text-white tracking-tighter italic">
                    R$ {stats.sobraNoBolso.toLocaleString()}
                  </h3>
                  <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full mt-2">
                    <TrendingUp size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sobra {stats.porcentagemQueSobra}% de tudo</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 🎯 META DE SEGURANÇA */}
            <section className="px-1">
              <div className="bg-white dark:bg-[#121212] border border-black/5 dark:border-white/5 rounded-[28px] p-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-bronze/10 flex items-center justify-center text-bronze">
                    <Target size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-black dark:text-white uppercase tracking-tight leading-none">Pagar as contas do mês</p>
                    <p className="text-[9px] font-bold text-black/40 dark:text-white/20 uppercase tracking-widest">Faltam 4 atendimentos</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-bronze"></div>)}
                  <div className="w-1.5 h-1.5 rounded-full bg-black/5 dark:bg-white/10"></div>
                </div>
              </div>
            </section>

            {/* 💎 AS TOP DO MÊS */}
            <section className="space-y-4">
              <div className="flex items-center space-x-2 px-1">
                <Star size={14} className="text-amber-500" fill="currentColor" />
                <h3 className="text-[11px] font-black text-black/30 dark:text-white/20 uppercase tracking-[0.3em]">As Top do Mês</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {topClients.map((client, idx) => (
                  <div key={client.id} className="bg-white dark:bg-[#0a0a0a] p-4 rounded-[24px] border border-black/5 dark:border-white/5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full border border-black/5 overflow-hidden">
                        <img src={client.avatar} className="w-full h-full object-cover grayscale" alt={client.name} />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-black dark:text-white uppercase leading-none mb-1">{client.name}</h4>
                        <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Gerou R$ {client.totalSpent} de lucro</p>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-black/[0.02] dark:bg-white/5 flex items-center justify-center text-bronze">
                      <span className="text-[10px] font-black">#{idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 🏠 CONTAS DO ESTÚDIO */}
            <section className="space-y-4">
              <h3 className="text-[11px] font-black text-black/30 dark:text-white/20 uppercase tracking-[0.3em] px-1">Resumo das Despesas Fixas</h3>
              <button
                onClick={() => setIsAccountsModalOpen(true)}
                className="w-full bg-white dark:bg-[#0a0a0a] p-6 rounded-[32px] border border-black/5 dark:border-white/5 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <DollarSign size={22} />
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-black text-black dark:text-white tracking-tight">R$ {totalContas.toLocaleString()}</p>
                    <p className="text-[9px] font-black text-black/30 dark:text-white/20 uppercase tracking-widest">Custo fixo mensal</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-bronze">
                  <span className="text-[9px] font-black uppercase tracking-widest">Ver Contas</span>
                  <Settings2 size={16} />
                </div>
              </button>
            </section>

            {/* 💇 TRANÇAS MAIS RENTÁVEIS */}
            <section className="space-y-4">
              <div className="flex items-center space-x-2 px-1">
                <ThumbsUp size={16} className="text-emerald-500" />
                <h3 className="text-[11px] font-black text-black/30 dark:text-white/20 uppercase tracking-[0.3em]">Tranças que rendem mais</h3>
              </div>
              <div className="space-y-3">
                {MOCK_SERVICES.slice(0, 2).map((servico) => (
                  <div key={servico.id} className="bg-white dark:bg-[#0a0a0a] p-5 rounded-[28px] border border-black/5 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-bronze">
                        <Scissors size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-black dark:text-white uppercase truncate max-w-[150px]">{servico.name}</h4>
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">R$ {servico.profitPerHour}/hora de trabalho</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-black/10" />
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="space-y-10 animate-in slide-in-from-right duration-300">
            <section className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-[28px] space-y-1">
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Total que entrou</p>
                <p className="text-xl font-black text-emerald-600">R$ {stats.totalEntrou.toLocaleString()}</p>
              </div>
              <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-[28px] space-y-1">
                <p className="text-[9px] font-black text-red-600 uppercase tracking-widest leading-none">Total gasto</p>
                <p className="text-xl font-black text-red-600">R$ {(stats.gastoMateriais + totalContas).toLocaleString()}</p>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[11px] font-black text-black/30 dark:text-white/20 uppercase tracking-[0.3em]">Histórico Mensal</h3>
                <button className="text-[10px] font-black text-bronze uppercase tracking-widest flex items-center space-x-1">
                  <Plus size={14} />
                  <span>Novo Gasto</span>
                </button>
              </div>
              <div className="space-y-3">
                {MOCK_TRANSACTIONS.map(t => (
                  <div key={t.id} className="bg-white dark:bg-[#0a0a0a] p-5 rounded-[28px] border border-black/5 dark:border-white/5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'RECEITA' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {t.type === 'RECEITA' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-black dark:text-white uppercase leading-none mb-1">{t.description}</h4>
                        <p className="text-[9px] font-bold text-black/20 dark:text-white/20 uppercase tracking-widest">{t.date} • {t.category}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-black ${t.type === 'RECEITA' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {t.type === 'RECEITA' ? '+' : '-'} R$ {t.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      {isAccountsModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end p-0">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setIsAccountsModalOpen(false)}></div>
          <div className="bg-white dark:bg-[#0c0c0c] border-t border-black/10 dark:border-white/10 w-full rounded-t-[40px] p-8 pb-12 space-y-8 relative z-10 animate-in slide-in-from-bottom duration-500 shadow-2xl">
            <div className="w-12 h-1.5 bg-black/10 dark:bg-white/10 rounded-full mx-auto mb-2 shrink-0"></div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-black dark:text-white tracking-tight uppercase italic">Minhas Contas</h3>
                <p className="text-[10px] text-bronze font-black uppercase tracking-[0.2em]">Gastos fixos todo mês</p>
              </div>
              <button onClick={() => setIsAccountsModalOpen(false)} className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/40 dark:text-white/40"><X size={20} /></button>
            </div>
            <div className="space-y-5">
              {[
                { label: 'Aluguel do Espaço', key: 'aluguel' },
                { label: 'Luz e Energia', key: 'luz' },
                { label: 'Internet / Wi-Fi', key: 'internet' },
                { label: 'Outras continhas', key: 'outros' }
              ].map(item => (
                <div key={item.key} className="space-y-1.5">
                  <label className="text-[10px] font-black text-black/30 dark:text-white/20 uppercase tracking-widest ml-1">{item.label}</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                    <input
                      type="number"
                      value={contas[item.key as keyof typeof contas]}
                      onChange={(e) => setContas({ ...contas, [item.key]: Number(e.target.value) })}
                      className="w-full h-14 bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl pl-12 pr-5 text-black dark:text-white font-black outline-none focus:border-bronze"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => setIsAccountsModalOpen(false)}
                className="w-full py-5 bg-bronze text-white font-black text-lg rounded-[28px] shadow-xl active:scale-95 transition-all uppercase tracking-widest"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceView;
