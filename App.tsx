import React, { useState, useEffect } from 'react';

// Debug: Catch global errors
if (typeof window !== 'undefined') {
  window.onerror = function (message, source, lineno, colno, error) {
    console.error("Global Error:", message, error);
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = `<div style="padding: 20px; color: white; background: red; font-family: sans-serif;">
        <h1>App Crash</h1>
        <p>${message}</p>
        <pre>${error?.stack || ''}</pre>
        <p>Check if all environment variables are set in Vercel.</p>
      </div>`;
    }
    return false;
  };
}
import { Client, Screen, Appointment, Service } from './types';
import Navigation from './components/Navigation';
import Header from './components/Header';
import DashboardView from './views/DashboardView';
import ClientsView from './views/ClientsView';
import AgendaView from './views/AgendaView';
import ServicesView from './views/ServicesView';
import FinanceView from './views/FinanceView';
import InventoryView from './views/InventoryView';
import RecurrenceView from './views/RecurrenceView';
import GoalsView from './views/GoalsView';
import SettingsView from './views/SettingsView';
import LoginView from './views/LoginView';
import AIAnalysisView from './views/AIAnalysisView';
import MoreView from './views/MoreView';
import AlertsView from './views/AlertsView';
import WeeklyForecastView from './views/WeeklyForecastView';
import ClientDetailView from './views/ClientDetailView';
import { dataService } from './services/dataService';
import { isSupabaseConfigured } from './lib/supabase';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [financeFilter, setFinanceFilter] = useState<string>('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [userProfile, setUserProfile] = useState({
    name: 'Preta Trancista',
    specialty: 'Especialista em Braids & Nagô',
    phone: '(11) 98765-4321',
    bio: 'Transformando raízes em arte e faturamento recorrente.',
    avatar: 'https://picsum.photos/seed/user/200'
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await dataService.getSession();
        if (session) {
          setIsAuthenticated(true);
          // Carregar perfil do usuário
          const profile = await dataService.getProfile();
          if (profile) {
            setUserProfile({
              name: profile.name || 'Preta Trancista',
              specialty: profile.specialty || 'Especialista em Braids & Nagô',
              phone: profile.phone || '(11) 98765-4321',
              bio: profile.bio || 'Transformando raízes em arte e faturamento recorrente.',
              avatar: profile.avatar || 'https://picsum.photos/seed/user/200',
              instagram: profile.instagram,
              address: profile.address
            });
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleUpdateProfile = async (updatedProfile: any) => {
    try {
      setUserProfile(updatedProfile);
      await dataService.updateProfile(updatedProfile);
    } catch (e) {
      console.error("Profile sync error:", e);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      try {
        const [fetchedClients, fetchedAppointments, fetchedServices] = await Promise.all([
          dataService.getClients(),
          dataService.getAppointments(),
          dataService.getServices()
        ]);
        setClients(fetchedClients);
        setAppointments(fetchedAppointments);
        setServices(fetchedServices);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (!isAuthenticated) return <LoginView onLogin={() => setIsAuthenticated(true)} />;

  if (isLoading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0c0c0c]">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#C69372]/20 border-t-[#C69372] rounded-full animate-spin"></div>
        <p className="text-[#C69372] font-black uppercase tracking-[0.3em] text-[10px]">Conectando às raízes...</p>
      </div>
    </div>
  );

  const handleSelectClient = (id: string) => {
    setSelectedClientId(id);
    setCurrentScreen('client-detail');
  };

  const handleAddAppointment = async (appt: Appointment, newClientData?: Partial<Client>) => {
    try {
      // O dataService.addAppointment agora cuida da criação automática do cliente
      // se o clientId for um mock (começando com 'c-').
      const savedAppt = await dataService.addAppointment(appt);

      // Atualizar lista de agendamentos
      setAppointments(prev => [...prev, savedAppt]);

      // Se o clientId mudou (era mock e agora é UUID), significa que um cliente
      // foi criado ou vinculado. Vamos recarregar os clientes para garantir
      // que a aba de clientes esteja atualizada.
      if (appt.clientId.startsWith('c-')) {
        const fetchedClients = await dataService.getClients();
        setClients(fetchedClients);
      }

      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      console.error('Error saving appointment:', error);
      alert("Erro ao criar agendamento. Verifique sua conexão.");
    }
  };

  const handleUpdateAppointmentStatus = async (apptId: string, status: Appointment['status'], paymentStatus?: Appointment['paymentStatus']) => {
    try {
      await dataService.updateAppointmentStatus(apptId, status, paymentStatus);
      setAppointments(prev => prev.map(a =>
        a.id === apptId ? { ...a, status, paymentStatus: paymentStatus || a.paymentStatus } : a
      ));
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert("Erro ao atualizar status.");
    }
  };

  const handleUpdateClient = async (updatedClient: Client) => {
    try {
      const savedClient = await dataService.updateClient(updatedClient);
      setClients(prev => prev.map(c => c.id === savedClient.id ? savedClient : c));
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await dataService.deleteClient(id);
      setClients(prev => prev.filter(c => c.id !== id));
      setCurrentScreen('ativos');
      setSelectedClientId(null);
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await dataService.signOut();
      setIsAuthenticated(false);
      setCurrentScreen('dashboard');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const selectedClient = clients.find(c => c.id === selectedClientId) || null;

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard': return <DashboardView onNavigate={setCurrentScreen} clients={clients} appointments={appointments} />;
      case 'agenda': return (
        <AgendaView
          clients={clients}
          appointments={appointments}
          services={services}
          onAddAppointment={handleAddAppointment}
          onUpdateStatus={handleUpdateAppointmentStatus}
        />
      );
      case 'ativos': return <ClientsView clients={clients} onSelectClient={handleSelectClient} onNavigate={setCurrentScreen} />;
      case 'client-detail': return (
        <ClientDetailView
          client={selectedClient}
          onBack={() => setCurrentScreen('ativos')}
          onUpdate={handleUpdateClient}
          onDelete={handleDeleteClient}
          onNavigate={setCurrentScreen}
        />
      );
      case 'financeiro': return (
        <FinanceView
          onSelectClient={handleSelectClient}
          initialFilter={financeFilter}
          onClearFilter={() => setFinanceFilter('')}
          clients={clients}
        />
      );
      case 'mais': return <MoreView onNavigate={setCurrentScreen} onLogout={handleLogout} />;
      case 'recorrencia': return <RecurrenceView clients={clients} studioName={userProfile.name} />;
      case 'metas': return <GoalsView appointments={appointments} />;
      case 'servicos': return (
        <ServicesView
          onNavigate={setCurrentScreen}
          onSetFinanceFilter={setFinanceFilter}
          services={services}
          onUpdateServices={() => dataService.getServices().then(setServices)}
        />
      );
      case 'estoque': return <InventoryView />;
      case 'ajustes': return (
        <SettingsView
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          profile={userProfile}
          onUpdateProfile={handleUpdateProfile}
          onLogout={handleLogout}
        />
      );
      case 'ai-analysis': return <AIAnalysisView onClose={() => setCurrentScreen('dashboard')} onAction={() => { }} onNavigate={setCurrentScreen} />;
      case 'alertas': return <AlertsView onBack={() => setCurrentScreen('dashboard')} onNavigate={setCurrentScreen} />;
      case 'previsao': return <WeeklyForecastView onBack={() => setCurrentScreen('dashboard')} onNavigate={setCurrentScreen} />;
      default: return <DashboardView onNavigate={setCurrentScreen} clients={clients} appointments={appointments} />;
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-[#f5f5f7] dark:bg-[#0c0c0c] text-[#1a1a1a] dark:text-[#f0f0f0]">
      <Header currentScreen={currentScreen} onNavigate={setCurrentScreen} isDark={isDarkMode} />
      <main className="flex-1 overflow-y-auto scrolling-touch relative hide-scrollbar">
        <div className="max-w-md mx-auto w-full h-full px-safe pb-[calc(5.5rem+var(--sab))]">
          {renderScreen()}
        </div>
      </main>
      <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} isDark={isDarkMode} />

      {/* Global Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-emerald-500 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Operação Concluída</span>
        </div>
      )}
    </div>
  );
};

export default App;

