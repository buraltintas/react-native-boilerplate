/**
 * Infra - Config
 * 
 * Centralized configuration management
 * Reads from Expo Constants (app.json extra field)
 */

import Constants from 'expo-constants';

export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  app: {
    env: 'development' | 'staging' | 'production';
  };
  features: {
    analytics: boolean;
    crashReporting: boolean;
    ads: boolean;
    versionCheck: boolean;
  };
  ads: {
    admobAppId: {
      ios: string;
      android: string;
    };
  };
  socket: {
    url: string;
    path: string;
  };
}

const extra = Constants.expoConfig?.extra || {};

const config: AppConfig = {
  api: {
    baseUrl: extra.apiBaseUrl || 'https://api.example.com',
    timeout: extra.apiTimeout || 30000,
  },
  app: {
    env: __DEV__ ? 'development' : 'production',
  },
  features: {
    analytics: extra.enableAnalytics || false,
    crashReporting: extra.enableCrashReporting || false,
    ads: extra.enableAds || false,
    versionCheck: extra.enableVersionCheck || false,
  },
  ads: {
    admobAppId: extra.admobAppId || {
      ios: 'ca-app-pub-3940256099942544~1458002511',
      android: 'ca-app-pub-3940256099942544~3347511713',
    },
  },
  socket: {
    url: extra.socketUrl || 'wss://api.example.com',
    path: extra.socketPath || '/socket.io',
  },
};

export default config;
