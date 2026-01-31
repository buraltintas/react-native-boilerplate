# Enterprise Features Documentation

Bu döküman, boilerplate'in enterprise-level özelliklerini açıklar.

## 🚀 Feature Flags & Remote Config

### Nedir?

Feature flag'ler, uygulamanın özelliklerini yayından kaldırmadan açıp/kapatmanıza olanak sağlar.

### Kullanım

```typescript
import {useFeatureFlag} from '@shared/hooks';

function MyFeature() {
  const isEnabled = useFeatureFlag('ENABLE_DARK_MODE');
  
  if (!isEnabled) {
    return null; // Feature disabled
  }
  
  return <DarkModeToggle />;
}
```

### Available Flags

```typescript
FEATURE_FLAGS = {
  ENABLE_ADS,
  ENABLE_ANALYTICS,
  ENABLE_CRASH_REPORTING,
  ENABLE_DARK_MODE,
  ENABLE_PUSH_NOTIFICATIONS,
  ENABLE_BIOMETRIC_AUTH,
  SHOW_DEBUG_INFO,
}
```

### Remote Config Setup

```typescript
// In bootstrap
await featureFlagsService.initialize('https://api.example.com/config');

// Backend response format:
{
  "flags": {
    "enable_ads": true,
    "enable_dark_mode": true
  },
  "version": 1,
  "updatedAt": "2024-01-15T14:30:00Z"
}
```

## 🎬 App Bootstrap Orchestration

### Bootstrap Sequence

1. **Storage Hydration** - Restore persisted state
2. **Feature Flags** - Load remote config
3. **Security Check** - Jailbreak detection
4. **Auth Restore** - Check if user logged in
5. **Locale Resolution** - Set app language
6. **Network Check** - Check connectivity
7. **Version Check** - Check for force update
8. **Permissions** - Precheck permissions
9. **Ads Initialize** - Setup AdMob
10. **Analytics** - Setup tracking

### Bootstrap State

```typescript
interface BootstrapState {
  step: BootstrapStep;
  progress: number; // 0-100
  error?: Error;
  versionInfo?: VersionInfo;
  isJailbroken?: boolean;
}
```

### Custom Bootstrap

```typescript
import {bootstrapController} from '@app/bootstrap';

// Subscribe to state
bootstrapController.subscribe(state => {
  console.log('Bootstrap:', state.step, state.progress);
});

// Start bootstrap
await bootstrapController.bootstrap();
```

## 🛡 Error Handling & Crash Safety

### Error Boundary

```typescript
import {ErrorBoundary} from '@shared/components';

// Wrap your app
<ErrorBoundary>
  <YourApp />
</ErrorBoundary>

// Custom fallback
<ErrorBoundary
  fallback={(error, resetError) => (
    <CustomErrorScreen error={error} onRetry={resetError} />
  )}>
  <YourApp />
</ErrorBoundary>
```

### Error Types

1. **Network Errors** - API failures
2. **Application Errors** - Business logic errors
3. **Fatal Crashes** - Unhandled exceptions

### Error Reporting

```typescript
import crashReporter from '@infra/crash-reporter';

try {
  // Something risky
} catch (error) {
  crashReporter.captureException(error, {
    context: 'Payment Processing',
    userId: user.id,
  });
}
```

## 📶 Network & Offline Strategy

### Network State Hook

```typescript
import {useNetworkState} from '@infra/network';

function MyComponent() {
  const {isConnected, type} = useNetworkState();
  
  return (
    <View>
      <Text>Status: {isConnected ? 'Online' : 'Offline'}</Text>
      <Text>Type: {type}</Text> {/* wifi, cellular, etc. */}
    </View>
  );
}
```

### Offline UI

```typescript
import {OfflineBanner} from '@shared/components';

// Shows banner when offline
<OfflineBanner />
```

### Offline-First Strategy

```typescript
// React Query automatically handles caching
const {data, isLoading, error} = useQuery({
  queryKey: ['animals'],
  queryFn: fetchAnimals,
  // Data from cache shown when offline
  staleTime: 5 * 60 * 1000,
});
```

## 🔄 Versioning & Force Update

### Version Check

```typescript
import {appVersionService} from '@infra/version';

// Get current version
const version = appVersionService.getCurrentVersion(); // "1.0.0"

// Check with backend
const versionInfo = await appVersionService.checkVersion();
// {
//   currentVersion: "1.0.0",
//   minimumVersion: "1.0.0",
//   latestVersion: "1.2.0",
//   forceUpdate: false,
// }
```

### Force Update Screen

Automatically shown if `forceUpdate: true`:

```typescript
// Backend response
{
  "currentVersion": "1.0.0",
  "minimumVersion": "1.2.0",
  "latestVersion": "1.2.0",
  "forceUpdate": true,
  "updateUrl": "https://apps.apple.com/app/..."
}
```

