# GitHub Güvenlik Hazırlığı - Görev Listesi

## 🚨 Kritik Güvenlik Düzeltmeleri

### Adım 1: .gitignore Güçlendirmesi
- [ ] `.gitignore` dosyasını aç
- [ ] Firebase service account pattern'lerini ekle
- [ ] Environment file pattern'lerini güçlendir
- [ ] Değişiklikleri kaydet

### Adım 2: Hassas Dosyaların Kaldırılması
- [ ] `c:\Users\Mutlu\Desktop\Kocluk_Web\koachy-web-firebase-adminsdk-fbsvc-0a17bc8452.json` dosyasını SİL
- [ ] `c:\Users\Mutlu\Desktop\Kocluk_Web\koachy-web\firebase-service-account.json` dosyasını SİL
- [ ] Dosyaların gerçekten silindiğini doğrula

### Adım 3: Dokümantasyon Temizliği
- [ ] `FIREBASE_KURULUM_REHBERI.md` dosyasını aç
- [ ] Satır 49'daki gerçek API key'i placeholder ile değiştir
- [ ] Dosyada başka hassas bilgi olup olmadığını kontrol et
- [ ] Değişiklikleri kaydet

### Adım 4: Git History Kontrolü
- [ ] Terminal'de git log kontrolü yap
- [ ] Hassas dosyaların history'de olup olmadığını kontrol et
- [ ] Gerekirse git history temizliği planla

## 📝 README ve Dokümantasyon Güncellemeleri

### README.md Güncellemeleri
- [ ] `your-username` placeholder'larını gerçek GitHub username ile değiştir
- [ ] Repository URL'lerini güncelle
- [ ] İletişim bilgilerini ekle
- [ ] (Opsiyonel) Ekran görüntüleri ekle
- [ ] (Opsiyonel) Demo video linki ekle

### Diğer Dokümantasyon
- [ ] Tüm .md dosyalarında hassas bilgi kontrolü yap
- [ ] Placeholder'ların doğru kullanıldığından emin ol

## 🔍 Pre-Push Validation

### Git Status Kontrolü
- [ ] `git status` komutunu çalıştır
- [ ] `firebase-service-account.json` görünmüyor ✓
- [ ] `*-adminsdk-*.json` görünmüyor ✓
- [ ] `.env.local` görünmüyor ✓

### Hassas Veri Taraması
- [ ] Gerçek API key'i ara (grep)
- [ ] Private key'leri ara (grep)
- [ ] Tüm hassas verilerin temizlendiğini doğrula

### Git Dry-Run
- [ ] `git push --dry-run` yap
- [ ] Beklenmedik dosya yok mu kontrol et

## 🎯 GitHub Repository Oluşturma

