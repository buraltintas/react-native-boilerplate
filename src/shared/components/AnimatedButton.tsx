/**
 * Shared - Components - AnimatedButton
 * 
 * Button with press animation
 */

import React from 'react';
import {TouchableOpacity, TouchableOpacityProps, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {springConfigs} from '@shared/animations';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface AnimatedButtonProps extends TouchableOpacityProps {
  scaleOnPress?: boolean;
  pressScale?: number;
}

export function AnimatedButton({
  children,
  onPressIn,
  onPressOut,
  scaleOnPress = true,
  pressScale = 0.95,
  style,
  ...props
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePressIn: TouchableOpacityProps['onPressIn'] = e => {
    if (scaleOnPress) {
      scale.value = withSpring(pressScale, springConfigs.snappy);
    }
    onPressIn?.(e);
  };

  const handlePressOut: TouchableOpacityProps['onPressOut'] = e => {
    if (scaleOnPress) {
      scale.value = withSpring(1, springConfigs.snappy);
    }
    onPressOut?.(e);
  };

  return (
    <AnimatedTouchable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
      {...props}>
      {children}
    </AnimatedTouchable>
  );
}

export default AnimatedButton;
