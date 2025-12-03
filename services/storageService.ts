import { Car, Lead, SiteSettings, MOCK_CARS, DEFAULT_SETTINGS } from '../types';

const KEYS = {
  CARS: 'autovitrine_cars',
  LEADS: 'autovitrine_leads',
  SETTINGS: 'autovitrine_settings'
};

export const storageService = {
  getCars: (): Car[] => {
    const data = localStorage.getItem(KEYS.CARS);
    if (!data) {
      // Seed with mock data if empty
      localStorage.setItem(KEYS.CARS, JSON.stringify(MOCK_CARS));
      return MOCK_CARS;
    }
    return JSON.parse(data);
  },

  saveCars: (cars: Car[]) => {
    localStorage.setItem(KEYS.CARS, JSON.stringify(cars));
  },

  getLeads: (): Lead[] => {
    const data = localStorage.getItem(KEYS.LEADS);
    return data ? JSON.parse(data) : [];
  },

  saveLead: (lead: Lead) => {
    const leads = storageService.getLeads();
    const newLeads = [lead, ...leads];
    localStorage.setItem(KEYS.LEADS, JSON.stringify(newLeads));
  },

  updateLeadStatus: (id: string, status: 'new' | 'contacted' | 'closed') => {
    const leads = storageService.getLeads();
    const updated = leads.map(l => l.id === id ? { ...l, status } : l);
    localStorage.setItem(KEYS.LEADS, JSON.stringify(updated));
  },

  getSettings: (): SiteSettings => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  },

  saveSettings: (settings: SiteSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  }
};