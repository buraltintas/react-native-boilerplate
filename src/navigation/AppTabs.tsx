/**
 * Navigation - App Tabs
 * 
 * Main app tabs with nested stacks
 */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AppTabsParamList} from './types';

// Nested stacks
import {AnimalsStack} from './AnimalsStack';
import {ProfileStack} from './ProfileStack';

const Tab = createBottomTabNavigator<AppTabsParamList>();

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}>
      <Tab.Screen
        name="HomeTab"
        component={AnimalsStack}
        options={{
          title: 'Home',
          tabBarIcon: () => null, // Add icons later
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          title: 'Profile',
          tabBarIcon: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

export default AppTabs;
