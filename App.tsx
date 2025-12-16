import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ColorCard } from './components/ColorCard';
import { analyzeColors } from './services/geminiService';
import { PantoneColor, UploadStatus } from './types';
import { RefreshIcon } from './components/Icons';

function App() {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [colors, setColors] = useState<PantoneColor[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = async (base64: string) => {
    setImagePreview(base64);
    setStatus('analyzing');
    setError(null);
    setColors([]);

    try {
      const results = await analyzeColors(base64);
      setColors(results);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setError('Hubo un error analizando la imagen. Por favor intenta con otra foto.');
      setStatus('error');
    }
  };

  const resetApp = () => {
    setStatus('idle');
    setColors([]);
    setImagePreview(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-gray-50">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-200/40 blur-[100px] animate-pulse"></div>
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-pink-200/40 blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-200/30 blur-[100px] animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${status === 'idle' ? 'bg-transparent py-6' : 'bg-white/80 backdrop-blur-md border-b border-gray-200/50 py-4'}
      `}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={resetApp}>
            <div className="w-10 h-10 bg-black rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-lg">P</div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Pantone<span className="font-light text-gray-500">Extractor</span>
            </h1>
          </div>
          {status === 'success' && (
             <button 
                onClick={resetApp}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:text-black hover:border-gray-300 transition-all"
             >
                <RefreshIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Nueva Imagen</span>
             </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col pt-20">
        {status === 'idle' && (
            <div className="flex-grow flex flex-col items-center justify-center p-6 relative">
                <div className="text-center mb-12 max-w-3xl mx-auto space-y-6">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/50 border border-white/60 backdrop-blur-sm text-sm font-semibold text-purple-600 shadow-sm mb-4">
                        ✨ IA impulsada por Gemini 2.5 Flash
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[0.95]">
                        Tus fotos en <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600">
                            lenguaje Pantone
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto leading-relaxed">
                        Sube una foto o captura el momento. Nuestra IA detectará la paleta de colores exacta y sus códigos Pantone correspondientes al instante.
                    </p>
                </div>
                <div className="w-full max-w-xl animate-fade-in-up">
                    <ImageUploader onImageSelected={handleImageSelected} status={status} />
                </div>
            </div>
        )}

        {status === 'analyzing' && (
             <div className="flex-grow flex flex-col items-center justify-center p-6 animate-fade-in">
                <div className="w-full max-w-lg relative mb-8 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 ring-8 ring-white/50 aspect-video bg-gray-100">
                    {imagePreview && (
                         <>
                            <img 
                                src={imagePreview} 
                                alt="Analizando" 
                                className="w-full h-full object-cover filter blur-md scale-110 transition-transform duration-[10s] ease-linear"
                            />
                            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
                         </>
                    )}
                </div>
                <ImageUploader onImageSelected={() => {}} status={status} />
             </div>
        )}

        {status === 'error' && (
           <div className="flex-grow flex flex-col items-center justify-center p-6">
              <div className="bg-white/80 backdrop-blur-md border border-red-100 text-red-600 p-8 rounded-2xl max-w-md text-center shadow-xl">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 text-xl font-bold">!</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Algo salió mal</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
                  <button 
                    onClick={resetApp} 
                    className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                  >
                    Intentar de nuevo
                  </button>
              </div>
           </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
            {/* Sidebar with Image (Sticky on Desktop) */}
            <div className="w-full lg:w-[400px] xl:w-[480px] bg-white lg:border-r border-gray-200 p-6 lg:p-8 flex flex-col gap-6 lg:fixed lg:bottom-0 lg:top-[73px] lg:overflow-y-auto z-10">
                <div className="relative group rounded-3xl overflow-hidden shadow-2xl shadow-gray-200 ring-1 ring-gray-900/5 aspect-auto">
                    {imagePreview && (
                        <img src={imagePreview} alt="Original" className="w-full h-auto object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                         <span className="text-white font-medium">Imagen Original</span>
                    </div>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Sobre esta paleta</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        La IA ha identificado los tonos dominantes y los ha emparejado con el sistema Pantone Matching System (PMS) para garantizar la precisión en diseño e impresión.
                    </p>
                </div>
                
                <div className="mt-auto pt-6 border-t border-gray-100 text-xs text-gray-400 font-medium">
                    <p>Generado por Google Gemini 2.5 Flash</p>
                </div>
            </div>

            {/* Color Grid */}
            <div className="w-full lg:ml-[400px] xl:ml-[480px] p-6 md:p-12 pb-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
                    {colors.map((color, idx) => (
                        <ColorCard key={`${color.hex}-${idx}`} color={color} index={idx} />
                    ))}
                </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;