import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/api';

interface Admin {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token salvo
    const token = localStorage.getItem('admin_token');
    const savedAdmin = localStorage.getItem('admin_data');

    if (token && savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (error) {
        console.error('Erro ao carregar dados do admin:', error);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await apiService.login(username, password);
    
    if (response.success && response.data) {
      setAdmin(response.data.admin);
      localStorage.setItem('admin_data', JSON.stringify(response.data.admin));
    } else {
      throw new Error(response.message || 'Erro ao fazer login');
    }
  };

  const logout = () => {
    apiService.logout();
    setAdmin(null);
    localStorage.removeItem('admin_data');
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
