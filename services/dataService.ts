
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_CLIENTS, MOCK_SERVICES, MOCK_APPOINTMENTS } from '../constants';
import { Client, Service, Appointment } from '../types';
import { GoogleGenAI } from "@google/genai";

// Guideline: Always use a named parameter for the API key and use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const dataService = {
  // --- CLIENTES ---
  async getClients(): Promise<Client[]> {
    if (!isSupabaseConfigured() || !supabase) return MOCK_CLIENTS;

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return (data || []).map(d => ({
      id: d.id,
      name: d.name,
      status: d.status,
      lastVisit: d.last_visit,
      frequency: d.frequency,
      avgTicket: Number(d.avg_ticket),
      growth: d.growth,
      avatar: d.avatar,
      phone: d.phone,
      instagram: d.instagram,
      totalSpent: Number(d.total_spent),
      totalVisits: d.total_visits,
      notes: d.notes,
      expectedReturn: d.expected_return
    }));
  },

  async updateClient(client: Client): Promise<Client> {
    if (!isSupabaseConfigured() || !supabase) return client;

    const dbClient = {
      id: client.id,
      name: client.name,
      status: client.status,
      last_visit: client.lastVisit,
      frequency: client.frequency,
      avg_ticket: client.avgTicket,
      growth: client.growth,
      avatar: client.avatar,
      phone: client.phone,
      instagram: client.instagram,
      total_spent: client.totalSpent,
      total_visits: client.totalVisits,
      notes: client.notes,
      expected_return: client.expectedReturn
    };

    const { data, error } = await supabase
      .from('clients')
      .upsert(dbClient)
      .select()
      .single();

    if (error) throw error;
    return {
      ...client,
      id: data.id
    };
  },

  async deleteClient(id: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return;
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
  },

  // --- SERVIÇOS ---
  async getServices(): Promise<Service[]> {
    if (!isSupabaseConfigured() || !supabase) return MOCK_SERVICES;

    const { data, error } = await supabase
      .from('services')
      .select('*');

    if (error) throw error;
    return (data || []).map(d => ({
      id: d.id,
      name: d.name,
      price: Number(d.price),
      duration: d.duration,
      durationMinutes: d.duration_minutes,
      materialCost: Number(d.material_cost),
      indirectCost: Number(d.indirect_cost),
      description: d.description,
      category: d.category,
      repetition: d.repetition,
      image: d.image
    }));
  },

  // --- AGENDA ---
  async getAppointments(date?: string): Promise<Appointment[]> {
    if (!isSupabaseConfigured() || !supabase) return MOCK_APPOINTMENTS;

    let query = supabase.from('appointments').select('*');
    if (date) query = query.eq('date', date);

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(d => ({
      id: d.id,
      clientId: d.client_id,
      clientName: d.client_name,
      time: d.time,
      date: d.date,
      serviceId: d.service_id,
      serviceName: d.service_name,
      value: Number(d.value),
      status: d.status
    }));
  },

  async addAppointment(appt: Appointment): Promise<Appointment> {
    if (!isSupabaseConfigured() || !supabase) return appt;

    const dbAppt = {
      id: appt.id.startsWith('appt-') ? undefined : appt.id, // Generate new if mock ID
      client_id: appt.clientId,
      client_name: appt.clientName,
      time: appt.time,
      date: appt.date,
      service_id: appt.serviceId,
      service_name: appt.serviceName,
      value: appt.value,
      status: appt.status
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert(dbAppt)
      .select()
      .single();

    if (error) throw error;
    return {
      ...appt,
      id: data.id
    };
  },

  // --- IA ANALYTICS ---
  async generateAIInsight(context: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise estes dados de faturamento e agenda para uma trancista profissional. 
                  Responda com um insight estratégico curto de até 100 caracteres. Contexto: ${context}`,
        config: {
          systemInstruction: "Você é um consultor financeiro especializado em estética afro e trancismo profissional.",
          temperature: 0.7,
        }
      });
      return response.text;
    } catch (e) {
      console.error("AI Insight Error:", e);
      return "Foque na retenção de clientes VIP este mês.";
    }
  }
};

