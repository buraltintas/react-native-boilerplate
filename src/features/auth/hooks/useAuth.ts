/**
 * Features - Auth - Hooks
 * 
 * React Query hooks for auth operations
 */

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {authApi, LoginRequest, SignupRequest, ForgotPasswordRequest} from '@infra/api';
import {useAuthStore} from '@shared/store';
import {queryKeys} from '@shared/query';

/**
 * Login mutation
 */
export function useLogin() {
  const setAuth = useAuthStore(state => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async response => {
      await setAuth(response.user, response.accessToken, response.refreshToken);
    },
  });
}

/**
 * Signup mutation
 */
export function useSignup() {
  const setAuth = useAuthStore(state => state.setAuth);

  return useMutation({
    mutationFn: (data: SignupRequest) => authApi.signup(data),
    onSuccess: async response => {
      await setAuth(response.user, response.accessToken, response.refreshToken);
    },
  });
}

/**
 * Logout mutation
 */
export function useLogout() {
  const clearAuth = useAuthStore(state => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: async () => {
      await clearAuth();
      // Clear all cached queries
      queryClient.clear();
    },
    onError: async () => {
      // Even if API call fails, clear local state
      await clearAuth();
      queryClient.clear();
    },
  });
}

/**
 * Forgot password mutation
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
  });
}

/**
 * Get current user query
 */
export function useCurrentUser() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: () => authApi.getCurrentUser(),
    enabled: isAuthenticated,
  });
}
