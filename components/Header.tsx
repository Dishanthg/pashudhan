import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import type { Language, MainView } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate?: (view: MainView) => void;
  currentView?: MainView;
}

const LanguageDropdown: React.FC<{
    language: Language;
    onLanguageChange: (lang: Language) => void;
    isOpen: boolean;
    onClose: () => void;
}> = ({ language, onLanguageChange, isOpen, onClose }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const languages: { code: Language; name: string }[] = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'हिन्दी' },
        { code: 'kn', name: 'ಕನ್ನಡ' },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute top-full right-0 mt-3 w-44 overflow-hidden rounded-2xl border border-white/50 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-brand-brown-700 dark:bg-brand-brown-900/90 z-20"
        >
            <div className="py-1">
                {languages.map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => {
                            onLanguageChange(lang.code);
                            onClose();
                        }}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                            language === lang.code
                                ? 'bg-brand-green-50 font-bold text-brand-green-700 dark:bg-brand-brown-700 dark:text-brand-green-400'
                                : 'text-brand-brown-800 hover:bg-white dark:text-brand-brown-200 dark:hover:bg-brand-brown-700'
                        }`}
                    >
                        {lang.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Fixed onNavigate default value to accept an argument as per its type definition to avoid "Expected 0 arguments, but got 1" errors.
export const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout, language, onLanguageChange, onNavigate = (_view: MainView) => {}, currentView }) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const t = useTranslations(language);

  const navLinks: { label: string; view: MainView; icon: any }[] = [
    { label: t.nav_dashboard, view: 'dashboard', icon: 'home' },
    { label: t.nav_library, view: 'library', icon: 'book-open' },
    { label: t.nav_reports, view: 'semen', icon: 'chart-bar' },
    { label: t.nav_vets, view: 'vets', icon: 'store-front' },
    { label: t.nav_about, view: 'about', icon: 'users' },
  ];

  return (
    <header className="sticky top-0 z-50 px-2 pt-3 sm:px-3 sm:pt-4">
      <div className="main-stage">
        <div className="shell-panel rounded-[30px] px-4 py-4 sm:px-6 lg:px-7 flex items-center justify-between">
        <div className="flex items-center gap-6 lg:gap-10">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer group min-w-0" onClick={() => onNavigate('dashboard')}>
            <div className="relative mr-3 sm:mr-4">
              <div className="absolute -inset-1 rounded-[22px] bg-gradient-to-br from-brand-green-400 via-brand-light-yellow-100 to-brand-light-blue-100 opacity-80 blur-md"></div>
              <div className="relative bg-[#14324c] p-3 rounded-[20px] shadow-xl group-hover:-translate-y-1 transition-transform duration-300">
                <Icon name="cow" className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="hidden sm:inline-flex section-ribbon text-[10px] font-bold uppercase tracking-[0.28em] text-brand-brown-500 dark:text-brand-brown-300 mb-2">
                AI Livestock Studio
              </div>
              <h1 className="truncate text-2xl font-black tracking-tighter text-[#14324c] dark:text-white">{t.header_title}</h1>
            </div>
          </div>

          {/* Left-aligned Navigation Links */}
          {isLoggedIn && (
            <nav className="hidden xl:flex items-center gap-2 rounded-full border border-white/50 bg-white/65 px-2 py-2 shadow-lg backdrop-blur-xl dark:border-brand-brown-700 dark:bg-brand-brown-900/65">
              {navLinks.map(link => {
                const isActive = currentView === link.view;
                return (
                  <button
                    key={link.view}
                    onClick={() => onNavigate(link.view)}
                    className={`px-4 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-brand-green-500/15 via-brand-light-blue-100 to-brand-light-yellow-100 text-[#14324c] shadow-md dark:from-brand-green-900/40 dark:via-brand-brown-800 dark:to-brand-brown-800 dark:text-brand-green-300'
                        : 'text-brand-brown-600 dark:text-brand-brown-400 hover:bg-white/70 dark:hover:bg-brand-brown-800'
                    }`}
                  >
                    <Icon name={link.icon} className="w-4 h-4" />
                    {link.label}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-3">
            <div className="relative">
                <button 
                  onClick={() => setIsLangOpen(prev => !prev)} 
                  className="rounded-full border border-white/60 bg-white/75 p-3 text-brand-brown-600 shadow-md backdrop-blur-xl hover:-translate-y-0.5 hover:bg-white dark:border-brand-brown-700 dark:bg-brand-brown-900/70 dark:text-brand-brown-300 dark:hover:bg-brand-brown-800 transition-all duration-200"
                  aria-label="Change Language"
                >
                    <Icon name="globe" className="w-5 h-5" />
                </button>
                <LanguageDropdown isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} language={language} onLanguageChange={onLanguageChange} />
            </div>
            
            {isLoggedIn ? (
              <div className="flex items-center gap-2 pl-3 border-l border-white/50 dark:border-brand-brown-700">
                <button 
                  onClick={() => onNavigate('settings')}
                  className={`p-2.5 rounded-full transition-all duration-200 ${
                    currentView === 'settings' 
                      ? 'bg-brand-green-50 text-brand-green-700 shadow-md dark:bg-brand-green-900/30 dark:text-brand-green-300' 
                      : 'bg-white/60 text-brand-brown-600 hover:-translate-y-0.5 hover:bg-white dark:bg-brand-brown-900/70 dark:text-brand-brown-300 dark:hover:bg-brand-brown-800'
                  }`}
                  aria-label={t.header_settings}
                >
                  <Icon name="user-circle" className="w-6 h-6" />
                </button>
                <button 
                  onClick={onLogout}
                  className="rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 px-5 py-2.5 text-sm font-black text-red-600 hover:-translate-y-0.5 hover:from-red-500/15 hover:to-orange-500/15 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                  {t.header_logout}
                </button>
              </div>
            ) : null}
        </div>
        </div>
      </div>
    </header>
  );
};
