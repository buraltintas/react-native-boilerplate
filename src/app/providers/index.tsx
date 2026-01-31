/**
 * App - Providers
 * 
 * Combines all providers into a single component
 */

import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {QueryProvider} from './QueryProvider';
import {I18nProvider} from './I18nProvider';
import {NavigationProvider} from './NavigationProvider';
import {ThemeProvider} from '@shared/theme';

interface Props {
  children: React.ReactNode;
}

export function AppProviders({children}: Props) {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryProvider>
        <ThemeProvider>
          <I18nProvider>
            <BottomSheetModalProvider>
              <NavigationProvider>{children}</NavigationProvider>
            </BottomSheetModalProvider>
          </I18nProvider>
        </ThemeProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}

export default AppProviders;
