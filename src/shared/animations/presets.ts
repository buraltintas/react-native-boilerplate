/**
 * Shared - Animations - Presets
 * 
 * Reusable animation presets with react-native-reanimated
 */

import {
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  SharedValue,
} from 'react-native-reanimated';

/**
 * Spring Animation Configs
 */
export const springConfigs = {
  gentle: {
    damping: 20,
    stiffness: 90,
  },
  normal: {
    damping: 15,
    stiffness: 100,
  },
  snappy: {
    damping: 10,
    stiffness: 120,
  },
  bouncy: {
    damping: 8,
    stiffness: 100,
  },
} as const;

/**
 * Timing Animation Configs
 */
export const timingConfigs = {
  fast: {
    duration: 150,
    easing: Easing.inOut(Easing.ease),
  },
  normal: {
    duration: 250,
    easing: Easing.inOut(Easing.ease),
  },
  slow: {
    duration: 350,
    easing: Easing.inOut(Easing.ease),
  },
  linear: {
    duration: 250,
    easing: Easing.linear,
  },
} as const;

/**
 * Animation Presets
 */
export const animations = {
  /**
   * Fade in
   */
  fadeIn: (value: SharedValue<number>, config = springConfigs.normal) => {
    'worklet';
    value.value = withSpring(1, config);
  },

  /**
   * Fade out
   */
  fadeOut: (value: SharedValue<number>, config = springConfigs.normal) => {
    'worklet';
    value.value = withSpring(0, config);
  },

  /**
   * Scale in
   */
  scaleIn: (value: SharedValue<number>, config = springConfigs.snappy) => {
    'worklet';
    value.value = withSpring(1, config);
  },

  /**
   * Scale out
   */
  scaleOut: (value: SharedValue<number>, config = springConfigs.snappy) => {
    'worklet';
    value.value = withSpring(0, config);
  },

  /**
   * Slide in from right
   */
  slideInRight: (value: SharedValue<number>, width: number) => {
    'worklet';
    value.value = withSpring(0, springConfigs.normal);
  },

  /**
   * Slide out to right
   */
  slideOutRight: (value: SharedValue<number>, width: number) => {
    'worklet';
    value.value = withSpring(width, springConfigs.normal);
  },

  /**
   * Bounce
   */
  bounce: (value: SharedValue<number>) => {
    'worklet';
    value.value = withSequence(
      withTiming(0.8, {duration: 100}),
      withSpring(1, springConfigs.bouncy),
    );
  },

  /**
   * Shake
   */
  shake: (value: SharedValue<number>) => {
    'worklet';
    value.value = withSequence(
      withTiming(-10, {duration: 50}),
      withTiming(10, {duration: 50}),
      withTiming(-10, {duration: 50}),
      withTiming(10, {duration: 50}),
      withTiming(0, {duration: 50}),
    );
  },

  /**
   * Pulse
   */
  pulse: (value: SharedValue<number>) => {
    'worklet';
    value.value = withSequence(
      withTiming(1.1, timingConfigs.fast),
      withTiming(1, timingConfigs.fast),
    );
  },

  /**
   * Rotate
   */
  rotate: (value: SharedValue<number>, degrees: number = 360) => {
    'worklet';
    value.value = withTiming(degrees, timingConfigs.normal);
  },
};

/**
 * Layout Animation Presets
 */
export const layoutAnimations = {
  fadeIn: {
    duration: 250,
    easing: Easing.inOut(Easing.ease),
  },
  scaleIn: {
    duration: 250,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
  slideIn: {
    duration: 300,
    easing: Easing.out(Easing.exp),
  },
} as const;

export default animations;
