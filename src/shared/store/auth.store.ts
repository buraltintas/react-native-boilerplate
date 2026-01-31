/**
 * Shared - Store - Auth Store
 * 
 * Auth state management (client state only)
 * Server state (user data) should use React Query
 */

import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {createVersionedStorage} from './persistence';
import {secureStorage} from '@infra/storage/secure';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  // State
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;

  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  setAccessToken: (token: string) => void;
  clearAuth: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      accessToken: null,

      // Set auth (after login/signup)
      setAuth: async (user, accessToken, refreshToken) => {
        // Store refresh token securely
        await secureStorage.setRefreshToken(refreshToken);

        // Update state
        set({
          isAuthenticated: true,
          user,
          accessToken,
        });
      },

      // Set access token (after refresh)
      setAccessToken: (token: string) => {
        set({accessToken: token});
      },

      // Clear auth (logout)
      clearAuth: async () => {
        // Clear refresh token
        await secureStorage.clearRefreshToken();

        // Clear state
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
        });
      },

      // Logout
      logout: () => {
        get().clearAuth();
      },

      // Update user
      updateUser: user => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {...currentUser, ...user},
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      version: 1,
      storage: createVersionedStorage({
        version: 1,
        // Only persist minimal auth state (not tokens!)
        whitelist: ['isAuthenticated', 'user'],
        // Migration example for future versions
        migrations: {
          // 1: (state) => {
          //   // Migrate from v0 to v1
          //   return { ...state, newField: 'default' };
          // },
        },
      }),
    },
  ),
);

export default useAuthStore;
