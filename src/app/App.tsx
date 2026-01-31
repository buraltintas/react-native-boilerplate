/**
 * App - Main App Component
 * 
 * Root component with providers, error boundary, and bootstrap
 */

import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import AppProviders from './providers';
import {RootNavigator} from '@navigation';
import {
  ErrorBoundary,
  BootstrapScreen,
  ForceUpdateScreen,
  OfflineBanner,
} from '@shared/components';
import {bootstrapController, BootstrapState} from './bootstrap';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [bootstrapState, setBootstrapState] = useState<BootstrapState>(
    bootstrapController.getState(),
  );

  useEffect(() => {
    // Subscribe to bootstrap state
    const unsubscribe = bootstrapController.subscribe(setBootstrapState);

    // Start bootstrap
    bootstrapController.bootstrap();

    return unsubscribe;
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (bootstrapState.step === 'complete') {
      await SplashScreen.hideAsync();
    }
  }, [bootstrapState.step]);

  // Show force update screen if required
  if (
    bootstrapState.step === 'complete' &&
    bootstrapState.versionInfo?.forceUpdate
  ) {
    return <ForceUpdateScreen versionInfo={bootstrapState.versionInfo} />;
  }

  // Show bootstrap loading screen
  if (bootstrapState.step !== 'complete') {
    return <BootstrapScreen state={bootstrapState} />;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <ErrorBoundary>
        <AppProviders>
          <OfflineBanner />
          <RootNavigator />
          <StatusBar style="auto" />
        </AppProviders>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
