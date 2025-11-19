import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginFormData, RegisterFormData } from '../types';
import { authService } from '../services/authService';
import { TOKEN_KEY } from '../utils/constants';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (error) {
          localStorage.removeItem(TOKEN_KEY);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginFormData) => {
    const response = await authService.login(data);
    localStorage.setItem(TOKEN_KEY, response.token);
    setUser(response.user);
  };

  const register = async (data: RegisterFormData) => {
    await authService.register(data);
    // Después de registrar, hacer login automático
    await login({ email: data.email, password: data.password });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

