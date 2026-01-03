import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import type { Language } from '../types';

interface DesktopFooterProps {
    language: Language;
}

export const DesktopFooter: React.FC<DesktopFooterProps> = ({ language }) => {
  const t = useTranslations(language);
  return (
    <footer className="hidden md:block pt-4 w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center text-xs text-brand-brown-600 dark:text-brand-brown-400">
        <p>&copy; {new Date().getFullYear()} {t.header_title}. All Rights Reserved.</p>
        <div className="flex items-center space-x-4">
            <a href="#" className="hover:underline">{t.footer_policy}</a>
            <a 
              href="https://deepmind.google/technologies/gemini/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 hover:underline"
            >
              <span>{t.footer_powered_by}</span>
              <span className="font-semibold">Gemini</span>
            </a>
        </div>
      </div>
    </footer>
  );
};