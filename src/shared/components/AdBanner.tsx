/**
 * Shared - Components - AdBanner
 * 
 * Reusable banner ad component
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {BannerAd, BannerAdSize, AD_UNIT_IDS} from '@infra/ads';
import config from '@infra/config';

interface AdBannerProps {
  size?: BannerAdSize;
  style?: any;
}

export function AdBanner({
  size = BannerAdSize.BANNER,
  style,
}: AdBannerProps) {
  // Don't render if ads disabled
  if (!config.features.ads) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={AD_UNIT_IDS.banner}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          console.log('[AdBanner] Ad loaded');
        }}
        onAdFailedToLoad={error => {
          console.error('[AdBanner] Ad failed to load:', error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AdBanner;
