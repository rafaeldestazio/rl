import React, { useState } from 'react';
import { Lead, SiteSettings } from '../types';
import { storageService } from '../services/storageService';
import { Send, Upload, ShieldCheck, Check } from 'lucide-react';

interface FormProps {
  type: 'financing' | 'sell';
  initialContext?: string;
  settings: SiteSettings;
  onSubmitSuccess: () => void;
}

export const LeadForm: React.FC<FormProps> = ({ type, initialContext, settings, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    details: '',
    // Specific fields
    income: '',
    entryValue: '',
    carModel: '',
    carYear: '',
    carKm: '',
    carPrice: '',
    photoLink: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct detail string based on type
    let finalDetails = initialContext ? `[Interesse: ${initialContext}]\n` : '';
    
    if (type === 'financing') {
      finalDetails += `Cidade: ${formData.city}\nRenda Mensal: R$ ${formData.income}\nEntrada Proposta: R$ ${formData.entryValue}\nObs: ${formData.details}`;
    } else {
      finalDetails += `Veículo de Troca: ${formData.carModel} (${formData.carYear})\nKm: ${formData.carKm}\nPreço Pretendido: R$ ${formData.carPrice}\nFotos: ${formData.photoLink}\nObs: ${formData.details}`;
    }

    const lead: Lead = {
      id: crypto.randomUUID(),
      type,
      customerName: formData.name,
      customerPhone: formData.phone,
      city: formData.city,
      details: finalDetails,
      status: 'new',
      date: Date.now()
    };

    // Save to "DB"
    storageService.saveLead(lead);

    // Redirect to WhatsApp
    const waMessage = `*NOVO LEAD DO SITE - RL IMPORTS*\n\n*Tipo:* ${type === 'financing' ? 'Financiamento' : 'Venda/Troca'}\n*Cliente:* ${formData.name}\n*Telefone:* ${formData.phone}\n\n${finalDetails}`;
    window.open(`https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMessage)}`, '_blank');

    onSubmitSuccess();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClasses = "w-full px-4 py-3 bg-black border border-white/10 text-white focus:border-secondary outline-none transition-colors placeholder-gray-600";
  const labelClasses = "block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider";

  return (
    <div className="max-w-4xl mx-auto">
        <div className="bg-surface border border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-secondary"></div>
            
            <div className="flex flex-col md:flex-row gap-12">
                {/* Form Side */}
                <div className="flex-1">
                    <div className="mb-8">
                        <h2 className="text-3xl font-serif font-bold text-white">
                        {type === 'financing' ? 'Solicitar Financiamento' : 'Venda seu Veículo'}
                        </h2>
                        <p className="text-gray-500 mt-2">
                        {type === 'financing' 
                            ? 'Preencha os dados para uma análise de crédito exclusiva.'
                            : 'Avaliação justa e transparente para o seu veículo.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className={labelClasses}>Nome Completo</label>
                                <input required type="text" name="name" value={formData.name} onChange={handleChange} className={inputClasses} placeholder="Seu nome" />
                            </div>
                            <div>
                                <label className={labelClasses}>WhatsApp</label>
                                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClasses} placeholder="(00) 00000-0000" />
                            </div>
                        </div>

                        {type === 'financing' ? (
                        <>
                            <div>
                                <label className={labelClasses}>Cidade / UF</label>
                                <input required type="text" name="city" value={formData.city} onChange={handleChange} className={inputClasses} placeholder="Ex: São Paulo, SP" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClasses}>Renda Mensal (R$)</label>
                                    <input required type="number" name="income" value={formData.income} onChange={handleChange} className={inputClasses} placeholder="0,00" />
                                </div>
                                <div>
                                    <label className={labelClasses}>Valor de Entrada (R$)</label>
                                    <input required type="number" name="entryValue" value={formData.entryValue} onChange={handleChange} className={inputClasses} placeholder="0,00" />
                                </div>
                            </div>
                        </>
                        ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClasses}>Modelo do Carro</label>
                                    <input required type="text" name="carModel" value={formData.carModel} onChange={handleChange} className={inputClasses} placeholder="Ex: Honda Civic" />
                                </div>
                                <div>
                                    <label className={labelClasses}>Ano</label>
                                    <input required type="number" name="carYear" value={formData.carYear} onChange={handleChange} className={inputClasses} placeholder="2020" />
                                </div>
                                <div>
                                    <label className={labelClasses}>Quilometragem</label>
                                    <input required type="number" name="carKm" value={formData.carKm} onChange={handleChange} className={inputClasses} placeholder="km" />
                                </div>
                                <div>
                                    <label className={labelClasses}>Preço Desejado</label>
                                    <input required type="number" name="carPrice" value={formData.carPrice} onChange={handleChange} className={inputClasses} placeholder="R$" />
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>Link das Fotos</label>
                                <div className="relative">
                                    <Upload size={18} className="absolute left-3 top-3.5 text-gray-500" />
                                    <input type="text" name="photoLink" value={formData.photoLink} onChange={handleChange} className={`${inputClasses} pl-10`} placeholder="Google Drive, Dropbox, etc." />
                                </div>
                            </div>
                        </>
                        )}

                        <div>
                            <label className={labelClasses}>Observações</label>
                            <textarea name="details" value={formData.details} onChange={handleChange} rows={3} className={inputClasses} />
                        </div>

                        <button type="submit" className="w-full bg-secondary hover:bg-secondary-dark text-black font-bold py-4 uppercase tracking-wider transition-all flex items-center justify-center gap-3 mt-4">
                            <Send size={18} />
                            Enviar Solicitação
                        </button>
                    </form>
                </div>

                {/* Info Side */}
                <div className="md:w-72 border-l border-white/5 pl-0 md:pl-12 hidden md:block">
                    <h3 className="text-white font-serif font-bold mb-6">Por que escolher a RL Imports?</h3>
                    <ul className="space-y-6">
                        <li className="flex gap-4">
                            <div className="bg-secondary/10 p-2 h-fit rounded-sm">
                                <ShieldCheck size={20} className="text-secondary" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Segurança</h4>
                                <p className="text-gray-500 text-xs mt-1">Negociação transparente e segura.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="bg-secondary/10 p-2 h-fit rounded-sm">
                                <Check size={20} className="text-secondary" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Agilidade</h4>
                                <p className="text-gray-500 text-xs mt-1">Aprovação rápida e sem burocracia.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="bg-secondary/10 p-2 h-fit rounded-sm">
                                <Upload size={20} className="text-secondary" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Facilidade</h4>
                                <p className="text-gray-500 text-xs mt-1">Tudo feito digitalmente ou presencialmente.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  );
};