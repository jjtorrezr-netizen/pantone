import React, { useState } from 'react';
import { PantoneColor } from '../types';
import { CopyIcon, CheckIcon } from './Icons';

interface ColorCardProps {
  color: PantoneColor;
  index: number;
}

export const ColorCard: React.FC<ColorCardProps> = ({ color, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine if text should be white or black based on brightness
  const getContrastColor = (hex: string) => {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? 'text-black/50' : 'text-white/50';
  };

  const copyIconColor = getContrastColor(color.hex);

  return (
    <div 
      className="group relative flex flex-col bg-white shadow-xl shadow-gray-200/50 rounded-none overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl aspect-[3/4]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Color Swatch Area */}
      <div 
        className="flex-grow w-full relative cursor-pointer" 
        style={{ backgroundColor: color.hex }}
        onClick={handleCopy}
      >
        <div className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm p-2 rounded-full ${copyIconColor === 'text-black/50' ? 'text-black' : 'text-white'}`}>
           {copied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
        </div>
      </div>

      {/* Pantone Info Area */}
      <div className="bg-white p-5 pt-4 pb-6 flex flex-col justify-end border-t border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-1 font-sans tracking-tight">
            {color.pantoneCode}
        </h3>
        <p className="text-lg font-semibold text-gray-700 mb-2 truncate" title={color.pantoneName}>
          {color.pantoneName}
        </p>
        <div className="flex justify-between items-end mt-2 pt-3 border-t border-gray-100">
            <span className="font-mono text-sm text-gray-400 uppercase tracking-widest">
                HEX
            </span>
            <span className="font-mono text-lg text-gray-900 font-medium">
                {color.hex}
            </span>
        </div>
      </div>
    </div>
  );
};