import React, { useState, useMemo, useEffect } from 'react';
import { Car, ViewMode, SiteSettings, DEFAULT_SETTINGS } from './types';
import { storageService } from './services/storageService';
import CarCard from './components/CarCard';
import CarDetail from './components/CarDetail';
import AdminPanel from './components/AdminPanel';
import { LeadForm } from './components/LeadForms';
import { ShieldCheck, Lock, LogOut, Search, Filter, X, Menu, Phone, Instagram, Facebook, Crown } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [cars, setCars] = useState<Car[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('Todos'); // 'Todos', 'Novos', 'Usados'
  
  // Auth
  const [password, setPassword] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [leadContext, setLeadContext] = useState('');

  // Initialization
  useEffect(() => {
    setCars(storageService.getCars());
    const savedSettings = storageService.getSettings();
    // Force RL Imports branding if settings are generic, otherwise load saved
    if(savedSettings.storeName !== 'RL IMPORTS') {
       storageService.saveSettings(DEFAULT_SETTINGS);
       setSettings(DEFAULT_SETTINGS);
    } else {
       setSettings(savedSettings);
    }
  }, []);

  // Filter Logic
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      // If public view, hide sold cars unless we want to show them as "SOLD"
      if (viewMode !== 'admin' && car.status !== 'available' && car.status !== 'reserved') return false;

      const matchesSearch = 
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'Todos' || 
        (filterType === 'Novos' && car.year >= 2023) ||
        (filterType === 'Usados' && car.year < 2023);

      return matchesSearch && matchesType;
    });
  }, [cars, searchQuery, filterType, viewMode]);

  // Actions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '!RL@123') {
      setViewMode('admin');
      setPassword('');
      setIsMobileMenuOpen(false);
    } else {
      alert('Senha incorreta.');
    }
  };

  const handleLogout = () => {
    setViewMode('home');
    setIsMobileMenuOpen(false);
  };

  // --- Render Views ---

  if (selectedCar) {
    return (
      <CarDetail 
        car={selectedCar} 
        settings={settings}
        onBack={() => setSelectedCar(null)}
        onInterest={(type, ctx) => {
            setSelectedCar(null);
            setLeadContext(ctx);
            setViewMode(type);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col font-sans text-gray-200">
      
      {/* Navbar */}
      <nav className="bg-black/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-24 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setViewMode('home')}
          >
            <div className="border border-secondary/30 p-2.5 rounded-sm bg-secondary/5 group-hover:bg-secondary/10 transition-colors">
                <Crown size={28} className="text-secondary" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold tracking-wider text-white">RL IMPORTS</h1>
              <p className="text-[10px] text-secondary tracking-[0.3em] uppercase">Premium Cars</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => setViewMode('home')} className={`text-xs font-bold tracking-widest uppercase hover:text-secondary transition-colors ${viewMode === 'home' ? 'text-secondary' : 'text-gray-400'}`}>Estoque</button>
            <button onClick={() => setViewMode('financing')} className={`text-xs font-bold tracking-widest uppercase hover:text-secondary transition-colors ${viewMode === 'financing' ? 'text-secondary' : 'text-gray-400'}`}>Financiamento</button>
            <button onClick={() => setViewMode('sell')} className={`text-xs font-bold tracking-widest uppercase hover:text-secondary transition-colors ${viewMode === 'sell' ? 'text-secondary' : 'text-gray-400'}`}>Vender Veículo</button>
            
            {viewMode === 'admin' ? (
               <button onClick={handleLogout} className="flex items-center gap-2 border border-red-900/50 hover:bg-red-900/20 text-red-500 px-4 py-2 transition-colors text-xs font-bold tracking-wider uppercase">
                <LogOut size={14} /> Sair
              </button>
            ) : (
              <button onClick={() => setViewMode('login')} className="flex items-center gap-2 text-gray-600 hover:text-secondary transition-colors text-xs font-bold tracking-wider uppercase">
                <Lock size={14} />
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
             <div className="md:hidden bg-surface p-6 space-y-4 border-b border-secondary/20 absolute w-full z-50">
                <button onClick={() => { setViewMode('home'); setIsMobileMenuOpen(false); }} className="block w-full text-left text-white py-2 uppercase tracking-wider text-sm">Estoque</button>
                <button onClick={() => { setViewMode('financing'); setIsMobileMenuOpen(false); }} className="block w-full text-left text-white py-2 uppercase tracking-wider text-sm">Financiamento</button>
                <button onClick={() => { setViewMode('sell'); setIsMobileMenuOpen(false); }} className="block w-full text-left text-white py-2 uppercase tracking-wider text-sm">Vender Veículo</button>
                {viewMode === 'admin' ? (
                    <button onClick={handleLogout} className="block w-full text-left text-red-400 py-2 uppercase tracking-wider text-sm">Sair</button>
                ) : (
                    <button onClick={() => { setViewMode('login'); setIsMobileMenuOpen(false); }} className="block w-full text-left text-gray-500 py-2 uppercase tracking-wider text-sm">Área Lojista</button>
                )}
             </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        
        {/* LOGIN MODAL */}
        {viewMode === 'login' && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-surface border border-white/10 p-8 w-full max-w-md relative animate-fade-in-up">
              <button onClick={() => setViewMode('home')} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={24} /></button>
              <div className="text-center mb-8">
                <div className="bg-secondary/10 p-4 rounded-full w-fit mx-auto mb-4 border border-secondary/20">
                    <Lock size={32} className="text-secondary" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-white">Acesso Restrito</h2>
                <p className="text-gray-500 mt-2 text-sm">Área administrativa RL IMPORTS</p>
              </div>
              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-white/10 text-white mb-4 focus:border-secondary outline-none transition-colors"
                  placeholder="Senha"
                  autoFocus
                />
                <button type="submit" className="w-full bg-secondary hover:bg-secondary-dark text-black font-bold py-3 uppercase tracking-wider transition-colors">Entrar</button>
              </form>
            </div>
          </div>
        )}

        {/* ADMIN VIEW */}
        {viewMode === 'admin' ? (
            <AdminPanel cars={cars} setCars={setCars} settings={settings} setSettings={setSettings} />
        ) : viewMode === 'financing' ? (
            <LeadForm 
                type="financing" 
                settings={settings} 
                initialContext={leadContext}
                onSubmitSuccess={() => {}} 
            />
        ) : viewMode === 'sell' ? (
            <LeadForm 
                type="sell" 
                settings={settings} 
                initialContext={leadContext}
                onSubmitSuccess={() => {}} 
            />
        ) : (
            <>
                {/* HERO / FILTERS SECTION */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-white/5 pb-8">
                    <div>
                        <h2 className="text-4xl font-serif font-bold text-white mb-2">Nosso Estoque</h2>
                        <p className="text-gray-400">Selecione o veículo dos seus sonhos.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-secondary transition-colors" size={18} />
                            <input 
                                type="text" 
                                placeholder="Buscar (ex: Porsche)" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-64 pl-10 pr-4 py-3 bg-surface border border-white/10 text-white focus:border-secondary outline-none transition-colors placeholder-gray-600"
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"><Filter size={18} /></div>
                            <select 
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full md:w-auto pl-10 pr-10 py-3 bg-surface border border-white/10 text-white focus:border-secondary outline-none appearance-none cursor-pointer"
                            >
                                <option value="Todos">Todos os Veículos</option>
                                <option value="Novos">Novos (2023+)</option>
                                <option value="Usados">Seminovos</option>
                            </select>
                        </div>
                    </div>
                </div>

                {filteredCars.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCars.map(car => (
                        <CarCard 
                            key={car.id} 
                            car={car} 
                            onView={(c) => setSelectedCar(c)}
                        />
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-32 border border-dashed border-white/10 bg-surface/30">
                        <div className="bg-surface p-6 rounded-full w-fit mx-auto mb-4 border border-white/5">
                            <Search size={48} className="text-gray-600" />
                        </div>
                        <h3 className="text-xl font-serif text-gray-300">Nenhum veículo encontrado</h3>
                        <p className="text-gray-500 mt-2">Tente ajustar seus filtros de busca.</p>
                    </div>
                )}
            </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 pt-16 pb-8">
            <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12">
                <div>
                    <div className="flex items-center gap-2 mb-6">
                         <Crown size={24} className="text-secondary" />
                         <h3 className="font-serif font-bold text-xl text-white">RL IMPORTS</h3>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        Especialistas em veículos premium e superesportivos. A excelência que você busca, com o atendimento que você merece.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-secondary hover:border-secondary transition-colors"><Instagram size={18} /></a>
                        <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-secondary hover:border-secondary transition-colors"><Facebook size={18} /></a>
                    </div>
                </div>
                
                <div>
                    <h3 className="font-serif font-bold text-white mb-6">Navegação</h3>
                    <ul className="space-y-3 text-sm text-gray-500">
                        <li><button onClick={() => setViewMode('home')} className="hover:text-secondary transition-colors uppercase tracking-wider text-xs">Estoque</button></li>
                        <li><button onClick={() => setViewMode('financing')} className="hover:text-secondary transition-colors uppercase tracking-wider text-xs">Financiamento</button></li>
                        <li><button onClick={() => setViewMode('sell')} className="hover:text-secondary transition-colors uppercase tracking-wider text-xs">Vender Veículo</button></li>
                        <li><button onClick={() => setViewMode('login')} className="hover:text-secondary transition-colors uppercase tracking-wider text-xs">Área Lojista</button></li>
                    </ul>
                </div>
                
                <div>
                    <h3 className="font-serif font-bold text-white mb-6">Contato</h3>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li className="flex items-center gap-3"><Phone size={16} className="text-secondary"/> {settings.phone}</li>
                        <li className="flex items-center gap-3"><ShieldCheck size={16} className="text-secondary"/> {settings.address}</li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/5 text-center text-gray-600 text-xs tracking-widest uppercase">
                © {new Date().getFullYear()} RL IMPORTS - Todos os direitos reservados.
            </div>
        </footer>
    </div>
  );
};

export default App;