import { GoogleGenAI, Type } from '@google/genai';
import { FoodAnalysis } from '../types';

let aiClient: GoogleGenAI | null = null;

function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('La clave API de Gemini no está configurada. Por favor, ve a Vercel > Settings > Environment Variables y añade GEMINI_API_KEY con tu clave. Luego haz un nuevo Deploy.');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function analyzeFoodText(textInput: string): Promise<Omit<FoodAnalysis, 'id' | 'imageUrl' | 'date'>> {
  const ai = getAIClient();

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        text: `Analiza este alimento o platillo: "${textInput}". Si es un platillo con varios ingredientes, enlista todos los alimentos o ingredientes principales que lo componen. Dime si es saludable, calorías aproximadas, gramos de proteínas, grasas, carbohidratos y azúcar. También dame una recomendación (Saludable, Moderado o Poco saludable) y una calificación del 1 al 10 de qué tan saludable es.`,
      },
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Nombre del alimento o platillo' },
          ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Lista de ingredientes o alimentos que componen el platillo (si aplica)',
          },
          isHealthy: { type: Type.BOOLEAN, description: 'Si es saludable o no' },
          calories: { type: Type.NUMBER, description: 'Calorías aproximadas' },
          proteins: { type: Type.NUMBER, description: 'Gramos de proteínas' },
          fats: { type: Type.NUMBER, description: 'Gramos de grasas' },
          carbs: { type: Type.NUMBER, description: 'Gramos de carbohidratos' },
          sugar: { type: Type.NUMBER, description: 'Gramos de azúcar' },
          recommendation: {
            type: Type.STRING,
            description: 'Recomendación de salud',
            enum: ['Saludable', 'Moderado', 'Poco saludable'],
          },
          score: { type: Type.NUMBER, description: 'Calificación del 1 al 10 de qué tan saludable es' },
        },
        required: ['name', 'isHealthy', 'calories', 'proteins', 'fats', 'carbs', 'sugar', 'recommendation', 'score'],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('No se pudo analizar el texto.');
  }

  return JSON.parse(text);
}
