
import React, { useState } from 'react';
import { Material, Service } from '../types';
import { MOCK_SERVICES } from '../constants';
import { dataService } from '../services/dataService';
import {
  Package, Plus, AlertTriangle, TrendingDown,
  DollarSign, Check, ChevronRight, Sparkles,
  Search, Info, History, X, Calculator,
  Zap, ArrowRight, BarChart3, Layers
} from 'lucide-react';

const InventoryView: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [newMaterialInput, setNewMaterialInput] = useState<Partial<Material>>({
    name: '', brand: '', category: 'Fibra', cost: 0, quantity: 0, minQuantity: 0, unit: 'unidade'
  });

  React.useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const data = await dataService.getInventory();
      setMaterials(data);
    } catch (e) {
      console.error("Error loading inventory:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Cálculos de Negócio
  const totalGasto = materials.reduce((acc, m) => acc + (m.cost * m.quantity), 0);
  const faturamentoReal = 0; // Isso deveria vir de props se quisermos ser precisos
  const impactPercent = faturamentoReal > 0 ? Math.round((totalGasto / faturamentoReal) * 100) : 0;
  const isHealthy = impactPercent < 15;

  const criticalItems = materials.filter(m => m.quantity <= m.minQuantity);
  const slowMovingItems = materials.filter(m => m.category === 'Cola'); // Exemplo de regra

  const filteredMaterials = materials.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMaterial = async () => {
    if (!newMaterialInput.name) return;
    try {
      const materialToSave: Material = {
        id: `m-${Date.now()}`,
        name: newMaterialInput.name || '',
        brand: newMaterialInput.brand || '',
        quantity: Number(newMaterialInput.quantity) || 0,
        minQuantity: Number(newMaterialInput.minQuantity) || 0,
        cost: Number(newMaterialInput.cost) || 0,
        category: (newMaterialInput.category as any) || 'Fibra',
        unit: (newMaterialInput.unit as any) || 'unidade',
      };
      await dataService.updateInventory(materialToSave);
      await loadInventory();
      triggerToast();
      setIsAddModalOpen(false);
      setNewMaterialInput({ name: '', brand: '', category: 'Fibra', cost: 0, quantity: 0, minQuantity: 0, unit: 'unidade' });
    } catch (e) {
      console.error("Error saving material:", e);
    }
  };

  const triggerToast = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const getStatusColor = (qty: number, min: number) => {
    if (qty === 0) return 'text-red-600 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
    if (qty <= min) return 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
    return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
  };

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-500 pb-32">

      {/* Toast Feedback */}
      {showSuccessToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-emerald-500 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top">
          <Check size={14} strokeWidth={4} />
          <span>Estoque Atualizado</span>
        </div>
      )}

      {/* 🔝 1️⃣ CARD SUPERIOR – VISÃO ESTRATÉGICA */}
      <div className="bg-[#121212] rounded-[40px] p-8 border border-white/5 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-bronze/5 rounded-full blur-3xl"></div>

        <div className="text-center space-y-2 relative z-10">
          <p className="text-[10px] font-black text-bronze uppercase tracking-[0.4em]">Impacto no Lucro Mensal</p>
          <h3 className="text-6xl font-black text-white tracking-tighter">R$ {totalGasto.toLocaleString()}</h3>
          <p className="text-[11px] text-white/30 font-medium">Investido em materiais este mês</p>
        </div>

        <div className="pt-6 border-t border-white/5 space-y-4 relative z-10">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Consumo de Margem</span>
            <span className={`text-sm font-black ${isHealthy ? 'text-emerald-500' : 'text-amber-500'}`}>{impactPercent}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${isHealthy ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${impactPercent}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex items-center italic">
            {isHealthy ? (
              <><Check size={12} className="text-emerald-500 mr-2" /> Dentro da média saudável (sub-15%)</>
            ) : (
              <><AlertTriangle size={12} className="text-amber-500 mr-2" /> Atenção: Margem apertada</>
            )}
          </p>
        </div>
      </div>

      {/* 🚨 2️⃣ ALERTA INTELIGENTE */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-[32px] p-6 space-y-5 shadow-sm">
        <div className="flex items-center space-x-2">
          <Sparkles size={16} className="text-bronze" fill="currentColor" />
          <h3 className="text-[11px] font-black text-black/40 dark:text-white/20 uppercase tracking-[0.2em]">Insights de Estoque</h3>
        </div>

        <div className="space-y-3">
          {criticalItems.map(item => (
            <div key={item.id} className="flex items-start space-x-3 p-3 bg-red-500/5 rounded-2xl border border-red-500/10">
              <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-black/70 dark:text-white/70 leading-tight">
                <span className="text-red-500 font-black">{item.name}</span> acaba em aproximadamente <span className="font-black">3 atendimentos</span>.
              </p>
            </div>
          ))}
          {slowMovingItems.length > 0 && (
            <div className="flex items-start space-x-3 p-3 bg-blue-500/5 rounded-2xl border border-blue-500/10">
              <TrendingDown size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-black/70 dark:text-white/70 leading-tight">
                <span className="text-blue-500 font-black">{slowMovingItems[0].name}</span> está sem saída há 30 dias. Capital parado detectado.
              </p>
            </div>
          )}
        </div>

        <button className="w-full py-3 text-[10px] font-black text-bronze uppercase tracking-widest border border-bronze/20 rounded-xl active:bg-bronze/5 transition-colors">
          Ver todas as recomendações
        </button>
      </div>

      {/* 🔮 6️⃣ PREVISÃO DE CONSUMO (AGENDA) */}
      <div className="bg-bronze border border-bronze/20 p-6 rounded-[32px] space-y-4 text-white shadow-xl shadow-bronze/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator size={18} />
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Previsão de Consumo</h4>
          </div>
          <Zap size={16} fill="currentColor" />
        </div>
        <p className="text-xs font-medium leading-relaxed italic opacity-90">
          "Com base nos <span className="font-black">8 Box Braids</span> agendados para a semana, você precisará de <span className="font-black">24 pacotes de Jumbo</span>."
        </p>
        <div className="bg-white/10 p-4 rounded-2xl flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest">Estoque Atual: 12 pacotes</span>
          <span className="text-xs font-black bg-red-500 px-2 py-1 rounded-lg">Faltam 12 un</span>
        </div>
      </div>

      {/* 📋 3️⃣ LISTA DE ITENS (ALMOXARIFADO) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[11px] font-black text-black/40 dark:text-white/20 uppercase tracking-[0.2em]">Almoxarifado Profissional</h3>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-bronze text-white w-10 h-10 rounded-xl shadow-lg flex items-center justify-center active:scale-95 transition-transform"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 dark:text-white/10" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou marca..."
            className="w-full h-12 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl pl-12 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-bronze"
          />
        </div>

        <div className="space-y-3">
          {filteredMaterials.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedMaterial(item)}
              className="bg-white dark:bg-[#0a0a0a] p-5 rounded-[28px] border border-black/5 dark:border-white/5 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${getStatusColor(item.quantity, item.minQuantity)} shadow-inner`}>
                  <Package size={20} />
                </div>
                <div>
                  <h4 className="font-black text-black dark:text-white uppercase tracking-tight leading-none mb-1.5">{item.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-black opacity-30 uppercase tracking-widest italic">{item.brand}</span>
                    <span className="w-1 h-1 bg-black/10 rounded-full"></span>
                    <span className="text-[9px] font-black text-bronze uppercase">R$ {item.cost}/un</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-black leading-none ${item.quantity <= item.minQuantity ? 'text-amber-500' : 'text-black dark:text-white'}`}>
                  {item.quantity}
                </p>
                <p className="text-[8px] font-black opacity-20 uppercase tracking-widest">{item.unit}s</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📈 9️⃣ INDICADORES ESTRATÉGICOS (Rodapé) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-[32px] border border-black/5 dark:border-white/5 space-y-2">
          <div className="flex items-center space-x-2 text-bronze">
            <Layers size={14} />
            <p className="text-[9px] font-black uppercase tracking-widest">Giro Médio</p>
          </div>
          <h4 className="text-xl font-black text-black dark:text-white">18 dias</h4>
        </div>
        <div className="bg-white dark:bg-[#0a0a0a] p-5 rounded-[32px] border border-black/5 dark:border-white/5 space-y-2">
          <div className="flex items-center space-x-2 text-blue-500">
            <BarChart3 size={14} />
            <p className="text-[9px] font-black uppercase tracking-widest">Capital Parado</p>
          </div>
          <h4 className="text-xl font-black text-black dark:text-white">R$ 1.2k</h4>
        </div>
      </div>

      {/* ➕ MODAL: NOVO MATERIAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[150] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="bg-[#0c0c0c] border-t border-white/10 w-full rounded-t-[40px] p-8 pb-12 space-y-8 relative z-10 animate-in slide-in-from-bottom duration-500 max-h-[95dvh] overflow-y-auto hide-scrollbar shadow-2xl">
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-2"></div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white tracking-tight italic">Novo Material</h3>
                <p className="text-[10px] text-bronze font-black uppercase tracking-[0.2em]">Cadastro Almoxarifado 2.0</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 active:scale-90 transition-transform"><X size={20} /></button>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Nome do Item</label>
                    <input type="text" value={newMaterialInput.name} onChange={e => setNewMaterialInput({ ...newMaterialInput, name: e.target.value })} placeholder="Ex: Jumbo Premium" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Marca</label>
                    <input type="text" value={newMaterialInput.brand} onChange={e => setNewMaterialInput({ ...newMaterialInput, brand: e.target.value })} placeholder="Ex: Super Star" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Categoria</label>
                    <select value={newMaterialInput.category} onChange={e => setNewMaterialInput({ ...newMaterialInput, category: e.target.value as any })} className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-bold outline-none appearance-none">
                      <option>Fibra</option>
                      <option>Linha</option>
                      <option>Acessório</option>
                      <option>Cola</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Preço Unitário</label>
                    <input type="number" value={newMaterialInput.cost} onChange={e => setNewMaterialInput({ ...newMaterialInput, cost: Number(e.target.value) })} placeholder="0.00" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-emerald-500 font-black outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Quantidade Atual</label>
                    <input type="number" value={newMaterialInput.quantity} onChange={e => setNewMaterialInput({ ...newMaterialInput, quantity: Number(e.target.value) })} placeholder="0" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white font-black outline-none" />
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddMaterial}
                className="w-full py-5 bg-bronze text-white font-black text-sm rounded-2xl shadow-xl active:scale-[0.98] transition-all uppercase tracking-[0.3em] flex items-center justify-center space-x-3"
              >
                <Check size={20} />
                <span>Adicionar ao Estoque</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💰 7️⃣ DETALHE DO MATERIAL */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-[140] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in" onClick={() => setSelectedMaterial(null)}></div>
          <div className="bg-[#0c0c0c] border-t border-white/10 w-full rounded-t-[40px] p-8 pb-12 space-y-8 relative z-10 animate-in slide-in-from-bottom duration-500 max-h-[90dvh] overflow-y-auto hide-scrollbar shadow-2xl text-center">
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-2"></div>

            <div className="space-y-4">
              <div className="w-20 h-20 bg-bronze/10 rounded-full flex items-center justify-center text-bronze mx-auto border border-bronze/20 shadow-inner">
                <Package size={32} />
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">{selectedMaterial.name}</h3>
              <p className="text-[10px] text-bronze font-black uppercase tracking-[0.3em]">{selectedMaterial.brand} • {selectedMaterial.category}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/5 p-4 rounded-2xl text-left border border-white/5">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Custo Médio</p>
                <p className="text-sm font-black text-emerald-500">R$ {selectedMaterial.cost}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl text-left border border-white/5">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Consumo</p>
                <p className="text-sm font-black text-white">48h/un</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl text-left border border-white/5">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Giro</p>
                <p className="text-sm font-black text-white">15 dias</p>
              </div>
            </div>

            <div className="bg-[#121212] border border-bronze/20 p-6 rounded-[32px] space-y-4 text-left relative overflow-hidden">
              <div className="flex items-center space-x-2 text-[10px] font-black text-bronze uppercase tracking-widest relative z-10">
                <History size={14} />
                <span>Última Movimentação</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed font-medium italic relative z-10">
                {selectedMaterial.lastMovement}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button className="w-full py-5 bg-bronze text-white font-black rounded-2xl active:scale-95 transition-transform uppercase tracking-widest text-xs flex items-center justify-center space-x-2">
                <ArrowRight size={16} />
                <span>Registrar Entrada</span>
              </button>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="w-full py-4 text-white/20 font-black uppercase tracking-widest text-[10px]"
              >
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER INFO */}
      <div className="text-center pt-8 opacity-20">
        <p className="text-[8px] font-black text-black dark:text-white uppercase tracking-[0.5em] leading-relaxed italic">
          ESTOQUE INTELIGENTE RAÍZES v3.0<br />
          ANTENCIPAÇÃO GERA MARGEM
        </p>
      </div>
    </div>
  );
};

export default InventoryView;
