/**
 * Shared - Components - SwipeableCard
 * 
 * Swipeable card with left/right actions
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {useTheme} from '@shared/theme';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftActionColor?: string;
  rightActionColor?: string;
  leftActionText?: string;
  rightActionText?: string;
  swipeThreshold?: number;
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftActionColor = '#ff3b30',
  rightActionColor = '#34C759',
  leftActionText = 'Delete',
  rightActionText = 'Archive',
  swipeThreshold = 100,
}: SwipeableCardProps) {
  const {colors} = useTheme();
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      translateX.value = event.translationX;
    })
    .onEnd(event => {
      if (event.translationX > swipeThreshold && onSwipeRight) {
        runOnJS(onSwipeRight)();
      } else if (event.translationX < -swipeThreshold && onSwipeLeft) {
        runOnJS(onSwipeLeft)();
      }
      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  const leftActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > 0 ? 1 : 0,
  }));

  const rightActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < 0 ? 1 : 0,
  }));

  return (
    <View style={styles.container}>
      {/* Left action */}
      <Animated.View
        style={[
          styles.action,
          styles.leftAction,
          {backgroundColor: rightActionColor},
          leftActionStyle,
        ]}>
        <Text style={styles.actionText}>{rightActionText}</Text>
      </Animated.View>

      {/* Right action */}
      <Animated.View
        style={[
          styles.action,
          styles.rightAction,
          {backgroundColor: leftActionColor},
          rightActionStyle,
        ]}>
        <Text style={styles.actionText}>{leftActionText}</Text>
      </Animated.View>

      {/* Card content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.card,
            {backgroundColor: colors.background.card},
            animatedStyle,
          ]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  action: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  leftAction: {
    left: 0,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  rightAction: {
    right: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default SwipeableCard;
