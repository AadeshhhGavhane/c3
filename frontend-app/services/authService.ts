import api from './api';
import { setToken, removeToken } from './api';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface OTPData {
  email: string;
  otp: string;
}

export interface User {
  userId: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token?: string;
    user?: User;
  };
}

// Sign up
export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/signup', data);
  return response.data;
};

// Sign in
export const signIn = async (data: SignInData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/signin', data);
  
  // Store token if received
  if (response.data.data.token) {
    await setToken(response.data.data.token);
  }
  
  return response.data;
};

// Send OTP
export const sendOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>('/auth/send-otp', {
    email,
  });
  return response.data;
};

// Verify OTP
export const verifyOTP = async (data: OTPData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/verify-otp', data);
  return response.data;
};

// Forgot password
export const forgotPassword = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>(
    '/auth/forgot-password',
    { email }
  );
  return response.data;
};

// Reset password
export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>(
    '/auth/reset-password',
    { email, otp, newPassword }
  );
  return response.data;
};

// Logout (clear token)
export const logout = async (): Promise<void> => {
  await removeToken();
};

