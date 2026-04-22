import React from 'react';
import type { Language } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = useTranslations(language);
  
  return (
    <footer className="main-stage px-4 pb-4">
      <div className="shell-panel rounded-[28px] border border-white/60 px-6 py-4 text-center text-sm text-brand-brown-700 dark:border-brand-brown-800 dark:text-brand-brown-400">
        <p>&copy; {new Date().getFullYear()} {t.footer_copyright}</p>
      </div>
    </footer>
  );
};
