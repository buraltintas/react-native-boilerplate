/**
 * Shared - Components - LongPressButton
 * 
 * Button with long press gesture
 */

import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {useTheme} from '@shared/theme';

interface LongPressButtonProps {
  onLongPress: () => void;
  title: string;
  duration?: number;
  disabled?: boolean;
}

export function LongPressButton({
  onLongPress,
  title,
  duration = 1000,
  disabled = false,
}: LongPressButtonProps) {
  const {colors} = useTheme();
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);

  const longPress = Gesture.LongPress()
    .minDuration(duration)
    .onStart(() => {
      if (!disabled) {
        scale.value = withSpring(0.95);
        progress.value = withTiming(1, {duration});
      }
    })
    .onEnd(() => {
      if (!disabled) {
        runOnJS(onLongPress)();
        scale.value = withSpring(1);
        progress.value = withTiming(0, {duration: 200});
      }
    })
    .onFinalize(() => {
      scale.value = withSpring(1);
      progress.value = withTiming(0, {duration: 200});
    });

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: disabled ? 0.5 : 1,
  }));

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <GestureDetector gesture={longPress}>
      <Animated.View style={[styles.container, animatedButtonStyle]}>
        <View
          style={[
            styles.button,
            {backgroundColor: colors.primary[500]},
            disabled && styles.disabled,
          ]}>
          <Animated.View
            style={[
              styles.progress,
              {backgroundColor: colors.primary[700]},
              animatedProgressStyle,
            ]}
          />
          <Text style={styles.title}>{title}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    zIndex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default LongPressButton;
