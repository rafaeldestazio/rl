import React, { useState } from 'react';
import { Car, SiteSettings } from '../types';
import { ArrowLeft, Check, Phone, DollarSign, CarFront } from 'lucide-react';

interface CarDetailProps {
  car: Car;
  settings: SiteSettings;
  onBack: () => void;
  onInterest: (type: 'financing' | 'sell', context: string) => void;
}

const CarDetail: React.FC<CarDetailProps> = ({ car, settings, onBack, onInterest }) => {
  const [activeImage, setActiveImage] = useState(car.imageUrl);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleWhatsApp = () => {
    const message = `Olá! Vi o ${car.make} ${car.model} no site da RL Imports e gostaria de mais informações.`;
    window.open(`https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-dark pb-12 animate-fade-in">
      {/* Sticky Header */}
      <nav className="bg-black/95 border-b border-white/5 py-4 px-6 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="hover:bg-white/10 text-white p-2 rounded-full transition-colors">
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-lg font-serif font-bold text-white leading-tight">{car.make} {car.model}</h1>
            <p className="text-xs text-secondary tracking-widest uppercase">{formatCurrency(car.price)}</p>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Gallery */}
          <div className="lg:col-span-2 space-y-4">
            <div className="w-full aspect-video bg-surface rounded-none overflow-hidden border border-white/10 relative group">
              <img src={activeImage} alt="Main" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              <button 
                onClick={() => setActiveImage(car.imageUrl)}
                className={`flex-shrink-0 w-24 h-16 rounded-none overflow-hidden border-2 transition-all ${activeImage === car.imageUrl ? 'border-secondary opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
              >
                 <img src={car.imageUrl} className="w-full h-full object-cover" />
              </button>
              {car.gallery?.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`flex-shrink-0 w-24 h-16 rounded-none overflow-hidden border-2 transition-all ${activeImage === img ? 'border-secondary opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                   <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="bg-surface p-8 border border-white/5 mt-8">
               <h3 className="text-xl font-serif font-bold text-white mb-6 border-b border-white/10 pb-4">Sobre o Veículo</h3>
               <p className="text-gray-400 leading-relaxed whitespace-pre-line text-lg font-light">{car.description}</p>
            </div>
          </div>

          {/* Right Column: Info & Actions */}
          <div className="space-y-6">
             <div className="bg-surface p-8 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
                <p className="text-sm text-gray-500 mb-2 uppercase tracking-widest">Valor à vista</p>
                <h2 className="text-5xl font-serif font-bold text-white mb-8">{formatCurrency(car.price)}</h2>
                
                <div className="space-y-3">
                   <button 
                     onClick={handleWhatsApp}
                     className="w-full bg-secondary hover:bg-secondary-dark text-black font-bold py-4 px-6 uppercase tracking-wider transition-all flex items-center justify-center gap-3"
                   >
                     <Phone size={18} />
                     Negociar no WhatsApp
                   </button>
                   <button 
                     onClick={() => onInterest('financing', `Interesse em financiar: ${car.make} ${car.model} (${formatCurrency(car.price)})`)}
                     className="w-full bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-white/50 font-bold py-4 px-6 uppercase tracking-wider transition-all flex items-center justify-center gap-3"
                   >
                     <DollarSign size={18} />
                     Simular Financiamento
                   </button>
                   <button 
                      onClick={() => onInterest('sell', `Troca no veículo: ${car.make} ${car.model}`)}
                      className="w-full bg-transparent hover:bg-white/5 text-gray-400 hover:text-white border border-transparent font-medium py-3 uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2"
                   >
                     <CarFront size={16} />
                     Tenho carro na troca
                   </button>
                </div>
             </div>

             <div className="bg-surface p-8 border border-white/5">
                <h3 className="font-serif font-bold text-white mb-6">Ficha Técnica</h3>
                <div className="grid grid-cols-2 gap-y-6 text-sm">
                   <div>
                      <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Ano</p>
                      <p className="font-medium text-white text-lg">{car.year}</p>
                   </div>
                   <div>
                      <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Quilometragem</p>
                      <p className="font-medium text-white text-lg">{car.mileage.toLocaleString()} km</p>
                   </div>
                   <div>
                      <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Câmbio</p>
                      <p className="font-medium text-white text-lg">{car.transmission}</p>
                   </div>
                   <div>
                      <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Combustível</p>
                      <p className="font-medium text-white text-lg">{car.fuelType}</p>
                   </div>
                   <div>
                      <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Cor</p>
                      <p className="font-medium text-white text-lg">{car.color}</p>
                   </div>
                   <div>
                      <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Status</p>
                      <p className="font-medium text-secondary text-lg uppercase">{car.status === 'available' ? 'Disponível' : car.status}</p>
                   </div>
                </div>
             </div>

             <div className="p-6 border border-secondary/20 bg-secondary/5 rounded-none">
                <h3 className="font-serif font-bold text-secondary mb-4 flex items-center gap-2"><Check size={20}/> Padrão RL IMPORTS</h3>
                <ul className="space-y-3">
                   <li className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div> Perícia Cautelar Aprovada
                   </li>
                   <li className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div> Revisão Premium
                   </li>
                   <li className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div> Higienização Detalhada
                   </li>
                </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;