import React, { useState } from 'react';
import { Icon } from './Icon';
import { ErrorMessage } from './ErrorMessage';
import type { Language } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { imageAssets } from '../data/imageAssets';
import { GoogleSignInButton } from './GoogleSignInButton';

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

  const handleGoogleCredential = async (credential: string) => {
    setIsLoading(true);
    try {
      await onLogin('__google__', credential);
    } catch (err) {
      setError('Google Sign-In failed. Please try standard login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-screen fixed inset-0 z-[60] overflow-y-auto">
      <div className="auth-layout flex min-h-full w-full flex-col bg-white lg:h-full lg:min-h-0 lg:flex-row lg:overflow-hidden">
        <aside className="auth-aside relative hidden min-h-0 w-full overflow-hidden p-10 text-white lg:flex lg:w-3/5 lg:flex-none lg:flex-col lg:justify-between xl:p-12">
          <img src={imageAssets.ui.heroBg} alt="Cattle grazing in a field" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#173f46]/85"></div>
          <div className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-[#173f46]"><Icon name="cow" className="h-6 w-6" /></span>
            <span className="text-xl font-bold tracking-tight">Pashudhan</span>
          </div>
          <div className="relative max-w-md">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">Livestock management platform</p>
            <h2 className="text-4xl font-bold leading-tight">Simple records for healthier herds.</h2>
            <p className="mt-5 text-base leading-7 text-white/80">Keep animal profiles, breed information, and care records organized in one dependable workspace.</p>
          </div>
          <p className="relative text-sm text-white/65">Trusted tools for everyday farm decisions.</p>
        </aside>

        <main className="flex w-full flex-1 flex-col justify-center px-6 py-10 sm:px-12 lg:w-2/5 lg:flex-none lg:px-16">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#173f46] text-white"><Icon name="cow" className="h-5 w-5" /></span>
            <span className="text-xl font-bold tracking-tight text-[#173f46]">Pashudhan</span>
          </div>
          <div className="mb-8" data-reveal>
            <p className="mb-3 text-lg font-bold uppercase tracking-[0.16em] text-emerald-700">Welcome back</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sign in to your account</h1>
            <p className="mt-3 text-base leading-6 text-slate-500">Access your livestock records and continue where you left off.</p>
          </div>

          <GoogleSignInButton onCredential={handleGoogleCredential} disabled={isLoading} />

          <div className="my-7 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            <div className="h-px flex-1 bg-slate-200"></div><span>Or sign in with</span><div className="h-px flex-1 bg-slate-200"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">User ID</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter User ID"
                  className="auth-input w-full rounded-lg border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between"><label className="text-sm font-semibold text-slate-700">Password</label><button type="button" onClick={onForgotPassword} className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">Forgot password?</button></div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="auth-input w-full rounded-lg border border-slate-300 bg-white px-4 py-3.5 pr-12 text-base text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    disabled={isLoading}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                  >
                    <Icon name={showPassword ? "eye" : "eye-slash"} className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <ErrorMessage message={error} />

              <button type="submit" disabled={isLoading} className="auth-primary flex w-full items-center justify-center rounded-lg bg-[#173f46] py-3.5 text-base font-semibold text-white shadow-sm hover:bg-[#0f3036] disabled:opacity-50">
                {isLoading && <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>}
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-lg font-medium text-slate-600">
                Don't have an account?{' '}
                <button onClick={onSwitchToSignUp} className="font-bold text-lg text-emerald-700 underline decoration-2 underline-offset-4 hover:text-emerald-800">
                  Create one
                </button>
              </p>
            </div>
          <p className="mt-12 text-center text-xs text-slate-400">Pashudhan v1.30 · Your livestock records, organized.</p>
        </main>
      </div>

    </div>
  );
};
