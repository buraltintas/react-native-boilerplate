# Gestures & Animations Guide

Bu döküman, gesture handler ve reanimated sistemini açıklar.

## 📦 Libraries

- **react-native-gesture-handler** - Native gesture system
- **react-native-reanimated** - 60fps animations on UI thread
- **@gorhom/bottom-sheet** - Production-ready bottom sheets

## 🎨 Animation Presets

### Spring Configs

```typescript
import {springConfigs} from '@shared/animations';

springConfigs.gentle   // Yumuşak, yavaş
springConfigs.normal   // Standart spring
springConfigs.snappy   // Hızlı, keskin
springConfigs.bouncy   // Zıplayan
```

### Timing Configs

```typescript
import {timingConfigs} from '@shared/animations';

timingConfigs.fast     // 150ms
timingConfigs.normal   // 250ms
timingConfigs.slow     // 350ms
timingConfigs.linear   // Linear easing
```

### Animation Presets

```typescript
import {animations} from '@shared/animations';

// Fade
animations.fadeIn(opacity);
animations.fadeOut(opacity);

// Scale
animations.scaleIn(scale);
animations.scaleOut(scale);

// Slide
animations.slideInRight(translateX, width);
animations.slideOutRight(translateX, width);

// Effects
animations.bounce(scale);
animations.shake(translateX);
animations.pulse(scale);
animations.rotate(rotation, 360);
```

## 🪝 Animation Hooks

### Fade Animation

```typescript
import {useFadeAnimation} from '@shared/animations';
import Animated from 'react-native-reanimated';

function MyComponent() {
  const [visible, setVisible] = useState(true);
  const fadeStyle = useFadeAnimation(visible);
  
  return (
    <Animated.View style={fadeStyle}>
      <Text>Fading content</Text>
    </Animated.View>
  );
}
```

### Scale Animation

```typescript
import {useScaleAnimation} from '@shared/animations';

function MyComponent() {
  const [active, setActive] = useState(false);
  const scaleStyle = useScaleAnimation(active);
  
  return (
    <Animated.View style={scaleStyle}>
      <Text>Scaling content</Text>
    </Animated.View>
  );
}
```

### Slide Animation

```typescript
import {useSlideAnimation} from '@shared/animations';

function MyComponent() {
  const [visible, setVisible] = useState(true);
  const slideStyle = useSlideAnimation(visible, 'right');
  
  return (
    <Animated.View style={slideStyle}>
      <Text>Sliding content</Text>
    </Animated.View>
  );
}
```

### Bounce Animation

```typescript
import {useBounceAnimation} from '@shared/animations';

function MyComponent() {
  const [trigger, setTrigger] = useState(0);
  const bounceStyle = useBounceAnimation(trigger);
  
  return (
    <Animated.View style={bounceStyle}>
      <Button
        title="Bounce"
        onPress={() => setTrigger(prev => prev + 1)}
      />
    </Animated.View>
  );
}
```

## 🎯 Components

### 1. Animated Button

```typescript
import {AnimatedButton} from '@shared/components';

<AnimatedButton
  onPress={() => console.log('Pressed')}
  scaleOnPress={true}
  pressScale={0.95}>
  <Text>Press Me</Text>
</AnimatedButton>
```

**Features:**
- ✅ Scale on press animation
- ✅ Customizable scale amount
- ✅ 60fps smooth
- ✅ Works like TouchableOpacity

### 2. Swipeable Card

```typescript
import {SwipeableCard} from '@shared/components';

<SwipeableCard
  onSwipeLeft={() => deleteItem()}
  onSwipeRight={() => archiveItem()}
  leftActionText="Delete"
  rightActionText="Archive"
  leftActionColor="#ff3b30"
  rightActionColor="#34C759">
  <View>
    <Text>Card Content</Text>
  </View>
</SwipeableCard>
```

**Features:**
- ✅ Swipe left/right actions
- ✅ Customizable actions
- ✅ Color customization
- ✅ Threshold customization

**Use Cases:**
- Delete item (swipe left)
- Archive/Mark as read (swipe right)
- Quick actions on list items

### 3. Bottom Sheet

```typescript
import {BottomSheet} from '@shared/components';
import {useRef} from 'react';

function MyScreen() {
  const bottomSheetRef = useRef(null);
  
  return (
    <>
      <Button
        title="Open"
        onPress={() => bottomSheetRef.current?.expand()}
      />
      
      <BottomSheet
        ref={bottomSheetRef}
        title="My Sheet"
        snapPoints={['25%', '50%', '90%']}>
        <View>
          <Text>Bottom sheet content</Text>
        </View>
      </BottomSheet>
    </>
  );
}
```

