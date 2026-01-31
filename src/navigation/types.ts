/**
 * Navigation - Types
 * 
 * Type-safe navigation with TypeScript
 */

import {NavigatorScreenParams} from '@react-navigation/native';

/**
 * Auth Stack
 */
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

/**
 * Animals Stack (nested in Home tab)
 */
export type AnimalsStackParamList = {
  AnimalsList: undefined;
  AnimalDetail: {id: string};
};

/**
 * Profile Stack (nested in Profile tab)
 */
export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
};

/**
 * Tab Navigator
 */
export type AppTabsParamList = {
  HomeTab: NavigatorScreenParams<AnimalsStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

/**
 * Root Stack (main navigator)
 */
export type RootStackParamList = {
  // Auth flow
  Auth: NavigatorScreenParams<AuthStackParamList>;

  // Main app (tabs)
  App: NavigatorScreenParams<AppTabsParamList>;

  // Modals (presented on top)
  AnimalDetailModal?: {id: string}; // For deep linking example
};

// Navigation prop types for easy access
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
