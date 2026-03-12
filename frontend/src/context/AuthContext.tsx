import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiClient, setAuthToken } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  userToken: string | null;
  isLoading: boolean;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token on startup
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setUserToken(token);
          setAuthToken(token);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (username: string, pass: string) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', pass);
  
      const res = await apiClient.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' } // FastAPI OAuth2 requires form data
      });

      if (res.data.access_token) {
        setAuthToken(res.data.access_token);
        setUserToken(res.data.access_token);
        await AsyncStorage.setItem('userToken', res.data.access_token);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Login failed:", e);
      return false;
    }
  };

  const logout = async () => {
    setAuthToken(null);
    setUserToken(null);
    await AsyncStorage.removeItem('userToken');
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
