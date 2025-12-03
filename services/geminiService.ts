import { GoogleGenAI } from "@google/genai";

// Acesso seguro ao process.env para evitar erros em ambientes puramente frontend
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';
const ai = new GoogleGenAI({ apiKey });

export const generateCarDescription = async (
  make: string,
  model: string,
  year: number,
  features: string
): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning fallback text.");
    return `Uma excelente oportunidade para adquirir este ${make} ${model} ${year}. Veículo em ótimo estado.`;
  }

  try {
    const prompt = `
      Atue como um vendedor de carros de luxo experiente e persuasivo.
      Escreva uma descrição curta, atraente e vendedora (máximo de 3 parágrafos curtos) para um anúncio de carro.
      
      Veículo: ${make} ${model}
      Ano: ${year}
      Características adicionais: ${features}
      
      O tom deve ser profissional, destacando emoção, segurança e status. Use português do Brasil.
      Não use formatação markdown como negrito ou itálico, apenas texto corrido.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Erro ao gerar descrição com Gemini:", error);
    return `Confira este incrível ${make} ${model} ${year}. Entre em contato para mais detalhes!`;
  }
};

export const suggestPrice = async (make: string, model: string, year: number): Promise<number | null> => {
   if (!apiKey) return null;

   try {
    const prompt = `
      Baseado no mercado brasileiro de usados, sugira um preço realista (apenas o número inteiro, sem formatação de moeda) para um:
      ${make} ${model} ano ${year}.
      Retorne APENAS o número. Exemplo: 150000.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const priceText = response.text.replace(/[^0-9]/g, '');
    const price = parseInt(priceText, 10);
    return isNaN(price) ? null : price;

   } catch (error) {
     console.error("Erro ao sugerir preço:", error);
     return null;
   }
}