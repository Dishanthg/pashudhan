import { translations } from '../data/translations';
import type { Language } from '../types';

export const useTranslations = (language: Language) => {
  return translations[language];
};