import React, { useEffect, useRef } from 'react';

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleSignInButtonProps {
  onCredential: (credential: string) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            ux_mode?: 'popup' | 'redirect';
          }) => void;
          renderButton: (element: HTMLElement, options: Record<string, string | number>) => void;
        };
      };
    };
  }
}

const GOOGLE_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onCredential, disabled = false }) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (!clientId || disabled || !buttonRef.current) {
      return;
    }

    const renderGoogleButton = () => {
      if (!window.google || !buttonRef.current) {
        return;
      }

      buttonRef.current.replaceChildren();
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: response => onCredential(response.credential),
        ux_mode: 'popup',
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: 400,
      });
    };

    if (window.google) {
      renderGoogleButton();
      return;
    }

    const existingScript = document.querySelector(`script[src="${GOOGLE_SCRIPT_URL}"]`);
    const script = existingScript ?? document.createElement('script');
    script.setAttribute('src', GOOGLE_SCRIPT_URL);
    script.setAttribute('async', '');
    script.setAttribute('defer', '');
    script.addEventListener('load', renderGoogleButton, { once: true });
    if (!existingScript) {
      document.head.appendChild(script);
    }

    return () => script.removeEventListener('load', renderGoogleButton);
  }, [clientId, disabled, onCredential]);

  if (!clientId) {
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800">
        Google Sign-In needs VITE_GOOGLE_CLIENT_ID in your .env file.
      </p>
    );
  }

  return (
    <div className="w-full">
      <div ref={buttonRef} className="flex min-h-11 w-full justify-center" aria-label="Continue with Google" />
      <p className="mt-2 text-center text-xs text-slate-400">
        Google sign-in is configured for {window.location.origin}.
      </p>
    </div>
  );
};
