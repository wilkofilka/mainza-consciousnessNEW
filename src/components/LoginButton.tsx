import { useEffect, useRef, useState } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthSession } from '@/context/AuthSessionContext';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              size?: 'large' | 'medium' | 'small';
              width?: string;
            }
          ) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const LoginButton = () => {
  const { user, isAuthenticated, startSession, endSession } = useAuthSession();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current || isAuthenticated) {
      return;
    }

    if (!window.google?.accounts?.id) {
      setErrorMessage('Google Identity Services nie zostało poprawnie załadowane.');
      return;
    }

    googleButtonRef.current.innerHTML = '';

    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: ({ credential }) => {
          if (!credential) {
            setErrorMessage('Logowanie nie zwróciło credential tokenu.');
            return;
          }

          try {
            startSession(credential);
            setErrorMessage(null);
          } catch (error) {
            console.error('Nie udało się zainicjalizować sesji po logowaniu Google:', error);
            setErrorMessage('Nie udało się rozpocząć sesji. Spróbuj ponownie.');
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
        width: '240'
      });
    } catch (error) {
      console.error('Błąd inicjalizacji Google Sign-In:', error);
      setErrorMessage('Wystąpił problem podczas inicjalizacji logowania Google.');
    }
  }, [isAuthenticated, startSession]);

  const handleLogout = () => {
    endSession();
    window.google?.accounts?.id.disableAutoSelect();
    setErrorMessage(null);
  };

  if (!googleClientId) {
    return (
      <div className="text-right">
        <p className="text-xs text-amber-300">
          Brak konfiguracji OAuth. Ustaw <code>VITE_GOOGLE_CLIENT_ID</code> w pliku <code>.env</code>.
        </p>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-white">{user.name ?? user.email ?? 'Użytkownik Google'}</p>
          <p className="text-xs text-slate-400">Zalogowano przez Google</p>
        </div>
        <Button variant="outline" className="border-slate-600 text-white" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Wyloguj
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div ref={googleButtonRef} aria-label="Google login button" className="min-h-10" />
      {errorMessage ? (
        <div className="flex items-center gap-2 text-xs text-rose-300">
          <LogIn className="h-3.5 w-3.5" />
          <span>{errorMessage}</span>
        </div>
      ) : (
        <p className="text-xs text-slate-400">Fallback UX: kontynuuj jako gość, jeśli logowanie się nie powiedzie.</p>
      )}
    </div>
  );
};

export default LoginButton;
