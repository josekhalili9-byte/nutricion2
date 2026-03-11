import React from 'react';
import { motion } from 'motion/react';
import { Clock, Trash2 } from 'lucide-react';
import { FoodAnalysis } from '../types';

interface HistoryProps {
  history: FoodAnalysis[];
  onClear: () => void;
}

export default function History({ history, onClear }: HistoryProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
        <Clock className="w-16 h-16 mb-4 text-gray-300" />
        <h3 className="text-xl font-semibold mb-2 text-gray-700">No hay historial</h3>
        <p>Tus alimentos escaneados aparecerán aquí.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto w-full pb-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Historial</h2>
        <button
          onClick={onClear}
          className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Borrar todo
        </button>
      </div>

      <div className="space-y-4">
        {history.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-16 h-16 rounded-xl object-cover bg-gray-100"
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 capitalize">{item.name}</h3>
              {item.ingredients && item.ingredients.length > 0 && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {item.ingredients.join(', ')}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm mt-1">
                <span className="text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
                <span className="text-gray-300">•</span>
                <span className="font-medium text-gray-700">{item.calories} kcal</span>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              item.recommendation === 'Saludable' ? 'bg-emerald-100 text-emerald-700' :
              item.recommendation === 'Moderado' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {item.score}/10
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
