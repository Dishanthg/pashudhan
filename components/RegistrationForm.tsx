import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { FileUpload } from './FileUpload';
import { useBreedRecognition } from '../hooks/useBreedRecognition';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import type { Animal, Language } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface RegistrationFormProps {
  onBack: () => void;
  onAddAnimal: (animal: Animal) => void;
  language: Language;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onBack, onAddAnimal, language }) => {
  const t = useTranslations(language);
  const [formData, setFormData] = useState({
    tagId: '',
    species: 'Cattle',
    breed: '',
    dob: '',
    weight: '', // Keep as string for input control
    vaccinationRecords: '',
  });

  const [errors, setErrors] = useState({
    tagId: '',
    breed: '',
    dob: '',
    weight: '',
  });

  const { 
    result, 
    error: apiError, 
    isLoading, 
    recognizedImage,
    recognizeBreed, 
    reset 
  } = useBreedRecognition(t);

  useEffect(() => {
    if (result?.breedName) {
      setFormData(prev => ({ ...prev, breed: result.breedName }));
      // Clear breed error when AI fills it
      setErrors(prev => ({...prev, breed: ''}));
    }
  }, [result]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validate = () => {
    const newErrors = { tagId: '', breed: '', dob: '', weight: '' };
    let isValid = true;

    if (!formData.tagId.trim()) {
        newErrors.tagId = t.error_tagId_required;
        isValid = false;
    }

    if (!formData.breed.trim()) {
        newErrors.breed = t.error_breed_required;
        isValid = false;
    }

    if (!formData.dob) {
        newErrors.dob = t.error_dob_required;
        isValid = false;
    } else if (new Date(formData.dob) > new Date()) {
        newErrors.dob = t.error_dob_future;
        isValid = false;
    }
    
    const weightNum = parseFloat(formData.weight);
    if (!formData.weight.trim()) {
        newErrors.weight = t.error_weight_required;
        isValid = false;
    } else if (isNaN(weightNum) || weightNum <= 0) {
        newErrors.weight = t.error_weight_invalid;
        isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
        return;
    }
    const newAnimal: Animal = {
        tagId: formData.tagId,
        species: formData.species as 'Cattle' | 'Buffalo',
        breed: formData.breed,
        dob: formData.dob,
        weight: parseFloat(formData.weight),
        vaccinationRecords: formData.vaccinationRecords.trim(),
        registrationDate: new Date().toISOString().split('T')[0],
        imageUrl: recognizedImage?.id || `https://ui-avatars.com/api/?name=${formData.breed.charAt(0)}&background=random&size=128`,
    };
    onAddAnimal(newAnimal);
  };

  const handleFileSelect = (file: File) => {
    recognizeBreed(file);
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto text-center animate-fade-in">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack} 
          className="p-2 mr-2 rounded-full hover:bg-brand-brown-100 dark:hover:bg-brand-brown-800 transition-colors"
          aria-label={t.back}
        >
          <Icon name="arrow-left" className="w-6 h-6 text-brand-brown-800 dark:text-brand-brown-200" />
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-brand-green-800 dark:text-brand-green-200">
          {t.reg_title}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* AI Suggestion Section */}
        <div className="p-4 border-2 border-dashed border-brand-brown-200 dark:border-brand-brown-700 rounded-lg space-y-4">
          <h3 className="font-semibold text-brand-green-800 dark:text-brand-green-200">{t.reg_ai_suggestion_title}</h3>
          <p className="text-sm text-brand-brown-600 dark:text-brand-brown-400">{t.reg_ai_suggestion_desc}</p>
          
          {isLoading ? (
            <Loader language={language} />
          ) : recognizedImage && result ? (
             <div className="flex flex-col items-start gap-4 p-4 bg-brand-green-50 dark:bg-brand-green-900/20 border border-brand-green-200 dark:border-brand-green-800 rounded-lg">
                <div className="flex items-center gap-4 w-full">
                  <img src={recognizedImage.url} alt="Preview" className="w-20 h-20 object-cover rounded-lg shadow-sm" />
                  <div className="text-left flex-grow">
                    <p className="text-sm text-brand-green-700 dark:text-brand-green-300">{t.reg_ai_suggestion}</p>
                    <p className="text-lg font-bold text-brand-green-900 dark:text-brand-green-100">{result.breedName}</p>
                    <p className="text-sm text-brand-brown-700 dark:text-brand-brown-300">{t.reg_ai_autofilled}</p>
                  </div>
                </div>
                <div className="w-full pt-4 mt-2 border-t border-brand-green-200 dark:border-brand-green-800">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-brand-brown-800 dark:text-brand-brown-200 font-semibold">{t.reg_ai_confidence}</span>
                        <span className="text-sm font-bold text-brand-green-800 dark:text-brand-green-200">{result.confidenceScore}%</span>
                    </div>
                    <div className="w-full bg-brand-brown-200 dark:bg-brand-brown-700 rounded-full h-2.5">
                        <div 
                            className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                                result.confidenceScore >= 75 ? 'bg-brand-green-600' :
                                result.confidenceScore >= 50 ? 'bg-yellow-500' :
                                'bg-red-500'
                            }`}
                            style={{ width: `${result.confidenceScore}%` }}>
                        </div>
                    </div>
                    {result.confidenceReasoning && (
                        <p className="text-xs text-brand-brown-600 dark:text-brand-brown-400 mt-2 text-left">
                            <strong>{t.reg_ai_reasoning}:</strong> <em>{result.confidenceReasoning}</em>
                        </p>
                    )}
                </div>
                <button type="button" onClick={reset} className="text-sm font-semibold text-brand-green-700 dark:text-brand-green-300 hover:underline self-start">
                  {t.reg_ai_use_different_photo}
                </button>
            </div>
          ) : (
            <FileUpload onFileSelect={handleFileSelect} language={language} />
          )}
          <ErrorMessage message={apiError} />
        </div>

        {/* Form Fields */}
        <div>
          <label htmlFor="breed" className="block text-sm font-medium text-brand-brown-700 dark:text-brand-brown-300 mb-1">{t.reg_breed_label}</label>
          <input
            type="text"
            id="breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 bg-brand-brown-100 dark:bg-brand-brown-800 ${errors.breed ? 'border-red-500 focus:ring-red-500' : 'border-brand-brown-300 dark:border-brand-brown-700 focus:ring-brand-green-500'}`}
            placeholder={t.reg_breed_placeholder}
          />
          {errors.breed && <p className="text-red-500 text-xs mt-1">{errors.breed}</p>}
        </div>
        
        <div>
          <label htmlFor="tagId" className="block text-sm font-medium text-brand-brown-700 dark:text-brand-brown-300 mb-1">{t.reg_tag_id_label}</label>
          <input
            type="text"
            id="tagId"
            name="tagId"
            value={formData.tagId}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 bg-transparent dark:text-white ${errors.tagId ? 'border-red-500 focus:ring-red-500' : 'border-brand-brown-300 dark:border-brand-brown-700 focus:ring-brand-green-500'}`}
          />
          {errors.tagId && <p className="text-red-500 text-xs mt-1">{errors.tagId}</p>}
        </div>
        
        <div>
          <label htmlFor="species" className="block text-sm font-medium text-brand-brown-700 dark:text-brand-brown-300 mb-1">{t.reg_species_label}</label>
          <select
            id="species"
            name="species"
            value={formData.species}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-brand-brown-300 dark:border-brand-brown-700 rounded-lg focus:ring-2 focus:ring-brand-green-500 bg-white dark:bg-brand-brown-900 dark:text-white"
          >
            <option value="Cattle">{t.species_cattle}</option>
            <option value="Buffalo">{t.species_buffalo}</option>
          </select>
        </div>

        <div>
            <label htmlFor="dob" className="block text-sm font-medium text-brand-brown-700 dark:text-brand-brown-300 mb-1">{t.reg_dob_label}</label>
            <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]} // Prevent future dates
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 bg-transparent dark:text-white ${errors.dob ? 'border-red-500 focus:ring-red-500' : 'border-brand-brown-300 dark:border-brand-brown-700 focus:ring-brand-green-500'}`}
            />
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
        </div>

        <div>
            <label htmlFor="weight" className="block text-sm font-medium text-brand-brown-700 dark:text-brand-brown-300 mb-1">{t.reg_weight_label}</label>
            <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder={t.reg_weight_placeholder}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 bg-transparent dark:text-white ${errors.weight ? 'border-red-500 focus:ring-red-500' : 'border-brand-brown-300 dark:border-brand-brown-700 focus:ring-brand-green-500'}`}
            />
            {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
        </div>

        <div>
            <label htmlFor="vaccinationRecords" className="block text-sm font-medium text-brand-brown-700 dark:text-brand-brown-300 mb-1">{t.reg_vaccination_label}</label>
            <textarea
                id="vaccinationRecords"
                name="vaccinationRecords"
                value={formData.vaccinationRecords}
                onChange={handleChange}
                rows={3}
                placeholder={t.reg_vaccination_placeholder}
                className="w-full px-4 py-2 border border-brand-brown-300 dark:border-brand-brown-700 rounded-lg focus:ring-2 focus:ring-brand-green-500 bg-transparent dark:text-white"
            />
        </div>
        
        <button
          type="submit"
          className="w-full px-6 py-3 bg-brand-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-700 focus:outline-none focus:ring-2 focus:ring-brand-green-500 focus:ring-opacity-75 transition-transform duration-200 hover:scale-105"
        >
          {t.reg_button}
        </button>
      </form>
       <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
        /* Style for date picker icon */
        input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(0.5);
        }
        .dark input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(1);
        }
      `}</style>
    </div>
  );
};