import { createContext, useContext, useState, useEffect } from 'react';
import { empMe, employerMe, empLogout, employerLogout } from '../api/auth';

const AuthContext = createContext(null);

const USER_KEY = 'job_portal_user';

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  const setUser = (u) => {
    setUserState(u);
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // 1) Use localStorage for instant UI (if available)
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (!cancelled) setUserState(parsed);
        } catch (_) {
          localStorage.removeItem(USER_KEY);
        }
      }

      // 2) Always attempt to restore session from httpOnly cookies (source of truth)
      try {
        const { data } = await employerMe();
        if (!cancelled) {
          setUserState(data.user);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        }
      } catch (_) {
        try {
          const { data } = await empMe();
          if (!cancelled) {
            setUserState(data.user);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          }
        } catch (_) {
          if (!cancelled) {
            setUserState(null);
            localStorage.removeItem(USER_KEY);
          }
        }
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = {
    user,
    setUser,
    role: user?.role ?? null,
    isEmployer: user?.role === 'Employer',
    isEmployee: user?.role === 'Employee',
    isAuthenticated: !!user,
    bootstrapping,
    logout: async () => {
      // clear cookie on server + local state
      try {
        if (user?.role === 'Employer') await employerLogout();
        else if (user?.role === 'Employee') await empLogout();
      } catch (_) {
        // ignore network errors; still clear local session
      } finally {
        setUser(null);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
