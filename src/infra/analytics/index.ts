/**
 * Infra - Analytics
 * 
 * Analytics abstraction layer
 * Can plug in Firebase Analytics, Google Analytics, etc.
 */

import config from '@infra/config';

export interface AnalyticsEvent {
  name: string;
  params?: Record<string, any>;
}

export interface IAnalytics {
  logEvent(event: AnalyticsEvent): void;
  setUserId(userId: string | null): void;
  setUserProperty(name: string, value: string): void;
  logScreenView(screenName: string): void;
}

/**
 * Mock analytics implementation
 * Replace with real implementation (Firebase, etc.)
 */
class MockAnalytics implements IAnalytics {
  logEvent(event: AnalyticsEvent): void {
    if (!config.features.analytics) {
      return;
    }
    console.log('[Analytics] Event:', event.name, event.params);
  }

  setUserId(userId: string | null): void {
    if (!config.features.analytics) {
      return;
    }
    console.log('[Analytics] User ID:', userId);
  }

  setUserProperty(name: string, value: string): void {
    if (!config.features.analytics) {
      return;
    }
    console.log('[Analytics] User Property:', name, value);
  }

  logScreenView(screenName: string): void {
    if (!config.features.analytics) {
      return;
    }
    console.log('[Analytics] Screen View:', screenName);
  }
}

export const analytics: IAnalytics = new MockAnalytics();

export default analytics;
