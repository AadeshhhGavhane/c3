import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  signUp as signUpService,
  signIn as signInService,
  sendOTP as sendOTPService,
  verifyOTP as verifyOTPService,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
  logout as logoutService,
  User,
} from '@/services/authService';
import { getToken } from '@/services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@c3_auth_token';
const USER_KEY = '@c3_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored auth data on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const response = await signUpService({ name, email, password });
      
      // Store user email for OTP verification
      if (response.data?.email) {
        await AsyncStorage.setItem('@c3_signup_email', email);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign up');
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const response = await signInService({ email, password });
      
      if (response.data?.token && response.data?.user) {
        const authToken = response.data.token;
        const userData = response.data.user;

        // Store token and user
        await AsyncStorage.setItem(TOKEN_KEY, authToken);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

        setToken(authToken);
        setUser(userData);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const sendOTP = async (email: string): Promise<void> => {
    try {
      await sendOTPService(email);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send OTP');
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<void> => {
    try {
      const response = await verifyOTPService({ email, otp });
      
      // After OTP verification, user should sign in
      // But if the response includes user data, we can set it
      if (response.data?.user) {
        const userData = response.data.user;
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
        setUser(userData);
      }

      // Clear signup email
      await AsyncStorage.removeItem('@c3_signup_email');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to verify OTP');
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      await forgotPasswordService(email);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send password reset email');
    }
  };

  const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string
  ): Promise<void> => {
    try {
      await resetPasswordService(email, otp, newPassword);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to reset password');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutService();
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
    } catch (error: any) {
      console.error('Error during logout:', error);
      // Clear local state even if storage fails
      setToken(null);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    signUp,
    signIn,
    sendOTP,
    verifyOTP,
    forgotPassword,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

