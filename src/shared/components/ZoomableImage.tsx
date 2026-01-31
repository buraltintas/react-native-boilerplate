/**
 * Shared - Components - ZoomableImage
 * 
 * Pinch-to-zoom image viewer
 */

import React from 'react';
import {StyleSheet, Dimensions, Image, ImageProps} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

interface ZoomableImageProps extends Omit<ImageProps, 'style'> {
  minScale?: number;
  maxScale?: number;
}

export function ZoomableImage({
  source,
  minScale = 1,
  maxScale = 4,
  ...props
}: ZoomableImageProps) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Pinch gesture
  const pinchGesture = Gesture.Pinch()
    .onUpdate(event => {
      scale.value = Math.max(
        minScale,
        Math.min(maxScale, savedScale.value * event.scale),
      );
    })
    .onEnd(() => {
      savedScale.value = scale.value;

      // Reset if zoomed out too much
      if (scale.value < minScale + 0.1) {
        scale.value = withSpring(minScale);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedScale.value = minScale;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      }
    });

  // Pan gesture (only when zoomed)
  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      if (scale.value > minScale) {
        translateX.value = savedTranslateX.value + event.translationX;
        translateY.value = savedTranslateY.value + event.translationY;
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // Double tap to zoom
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > minScale) {
        // Zoom out
        scale.value = withTiming(minScale);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedScale.value = minScale;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        // Zoom in to 2x
        scale.value = withTiming(2);
        savedScale.value = 2;
      }
    });

  // Combine gestures
  const composed = Gesture.Simultaneous(
    doubleTap,
    Gesture.Simultaneous(pinchGesture, panGesture),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value},
      {scale: scale.value},
    ],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Image source={source} style={styles.image} resizeMode="contain" {...props} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});

export default ZoomableImage;
