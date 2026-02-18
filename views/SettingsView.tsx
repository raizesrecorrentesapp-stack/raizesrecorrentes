
import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  LogOut, 
  ChevronRight, 
  Target, 
  Clock, 
  X, 
  Camera, 
  Save, 
  Check, 
  Moon, 
  Sun, 
  Briefcase, 
  Phone, 
  BookOpen,
  BellRing,
  ShieldCheck,
  Percent,
  CalendarDays,
  Globe,
  Instagram,
  MapPin,
  AlignLeft
} from 'lucide-react';

interface SettingsViewProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  profile: {
    name: string;
    specialty: string;
    phone: string;
    bio: string;
    avatar: string;
    instagram?: string;
    address?: string;
  };
  onUpdateProfile: (profile: any) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ isDarkMode, onToggleTheme, profile, onUpdateProfile }) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isStudioRulesOpen, setIsStudioRulesOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados de Configuração de Negócio
  const [studioSettings, setStudioSettings] = useState({
    defaultSignal: 30, // 30% de sinal padrão
    bufferTime: 15,    // 15 min entre atendimentos
    notifications: true,
    weeklyForecast: true
  });

  const [editProfile, setEditProfile] = useState({
    ...profile,
    instagram: profile.instagram || '@seu_estudio',
    address: profile.address || 'Rua das Palmeiras, 123 - Centro'
  });

  useEffect(() => {
    setEditProfile({
      ...profile,
      instagram: profile.instagram || '@seu_estudio',
      address: profile.address || 'Rua das Palmeiras, 123 - Centro'
    });
  }, [profile]);

  const handleSave = () => {
    onUpdateProfile(editProfile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = () => {
    window.location.reload(); 
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfile({ ...editProfile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="px-4 py-6 space-y-10 animate-in fade-in duration-500 max-w-md mx-auto pb-32">
      
      {/* SEÇÃO 1: DADOS DO ESTÚDIO (CARD PRINCIPAL) */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/5 rounded-[32px] p-6 space-y-6 shadow-sm relative overflow-hidden card-shadow">
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-[#C69372]/5 rounded-full blur-3xl"></div>
        <div className="flex flex-col items-center text-center space-y-4 relative z-10">
          <div className="relative group" onClick={() => setIsProfileModalOpen(true)}>
             <img src={profile.avatar} className="w-24 h-24 rounded-[32px] object-cover grayscale brightness-110 shadow-lg border-2 border-[#C69372]/20" alt="Avatar" />
             <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#C69372] rounded-full border-2 border-white dark:border-[#0a0a0a] flex items-center justify-center text-white shadow-lg">
                <Camera size={16} />
             </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-[#1a1a1a] dark:text-white leading-none tracking-tight">{profile.name}</h3>
            <p className="text-[10px] text-[#C69372] font-black uppercase tracking-[0.2em]">{profile.specialty}</p>
          </div>
          
          <div className="w-full pt-4 border-t border-black/5 dark:border-white/5 space-y-3">
             <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-1 text-black/40 dark:text-white/30 font-bold text-[10px] uppercase">
                   <Phone size={12} className="text-[#C69372]" />
                   <span>{profile.phone}</span>
                </div>
                <div className="flex items-center space-x-1 text-black/40 dark:text-white/30 font-bold text-[10px] uppercase">
                   <Instagram size={12} className="text-[#C69372]" />
                   <span>{editProfile.instagram}</span>
                </div>
             </div>
             <p className="text-[11px] text-black/60 dark:text-white/50 font-medium leading-relaxed italic px-4">
               "{profile.bio}"
             </p>
          </div>

          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="w-full py-3 bg-black/[0.03] dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-[#C69372] active:scale-95 transition-all"
          >
            Editar Dados do Estúdio
          </button>
        </div>
      </div>

      {/* SEÇÃO 2: REGRAS DO ESTÚDIO */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 px-2">
          <Briefcase size={14} className="text-[#C69372]" />
          <label className="text-[10px] font-black text-black/40 dark:text-white/30 uppercase tracking-[0.2em]">Regras de Negócio</label>
        </div>
        <div className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/5 rounded-[32px] overflow-hidden shadow-sm">
           <button 
            onClick={() => setIsStudioRulesOpen(true)}
            className="w-full px-6 py-6 flex items-center justify-between text-black dark:text-white active:bg-black/5 dark:active:bg-white/5 transition-colors group"
           >
              <div className="flex items-center space-x-4">
                 <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Percent size={18} />
                 </div>
                 <div className="text-left">
                    <span className="block font-black text-sm uppercase tracking-tight">Políticas de Agendamento</span>
                    <span className="text-[10px] text-black/40 dark:text-white/30 uppercase tracking-widest font-black">Sinal, Cancelamento e Prazos</span>
                 </div>
              </div>
              <ChevronRight size={20} className="text-black/20 dark:text-white/10 group-active:translate-x-1 transition-transform" />
           </button>
           <div className="h-px bg-black/[0.05] dark:bg-white/5 mx-6"></div>
           <button className="w-full px-6 py-6 flex items-center justify-between text-black dark:text-white active:bg-black/5 dark:active:bg-white/5 transition-colors group">
              <div className="flex items-center space-x-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <CalendarDays size={18} />
                 </div>
                 <div className="text-left">
                    <span className="block font-black text-sm uppercase tracking-tight">Horário de Atendimento</span>
                    <span className="text-[10px] text-black/40 dark:text-white/30 uppercase tracking-widest font-black">Segunda a Sábado • 09h - 20h</span>
                 </div>
              </div>
              <ChevronRight size={20} className="text-black/20 dark:text-white/10 group-active:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>

      {/* SEÇÃO 3: SISTEMA & APARÊNCIA */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 px-2">
          <Globe size={14} className="text-[#C69372]" />
          <label className="text-[10px] font-black text-black/40 dark:text-white/30 uppercase tracking-[0.2em]">Preferências do App</label>
        </div>
        <div className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/5 rounded-[32px] overflow-hidden shadow-sm">
           {/* Dark Mode Toggle */}
           <div className="px-6 py-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                 <div className="w-10 h-10 rounded-xl bg-[#C69372]/10 flex items-center justify-center text-[#C69372]">
                    {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                 </div>
                 <div className="text-left">
                    <span className="block font-black text-sm uppercase tracking-tight leading-none mb-1">Modo Noturno</span>
                    <span className="text-[10px] text-black/40 dark:text-white/30 uppercase tracking-widest font-black">{isDarkMode ? 'Ativado' : 'Desativado'}</span>
                 </div>
              </div>
              <button 
                onClick={onToggleTheme}
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isDarkMode ? 'bg-[#C69372]' : 'bg-black/10'}`}
              >
                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md ${isDarkMode ? 'left-7' : 'left-1'}`}></div>
              </button>
           </div>
           
           <div className="h-px bg-black/[0.05] dark:bg-white/5 mx-6"></div>

           {/* Notifications Toggle */}
           <div className="px-6 py-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                 <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <BellRing size={18} />
                 </div>
                 <div className="text-left">
                    <span className="block font-black text-sm uppercase tracking-tight leading-none mb-1">Alertas de IA</span>
                    <span className="text-[10px] text-black/40 dark:text-white/30 uppercase tracking-widest font-black">Notificações Críticas</span>
                 </div>
              </div>
              <button 
                onClick={() => setStudioSettings({...studioSettings, notifications: !studioSettings.notifications})}
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${studioSettings.notifications ? 'bg-emerald-500' : 'bg-black/10'}`}
              >
                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md ${studioSettings.notifications ? 'left-7' : 'left-1'}`}></div>
              </button>
           </div>
        </div>
      </div>

      {/* SEÇÃO 4: CONTA & SEGURANÇA */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 px-2">
          <ShieldCheck size={14} className="text-[#C69372]" />
          <label className="text-[10px] font-black text-black/40 dark:text-white/30 uppercase tracking-[0.2em]">Segurança</label>
        </div>
        <div className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/5 rounded-[32px] overflow-hidden shadow-sm">
           <button 
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="w-full px-6 py-6 flex items-center justify-between text-red-500 active:bg-red-500/5 transition-colors group"
           >
              <div className="flex items-center space-x-4">
                 <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <LogOut size={18} />
                 </div>
                 <div className="text-left">
                    <span className="block font-black text-sm uppercase tracking-tight">Sair do App</span>
                    <span className="text-[10px] text-red-500/40 uppercase tracking-widest font-black">Encerrar Sessão Ativa</span>
                 </div>
              </div>
              <ChevronRight size={20} className="text-red-500/30 group-active:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="py-8 text-center space-y-4">
         <div className="flex items-center justify-center space-x-4">
            <span className="text-[9px] font-black text-black/20 dark:text-white/10 uppercase tracking-widest">Privacidade</span>
            <span className="text-[9px] font-black text-black/20 dark:text-white/10 uppercase tracking-widest">Termos</span>
            <span className="text-[9px] font-black text-black/20 dark:text-white/10 uppercase tracking-widest">Suporte</span>
         </div>
         <p className="text-[9px] font-black text-black/10 dark:text-white/10 uppercase tracking-[0.5em] italic">Raízes Recorrentes • Versão 2.5.0 Professional</p>
      </div>

      {/* MODAL: DADOS DO ESTÚDIO (Bottom Sheet) */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[110] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setIsProfileModalOpen(false)}></div>
          <div className="bg-white dark:bg-[#0c0c0c] border-t border-black/10 dark:border-white/10 w-full rounded-t-[40px] p-8 pb-12 space-y-8 relative z-10 animate-in slide-in-from-bottom duration-500 max-h-[90dvh] overflow-y-auto shadow-2xl hide-scrollbar">
            <div className="w-12 h-1.5 bg-black/10 dark:bg-white/10 rounded-full mx-auto mb-2"></div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-black dark:text-white tracking-tight">Dados do Estúdio</h3>
                <p className="text-[10px] text-[#C69372] font-black uppercase tracking-[0.2em]">Identidade e Contato</p>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/40 dark:text-white/40 active:scale-90 transition-transform"><X size={20} /></button>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center">
                <button onClick={handleImageClick} className="relative group">
                  <img src={editProfile.avatar} className="w-32 h-32 rounded-[40px] object-cover grayscale shadow-2xl border-4 border-[#C69372]/20" alt="Avatar" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Nome do Estúdio */}
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 ml-1">
                    <User size={12} className="text-[#C69372]" />
                    <label className="text-[10px] font-black text-black/40 dark:text-white/30 uppercase tracking-widest">Nome do Estúdio</label>
                  </div>
                  <input 
                    type="text" 
                    value={editProfile.name}
                    onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
                    placeholder="Ex: Raízes de Ouro"
                    className="w-full h-14 bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 text-black dark:text-white font-bold outline-none focus:border-[#C69372]" 
                  />
                </div>

                {/* Telefone */}
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 ml-1">
                    <Phone size={12} className="text-[#C69372]" />
                    <label className="text-[10px] font-black text-black/40 dark:text-white/30 uppercase tracking-widest">Telefone / WhatsApp</label>
                  </div>
                  <input 
                    type="text" 
                    value={editProfile.phone}
                    onChange={(e) => setEditProfile({...editProfile, phone: e.target.value})}
                    placeholder="(00) 00000-0000"
                    className="w-full h-14 bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 text-black dark:text-white font-bold outline-none focus:border-[#C69372]" 
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 ml-1">
                    <Instagram size={12} className="text-[#C69372]" />
                    <label className="text-[10px] font-black text-black/40 dark:text-white/30 uppercase tracking-widest">Instagram</label>
                  </div>
                  <input 
                    type="text" 
                    value={editProfile.instagram}
                    onChange={(e) => setEditProfile({...editProfile, instagram: e.target.value})}
                    placeholder="@seu_estudio"
                    className="w-full h-14 bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 text-black dark:text-white font-bold outline-none focus:border-[#C69372]" 
                  />
                </div>

                {/* Localização */}
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 ml-1">
                    <MapPin size={12} className="text-[#C69372]" />
                    <label className="text-[10px] font-black text-black/40 dark:text-white/30 uppercase tracking-widest">Endereço / Cidade</label>
                  </div>
                  <input 
                    type="text" 
                    value={editProfile.address}
                    onChange={(e) => setEditProfile({...editProfile, address: e.target.value})}
                    placeholder="Sua localização"
                    className="w-full h-14 bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 text-black dark:text-white font-bold outline-none focus:border-[#C69372]" 
                  />
                </div>

                {/* Descrição / Bio */}
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 ml-1">
                    <AlignLeft size={12} className="text-[#C69372]" />
                    <label className="text-[10px] font-black text-black/40 dark:text-white/30 uppercase tracking-widest">Descrição do Estúdio (Bio)</label>
                  </div>
                  <textarea 
                    rows={4}
                    value={editProfile.bio}
                    onChange={(e) => setEditProfile({...editProfile, bio: e.target.value})}
                    placeholder="Conte um pouco sobre sua arte e missão..."
                    className="w-full bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-black dark:text-white font-medium outline-none focus:border-[#C69372] resize-none" 
                  />
                </div>
              </div>

              <button 
                onClick={() => { handleSave(); setIsProfileModalOpen(false); }}
                className="w-full py-5 bg-[#C69372] text-white font-black text-lg rounded-2xl shadow-xl active:scale-[0.98] transition-all uppercase tracking-[0.2em] flex items-center justify-center space-x-3"
              >
                <Save size={20} />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REGRAS DO ESTÚDIO (Bottom Sheet) */}
      {isStudioRulesOpen && (
        <div className="fixed inset-0 z-[110] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setIsStudioRulesOpen(false)}></div>
          <div className="bg-white dark:bg-[#0c0c0c] border-t border-black/10 dark:border-white/10 w-full rounded-t-[40px] p-8 pb-12 space-y-8 relative z-10 animate-in slide-in-from-bottom duration-500 max-h-[90dvh] overflow-y-auto shadow-2xl">
            <div className="w-12 h-1.5 bg-black/10 dark:bg-white/10 rounded-full mx-auto mb-2"></div>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-black dark:text-white tracking-tight">Políticas de Agendamento</h3>
              <button onClick={() => setIsStudioRulesOpen(false)} className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/40 dark:text-white/40 active:scale-90 transition-transform"><X size={20} /></button>
            </div>

            <div className="space-y-6">
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black/[0.03] dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10">
                     <div className="space-y-1">
                        <p className="text-sm font-black text-black dark:text-white">Sinal Padrão Obrigatório</p>
                        <p className="text-[10px] text-black/40 dark:text-white/30 font-black uppercase tracking-widest">IA usará para alertas de risco</p>
                     </div>
                     <div className="flex items-center space-x-3">
                        <input 
                          type="number" 
                          value={studioSettings.defaultSignal}
                          onChange={(e) => setStudioSettings({...studioSettings, defaultSignal: Number(e.target.value)})}
                          className="w-16 h-10 bg-white dark:bg-white/10 rounded-xl border border-black/10 dark:border-white/20 text-center font-black text-[#C69372]" 
                        />
                        <span className="font-black text-black/30">%</span>
                     </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/[0.03] dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10">
                     <div className="space-y-1">
                        <p className="text-sm font-black text-black dark:text-white">Intervalo entre Clientes</p>
                        <p className="text-[10px] text-black/40 dark:text-white/30 font-black uppercase tracking-widest">Tempo para limpeza e pausa</p>
                     </div>
                     <div className="flex items-center space-x-3">
                        <input 
                          type="number" 
                          value={studioSettings.bufferTime}
                          onChange={(e) => setStudioSettings({...studioSettings, bufferTime: Number(e.target.value)})}
                          className="w-16 h-10 bg-white dark:bg-white/10 rounded-xl border border-black/10 dark:border-white/20 text-center font-black text-[#C69372]" 
                        />
                        <span className="font-black text-black/30">min</span>
                     </div>
                  </div>
               </div>

               <button 
                 onClick={() => { triggerSuccess(); setIsStudioRulesOpen(false); }}
                 className="w-full py-5 bg-[#C69372] text-white font-black text-lg rounded-2xl shadow-xl active:scale-[0.98] transition-all uppercase tracking-[0.2em]"
               >
                 Salvar Políticas
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirm Alert */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setIsLogoutConfirmOpen(false)}></div>
          <div className="bg-[#0c0c0c] border border-white/5 w-full max-w-xs rounded-[32px] p-8 space-y-8 relative z-10 animate-in zoom-in duration-300 shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto border border-red-500/20">
               <LogOut size={32} />
            </div>
            <div className="space-y-3">
               <h4 className="text-2xl font-black text-white uppercase tracking-tight">Sair da Sessão?</h4>
               <p className="text-sm text-white/40 leading-relaxed font-medium">Você precisará acessar novamente para ver seus dados.</p>
            </div>
            <div className="flex flex-col gap-3">
               <button onClick={handleLogout} className="w-full py-5 bg-white text-black font-black rounded-2xl active:scale-95 transition-transform uppercase tracking-widest text-xs">Confirmar Saída</button>
               <button onClick={() => setIsLogoutConfirmOpen(false)} className="w-full py-5 bg-white/5 text-white/60 font-black rounded-2xl active:bg-white/10 transition-colors uppercase tracking-widest text-xs">Voltar ao App</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast de Sucesso Local */}
      {saveSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-emerald-500 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top">
          <Check size={14} strokeWidth={4} />
          <span>Configurações Salvas</span>
        </div>
      )}
    </div>
  );

  function triggerSuccess() {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }
};

export default SettingsView;
