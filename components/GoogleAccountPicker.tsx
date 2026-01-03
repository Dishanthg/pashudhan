import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

interface GoogleAccount {
  name: string;
  email: string;
  avatar: string;
}

interface GoogleAccountPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (account: { name: string, email: string }) => void;
}

const STORAGE_KEY = 'pashudhan_google_accounts_v3';

export const GoogleAccountPicker: React.FC<GoogleAccountPickerProps> = ({ isOpen, onClose, onSelect }) => {
  const [view, setView] = useState<'list' | 'input' | 'consent' | 'loading'>('list');
  const [emailInput, setEmailInput] = useState('');
  const [selectedAcc, setSelectedAcc] = useState<GoogleAccount | null>(null);
  const [savedAccounts, setSavedAccounts] = useState<GoogleAccount[]>([]);

  // Define helper functions before useEffect to avoid initialization errors
  const reset = () => {
    setView('list');
    setEmailInput('');
    setSelectedAcc(null);
  };

  const handleBack = () => {
    if (view === 'consent') setView(savedAccounts.length > 0 ? 'list' : 'input');
    else if (view === 'input') setView('list');
  };

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSavedAccounts(parsed);
          setView(parsed.length > 0 ? 'list' : 'input');
        } catch (e) {
          setSavedAccounts([]);
          setView('input');
        }
      } else {
        setView('input');
      }
    } else {
      reset();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEmailNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;

    const name = emailInput.split('@')[0];
    const acc: GoogleAccount = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: emailInput,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`,
    };
    setSelectedAcc(acc);
    setView('consent');
  };

  const handleAccountClick = (acc: GoogleAccount) => {
    setSelectedAcc(acc);
    setView('consent');
  };

  const handleAllow = () => {
    if (!selectedAcc) return;
    setView('loading');
    
    // Fast simulation: persist account then trigger parent callback
    setTimeout(() => {
      const updated = [selectedAcc, ...savedAccounts.filter(a => a.email !== selectedAcc.email)].slice(0, 3);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      onSelect({ name: selectedAcc.name, email: selectedAcc.email });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-[450px] min-h-screen md:min-h-[600px] md:max-h-[90vh] md:rounded-xl shadow-2xl overflow-hidden flex flex-col transform animate-scale-up border-x border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Simulated Browser Header */}
        <div className="bg-gray-100 px-4 py-3 md:py-2 flex items-center gap-2 border-b border-gray-200">
           <div className="flex gap-1.5 mr-2">
             <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
           </div>
           <div className="flex-grow bg-white rounded-md border border-gray-300 px-3 py-1 flex items-center gap-2">
             <Icon name="lock-closed" className="w-3 h-3 text-green-600" />
             <span className="text-[10px] text-gray-500 truncate">accounts.google.com</span>
           </div>
        </div>

        {/* Google Content */}
        <div className="flex-grow flex flex-col overflow-y-auto">
          {view === 'loading' ? (
            <div className="flex-grow flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-gray-600">Signing you in...</p>
            </div>
          ) : (
            <>
              <div className="pt-12 pb-6 px-10 text-center flex flex-col items-center">
                <div className="mb-6">
                  <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>

                {view === 'list' && (
                  <>
                    <h2 className="text-2xl font-normal text-gray-900 font-sans">Choose an account</h2>
                    <p className="text-gray-600 mt-2 text-base">to continue to <span className="font-medium text-blue-600">Pashudhan</span></p>
                  </>
                )}

                {view === 'input' && (
                  <>
                    <h2 className="text-2xl font-normal text-gray-900 font-sans">Sign in</h2>
                    <p className="text-gray-600 mt-2 text-base">Use your Google Account</p>
                  </>
                )}

                {view === 'consent' && selectedAcc && (
                  <>
                    <h2 className="text-xl font-normal text-gray-900 font-sans leading-tight">Pashudhan wants to access your Google Account</h2>
                    <div className="mt-6 flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
                      <img src={selectedAcc.avatar} className="w-6 h-6 rounded-full" alt="profile" />
                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-900 leading-none">{selectedAcc.name}</p>
                        <p className="text-[10px] text-gray-500">{selectedAcc.email}</p>
                      </div>
                      <Icon name="chevron-right" className="w-3 h-3 text-gray-400 rotate-90" />
                    </div>
                  </>
                )}
              </div>

              <div className="flex-grow">
                {view === 'list' && (
                  <div className="mt-2">
                    {savedAccounts.map((account) => (
                      <button
                        key={account.email}
                        onClick={() => handleAccountClick(account)}
                        className="w-full px-10 py-4 flex items-center gap-4 hover:bg-gray-50 border-t border-gray-100 transition-colors text-left group"
                      >
                        <img src={account.avatar} alt={account.name} className="w-8 h-8 rounded-full shadow-sm" />
                        <div className="flex-grow overflow-hidden">
                          <p className="text-sm font-medium text-gray-900 truncate">{account.name}</p>
                          <p className="text-xs text-gray-500 truncate">{account.email}</p>
                        </div>
                      </button>
                    ))}
                    
                    <button 
                      onClick={() => setView('input')}
                      className="w-full px-10 py-5 flex items-center gap-4 hover:bg-gray-50 border-t border-gray-100 transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                        <Icon name="plus-circle" className="w-5 h-5 text-gray-500" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">Use another account</p>
                    </button>
                  </div>
                )}

                {view === 'input' && (
                  <form onSubmit={handleEmailNext} className="px-10 py-6 space-y-8">
                    <div className="relative">
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        autoFocus
                        className="peer w-full px-4 py-4 border border-gray-300 rounded focus:border-blue-600 focus:ring-[1px] focus:ring-blue-600 outline-none transition-all placeholder-transparent font-sans text-lg"
                        placeholder="Email or phone"
                        required
                      />
                      <label className="absolute left-4 -top-2.5 bg-white px-1 text-xs text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600">
                        Email or phone
                      </label>
                      <button type="button" className="text-sm font-bold text-blue-600 hover:text-blue-700 mt-3 block">Forgot email?</button>
                    </div>

                    <div className="text-sm text-gray-500 leading-relaxed">
                      To continue, Google will share your name, email address, language preference, and profile picture with Pashudhan.
                    </div>

                    <div className="flex justify-between items-center pt-6">
                      <button 
                        type="button" 
                        onClick={savedAccounts.length > 0 ? () => setView('list') : onClose}
                        className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded transition-colors"
                      >
                        {savedAccounts.length > 0 ? 'Back' : 'Cancel'}
                      </button>
                      <button 
                        type="submit"
                        className="bg-blue-600 text-white font-medium px-8 py-2.5 rounded hover:bg-blue-700 hover:shadow shadow-sm transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </form>
                )}

                {view === 'consent' && (
                  <div className="px-10 py-4 space-y-6">
                    <p className="text-gray-800 text-sm font-medium">Allow Pashudhan to:</p>
                    
                    <div className="space-y-5">
                      <div className="flex items-start gap-4">
                        <Icon name="user-circle" className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">View your basic profile info</p>
                          <p className="text-[11px] text-gray-500">Includes your name and profile picture</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                        <Icon name="globe" className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">View your email address</p>
                          <p className="text-[11px] text-gray-500">Used for creating your Pashudhan account</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-500 space-y-3 leading-relaxed">
                      <p>You can manage this access in your Google Account settings. Pashudhan will use your data according to their <a href="#" className="text-blue-600">privacy policy</a>.</p>
                    </div>

                    <div className="flex justify-between items-center pt-8">
                      <button 
                        type="button" 
                        onClick={handleBack}
                        className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleAllow}
                        className="bg-blue-600 text-white font-medium px-10 py-2.5 rounded hover:bg-blue-700 hover:shadow shadow-sm transition-all"
                      >
                        Allow
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Browser Footer Tray */}
        <div className="bg-gray-50 border-t border-gray-200 px-10 py-6 md:py-5 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verified Secure Connection</span>
          </div>
          <div className="flex gap-4">
             <span className="text-[10px] text-gray-500 font-bold hover:text-gray-800 cursor-pointer">Help</span>
             <span className="text-[10px] text-gray-500 font-bold hover:text-gray-800 cursor-pointer">Privacy</span>
             <span className="text-[10px] text-gray-500 font-bold hover:text-gray-800 cursor-pointer">Terms</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.98) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-up {
          animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (max-width: 768px) {
          .animate-scale-up {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};
