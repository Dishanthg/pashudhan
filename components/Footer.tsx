import React from 'react';
import type { Language } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = useTranslations(language);
  
  return (
    <footer className="bg-brand-brown-100 border-t border-brand-brown-200 dark:bg-brand-brown-950 dark:border-brand-brown-800">
      <div className="container mx-auto p-4 text-center text-sm text-brand-brown-700 dark:text-brand-brown-400">
        <p>&copy; {new Date().getFullYear()} {t.footer_copyright}</p>
      </div>
    </footer>
  );
};