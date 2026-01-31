/**
 * Navigation - Root Navigator
 * 
 * Main navigator that switches between Auth and App based on auth state
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {useAuthStore} from '@shared/store';

// Navigators
import {AuthStack} from './AuthStack';
import {AppTabs} from './AppTabs';

// Modal screens
import AnimalDetailScreen from '@features/animals/screens/AnimalDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {!isAuthenticated ? (
        // Unauthenticated stack
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        // Authenticated stack
        <>
          <Stack.Screen name="App" component={AppTabs} />

          {/* Modals (presented on top) */}
          <Stack.Screen
            name="AnimalDetailModal"
            component={AnimalDetailScreen}
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Animal Details',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default RootNavigator;
