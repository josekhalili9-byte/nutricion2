import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Trash2, Edit3, X } from 'lucide-react';
import { FoodAnalysis } from '../types';

interface AdminPanelProps {
  history: FoodAnalysis[];
  onClearHistory: () => void;
  onUpdateItem: (updatedItem: FoodAnalysis) => void;
  onClose: () => void;
}

export default function AdminPanel({ history, onClearHistory, onUpdateItem, onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState<FoodAnalysis | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '8718') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Acceso denegado. Clave incorrecta.');
      setPassword('');
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdateItem(editingItem);
      setEditingItem(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Panel Admin</h2>
          <p className="text-center text-gray-500 mb-6 text-sm">Ingresa la clave para continuar</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Clave de acceso"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Ingresar
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Administración</h1>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Registros ({history.length})</h2>
            <button
              onClick={() => setShowConfirmClear(true)}
              className="flex items-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Borrar Todo
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-sm">
                  <th className="pb-3 font-medium">Alimento</th>
                  <th className="pb-3 font-medium">Calorías</th>
                  <th className="pb-3 font-medium">Salud</th>
                  <th className="pb-3 font-medium">Fecha</th>
                  <th className="pb-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-medium text-gray-900 flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="capitalize">{item.name}</span>
                    </td>
                    <td className="py-4 text-gray-600">{item.calories} kcal</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        item.recommendation === 'Saludable' ? 'bg-emerald-100 text-emerald-700' :
                        item.recommendation === 'Moderado' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.score}/10
                      </span>
                    </td>
                    <td className="py-4 text-gray-500">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No hay registros</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Editar Alimento</h3>
                <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ingredientes (separados por coma)</label>
                  <input
                    type="text"
                    value={editingItem.ingredients?.join(', ') || ''}
                    onChange={(e) => setEditingItem({ 
                      ...editingItem, 
                      ingredients: e.target.value.split(',').map(i => i.trim()).filter(i => i) 
                    })}
                    placeholder="Ej: Pollo, Arroz, Frijoles"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Calorías</label>
                    <input
                      type="number"
                      value={editingItem.calories}
                      onChange={(e) => setEditingItem({ ...editingItem, calories: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Puntuación (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editingItem.score}
                      onChange={(e) => setEditingItem({ ...editingItem, score: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proteínas (g)</label>
                    <input
                      type="number"
                      value={editingItem.proteins}
                      onChange={(e) => setEditingItem({ ...editingItem, proteins: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Carbohidratos (g)</label>
                    <input
                      type="number"
                      value={editingItem.carbs}
                      onChange={(e) => setEditingItem({ ...editingItem, carbs: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grasas (g)</label>
                    <input
                      type="number"
                      value={editingItem.fats}
                      onChange={(e) => setEditingItem({ ...editingItem, fats: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Azúcar (g)</label>
                    <input
                      type="number"
                      value={editingItem.sugar}
                      onChange={(e) => setEditingItem({ ...editingItem, sugar: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recomendación</label>
                  <select
                    value={editingItem.recommendation}
                    onChange={(e) => setEditingItem({ ...editingItem, recommendation: e.target.value as any })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Saludable">Saludable</option>
                    <option value="Moderado">Moderado</option>
                    <option value="Poco saludable">Poco saludable</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showConfirmClear && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Borrar historial?</h3>
              <p className="text-gray-500 mb-6">Esta acción no se puede deshacer. Todos los registros serán eliminados permanentemente.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onClearHistory();
                    setShowConfirmClear(false);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition-colors"
                >
                  Sí, borrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
