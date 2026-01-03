import React, { useState } from 'react';
import { Icon } from './Icon';
import { ErrorMessage } from './ErrorMessage';
import type { Language } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { imageAssets } from '../data/imageAssets';
import { GoogleAccountPicker } from './GoogleAccountPicker';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onSwitchToSignUp: () => void;
  onForgotPassword: () => void;
  language: Language;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSwitchToSignUp, onForgotPassword, language }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGooglePickerOpen, setIsGooglePickerOpen] = useState(false);
  const t = useTranslations(language);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError(t.login_error_credentials);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSelect = async (account: { name: string, email: string }) => {
    setIsGooglePickerOpen(false);
    setIsLoading(true);
    try {
      // Simulate Google Login
      await onLogin(account.email, 'google_oauth_token');
    } catch (err) {
      setError('Google Sign-In failed. Please try standard login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-y-auto flex flex-col font-sans z-[60]">
      {/* Fixed Background Image with Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={imageAssets.ui.heroBg} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#1e3a8a]/60 backdrop-blur-[2px]"></div>
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

        {/* Login Box */}
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="w-full max-w-[500px] text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Login</h1>
            <p className="text-white/90 text-lg mb-10 font-medium">Enter your credentials to access your account</p>
            
            {/* Social Login Button */}
            <button 
              type="button" 
              onClick={() => setIsGooglePickerOpen(true)}
              className="w-full bg-white text-gray-700 font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 mb-6 transition-all hover:bg-gray-50 active:scale-95 group"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
              <span className="text-lg">Continue with Google</span>
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex-grow h-px bg-white/30"></div>
              <span className="text-white/80 font-bold text-sm uppercase tracking-widest">or</span>
              <div className="flex-grow h-px bg-white/30"></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="text-left space-y-2">
                <label className="text-white text-lg font-medium ml-1">User ID</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter User ID"
                  className="w-full bg-white/5 border-2 border-white/60 rounded-xl px-4 py-4 text-white placeholder-white/50 text-xl focus:outline-none focus:border-white focus:bg-white/10 transition-all shadow-inner"
                  disabled={isLoading}
                />
              </div>

              <div className="text-left space-y-2">
                <label className="text-white text-lg font-medium ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="w-full bg-white/5 border-2 border-white/60 rounded-xl px-4 py-4 text-white placeholder-white/50 text-xl focus:outline-none focus:border-white focus:bg-white/10 transition-all shadow-inner"
                    disabled={isLoading}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  >
                    <Icon name={showPassword ? "eye" : "eye-slash"} className="w-8 h-8" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center px-1">
                <button type="button" className="text-white text-lg font-medium hover:underline">Privacy Policy</button>
                <button type="button" onClick={onForgotPassword} className="text-white text-lg font-medium hover:underline">Forgot Password</button>
              </div>

              <ErrorMessage message={error} />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#cbd5e1] hover:bg-white text-brand-brown-900 text-2xl font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center mt-4"
              >
                {isLoading && <div className="w-6 h-6 border-4 border-brand-brown-900 border-t-transparent rounded-full animate-spin mr-3"></div>}
                {isLoading ? "Logging In..." : "Login"}
              </button>
            </form>

            <div className="mt-12 mb-8">
              <p className="text-white text-xl">
                Don't have an account?{' '}
                <button onClick={onSwitchToSignUp} className="font-bold border-b-2 border-white hover:text-brand-green-300 hover:border-brand-green-300 transition-colors">
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Version Info (Footer) */}
        <div className="w-full p-6 text-right mt-auto">
          <p className="text-white/80 text-sm font-bold">Version No. 1.30</p>
          <p className="text-white/80 text-sm font-bold">Version Date 25-09-2025</p>
        </div>
      </div>

      <GoogleAccountPicker 
        isOpen={isGooglePickerOpen} 
        onClose={() => setIsGooglePickerOpen(false)} 
        onSelect={handleGoogleSelect}
      />

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .shadow-glow {
          box-shadow: 0 0 15px rgba(133, 188, 123, 0.5);
        }
      `}</style>
    </div>
  );
};