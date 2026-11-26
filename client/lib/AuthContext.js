'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getToken, setUnauthorizedHandler, TOKEN_KEY } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Every logout navigates somewhere, so pages never get stuck on a protected route.
  const logout = useCallback(
    (redirectTo = '/login') => {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      router.replace(redirectTo);
    },
    [router]
  );

  const login = useCallback((token, nextUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(nextUser);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => logout('/login'));
  }, [logout]);

  // Load the current user once on app start.
  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    api('/users/me')
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
