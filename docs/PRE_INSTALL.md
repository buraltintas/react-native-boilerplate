# Pre-Installation Instructions

Uygulamayı çalıştırmadan önce bu adımları takip edin:

## 1. npm Cache Temizleme (Önemli!)

Eğer npm hata veriyorsa:

```bash
# macOS/Linux
sudo chown -R $(whoami) ~/.npm
npm cache clean --force

# Veya tamamen temizle
rm -rf ~/.npm
rm -rf node_modules
```

## 2. Dependencies Yükleme

```bash
cd /Users/burakaltintas/Documents/react-native-boilerplate
npm install
```

## 3. Type Check

```bash
npm run type-check
```

## 4. Uygulamayı Başlat

```bash
npm start
```

---

## Sorun Giderme

### npm EPERM hatası:
```bash
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
rm -rf node_modules
npm install
```

### TypeScript hatası:
```bash
npm run type-check
```

### Metro bundler hatası:
```bash
npx expo start -c
```

---

**Önemli:** İlk `npm install` network access gerektirir ve terminalde çalıştırılmalıdır.
