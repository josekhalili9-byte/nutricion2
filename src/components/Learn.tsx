import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Flame, Activity, Droplet, Wheat, Heart } from 'lucide-react';

export default function Learn() {
  const sections = [
    {
      title: 'Calorías',
      icon: <Flame className="w-6 h-6 text-orange-500" />,
      color: 'bg-orange-50',
      content: 'Las calorías son la energía que los alimentos proporcionan a tu cuerpo. Consumir más de las que quemas lleva al aumento de peso, mientras que consumir menos ayuda a perderlo. La calidad de las calorías importa tanto como la cantidad.',
    },
    {
      title: 'Proteínas',
      icon: <Activity className="w-6 h-6 text-indigo-500" />,
      color: 'bg-indigo-50',
      content: 'Esenciales para construir y reparar tejidos, músculos y órganos. Te mantienen saciado por más tiempo. Fuentes: pollo, pescado, huevos, legumbres, tofu.',
    },
    {
      title: 'Carbohidratos',
      icon: <Wheat className="w-6 h-6 text-amber-500" />,
      color: 'bg-amber-50',
      content: 'La principal fuente de energía del cuerpo. Prefiere los complejos (avena, quinoa, vegetales) sobre los simples (azúcar, harinas refinadas) para energía sostenida.',
    },
    {
      title: 'Grasas',
      icon: <Droplet className="w-6 h-6 text-rose-500" />,
      color: 'bg-rose-50',
      content: 'Vitales para la salud cerebral y hormonal. Elige grasas insaturadas (aguacate, nueces, aceite de oliva) y limita las saturadas y trans.',
    },
  ];

  return (
    <div className="p-4 max-w-md mx-auto w-full pb-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Aprende</h2>
          <p className="text-sm text-gray-500">Guía rápida de nutrición</p>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${section.color}`}>
                {section.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-emerald-500" />
          <h3 className="text-lg font-bold text-emerald-900">Consejo del día</h3>
        </div>
        <p className="text-emerald-800 text-sm leading-relaxed">
          Intenta que la mitad de tu plato sean vegetales en cada comida. Esto asegura vitaminas, minerales y fibra, ayudándote a sentirte lleno con menos calorías.
        </p>
      </div>
    </div>
  );
}
