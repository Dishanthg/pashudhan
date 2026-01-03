import React, { useState } from 'react';
import { Icon } from './Icon';
import type { Language } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { authService } from '../services/authService';
import { imageAssets } from '../data/imageAssets';

interface ForgotPasswordScreenProps {
  onSwitchToLogin: () => void;
  language: Language;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onSwitchToLogin, language }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations(language);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    authService.forgotPassword(email);
    setMessage(t.forgot_password_success);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-y-auto flex flex-col font-sans z-[60]">
      {/* Fixed Background Image with Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={imageAssets.ui.heroBg} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#334155]/80 backdrop-blur-[2px]"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-full">
        {/* Header App Logo */}
        <div className="w-full px-6 py-10 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center group">
            <div className="bg-white p-6 rounded-[32px] shadow-2xl mb-4 border-4 border-brand-green-500 transform transition-transform group-hover:scale-105 duration-500">
              <Icon name="cow" className="w-16 h-16 md:w-20 md:h-20 text-brand-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase drop-shadow-lg">Pashudhan</h2>
            <div className="h-1.5 w-12 bg-brand-green-400 rounded-full mt-2 shadow-glow"></div>
          </div>
        </div>

        {/* Box */}
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="w-full max-w-[500px] text-center">
            <h1 className="text-4xl font-bold text-white mb-2">{t.forgot_password_title}</h1>
            <p className="text-white/90 text-lg mb-10 font-medium">{t.forgot_password_subtitle}</p>
            
            {message ? (
              <div className="text-white bg-white/10 border border-white/20 p-6 rounded-xl mb-6 text-xl animate-fade-in">
                {message}
              </div>
            ) : (
              <form onSubmit={handleResetRequest} className="space-y-6">
                <div className="text-left space-y-2">
                  <label className="text-white text-lg font-medium ml-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full bg-white/5 border-2 border-white/60 rounded-xl px-4 py-4 text-white placeholder-white/50 text-xl focus:outline-none focus:border-white focus:bg-white/10 transition-all shadow-inner"
                    disabled={isLoading}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#cbd5e1] hover:bg-white text-slate-900 text-2xl font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center shadow-glow"
                >
                  {isLoading && <div className="w-6 h-6 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mr-3"></div>}
                  {t.forgot_password_button}
                </button>
              </form>
            )}
            
            <div className="mt-12 mb-8">
              <button onClick={onSwitchToLogin} className="text-white text-xl font-bold border-b-2 border-white hover:text-brand-green-300 hover:border-brand-green-300 transition-colors">
                {t.forgot_password_back_to_login}
              </button>
            </div>
          </div>
        </div>

        {/* Version Info (Footer) */}
        <div className="w-full p-6 text-right mt-auto">
          <p className="text-white/80 text-sm font-bold">Version No. 1.30</p>
          <p className="text-white/80 text-sm font-bold">Version Date 25-09-2025</p>
        </div>
      </div>

      <style>{`
        .shadow-glow {
          box-shadow: 0 0 15px rgba(133, 188, 123, 0.5);
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};