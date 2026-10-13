import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/*
 * SIMULATED AUTHENTICATION (demo only)
 * -----------------------------------
 * There is no backend. Credentials are compared against a hard-coded demo
 * account to demonstrate the UI flow. Real apps must verify credentials on a
 * secure server. Only non-sensitive profile info (name, email, demo flag) is
 * kept in sessionStorage - the password is NEVER stored anywhere.
 */
export const DEMO_ACCOUNT = {
  email: 'manish@gmail.com',
  password: 'PlayZone@123',
  name: 'Manish',
  role: 'Demo Player',
};

const SESSION_KEY = 'playzone:session';
const AuthContext = createContext(null);

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.name === 'string') return parsed;
  } catch {
    /* ignore corrupt or unavailable storage */
  }
  return null;
}

function saveSession(user) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    /* storage may be unavailable; session just lasts until reload */
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const signIn = useCallback(
    (email, password) =>
      new Promise((resolve) => {
        // Simulated network delay
        setTimeout(() => {
          const ok =
            email.trim().toLowerCase() === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password;
          if (!ok) {
            resolve({ ok: false, error: 'Email or password is incorrect. Use the demo credentials shown below.' });
            return;
          }
          const profile = { name: DEMO_ACCOUNT.name, email: DEMO_ACCOUNT.email, role: DEMO_ACCOUNT.role, demo: false };
          saveSession(profile);
          setUser(profile);
          resolve({ ok: true });
        }, 700);
      }),
    []
  );

  const exploreDemo = useCallback(() => {
    const profile = { name: 'Guest', email: 'guest@playzone.demo', role: 'Demo Player', demo: true };
    saveSession(profile);
    setUser(profile);
  }, []);

  const signOut = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, signIn, exploreDemo, signOut }), [user, signIn, exploreDemo, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
