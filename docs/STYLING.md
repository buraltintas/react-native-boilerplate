# Theme & Styling System

Bu döküman, boilerplate'in styling ve theme sistemini açıklar.

## 🎨 Theme System

### Design Tokens

Tüm design değerleri `src/shared/theme/tokens.ts` dosyasında merkezi olarak tanımlanmıştır:

- **Colors**: Primary, secondary, grayscale, semantic colors
- **Spacing**: 8px grid system
- **Typography**: Font sizes, weights, line heights
- **Border Radius**: Corner radius values
- **Shadows**: iOS-style shadow definitions
- **Z-Index**: Layer management

### Theme Provider

```typescript
import {ThemeProvider, useTheme} from '@shared/theme';

// App.tsx'te
<ThemeProvider>
  <YourApp />
</ThemeProvider>

// Component içinde
function MyComponent() {
  const {colors, spacing, typography, isDark} = useTheme();
  
  return (
    <View style={{backgroundColor: colors.background.default}}>
      <Text style={{color: colors.text.primary}}>Hello</Text>
    </View>
  );
}
```

## 🎯 Kullanım Şekilleri

### 1. Theme Hook ile (Önerilen)

```typescript
import {useTheme} from '@shared/theme';

function MyComponent() {
  const {colors, spacing, typography, borderRadius, shadows} = useTheme();
  
  return (
    <View style={[
      {
        backgroundColor: colors.background.card,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
      },
      shadows.md
    ]}>
      <Text style={{
        color: colors.text.primary,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
      }}>
        Themed Component
      </Text>
    </View>
  );
}
```

### 2. Style Utils ile (Hızlı Geliştirme)

```typescript
import {styleUtils} from '@shared/theme';

function MyComponent() {
  return (
    <View style={[
      styleUtils.container.card,    // Pre-built card style
      styleUtils.spacing.mb2,        // Margin bottom
    ]}>
      <Text style={[
        styleUtils.text.lg,           // Large text
        styleUtils.text.bold,         // Bold weight
      ]}>
        Quick Styling
      </Text>
      
      <View style={[
        styleUtils.flex.rowBetween,   // Flex row with space-between
        styleUtils.spacing.mt1,       // Margin top
      ]}>
        <Text>Left</Text>
        <Text>Right</Text>
      </View>
    </View>
  );
}
```

### 3. Hybrid Approach (En Esnek)

```typescript
import {useTheme, styleUtils} from '@shared/theme';

function MyComponent() {
  const {colors} = useTheme();
  
  return (
    <View style={[
      styleUtils.container.card,
      {backgroundColor: colors.primary[50]}, // Custom color
    ]}>
      <Text style={[
        styleUtils.text.lg,
        {color: colors.primary[700]},
      ]}>
        Hybrid Styling
      </Text>
    </View>
  );
}
```

## 📐 Available Style Utils

### Flex Layouts

```typescript
styleUtils.flex.row              // flexDirection: 'row'
styleUtils.flex.rowCenter        // row + alignItems: center
styleUtils.flex.rowBetween       // row + space-between
styleUtils.flex.rowAround        // row + space-around
styleUtils.flex.column           // flexDirection: 'column'
styleUtils.flex.columnCenter     // column + center
styleUtils.flex.center           // center both axes
styleUtils.flex.flex1            // flex: 1
```

### Spacing

```typescript
// Padding
styleUtils.spacing.p0  // 4px
styleUtils.spacing.p1  // 8px
styleUtils.spacing.p2  // 16px
styleUtils.spacing.p3  // 24px
styleUtils.spacing.p4  // 32px

// Padding horizontal/vertical
styleUtils.spacing.px2  // paddingHorizontal: 16
styleUtils.spacing.py2  // paddingVertical: 16

// Margin
styleUtils.spacing.m2   // margin: 16
styleUtils.spacing.mt2  // marginTop: 16
styleUtils.spacing.mb2  // marginBottom: 16

// Gap
styleUtils.spacing.gap2 // gap: 16
```

### Typography

```typescript
// Sizes
styleUtils.text.xs     // 10px
styleUtils.text.sm     // 12px
styleUtils.text.base   // 14px
styleUtils.text.md     // 16px
styleUtils.text.lg     // 18px
styleUtils.text.xl     // 20px
styleUtils.text.xxl    // 24px

// Weights
styleUtils.text.regular   // 400
styleUtils.text.medium    // 500
styleUtils.text.semibold  // 600
styleUtils.text.bold      // 700

// Alignment
styleUtils.text.left
styleUtils.text.center
styleUtils.text.right
```

