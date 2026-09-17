import React, { createContext, useContext, useState, useEffect } from 'react';
import { LocalStorageService } from '../services/localStorageService';
import { AdminUser } from '../types';

interface AuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage admin session
    const currentSession = LocalStorageService.getAdminSession();
    setAdmin(currentSession);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const user = LocalStorageService.loginAdmin(email, password);
    setAdmin(user);
  };

  const logout = async () => {
    LocalStorageService.logoutAdmin();
    setAdmin(null);
  };

  const isSuperAdmin = admin?.role === 'SUPER_ADMIN';
  const isAdmin = admin?.role === 'SUPER_ADMIN' || admin?.role === 'ADMIN';
  const isStaff = !!admin;

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        isSuperAdmin,
        isAdmin,
        isStaff
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
