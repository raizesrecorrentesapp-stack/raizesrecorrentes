
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Client, Service, Appointment, Material } from '../types';
import { GoogleGenAI } from "@google/genai";

// Guideline: Always use a named parameter for the API key and use process.env.API_KEY directly.
const getApiKey = () => {
  return (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.API_KEY || '';
};

export const dataService = {
  // --- CLIENTES ---
  async getClients(): Promise<Client[]> {
    if (!isSupabaseConfigured() || !supabase) return [];

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
      id: client.id.startsWith('c-') ? undefined : client.id,
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
      id: data.id,
      lastVisit: data.last_visit,
      totalSpent: Number(data.total_spent),
      totalVisits: data.total_visits
    };
  },

  async deleteClient(id: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return;
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
  },

  // --- SERVIÇOS ---
  async getServices(): Promise<Service[]> {
    if (!isSupabaseConfigured() || !supabase) return [];

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

  async updateService(service: Service): Promise<Service> {
    if (!isSupabaseConfigured() || !supabase) return service;

    const dbService = {
      id: service.id && !service.id.startsWith('s-') ? service.id : undefined,
      name: service.name,
      price: service.price,
      duration: service.duration,
      duration_minutes: service.durationMinutes,
      material_cost: service.materialCost,
      indirect_cost: service.indirectCost,
      description: service.description,
      category: service.category,
      repetition: service.repetition,
      image: service.image
    };

    const { data, error } = await supabase
      .from('services')
      .upsert(dbService)
      .select()
      .single();

    if (error) throw error;
    return {
      ...service,
      id: data.id
    };
  },

  async deleteService(id: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
  },

  // --- AGENDA ---
  async getAppointments(date?: string): Promise<Appointment[]> {
    if (!isSupabaseConfigured() || !supabase) return [];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase.from('appointments').select('*').eq('user_id', user.id);
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
      status: d.status,
      paymentStatus: d.payment_status,
      depositValue: Number(d.deposit_value)
    }));
  },

  async addAppointment(appt: Appointment): Promise<Appointment> {
    if (!isSupabaseConfigured() || !supabase) return appt;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    let finalClientId = appt.clientId;

    if (finalClientId.startsWith('c-')) {
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('name', appt.clientName)
        .maybeSingle();

      if (existingClient) {
        finalClientId = existingClient.id;
      } else {
        const { data: newClient, error: clientErr } = await supabase
          .from('clients')
          .insert({
            name: appt.clientName,
            status: 'ATIVA',
            total_visits: 1,
            total_spent: appt.value,
            last_visit: appt.date,
            user_id: user.id
          })
          .select()
          .single();

        if (clientErr) throw clientErr;
        finalClientId = newClient.id;
      }
    }

    const finalServiceId = (appt.serviceId && !appt.serviceId.startsWith('s-'))
      ? appt.serviceId
      : undefined;

    const dbAppt = {
      user_id: user.id,
      client_id: finalClientId,
      client_name: appt.clientName,
      time: appt.time,
      date: appt.date,
      service_id: finalServiceId,
      service_name: appt.serviceName,
      value: appt.value,
      status: appt.status,
      payment_status: appt.paymentStatus || 'PENDENTE',
      deposit_value: appt.depositValue || 0
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert(dbAppt)
      .select()
      .single();

    if (error) throw error;
    return {
      ...appt,
      id: data.id,
      clientId: finalClientId,
      serviceId: data.service_id || appt.serviceId,
      paymentStatus: data.payment_status,
      depositValue: Number(data.deposit_value)
    };
  },

  async updateAppointmentStatus(id: string, status: Appointment['status'], paymentStatus?: Appointment['paymentStatus']): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return;

    const updates: any = { status };
    if (paymentStatus) updates.payment_status = paymentStatus;

    const { error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },

  async deleteAppointment(id: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return;
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) throw error;
  },

  // --- ESTOQUE ---
  async getInventory(): Promise<Material[]> {
    if (!isSupabaseConfigured() || !supabase) return [];
    const { data, error } = await supabase.from('inventory').select('*').order('name');
    if (error) throw error;
    return (data || []).map(d => ({
      id: d.id,
      name: d.name,
      brand: d.brand,
      quantity: Number(d.quantity),
      minQuantity: Number(d.min_quantity),
      cost: Number(d.cost),
      category: d.category,
      unit: d.unit,
      lastMovement: d.last_movement
    }));
  },

  async updateInventory(material: Material): Promise<Material> {
    if (!isSupabaseConfigured() || !supabase) return material;
    const { data: { user } } = await supabase.auth.getUser();

    const dbMaterial = {
      id: material.id.includes('-') && !material.id.startsWith('m-') ? material.id : undefined,
      user_id: user?.id,
      name: material.name,
      brand: material.brand,
      quantity: material.quantity,
      min_quantity: material.minQuantity,
      cost: material.cost,
      category: material.category,
      unit: material.unit,
      last_movement: material.lastMovement
    };

    const { data, error } = await supabase.from('inventory').upsert(dbMaterial).select().single();
    if (error) throw error;
    return { ...material, id: data.id };
  },

  async deleteInventory(id: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return;
    const { error } = await supabase.from('inventory').delete().eq('id', id);
    if (error) throw error;
  },

  // --- METAS ---
  async getGoals(): Promise<any> {
    if (!isSupabaseConfigured() || !supabase) return null;
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM
    const { data, error } = await supabase.from('goals').select('*').eq('month', month).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateGoals(goals: any): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    const month = new Date().toISOString().slice(0, 7);

    const { error } = await supabase.from('goals').upsert({
      user_id: user?.id,
      month,
      revenue_goal: goals.revenue,
      working_days: goals.workingDays,
      hours_per_day: goals.hoursPerDay,
      current_revenue: goals.currentRevenue
    }, { onConflict: 'user_id,month' });

    if (error) throw error;
  },

  // --- IA ANALYTICS ---
  async generateAIInsight(context: string) {
    try {
      const apiKey = getApiKey();
      if (!apiKey) return "Configure sua chave de API para insights personalizados.";

      const ai = new GoogleGenAI({ apiKey });
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
  },

  // --- AUTENTICAÇÃO ---
  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error("Supabase não configurado.");
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    if (!isSupabaseConfigured() || !supabase) return;
    await supabase.auth.signOut();
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // --- PERFIL DO USUÁRIO ---
  async getProfile(): Promise<any> {
    if (!isSupabaseConfigured() || !supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return data;
  },

  async updateProfile(profile: any): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado.");

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  }
};

