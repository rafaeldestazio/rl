import React from 'react';
import { Car } from '../types';
import { ArrowRight, Fuel, Gauge, Calendar, Trash2, Edit } from 'lucide-react';

interface CarCardProps {
  car: Car;
  isAdmin?: boolean;
  onEdit?: (car: Car) => void;
  onDelete?: (id: string) => void;
  onView?: (car: Car) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, isAdmin, onEdit, onDelete, onView }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="bg-surface rounded-none border border-white/5 hover:border-secondary/50 group transition-all duration-300 flex flex-col h-full relative">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={car.imageUrl} 
          alt={`${car.make} ${car.model}`} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80"></div>
        
        {car.status === 'sold' && (
          <div className="absolute top-4 right-4 bg-red-900/90 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest border border-red-700">
            Vendido
          </div>
        )}
         {car.status === 'reserved' && (
          <div className="absolute top-4 right-4 bg-secondary/90 text-black text-xs font-bold px-3 py-1 uppercase tracking-widest">
            Reservado
          </div>
        )}
        
        <div className="absolute bottom-4 left-4">
           <p className="text-gray-300 text-xs font-medium uppercase tracking-widest mb-1">{car.make}</p>
           <h3 className="text-white font-serif text-xl font-bold">{car.model}</h3>
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <span className="text-2xl font-serif text-secondary">{formatCurrency(car.price)}</span>
          <span className="text-xs text-gray-500 border border-gray-700 px-2 py-1">{car.year}</span>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs text-gray-400 mb-6 font-medium tracking-wide">
          <div className="flex items-center gap-2">
            <Gauge size={14} className="text-secondary" />
            <span>{car.mileage.toLocaleString('pt-BR')} km</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel size={14} className="text-secondary" />
            <span>{car.fuelType}</span>
          </div>
           <div className="flex items-center gap-2">
            <Calendar size={14} className="text-secondary" />
            <span>{car.transmission}</span>
          </div>
        </div>

        <div className="mt-auto pt-2">
          {isAdmin ? (
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit && onEdit(car)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-2 px-4 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Edit size={14} /> Editar
              </button>
              <button 
                onClick={() => onDelete && onDelete(car.id)}
                className="flex-1 bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/30 py-2 px-4 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
             <button 
                onClick={() => onView && onView(car)}
                className="w-full bg-transparent hover:bg-secondary text-secondary hover:text-black border border-secondary font-medium py-3 px-4 transition-all duration-300 flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
              >
                Mais Detalhes <ArrowRight size={14} />
              </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarCard;