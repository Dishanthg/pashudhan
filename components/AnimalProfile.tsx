
import React from 'react';
import type { Animal, Language } from '../types';
import { Icon } from './Icon';
import { useTranslations } from '../hooks/useTranslations';
import { AnimalImage } from './AnimalImage';

interface AnimalProfileProps {
  animal: Animal;
  onBack: () => void;
  language: Language;
}

const ProfileField: React.FC<{ label: string, value: string, icon: 'identification' | 'calendar' | 'scale' | 'dna' | 'cow' }> = ({ label, value, icon }) => (
    <div>
        <p className="text-sm font-medium text-brand-brown-600 dark:text-brand-brown-400 flex items-center gap-2">
            <Icon name={icon} className="w-4 h-4" />
            <span>{label}</span>
        </p>
        <p className="text-lg text-brand-brown-800 dark:text-brand-brown-200 pl-6">{value}</p>
    </div>
);


export const AnimalProfile: React.FC<AnimalProfileProps> = ({ animal, onBack, language }) => {
  const t = useTranslations(language);

  return (
    <div className="w-full max-w-4xl mx-auto text-center animate-fade-in">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 mr-2 rounded-full hover:bg-brand-brown-100 dark:hover:bg-brand-brown-800 transition-colors"
          aria-label={t.back}
        >
          <Icon name="arrow-left" className="w-6 h-6 text-brand-brown-800 dark:text-brand-brown-200" />
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-brand-green-800 dark:text-brand-green-200">
          {animal.breed} - {animal.tagId}
        </h2>
      </div>

      <div className="bg-white dark:bg-brand-brown-900 rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 text-left">
          <AnimalImage
            animal={animal}
            className="w-48 h-48 rounded-lg object-cover bg-brand-brown-200 shadow-md flex-shrink-0"
          />
          <div className="flex-grow w-full">
            <h3 className="text-3xl font-bold text-brand-brown-900 dark:text-brand-brown-100 mb-4">{animal.breed}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <ProfileField label={t.profile_tag_id} value={animal.tagId} icon="identification" />
                <ProfileField label={t.profile_species} value={animal.species === 'Cattle' ? t.species_cattle : t.species_buffalo} icon="cow" />
                <ProfileField label={t.profile_dob} value={new Date(animal.dob).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} icon="calendar" />
                <ProfileField label={t.profile_weight} value={`${animal.weight} kg`} icon="scale" />
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-brand-brown-200 dark:border-brand-brown-700 text-left">
            <h4 className="text-lg font-semibold text-brand-brown-800 dark:text-brand-brown-200 flex items-center gap-2 mb-2">
                <Icon name="dna" className="w-5 h-5" />
                <span>{t.profile_vaccination}</span>
            </h4>
            <pre className="text-sm text-brand-brown-700 dark:text-brand-brown-300 whitespace-pre-wrap font-sans bg-brand-brown-50 dark:bg-brand-brown-800/50 p-3 rounded-md">
                {animal.vaccinationRecords || 'No records available.'}
            </pre>
        </div>
         <div className="mt-4 pt-4 border-t border-brand-brown-200 dark:border-brand-brown-700 text-left">
             <p className="text-xs text-brand-brown-500 dark:text-brand-brown-400">
                {t.profile_reg_date}: {new Date(animal.registrationDate).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
            </p>
         </div>

      </div>
       <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};
