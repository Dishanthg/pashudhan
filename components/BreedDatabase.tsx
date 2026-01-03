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
      className="w-full text-left bg-white dark:bg-brand-brown-900 rounded-2xl shadow-md overflow-hidden transform md:hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-green-500"
      aria-label={`View details for ${breed.breedName}`}
    >
      <div className="h-40 md:h-48">
        <img src={breed.imageUrl} alt={breed.breedName} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 md:p-5">
        <h3 className="text-lg md:text-xl font-bold text-brand-green-800 dark:text-brand-green-200">{breed.breedName}</h3>
        <p className="text-xs md:text-sm font-semibold text-brand-brown-600 dark:text-brand-brown-400 mb-1">{breed.origin}</p>
        <div className="flex items-center text-[10px] md:text-xs text-brand-brown-500 dark:text-brand-brown-500 mb-2">
            <Icon name="users" className="w-3 h-3 md:w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{breed.temperament}</span>
        </div>
        <p className="text-brand-brown-700 dark:text-brand-brown-300 text-xs md:text-sm line-clamp-2 leading-relaxed">{breed.description}</p>
      </div>
    </button>
  );
};

// Modal component to show details
const BreedModal: React.FC<{ breed: BreedInfo; onClose: () => void; language: Language; }> = ({ breed, onClose, language }) => {
  const t = useTranslations(language);
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center z-[100] p-0 md:p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-brand-brown-900 rounded-t-[32px] md:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] md:max-h-[90vh] overflow-y-auto relative animate-slide-up md:animate-fade-in-scale"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-56 md:h-72 overflow-hidden rounded-t-[32px] md:rounded-t-3xl relative">
           <img src={breed.imageUrl} alt={breed.breedName} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden"></div>
           <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 shadow-lg md:bg-brand-brown-800/70 md:hover:bg-brand-brown-700 transition-colors"
              aria-label={t.close}
            >
              <Icon name="x-mark" className="w-6 h-6 text-brand-brown-800 md:text-brand-brown-200" />
            </button>
        </div>
        <div className="p-6 md:p-10 space-y-8">
            <div>
                <h2 className="text-3xl md:text-4xl font-black text-brand-green-800 dark:text-brand-green-200 mb-2">{breed.breedName}</h2>
                <div className="flex items-center text-brand-brown-600 dark:text-brand-brown-400 mb-5">
                    <Icon name="origin" className="w-5 h-5 mr-2" />
                    <p className="font-bold tracking-tight">{breed.origin}</p>
                </div>
                <p className="text-brand-brown-800 dark:text-brand-brown-300 text-left text-base md:text-lg leading-relaxed">{breed.description}</p>
            </div>
          
            <div className="bg-brand-brown-50 dark:bg-brand-brown-800/40 p-6 md:p-8 rounded-[28px] border border-brand-brown-100 dark:border-brand-brown-700">
                <h3 className="text-xl font-black text-brand-green-900 dark:text-brand-green-300 mb-5 uppercase tracking-widest text-sm">{t.library_modal_characteristics}</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {breed.characteristics.map((char, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="bg-brand-green-100 dark:bg-brand-green-900/30 p-1 rounded-full mt-0.5">
                        <Icon name="check" className="w-4 h-4 text-brand-green-600 flex-shrink-0" />
                      </div>
                      <span className="text-brand-brown-900 dark:text-brand-brown-200 font-medium text-sm md:text-base">{char}</span>
                    </li>
                ))}
                </ul>
            </div>
            
            <div className="pt-2">
                 <h3 className="text-xl font-black text-brand-green-900 dark:text-brand-green-300 mb-6 uppercase tracking-widest text-sm">{t.library_modal_performance}</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                    <div className="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                        <Icon name="users" className="w-6 h-6 text-purple-500 mb-3" />
                        <p className="text-xs font-black text-purple-800/50 uppercase tracking-widest mb-1">{t.library_modal_temperament}</p>
                        <p className="font-bold text-brand-brown-900 dark:text-brand-brown-200">{breed.temperament}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                        <Icon name="milk" className="w-6 h-6 text-blue-400 mb-3" />
                        <p className="text-xs font-black text-blue-800/50 uppercase tracking-widest mb-1">{t.library_modal_milk_yield}</p>
                        <p className="font-bold text-brand-brown-900 dark:text-brand-brown-200">{breed.milkYield}</p>
                    </div>
                     <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <Icon name="scale" className="w-6 h-6 text-gray-500 mb-3" />
                        <p className="text-xs font-black text-gray-800/50 dark:text-gray-400 uppercase tracking-widest mb-1">{t.library_modal_draught_capacity}</p>
                        <p className="font-bold text-brand-brown-900 dark:text-brand-brown-200">{breed.draughtCapacity}</p>
                    </div>
                 </div>
            </div>

            <div className="pt-2 pb-6">
                 <h3 className="text-xl font-black text-brand-green-900 dark:text-brand-green-300 mb-6 uppercase tracking-widest text-sm">{t.library_modal_health_husbandry}</h3>
                 <div className="space-y-4 text-left">
                    <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
                        <div className="flex items-center gap-4">
                          <Icon name="heart" className="w-5 h-5 text-red-500" />
                          <span className="font-bold text-brand-brown-800 dark:text-brand-brown-200">{t.library_modal_lifespan}</span>
                        </div>
                        <span className="text-brand-brown-600 dark:text-brand-brown-400 font-black">{breed.lifespan}</span>
                    </div>
                    <div className="p-6 bg-brand-green-50 dark:bg-brand-green-900/10 rounded-[28px] border border-brand-green-100 dark:border-brand-green-800/30">
                        <div className="flex items-center gap-4 mb-3">
                          <Icon name="leaf" className="w-5 h-5 text-green-600" />
                          <span className="font-black text-brand-green-800 dark:text-brand-green-400 uppercase tracking-widest text-xs">{t.library_modal_diet}</span>
                        </div>
                        <p className="text-brand-brown-700 dark:text-brand-brown-300 font-medium">{breed.dietaryNeeds}</p>
                    </div>
                     <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-[28px] border border-amber-100 dark:border-amber-900/20">
                        <div className="flex items-center gap-4 mb-4">
                            <Icon name="shield-check" className="w-5 h-5 text-amber-600" />
                            <span className="font-black text-amber-800/50 dark:text-amber-500 uppercase tracking-widest text-xs">{t.library_modal_diseases}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {breed.commonDiseases.map((disease, index) => (
                              <span key={index} className="px-4 py-1.5 bg-white dark:bg-brand-brown-900 rounded-full text-sm font-bold text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800/50">
                                {disease}
                              </span>
                            ))}
                        </div>
                    </div>
                 </div>
            </div>

        </div>
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
    <div className="w-full max-w-5xl text-center animate-fade-in px-4 md:px-0">
      <div className="flex items-center mb-6 md:mb-10">
        <button 
          onClick={onBack} 
          className="p-3 mr-3 rounded-2xl bg-white dark:bg-brand-brown-900 shadow-sm border border-gray-100 dark:border-brand-brown-800 hover:bg-brand-brown-100 transition-all"
          aria-label={t.back}
        >
          <Icon name="arrow-left" className="w-6 h-6 text-brand-brown-800 dark:text-brand-brown-200" />
        </button>
        <div className="text-left">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green-600 dark:text-brand-green-400 mb-1 block">Digital Encyclopedia</span>
          <h2 className="text-3xl font-black text-brand-green-800 dark:text-brand-green-200 tracking-tight leading-none">
            {t.library_title}
          </h2>
        </div>
      </div>
      
      <div className="relative mb-10 max-w-xl mx-auto group">
        <input
          type="text"
          placeholder={t.library_search_placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-6 py-4 border-2 border-brand-brown-200 dark:border-brand-brown-800 rounded-2xl focus:border-brand-green-500 focus:ring-4 focus:ring-brand-green-500/10 bg-white dark:bg-brand-brown-900 dark:text-white shadow-xl transition-all outline-none text-lg font-medium"
        />
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Icon name="search" className="w-6 h-6 text-brand-brown-400 group-focus-within:text-brand-green-600 transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-12">
        {filteredBreeds.length > 0 ? (
          filteredBreeds.map((breed) => (
            <BreedCard 
              key={breed.breedName} 
              breed={breed} 
              onClick={() => setSelectedBreed(breed)}
            />
          ))
        ) : (
          <div className="text-center text-brand-brown-700 dark:text-brand-brown-300 sm:col-span-2 lg:col-span-3 py-20 bg-white dark:bg-brand-brown-900 rounded-[40px] border-2 border-dashed border-brand-brown-100 dark:border-brand-brown-800">
            <div className="bg-brand-brown-50 dark:bg-brand-brown-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="search" className="w-10 h-10 text-brand-brown-300" />
            </div>
            <p className="text-2xl font-black text-brand-brown-900 dark:text-brand-brown-100">{t.library_no_breeds_found}</p>
            <p className="text-brand-brown-500 font-medium mt-2">{t.library_no_breeds_suggestion}</p>
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
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-up {
            0% { transform: translateY(100%); }
            100% { transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out;
        }
        .animate-fade-in-scale {
            animation: fade-in-scale 0.3s ease-out;
        }
        .animate-slide-up {
            animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}
      </style>
    </div>
  );
};
