# Architecture Documentation

Bu döküman, boilerplate'in mimari kararlarını ve yapısını açıklar.

## 📐 Mimari Prensipler

### 1. Clean Architecture (Temiz Mimari)

Proje katmanlara ayrılmıştır ve her katmanın sorumluluğu açıkça tanımlanmıştır:

```
Presentation Layer (UI)
    ↓
Domain Layer (Business Logic)
    ↓
Infrastructure Layer (External Dependencies)
```

### 2. Domain-Driven Design (DDD)

Her feature (alan) kendi içinde bağımsızdır:
- `features/auth/` - Kimlik doğrulama
- `features/animals/` - Hayvan yönetimi
- `features/profile/` - Profil yönetimi

Her feature şunları içerir:
- **screens/**: UI bileşenleri
- **hooks/**: React Query hooks (business logic)
- **types/**: Feature'a özel tipler

### 3. Separation of Concerns (SoC)

#### UI vs Business Logic
- **UI Components**: Sadece render ve user interaction
- **Business Logic**: Hooks içinde (useLogin, useAnimals, etc.)
- **API Calls**: Infra layer'da

#### Server State vs Client State
- **Server State** → React Query
  - Backend'den gelen veriler
  - Cache, invalidation, refetch
  - Örnekler: animals, user data, appointments
  
- **Client State** → Zustand
  - Uygulama içi state
  - Persisted preferences
  - Örnekler: auth status, theme, language

## 🗂 Folder Structure Explained

### `/src/app` - Uygulama Bootstrap
```
app/
├── providers/           # Provider wrapper'ları
│   ├── QueryProvider    # React Query setup
│   ├── NavigationProvider # Navigation container + deep linking
│   ├── I18nProvider     # i18n initialization
│   └── index.tsx        # Combined providers
└── App.tsx              # Root component
```

**Sorumluluk:**
- App initialization
- Provider composition
- Splash screen management

### `/src/navigation` - Navigasyon Yönetimi
```
navigation/
├── types.ts             # Type-safe param lists
├── RootNavigator.tsx    # Auth switching
├── AuthStack.tsx        # Login, Signup, etc.
├── AppTabs.tsx          # Main tabs
├── AnimalsStack.tsx     # Feature-specific stack
├── ProfileStack.tsx     # Profile stack
└── linking.ts           # Deep linking config
```

**Sorumluluk:**
- Screen navigation
- Auth state routing
- Deep link handling
- Type safety

**Önemli:**
- `RootNavigator` auth durumuna göre stack'leri switch eder
- Her feature kendi nested stack'ine sahip olabilir
- Param lists TypeScript ile tam tip güvenli

### `/src/features` - Business Domains

Her feature modülü şu yapıya sahiptir:

```
features/[domain]/
├── screens/             # UI components
├── hooks/               # React Query hooks
├── types/               # Local types
└── index.ts             # Public API
```

**Örnek: Animals Feature**
```
features/animals/
├── screens/
│   ├── AnimalsListScreen.tsx
│   └── AnimalDetailScreen.tsx
├── hooks/
│   └── useAnimals.ts    # useAnimals, useAnimal, useCreateAnimal
└── index.ts
```

**Sorumluluk:**
- Domain-specific UI
- Business logic (React Query hooks)
- Feature exports

**Kurallar:**
- ❌ API calls doğrudan component içinde
- ✅ API calls hook içinde
- ❌ Business logic component içinde
- ✅ Business logic hook içinde

### `/src/shared` - Paylaşılan Kaynaklar

```
shared/
├── store/               # Zustand stores
│   ├── auth.store.ts    # Auth client state
│   ├── ui.store.ts      # UI preferences
│   └── persistence.ts   # Versioned storage
├── query/
│   ├── client.ts        # QueryClient setup
│   └── keys.ts          # Query key factory
├── i18n/
│   ├── index.ts
│   └── locales/         # en.json, tr.json
└── hooks/               # Shared custom hooks
```

**Sorumluluk:**
- Cross-feature state
- React Query configuration
- Translations
- Reusable hooks

### `/src/infra` - Altyapı Katmanı

```
infra/
├── api/
│   ├── client.ts        # Axios + interceptors
│   ├── auth.api.ts      # Auth endpoints
│   └── animals.api.ts   # Animals endpoints
├── storage/
│   ├── index.ts         # AsyncStorage / MMKV
│   └── secure.ts        # SecureStore
├── config/              # App configuration
├── analytics/           # Analytics abstraction
└── crash-reporter/      # Crash reporting
```

**Sorumluluk:**
- External API communication
- Storage abstraction
- Third-party service integration
- Configuration management

**API Client Features:**
- ✅ Auto auth header injection
- ✅ Refresh token flow
- ✅ Error normalization
- ✅ Request cancelation
- ✅ Typed responses

### `/src/native` - Native Feature Abstractions

```
native/
├── permissions/         # Permission handling
├── camera/              # Camera service
└── qr-scanner/          # QR scanning
```

**Sorumluluk:**
- Native API abstractions
- Permission management
- Camera/QR functionality

**Neden?**
- UI components native API'leri doğrudan kullanmaz
- Platform-specific logic izole edilir
- Gelecekte bare workflow'a geçiş kolaylaşır

## 🔄 Data Flow

### Server State Flow (React Query)

```
UI Component
    ↓ (calls hook)
React Query Hook (useAnimals)
    ↓ (calls API)
API Module (animalsApi.getAll)
    ↓ (HTTP request)
API Client (axios + interceptors)
    ↓
Backend
```

**Örnek:**
```typescript
// 1. Component
function AnimalsList() {
  const {data, isLoading} = useAnimals();
  return <List data={data} />;
}

// 2. Hook
function useAnimals() {
  return useQuery({
    queryKey: ['animals'],
    queryFn: () => animalsApi.getAll(),
  });
}

// 3. API Module
export const animalsApi = {
  getAll: () => apiClient.get('/animals'),
};

// 4. API Client
// Auto handles auth, errors, retries
```

### Client State Flow (Zustand)

```
UI Component
    ↓ (reads/updates)
Zustand Store
    ↓ (persists)
Storage Layer (AsyncStorage / SecureStore)
```

**Örnek:**
```typescript
// 1. Component
function Settings() {
  const {theme, setTheme} = useUIStore();
  return <Switch value={theme} onChange={setTheme} />;
}

// 2. Store
export const useUIStore = create(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({theme}),
    }),
    {
      name: 'ui-storage',
      storage: createVersionedStorage({...}),
    }
  )
);
```

## 🔐 Auth Flow

### Login Flow

```
1. User submits credentials
    ↓
2. LoginScreen calls useLogin().mutate()
    ↓
3. useLogin hook calls authApi.login()
    ↓
4. API returns { accessToken, refreshToken, user }
    ↓
5. Hook calls useAuthStore.setAuth()
    ↓
6. Store saves:
   - user → AsyncStorage (persisted)
   - accessToken → SecureStore + memory
   - refreshToken → SecureStore
    ↓
7. RootNavigator detects isAuthenticated=true
    ↓
8. Navigation switches to App stack
```

### Token Refresh Flow

```
1. API request returns 401
    ↓
2. Interceptor catches error
    ↓
3. Calls /auth/refresh with refreshToken
    ↓
4. Backend returns new tokens
    ↓
5. Saves new tokens
    ↓
6. Retries original request
    ↓
7. If refresh fails → logout
```

**Implementation:** `src/infra/api/client.ts`

### Logout Flow

```
1. User clicks logout
    ↓
2. useLogout().mutate()
    ↓
3. Calls authApi.logout() (optional backend call)
    ↓
4. Calls useAuthStore.clearAuth()
    ↓
5. Clears tokens from SecureStore
    ↓
6. Clears persisted auth state
    ↓
7. React Query clears all caches
    ↓
8. RootNavigator switches to AuthStack
```

## 🛣 Navigation Architecture

### Stack Hierarchy

```
RootNavigator (checks auth)
├── AuthStack (if !authenticated)
│   ├── Login
│   ├── Signup
│   └── ForgotPassword
└── App (if authenticated)
    ├── AppTabs
    │   ├── HomeTab (AnimalsStack)
    │   │   ├── AnimalsList
    │   │   └── AnimalDetail
    │   └── ProfileTab (ProfileStack)
    │       ├── ProfileMain
    │       ├── EditProfile
    │       └── Settings
    └── Modals (optional)
        └── AnimalDetailModal
```

### Type Safety

```typescript
// Define param lists
type AnimalsStackParamList = {
  AnimalsList: undefined;
  AnimalDetail: {id: string};
};

// Use in component
type Props = NativeStackScreenProps<AnimalsStackParamList, 'AnimalDetail'>;

function AnimalDetailScreen({route}: Props) {
  const {id} = route.params; // ✅ Typed
}
```

## 💾 Storage Strategy

### 3 Storage Types

1. **In-Memory** (access token)
   - En hızlı
   - App restart'ta kaybolur
   - API client içinde tutuluyor

2. **AsyncStorage / MMKV** (non-sensitive data)
   - Auth state (user info, isAuthenticated)
   - UI preferences (theme, language)
   - Cached data

3. **SecureStore** (sensitive data)
   - Access token (backup)
   - Refresh token
   - API keys

### Persistence with Migrations

```typescript
createVersionedStorage({
  version: 2,
  migrations: {
    // v1 → v2 migration
    2: (oldState) => ({
      ...oldState,
      newField: 'default',
    }),
  },
});
```

**Neden?**
- State shape değişirse eski data migrate edilir
- App update'lerinde veri kaybı olmaz

## 🌐 Deep Linking

### Configuration

**Android:** `app.json` + `AndroidManifest.xml`
```json
{
  "intentFilters": [
    {
      "action": "VIEW",
      "data": [{"scheme": "myapp"}]
    }
  ]
}
```

**iOS:** `app.json`
```json
{
  "scheme": "myapp",
  "associatedDomains": ["applinks:myapp.com"]
}
```

### Linking Config

```typescript
// src/navigation/linking.ts
export const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      App: {
        screens: {
          HomeTab: {
            screens: {
              AnimalDetail: 'animals/:id',
            },
          },
        },
      },
    },
  },
};
```

### URL → Screen Mapping

- `myapp://animals/123` → AnimalDetail screen with id=123
- `https://myapp.com/profile` → ProfileMain screen

## 🚀 Best Practices

### 1. Feature Independence
- Her feature kendi klasöründe
- Cross-feature imports minimize
- Feature içindeki değişiklik başka feature'ı etkilemez

### 2. API Separation
- Her domain için ayrı API module
- `authApi`, `animalsApi`, `usersApi`
- Kolayca mock'lanabilir

### 3. Error Handling
- API errors → `ApiError` class
- React Query otomatik retry
- Crash reporter'a otomatik gönderim

### 4. Type Safety
- No `any` types
- Navigation params typed
- API responses typed
- Store state typed

### 5. Testing Strategy
- Unit tests → Hooks (business logic)
- Integration tests → API calls
- E2E tests → Navigation flows

## 🔄 State Management Decision Tree

**"Bu state nerede tutulmalı?"**

```
Is it from the backend?
├─ YES → React Query
│   └─ queryKey'i doğru define et
└─ NO → Is it UI-only?
    ├─ YES → Zustand (client state)
    │   └─ Persist gerekli mi?
    │       ├─ YES → persist middleware ekle
    │       └─ NO → Normal store
    └─ Is it component-local?
        └─ YES → useState / useReducer
```

## 📊 Performance Considerations

### 1. React Query Caching
- staleTime: 5 minutes
- cacheTime: 10 minutes
- Background refetch enabled

### 2. Storage Performance
- MMKV (optional): AsyncStorage'dan 10x hızlı
- SecureStore: Sadece sensitive data için

### 3. Navigation
- Lazy loading screens (optional)
- Memoize heavy components

## 🎯 Extension Points

Projeyi genişletmek için:

### 1. Yeni Feature Ekle
```bash
mkdir -p src/features/appointments
# screens, hooks, types ekle
```

### 2. Yeni API Module Ekle
```typescript
// src/infra/api/appointments.api.ts
export const appointmentsApi = { ... };
```

### 3. Yeni Native Feature Ekle
```typescript
// src/native/notifications/index.ts
export const notificationService = { ... };
```

### 4. Yeni Store Slice Ekle
```typescript
// src/shared/store/settings.store.ts
export const useSettingsStore = create(...);
```

## 🔒 Security Checklist

- ✅ Tokens secure storage'da
- ✅ HTTPS only (production)
- ✅ No sensitive data in AsyncStorage
- ✅ Auto token refresh
- ✅ Logout clears all data
- ✅ Crash reporter anonymizes data

---

**Sorular için:** Bu boilerplate production-ready bir başlangıç noktasıdır. İhtiyacınıza göre customize edin.
