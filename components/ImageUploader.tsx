import React, { useRef, useState } from 'react';
import { UploadIcon, ImageIcon, LoaderIcon, CameraIcon } from './Icons';
import { UploadStatus } from '../types';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  status: UploadStatus;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, status }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
    // Reset inputs so the same file can be selected again if needed
    e.target.value = ''; 
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const isProcessing = status === 'uploading' || status === 'analyzing';

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Standard File Input (Gallery) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        disabled={isProcessing}
      />
      
      {/* Camera Input (Mobile Direct) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
        disabled={isProcessing}
      />
      
      <div
        className={`
          relative group overflow-hidden rounded-[2rem] border border-white/40 shadow-xl backdrop-blur-xl transition-all duration-300 ease-out
          ${dragActive ? 'bg-white/80 scale-[1.02] border-pink-400' : 'bg-white/60 hover:bg-white/80'}
          ${isProcessing ? 'pointer-events-none opacity-90' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
        
        <div className="relative p-10 flex flex-col items-center justify-center min-h-[320px] text-center z-10">
            
            {status === 'analyzing' ? (
                <div className="flex flex-col items-center">
                     <div className="relative w-20 h-20 mb-6">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-200 opacity-30"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-pink-500 animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-pink-500">
                             <LoaderIcon className="w-8 h-8 animate-pulse" />
                        </div>
                     </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Extrayendo Colores</h3>
                    <p className="text-gray-500 font-medium">La IA está buscando las coincidencias Pantone perfectas.</p>
                </div>
            ) : (
                <>
                    <div className={`
                        w-20 h-20 rounded-2xl mb-6 flex items-center justify-center transition-all duration-500 shadow-lg
                        ${dragActive ? 'bg-pink-500 text-white rotate-6 scale-110' : 'bg-white text-gray-900 rotate-0'}
                    `}>
                        {dragActive ? <ImageIcon className="w-10 h-10" /> : <UploadIcon className="w-10 h-10" />}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                        {dragActive ? '¡Suelta la magia!' : 'Sube tu inspiración'}
                    </h3>
                    
                    <p className="text-gray-600 mb-8 max-w-xs leading-relaxed font-medium">
                        Arrastra una imagen aquí o elige una opción abajo.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button 
                            onClick={() => cameraInputRef.current?.click()}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold shadow-lg shadow-gray-900/20 hover:bg-black hover:-translate-y-0.5 transition-all active:scale-95"
                        >
                            <CameraIcon className="w-5 h-5" />
                            <span>Cámara</span>
                        </button>

                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-900 border border-gray-200 font-semibold shadow-lg shadow-gray-200/50 hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 transition-all active:scale-95"
                        >
                            <UploadIcon className="w-5 h-5" />
                            <span>Galería</span>
                        </button>
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};