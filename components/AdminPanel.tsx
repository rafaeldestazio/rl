import React, { useState } from 'react';
import { Car, Lead, SiteSettings } from '../types';
import { storageService } from '../services/storageService';
import { LayoutDashboard, CarFront, Users, Settings, Plus, Edit, Trash, Eye, Phone, CheckCircle, Clock } from 'lucide-react';
import CarForm from './CarForm';

interface AdminPanelProps {
  cars: Car[];
  setCars: React.Dispatch<React.SetStateAction<Car[]>>;
  settings: SiteSettings;
  setSettings: (s: SiteSettings) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ cars, setCars, settings, setSettings }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'leads' | 'settings'>('dashboard');
  const [leads, setLeads] = useState<Lead[]>(storageService.getLeads());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // --- Actions ---
  const handleSaveCar = (car: Car) => {
    let newCars;
    if (editingCar) {
      newCars = cars.map(c => c.id === car.id ? car : c);
    } else {
      newCars = [car, ...cars];
    }
    setCars(newCars);
    storageService.saveCars(newCars);
    setIsFormOpen(false);
    setEditingCar(null);
  };

  const handleDeleteCar = (id: string) => {
    if (confirm('Remover veículo permanentemente?')) {
      const newCars = cars.filter(c => c.id !== id);
      setCars(newCars);
      storageService.saveCars(newCars);
    }
  };

  const handleLeadStatus = (id: string) => {
    storageService.updateLeadStatus(id, 'contacted');
    setLeads(storageService.getLeads());
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSettings(settings);
    alert('Configurações salvas!');
  };

  // --- Views ---

  const Dashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-surface p-6 border border-white/5 relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CarFront size={100} className="text-white" />
        </div>
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Veículos em Estoque</h3>
        <p className="text-4xl font-serif font-bold text-white">{cars.filter(c => c.status === 'available').length}</p>
        <p className="text-xs text-secondary mt-4 border-t border-white/5 pt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-secondary rounded-full"></span> {cars.length} Total cadastrados
        </p>
      </div>
      
      <div className="bg-surface p-6 border border-white/5 relative overflow-hidden group">
         <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={100} className="text-white" />
        </div>
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Leads Financiamento</h3>
        <p className="text-4xl font-serif font-bold text-white">{leads.filter(l => l.type === 'financing').length}</p>
        <p className="text-xs text-secondary mt-4 border-t border-white/5 pt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-secondary rounded-full"></span> {leads.filter(l => l.type === 'financing' && l.status === 'new').length} Novos
        </p>
      </div>

      <div className="bg-surface p-6 border border-white/5 relative overflow-hidden group">
         <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={100} className="text-white" />
        </div>
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Leads Venda/Troca</h3>
        <p className="text-4xl font-serif font-bold text-white">{leads.filter(l => l.type === 'sell').length}</p>
         <p className="text-xs text-secondary mt-4 border-t border-white/5 pt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-secondary rounded-full"></span> {leads.filter(l => l.type === 'sell' && l.status === 'new').length} Novos
        </p>
      </div>
    </div>
  );

  const Inventory = () => (
    <div className="bg-surface border border-white/5">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
            <h3 className="font-serif font-bold text-white">Gerenciar Veículos</h3>
            <button onClick={() => { setEditingCar(null); setIsFormOpen(true); }} className="bg-secondary text-black px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-secondary-dark flex items-center gap-2">
                <Plus size={16} /> Adicionar
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="bg-black/40 text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                        <th className="px-6 py-4">Veículo</th>
                        <th className="px-6 py-4">Preço</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {cars.map(car => (
                        <tr key={car.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <img src={car.imageUrl} className="w-12 h-12 object-cover border border-white/10" />
                                    <div>
                                        <p className="font-bold text-white">{car.make} {car.model}</p>
                                        <p className="text-xs text-gray-600">{car.year}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-medium text-white">R$ {car.price.toLocaleString()}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                    car.status === 'available' ? 'text-green-500 border border-green-900/50 bg-green-900/20' : 
                                    car.status === 'sold' ? 'text-red-500 border border-red-900/50 bg-red-900/20' : 'text-yellow-500 border border-yellow-900/50 bg-yellow-900/20'
                                }`}>
                                    {car.status === 'available' ? 'Disponível' : car.status === 'sold' ? 'Vendido' : 'Reservado'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => { setEditingCar(car); setIsFormOpen(true); }} className="text-blue-400 hover:text-white hover:bg-blue-900/30 p-2"><Edit size={16} /></button>
                                    <button onClick={() => handleDeleteCar(car.id)} className="text-red-400 hover:text-white hover:bg-red-900/30 p-2"><Trash size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const LeadsList = () => (
    <div className="space-y-4">
        {leads.length === 0 && <p className="text-gray-500 text-center py-12 border border-dashed border-white/5">Nenhum lead recebido ainda.</p>}
        {leads.sort((a,b) => b.date - a.date).map(lead => (
            <div key={lead.id} className="bg-surface p-6 border border-white/5 hover:border-secondary/30 transition-colors flex flex-col md:flex-row gap-6 justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${lead.type === 'financing' ? 'bg-indigo-900/30 text-indigo-400 border border-indigo-900/50' : 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/50'}`}>
                            {lead.type === 'financing' ? 'Financiamento' : 'Venda/Troca'}
                        </span>
                         {lead.status === 'new' && <span className="flex items-center gap-1 text-[10px] text-secondary font-bold uppercase"><Clock size={10}/> Novo</span>}
                    </div>
                    <h4 className="font-serif font-bold text-xl text-white">{lead.customerName}</h4>
                    <p className="text-sm text-gray-400 mb-1">{lead.customerPhone} {lead.city ? `• ${lead.city}` : ''}</p>
                    
                    <div className="mt-4 text-sm bg-black/30 p-4 border border-white/5 text-gray-300 whitespace-pre-wrap font-light">
                        {lead.details}
                    </div>
                    <p className="text-[10px] text-gray-600 mt-2 uppercase tracking-widest">{new Date(lead.date).toLocaleString()}</p>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                     <button 
                        onClick={() => {
                            handleLeadStatus(lead.id);
                            window.open(`https://wa.me/${lead.customerPhone.replace(/[^0-9]/g, '')}`, '_blank');
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                     >
                        <Phone size={16} /> Chamar no WhatsApp
                     </button>
                     {lead.status !== 'contacted' && (
                         <button onClick={() => handleLeadStatus(lead.id)} className="bg-white/5 hover:bg-white/10 text-gray-400 px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors border border-white/5">
                            Marcar como lido
                         </button>
                     )}
                </div>
            </div>
        ))}
    </div>
  );

  const SettingsForm = () => (
    <div className="bg-surface p-8 border border-white/5 max-w-2xl">
        <h3 className="font-serif font-bold text-white mb-8 text-xl">Configurações da Loja</h3>
        <form onSubmit={handleSaveSettings} className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Nome da Loja</label>
                <input type="text" disabled value={settings.storeName} className="w-full px-4 py-3 bg-black/50 border border-white/5 text-gray-500 cursor-not-allowed" />
                <p className="text-[10px] text-gray-600 mt-1">Fixo conforme contrato RL IMPORTS.</p>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">WhatsApp de Contato</label>
                <input type="text" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full px-4 py-3 bg-black border border-white/10 text-white focus:border-secondary outline-none" />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Endereço</label>
                <input type="text" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full px-4 py-3 bg-black border border-white/10 text-white focus:border-secondary outline-none" />
            </div>
            <button type="submit" className="bg-secondary text-black px-8 py-3 font-bold uppercase tracking-wider hover:bg-secondary-dark mt-4">Salvar Alterações</button>
        </form>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[calc(100vh-140px)]">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex flex-col gap-2">
        <button onClick={() => setActiveTab('dashboard')} className={`p-4 flex items-center gap-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'dashboard' ? 'bg-secondary text-black' : 'hover:bg-white/5 text-gray-400'}`}>
            <LayoutDashboard size={18} /> Dashboard
        </button>
        <button onClick={() => setActiveTab('inventory')} className={`p-4 flex items-center gap-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'inventory' ? 'bg-secondary text-black' : 'hover:bg-white/5 text-gray-400'}`}>
            <CarFront size={18} /> Estoque
        </button>
        <button onClick={() => setActiveTab('leads')} className={`p-4 flex items-center gap-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'leads' ? 'bg-secondary text-black' : 'hover:bg-white/5 text-gray-400'}`}>
            <Users size={18} /> Leads
        </button>
         <button onClick={() => setActiveTab('settings')} className={`p-4 flex items-center gap-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'settings' ? 'bg-secondary text-black' : 'hover:bg-white/5 text-gray-400'}`}>
            <Settings size={18} /> Configurações
        </button>
      </div>

      {/* Content */}
      <div className="flex-1">
          <h2 className="text-3xl font-serif font-bold text-white mb-8">
              {activeTab === 'dashboard' ? 'Visão Geral' : activeTab === 'inventory' ? 'Gestão de Estoque' : activeTab === 'leads' ? 'Leads Recebidos' : 'Configurações'}
          </h2>
          
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'leads' && <LeadsList />}
          {activeTab === 'settings' && <SettingsForm />}
      </div>

      {isFormOpen && (
        <CarForm 
            initialData={editingCar}
            onSave={handleSaveCar}
            onCancel={() => { setIsFormOpen(false); setEditingCar(null); }}
        />
      )}
    </div>
  );
};

export default AdminPanel;