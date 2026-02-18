
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

export const MOCK_CLIENTS: Client[] = [];
export const MOCK_SERVICES: Service[] = [];
export const MOCK_APPOINTMENTS: Appointment[] = [];
export const MOCK_TRANSACTIONS: Transaction[] = [];
export const MOCK_GOALS: Goal[] = [];
export const MOCK_MATERIALS: Material[] = [];
