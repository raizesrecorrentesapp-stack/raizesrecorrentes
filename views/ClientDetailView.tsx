
import React, { useState, useMemo } from 'react';
import { Client, Screen } from '../types';
import { 
  Zap, 
  MessageSquare, 
  Calendar, 
  History, 
  Wallet, 
  Info, 
  MoreVertical, 
  X, 
  Pencil, 
  Share2, 
  Trash2,
  AlertTriangle,
  Save,
  Check,
  TrendingUp,
  RefreshCw,
  Clock,
  BarChart3,
  Sparkles,
  ArrowRight,
  Target
} from 'lucide-react';

interface ClientDetailViewProps {
  client: Client | null;
  onBack: () => void;
  onUpdate: (updatedClient: Client) => void;
  onDelete: (id: string) => void;
  onNavigate: (screen: Screen) => void;
}

const ClientDetailView: React.FC<ClientDetailViewProps> = ({ client, onBack, onUpdate, onDelete, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editData, setEditData] = useState<Partial<Client>>(client || {});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Inteligência de Projeção (Mockada baseada em ciclo)
  const projection = useMemo(() => {
    if (!client) return null;
    return {
      nextDate: client.expectedReturn || 'Próximos 12 dias',
      probability: client.status === 'ATIVA' ? '90%' : '35%',
      isOverdue: client.status === 'EM RISCO',
    };
  }, [client]);

  if (!client) return (
    <div className="p-8 text-center text-white/20">Cliente não encontrado.</div>
  );

  const handleWhatsApp = (msgType: 'reminder' | 'promo' | 'direct') => {
    let msg = "";
    if (msgType === 'reminder') msg = `Oi ${client.name}! Já estamos chegando na data da sua próxima manutenção. Quer garantir seu horário?`;
    else if (msgType === 'promo') msg = `Oi ${client.name} 💛 temos uma condição especial para sua próxima Nagô! Vamos agendar?`;
    else msg = `Oi ${client.name}! Tudo bem?`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encoded}`, '_blank');
  };

  const handleSaveEdit = () => {
    onUpdate({ ...client, ...editData } as Client);
    setIsEditing(false);
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="animate-in slide-in-from-right duration-500 pb-32 relative overflow-x-hidden">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-emerald-500 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top">
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-emerald-500">
            <Check size={12} strokeWidth={4} />
          </div>
          <span>Ficha Atualizada com Sucesso</span>
        </div>
      )}

      {/* 🔝 CABEÇALHO PREMIUM */}
      <div className="px-4 py-8 flex flex-col items-center space-y-5 bg-gradient-to-b from-bronze/5 to-transparent relative">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="absolute right-4 top-6 p-3 text-black/20 dark:text-white/20 active:scale-90 transition-transform"
        >
          <MoreVertical size={24} />
        </button>

        <div className="relative">
          <div className="w-32 h-32 rounded-[44px] overflow-hidden border-2 border-bronze shadow-2xl">
            <img src={client.avatar} alt={client.name} className="w-full h-full object-cover grayscale brightness-110" />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-2xl border-2 border-white dark:border-[#0c0c0c] flex items-center justify-center text-white shadow-lg ${client.status === 'ATIVA' ? 'bg-emerald-500' : 'bg-red-500'}`}>
             <Zap size={16} fill="currentColor" />
          </div>
        </div>
        
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-black dark:text-white tracking-tighter italic">{client.name}</h2>
          <div className="flex items-center justify-center space-x-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg ${client.status === 'ATIVA' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
              {client.status}
            </span>
          </div>
        </div>
      </div>

      {/* 📊 DADOS ESTRATÉGICOS (DASHBOARD INDIVIDUAL) */}
      <div className="px-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#121212] p-5 rounded-[32px] border border-white/5 space-y-1 shadow-xl">
            <div className="flex items-center space-x-2 text-emerald-500 mb-1">
               <Wallet size={12} />
               <span className="text-[8px] font-black uppercase tracking-widest">Receita Acumulada</span>
            </div>
            <h3 className="text-2xl font-black text-white">R$ {client.totalSpent}</h3>
            <p className="text-[8px] text-white/20 uppercase tracking-widest font-black italic">Vitalício gerado</p>
          </div>
          <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-[32px] border border-black/5 dark:border-white/5 space-y-1 shadow-sm">
            <div className="flex items-center space-x-2 text-bronze mb-1">
               <History size={12} />
               <span className="text-[8px] font-black uppercase tracking-widest">Total Visitas</span>
            </div>
            <h3 className="text-2xl font-black text-black dark:text-white">{client.totalVisits}x</h3>
            <p className="text-[8px] text-black/20 dark:text-white/20 uppercase tracking-widest font-black italic">Frequência média</p>
          </div>
          <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-[32px] border border-black/5 dark:border-white/5 space-y-1 shadow-sm">
            <div className="flex items-center space-x-2 text-blue-500 mb-1">
               <Target size={12} />
               <span className="text-[8px] font-black uppercase tracking-widest">Ticket Médio</span>
            </div>
            <h3 className="text-2xl font-black text-black dark:text-white">R$ {client.avgTicket}</h3>
          </div>
          <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-[32px] border border-black/5 dark:border-white/5 space-y-1 shadow-sm">
            <div className="flex items-center space-x-2 text-amber-500 mb-1">
               <RefreshCw size={12} />
               <span className="text-[8px] font-black uppercase tracking-widest">Ciclo Médio</span>
            </div>
            <h3 className="text-2xl font-black text-black dark:text-white">{client.frequency}</h3>
          </div>
        </div>
      </div>

      {/* 🔮 PROJEÇÃO DE RETORNO (IA) */}
      <div className="p-4">
         <div className="bg-bronze/5 border border-bronze/10 rounded-[32px] p-6 space-y-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-2 text-bronze">
                  <Sparkles size={16} fill="currentColor" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Projeção Raízes IA</h4>
               </div>
               <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Probabilidade {projection?.probability}</span>
            </div>
            
            <div className="space-y-1">
               <p className="text-[10px] font-black text-black/30 dark:text-white/20 uppercase tracking-widest">Retorno Esperado em:</p>
               <h3 className={`text-2xl font-black tracking-tight ${projection?.isOverdue ? 'text-red-500' : 'text-black dark:text-white'}`}>
                 {projection?.nextDate}
               </h3>
               {projection?.isOverdue && (
                 <p className="text-[10px] text-red-500 font-black uppercase flex items-center mt-1">
                    <AlertTriangle size={10} className="mr-1" /> Cliente fora do ciclo (atrasada)
                 </p>
               )}
            </div>

            <button 
              onClick={() => handleWhatsApp('reminder')}
              className="w-full py-4 bg-white dark:bg-white/5 border border-bronze/20 text-bronze rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 active:scale-95 transition-all"
            >
               <MessageSquare size={14} fill="currentColor" />
               <span>Enviar Lembrete Amigável</span>
            </button>
         </div>
      </div>

      {/* 🧠 SUGESTÕES INTELIGENTES */}
      <div className="px-4 space-y-4">
        <h3 className="text-[11px] font-black text-black/40 dark:text-white/20 uppercase tracking-[0.2em] px-2">Sugestões de Upsell</h3>
        <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-[32px] flex items-start space-x-4">
           <TrendingUp size={20} className="text-emerald-500 shrink-0 mt-1" />
           <div className="space-y-1">
              <p className="text-sm font-black text-black dark:text-white uppercase tracking-tight italic">Oportunidade VIP</p>
              <p className="text-xs text-black/50 dark:text-white/40 leading-relaxed font-medium">
                {client.avgTicket >= 400 
                  ? "Esta cliente possui alto valor. Sugira o novo pacote de manutenção quinzenal com desconto progressivo." 
                  : "Cliente esporádica detectada. Ofereça um serviço rápido de retoque de raiz para aumentar a frequência de visitas."}
              </p>
           </div>
        </div>
      </div>

      {/* 📅 HISTÓRICO DE ATENDIMENTOS */}
      <div className="p-4 space-y-5">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-sm font-black text-black dark:text-white tracking-widest uppercase">Histórico de Sessões</h3>
           <BarChart3 size={16} className="text-black/20" />
        </div>

        <div className="space-y-3 relative">
          <div className="absolute left-[26px] top-4 bottom-4 w-px bg-black/5 dark:bg-white/5"></div>
          
          {(client.history || []).map((h, i) => (
            <div key={i} className="relative pl-14 group">
               <div className="absolute left-[21px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white dark:bg-[#0c0c0c] border-2 border-bronze z-10"></div>
               <div className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 p-5 rounded-3xl group-active:border-bronze/30 transition-all flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-[9px] font-black text-black/20 dark:text-white/20 uppercase tracking-widest mb-1">{h.date}</p>
                    <h5 className="font-black text-black dark:text-white text-sm uppercase italic">{h.service}</h5>
                    <p className="text-[9px] font-bold text-black/30 dark:text-white/20 mt-0.5 uppercase tracking-widest">{h.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-500">R$ {h.price}</p>
                    <button className="text-[8px] font-black text-bronze uppercase mt-1">Ver Notas</button>
                  </div>
               </div>
            </div>
          ))}

          {(!client.history || client.history.length === 0) && (
            <div className="text-center py-12 bg-black/[0.02] dark:bg-white/[0.02] rounded-[32px] border border-dashed border-black/10 dark:border-white/10 text-black/20 italic text-xs">
              Sem registros anteriores no sistema.
            </div>
          )}
        </div>
      </div>

      {/* 💬 AUTOMAÇÃO RÁPIDA (FIXO) */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-[40]">
         <div className="bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-[28px] p-3 flex items-center justify-around shadow-2xl">
            <button onClick={() => handleWhatsApp('direct')} className="flex flex-col items-center space-y-1 text-white/40 active:text-bronze transition-colors">
               <MessageSquare size={18} />
               <span className="text-[8px] font-black uppercase tracking-widest">Mensagem</span>
            </button>
            <div className="w-px h-8 bg-white/5"></div>
            <button onClick={() => handleWhatsApp('promo')} className="flex flex-col items-center space-y-1 text-white/40 active:text-bronze transition-colors">
               <Sparkles size={18} />
               <span className="text-[8px] font-black uppercase tracking-widest">Promo</span>
            </button>
            <div className="w-px h-8 bg-white/5"></div>
            <button 
              onClick={() => onNavigate('agenda')}
              className="flex flex-col items-center space-y-1 text-white/40 active:text-bronze transition-colors touch-manipulation"
            >
               <Calendar size={18} />
               <span className="text-[8px] font-black uppercase tracking-widest">Agendar</span>
            </button>
         </div>
      </div>

      {/* 📂 BOTTOM SHEET MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setIsMenuOpen(false)}></div>
          <div className="bg-white dark:bg-[#0a0a0a] border-t border-black/10 dark:border-white/10 w-full rounded-t-[40px] p-6 pb-12 space-y-6 relative z-10 animate-in slide-in-from-bottom duration-500 shadow-2xl">
            <div className="w-12 h-1.5 bg-black/10 dark:bg-white/10 rounded-full mx-auto mb-2"></div>
            
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-black dark:text-white tracking-tight uppercase italic">Opções da Cliente</h3>
              <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/40 dark:text-white/40 active:scale-90 transition-transform">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => { setIsEditing(true); setIsMenuOpen(false); }}
                className="w-full flex items-center space-x-4 p-5 bg-black/[0.03] dark:bg-white/5 rounded-[24px] active:bg-black/10 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-bronze/20 flex items-center justify-center text-bronze">
                  <Pencil size={20} />
                </div>
                <div className="text-left">
                  <span className="block font-black text-black dark:text-white uppercase tracking-tight">Editar Cadastro</span>
                  <span className="text-[10px] text-black/20 dark:text-white/20 uppercase tracking-widest font-black">Alterar dados e notas</span>
                </div>
              </button>

              <button 
                className="w-full flex items-center space-x-4 p-5 bg-black/[0.03] dark:bg-white/5 rounded-[24px] active:bg-black/10 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                  <Share2 size={20} />
                </div>
                <div className="text-left">
                  <span className="block font-black text-black dark:text-white uppercase tracking-tight">Exportar Relatório</span>
                  <span className="text-[10px] text-black/20 dark:text-white/20 uppercase tracking-widest font-black">PDF de consumo e faturamento</span>
                </div>
              </button>

              <button 
                onClick={() => { setShowDeleteConfirm(true); setIsMenuOpen(false); }}
                className="w-full flex items-center space-x-4 p-5 bg-red-500/5 border border-red-500/10 rounded-[24px] active:bg-red-500/10 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
                  <Trash2 size={20} />
                </div>
                <div className="text-left">
                  <span className="block font-black text-red-500 uppercase tracking-tight">Excluir Registro</span>
                  <span className="text-[10px] text-red-500/20 uppercase tracking-widest font-black">Apagar ficha permanentemente</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✏️ EDIT MODAL (BOTTOM SHEET) */}
      {isEditing && (
        <div className="fixed inset-0 z-[110] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in" onClick={() => setIsEditing(false)}></div>
          <div className="bg-white dark:bg-[#0a0a0a] border-t border-black/10 dark:border-white/10 w-full rounded-t-[40px] p-6 pb-12 space-y-6 relative z-10 animate-in slide-in-from-bottom duration-500 max-h-[90dvh] overflow-y-auto hide-scrollbar shadow-2xl">
            <div className="w-12 h-1.5 bg-black/10 dark:bg-white/10 rounded-full mx-auto mb-2"></div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-black dark:text-white tracking-tight uppercase italic">Editar Cliente</h3>
                <p className="text-[10px] text-bronze font-black uppercase tracking-[0.2em]">CRM Raízes 2.0</p>
              </div>
              <button onClick={() => setIsEditing(false)} className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/40 dark:text-white/40"><X size={20} /></button>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-black/20 dark:text-white/20 uppercase tracking-widest ml-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full h-14 bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 text-black dark:text-white font-bold outline-none focus:border-bronze" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-black/20 dark:text-white/20 uppercase tracking-widest ml-1">Telefone / WhatsApp</label>
                  <input 
                    type="tel" 
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className="w-full h-14 bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 text-black dark:text-white font-bold outline-none focus:border-bronze" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-black/20 dark:text-white/20 uppercase tracking-widest ml-1">Status Carteira</label>
                  <select 
                    value={editData.status}
                    onChange={(e) => setEditData({...editData, status: e.target.value as any})}
                    className="w-full h-14 bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 text-black dark:text-white font-bold outline-none focus:border-bronze appearance-none"
                  >
                    <option value="ATIVA">🟢 Ativa</option>
                    <option value="EM RISCO">🔴 Em Risco</option>
                    <option value="INATIVA">⚫ Inativa</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-black/20 dark:text-white/20 uppercase tracking-widest ml-1">Notas & Observações Técnicas</label>
                <textarea 
                  rows={4}
                  value={editData.notes}
                  onChange={(e) => setEditData({...editData, notes: e.target.value})}
                  className="w-full bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-black dark:text-white font-medium outline-none focus:border-bronze resize-none" 
                />
              </div>

              <button 
                onClick={handleSaveEdit}
                className="w-full py-5 bg-bronze text-white font-black text-lg rounded-[28px] shadow-xl shadow-bronze/20 active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center space-x-2"
              >
                <Save size={20} />
                <span>Salvar & Atualizar Carteira</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⚠️ DELETE CONFIRMATION ALERT */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowDeleteConfirm(false)}></div>
          <div className="bg-[#0c0c0c] border border-red-900/20 w-full max-w-xs rounded-[32px] p-8 space-y-8 relative z-10 animate-in zoom-in duration-300 shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto border border-red-500/20">
               <AlertTriangle size={40} />
            </div>
            <div className="space-y-3">
               <h4 className="text-2xl font-black text-white uppercase tracking-tight leading-none italic">Tem certeza?</h4>
               <p className="text-sm text-white/40 leading-relaxed font-medium">Esta ação apagará permanentemente todos os registros de {client.name}.</p>
            </div>
            <div className="flex flex-col gap-3">
               <button 
                onClick={() => onDelete(client.id)}
                className="w-full py-5 bg-red-500 text-white font-black rounded-2xl active:scale-95 transition-transform uppercase tracking-widest text-xs"
               >
                 Confirmar Exclusão
               </button>
               <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full py-5 bg-white/5 text-white/60 font-black rounded-2xl active:bg-white/10 transition-colors uppercase tracking-widest text-xs"
               >
                 Cancelar
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetailView;
