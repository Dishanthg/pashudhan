import React, { useState } from 'react';
import { Icon } from './Icon';
import { ErrorMessage } from './ErrorMessage';
import { useTranslations } from '../hooks/useTranslations';
import type { Language } from '../types';
import { imageAssets } from '../data/imageAssets';
import { GoogleSignInButton } from './GoogleSignInButton';

interface SignUpScreenProps {
  onSignUp: (username: string, email: string, password: string) => Promise<void>;
  onSwitchToLogin: () => void;
  language: Language;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onSwitchToLogin, language }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations(language);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError(t.signup_error_all_fields);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t.signup_error_invalid_email);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await onSignUp(username, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCredential = async (credential: string) => {
    setIsLoading(true);
    try {
      const payload = JSON.parse(atob(credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      await onSignUp(payload.name || payload.email.split('@')[0], payload.email, credential);
    } catch (err) {
      setError('Google Sign-Up failed. Please use standard form.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-y-auto flex flex-col font-sans z-[60]">
      {/* Fixed Background Image with Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={imageAssets.ui.heroBg} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(6,20,29,0.78),rgba(6,95,70,0.62)_45%,rgba(98,195,255,0.34)_100%)] backdrop-blur-[4px]"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-full">
        {/* Header App Logo */}
        <div className="w-full px-6 py-10 flex flex-col items-center justify-center" data-reveal>
          <div className="flex flex-col items-center group">
            <div className="auth-logo-tile p-6 rounded-[32px] mb-4 border border-white/60 transform transition-transform group-hover:scale-105 duration-500">
              <Icon name="cow" className="w-16 h-16 md:w-20 md:h-20 text-brand-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase drop-shadow-lg">Pashudhan</h2>
            <div className="h-1.5 w-12 bg-brand-green-400 rounded-full mt-2 shadow-glow"></div>
          </div>
        </div>

        {/* Signup Box */}
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="auth-panel w-full max-w-[560px] px-6 py-8 sm:px-10 sm:py-10 text-center" data-reveal>
            <div className="section-ribbon mx-auto text-[10px] font-black uppercase tracking-[0.28em] text-brand-brown-500">
              New Profile
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-white/80 text-lg mb-8 font-medium">Join the National Digital Livestock Mission</p>
            
            {/* Social Registration Button */}
            <GoogleSignInButton onCredential={handleGoogleCredential} disabled={isLoading} />

            <div className="flex items-center gap-4 mb-8">
              <div className="flex-grow h-px bg-white/30"></div>
              <span className="text-white/80 font-bold text-sm uppercase tracking-widest">or</span>
              <div className="flex-grow h-px bg-white/30"></div>
            </div>

            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="text-left space-y-1">
                <label className="text-white text-lg font-medium ml-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="auth-input w-full rounded-lg px-4 py-3 text-slate-900 text-xl focus:outline-none focus:border-emerald-600 transition-all"
                  disabled={isLoading}
                />
              </div>

              <div className="text-left space-y-1">
                <label className="text-white text-lg font-medium ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="auth-input w-full rounded-lg px-4 py-3 text-slate-900 text-xl focus:outline-none focus:border-emerald-600 transition-all"
                  disabled={isLoading}
                />
              </div>

              <div className="text-left space-y-1">
                <label className="text-white text-lg font-medium ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="auth-input w-full rounded-lg px-4 py-3 pr-12 text-slate-900 text-xl focus:outline-none focus:border-emerald-600 transition-all"
                    disabled={isLoading}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <Icon name={showPassword ? "eye" : "eye-slash"} className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <ErrorMessage message={error} />

              <button
                type="submit"
                disabled={isLoading}
                className="auth-primary w-full text-brand-green-950 text-2xl font-bold py-4 rounded-2xl transition-all transform active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center mt-2"
              >
                {isLoading && <div className="w-6 h-6 border-4 border-brand-green-950 border-t-transparent rounded-full animate-spin mr-3"></div>}
                {isLoading ? "Joining..." : "Sign Up"}
              </button>
            </form>

            <div className="mt-12 mb-8">
              <p className="text-white text-xl">
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} className="font-bold border-b-2 border-white hover:text-brand-green-300 hover:border-brand-green-300 transition-colors">
                  Log In
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Version Info (Footer) */}
        <div className="w-full p-6 text-right mt-auto">
          <div className="flex flex-wrap justify-end gap-2">
            <span className="version-chip text-white/80 text-sm font-bold">Version No. 1.30</span>
            <span className="version-chip text-white/80 text-sm font-bold">Version Date 25-09-2025</span>
          </div>
        </div>
      </div>

      <style>{`
        .shadow-glow {
          box-shadow: 0 0 15px rgba(133, 188, 123, 0.5);
        }
      `}</style>
    </div>
  );
};