### Repository Ayarları
- [ ] GitHub'da yeni repository oluştur
- [ ] İsim: `koachy-web` veya `koachy-online-coaching-platform`
- [ ] Description yaz (İngilizce, detaylı)
- [ ] Public/Private seç (portfolyo için Public önerilir)
- [ ] README.md ekleme (yerel README'miz var)
- [ ] .gitignore ekleme (yerel .gitignore'miz var)
- [ ] License seç (MIT önerilir)

### Topics (Etiketler) Ekleme
- [ ] `nextjs`
- [ ] `react`
- [ ] `typescript`
- [ ] `firebase`
- [ ] `coaching`
- [ ] `education`
- [ ] `real-time-messaging`
- [ ] `stripe-integration`
- [ ] `tailwindcss`
- [ ] `full-stack`

## 📤 Git Push Süreci

### Local Git Hazırlığı
- [ ] Tüm değişiklikleri stage'e al (`git add .`)
- [ ] Anlamlı commit mesajı yaz
- [ ] Son kontrol: `git status`

### Remote Ekleme ve Push
- [ ] Remote URL'i ekle (`git remote add origin ...`)
- [ ] Push yap (`git push -u origin main` veya `master`)
- [ ] GitHub'da repository'yi kontrol et

### Post-Push Validation
- [ ] GitHub'da Code tab'ı aç
- [ ] Search: `firebase-service-account` → 0 sonuç olmalı
- [ ] Search: `BEGIN PRIVATE KEY` → 0 sonuç olmalı
- [ ] Search: `.env.local` → 0 sonuç olmalı
- [ ] Dosya yapısını kontrol et

## 🚀 Deployment (Opsiyonel)

### Vercel Deployment
- [ ] Vercel hesabı aç (GitHub ile giriş)
- [ ] Repository'yi import et
- [ ] Environment variables ekle
  - [ ] Firebase credentials
  - [ ] Stripe keys
  - [ ] NextAuth secret
- [ ] İlk deploy'u başlat
- [ ] Production URL'i al

### README Güncelle
- [ ] Live demo linkini README'ye ekle
- [ ] Deployment badge'i ekle (opsiyonel)
- [ ] Değişiklikleri commit ve push et

## 🎨 Profesyonel Portfolyo İyileştirmeleri

### Görsellik
- [ ] Ana sayfa ekran görüntüsü çek
- [ ] Dashboard ekran görüntüsü çek
- [ ] Mesajlaşma özelliği ekran görüntüsü çek
- [ ] Screenshots/ klasörü oluştur
- [ ] README'de carousel veya tablo ile göster

### Dokümantasyon
- [ ] CONTRIBUTING.md oluştur (opsiyonel)
- [ ] LICENSE dosyası ekle
- [ ] CHANGELOG.md başlat (opsiyonel)

### GitHub Özellikleri
- [ ] About bölümünü düzenle
- [ ] Website linkini ekle (Vercel URL)
- [ ] Topics ekle
- [ ] Description güncelle

### GitHub Project Board (Opsiyonel)
- [ ] Yeni project oluştur
- [ ] Kolonlar ekle (Backlog, In Progress, Done)
- [ ] Gelecek özellikleri ekle
- [ ] Tamamlanan özellikleri işaretle

## ✅ Final Checklist

### Güvenlik
- [x] Firebase service account dosyaları silindi
- [x] .gitignore güncellendi
- [x] Dokümantasyon temizlendi
- [x] Git history kontrol edildi
- [x] Hassas veri taraması yapıldı

### Repository
- [ ] GitHub repository oluşturuldu
- [ ] README.md güncel ve profesyonel
- [ ] .gitignore tam ve doğru
- [ ] License eklendi
- [ ] Topics/etiketler eklendi

### Deployment
- [ ] Vercel'e deploy edildi
- [ ] Environment variables ayarlandı
- [ ] Live demo çalışıyor
- [ ] README'de link var

### Portfolyo
- [ ] Ekran görüntüleri eklendi
- [ ] Açıklama detaylı ve anlaşılır
- [ ] Teknik stack vurgulanmış
- [ ] Projenin değeri belirtilmiş

---

## 📌 Notlar

### Repositories vs Packages vs Projects Özeti

**Bu proje için: REPOSITORIES ✅**

- ❌ Packages: npm paketi değil, son kullanıcı uygulaması
- ❌ Projects: Proje yönetim aracı, kod deposu değil
- ✅ Repositories: Kaynak kod deposu - portfolyo için ideal

### Kritik Hatırlatmalar

> **ASLA GitHub'a yüklenmeyecekler:**
> - Firebase Admin SDK private keys
> - .env.local dosyası
> - Gerçek API secrets
> - Database credentials
> - Stripe SECRET keys

> **GitHub'a yüklenebilir:**
> - Public Firebase API keys (security rules ile korunmuş)
> - .env.example (placeholder'lar ile)
> - Kaynak kod
> - Dokümantasyon
> - Test dosyaları

### Yardımcı Komutlar

```bash
# Git status
git status

# Hassas veri ara
git grep -i "AIzaSyDupLUj9Qh165KClQQKxQgySOH_vElAIBY"
git grep -i "BEGIN PRIVATE KEY"

# Dry-run push
git push --dry-run origin main

# Git history kontrol
git log --all --full-history --oneline -- firebase-service-account.json
```
