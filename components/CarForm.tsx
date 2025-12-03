import React, { useState, useEffect } from 'react';
import { Car } from '../types';
import { generateCarDescription, suggestPrice } from '../services/geminiService';
import { Sparkles, Loader2, Save, X, Plus, Trash2 } from 'lucide-react';

interface CarFormProps {
  initialData?: Car | null;
  onSave: (car: Car) => void;
  onCancel: () => void;
}

const CarForm: React.FC<CarFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Car>>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuelType: 'Flex',
    transmission: 'Automático',
    color: '',
    description: '',
    imageUrl: 'https://picsum.photos/seed/auto/800/600',
    gallery: [],
    status: 'available'
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggestingPrice, setIsSuggestingPrice] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'price' || name === 'mileage' ? Number(value) : value
    }));
  };

  const handleAddGalleryImage = () => {
    if (newGalleryUrl && formData.gallery) {
      setFormData(prev => ({
        ...prev,
        gallery: [...(prev.gallery || []), newGalleryUrl]
      }));
      setNewGalleryUrl('');
    } else if (newGalleryUrl) {
       setFormData(prev => ({
        ...prev,
        gallery: [newGalleryUrl]
      }));
      setNewGalleryUrl('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery?.filter((_, i) => i !== index)
    }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.make || !formData.model) {
      alert("Por favor, preencha Marca e Modelo antes de gerar a descrição.");
      return;
    }

    setIsGenerating(true);
    const features = `${formData.transmission}, ${formData.fuelType}, ${formData.color}, ${formData.mileage}km`;
    const description = await generateCarDescription(
      formData.make || '',
      formData.model || '',
      formData.year || 2024,
      features
    );
    setFormData(prev => ({ ...prev, description }));
    setIsGenerating(false);
  };

  const handleSuggestPrice = async () => {
      if (!formData.make || !formData.model) {
      alert("Por favor, preencha Marca e Modelo antes de sugerir preço.");
      return;
    }
    setIsSuggestingPrice(true);
    const price = await suggestPrice(formData.make || '', formData.model || '', formData.year || 2024);
    if (price) {
        setFormData(prev => ({...prev, price}));
    } else {
        alert("Não foi possível estimar o preço no momento.");
    }
    setIsSuggestingPrice(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.make || !formData.model || !formData.price) {
        alert("Preencha os campos obrigatórios");
        return;
    }
    onSave({
      ...formData,
      id: initialData?.id || crypto.randomUUID(),
      createdAt: initialData?.createdAt || Date.now(),
      gallery: formData.gallery || []
    } as Car);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl my-8 shadow-2xl flex flex-col max-h-[95vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? 'Editar Veículo' : 'Adicionar Novo Veículo'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Ex: BMW"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Ex: 320i"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ano *</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quilometragem (km)</label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Ex: Preto"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Combustível</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="Gasolina">Gasolina</option>
                <option value="Etanol">Etanol</option>
                <option value="Flex">Flex</option>
                <option value="Diesel">Diesel</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Elétrico">Elétrico</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmissão</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="Automático">Automático</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
                <option value="Automatizado">Automatizado</option>
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="available">Disponível</option>
                <option value="reserved">Reservado</option>
                <option value="sold">Vendido</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
             <div className="flex justify-between items-end mb-1">
                 <label className="block text-sm font-medium text-gray-700">Preço (R$) *</label>
                 <button
                    type="button"
                    onClick={handleSuggestPrice}
                    disabled={isSuggestingPrice}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
                  >
                    {isSuggestingPrice ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    Sugerir Preço (IA)
                  </button>
             </div>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-lg"
                required
              />
          </div>

           {/* Image Management */}
           <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3">Imagens do Veículo</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagem Principal (URL)</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm"
                  placeholder="https://..."
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Galeria de Fotos (Adicionar URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    className="flex-grow px-4 py-2 rounded-lg border border-gray-300 text-sm"
                    placeholder="https://..."
                  />
                  <button type="button" onClick={handleAddGalleryImage} className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg">
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {formData.gallery && formData.gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {formData.gallery.map((url, idx) => (
                    <div key={idx} className="relative aspect-video group">
                      <img src={url} alt="Gallery" className="w-full h-full object-cover rounded-md" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Descrição do Veículo</label>
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={isGenerating}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Criando texto...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Gerar com IA
                  </>
                )}
              </button>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Descreva os detalhes do carro..."
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Salvar Veículo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarForm;