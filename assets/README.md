# Assets

Bu klasöre aşağıdaki dosyaları eklemeniz gerekiyor:

## Icon (App İkonu)
- **Dosya adı:** `icon.png`
- **Boyut:** 1024x1024 px
- **Format:** PNG (şeffaf arka plan)
- **Açıklama:** Uygulamanın ana ikonu

## Splash Screen
- **Dosya adı:** `splash.png`  
- **Boyut:** 1284x2778 px (iPhone 13 Pro Max)
- **Format:** PNG
- **Açıklama:** Uygulama ilk açıldığında gösterilen ekran

## Favicon (Web için)
- **Dosya adı:** `favicon.png`
- **Boyut:** 48x48 px
- **Format:** PNG
- **Açıklama:** Web versiyonu için favicon

---

## Hızlı Oluşturma

Eğer henüz tasarımınız yoksa, geçici olarak şu araçları kullanabilirsiniz:

1. **Icon & Splash Generator:**
   - https://www.appicon.co/
   - https://apetools.webprofusion.com/tools/imagegorilla

2. **Figma Template:**
   - Expo'nun resmi icon/splash template'i

3. **Online Araçlar:**
   - https://icon.kitchen/ (hızlı icon oluşturma)

---

## Notlar

- Expo, bu dosyaları otomatik olarak tüm platformlar için optimize eder
- iOS için `icon.png`'yi farklı boyutlara dönüştürür
- Android için adaptive icon oluşturur
- Splash screen'i her platform için uygun formata çevirir

**Önemli:** Bu dosyaları ekledikten sonra `npx expo prebuild` çalıştırmanız gerekebilir (production build için).
