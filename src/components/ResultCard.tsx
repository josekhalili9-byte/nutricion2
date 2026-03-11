import React from 'react';
import { motion } from 'motion/react';
import { Flame, Droplet, Wheat, Activity, CheckCircle, XCircle, AlertTriangle, Star } from 'lucide-react';
import { FoodAnalysis } from '../types';

interface ResultCardProps {
  analysis: FoodAnalysis;
  onClose: () => void;
}

export default function ResultCard({ analysis, onClose }: ResultCardProps) {
  const getHealthColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Saludable':
        return 'text-emerald-500 bg-emerald-50 border-emerald-200';
      case 'Moderado':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Poco saludable':
        return 'text-red-500 bg-red-50 border-red-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getHealthIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'Saludable':
        return <CheckCircle className="w-6 h-6" />;
      case 'Moderado':
        return <AlertTriangle className="w-6 h-6" />;
      case 'Poco saludable':
        return <XCircle className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-500';
    if (score >= 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={analysis.imageUrl} alt={analysis.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-2xl font-bold capitalize">{analysis.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getHealthColor(analysis.recommendation)}`}>
              {getHealthIcon(analysis.recommendation)}
              {analysis.recommendation}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold bg-white shadow-sm flex items-center gap-1 ${getScoreColor(analysis.score)}`}>
              <Star className="w-4 h-4 fill-current" />
              {analysis.score}/10
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-orange-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <Flame className="w-8 h-8 text-orange-500 mb-2" />
            <span className="text-2xl font-bold text-gray-900">{analysis.calories}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Calorías</span>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <Droplet className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-2xl font-bold text-gray-900">{analysis.sugar}g</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Azúcar</span>
          </div>
        </div>

        <div className="space-y-4">
          {analysis.ingredients && analysis.ingredients.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Ingredientes Detectados</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.ingredients.map((ingredient, index) => (
                  <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Macronutrientes</h3>
          
          {/* Proteins */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-1 text-gray-700 font-medium">
                <Activity className="w-4 h-4 text-indigo-500" /> Proteínas
              </span>
              <span className="font-bold text-gray-900">{analysis.proteins}g</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((analysis.proteins / 50) * 100, 100)}%` }}
                className="bg-indigo-500 h-2.5 rounded-full"
              ></motion.div>
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-1 text-gray-700 font-medium">
                <Wheat className="w-4 h-4 text-amber-500" /> Carbohidratos
              </span>
              <span className="font-bold text-gray-900">{analysis.carbs}g</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((analysis.carbs / 100) * 100, 100)}%` }}
                className="bg-amber-500 h-2.5 rounded-full"
              ></motion.div>
            </div>
          </div>

          {/* Fats */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-1 text-gray-700 font-medium">
                <Droplet className="w-4 h-4 text-rose-500" /> Grasas
              </span>
              <span className="font-bold text-gray-900">{analysis.fats}g</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((analysis.fats / 70) * 100, 100)}%` }}
                className="bg-rose-500 h-2.5 rounded-full"
              ></motion.div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-xl transition-colors"
        >
          Escanear otro alimento
        </button>
      </div>
    </motion.div>
  );
}
