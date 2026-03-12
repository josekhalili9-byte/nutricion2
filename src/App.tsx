import React, { useState, useEffect } from 'react';
import { Camera, Clock, BookOpen, Settings, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CameraScanner from './components/CameraScanner';
import ResultCard from './components/ResultCard';
import History from './components/History';
import Learn from './components/Learn';
import AdminPanel from './components/AdminPanel';
import { analyzeFoodImage } from './services/geminiService';
import { FoodAnalysis } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scan' | 'history' | 'learn'>('scan');
  const [history, setHistory] = useState<FoodAnalysis[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<FoodAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('foodscan_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('foodscan_history', JSON.stringify(history));
  }, [history]);

  const handleCapture = async (base64Image: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeFoodImage(base64Image);
      const newAnalysis: FoodAnalysis = {
        ...result,
        id: Date.now().toString(),
        imageUrl: base64Image,
        date: new Date().toISOString(),
      };
      setCurrentAnalysis(newAnalysis);
      setHistory((prev) => [newAnalysis, ...prev]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Hubo un error al analizar la imagen. Intenta de nuevo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleUpdateItem = (updatedItem: FoodAnalysis) => {
    setHistory((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            FoodScan AI
          </h1>
        </div>
        <button
          onClick={() => setShowAdmin(true)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Admin Panel"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col relative pb-28">
        <AnimatePresence mode="wait">
          {activeTab === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col items-center justify-start p-4 w-full min-h-full"
            >
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Analizando alimento...</h2>
                  <p className="text-gray-500">Nuestra IA está calculando los nutrientes</p>
                </div>
              ) : currentAnalysis ? (
                <ResultCard
                  analysis={currentAnalysis}
                  onClose={() => setCurrentAnalysis(null)}
                />
              ) : (
                <>
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 max-w-md w-full text-center text-sm border border-red-100">
                      {error}
                    </div>
                  )}
                  <CameraScanner onCapture={handleCapture} />
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 w-full"
            >
              <History history={history} onClear={handleClearHistory} />
            </motion.div>
          )}

          {activeTab === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 w-full"
            >
              <Learn />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe pt-2 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-md mx-auto flex justify-between items-center pb-2">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center p-2 transition-colors ${
              activeTab === 'history' ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Clock className={`w-6 h-6 mb-1 ${activeTab === 'history' ? 'fill-emerald-100' : ''}`} />
            <span className="text-[10px] font-medium uppercase tracking-wider">Historial</span>
          </button>
          
          <button
            onClick={() => {
              setActiveTab('scan');
              setCurrentAnalysis(null);
            }}
            className="flex flex-col items-center -mt-6 relative z-10"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform ${
              activeTab === 'scan' ? 'bg-emerald-500 text-white scale-110 shadow-emerald-500/30' : 'bg-white text-gray-400 border border-gray-100'
            }`}>
              <Camera className="w-6 h-6" />
            </div>
            <span className={`text-[10px] font-medium uppercase tracking-wider mt-2 ${
              activeTab === 'scan' ? 'text-emerald-600' : 'text-gray-400'
            }`}>Escanear</span>
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={`flex flex-col items-center p-2 transition-colors ${
              activeTab === 'learn' ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <BookOpen className={`w-6 h-6 mb-1 ${activeTab === 'learn' ? 'fill-emerald-100' : ''}`} />
            <span className="text-[10px] font-medium uppercase tracking-wider">Aprende</span>
          </button>
        </div>
      </nav>

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {showAdmin && (
          <AdminPanel
            history={history}
            onClearHistory={handleClearHistory}
            onUpdateItem={handleUpdateItem}
            onClose={() => setShowAdmin(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
