/**
 * Infra - API - Auth Module
 * 
 * Auth-related API calls
 */

import {apiClient} from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface SignupResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export const authApi = {
  /**
   * Login
   */
  login: (data: LoginRequest) => {
    return apiClient.post<LoginResponse>('/auth/login', data);
  },

  /**
   * Signup
   */
  signup: (data: SignupRequest) => {
    return apiClient.post<SignupResponse>('/auth/signup', data);
  },

  /**
   * Logout
   */
  logout: () => {
    return apiClient.post('/auth/logout');
  },

  /**
   * Forgot password
   */
  forgotPassword: (data: ForgotPasswordRequest) => {
    return apiClient.post('/auth/forgot-password', data);
  },

  /**
   * Reset password
   */
  resetPassword: (data: ResetPasswordRequest) => {
    return apiClient.post('/auth/reset-password', data);
  },

  /**
   * Get current user
   */
  getCurrentUser: () => {
    return apiClient.get<LoginResponse['user']>('/auth/me');
  },
};

export default authApi;
