import React from 'react';
import { Icon } from './Icon';

interface GoogleAccount {
  name: string;
  email: string;
  avatar: string;
}

interface GoogleAccountPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (account: GoogleAccount) => void;
}

const mockAccounts: GoogleAccount[] = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=0D8ABC&color=fff',
  },
  {
    name: 'Anjali Gupta',
    email: 'anjali.gupta@outlook.com',
    avatar: 'https://ui-avatars.com/api/?name=Anjali+Gupta&background=F00000&color=fff',
  }
];

export const GoogleAccountPicker: React.FC<GoogleAccountPickerProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-[400px] rounded-lg shadow-2xl overflow-hidden flex flex-col transform animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Google Branding Header */}
        <div className="p-8 pb-4 text-center">
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
          </div>
          <h2 className="text-2xl font-medium text-gray-900">Choose an account</h2>
          <p className="text-gray-600 mt-2">to continue to Pashudhan</p>
        </div>

        {/* Account List */}
        <div className="flex-grow">
          {mockAccounts.map((account) => (
            <button
              key={account.email}
              onClick={() => onSelect(account)}
              className="w-full px-8 py-4 flex items-center gap-4 hover:bg-gray-50 border-t border-gray-100 transition-colors text-left"
            >
              <img src={account.avatar} alt={account.name} className="w-10 h-10 rounded-full" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">{account.name}</p>
                <p className="text-sm text-gray-500 truncate">{account.email}</p>
              </div>
            </button>
          ))}
          
          <button className="w-full px-8 py-4 flex items-center gap-4 hover:bg-gray-50 border-t border-gray-100 transition-colors text-left group">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <Icon name="user-circle" className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Use another account</p>
          </button>
        </div>

        {/* Footer */}
        <div className="p-8 pt-6 text-xs text-gray-500 leading-relaxed border-t border-gray-100">
          To continue, Google will share your name, email address, language preference, and profile picture with Pashudhan.
        </div>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
        >
          <Icon name="x-mark" className="w-5 h-5" />
        </button>
      </div>

      <style>{`
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up {
          animation: scale-up 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};