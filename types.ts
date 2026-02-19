
export type Screen =
  | 'dashboard'
  | 'ativos'
  | 'agenda'
  | 'servicos'
  | 'financeiro'
  | 'estoque'
  | 'recorrencia'
  | 'metas'
  | 'mais'
  | 'ajustes'
  | 'ai-analysis'
  | 'client-detail'
  | 'alertas'
  | 'previsao';

export interface HistoryItem {
  id: string;
  date: string;
  service: string;
  price: number;
  paymentMethod: string;
}

export interface Client {
  id: string;
  name: string;
  status: 'ATIVA' | 'EM RISCO' | 'INATIVA';
  lastVisit: string;
  frequency: string; // Ex: "45 dias"
  avgTicket: number;
  growth: string;
  avatar: string;
  phone: string;
  instagram: string;
  totalSpent: number;
  totalVisits: number;
  notes?: string;
  history?: HistoryItem[];
  expectedReturn?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: string; // Ex: "6h"
  durationMinutes: number;
  materialCost: number;
  indirectCost: number;
  description: string;
  category: 'Tranças' | 'Manutenção' | 'Retoque' | 'Tratamento' | 'Outro';
  repetition: string;
  image: string;
  profitPerHour?: number;
  profitMargin?: number;
  isMostProfitable?: boolean;
  timesPerformedThisMonth?: number;
  totalRevenueMonth?: number;
  tag?: 'Alta margem' | 'Demorado' | 'Popular' | 'Baixa rentabilidade';
}

export interface Material {
  id: string;
  name: string;
  brand: string;
  quantity: number;
  minQuantity: number;
  cost: number;
  color?: string;
  category?: 'Fibra' | 'Acessório' | 'Cola' | 'Linha' | 'Ferramenta';
  unit?: 'unidade' | 'rolo' | 'pacote' | 'caixa';
  linkedServices?: string[];
  avgConsumption?: string;
  lastMovement?: string;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  type: 'faturamento' | 'atendimentos' | 'ticket';
  deadline?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  time: string;
  date: string;
  serviceId: string;
  serviceName: string;
  value: number;
  status: 'CONFIRMADO' | 'PENDENTE' | 'CONCLUÍDO' | 'CANCELADO' | 'PAGO_SINAL';
  paymentStatus: 'PENDENTE' | 'PAGO_SINAL' | 'PAGO_TOTAL';
  depositValue?: number;
}

export interface Transaction {
  id: string;
  type: 'RECEITA' | 'DESPESA';
  category: string;
  description: string;
  value: number;
  date: string;
  status: 'PAGO' | 'PENDENTE';
}