**Features:**
- ✅ Multiple snap points
- ✅ Drag to dismiss
- ✅ Backdrop
- ✅ Dynamic sizing
- ✅ Keyboard aware
- ✅ Works with ScrollView

**Methods:**
```typescript
bottomSheetRef.current?.expand();    // Open to first snap point
bottomSheetRef.current?.collapse();  // Close
bottomSheetRef.current?.close();     // Dismiss
bottomSheetRef.current?.snapToIndex(1); // Go to specific snap point
```

### 4. Zoomable Image

```typescript
import {ZoomableImage} from '@shared/components';

<ZoomableImage
  source={{uri: 'https://...'}}
  minScale={1}
  maxScale={4}
/>
```

**Gestures:**
- ✅ Pinch to zoom (1x - 4x)
- ✅ Pan when zoomed
- ✅ Double tap to zoom in/out
- ✅ Smooth animations

**Use Cases:**
- Image viewer
- Photo gallery
- Map viewer
- PDF viewer

### 5. Long Press Button

```typescript
import {LongPressButton} from '@shared/components';

<LongPressButton
  title="Hold to Delete"
  onLongPress={() => deleteItem()}
  duration={1000}
  disabled={false}
/>
```

**Features:**
- ✅ Visual progress bar
- ✅ Customizable duration
- ✅ Scale animation
- ✅ Disabled state

**Use Cases:**
- Destructive actions (delete, reset)
- Confirm actions
- Security-sensitive operations

## 🎬 Custom Animations

### Manual Reanimated

```typescript
import {useSharedValue, useAnimatedStyle, withSpring} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

function MyComponent() {
  const translateX = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));
  
  const handlePress = () => {
    translateX.value = withSpring(100);
  };
  
  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity onPress={handlePress}>
        <Text>Slide</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
```

### Custom Gesture

```typescript
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {useSharedValue, useAnimatedStyle} from 'react-native-reanimated';

function MyComponent() {
  const translateX = useSharedValue(0);
  
  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
    });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));
  
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        <Text>Drag me</Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

## 🎯 Gesture Types

### Pan (Drag)

```typescript
const panGesture = Gesture.Pan()
  .onUpdate(event => {
    translateX.value = event.translationX;
    translateY.value = event.translationY;
  })
  .onEnd(event => {
    // Reset or handle
  });
```

### Pinch (Zoom)

```typescript
const pinchGesture = Gesture.Pinch()
  .onUpdate(event => {
    scale.value = savedScale.value * event.scale;
  })
  .onEnd(() => {
    savedScale.value = scale.value;
  });
```

### Tap

```typescript
const tapGesture = Gesture.Tap()
  .onEnd(() => {
    console.log('Tapped!');
  });
```

### Double Tap

```typescript
const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .onEnd(() => {
    console.log('Double tapped!');
  });
```

### Long Press

```typescript
const longPress = Gesture.LongPress()
  .minDuration(1000)
  .onEnd(() => {
    console.log('Long pressed!');
  });
```

### Rotation

```typescript
const rotationGesture = Gesture.Rotation()
  .onUpdate(event => {
    rotation.value = event.rotation;
  });
```

## 🔄 Combining Gestures

### Simultaneous

```typescript
const composed = Gesture.Simultaneous(panGesture, pinchGesture);
```

### Sequential

```typescript
const sequential = Gesture.Exclusive(firstGesture, secondGesture);
```

## 💡 Best Practices

### 1. ✅ Use Worklets

```typescript
// ✅ Good - Runs on UI thread
const animatedStyle = useAnimatedStyle(() => {
  'worklet'; // Optional, auto-detected
  return {
    transform: [{translateX: translateX.value}],
  };
});

// ❌ Bad - Runs on JS thread
const style = {
  transform: [{translateX: translateX.value}], // Won't work!
};
```

### 2. ✅ Use runOnJS for Side Effects

```typescript
const panGesture = Gesture.Pan()
  .onEnd(event => {
    if (event.translationX > 100) {
      runOnJS(onSwipeRight)(); // ✅ Correct
    }
  });
```

### 3. ✅ Optimize Performance

```typescript
// ✅ Good - Shared value
const translateX = useSharedValue(0);

// ❌ Bad - State causes re-renders
const [translateX, setTranslateX] = useState(0);
```

### 4. ✅ Clean Up

```typescript
useEffect(() => {
  return () => {
    // Reset values on unmount
    translateX.value = 0;
  };
}, []);
```

## 📚 Examples

Comprehensive examples:
- `src/shared/animations/example-usage.tsx`

## 🔗 Resources

- [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [Gesture Handler Docs](https://docs.swmansion.com/react-native-gesture-handler/)
- [Bottom Sheet Docs](https://gorhom.github.io/react-native-bottom-sheet/)

---

**Özet:** 60fps smooth gestures & animations! 🎨
