export interface FoodAnalysis {
  id: string;
  imageUrl: string;
  name: string;
  isHealthy: boolean;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  sugar: number;
  recommendation: 'Saludable' | 'Moderado' | 'Poco saludable';
  score: number;
  ingredients?: string[];
  date: string;
}
