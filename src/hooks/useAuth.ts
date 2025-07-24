import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AuthService } from '../services/auth';
import { User, LoginCredentials, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const authService = AuthService.getInstance();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = authService.getStoredToken();
      if (storedToken) {
        try {
          const userData = await authService.validateToken(storedToken);
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          authService.removeToken();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setToken(response.token);
      authService.storeToken(response.token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    authService.removeToken();
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
