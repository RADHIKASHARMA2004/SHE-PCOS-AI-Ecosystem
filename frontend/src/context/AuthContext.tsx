import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiClient, setAuthToken } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  userToken: string | null;
  isLoading: boolean;
  login: (username: string, pass: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
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
     const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', pass);

     const res = await apiClient.post('/auth/login', params, {
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
      if (res.data.access_token) {
        setAuthToken(res.data.access_token);
        setUserToken(res.data.access_token);
        await AsyncStorage.setItem('userToken', res.data.access_token);
        return true;
      }
      return false;
    } catch (e: any) {
      console.error("Login failed. Message:", e.message);
      if (e.response) {
         console.error("Response data:", e.response.data);
         console.error("Response status:", e.response.status);
      }
      return false;
    }
  };

  const signup = async (userData: any) => {
    try {
      const res = await apiClient.post('/auth/signup', userData);
      if (res.data.msg) {
        // Automatically login the user after successful signup
        return await login(userData.username, userData.password);
      } else if (res.data.error) {
        throw new Error(res.data.error);
      }
      return false;
    } catch (e: any) {
      console.error("Signup failed.", e.message);
      if (e.response && e.response.data && e.response.data.detail) {
          throw new Error(e.response.data.detail);
      }
      throw new Error(e.message || "Failed to create account");
    }
  };

  const logout = async () => {
    setAuthToken(null);
    setUserToken(null);
    await AsyncStorage.removeItem('userToken');
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
