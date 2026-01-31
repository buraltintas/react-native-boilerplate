/**
 * Shared - Components - ForceUpdateScreen
 * 
 * Force update screen shown when app version is outdated
 */

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Linking, Platform} from 'react-native';
import {VersionInfo} from '@infra/version';

interface Props {
  versionInfo: VersionInfo;
}

export function ForceUpdateScreen({versionInfo}: Props) {
  const handleUpdate = () => {
    const updateUrl =
      versionInfo.updateUrl ||
      (Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/your-app'
        : 'https://play.google.com/store/apps/details?id=your.app');

    Linking.openURL(updateUrl);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🚀</Text>
        <Text style={styles.title}>Update Required</Text>
        <Text style={styles.message}>
          A new version of the app is available. Please update to continue using the app.
        </Text>

        <View style={styles.versionInfo}>
          <Text style={styles.versionLabel}>Current Version:</Text>
          <Text style={styles.versionValue}>{versionInfo.currentVersion}</Text>

          <Text style={styles.versionLabel}>Latest Version:</Text>
          <Text style={styles.versionValue}>{versionInfo.latestVersion}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  versionInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    width: '100%',
  },
  versionLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  versionValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForceUpdateScreen;
