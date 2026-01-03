import React from 'react';
import type { BreedInfo } from '../types';
import { Icon } from '../components/Icon';

interface ResultCardProps {
  result: BreedInfo;
  imagePreview: string | null;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, imagePreview }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-2xl transform transition-all duration-500 ease-in-out animate-fade-in">
      {imagePreview && (
        <div className="h-64 overflow-hidden">
          <img src={imagePreview} alt="Identified animal" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6">
        <h2 className="text-3xl font-bold text-brand-green-800 mb-2">{result.breedName}</h2>
        
        <div className="flex items-center text-brand-brown-600 mb-4">
          <Icon name="origin" className="w-5 h-5 mr-2" />
          <p className="font-semibold">{result.origin}</p>
        </div>

        <p className="text-brand-brown-800 text-left mb-6">{result.description}</p>

        <div className="bg-brand-brown-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-brand-green-900 mb-3">Key Characteristics</h3>
          <ul className="space-y-2 text-left">
            {result.characteristics.map((char, index) => (
              <li key={index} className="flex items-start">
                <Icon name="check" className="w-5 h-5 mr-2 text-brand-green-600 flex-shrink-0 mt-1" />
                <span className="text-brand-brown-900">{char}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Add fade-in animation to tailwind config or a style tag if needed.
// For simplicity here, we can rely on a simple CSS animation class.
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-in-out;
  }
`;
document.head.appendChild(style);