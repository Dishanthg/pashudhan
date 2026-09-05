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
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="main-stage">
        <div className="flex min-h-[72px] items-center justify-between bg-black px-4 py-3 text-white sm:px-8 lg:px-16">
        <div className="flex items-center gap-6 lg:gap-10">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer group min-w-0" onClick={() => onNavigate('dashboard')}>
              <div className="relative mr-3 sm:mr-4">
              <div className="relative rounded-md bg-white p-2 shadow-sm group-hover:-translate-y-0.5 transition-transform duration-300">
                <Icon name="cow" className="w-5 h-5 text-black" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="hidden sm:block text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55 mb-1">
                Livestock management
              </div>
              <h1 className="truncate text-xl font-semibold tracking-tight text-white">{t.header_title}</h1>
            </div>
          </div>

          {/* Left-aligned Navigation Links */}
          {isLoggedIn && (
              <nav className="hidden xl:flex items-center gap-7 px-5">
              {navLinks.map(link => {
                const isActive = currentView === link.view;
                return (
                  <button
                    key={link.view}
                    onClick={() => onNavigate(link.view)}
                    className={`relative px-0 py-2 text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                      isActive 
                        ? 'text-white after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-white'
                        : 'text-white/70 hover:text-white'
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
                  className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
                  aria-label="Change Language"
                >
                    <Icon name="globe" className="w-5 h-5" />
                </button>
                <LanguageDropdown isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} language={language} onLanguageChange={onLanguageChange} />
            </div>
            
            {isLoggedIn ? (
              <div className="flex items-center gap-2 pl-3">
                <button 
                  onClick={() => onNavigate('settings')}
                  className={`p-2.5 rounded-full transition-all duration-200 ${
                    currentView === 'settings' 
                      ? 'bg-white/15 text-white shadow-sm' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-label={t.header_settings}
                >
                  <Icon name="user-circle" className="w-6 h-6" />
                </button>
                <button 
                  onClick={onLogout}
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/85 transition-all duration-200"
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
