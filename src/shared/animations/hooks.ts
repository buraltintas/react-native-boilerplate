/**
 * Shared - Animations - Hooks
 * 
 * Reusable animation hooks
 */

import {useEffect} from 'react';
import {useSharedValue, useAnimatedStyle, withSpring, withTiming} from 'react-native-reanimated';
import {springConfigs, timingConfigs} from './presets';

/**
 * Fade animation hook
 */
export function useFadeAnimation(visible: boolean) {
  const opacity = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    opacity.value = withSpring(visible ? 1 : 0, springConfigs.normal);
  }, [visible, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return animatedStyle;
}

/**
 * Scale animation hook
 */
export function useScaleAnimation(active: boolean) {
  const scale = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(active ? 1 : 0, springConfigs.snappy);
  }, [active, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return animatedStyle;
}

/**
 * Slide animation hook
 */
export function useSlideAnimation(visible: boolean, direction: 'left' | 'right' | 'up' | 'down' = 'right') {
  const translateX = useSharedValue(visible ? 0 : 100);
  const translateY = useSharedValue(visible ? 0 : 100);

  useEffect(() => {
    if (direction === 'left' || direction === 'right') {
      translateX.value = withSpring(visible ? 0 : (direction === 'right' ? 100 : -100), springConfigs.normal);
    } else {
      translateY.value = withSpring(visible ? 0 : (direction === 'down' ? 100 : -100), springConfigs.normal);
    }
  }, [visible, direction, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    if (direction === 'left' || direction === 'right') {
      return {
        transform: [{translateX: translateX.value}],
      };
    }
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  return animatedStyle;
}

/**
 * Rotate animation hook
 */
export function useRotateAnimation(active: boolean) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(active ? 360 : 0, timingConfigs.normal);
  }, [active, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  return animatedStyle;
}

/**
 * Bounce animation hook
 */
export function useBounceAnimation(trigger: number) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (trigger > 0) {
      scale.value = withSpring(0.9, springConfigs.bouncy);
      setTimeout(() => {
        scale.value = withSpring(1, springConfigs.bouncy);
      }, 100);
    }
  }, [trigger, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return animatedStyle;
}

export default {
  useFadeAnimation,
  useScaleAnimation,
  useSlideAnimation,
  useRotateAnimation,
  useBounceAnimation,
};
