/**
 * Shared - Store - UI Store
 * 
 * UI/client state (theme, language, preferences)
 */

import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {createVersionedStorage} from './persistence';
import {detectDeviceLanguage, SupportedLanguage} from '@shared/i18n';

export type Theme = 'light' | 'dark' | 'system';

interface UIState {
  // State
  theme: Theme;
  language: SupportedLanguage;
  hasCompletedOnboarding: boolean;
  isLanguageAutoDetected: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  setLanguage: (language: SupportedLanguage) => void;
  completeOnboarding: () => void;
  resetLanguageToDevice: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    set => ({
      // Initial state
      theme: 'system',
      language: detectDeviceLanguage(), // Auto-detect on first launch
      hasCompletedOnboarding: false,
      isLanguageAutoDetected: true,

      // Actions
      setTheme: theme => set({theme}),
      setLanguage: language =>
        set({language, isLanguageAutoDetected: false}),
      completeOnboarding: () => set({hasCompletedOnboarding: true}),
      resetLanguageToDevice: () =>
        set({
          language: detectDeviceLanguage(),
          isLanguageAutoDetected: true,
        }),
    }),
    {
      name: 'ui-storage',
      version: 1,
      storage: createVersionedStorage({
        version: 1,
        // Persist all UI state
        migrations: {
          // Example migration
          // 2: (state) => {
          //   return { ...state, newPreference: true };
          // },
        },
      }),
    },
  ),
);

export default useUIStore;
