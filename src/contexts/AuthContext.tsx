import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthContextType, User } from '@/types/auth';
import { authService } from '@/api/services';
import type { User as ApiUser } from '@/api/types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Convert API User to App User type
const convertApiUserToAppUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser.id,
    email: apiUser.email_address,
    name: `${apiUser.first_name} ${apiUser.last_name}`,
  };
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getAccessToken();
      const storedUser = authService.getCurrentUser();

      if (storedUser && token) {
        try {
          const appUser = convertApiUserToAppUser(storedUser);
          setUser(appUser);
        } catch (error) {
          console.error('Failed to restore session:', error);
          await authService.logout();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.signin({
        email_address: email,
        password: password,
      });

      const appUser = convertApiUserToAppUser(response.user);
      setUser(appUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    companyName?: string,
    industry?: string
  ) => {
    try {
      await authService.signup({
        first_name: firstName,
        last_name: lastName,
        email_address: email,
        password: password,
        company_name: companyName,
        industry: industry,
      });
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.signout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
