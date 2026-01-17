# 🎓 Koachy / KoçumYanımda

Üniversite ve lise sınavlarına hazırlanan öğrencilere birebir online koçluk sunan, uzman koçlarıyla eşleştirme sağlayan, gelişimlerini takip edebilecekleri modern web platformu.

> **[🇬🇧 Click for English README](README.md)**

## ✨ Özellikler

- 🎯 **Öğrenci-Koç Eşleştirme**: Branş, tecrübe ve puana göre filtreleme
- 📅 **Akıllı Randevu Sistemi**: Çakışma önleme algoritması
- 💬 **Gerçek Zamanlı Mesajlaşma**: Firebase Realtime Database
- 📚 **Ders Notları ve Raporlar**: PDF/Video paylaşımı ve gelişim takibi
- 💳 **Güvenli Ödeme**: Stripe ve Iyzico entegrasyonu
- 🎨 **Dinamik CMS**: Admin panelinden ana sayfa yönetimi
- 🔐 **Enterprise-level Güvenlik**: XSS, Injection koruması, RBAC

## 📸 Ekran Görüntüleri

Platformun canlı çalışan özelliklerinden ekran görüntüleri:

````carousel
![Ana Sayfa - Hero Bölümü: Modern ve çekici tasarım ile öğrencileri karşılayan ana banner. "Başarıya Birlikte Ulaşalım" mesajı ve 150+ uzman koç, 500+ öğrenci, %95 başarı oranı istatistikleri görüntüleniyor.](images/02-hero-section.png)

<!-- slide -->

![Platform Özellikleri: Uzman koçlar, kişisel planlama ve gelişim takibi gibi temel özelliklerin modern kartlarla sunumu.](images/03-features.png)

<!-- slide -->

![Fiyatlandırma ve Popüler Koçlar: Başlangıç (1.500₺), Pro (2.500₺) ve Elite (4.000₺) paketleri ile popüler koçların profil kartları.](images/04-pricing.png)

<!-- slide -->

![Koçlar Listesi: Gelişmiş filtreleme sistemi (uzmanlık alanı, saatlik ücret, minimum puan) ile koç arama sayfası. Her koç için detaylı bilgi kartları.](images/05-coaches-listing.png)

<!-- slide -->

![Koç Profil Detayı: Ayşe Arslan'ın profili - 8 yıl deneyim, 4.9 puan, 203 değerlendirme. Randevu alma sistemi ve müsaitlik takvimi görüntüleniyor.](images/06-coach-profile.png)

<!-- slide -->

![Giriş Sayfası: Email/şifre girişi ve Google ile oturum açma seçenekleri. "Beni Hatırla" ve "Şifremi Unuttum" özellikleri mevcut.](images/07-login.png)

<!-- slide -->

![Kayıt Sayfası: Öğrenci veya Koç olarak kayıt formu. Ad soyad, email, telefon, şifre alanları ve kullanım koşulları onayı.](images/08-register.png)

<!-- slide -->

![Ana Sayfa - Tam Görünüm: Platformun tüm bölümlerini içeren kapsamlı ana sayfa görünümü.](images/01-homepage.png)
````

> [!NOTE]
> Yukarıdaki ekran görüntüleri **canlı çalışan** platformdan alınmıştır. Tüm özellikler aktif ve fonksiyoneldir.

## 🛠️ Teknoloji Stack

- **Frontend**: Next.js 14+ (App Router), React 18+, TypeScript
- **Styling**: Tailwind CSS, Custom Design System
- **Backend**: Firebase (Auth, Firestore, Functions, Storage)
- **Payment**: Stripe API
- **Testing**: Playwright (E2E), Vitest (Unit)
- **Deployment**: Vercel

## 🚀 Kurulum

### Gereksinimler

- Node.js >= 18.0.0
- npm >= 9.0.0
- Firebase hesabı
- Stripe hesabı (Test/Production)

### Adımlar

1. **Repository'yi klonlayın**
   ```bash
   git clone https://github.com/your-username/koachy-web.git
   cd koachy-web
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Environment variables ayarlayın**
   ```bash
   cp .env.example .env.local
   ```
   
   `.env.local` dosyasını açarak gerekli API anahtarlarını girin:
   - Firebase credentials
   - Stripe keys
   - NextAuth secret

4. **Development server'ı başlatın**
   ```bash
   npm run dev
   ```
   
   Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 📁 Proje Yapısı

```
koachy-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth sayfaları
│   │   ├── (dashboard)/       # Dashboard sayfaları
│   │   └── (public)/          # Public sayfalar
│   ├── features/              # Feature modules
│   │   ├── auth/
│   │   ├── coaches/
│   │   ├── appointments/
│   │   ├── messaging/
│   │   ├── payments/
│   │   └── cms/
│   ├── components/            # Shared components
│   │   ├── ui/
│   │   └── layout/
│   ├── lib/                   # Utilities
│   │   ├── firebase/
│   │   ├── validations/
│   │   └── security/
│   ├── hooks/                 # Custom hooks
│   └── types/                 # TypeScript types
├── firebase/                  # Firebase config
├── tests/                     # Test files
├── test_kanitlari/           # Test evidence
└── docs/                      # Documentation
```

## 🧪 Test

```bash
# E2E testleri çalıştır
npm run test:e2e

# Unit testleri çalıştır
npm run test:unit

# Tüm testleri çalıştır
npm test
```

## 🏗️ Build

```bash
# Production build
npm run build

# Production preview
npm start
```

## 🎨 Tasarım Sistemi

### Renk Paleti

- **Primary**: `#4F46E5` (Mor/Indigo)
- **Background**: `#F9FAFB` (Açık Gri)
- **Accent**: `#10B981` (Yeşil)

### Font Ailesi

- **Sans**: Inter, Poppins
- **Display**: Poppins, Inter

## 🔐 Güvenlik

- ✅ Input Validation (Zod)
- ✅ XSS Protection
- ✅ SQL/NoSQL Injection Prevention
- ✅ CSRF Protection
- ✅ Rate Limiting
- ✅ RBAC (Role-Based Access Control)
- ✅ Firebase Security Rules
- ✅ Audit Logging

## 📝 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run format       # Prettier
npm run test         # Run tests
npm run test:e2e     # E2E tests
npm run test:unit    # Unit tests
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## �‍💻 Yazar

**Nurettin Mutlu Tüver**

- LinkedIn: [linkedin.com/in/nurettin-mutlu-tüver](https://www.linkedin.com/in/nurettin-mutlu-tüver)
- GitHub: [@MUTLU234](https://github.com/MUTLU234)

## 📞 İletişim

Sorularınız veya işbirliği teklifleri için LinkedIn veya GitHub üzerinden benimle iletişime geçebilirsiniz.

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

## 🌟 Öne Çıkan Özellikler

- **Full-stack Uygulama**: Modern web teknolojileri ile geliştirildi
- **Gerçek Zamanlı Özellikler**: Canlı mesajlaşma ve bildirimler
- **Production-ready**: Kapsamlı test ve güvenlik önlemleri
- **Ölçeklenebilir Mimari**: Modüler tasarım ve temiz kod yapısı
- **Profesyonel UI/UX**: Modern tasarım ve mükemmel kullanıcı deneyimi
