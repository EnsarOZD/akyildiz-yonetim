# Demo Modu

## 🚀 Demo Modu Hakkında

Uygulama şu anda **Demo Modu**nda çalışıyor. Bu mod, backend API bağlantısı olmadan uygulamayı test etmenizi sağlar.

## 📋 Demo Modunda Çalışan Özellikler

- **Mock Authentication** - Demo kullanıcı girişi
- **Mock Data** - Örnek veriler ile test
- **UI/UX Testleri** - Arayüz testleri
- **Component Testleri** - Bileşen testleri

## 🔧 Gerçek Backend API Bağlantısı İçin

1. **Backend API URL'sini Ayarlayın:**
   - `.env.local` dosyasını oluşturun
   - Backend API URL'sini ekleyin

2. **Environment Variables:**
   ```env
   VITE_API_BASE_URL=https://www.akyildizyonetim.com/api
   ```

3. **Backend API Gereksinimleri:**
   - Authentication endpoints (`/auth/login`, `/auth/me`)
   - CRUD endpoints (tenants, expenses, payments, etc.)
   - JWT token authentication

4. **Backend API Test:**
   ```bash
   # Backend bağlantısını test et
   curl https://www.akyildizyonetim.com/api/health
   ```

## 🎯 Demo Modundan Çıkış

1. Backend API'nizi hazırlayın
2. `.env.local` dosyasında `VITE_API_BASE_URL`'yi ayarlayın
3. Uygulamayı yeniden başlatın: `npm run dev`

Artık gerçek backend API bağlantısı ile çalışacaktır.

## 🔍 Sorun Giderme

- **"API bağlantı hatası":** Backend API URL'sini kontrol edin
- **"Authentication hatası":** Backend auth endpoint'lerini kontrol edin
- **"CORS hatası":** Backend CORS ayarlarını kontrol edin 