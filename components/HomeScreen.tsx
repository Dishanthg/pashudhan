

import React from 'react';
import { breeds } from '../data/breedData';
import { Icon } from './Icon';
import type { BreedInfo } from '../types';

interface HomeScreenProps {
  onNavigate: (view: 'register' | 'library' | 'semen' | 'vets') => void;
}

// FIX: Changed icon type from 'syringe' to 'dna' because 'syringe' icon is not defined in the Icon component.
const FeatureCard: React.FC<{ title: string, description: string, icon: 'plus-circle' | 'book-open' | 'dna' | 'store-front', onClick: () => void }> = ({ title, description, icon, onClick }) => (
  <button
    onClick={onClick}
    className="p-6 bg-white text-left rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-green-500 flex items-start space-x-4"
  >
    <div className="bg-brand-green-100 p-3 rounded-full">
        <Icon name={icon} className="w-8 h-8 text-brand-green-700" />
    </div>
    <div>
      <h3 className="text-xl font-bold text-brand-green-800">{title}</h3>
      <p className="text-brand-brown-700">{description}</p>
    </div>
  </button>
);

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  // Get a random breed for "Breed of the Day"
  const breedOfTheDay = breeds.reduce<BreedInfo | null>((acc, curr) => {
    if (!acc) return curr;
    // Add confidenceScore and confidenceReasoning if they are missing from breedData
    return {
      ...curr,
      confidenceScore: curr.confidenceScore ?? 0,
      confidenceReasoning: curr.confidenceReasoning ?? '',
    };
  }, null) ?? breeds[Math.floor(Math.random() * breeds.length)];

  return (
    <div className="w-full max-w-4xl animate-fade-in space-y-12">
      <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-green-800 mb-2">
            Welcome Back!
          </h1>
          <p className="text-md md:text-lg text-brand-brown-700">
            Your central hub for livestock management.
          </p>
      </div>

      <div className="text-left bg-gradient-to-r from-brand-green-600 to-brand-green-800 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Breed of the Day</h2>
        <h3 className="text-xl font-semibold">{breedOfTheDay.breedName} - <span className="font-normal">{breedOfTheDay.origin}</span></h3>
        <p className="mt-2 text-brand-green-100">{breedOfTheDay.description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureCard 
            title="Register New Animal" 
            description="Add a new cattle or buffalo to your records."
            icon="plus-circle"
            onClick={() => onNavigate('register')} 
        />
        <FeatureCard 
            title="Explore Breed Library" 
            description="Browse information on various Indian breeds."
            icon="book-open"
            onClick={() => onNavigate('library')} 
        />
        <FeatureCard 
            title="Semen Bank Directory" 
            description="Find certified semen banks for breeding."
            // FIX: Replaced 'syringe' with 'dna' to use an available icon. 'dna' is suitable for a breeding-related feature.
            icon="dna"
            onClick={() => onNavigate('semen')} 
        />
        <FeatureCard 
            title="Veterinary Services" 
            description="Locate nearby veterinary shops and services."
            icon="store-front"
            onClick={() => onNavigate('vets')} 
        />
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