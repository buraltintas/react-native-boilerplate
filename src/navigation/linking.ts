/**
 * Navigation - Linking Configuration
 * 
 * Deep linking setup for Android and iOS
 * 
 * URLs:
 * - myapp://login
 * - myapp://animals (list)
 * - myapp://animals/123 (detail)
 * - myapp://profile
 * - myapp://settings
 */

import {LinkingOptions} from '@react-navigation/native';
import {RootStackParamList} from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Signup: 'signup',
          ForgotPassword: 'forgot-password',
        },
      },
      App: {
        screens: {
          HomeTab: {
            screens: {
              AnimalsList: 'animals',
              AnimalDetail: 'animals/:id',
            },
          },
          ProfileTab: {
            screens: {
              ProfileMain: 'profile',
              EditProfile: 'profile/edit',
              Settings: 'settings',
            },
          },
        },
      },
      AnimalDetailModal: 'animals/:id/modal',
    },
  },
};

export default linking;
