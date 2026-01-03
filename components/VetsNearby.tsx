import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { vetClinics } from '../data/vetData';
import type { VeterinaryClinic, Language } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface VetsNearbyProps {
    onBack: () => void;
    language: Language;
}

const VetCard: React.FC<{ clinic: VeterinaryClinic; language: Language; }> = ({ clinic, language }) => {
    const t = useTranslations(language);
    const handleGetDirections = () => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lon}`, '_blank');
    };

    return (
        <div className="bg-white dark:bg-brand-brown-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-brand-brown-800 flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 transition-all hover:shadow-lg">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="bg-brand-green-50 dark:bg-brand-brown-800 p-2 rounded-lg">
                        <Icon name="location-marker" className="w-5 h-5 text-brand-green-600 dark:text-brand-green-400" />
                    </div>
                    <h3 className="text-xl font-black text-brand-brown-900 dark:text-brand-brown-100">{clinic.name}</h3>
                </div>
                <div className="flex items-center gap-2 pl-10">
                     <Icon name="phone" className="w-4 h-4 text-brand-brown-400" />
                    <a href={`tel:${clinic.phone}`} className="text-md font-bold text-brand-green-700 dark:text-brand-green-300 hover:underline">{clinic.phone}</a>
                </div>
                <p className="text-xs font-medium text-brand-brown-400 pl-10 tracking-widest uppercase">Coordinates: {clinic.lat.toFixed(4)}, {clinic.lon.toFixed(4)}</p>
            </div>
            <button
                onClick={handleGetDirections}
                className="bg-[#104b5c] text-white font-black px-6 py-3 rounded-xl hover:bg-[#155a6e] transition-all self-start sm:self-center shadow-md active:scale-95"
            >
                {t.vets_get_directions}
            </button>
        </div>
    );
};


export const VetsNearby: React.FC<VetsNearbyProps> = ({ onBack, language }) => {
    const [isSearching, setIsSearching] = useState(true);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const t = useTranslations(language);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // In a real app, you would use this position to fetch vets from an API.
                    console.log('User location:', position.coords.latitude, position.coords.longitude);
                    setIsSearching(false);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setLocationError(t.vets_location_error);
                    setIsSearching(false);
                },
                { timeout: 10000 }
            );
        } else {
            setLocationError(t.vets_location_error);
            setIsSearching(false);
        }
    }, [t]);

    const filteredVets = vetClinics.filter(clinic => 
        clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.phone.includes(searchTerm)
    );

  return (
    <div className="w-full max-w-4xl text-left animate-fade-in mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div className="flex items-center">
                <button 
                    onClick={onBack} 
                    className="p-4 mr-4 rounded-2xl bg-white dark:bg-brand-brown-900 shadow-sm border border-gray-100 dark:border-brand-brown-800 hover:bg-brand-brown-100 transition-all"
                    aria-label={t.back}
                >
                    <Icon name="arrow-left" className="w-6 h-6 text-[#104b5c] dark:text-brand-brown-200" />
                </button>
                <div>
                    <span className="text-brand-green-600 dark:text-brand-green-400 font-black uppercase tracking-widest text-xs mb-1 block">Localized Support</span>
                    <h2 className="text-3xl md:text-4xl font-black text-[#104b5c] dark:text-brand-green-400 tracking-tight leading-none">
                        {t.vets_title}
                    </h2>
                </div>
            </div>
            
            <div className="relative flex-grow max-w-md">
                <input
                    type="text"
                    placeholder="Search clinics by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white dark:bg-brand-brown-900 border border-gray-200 dark:border-brand-brown-800 rounded-2xl focus:ring-4 focus:ring-brand-green-500/20 focus:border-brand-green-500 text-lg font-medium transition-all shadow-sm outline-none"
                />
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Icon name="search" className="w-6 h-6 text-brand-brown-400" />
                </div>
            </div>
        </div>

        {isSearching ? (
             <div className="text-center p-12 flex flex-col items-center justify-center min-h-[40vh] bg-white dark:bg-brand-brown-900 rounded-[40px] shadow-sm border border-gray-100 dark:border-brand-brown-800">
                <div className="relative flex items-center justify-center">
                    <div className="h-20 w-20 animate-spin rounded-full border-4 border-solid border-brand-green-500 border-t-transparent"></div>
                    <Icon name="location-marker" className="absolute w-8 h-8 text-brand-green-600" />
                </div>
                <p className="mt-8 text-2xl font-black text-[#104b5c] dark:text-brand-brown-200 tracking-tight">{t.vets_finding_location}</p>
                <p className="text-brand-brown-500 mt-2 font-medium">Scanning local service directory...</p>
            </div>
        ) : (
            <div className="space-y-6">
                {locationError && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-800 p-6 mb-8 rounded-2xl flex items-center gap-4" role="alert">
                        <Icon name="alert-triangle" className="w-6 h-6 flex-shrink-0" />
                        <div>
                            <p className="font-black text-lg">Location Access Required</p>
                            <p className="font-medium opacity-80">{locationError}</p>
                        </div>
                    </div>
                )}
                
                {filteredVets.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 animate-fade-in">
                        {filteredVets.map(clinic => (
                            <VetCard key={clinic.name} clinic={clinic} language={language} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white dark:bg-brand-brown-900 rounded-[40px] border border-dashed border-brand-brown-200 dark:border-brand-brown-800">
                        <div className="bg-brand-brown-50 dark:bg-brand-brown-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Icon name="search" className="w-10 h-10 text-brand-brown-300" />
                        </div>
                        <h4 className="text-2xl font-black text-brand-brown-800 dark:text-brand-brown-200">No clinics found</h4>
                        <p className="text-brand-brown-500 font-medium">Try a different search term or check spelling.</p>
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="mt-6 text-brand-green-600 font-bold hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>
        )}
       
       <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};