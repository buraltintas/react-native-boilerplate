/**
 * Example: Using Ads System
 * 
 * This file shows how to use all ad types
 */

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {AdBanner} from '@shared/components';
import {useInterstitialAd, useRewardedAd} from '@shared/hooks';
import {BannerAdSize} from 'react-native-google-mobile-ads';

export default function AdsExampleScreen() {
  const {isReady: interstitialReady, showAd: showInterstitial} = useInterstitialAd();
  const {isReady: rewardedReady, showAd: showRewarded} = useRewardedAd();
  const [rewardAmount, setRewardAmount] = useState(0);

  const handleShowInterstitial = async () => {
    const shown = await showInterstitial();
    if (shown) {
      Alert.alert('Success', 'Interstitial ad shown');
    } else {
      Alert.alert('Info', 'Interstitial ad not ready yet');
    }
  };

  const handleShowRewarded = async () => {
    try {
      const reward = await showRewarded();
      if (reward) {
        Alert.alert('Reward Earned!', `You earned ${reward.amount} ${reward.type}`);
        setRewardAmount(prev => prev + reward.amount);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to show rewarded ad');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ads Example</Text>

      {/* Banner Ad */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Banner Ad</Text>
        <AdBanner size={BannerAdSize.BANNER} />
      </View>

      {/* Interstitial Ad */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interstitial Ad</Text>
        <TouchableOpacity
          style={[
            styles.button,
            !interstitialReady && styles.buttonDisabled,
          ]}
          onPress={handleShowInterstitial}
          disabled={!interstitialReady}>
          <Text style={styles.buttonText}>
            {interstitialReady ? 'Show Interstitial' : 'Loading...'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rewarded Ad */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rewarded Ad</Text>
        <Text style={styles.rewardText}>Coins: {rewardAmount}</Text>
        <TouchableOpacity
          style={[
            styles.button,
            styles.rewardedButton,
            !rewardedReady && styles.buttonDisabled,
          ]}
          onPress={handleShowRewarded}
          disabled={!rewardedReady}>
          <Text style={styles.buttonText}>
            {rewardedReady ? 'Watch & Earn Coins' : 'Loading...'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Large Banner */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Large Banner</Text>
        <AdBanner size={BannerAdSize.LARGE_BANNER} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.infoText}>
          ℹ️ In development, test ads are shown automatically
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  rewardedButton: {
    backgroundColor: '#34C759',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  rewardText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FFD700',
  },
  info: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    textAlign: 'center',
  },
});
