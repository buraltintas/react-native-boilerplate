# React Native Boilerplate 🚀

Production-ready React Native boilerplate with TypeScript, modern architecture, and enterprise features.

[![React Native](https://img.shields.io/badge/React%20Native-0.76-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2052-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ Features

### Core Stack
- ⚡️ **React Native 0.76** - Latest stable
- 📦 **Expo SDK 52** - Managed workflow with Dev Client support
- 🔷 **TypeScript** - Full type safety
- 🧭 **React Navigation v7** - Type-safe navigation
- 🔄 **React Query v5** - Server state management
- 🐻 **Zustand** - Client state management
- 🎨 **Custom Styling System** - Design tokens + theme support

### Architecture
- 🏗️ **Clean Architecture** - Domain-driven design
- 📁 **Layered Structure** - Clear separation of concerns
- 🔌 **Plugin Architecture** - Easy to extend
- 🧩 **Feature-based** - Modular organization

### Enterprise Features
- 🚀 **App Bootstrap** - Centralized initialization
- 🎚️ **Feature Flags** - Remote configuration
- 🌐 **Network Awareness** - Offline/online handling
- 📱 **Version Management** - Force update support
- 🔒 **Security** - Secure storage, jailbreak detection
- 🌍 **i18n** - Multi-language support
- 📊 **Analytics Ready** - Abstracted for easy integration
- 💥 **Crash Reporting** - Error boundary with Sentry pattern

### Advanced Features
- 🔔 **Push Notifications** - Full Expo Notifications integration
- 🔌 **WebSocket/Socket.IO** - Real-time communication
- 🎭 **Gestures & Animations** - Reanimated + Gesture Handler
- 📲 **Deep Linking** - iOS & Android universal links
- 🎯 **Native Modules** - Abstracted (Camera, QR, Permissions)
- 📢 **Ad Integration** - AdMob ready (optional)

## 🚀 Quick Start

### Prerequisites

```bash
node >= 20.0.0
npm >= 10.0.0
```

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd react-native-boilerplate

# Install dependencies
npm install

# Start Expo development server
npm start
```

### Running on Device

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Physical device - scan QR code with Expo Go
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Application entry & bootstrap
│   ├── App.tsx            # Main app component
│   ├── bootstrap/         # App initialization logic
│   └── providers/         # App-wide providers
├── features/              # Feature modules
│   ├── auth/             # Authentication
│   ├── animals/          # Example feature
│   └── profile/          # User profile
├── navigation/            # Navigation configuration
├── shared/               # Shared resources
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Zustand stores
│   ├── theme/           # Design system
│   └── i18n/            # Translations
├── infra/                # Infrastructure layer
│   ├── api/             # API client
│   ├── storage/         # Storage abstraction
│   ├── notifications/   # Push notifications
│   ├── socket/          # WebSocket client
│   └── ...              # Other infra modules
└── native/               # Native module abstractions
    ├── camera/
    ├── permissions/
    └── qr-scanner/
```

## 🛠️ Configuration

### Environment Variables

Edit `app.json` to configure:

```json
{
  "extra": {
    "apiBaseUrl": "https://api.example.com",
    "enableAnalytics": false,
    "enableCrashReporting": false,
    "enableVersionCheck": false
  }
}
```

### Feature Toggles

All optional features are **disabled by default** and can be enabled in config:

- ✅ Version Check
- ✅ Analytics
- ✅ Crash Reporting
- ✅ Advertisements
- ✅ Socket.IO

## 📱 Development

### Expo Go vs Dev Build

**Expo Go** (Recommended for development):
- ✅ Quick start
- ✅ No build required
- ⚠️ Some native modules unavailable (ads, device-info, keychain)

**Dev Build** (For full native features):
```bash
npx expo prebuild
npx expo run:ios
npx expo run:android
```

### Code Quality

```bash
# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Formatting
npm run format
```

## 🎨 Assets

Add your app assets to the `assets/` folder:

- `icon.png` - 1024x1024px (app icon)
- `splash.png` - 1284x2778px (splash screen)

See `assets/README.md` for details.

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

- [Architecture Guide](docs/ARCHITECTURE.md)
- [Styling System](docs/STYLING.md)
- [Localization](docs/LOCALIZATION.md)
- [Push Notifications](docs/PUSH_NOTIFICATIONS.md)
- [WebSocket/Socket.IO](docs/REALTIME_SOCKET.md)
- [Gestures & Animations](docs/GESTURES_ANIMATIONS.md)
- [Ad Integration](docs/ADS_INTEGRATION.md)
- [Enterprise Features](docs/ENTERPRISE_FEATURES.md)

## 🔧 Tech Stack Details

| Category | Technology |
|----------|-----------|
| **Framework** | React Native 0.76 |
| **Platform** | Expo SDK 52 |
| **Language** | TypeScript 5.6 |
| **Navigation** | React Navigation 7 |
| **State (Server)** | TanStack Query 5 |
| **State (Client)** | Zustand 5 |
| **Styling** | Custom Design System |
| **Animations** | React Native Reanimated 3 |
| **Gestures** | React Native Gesture Handler 2 |
| **i18n** | i18next + react-i18next |
| **Date/Time** | date-fns + date-fns-tz |

## 🎯 Best Practices

✅ **Clean Architecture** - Clear separation of concerns  
✅ **Type Safety** - Full TypeScript coverage  
✅ **Lazy Loading** - Native modules loaded on demand  
✅ **Error Handling** - Global error boundary  
✅ **Offline First** - Network-aware operations  
✅ **Secure Storage** - Encrypted token storage  
✅ **Performance** - Optimized re-renders  

## 🚢 Production Build

### EAS Build (Recommended)

```bash
# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Local Build

```bash
# Prebuild native projects
npx expo prebuild

# Build iOS
cd ios && pod install
npx expo run:ios --configuration Release

# Build Android
npx expo run:android --variant release
```

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

## 📧 Support

For questions and support, please open an issue.

---

**Built with ❤️ for production-ready React Native apps**
