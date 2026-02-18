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
import { Screen, Client, Appointment } from './types';
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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [financeFilter, setFinanceFilter] = useState<string>('');

  const [userProfile, setUserProfile] = useState({
    name: 'Preta Trancista',
    specialty: 'Especialista em Braids & Nagô',
    phone: '(11) 98765-4321',
    bio: 'Transformando raízes em arte e faturamento recorrente.',
    avatar: 'https://picsum.photos/seed/user/200'
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedClients, fetchedAppointments] = await Promise.all([
          dataService.getClients(),
          dataService.getAppointments()
        ]);
        setClients(fetchedClients);
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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
      if (newClientData) {
        const newClient: Client = {
          id: appt.clientId,
          name: appt.clientName,
          status: 'ATIVA',
          lastVisit: appt.date,
          frequency: '45 dias',
          avgTicket: appt.value,
          growth: 'Novo',
          avatar: `https://picsum.photos/seed/${appt.clientId}/200`,
          phone: '',
          instagram: '',
          totalSpent: appt.value,
          totalVisits: 1,
          history: [{
            id: `h-${Date.now()}`,
            date: appt.date,
            service: appt.serviceName,
            price: appt.value,
            paymentMethod: 'Pendente'
          }]
        };
        const savedClient = await dataService.updateClient(newClient);
        setClients(prev => [...prev, savedClient]);
      }
      const savedAppt = await dataService.addAppointment(appt);
      setAppointments(prev => [...prev, savedAppt]);
    } catch (error) {
      console.error('Error saving appointment:', error);
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

  const selectedClient = clients.find(c => c.id === selectedClientId) || null;

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard': return <DashboardView onNavigate={setCurrentScreen} />;
      case 'agenda': return (
        <AgendaView
          clients={clients}
          appointments={appointments}
          onAddAppointment={handleAddAppointment}
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
        />
      );
      case 'mais': return <MoreView onNavigate={setCurrentScreen} />;
      case 'recorrencia': return <RecurrenceView clients={clients} studioName={userProfile.name} />;
      case 'metas': return <GoalsView />;
      case 'servicos': return (
        <ServicesView
          onNavigate={setCurrentScreen}
          onSetFinanceFilter={setFinanceFilter}
        />
      );
      case 'estoque': return <InventoryView />;
      case 'ajustes': return (
        <SettingsView
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          profile={userProfile}
          onUpdateProfile={setUserProfile}
        />
      );
      case 'ai-analysis': return <AIAnalysisView onClose={() => setCurrentScreen('dashboard')} onAction={() => { }} onNavigate={setCurrentScreen} />;
      case 'alertas': return <AlertsView onBack={() => setCurrentScreen('dashboard')} onNavigate={setCurrentScreen} />;
      case 'previsao': return <WeeklyForecastView onBack={() => setCurrentScreen('dashboard')} onNavigate={setCurrentScreen} />;
      default: return <DashboardView onNavigate={setCurrentScreen} />;
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
    </div>
  );
};

export default App;

