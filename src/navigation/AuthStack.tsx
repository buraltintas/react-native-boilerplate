/**
 * Navigation - Auth Stack
 * 
 * Unauthenticated flow (Login, Signup, etc.)
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStackParamList} from './types';

// Screens
import WelcomeScreen from '@features/welcome/WelcomeScreen';
import LoginScreen from '@features/auth/screens/LoginScreen';
import SignupScreen from '@features/auth/screens/SignupScreen';
import ForgotPasswordScreen from '@features/auth/screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

export default AuthStack;
