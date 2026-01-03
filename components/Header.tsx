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
        <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-brand-brown-800 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-20 border border-gray-100 dark:border-brand-brown-700 overflow-hidden">
            <div className="py-1">
                {languages.map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => {
                            onLanguageChange(lang.code);
                            onClose();
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${language === lang.code ? 'font-bold bg-brand-green-50 text-brand-green-700 dark:bg-brand-brown-700 dark:text-brand-green-400' : 'text-brand-brown-800 dark:text-brand-brown-200 hover:bg-gray-50 dark:hover:bg-brand-brown-700'}`}
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
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-brand-brown-900/80 backdrop-blur-md border-b border-gray-200 dark:border-brand-brown-800 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('dashboard')}>
            <div className="bg-brand-green-600 p-2 rounded-xl mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Icon name="cow" className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-brand-green-800 dark:text-brand-green-400">{t.header_title}</h1>
          </div>

          {/* Left-aligned Navigation Links */}
          {isLoggedIn && (
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map(link => {
                const isActive = currentView === link.view;
                return (
                  <button
                    key={link.view}
                    onClick={() => onNavigate(link.view)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-200 ${
                      isActive 
                        ? 'text-brand-green-700 bg-brand-green-50 dark:bg-brand-green-900/30 dark:text-brand-green-300' 
                        : 'text-brand-brown-600 dark:text-brand-brown-400 hover:bg-gray-100/50 dark:hover:bg-brand-brown-800'
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
                  className="p-2.5 rounded-full border border-gray-200 dark:border-brand-brown-700 text-brand-brown-600 dark:text-brand-brown-300 hover:bg-gray-100 dark:hover:bg-brand-brown-800 transition-all duration-200"
                  aria-label="Change Language"
                >
                    <Icon name="globe" className="w-5 h-5" />
                </button>
                <LanguageDropdown isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} language={language} onLanguageChange={onLanguageChange} />
            </div>
            
            {isLoggedIn ? (
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-brand-brown-700">
                <button 
                  onClick={() => onNavigate('settings')}
                  className={`p-2.5 rounded-full transition-all duration-200 ${
                    currentView === 'settings' 
                      ? 'bg-brand-green-50 text-brand-green-700 dark:bg-brand-green-900/30 dark:text-brand-green-300' 
                      : 'text-brand-brown-600 dark:text-brand-brown-300 hover:bg-gray-100 dark:hover:bg-brand-brown-800'
                  }`}
                  aria-label={t.header_settings}
                >
                  <Icon name="user-circle" className="w-6 h-6" />
                </button>
                <button 
                  onClick={onLogout}
                  className="px-5 py-2.5 text-sm font-black text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                >
                  {t.header_logout}
                </button>
              </div>
            ) : null}
        </div>
      </div>
    </header>
  );
};