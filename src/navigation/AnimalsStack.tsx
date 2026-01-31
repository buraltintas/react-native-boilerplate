/**
 * Navigation - Animals Stack
 * 
 * Animals feature nested stack (list + detail)
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AnimalsStackParamList} from './types';

// Screens
import AnimalsListScreen from '@features/animals/screens/AnimalsListScreen';
import AnimalDetailScreen from '@features/animals/screens/AnimalDetailScreen';

const Stack = createNativeStackNavigator<AnimalsStackParamList>();

export function AnimalsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="AnimalsList"
        component={AnimalsListScreen}
        options={{title: 'Animals'}}
      />
      <Stack.Screen
        name="AnimalDetail"
        component={AnimalDetailScreen}
        options={{title: 'Animal Details'}}
      />
    </Stack.Navigator>
  );
}

export default AnimalsStack;
