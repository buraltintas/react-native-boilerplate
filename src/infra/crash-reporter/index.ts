/**
 * Infra - Crash Reporting
 * 
 * Crash reporting abstraction (Sentry-ready pattern)
 */

import config from '@infra/config';

export interface ICrashReporter {
  captureException(error: Error, context?: Record<string, any>): void;
  captureMessage(message: string, level?: 'info' | 'warning' | 'error'): void;
  setUser(user: {id: string; email?: string; name?: string} | null): void;
  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: 'info' | 'warning' | 'error';
    data?: Record<string, any>;
  }): void;
}

/**
 * Mock crash reporter
 * Replace with Sentry.init() in production
 */
class MockCrashReporter implements ICrashReporter {
  captureException(error: Error, context?: Record<string, any>): void {
    if (!config.features.crashReporting) {
      return;
    }
    console.error('[CrashReporter] Exception:', error, context);
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    if (!config.features.crashReporting) {
      return;
    }
    console.log('[CrashReporter] Message:', level, message);
  }

  setUser(user: {id: string; email?: string; name?: string} | null): void {
    if (!config.features.crashReporting) {
      return;
    }
    console.log('[CrashReporter] User:', user);
  }

  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: 'info' | 'warning' | 'error';
    data?: Record<string, any>;
  }): void {
    if (!config.features.crashReporting) {
      return;
    }
    console.log('[CrashReporter] Breadcrumb:', breadcrumb);
  }
}

export const crashReporter: ICrashReporter = new MockCrashReporter();

export default crashReporter;
