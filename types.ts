export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  color: string;
  description: string;
  imageUrl: string; // Main image
  gallery: string[]; // Additional images
  status: 'available' | 'sold' | 'reserved';
  createdAt: number;
}

export interface Lead {
  id: string;
  type: 'financing' | 'sell';
  customerName: string;
  customerPhone: string;
  city?: string; // Added city
  details: string; // JSON string or formatted text of specific details
  status: 'new' | 'contacted' | 'closed';
  date: number;
}

export interface SiteSettings {
  storeName: string;
  phone: string;
  address: string;
  primaryColor: string;
  logoUrl: string;
}

export type ViewMode = 'home' | 'detail' | 'financing' | 'sell' | 'admin' | 'login';

export const DEFAULT_SETTINGS: SiteSettings = {
  storeName: 'RL IMPORTS',
  phone: '11999999999',
  address: 'Av. Europa, 888 - Jardins, São Paulo',
  primaryColor: 'black', // Default to black/gold theme
  logoUrl: ''
};

export const MOCK_CARS: Car[] = [
  {
    id: '1',
    make: 'Porsche',
    model: '911 Carrera S',
    year: 2023,
    price: 1450000,
    mileage: 4500,
    fuelType: 'Gasolina',
    transmission: 'PDK',
    color: 'Cinza Agate',
    description: 'A lenda automotiva em sua melhor forma. Porsche 911 Carrera S com interior em couro Bordeaux, pacote Sport Chrono e sistema de escape esportivo. Estado de zero km.',
    imageUrl: 'https://picsum.photos/seed/porsche911/800/600',
    gallery: ['https://picsum.photos/seed/porsche_int/800/600', 'https://picsum.photos/seed/porsche_rear/800/600'],
    status: 'available',
    createdAt: Date.now()
  },
  {
    id: '2',
    make: 'Land Rover',
    model: 'Range Rover Sport Dynamic',
    year: 2024,
    price: 980000,
    mileage: 1200,
    fuelType: 'Híbrido Diesel',
    transmission: 'Automático',
    color: 'Preto Santorini',
    description: 'Luxo e robustez. Range Rover Sport com teto panorâmico, rodas aro 22 e sistema de som Meridian Surround. O SUV definitivo para cidade e estrada.',
    imageUrl: 'https://picsum.photos/seed/rangerover/800/600',
    gallery: [],
    status: 'available',
    createdAt: Date.now() - 100000
  },
   {
    id: '3',
    make: 'Mercedes-Benz',
    model: 'C300 AMG Line',
    year: 2022,
    price: 389900,
    mileage: 18000,
    fuelType: 'Gasolina',
    transmission: '9G-Tronic',
    color: 'Branco Polar',
    description: 'Elegância com toque esportivo. C300 com kit AMG completo, painel digital widescreen e assistentes de condução autônoma.',
    imageUrl: 'https://picsum.photos/seed/mercedes/800/600',
    gallery: [],
    status: 'reserved',
    createdAt: Date.now() - 200000
  },
  {
    id: '4',
    make: 'BMW',
    model: 'X6 M Competition',
    year: 2021,
    price: 850000,
    mileage: 22000,
    fuelType: 'Gasolina',
    transmission: 'Automático',
    color: 'Azul Marina Bay',
    description: 'Performance bruta. X6 M Competition entregando 625cv. Veículo revisado na concessionária e com garantia estendida.',
    imageUrl: 'https://picsum.photos/seed/bmwx6/800/600',
    gallery: [],
    status: 'sold',
    createdAt: Date.now() - 500000
  }
];