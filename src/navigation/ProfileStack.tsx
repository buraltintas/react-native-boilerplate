/**
 * Navigation - Profile Stack
 * 
 * Profile feature nested stack
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ProfileStackParamList} from './types';

// Screens
import ProfileMainScreen from '@features/profile/screens/ProfileMainScreen';
import EditProfileScreen from '@features/profile/screens/EditProfileScreen';
import SettingsScreen from '@features/profile/screens/SettingsScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileMainScreen}
        options={{title: 'Profile'}}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{title: 'Edit Profile'}}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default ProfileStack;
