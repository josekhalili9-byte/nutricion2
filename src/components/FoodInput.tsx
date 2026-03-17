import React, { useState } from 'react';
import { Search, Send } from 'lucide-react';

interface FoodInputProps {
  onAnalyze: (text: string) => void;
}

export default function FoodInput({ onAnalyze }: FoodInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text.trim());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Qué vas a comer?</h2>
          <p className="text-gray-500">Escribe el nombre del alimento o platillo para analizar su valor nutricional.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ej: Ensalada César, Tacos al pastor..."
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all text-lg"
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            disabled={!text.trim()}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 text-lg"
          >
            <Send className="w-5 h-5" />
            Analizar Alimento
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-50">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Sugerencias</h3>
          <div className="flex flex-wrap gap-2">
            {['Manzana', 'Huevo cocido', 'Pizza de pepperoni', 'Pechuga de pollo'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setText(suggestion);
                  onAnalyze(suggestion);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
