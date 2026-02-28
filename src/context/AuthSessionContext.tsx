import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const SESSION_STORAGE_KEY = 'mainza-auth-session';

type AuthProvider = 'google';

export interface SessionUser {
  provider: AuthProvider;
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  givenName?: string;
  familyName?: string;
  issuedAt: number;
}

interface AuthSessionContextType {
  user: SessionUser | null;
  isAuthenticated: boolean;
  startSession: (credential: string) => SessionUser;
  endSession: () => void;
}

const AuthSessionContext = createContext<AuthSessionContextType | undefined>(undefined);

const decodeCredential = (credential: string): SessionUser => {
  const payloadBase64 = credential.split('.')[1];
  if (!payloadBase64) {
    throw new Error('Nieprawidłowy credential token Google.');
  }

  const normalizedBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
  const payloadJson = decodeURIComponent(
    atob(normalizedBase64)
      .split('')
      .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
      .join('')
  );

  const payload = JSON.parse(payloadJson) as {
    sub?: string;
    email?: string;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    iat?: number;
  };

  if (!payload.sub) {
    throw new Error('Brak identyfikatora użytkownika w tokenie Google.');
  }

  return {
    provider: 'google',
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    givenName: payload.given_name,
    familyName: payload.family_name,
    issuedAt: payload.iat ?? Math.floor(Date.now() / 1000)
  };
};

export const AuthSessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        setUser(JSON.parse(raw) as SessionUser);
      }
    } catch (error) {
      console.warn('Nie udało się odczytać sesji z sessionStorage:', error);
    }
  }, []);

  const startSession = (credential: string) => {
    const nextUser = decodeCredential(credential);
    setUser(nextUser);
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextUser));
    return nextUser;
  };

  const endSession = () => {
    setUser(null);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      startSession,
      endSession
    }),
    [user]
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
};

export const useAuthSession = () => {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error('useAuthSession musi być używany wewnątrz AuthSessionProvider.');
  }

  return context;
};