### Backend API

```typescript
// POST /version/check
{
  "version": "1.0.0",
  "platform": "iOS"
}

// Response
{
  "forceUpdate": true,
  "minimumVersion": "1.2.0"
}
```

## 🔐 Security & Privacy

### Secure Storage

```typescript
import {securityService} from '@infra/security';

// Store securely (uses Keychain)
await securityService.securelyStore('auth_token', token);

// Retrieve
const token = await securityService.securelyRetrieve('auth_token');

// Delete
await securityService.securelyDelete('auth_token');
```

### Jailbreak Detection

```typescript
const isJailbroken = await securityService.isJailbroken();

if (isJailbroken) {
  Alert.alert('Security Warning', 'This device appears to be jailbroken');
}
```

### App Backgrounding

```typescript
import {securityService} from '@infra/security';

// Listen to app state changes
securityService.onAppStateChange(status => {
  if (status === 'background') {
    // Blur sensitive screens
    // Lock app if needed
  }
});
```

## 🔍 Observability Abstractions

### Analytics

```typescript
import analytics from '@infra/analytics';

// Track events
analytics.logEvent({
  name: 'purchase_completed',
  params: {
    product_id: '123',
    price: 9.99,
    currency: 'USD',
  },
});

// Set user
analytics.setUserId(user.id);

// Set properties
analytics.setUserProperty('subscription_tier', 'premium');

// Screen tracking
analytics.logScreenView('Product Details');
```

### Crash Reporting

```typescript
import crashReporter from '@infra/crash-reporter';

// Capture exception
crashReporter.captureException(error, {
  context: 'User Action',
  userId: user.id,
});

// Capture message
crashReporter.captureMessage('Something unexpected', 'warning');

// Set user context
crashReporter.setUser({
  id: user.id,
  email: user.email,
  name: user.name,
});

// Add breadcrumb
crashReporter.addBreadcrumb({
  message: 'User clicked button',
  category: 'user_action',
  level: 'info',
  data: {button: 'submit'},
});
```

### Logging

```typescript
// Console logs in development
// Can be replaced with remote logging service

console.log('[MyComponent] User action');
console.warn('[API] Slow response');
console.error('[Auth] Login failed');
```

## ♿ Accessibility

### Font Scaling

Automatically respected:

```typescript
// Use fontSize from theme
<Text style={{fontSize: typography.fontSize.md}}>
  This text respects user's font size preference
</Text>
```

### Screen Readers

```typescript
// Add accessibility labels
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Submit form"
  accessibilityHint="Double tap to submit your information"
  accessibilityRole="button">
  <Text>Submit</Text>
</TouchableOpacity>
```

### Touch Targets

All buttons meet minimum size (44x44 on iOS, 48x48 on Android):

```typescript
// From theme
const styles = StyleSheet.create({
  button: {
    minHeight: 44, // iOS minimum
    paddingHorizontal: 16,
  },
});
```

## 📁 Folder Structure

```
src/
├── app/
│   ├── bootstrap/         # Bootstrap orchestration
│   ├── providers/         # App providers
│   └── App.tsx            # Root with error boundary
│
├── infra/
│   ├── feature-flags/     # Feature flag system
│   ├── network/           # Network state
│   ├── version/           # Version checking
│   ├── security/          # Security utilities
│   ├── api/               # API client
│   ├── storage/           # Storage layer
│   ├── analytics/         # Analytics abstraction
│   └── crash-reporter/    # Crash reporting
│
└── shared/
    ├── components/
    │   ├── ErrorBoundary      # Error boundary
    │   ├── ForceUpdateScreen  # Force update UI
    │   ├── OfflineBanner      # Offline indicator
    │   └── BootstrapScreen    # Bootstrap loading
    └── hooks/
        └── useFeatureFlag     # Feature flag hook
```

## 🎯 Best Practices

### 1. Feature Flags

- ✅ Always provide safe defaults
- ✅ Use for gradual rollouts
- ✅ Kill switch for problematic features
- ❌ Don't use for A/B testing (use dedicated tool)

### 2. Bootstrap

- ✅ Keep bootstrap fast (< 2 seconds)
- ✅ Show progress feedback
- ✅ Handle errors gracefully
- ❌ Don't block on non-critical tasks

### 3. Error Handling

- ✅ Catch errors early
- ✅ Provide retry mechanisms
- ✅ Log errors for debugging
- ❌ Don't show technical errors to users

### 4. Offline

- ✅ Show offline indicator
- ✅ Cache data aggressively
- ✅ Queue actions for when online
- ❌ Don't hide offline state

### 5. Security

- ✅ Use secure storage for tokens
- ✅ Detect jailbreak/root
- ✅ Blur sensitive screens
- ❌ Don't store secrets in code

---

**Özet:** Enterprise-ready boilerplate with production-grade features! 🚀
