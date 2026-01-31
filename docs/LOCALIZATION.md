# Localization & Language Management

Bu döküman, boilerplate'in çoklu dil desteğini açıklar.

## 🌍 Otomatik Dil Algılama

Uygulama ilk açılışta kullanıcının cihaz dilini otomatik algılar:

```typescript
import {detectDeviceLanguage} from '@shared/i18n';

// Cihaz dili Türkçe → 'tr'
// Cihaz dili İngilizce → 'en'
// Cihaz dili Fransızca (desteklenmiyor) → 'en' (default)
```

## 📋 Desteklenen Diller

```typescript
// src/shared/i18n/index.ts
export const SUPPORTED_LANGUAGES = ['en', 'tr'] as const;
export const DEFAULT_LANGUAGE = 'en';
```

### Yeni Dil Eklemek

1. **Dil dosyası oluşturun:**

```bash
# src/shared/i18n/locales/fr.json
cp src/shared/i18n/locales/en.json src/shared/i18n/locales/fr.json
```

2. **i18n config'e ekleyin:**

```typescript
// src/shared/i18n/index.ts
import fr from './locales/fr.json';

export const SUPPORTED_LANGUAGES = ['en', 'tr', 'fr'] as const;

const resources = {
  en: {translation: en},
  tr: {translation: tr},
  fr: {translation: fr}, // Yeni dil
};
```

## 🎯 Kullanım

### 1. Component İçinde

```typescript
import {useTranslation} from 'react-i18next';

function MyComponent() {
  const {t, i18n} = useTranslation();
  
  return (
    <View>
      <Text>{t('common.loading')}</Text>
      <Text>{t('auth.login')}</Text>
      <Text>{t('animals.title')}</Text>
    </View>
  );
}
```

### 2. Dil Değiştirme

```typescript
import {useUIStore} from '@shared/store';
import {useTranslation} from 'react-i18next';

function LanguageSwitcher() {
  const {i18n} = useTranslation();
  const {language, setLanguage} = useUIStore();
  
  const changeToTurkish = () => {
    setLanguage('tr');
    i18n.changeLanguage('tr');
  };
  
  const changeToEnglish = () => {
    setLanguage('en');
    i18n.changeLanguage('en');
  };
  
  return (
    <View>
      <Button title="English" onPress={changeToEnglish} />
      <Button title="Türkçe" onPress={changeToTurkish} />
    </View>
  );
}
```

### 3. Cihaz Diline Reset

```typescript
function ResetLanguage() {
  const {resetLanguageToDevice} = useUIStore();
  const {i18n} = useTranslation();
  
  const handleReset = () => {
    resetLanguageToDevice();
    const newLang = useUIStore.getState().language;
    i18n.changeLanguage(newLang);
  };
  
  return (
    <Button title="Reset to Device Language" onPress={handleReset} />
  );
}
```

## 📝 Translation Dosyaları

### Yapı

```json
{
  "namespace": {
    "key": "value",
    "nested": {
      "key": "nested value"
    }
  }
}
```

### Örnek: en.json

```json
{
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "save": "Save",
    "cancel": "Cancel"
  },
  "auth": {
    "login": "Login",
    "signup": "Sign Up",
    "email": "Email",
    "password": "Password"
  },
  "animals": {
    "title": "Animals",
    "detail": "Animal Details",
    "name": "Name",
    "species": "Species"
  }
}
```

### Örnek: tr.json

```json
{
  "common": {
    "loading": "Yükleniyor...",
    "error": "Bir hata oluştu",
    "save": "Kaydet",
    "cancel": "İptal"
  },
  "auth": {
    "login": "Giriş Yap",
    "signup": "Kayıt Ol",
    "email": "E-posta",
    "password": "Şifre"
  },
  "animals": {
    "title": "Hayvanlar",
    "detail": "Hayvan Detayları",
    "name": "İsim",
    "species": "Tür"
  }
}
```

## 🔄 Dil Akışı

### İlk Açılış

