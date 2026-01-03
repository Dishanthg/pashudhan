import React, { useState } from 'react';
import { breeds } from '../data/breedData';
import { Icon } from './Icon';
import type { BreedInfo, Language } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface BreedDatabaseProps {
  onBack: () => void;
  language: Language;
}

// Card component to display in the grid
const BreedCard: React.FC<{ breed: BreedInfo; onClick: () => void }> = ({ breed, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white dark:bg-brand-brown-900 rounded-xl shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-green-500"
      aria-label={`View details for ${breed.breedName}`}
    >
      <div className="h-48">
        <img src={breed.imageUrl} alt={breed.breedName} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-brand-green-800 dark:text-brand-green-200">{breed.breedName}</h3>
        <p className="text-sm font-semibold text-brand-brown-600 dark:text-brand-brown-400 mb-1">{breed.origin}</p>
        <div className="flex items-center text-xs text-brand-brown-500 dark:text-brand-brown-500 mb-2">
            <Icon name="users" className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{breed.temperament}</span>
        </div>
        <p className="text-brand-brown-700 dark:text-brand-brown-300 text-sm line-clamp-2">{breed.description}</p>
      </div>
    </button>
  );
};

// Modal component to show details
const BreedModal: React.FC<{ breed: BreedInfo; onClose: () => void; language: Language; }> = ({ breed, onClose, language }) => {
  const t = useTranslations(language);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-brand-brown-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in-scale"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-64 overflow-hidden rounded-t-2xl">
           <img src={breed.imageUrl} alt={breed.breedName} className="w-full h-full object-cover" />
        </div>
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-brand-green-800 dark:text-brand-green-200 mb-2">{breed.breedName}</h2>
                <div className="flex items-center text-brand-brown-600 dark:text-brand-brown-400 mb-4">
                    <Icon name="origin" className="w-5 h-5 mr-2" />
                    <p className="font-semibold">{breed.origin}</p>
                </div>
                <p className="text-brand-brown-800 dark:text-brand-brown-300 text-left">{breed.description}</p>
            </div>
          
            <div className="bg-brand-brown-50 dark:bg-brand-brown-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-green-900 dark:text-brand-green-300 mb-3">{t.library_modal_characteristics}</h3>
                <ul className="space-y-2 text-left">
                {breed.characteristics.map((char, index) => (
                    <li key={index} className="flex items-start">
                    <Icon name="check" className="w-5 h-5 mr-2 text-brand-green-600 flex-shrink-0 mt-1" />
                    <span className="text-brand-brown-900 dark:text-brand-brown-200">{char}</span>
                    </li>
                ))}
                </ul>
            </div>
            
            <div className="border-t border-brand-brown-200 dark:border-brand-brown-700 pt-6">
                 <h3 className="text-lg font-semibold text-brand-green-900 dark:text-brand-green-300 mb-4">{t.library_modal_performance}</h3>
                 <div className="space-y-4 text-left">
                    <div className="flex items-start">
                        <Icon name="users" className="w-5 h-5 mr-3 text-purple-500 flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-semibold text-brand-brown-800 dark:text-brand-brown-200">{t.library_modal_temperament}</p>
                            <p className="text-brand-brown-700 dark:text-brand-brown-300">{breed.temperament}</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Icon name="milk" className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-semibold text-brand-brown-800 dark:text-brand-brown-200">{t.library_modal_milk_yield}</p>
                            <p className="text-brand-brown-700 dark:text-brand-brown-300">{breed.milkYield}</p>
                        </div>
                    </div>
                     <div className="flex items-start">
                        <Icon name="scale" className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-semibold text-brand-brown-800 dark:text-brand-brown-200">{t.library_modal_draught_capacity}</p>
                            <p className="text-brand-brown-700 dark:text-brand-brown-300">{breed.draughtCapacity}</p>
                        </div>
                    </div>
                 </div>
            </div>

            <div className="border-t border-brand-brown-200 dark:border-brand-brown-700 pt-6">
                 <h3 className="text-lg font-semibold text-brand-green-900 dark:text-brand-green-300 mb-4">{t.library_modal_health_husbandry}</h3>
                 <div className="space-y-4 text-left">
                    <div className="flex items-start">
                        <Icon name="heart" className="w-5 h-5 mr-3 text-red-500 flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-semibold text-brand-brown-800 dark:text-brand-brown-200">{t.library_modal_lifespan}</p>
                            <p className="text-brand-brown-700 dark:text-brand-brown-300">{breed.lifespan}</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Icon name="leaf" className="w-5 h-5 mr-3 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-semibold text-brand-brown-800 dark:text-brand-brown-200">{t.library_modal_diet}</p>
                            <p className="text-brand-brown-700 dark:text-brand-brown-300">{breed.dietaryNeeds}</p>
                        </div>
                    </div>
                     <div className="flex items-start">
                        <Icon name="shield-check" className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-semibold text-brand-brown-800 dark:text-brand-brown-200">{t.library_modal_diseases}</p>
                            <ul className="list-disc list-inside text-brand-brown-700 dark:text-brand-brown-300">
                                {breed.commonDiseases.map((disease, index) => <li key={index}>{disease}</li>)}
                            </ul>
                        </div>
                    </div>
                 </div>
            </div>

        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/70 hover:bg-white dark:bg-brand-brown-800/70 dark:hover:bg-brand-brown-700 transition-colors"
          aria-label={t.close}
        >
          <Icon name="x-mark" className="w-6 h-6 text-brand-brown-800 dark:text-brand-brown-200" />
        </button>
      </div>
    </div>
  );
}


