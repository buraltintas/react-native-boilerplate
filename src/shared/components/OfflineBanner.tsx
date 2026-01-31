/**
 * Shared - Components - OfflineBanner
 * 
 * Banner shown when device is offline
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNetworkState} from '@infra/network';

export function OfflineBanner() {
  const {isConnected} = useNetworkState();

  if (isConnected) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>📵 No Internet Connection</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ff3b30',
    padding: 8,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OfflineBanner;
