import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import type { Language } from '../types';

interface DesktopFooterProps {
    language: Language;
}

export const DesktopFooter: React.FC<DesktopFooterProps> = ({ language }) => {
  const t = useTranslations(language);
  return (
    <footer className="hidden md:block pt-4 w-full">
      <div className="shell-panel flex items-center justify-between rounded-[28px] border border-white/60 px-6 py-5 text-xs text-brand-brown-600 dark:border-brand-brown-800 dark:text-brand-brown-400">
        <p>&copy; {new Date().getFullYear()} {t.header_title}. All Rights Reserved.</p>
        <div className="flex items-center space-x-4">
            <a href="#" className="section-ribbon text-[10px] font-black uppercase tracking-[0.24em] hover:underline">{t.footer_policy}</a>
        </div>
      </div>
    </footer>
  );
};
