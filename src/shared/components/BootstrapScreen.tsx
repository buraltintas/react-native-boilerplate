/**
 * Shared - Components - BootstrapScreen
 * 
 * Bootstrap loading screen
 */

import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {BootstrapState} from '@app/bootstrap';

interface Props {
  state: BootstrapState;
}

const STEP_LABELS: Record<string, string> = {
  idle: 'Initializing...',
  storage: 'Loading data...',
  feature_flags: 'Loading configuration...',
  auth: 'Restoring session...',
  locale: 'Setting up language...',
  network: 'Checking connection...',
  version: 'Checking for updates...',
  permissions: 'Checking permissions...',
  ads: 'Initializing ads...',
  analytics: 'Setting up analytics...',
  complete: 'Ready!',
  error: 'Error occurred',
};

export function BootstrapScreen({state}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.label}>{STEP_LABELS[state.step] || 'Loading...'}</Text>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, {width: `${state.progress}%`}]} />
        </View>

        {state.error && (
          <Text style={styles.error}>Error: {state.error.message}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  progressContainer: {
    width: 200,
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  error: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 16,
  },
});

export default BootstrapScreen;