```
1. Uygulama başlar
   ↓
2. detectDeviceLanguage() çalışır
   ↓
3. Cihaz dili kontrol edilir
   ↓
4. Desteklenen dil mi?
   ├─ Evet → O dili kullan
   └─ Hayır → Default dili kullan (en)
   ↓
5. UIStore'a persist edilir
```

### Sonraki Açılışlar

```
1. Uygulama başlar
   ↓
2. UIStore'dan kaydedilmiş dil yüklenir
   ↓
3. i18n o dille initialize olur
```

### Kullanıcı Dil Değiştirir

```
1. Kullanıcı settings'ten dil seçer
   ↓
2. setLanguage() çağrılır
   ↓
3. UIStore güncellenir (persist edilir)
   ↓
4. i18n.changeLanguage() çalışır
   ↓
5. Tüm app yeniden render olur (yeni dil)
```

## 💡 Best Practices

### 1. ✅ Namespace Kullanın

```json
// ✅ Good
{
  "auth": {
    "login": "Login",
    "signup": "Sign Up"
  },
  "profile": {
    "edit": "Edit Profile"
  }
}

// ❌ Bad
{
  "login": "Login",
  "signup": "Sign Up",
  "editProfile": "Edit Profile"
}
```

### 2. ✅ Anlamlı Key'ler

```json
// ✅ Good
{
  "errors": {
    "invalidEmail": "Invalid email address",
    "passwordTooShort": "Password must be at least 6 characters"
  }
}

// ❌ Bad
{
  "err1": "Invalid email",
  "err2": "Password short"
}
```

### 3. ✅ Değişkenler (Interpolation)

```json
// en.json
{
  "welcome": "Welcome, {{name}}!",
  "itemsCount": "You have {{count}} items"
}
```

```typescript
// Component
<Text>{t('welcome', {name: 'John'})}</Text>
<Text>{t('itemsCount', {count: 5})}</Text>
```

### 4. ✅ Pluralization

```json
// en.json
{
  "items": "{{count}} item",
  "items_plural": "{{count}} items"
}
```

```typescript
<Text>{t('items', {count: 1})}</Text>  // "1 item"
<Text>{t('items', {count: 5})}</Text>  // "5 items"
```

## 🔍 Debug

### Mevcut Dili Görüntüle

```typescript
import {getCurrentLanguage} from '@shared/i18n';

console.log('Current language:', getCurrentLanguage());
```

### Tüm Translation'ları Görüntüle

```typescript
import {useTranslation} from 'react-i18next';

function Debug() {
  const {i18n} = useTranslation();
  
  console.log('Resources:', i18n.store.data);
  console.log('Current language:', i18n.language);
  console.log('Fallback language:', i18n.options.fallbackLng);
}
```

## 🌐 RTL Support (İsteğe Bağlı)

RTL (Right-to-Left) diller için (Arapça, İbranice):

```typescript
import {I18nManager} from 'react-native';

// Check if RTL
const isRTL = I18nManager.isRTL;

// Force RTL
I18nManager.forceRTL(true);

// In i18n config
i18n.init({
  // ...
  react: {
    useSuspense: false,
  },
  interpolation: {
    escapeValue: false,
  },
  // Add RTL languages
  supportedLngs: ['en', 'tr', 'ar'],
});
```

## 📊 Translation Coverage

Tüm dillerde aynı key'lerin olduğundan emin olun:

```bash
# Simple check script
node scripts/check-translations.js
```

```javascript
// scripts/check-translations.js
const en = require('../src/shared/i18n/locales/en.json');
const tr = require('../src/shared/i18n/locales/tr.json');

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      keys = keys.concat(getAllKeys(obj[key], prefix + key + '.'));
    } else {
      keys.push(prefix + key);
    }
  }
  return keys;
}

const enKeys = getAllKeys(en);
const trKeys = getAllKeys(tr);

const missingInTr = enKeys.filter(k => !trKeys.includes(k));
const missingInEn = trKeys.filter(k => !enKeys.includes(k));

if (missingInTr.length) {
  console.log('Missing in TR:', missingInTr);
}
if (missingInEn.length) {
  console.log('Missing in EN:', missingInEn);
}
```

---

**Özet:** Dil yönetimi otomatik, esnek ve tip güvenli! 🌍
