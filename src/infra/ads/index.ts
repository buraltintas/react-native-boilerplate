/**
 * Infra - Ads
 * 
 * Advertisement abstraction layer
 * Supports AdMob (via react-native-google-mobile-ads)
 * Gracefully degrades if native module is not available (Expo Go)
 */

import {Platform} from 'react-native';
import config from '@infra/config';
import crashReporter from '@infra/crash-reporter';

// Dynamic imports to handle Expo Go (where native modules don't exist)
let MobileAds: any = null;
let BannerAd: any = null;
let BannerAdSize: any = null;
let InterstitialAd: any = null;
let RewardedAd: any = null;
let RewardedAdEventType: any = null;
let TestIds: any = null;
let AdEventType: any = null;

try {
  const adsModule = require('react-native-google-mobile-ads');
  MobileAds = adsModule.default;
  BannerAd = adsModule.BannerAd;
  BannerAdSize = adsModule.BannerAdSize;
  InterstitialAd = adsModule.InterstitialAd;
  RewardedAd = adsModule.RewardedAd;
  RewardedAdEventType = adsModule.RewardedAdEventType;
  TestIds = adsModule.TestIds;
  AdEventType = adsModule.AdEventType;
} catch (error) {
  console.warn('[Ads] Native module not available (Expo Go). Ads will be disabled.');
}

/**
 * Ad Unit IDs
 * Use test IDs in development, real IDs in production
 * Function to avoid Platform access at module load time
 */
const getAdUnitIds = () => {
  return {
    banner: __DEV__
      ? TestIds?.BANNER || 'test-banner'
      : Platform.select({
          ios: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy',
          android: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy',
        }) || 'fallback-banner',
    interstitial: __DEV__
      ? TestIds?.INTERSTITIAL || 'test-interstitial'
      : Platform.select({
          ios: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy',
          android: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy',
        }) || 'fallback-interstitial',
    rewarded: __DEV__
      ? TestIds?.REWARDED || 'test-rewarded'
      : Platform.select({
          ios: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy',
          android: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy',
        }) || 'fallback-rewarded',
  };
};

export const AD_UNIT_IDS = getAdUnitIds();

/**
 * Ad types
 */
export type AdType = 'banner' | 'interstitial' | 'rewarded';

/**
 * Rewarded ad result
 */
export interface RewardedAdResult {
  type: string;
  amount: number;
}

/**
 * Ads Service
 */
class AdsService {
  private isInitialized = false;
  private isNativeModuleAvailable = false;
  private interstitialAd?: any;
  private rewardedAd?: any;
  private isInterstitialLoaded = false;
  private isRewardedLoaded = false;

  constructor() {
    this.isNativeModuleAvailable = MobileAds !== null;
  }

  /**
   * Initialize AdMob
   */
  async initialize(): Promise<void> {
    if (!this.isNativeModuleAvailable) {
      console.log('[Ads] Native module not available - ads disabled');
      return;
    }

    if (!config.features.ads) {
      console.log('[Ads] Ads are disabled in config');
      return;
    }

    if (this.isInitialized) {
      return;
    }

    try {
      await MobileAds().initialize();
      this.isInitialized = true;
      console.log('[Ads] AdMob initialized successfully');

      // Preload ads
      this.loadInterstitialAd();
      this.loadRewardedAd();
    } catch (error) {
      console.error('[Ads] Failed to initialize AdMob:', error);
      crashReporter.captureException(error as Error, {
        context: 'Ads initialization',
      });
    }
  }

  /**
   * Check if ads are enabled
   */
  isEnabled(): boolean {
    return this.isNativeModuleAvailable && config.features.ads && this.isInitialized;
  }

  /**
   * Load interstitial ad
   */
  private loadInterstitialAd(): void {
    if (!this.isEnabled() || !InterstitialAd) return;

    try {
      this.interstitialAd = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial);

      this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        this.isInterstitialLoaded = true;
        console.log('[Ads] Interstitial ad loaded');
      });

      this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        this.isInterstitialLoaded = false;
        // Reload for next time
        this.loadInterstitialAd();
      });

      this.interstitialAd.load();
    } catch (error) {
      console.error('[Ads] Failed to load interstitial ad:', error);
      crashReporter.captureException(error as Error, {
        context: 'Interstitial ad loading',
      });
    }
  }

  /**
   * Show interstitial ad
   */
  async showInterstitialAd(): Promise<boolean> {
    if (!this.isEnabled()) {
      console.log('[Ads] Ads not enabled');
      return false;
    }

    if (!this.isInterstitialLoaded || !this.interstitialAd) {
      console.log('[Ads] Interstitial ad not ready');
      return false;
    }

    try {
      await this.interstitialAd.show();
      return true;
    } catch (error) {
      console.error('[Ads] Failed to show interstitial ad:', error);
      crashReporter.captureException(error as Error, {
        context: 'Interstitial ad showing',
      });
      return false;
    }
  }

  /**
   * Load rewarded ad
   */
  private loadRewardedAd(): void {
    if (!this.isEnabled() || !RewardedAd) return;

    try {
      this.rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_IDS.rewarded);

      this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        this.isRewardedLoaded = true;
        console.log('[Ads] Rewarded ad loaded');
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward: any) => {
        console.log('[Ads] User earned reward:', reward);
      });

      this.rewardedAd.load();
    } catch (error) {
      console.error('[Ads] Failed to load rewarded ad:', error);
      crashReporter.captureException(error as Error, {
        context: 'Rewarded ad loading',
      });
    }
  }

  /**
   * Show rewarded ad
   */
  async showRewardedAd(): Promise<RewardedAdResult | null> {
    if (!this.isEnabled()) {
      console.log('[Ads] Ads not enabled');
      return null;
    }

    if (!this.isRewardedLoaded || !this.rewardedAd) {
      console.log('[Ads] Rewarded ad not ready');
      return null;
    }

    return new Promise((resolve, reject) => {
      if (!this.rewardedAd) {
        reject(new Error('Rewarded ad not available'));
        return;
      }

      // Listen for reward
      const rewardListener = this.rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        (reward: any) => {
          resolve(reward);
          rewardListener();
        },
      );

      // Listen for close without reward
      const closeListener = this.rewardedAd.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          this.isRewardedLoaded = false;
          this.loadRewardedAd(); // Reload
          closeListener();
        },
      );

      // Show ad
      this.rewardedAd
        .show()
        .then(() => {
          console.log('[Ads] Rewarded ad shown');
        })
        .catch((error: any) => {
          console.error('[Ads] Failed to show rewarded ad:', error);
          rewardListener();
          closeListener();
          reject(error);
        });
    });
  }

  /**
   * Check if interstitial is ready
   */
  isInterstitialReady(): boolean {
    return this.isEnabled() && this.isInterstitialLoaded;
  }

  /**
   * Check if rewarded is ready
   */
  isRewardedReady(): boolean {
    return this.isEnabled() && this.isRewardedLoaded;
  }
}

// Export singleton instance
export const adsService = new AdsService();

// Export components for direct use (may be null in Expo Go)
export {BannerAd, BannerAdSize};

export default adsService;
