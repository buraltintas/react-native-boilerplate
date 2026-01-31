/**
 * Infra - Feature Flags
 * 
 * Feature flag system with remote config support
 * Flags can be updated remotely without app rebuild
 */

import config from '@infra/config';
import storage from '@infra/storage';
import crashReporter from '@infra/crash-reporter';

/**
 * Feature flag definition
 */
export interface FeatureFlag {
  key: string;
  defaultValue: boolean;
  description?: string;
}

/**
 * All available feature flags
 */
export const FEATURE_FLAGS = {
  ENABLE_ADS: {
    key: 'enable_ads',
    defaultValue: false,
    description: 'Enable advertisement display',
  },
  ENABLE_ANALYTICS: {
    key: 'enable_analytics',
    defaultValue: false,
    description: 'Enable analytics tracking',
  },
  ENABLE_CRASH_REPORTING: {
    key: 'enable_crash_reporting',
    defaultValue: false,
    description: 'Enable crash reporting',
  },
  ENABLE_DARK_MODE: {
    key: 'enable_dark_mode',
    defaultValue: true,
    description: 'Enable dark mode feature',
  },
  ENABLE_PUSH_NOTIFICATIONS: {
    key: 'enable_push_notifications',
    defaultValue: false,
    description: 'Enable push notifications',
  },
  ENABLE_BIOMETRIC_AUTH: {
    key: 'enable_biometric_auth',
    defaultValue: false,
    description: 'Enable biometric authentication',
  },
  SHOW_DEBUG_INFO: {
    key: 'show_debug_info',
    defaultValue: __DEV__,
    description: 'Show debug information',
  },
} as const;

type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

/**
 * Remote config response
 */
interface RemoteConfig {
  flags: Record<string, boolean>;
  version: number;
  updatedAt: string;
}

const STORAGE_KEY = 'feature_flags';
const CACHE_VERSION = 1;

/**
 * Feature Flags Service
 */
class FeatureFlagsService {
  private flags: Map<string, boolean> = new Map();
  private isInitialized = false;
  private remoteConfigUrl?: string;

  constructor() {
    // Set default values
    Object.values(FEATURE_FLAGS).forEach(flag => {
      this.flags.set(flag.key, flag.defaultValue);
    });
  }

  /**
   * Initialize feature flags
   */
  async initialize(remoteConfigUrl?: string): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    this.remoteConfigUrl = remoteConfigUrl;

    try {
      // Load from local storage
      await this.loadFromStorage();

      // Fetch from remote (non-blocking)
      if (remoteConfigUrl) {
        this.fetchRemoteConfig().catch(error => {
          console.warn('[FeatureFlags] Failed to fetch remote config:', error);
        });
      }

      this.isInitialized = true;
      console.log('[FeatureFlags] Initialized');
    } catch (error) {
      console.error('[FeatureFlags] Initialization error:', error);
      crashReporter.captureException(error as Error);
    }
  }

  /**
   * Load flags from storage
   */
  private async loadFromStorage(): Promise<void> {
    try {
      const stored = await storage.getItem(STORAGE_KEY);
      if (!stored) {
        return;
      }

      const data = JSON.parse(stored) as {
        version: number;
        flags: Record<string, boolean>;
      };

      if (data.version !== CACHE_VERSION) {
        console.log('[FeatureFlags] Cache version mismatch, clearing');
        await storage.removeItem(STORAGE_KEY);
        return;
      }

      // Apply stored flags
      Object.entries(data.flags).forEach(([key, value]) => {
        this.flags.set(key, value);
      });

      console.log('[FeatureFlags] Loaded from storage');
    } catch (error) {
      console.error('[FeatureFlags] Error loading from storage:', error);
    }
  }

  /**
   * Save flags to storage
   */
  private async saveToStorage(): Promise<void> {
    try {
      const data = {
        version: CACHE_VERSION,
        flags: Object.fromEntries(this.flags),
      };

      await storage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('[FeatureFlags] Saved to storage');
    } catch (error) {
      console.error('[FeatureFlags] Error saving to storage:', error);
    }
  }

  /**
   * Fetch remote config
   */
  async fetchRemoteConfig(): Promise<void> {
    if (!this.remoteConfigUrl) {
      return;
    }

    try {
      const response = await fetch(this.remoteConfigUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: RemoteConfig = await response.json();

      // Update flags
      Object.entries(data.flags).forEach(([key, value]) => {
        this.flags.set(key, value);
      });

      // Save to storage
      await this.saveToStorage();

      console.log('[FeatureFlags] Remote config fetched and applied');
    } catch (error) {
      console.error('[FeatureFlags] Error fetching remote config:', error);
      throw error;
    }
  }

  /**
   * Get feature flag value
   */
  isEnabled(key: FeatureFlagKey): boolean {
    const flag = FEATURE_FLAGS[key];
    return this.flags.get(flag.key) ?? flag.defaultValue;
  }

  /**
   * Set feature flag (for testing/debugging)
   */
  setFlag(key: FeatureFlagKey, value: boolean): void {
    const flag = FEATURE_FLAGS[key];
    this.flags.set(flag.key, value);
    this.saveToStorage();
  }

  /**
   * Get all flags
   */
  getAllFlags(): Record<string, boolean> {
    return Object.fromEntries(this.flags);
  }

  /**
   * Reset to defaults
   */
  async resetToDefaults(): Promise<void> {
    Object.values(FEATURE_FLAGS).forEach(flag => {
      this.flags.set(flag.key, flag.defaultValue);
    });
    await this.saveToStorage();
    console.log('[FeatureFlags] Reset to defaults');
  }
}

// Export singleton
export const featureFlagsService = new FeatureFlagsService();

export default featureFlagsService;
