
import React from 'react';
import { 
  LayoutDashboard, Users, Calendar, 
  DollarSign, MoreHorizontal, TrendingUp 
} from 'lucide-react';
import { Client, Service, Appointment, Transaction, Goal, Material } from './types';

export const PRIMARY_BRONZE = '#C69372';
export const GAIN_GREEN = '#10b981';
export const RISK_RED = '#ef4444';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Início', icon: <LayoutDashboard size={20} /> },
  { id: 'agenda', label: 'Agenda', icon: <Calendar size={20} /> },
  { id: 'ativos', label: 'Clientes', icon: <Users size={20} /> },
  { id: 'financeiro', label: 'Margem', icon: <TrendingUp size={20} /> },
  { id: 'mais', label: 'Mais', icon: <MoreHorizontal size={20} /> },
];

export const MOCK_CLIENTS: Client[] = [
  { 
    id: '1', name: 'Juliana Silva', status: 'ATIVA', lastVisit: '2024-05-10', 
    frequency: '45 dias', avgTicket: 450, growth: '+10%', 
    avatar: 'https://picsum.photos/seed/juliana/200', phone: '(11) 99999-9999',
    instagram: '@julianas', totalSpent: 2800, totalVisits: 6,
    expectedReturn: '2024-06-25', notes: 'Prefere jumbo mel.',
    history: [
      { id: 'h1', date: '2024-05-10', service: 'Box Braids G', price: 450, paymentMethod: 'Pix' }
    ]
  },
  { 
    id: '2', name: 'Ana Oliveira', status: 'EM RISCO', lastVisit: '2024-04-05', 
    frequency: '45 dias', avgTicket: 390, growth: 'Risco', 
    avatar: 'https://picsum.photos/seed/ana/200', phone: '(11) 98888-8888',
    instagram: '@ana_oli', totalSpent: 780, totalVisits: 2,
    notes: 'Couro cabeludo sensível.'
  },
  { 
    id: '3', name: 'Beatriz Costa', status: 'INATIVA', lastVisit: '2024-01-15', 
    frequency: '60 dias', avgTicket: 500, growth: 'Perdida', 
    avatar: 'https://picsum.photos/seed/bia/200', phone: '(11) 97777-7777',
    instagram: '@biacosta', totalSpent: 1500, totalVisits: 3
  }
];

export const MOCK_SERVICES: Service[] = [
  {
    id: 's1', name: 'Box Braids G', price: 450, duration: '6h', durationMinutes: 360, materialCost: 82, indirectCost: 20,
    description: 'Tranças soltas grandes.', category: 'Tranças', repetition: '8 semanas',
    image: 'https://picsum.photos/seed/braids/200', profitPerHour: 58.3, profitMargin: 81,
    isMostProfitable: false, timesPerformedThisMonth: 8, totalRevenueMonth: 3600, tag: 'Popular'
  },
  {
    id: 's2', name: 'Nagô Design', price: 390, duration: '3h', durationMinutes: 180, materialCost: 40, indirectCost: 10,
    description: 'Tranças rasteiras desenhadas.', category: 'Nagô' as any, repetition: '4 semanas',
    image: 'https://picsum.photos/seed/nago/200', profitPerHour: 113.3, profitMargin: 87,
    isMostProfitable: true, timesPerformedThisMonth: 12, totalRevenueMonth: 4680, tag: 'Alta margem'
  },
  {
    id: 's3', name: 'Goddess Braids', price: 380, duration: '5h', durationMinutes: 300, materialCost: 150, indirectCost: 15,
    description: 'Tranças com fios soltos.', category: 'Tranças', repetition: '6 semanas',
    image: 'https://picsum.photos/seed/goddess/200', profitPerHour: 43, profitMargin: 60,
    timesPerformedThisMonth: 5, totalRevenueMonth: 1900, tag: 'Baixa rentabilidade'
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { 
    id: 'a1', clientId: '1', clientName: 'Juliana Silva', time: '09:00', date: '2024-10-14',
    serviceId: 's1', serviceName: 'BOX BRAIDS G', value: 450, status: 'CONFIRMADO'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'RECEITA', category: 'Serviço', description: 'Box Braids - Juliana', value: 450, date: '2024-05-22', status: 'PAGO' },
  { id: 't2', type: 'DESPESA', category: 'Material', description: 'Pacote Jumbo Mel', value: 120, date: '2024-05-20', status: 'PAGO' },
  { id: 't3', type: 'DESPESA', category: 'Aluguel', description: 'Sala Maio', value: 600, date: '2024-05-05', status: 'PAGO' }
];

export const MOCK_GOALS: Goal[] = [
  { id: 'g1', title: 'Faturamento Maio', target: 8000, current: 5200, type: 'faturamento' },
  { id: 'g2', title: 'Atendimentos', target: 30, current: 22, type: 'atendimentos' }
];

export const MOCK_MATERIALS: Material[] = [
  { 
    id: 'm1', name: 'Jumbo Premium', brand: 'Super Star', quantity: 12, minQuantity: 5, cost: 25, 
    color: 'Mel', category: 'Fibra', unit: 'pacote', linkedServices: ['Box Braids G', 'Nagô Design'],
    avgConsumption: '1 a cada 2 dias', lastMovement: '05/02: Entrada de 20 un'
  },
  { 
    id: 'm2', name: 'Lastex', brand: 'São Francisco', quantity: 2, minQuantity: 3, cost: 10, 
    color: 'Preto', category: 'Linha', unit: 'rolo', linkedServices: ['Box Braids G', 'Manutenção'],
    avgConsumption: '1 a cada 3 dias', lastMovement: '10/02: Saída de 1 un'
  },
  {
    id: 'm3', name: 'Cola Profissional', brand: 'Bonder PRO', quantity: 5, minQuantity: 2, cost: 45,
    category: 'Cola', unit: 'unidade', linkedServices: ['Entrelace'],
    avgConsumption: 'Giro lento (30 dias+)', lastMovement: '01/02: Entrada de 5 un'
  }
];
