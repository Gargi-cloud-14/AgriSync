import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { authService, type LoginCredentials, type RegisterData } from '../services/authService';
import { demoUsers } from '../data/demoData';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  switchRoleDemo: (role: UserRole, navigateToDashboard?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('agrisync_auth_token');
      const storedUser = localStorage.getItem('agrisync_auth_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        // Default to a verified Farmer demo session for student evaluators,
        // while preserving full login/logout flows
        const defaultDemo = demoUsers[0];
        setUser(defaultDemo as User);
        setToken('demo-init-token');
      }
    } catch (e) {
      console.error('Failed to restore auth session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const result = await authService.login(credentials);
      setUser(result.user);
      setToken(result.token);
      localStorage.setItem('agrisync_auth_token', result.token);
      localStorage.setItem('agrisync_auth_user', JSON.stringify(result.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const result = await authService.register(data);
      setUser(result.user);
      setToken(result.token);
      localStorage.setItem('agrisync_auth_token', result.token);
      localStorage.setItem('agrisync_auth_user', JSON.stringify(result.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  /**
   * Helper for student evaluation & UI role testing:
   * Quickly switches active role context without needing manual registration.
   * If navigateToDashboard is true (default), automatically routes to the new role's dashboard.
   */
  const switchRoleDemo = (targetRole: UserRole, navigateToDashboard = true) => {
    const matched = demoUsers.find((u) => u.role === targetRole) || demoUsers[0];
    setUser(matched as User);
    const demoTkn = `demo-token-${targetRole.toLowerCase()}`;
    setToken(demoTkn);
    localStorage.setItem('agrisync_auth_token', demoTkn);
    localStorage.setItem('agrisync_auth_user', JSON.stringify(matched));

    if (navigateToDashboard) {
      const rolePathMap: Record<UserRole, string> = {
        FARMER: '/farmer',
        STORAGE_PROVIDER: '/storage',
        TRANSPORTER: '/transporter',
        BUYER: '/buyer',
        ADMIN: '/admin',
      };
      const dest = rolePathMap[targetRole] || '/farmer';
      window.location.href = dest;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRoleDemo,
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

export default AuthContext;
