import React, { useCallback, useContext, useEffect, useState } from 'react';

import { isBrowser } from '@/src/utils/checkBrowser';
import axios from 'axios';
import { Account } from '@/src/types/account.types';

type AuthContextValue = {
  isAuthenticated: boolean;
  updateToken(token?: string | null): void;
  userProfile?: Account;
  updateProfile: (newProfile: Account) => void;
};

export const AUTH_TOKEN_KEY = 'authToken';

const AuthContext = React.createContext<AuthContextValue>(null as TODO);

const updateToken = (newToken?: string | null) => {
  if (!isBrowser) {
    return () => undefined;
  }

  if (!newToken) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } else {
    localStorage.setItem(AUTH_TOKEN_KEY, newToken);
  }
};

const updateProfile = (newProfile?: Account | null) => {
  if (!isBrowser) {
    return () => undefined;
  }

  if (!newProfile) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } else {
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(newProfile));
  }
};

export const useAuthContext = () => useContext(AuthContext);

interface AuthProvider {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProvider> = ({ children }) => {
  const [token, setToken] = useState(
    (isBrowser && localStorage.getItem(AUTH_TOKEN_KEY)) ?? null
  );
  const [userProfile, setUserProfile] = useState<Account>();

  const handleUpdateToken = useCallback(
    (newToken: string) => {
      setToken(newToken);
      updateToken(newToken);
    },
    [setToken]
  );

  const handleUpdateProfile = useCallback((profile: Account) => {
    setUserProfile(profile);
    updateProfile(profile);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!token, updateToken: handleUpdateToken, userProfile, updateProfile: handleUpdateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
