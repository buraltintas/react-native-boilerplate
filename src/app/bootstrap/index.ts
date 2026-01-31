/**
 * App - Bootstrap
 * 
 * Centralized app bootstrap orchestration
 * Handles initialization sequence:
 * 1. Storage hydration
 * 2. Feature flags
 * 3. Auth restore
 * 4. Locale resolution
 * 5. Network check
 * 6. Version check
 * 7. Permissions precheck
 */

import {featureFlagsService} from '@infra/feature-flags';
import {networkService} from '@infra/network';
import {appVersionService, VersionInfo} from '@infra/version';
import {adsService} from '@infra/ads';
import {securityService} from '@infra/security';
import {useAuthStore, useUIStore} from '@shared/store';
import analytics from '@infra/analytics';
import crashReporter from '@infra/crash-reporter';
import {detectDeviceLanguage} from '@shared/i18n';

export type BootstrapStep =
  | 'idle'
  | 'storage'
  | 'feature_flags'
  | 'auth'
  | 'locale'
  | 'network'
  | 'version'
  | 'permissions'
  | 'ads'
  | 'analytics'
  | 'complete'
  | 'error';

export interface BootstrapState {
  step: BootstrapStep;
  progress: number;
  error?: Error;
  versionInfo?: VersionInfo;
  isJailbroken?: boolean;
}

/**
 * Bootstrap Controller
 */
class BootstrapController {
  private state: BootstrapState = {
    step: 'idle',
    progress: 0,
  };

  private listeners: Set<(state: BootstrapState) => void> = new Set();

  /**
   * Subscribe to bootstrap state changes
   */
  subscribe(listener: (state: BootstrapState) => void): () => void {
    this.listeners.add(listener);
    // Send current state immediately
    listener(this.state);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Update state and notify listeners
   */
  private updateState(update: Partial<BootstrapState>) {
    this.state = {...this.state, ...update};
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Run bootstrap sequence
   */
  async bootstrap(): Promise<BootstrapState> {
    try {
      // 1. Storage hydration (handled by Zustand persist middleware)
      this.updateState({step: 'storage', progress: 10});
      await this.delay(100); // Small delay for visual feedback

      // 2. Feature flags
      this.updateState({step: 'feature_flags', progress: 20});
      await featureFlagsService.initialize();

      // 3. Security checks
      const isJailbroken = await securityService.isJailbroken();
      if (isJailbroken) {
        console.warn('[Bootstrap] Device appears to be jailbroken/rooted');
      }
      this.updateState({isJailbroken});

      // 4. Auth restore (handled by Zustand persist middleware)
      this.updateState({step: 'auth', progress: 30});
      const isAuthenticated = useAuthStore.getState().isAuthenticated;
      if (isAuthenticated) {
        console.log('[Bootstrap] User authenticated');
      }

      // 5. Locale resolution
      this.updateState({step: 'locale', progress: 40});
      const storedLanguage = useUIStore.getState().language;
      const deviceLanguage = detectDeviceLanguage();
      if (!storedLanguage) {
        useUIStore.getState().setLanguage(deviceLanguage);
      }

      // 6. Network check
      this.updateState({step: 'network', progress: 50});
      const networkState = await networkService.getState();
      console.log('[Bootstrap] Network state:', networkState);

      // 7. Version check
      this.updateState({step: 'version', progress: 60});
      const versionInfo = await appVersionService.checkVersion();
      this.updateState({versionInfo});

      if (versionInfo.forceUpdate) {
        console.warn('[Bootstrap] Force update required');
        // Don't proceed - show force update screen
        this.updateState({step: 'complete', progress: 100});
        return this.state;
      }

      // 8. Permissions precheck (non-blocking)
      this.updateState({step: 'permissions', progress: 70});
      // Permissions will be requested when needed

      // 9. Initialize ads (if enabled)
      this.updateState({step: 'ads', progress: 80});
      try {
        await adsService.initialize();
      } catch (error) {
        console.error('[Bootstrap] Ads initialization failed:', error);
        // Continue bootstrap even if ads fail
      }

      // 10. Initialize analytics
      this.updateState({step: 'analytics', progress: 90});
      if (isAuthenticated) {
        const user = useAuthStore.getState().user;
        if (user) {
          analytics.setUserId(user.id);
          crashReporter.setUser({
            id: user.id,
            email: user.email,
            name: user.name,
          });
        }
      }

      // Complete
      this.updateState({step: 'complete', progress: 100});
      console.log('[Bootstrap] Complete');

      return this.state;
    } catch (error) {
      console.error('[Bootstrap] Error:', error);
      this.updateState({
        step: 'error',
        error: error as Error,
      });
      crashReporter.captureException(error as Error, {
        context: 'App Bootstrap',
      });
      return this.state;
    }
  }

  /**
   * Reset bootstrap (for retry)
   */
  reset() {
    this.state = {
      step: 'idle',
      progress: 0,
    };
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Get current state
   */
  getState(): BootstrapState {
    return this.state;
  }

  /**
   * Helper delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const bootstrapController = new BootstrapController();

export default bootstrapController;
