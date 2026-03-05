import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const USER_KEY = 'job_portal_user';

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);

  const setUser = (u) => {
    setUserState(u);
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY);
  };

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      try {
        setUserState(JSON.parse(stored));
      } catch (_) {
        localStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  const value = {
    user,
    setUser,
    role: user?.role ?? null,
    isEmployer: user?.role === 'Employer',
    isEmployee: user?.role === 'Employee',
    isAuthenticated: !!user,
    logout: () => setUser(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
