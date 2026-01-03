export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

export interface BreedInfo {
  breedName: string;
  description: string;
  origin: string;
  characteristics: string[];
  confidenceScore: number;
  confidenceReasoning: string;
  imageUrl: string;
  lifespan: string;
  dietaryNeeds: string;
  commonDiseases: string[];
  temperament: string;
  milkYield: string;
  draughtCapacity: string;
}

export interface Animal {
  tagId: string;
  species: 'Cattle' | 'Buffalo';
  breed: string;
  registrationDate: string;
  imageUrl: string;
  dob: string; // Date of Birth
  weight: number; // in kg
  vaccinationRecords: string;
}

export interface VeterinaryClinic {
  name: string;
  lat: number;
  lon: number;
  phone: string;
}

export interface MilkEntry {
  animalTagId: string;
  date: string;
  liters: number;
}

export interface VaccinationEntry {
  id: string;
  animalTagId: string;
  vaccineName: string;
  date: string;
  dueDate?: string;
  doseNumber: string;
  notes?: string;
}

export type MainView = 'dashboard' | 'register' | 'library' | 'semen' | 'vets' | 'animalProfile' | 'settings' | 'about';
export type Theme = 'light' | 'dark';
export type Language = 'en' | 'hi' | 'kn';