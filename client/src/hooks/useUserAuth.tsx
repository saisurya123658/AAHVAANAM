import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LocalStorageService } from '../services/localStorageService';
import { User, UserSession } from '../types';

interface UserAuthContextType {
  user: UserSession['user'] | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<UserSession['user']>;
  signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<UserSession['user']>;
  logout: () => Promise<void>;
  refreshSession: () => void;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession['user'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshSession = useCallback(() => {
    try {
      const session = LocalStorageService.getUserSession();
      setUser(session ? session.user : null);
    } catch (e) {
      console.error('[UserAuthProvider] Error checking session:', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();

    // Listen to localStorage updates across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'aahvaanam_session' || e.key === 'aahvaanam_user_session') {
        refreshSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshSession]);

  const login = async (email: string, password: string): Promise<UserSession['user']> => {
    const session = LocalStorageService.loginUser(email, password);
    setUser(session.user);
    return session.user;
  };

  const signup = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<UserSession['user']> => {
    const session = LocalStorageService.registerUser(data);
    setUser(session.user);
    return session.user;
  };

  const logout = async (): Promise<void> => {
    LocalStorageService.logoutUser();
    setUser(null);
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshSession,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = (): UserAuthContextType => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};
