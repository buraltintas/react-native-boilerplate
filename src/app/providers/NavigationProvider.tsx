/**
 * App - Providers - Navigation Provider
 * 
 * React Navigation container with deep linking
 */

import React, {useEffect, useRef} from 'react';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import {linking} from '@navigation';
import analytics from '@infra/analytics';

interface Props {
  children: React.ReactNode;
}

export function NavigationProvider({children}: Props) {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const routeNameRef = useRef<string>();

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onReady={() => {
        const route = navigationRef.current?.getCurrentRoute();
        routeNameRef.current = route?.name;
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRoute = navigationRef.current?.getCurrentRoute();
        const currentRouteName = currentRoute?.name;

        if (previousRouteName !== currentRouteName && currentRouteName) {
          analytics.logScreenView(currentRouteName);
        }

        routeNameRef.current = currentRouteName;
      }}>
      {children}
    </NavigationContainer>
  );
}

export default NavigationProvider;
