import React, { useState } from 'react';
import { Icon } from './Icon';
import type { Language, Theme, User } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { authService } from '../services/authService';
import { ErrorMessage } from './ErrorMessage';

interface SettingsProps {
  user: User;
  onBack: () => void;
  theme: Theme;
  onThemeToggle: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const ChangePasswordModal: React.FC<{ user: User, onClose: () => void, language: Language }> = ({ user, onClose, language }) => {
    const t = useTranslations(language);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmPassword) {
            setError(t.error_passwords_no_match);
            return;
        }
        if (newPassword.length < 6) {
            setError(t.error_password_too_short);
            return;
        }

        setIsLoading(true);
        try {
            await authService.changePassword(user.username, currentPassword, newPassword);
            setSuccess(t.settings_password_change_success);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(onClose, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-brand-brown-900 rounded-2xl shadow-xl max-w-md w-full relative animate-fade-in-scale p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-brand-green-800 dark:text-brand-green-200">{t.settings_change_password_title}</h3>
                  <button onClick={() => setShowPasswords(!showPasswords)} className="text-brand-brown-500 hover:text-brand-green-600 transition-colors">
                    <Icon name={showPasswords ? 'eye' : 'eye-slash'} className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type={showPasswords ? "text" : "password"} placeholder={t.settings_current_password} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-4 py-2 border border-brand-brown-300 dark:border-brand-brown-700 rounded-lg focus:ring-2 focus:ring-brand-green-500 bg-transparent dark:text-white" required />
                    <input type={showPasswords ? "text" : "password"} placeholder={t.settings_new_password} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-2 border border-brand-brown-300 dark:border-brand-brown-700 rounded-lg focus:ring-2 focus:ring-brand-green-500 bg-transparent dark:text-white" required />
                    <input type={showPasswords ? "text" : "password"} placeholder={t.settings_confirm_new_password} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border border-brand-brown-300 dark:border-brand-brown-700 rounded-lg focus:ring-2 focus:ring-brand-green-500 bg-transparent dark:text-white" required />
                    <ErrorMessage message={error} />
                    {success && <div className="text-green-600 bg-green-100 p-3 rounded-lg text-sm">{success}</div>}
                    <div className="flex gap-4 pt-2">
                        <button type="button" onClick={onClose} className="w-full py-2 px-4 rounded-lg font-semibold bg-brand-brown-200 dark:bg-brand-brown-700 hover:bg-brand-brown-300 dark:hover:bg-brand-brown-600 transition-colors">{t.cancel}</button>
                        <button type="submit" disabled={isLoading} className="w-full py-2 px-4 rounded-lg font-semibold bg-brand-green-600 text-white hover:bg-brand-green-700 disabled:bg-brand-green-400 transition-colors flex items-center justify-center">
                          {isLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                          {t.save}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const Settings: React.FC<SettingsProps> = ({ user, onBack, theme, onThemeToggle, language, onLanguageChange }) => {
  const t = useTranslations(language);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto text-left animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-center">
        <button 
          onClick={onBack} 
          className="p-2 mr-2 rounded-full hover:bg-brand-brown-100 dark:hover:bg-brand-brown-800 transition-colors"
          aria-label={t.back}
        >
          <Icon name="arrow-left" className="w-6 h-6 text-brand-brown-800 dark:text-brand-brown-200" />
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-brand-green-800 dark:text-brand-green-200">
          {t.settings_title}
        </h2>
      </div>

      {/* Profile Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-brand-brown-800 dark:text-brand-brown-200 border-b border-brand-brown-200 dark:border-brand-brown-700 pb-2">{t.settings_profile_section}</h3>
        <div className="flex items-center gap-4 p-4 bg-brand-brown-50 dark:bg-brand-brown-800/50 rounded-lg">
          <Icon name="user-circle" className="w-16 h-16 text-brand-brown-500 dark:text-brand-brown-400" />
          <div>
            <p className="font-bold text-xl text-brand-brown-900 dark:text-brand-brown-100">{user.username}</p>
            <p className="text-brand-brown-600 dark:text-brand-brown-300">{user.email}</p>
          </div>
        </div>
        <button onClick={() => setIsPasswordModalOpen(true)} className="w-full text-left p-4 flex justify-between items-center bg-white dark:bg-brand-brown-900 rounded-lg shadow-sm hover:bg-brand-brown-100 dark:hover:bg-brand-brown-800 transition-colors">
          <span className="flex items-center gap-2">
            <Icon name="lock-closed" className="w-5 h-5 text-brand-brown-600 dark:text-brand-brown-400" />
            <span>{t.settings_change_password}</span>
          </span>
          <Icon name="chevron-right" className="w-5 h-5 text-brand-brown-400" />
        </button>
      </div>

      {/* Appearance Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-brand-brown-800 dark:text-brand-brown-200 border-b border-brand-brown-200 dark:border-brand-brown-700 pb-2">{t.settings_appearance_section}</h3>
        
        {/* Theme Setting */}
        <div className="p-4 flex justify-between items-center bg-white dark:bg-brand-brown-900 rounded-lg shadow-sm">
          <label htmlFor="theme-toggle" className="font-medium text-brand-brown-800 dark:text-brand-brown-200">{t.settings_theme_label}</label>
          <div className="flex items-center gap-2">
            <Icon name="sun" className={`w-6 h-6 ${theme === 'light' ? 'text-yellow-500' : 'text-brand-brown-500'}`} />
            <button
              id="theme-toggle"
              onClick={onThemeToggle}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${theme === 'light' ? 'bg-brand-green-600' : 'bg-brand-brown-700'}`}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${theme === 'light' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <Icon name="moon" className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-brand-brown-500'}`} />
          </div>
        </div>
        
        {/* Language Setting */}
        <div className="p-4 bg-white dark:bg-brand-brown-900 rounded-lg shadow-sm">
           <label className="block font-medium text-brand-brown-800 dark:text-brand-brown-200 mb-3">{t.settings_language_label}</label>
           <div className="flex flex-col sm:flex-row gap-2">
             {(['en', 'hi', 'kn'] as const).map(lang => (
                <button
                    key={lang}
                    onClick={() => onLanguageChange(lang)}
                    className={`flex-1 text-center px-4 py-2 rounded-md transition-colors ${language === lang ? 'bg-brand-green-600 text-white font-semibold' : 'bg-brand-brown-100 dark:bg-brand-brown-800 hover:bg-brand-brown-200 dark:hover:bg-brand-brown-700'}`}
                >
                    {lang === 'en' && 'English'}
                    {lang === 'hi' && 'हिन्दी'}
                    {lang === 'kn' && 'ಕನ್ನಡ'}
                </button>
             ))}
           </div>
        </div>
      </div>
      {isPasswordModalOpen && <ChangePasswordModal user={user} onClose={() => setIsPasswordModalOpen(false)} language={language} />}
       <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-scale {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
        .animate-fade-in-scale {
            animation: fade-in-scale 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};