export const BreedDatabase: React.FC<BreedDatabaseProps> = ({ onBack, language }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState<BreedInfo | null>(null);
  const t = useTranslations(language);

  const filteredBreeds = breeds.filter(breed =>
    breed.breedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    breed.origin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl text-center animate-fade-in">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack} 
          className="p-2 mr-2 rounded-full hover:bg-brand-brown-200 dark:hover:bg-brand-brown-800 transition-colors"
          aria-label={t.back}
        >
          <Icon name="arrow-left" className="w-6 h-6 text-brand-brown-800 dark:text-brand-brown-200" />
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-brand-green-800 dark:text-brand-green-200">
          {t.library_title}
        </h2>
      </div>
      
      <div className="relative mb-8 max-w-lg mx-auto">
        <input
          type="text"
          placeholder={t.library_search_placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-brand-brown-300 dark:border-brand-brown-700 rounded-full focus:ring-2 focus:ring-brand-green-500 bg-transparent dark:text-white shadow-sm"
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon name="search" className="w-5 h-5 text-brand-brown-500 dark:text-brand-brown-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBreeds.length > 0 ? (
          filteredBreeds.map((breed) => (
            <BreedCard 
              key={breed.breedName} 
              breed={breed} 
              onClick={() => setSelectedBreed(breed)}
            />
          ))
        ) : (
          <div className="text-center text-brand-brown-700 dark:text-brand-brown-300 md:col-span-2 lg:col-span-3 py-10">
            <Icon name="search" className="w-12 h-12 mx-auto text-brand-brown-400 mb-4" />
            <p className="text-lg font-semibold">{t.library_no_breeds_found}</p>
            <p>{t.library_no_breeds_suggestion}</p>
          </div>
        )}
      </div>
      
      {selectedBreed && <BreedModal breed={selectedBreed} onClose={() => setSelectedBreed(null)} language={language} />}

      <style>
      {`
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-scale {
            0% {
                opacity: 0;
                transform: scale(0.95);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out;
        }
        .animate-fade-in-scale {
            animation: fade-in-scale 0.3s ease-out;
        }
      `}
      </style>
    </div>
  );
};