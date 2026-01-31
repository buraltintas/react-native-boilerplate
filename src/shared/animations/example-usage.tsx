/**
 * Example: Gestures & Animations
 * 
 * Comprehensive examples of all gesture and animation features
 */

import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {
  AnimatedButton,
  BottomSheet,
  SwipeableCard,
  ZoomableImage,
  LongPressButton,
} from '@shared/components';
import {
  useFadeAnimation,
  useScaleAnimation,
  useBounceAnimation,
} from '@shared/animations';
import Animated from 'react-native-reanimated';
import type GorhomBottomSheet from '@gorhom/bottom-sheet';

export default function GesturesExampleScreen() {
  const bottomSheetRef = useRef<GorhomBottomSheet>(null);
  const [showFade, setShowFade] = useState(true);
  const [showScale, setShowScale] = useState(true);
  const [bounceCount, setBounceCount] = useState(0);

  // Animation hooks
  const fadeStyle = useFadeAnimation(showFade);
  const scaleStyle = useScaleAnimation(showScale);
  const bounceStyle = useBounceAnimation(bounceCount);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gestures & Animations</Text>

      {/* Animated Button */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Animated Button</Text>
        <AnimatedButton
          style={styles.button}
          onPress={() => console.log('Pressed!')}>
          <Text style={styles.buttonText}>Press Me (Scales on touch)</Text>
        </AnimatedButton>
      </View>

      {/* Swipeable Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Swipeable Card</Text>
        <SwipeableCard
          onSwipeLeft={() => console.log('Deleted')}
          onSwipeRight={() => console.log('Archived')}
          leftActionText="Delete"
          rightActionText="Archive">
          <Text style={styles.cardText}>Swipe left or right</Text>
          <Text style={styles.cardSubtext}>
            Swipe right to archive, left to delete
          </Text>
        </SwipeableCard>
      </View>

      {/* Long Press Button */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Long Press</Text>
        <LongPressButton
          title="Hold to Confirm"
          onLongPress={() => console.log('Long pressed!')}
          duration={1000}
        />
      </View>

      {/* Bottom Sheet */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Bottom Sheet</Text>
        <AnimatedButton
          style={styles.button}
          onPress={() => bottomSheetRef.current?.expand()}>
          <Text style={styles.buttonText}>Open Bottom Sheet</Text>
        </AnimatedButton>
      </View>

      {/* Fade Animation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Fade Animation</Text>
        <AnimatedButton
          style={styles.button}
          onPress={() => setShowFade(!showFade)}>
          <Text style={styles.buttonText}>Toggle Fade</Text>
        </AnimatedButton>
        <Animated.View style={[styles.animatedBox, fadeStyle]}>
          <Text style={styles.animatedText}>Fading Box</Text>
        </Animated.View>
      </View>

      {/* Scale Animation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Scale Animation</Text>
        <AnimatedButton
          style={styles.button}
          onPress={() => setShowScale(!showScale)}>
          <Text style={styles.buttonText}>Toggle Scale</Text>
        </AnimatedButton>
        <Animated.View style={[styles.animatedBox, scaleStyle]}>
          <Text style={styles.animatedText}>Scaling Box</Text>
        </Animated.View>
      </View>

      {/* Bounce Animation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. Bounce Animation</Text>
        <AnimatedButton
          style={styles.button}
          onPress={() => setBounceCount(prev => prev + 1)}>
          <Text style={styles.buttonText}>Trigger Bounce</Text>
        </AnimatedButton>
        <Animated.View style={[styles.animatedBox, bounceStyle]}>
          <Text style={styles.animatedText}>Bouncing Box</Text>
        </Animated.View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.infoText}>
          ℹ️ All gestures use react-native-gesture-handler and
          react-native-reanimated for 60fps smooth animations
        </Text>
      </View>

      {/* Bottom Sheet */}
      <BottomSheet ref={bottomSheetRef} title="Example Bottom Sheet">
        <View style={styles.sheetContent}>
          <Text style={styles.sheetText}>This is a bottom sheet!</Text>
          <Text style={styles.sheetSubtext}>
            Drag down to close or tap outside
          </Text>
          <AnimatedButton
            style={[styles.button, {marginTop: 16}]}
            onPress={() => bottomSheetRef.current?.close()}>
            <Text style={styles.buttonText}>Close</Text>
          </AnimatedButton>
        </View>
      </BottomSheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#007AFF',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 14,
    color: '#666',
  },
  animatedBox: {
    width: '100%',
    height: 100,
    backgroundColor: '#34C759',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  animatedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#1976D2',
    textAlign: 'center',
  },
  sheetContent: {
    padding: 16,
  },
  sheetText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sheetSubtext: {
    fontSize: 14,
    color: '#666',
  },
});
