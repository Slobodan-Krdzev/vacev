'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { User } from '@/types';
import { login as apiLogin, logout as apiLogout, refreshToken } from './api';

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'vacev_access_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      setAccessToken(stored);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const getToken = useCallback(async () => {
    if (accessToken) return accessToken;

    try {
      const data = await refreshToken();
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setAccessToken(null);
      return null;
    }
  }, [accessToken]);

  const value = useMemo(
    () => ({ user, accessToken, isLoading, login, logout, getToken }),
    [user, accessToken, isLoading, login, logout, getToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
