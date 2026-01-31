/**
 * Infra - App Version
 * 
 * App version management and force update
 * Gracefully degrades in Expo Go
 */

import {Platform} from 'react-native';
import {apiClient} from '@infra/api';
import Constants from 'expo-constants';

// Lazy import for Expo Go compatibility
let DeviceInfo: any = null;

try {
  DeviceInfo = require('react-native-device-info').default;
} catch (error) {
  console.warn('[AppVersion] react-native-device-info not available (Expo Go)');
}

export interface VersionInfo {
  currentVersion: string;
  minimumVersion: string;
  latestVersion: string;
  forceUpdate: boolean;
  updateUrl?: string;
}

/**
 * App Version Service
 */
class AppVersionService {
  private currentVersion: string;
  private isAvailable = false;

  constructor() {
    this.isAvailable = DeviceInfo !== null;
    
    // Get version from DeviceInfo or Constants
    if (this.isAvailable) {
      this.currentVersion = DeviceInfo.getVersion();
    } else {
      this.currentVersion = Constants.expoConfig?.version || '1.0.0';
    }
  }

  /**
   * Get current app version
   */
  getCurrentVersion(): string {
    return this.currentVersion;
  }

  /**
   * Get build number
   */
  getBuildNumber(): string {
    if (this.isAvailable) {
      return DeviceInfo.getBuildNumber();
    }
    return Constants.expoConfig?.ios?.buildNumber || 
           Constants.expoConfig?.android?.versionCode?.toString() || 
           '1';
  }

  /**
   * Get system name
   */
  getSystemName(): string {
    if (this.isAvailable) {
      return DeviceInfo.getSystemName();
    }
    return Platform.OS === 'ios' ? 'iOS' : 'Android';
  }

  /**
   * Check version with backend
   */
  async checkVersion(): Promise<VersionInfo> {
    // Check if version check is enabled in config
    const config = require('@infra/config').default;
    
    if (!config.features.versionCheck) {
      // Return safe defaults if version check is disabled
      return {
        currentVersion: this.currentVersion,
        minimumVersion: this.currentVersion,
        latestVersion: this.currentVersion,
        forceUpdate: false,
      };
    }

    try {
      const response = await apiClient.get<VersionInfo>('/version/check', {
        params: {
          version: this.currentVersion,
          platform: this.getSystemName(),
        },
      });

      return response;
    } catch (error) {
      console.warn('[AppVersion] Error checking version:', error);
      // Return safe defaults if backend fails
      return {
        currentVersion: this.currentVersion,
        minimumVersion: this.currentVersion,
        latestVersion: this.currentVersion,
        forceUpdate: false,
      };
    }
  }

  /**
   * Compare versions (semver-like)
   */
  compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;

      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }

    return 0;
  }

  /**
   * Check if update required
   */
  isUpdateRequired(minimumVersion: string): boolean {
    return this.compareVersions(this.currentVersion, minimumVersion) < 0;
  }
}

export const appVersionService = new AppVersionService();

export default appVersionService;