### Containers

```typescript
styleUtils.container.card          // Card with shadow
styleUtils.container.cardFlat      // Card without shadow
styleUtils.container.section       // Section container
styleUtils.container.screen        // Full screen
styleUtils.container.screenPadded  // Screen with padding
```

### Buttons

```typescript
styleUtils.button.primary   // Primary button
styleUtils.button.secondary // Secondary button
styleUtils.button.outline   // Outline button
styleUtils.button.text      // Text-only button
```

### Inputs

```typescript
styleUtils.input.base      // Base input
styleUtils.input.focused   // Focused state
styleUtils.input.error     // Error state
styleUtils.input.disabled  // Disabled state
```

## 🌈 Color System

### Primary Colors

```typescript
colors.primary[50]   // Lightest
colors.primary[100]
colors.primary[200]
colors.primary[300]
colors.primary[400]
colors.primary[500]  // Main primary color
colors.primary[600]
colors.primary[700]
colors.primary[800]
colors.primary[900]  // Darkest
```

### Semantic Colors

```typescript
colors.success.main  // #4CAF50
colors.warning.main  // #FF9800
colors.error.main    // #FF3B30
colors.info.main     // #2196F3
```

### Text Colors

```typescript
colors.text.primary    // Main text
colors.text.secondary  // Secondary text
colors.text.disabled   // Disabled text
colors.text.hint       // Hint/placeholder
```

### Background Colors

```typescript
colors.background.default  // Screen background
colors.background.paper    // Paper background
colors.background.card     // Card background
```

## 🌓 Dark Mode

Dark mode otomatik olarak desteklenir:

```typescript
// Theme Provider otomatik olarak detect eder
const {isDark, colors} = useTheme();

// Kullanıcı ayarlarına göre
const {theme, setTheme} = useUIStore();
setTheme('dark');    // Force dark
setTheme('light');   // Force light
setTheme('system');  // Follow system
```

## 📱 Responsive Design

```typescript
import {theme} from '@shared/theme';

const {breakpoints} = theme;

// Usage in styles
const isSmallScreen = Dimensions.get('window').width < breakpoints.sm;
```

## 🎨 Custom Theme Values

Kendi theme değerlerinizi eklemek için:

```typescript
// src/shared/theme/tokens.ts'yi düzenleyin
export const colors = {
  ...existingColors,
  brand: {
    primary: '#YOUR_COLOR',
    secondary: '#YOUR_COLOR',
  },
};
```

## 💡 Best Practices

### 1. ✅ DO: Use theme values

```typescript
// ✅ Good
<View style={{backgroundColor: colors.primary[500]}} />

// ❌ Bad
<View style={{backgroundColor: '#007AFF'}} />
```

### 2. ✅ DO: Use spacing scale

```typescript
// ✅ Good
<View style={{padding: spacing.md}} />

// ❌ Bad
<View style={{padding: 16}} />
```

### 3. ✅ DO: Use style utils for common patterns

```typescript
// ✅ Good
<View style={[styleUtils.flex.rowBetween, styleUtils.spacing.p2]} />

// ❌ Bad (but okay)
<View style={{
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 16,
}} />
```

### 4. ✅ DO: Combine styles efficiently

```typescript
// ✅ Good
<View style={[
  styleUtils.container.card,
  customStyles.myStyle,
  {backgroundColor: colors.primary[50]},
]} />
```

### 5. ✅ DO: Create reusable components

```typescript
// ✅ Good
function Card({children}: {children: React.ReactNode}) {
  const {colors, spacing, borderRadius, shadows} = useTheme();
  
  return (
    <View style={[
      {
        backgroundColor: colors.background.card,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
      },
      shadows.md,
    ]}>
      {children}
    </View>
  );
}
```

## 🔧 TypeScript Support

Tüm theme değerleri tam tip güvenli:

```typescript
import {Theme} from '@shared/theme';

// Theme type'ı otomatik inference
const {colors} = useTheme(); // colors is fully typed

// Custom style functions
function createStyles(colors: Theme['colors']) {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.primary[500], // Autocomplete works!
    },
  });
}
```

## 📚 Örnekler

Detaylı kullanım örnekleri için:
- `src/shared/theme/example-usage.tsx`
- `src/features/profile/screens/SettingsScreen.tsx`

---

**Özet:** Theme system merkezi, tip güvenli ve dark mode destekli! 🎨
