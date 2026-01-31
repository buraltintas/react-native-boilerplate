# Node.js Version Guide

## Önerilen Versiyon

Bu proje için **Node.js 20 LTS** veya **Node.js 22 LTS** kullanmanız önerilir.

## Kurulum

### macOS (Homebrew ile)

```bash
# Node.js 20 LTS
brew install node@20

# Veya Node.js 22 LTS
brew install node@22
```

### nvm ile (Önerilen)

```bash
# nvm kur
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# Veya Node.js 22 LTS
nvm install 22
nvm use 22
nvm alias default 22
```

### Versiyon Kontrolü

```bash
node --version
# v20.x.x veya v22.x.x olmalı

npm --version
# v10.x.x+ olmalı
```

## Proje Setup

```bash
# 1. Doğru Node versiyonunu kullan
nvm use 20  # veya 22

# 2. Dependencies yükle
npm install

# 3. Expo başlat
npm start
```

## .nvmrc Dosyası

Proje kökünde `.nvmrc` dosyası oluşturabilirsiniz:

```bash
echo "20" > .nvmrc
# veya
echo "22" > .nvmrc
```

Sonra sadece:
```bash
nvm use
```

## Neden Node.js 20/22 LTS?

✅ **Expo SDK 52** ile tam uyumlu
✅ **React Native 0.76** ile test edilmiş
✅ **Long-term support** (güvenlik güncellemeleri)
✅ **En stabil paket uyumluluğu**
✅ **Production-ready**

## Node.js 24 Hakkında

⚠️ Node.js 24 henüz çok yeni veya unstable olabilir.
- Sadece eğer **stable release** ise kullanın
- Production için **LTS versiyonları tercih edin**
- Development için deneyebilirsiniz ama risklidir

## Sorun Giderme

### "Node version too old" hatası
```bash
nvm install 20  # veya 22
nvm use 20
```

### "npm version too old" hatası
```bash
npm install -g npm@latest
```

### Proje node_modules temizle
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## Önerilen Workflow

```bash
# Her proje açışında
nvm use  # .nvmrc varsa otomatik

# Veya manuel
nvm use 20
```

---

**Özet:** Node.js 20 LTS kullanın, en güvenli seçenek! 🚀
