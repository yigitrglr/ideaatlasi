# İdea Atlası

Filozofların hayatlarını, eserlerini ve düşüncelerini interaktif harita üzerinden keşfetmenizi sağlayan modern bir web platformu.

## 🌟 Özellikler

### 🗺️ Harita ve Görselleştirme
- **İnteraktif Harita**: OpenStreetMap ve Leaflet kullanılarak oluşturulmuş tam ekran harita
- **Marker Cluster**: Çok sayıda filozof için otomatik gruplandırma
- **Dönem Bazlı Renkler**: Her felsefi dönem için özel renk kodları
- **Dark Mode**: Karanlık tema desteği (harita da otomatik karanlık olur)
- **Responsive Tasarım**: Mobil, tablet ve masaüstü uyumlu

### 🔍 Gelişmiş Arama ve Filtreleme
- **Tam Metin Arama**: Filozof isimleri, eserler, fikirler ve biyografilerde arama
- **Fuzzy Search**: Kısmi eşleşmeler için akıllı arama
- **Arama Geçmişi**: Son 10 arama kaydedilir ve hızlı erişim sağlar
- **Otomatik Tamamlama**: Anlık öneriler (filozof, şehir, okul)
- **Gelişmiş Filtreler**:
  - Dönem filtresi (Antik Yunan, Rönesans, Modern Felsefe, vb.)
  - Okul/Akım filtresi
  - Şehir filtresi
  - Zaman aralığı slider'ı (MÖ/MS)

### 📚 Filozof Detayları
- **Detaylı Profiller**: 43 filozof hakkında kapsamlı bilgiler
- **Biyografiler**: Her filozofun hayat hikayesi
- **Eserler**: Önemli eserler ve açıklamaları
- **Temel Fikirler**: Her filozofun öne çıkan düşünceleri
- **Felsefi Etkileşimler**: Etkilendiği ve etkilediği düşünürler
- **Wikipedia Görselleri**: Her filozof için gerçek görseller

### ⭐ Kullanıcı Özellikleri
- **Favoriler**: Beğendiğiniz filozofları yıldızlayarak kaydedin
- **Son Görüntülenenler**: Son 5 görüntülediğiniz filozof
- **Klavye Kısayolları**:
  - `Ctrl/Cmd + K`: Arama panelini aç/kapat
  - `Ctrl/Cmd + M`: Menüyü aç/kapat
  - `ESC`: Açık panelleri kapat

### 📊 Dashboard ve İstatistikler
- **Toplam Filozof Sayısı**: 43 filozof
- **Dönem Dağılımı**: Görsel grafiklerle dönem bazlı dağılım
- **Okul/Akım İstatistikleri**: En popüler felsefi okullar
- **Coğrafi Dağılım**: En çok filozof bulunan şehirler

### ⚡ Performans ve Teknik
- **Code Splitting**: Route bazlı lazy loading (daha hızlı ilk yükleme)
- **PWA Desteği**: Progressive Web App (offline çalışma, ana ekrana ekleme)
- **Lazy Loading**: Görseller gerektiğinde yüklenir
- **Optimized Rendering**: React.memo ve useMemo ile performans optimizasyonu

## 🛠️ Teknolojiler

### Frontend
- **React 19** - Modern UI kütüphanesi
- **Vite** - Hızlı build tool ve dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Yüksek kaliteli UI bileşenleri
- **Lucide React** - Modern icon kütüphanesi

### Harita
- **Leaflet** - Açık kaynak harita kütüphanesi
- **React-Leaflet** - React için Leaflet wrapper
- **OpenStreetMap** - Harita verisi
- **Leaflet MarkerCluster** - Marker gruplandırma

### State Management
- **React Context API** - Global state yönetimi
- **LocalStorage** - Kullanıcı verilerini saklama (favoriler, geçmiş)

### Build & Dev Tools
- **Bun** - Hızlı JavaScript runtime ve package manager
- **ESLint** - Code linting
- **Vite PWA Plugin** - Progressive Web App desteği

## 📦 Kurulum

### Gereksinimler
- **Bun** (önerilen) veya **Node.js** (npm/yarn)
- Modern bir tarayıcı (Chrome, Firefox, Safari, Edge)

### Bun ile Kurulum (Önerilen)

1. Projeyi klonlayın:
```bash
git clone https://github.com/yigitrglr/ideaatlasi.git
cd ideatlası
```

2. Bağımlılıkları yükleyin:
```bash
bun install
```

3. Geliştirme sunucusunu başlatın:
```bash
bun run dev
```

4. Tarayıcıda `http://localhost:5173` adresini açın

### npm ile Kurulum (Alternatif)

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

3. Tarayıcıda `http://localhost:5173` adresini açın

## 📁 Proje Yapısı

```
ideatlası/
├── public/                 # Statik dosyalar
├── src/
│   ├── components/        # React bileşenleri
│   │   ├── ui/            # shadcn/ui bileşenleri
│   │   ├── PhilosopherDetail.jsx
│   │   ├── SearchAndFilters.jsx
│   │   └── SearchSuggestions.jsx
│   ├── context/           # React Context API
│   │   ├── PhilosopherContext.jsx
│   │   └── ThemeContext.jsx
│   ├── data/              # Veri dosyaları
│   │   └── philosophers.json
│   ├── lib/               # Yardımcı fonksiyonlar
│   │   └── utils.js
│   ├── pages/             # Sayfa bileşenleri
│   │   ├── MenuPage.jsx
│   │   ├── MapPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── AboutPage.jsx
│   ├── App.jsx            # Ana uygulama bileşeni
│   ├── main.jsx           # Entry point
│   └── index.css          # Global stiller
├── index.html
├── vite.config.js         # Vite yapılandırması
├── tailwind.config.js     # Tailwind yapılandırması
├── package.json
└── README.md
```

## 🗺️ Sayfa Yapısı

- `/` - Ana menü sayfası
- `/map` - İnteraktif harita sayfası (ana sayfa)
- `/settings` - Ayarlar sayfası (tema değiştirme)
- `/about` - Hakkımızda ve istatistikler