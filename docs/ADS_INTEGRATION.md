# Ads Integration Guide

Bu döküman, reklam (ads) entegrasyonunu açıklar.

## 🎯 Desteklenen Reklam Türleri

1. **Banner Ads** - Ekranın üst/alt kısmında sabit reklam
2. **Interstitial Ads** - Tam ekran reklam (seviye arası, vb.)
3. **Rewarded Ads** - İzle ve ödül kazan

## 🚀 Setup

### 1. Dependencies

```bash
npm install
```

AdMob entegrasyonu için `react-native-google-mobile-ads` zaten package.json'da.

### 2. AdMob App ID'leri

**Test ID'leri (Development):**
- iOS: `ca-app-pub-3940256099942544~1458002511`
- Android: `ca-app-pub-3940256099942544~3347511713`

**Production ID'leri:**

1. [AdMob Console](https://apps.admob.com/)'a giriş yapın
2. Uygulama oluşturun
3. App ID'leri alın
4. `app.json`'ı güncelleyin:

```json
{
  "expo": {
    "extra": {
      "enableAds": true,
      "admobAppId": {
        "ios": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY",
        "android": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
      }
    }
  }
}
```

### 3. Ad Unit ID'leri

`src/infra/ads/index.ts` dosyasında production ID'leri güncelleyin:

```typescript
export const AD_UNIT_IDS = {
  banner: __DEV__
    ? TestIds.BANNER
    : Platform.select({
        ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/BBBBBBBBBB', // Banner ID
        android: 'ca-app-pub-XXXXXXXXXXXXXXXX/BBBBBBBBBB',
      })!,
  interstitial: __DEV__
    ? TestIds.INTERSTITIAL
    : Platform.select({
        ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/IIIIIIIIII', // Interstitial ID
        android: 'ca-app-pub-XXXXXXXXXXXXXXXX/IIIIIIIIII',
      })!,
  rewarded: __DEV__
    ? TestIds.REWARDED
    : Platform.select({
        ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/RRRRRRRRRR', // Rewarded ID
        android: 'ca-app-pub-XXXXXXXXXXXXXXXX/RRRRRRRRRR',
      })!,
};
```

## 📱 Kullanım

### 1. Banner Ad (En Basit)

```typescript
import {AdBanner} from '@shared/components';
import {BannerAdSize} from 'react-native-google-mobile-ads';

function MyScreen() {
  return (
    <View>
      {/* Content */}
      
      {/* Banner at bottom */}
      <AdBanner size={BannerAdSize.BANNER} />
    </View>
  );
}
```

**Banner Sizes:**
```typescript
BannerAdSize.BANNER          // 320x50
BannerAdSize.LARGE_BANNER    // 320x100
BannerAdSize.MEDIUM_RECTANGLE // 300x250
BannerAdSize.FULL_BANNER     // 468x60
BannerAdSize.LEADERBOARD     // 728x90
```

### 2. Interstitial Ad (Tam Ekran)

```typescript
import {useInterstitialAd} from '@shared/hooks';

function GameScreen() {
  const {isReady, showAd} = useInterstitialAd();
  
  const handleLevelComplete = async () => {
    // Show ad between levels
    if (isReady) {
      await showAd();
    }
    
    // Continue to next level
    navigateToNextLevel();
  };
  
  return (
    <View>
      <Button title="Complete Level" onPress={handleLevelComplete} />
    </View>
  );
}
```

### 3. Rewarded Ad (Ödüllü)

```typescript
import {useRewardedAd} from '@shared/hooks';

function ShopScreen() {
  const {isReady, showAd} = useRewardedAd();
  const [coins, setCoins] = useState(100);
  
  const handleWatchAd = async () => {
    try {
      const reward = await showAd();
      
      if (reward) {
        // User completed watching
        const earnedCoins = reward.amount; // Usually 1
        setCoins(prev => prev + earnedCoins * 10); // Give 10 coins
        
        Alert.alert('Reward!', `You earned ${earnedCoins * 10} coins!`);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not show ad');
    }
  };
  
  return (
    <View>
      <Text>Coins: {coins}</Text>
      <Button 
        title={isReady ? "Watch Ad & Earn 10 Coins" : "Loading..."}
        onPress={handleWatchAd}
        disabled={!isReady}
      />
    </View>
  );
}
```

## ⚙️ Configuration

### Enable/Disable Ads

`app.json` dosyasında:

```json
{
  "extra": {
    "enableAds": true  // false to disable
  }
}
```

veya runtime'da:

```typescript
import config from '@infra/config';

if (config.features.ads) {
  // Show ads
} else {
  // Don't show ads
}
```

### Test vs Production

Otomatik olarak `__DEV__` flag'ine göre test/production ID'leri kullanılır:

- **Development**: Test ads (Google'ın test ID'leri)
- **Production**: Real ads (sizin ID'leriniz)

## 🎨 Best Practices

### 1. ✅ Banner'ları Doğru Yerde Kullanın

```typescript
// ✅ Good - Bottom of screen
<View style={{flex: 1}}>
  <ScrollView style={{flex: 1}}>
    {/* Content */}
  </ScrollView>
  <AdBanner />
</View>

// ❌ Bad - Middle of content (annoying)
<ScrollView>
  <Text>Content</Text>
  <AdBanner />
  <Text>More content</Text>
</ScrollView>
```

### 2. ✅ Interstitial'ı Doğru Zamanda Gösterin

```typescript
// ✅ Good - Natural breaks
- Level complete
- Game over
- Navigation between major screens

// ❌ Bad - Interrupting user
- During gameplay
- During form filling
- Too frequently (< 30 seconds apart)
```

### 3. ✅ Rewarded Ads için UI Feedback

```typescript
const {isReady, showAd} = useRewardedAd();

return (
  <TouchableOpacity 
    style={[
      styles.button,
      !isReady && styles.buttonDisabled
    ]}
    disabled={!isReady}
  >
    <Text>
      {isReady ? 'Watch Ad & Earn' : 'Loading Ad...'}
    </Text>
  </TouchableOpacity>
);
```

### 4. ✅ Error Handling

```typescript
try {
  const reward = await showAd();
  if (reward) {
    giveRewardToUser(reward.amount);
  } else {
    // User closed before completing
    Alert.alert('Notice', 'Watch the full ad to earn reward');
  }
} catch (error) {
  // Ad failed to load
  Alert.alert('Error', 'Ad not available, please try again');
}
```

## 🚫 Ad Frequency Limits

Kullanıcı deneyimi için limitler koyun:

```typescript
// Example: Max 1 interstitial per 60 seconds
let lastInterstitialTime = 0;

async function showInterstitialWithLimit() {
  const now = Date.now();
  const timeSinceLastAd = now - lastInterstitialTime;
  
  if (timeSinceLastAd < 60000) { // 60 seconds
    console.log('Too soon to show another ad');
    return false;
  }
  
  const shown = await showAd();
  if (shown) {
    lastInterstitialTime = now;
  }
  
  return shown;
}
```

## 📊 Ad Revenue Tracking

Analytics ile reklam gelirlerini takip edin:

```typescript
import {adsService} from '@infra/ads';
import analytics from '@infra/analytics';

// When showing ad
analytics.logEvent({
  name: 'ad_impression',
  params: {
    ad_type: 'interstitial',
    ad_unit: 'level_complete',
  },
});

// When user earns reward
analytics.logEvent({
  name: 'ad_reward_earned',
  params: {
    reward_type: 'coins',
    reward_amount: 10,
  },
});
```

## 🔧 Testing

### Development

```bash
# Test ads otomatik gösterilir
npm start
npm run android
npm run ios
```

### Production Testing

1. Build release APK/IPA
2. Install on device
3. Gerçek reklamları test edin

**ÖNEMLİ:** Test cihazlarınızı AdMob Console'da ekleyin:
- Settings → Test devices
- Test cihazlarda gerçek reklam gösterilir ama gelir sayılmaz

## 🌍 GDPR / Privacy

EU kullanıcıları için consent (izin) gerekir:

```typescript
import {AdsConsent} from 'react-native-google-mobile-ads';

// Check consent status
const consentInfo = await AdsConsent.requestInfoUpdate();

if (consentInfo.status === AdsConsentStatus.REQUIRED) {
  // Show consent form
  await AdsConsent.showForm();
}

// Then initialize ads
await adsService.initialize();
```

## 💰 Revenue Optimization

1. **Ad Placement**: En çok tıklanan yerler
   - Bottom banner: %2-3 CTR
   - Interstitial between levels: %5-8 CTR
   - Rewarded: %15-25 completion rate

2. **Mediation**: Birden fazla ad network kullanın
   - AdMob Mediation
   - Facebook Audience Network
   - Unity Ads
   - Vungle

3. **A/B Testing**: Farklı placements test edin

## 🐛 Troubleshooting

### Ads not showing?

```typescript
// Check config
console.log('Ads enabled:', config.features.ads);

// Check initialization
console.log('Ads initialized:', adsService.isEnabled());

// Check ad ready status
console.log('Interstitial ready:', adsService.isInterstitialReady());
```

### "Ad failed to load" error?

- Internet bağlantısını kontrol edin
- Ad ID'lerinin doğru olduğundan emin olun
- AdMob dashboard'da app'in aktif olduğunu kontrol edin
- Test cihaz ekleyin (production'da)

## 📚 Örnekler

Detaylı kullanım örneği:
- `src/infra/ads/example-usage.tsx`

---

**Özet:** Reklam altyapısı hazır, istediğiniz zaman `enableAds: true` yapıp kullanabilirsiniz! 💰
