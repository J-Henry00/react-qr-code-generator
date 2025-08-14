# 🎯 QR Code Generator

Moderní webová aplikace pro generování QR kódů s pokročilými funkcemi.

## ✨ Funkce

- 🔐 **Různé typy QR kódů:**
  - Text/URL
  - Wi-Fi připojení
  - Email
  - Telefon/SMS
  - Geolokace
  - Kalendář události
- 📱 **Responsivní design** - funguje na všech zařízeních
- 🎨 **Moderní UI** s Tailwind CSS
- 💾 **Stahování** v PNG, JPEG, SVG formátech
- 🔄 **Real-time generování** s live preview
- 🚀 **PWA ready** s Service Worker
- 🧹 **DEV cache management** pro lepší development

## 🚀 Rychlý start

### Požadavky

- Node.js 18+
- npm nebo yarn

### Instalace

```bash
# Klonování repozitáře
git clone <repository-url>
cd react-qr-code-generator_admin_panel+fixes

# Instalace závislostí
npm install

# Spuštění v development módu
npm run dev

# Build pro produkci
npm run build
```

### Dostupné příkazy

```bash
npm run dev              # Spuštění dev serveru
npm run dev:no-cache     # Dev server s vynuceným vypnutím cache
npm run build            # Build pro produkci
npm run build:dev        # Build v development módu
npm run preview          # Náhled build verze
npm run lint             # Kontrola kódu
npm run clean            # Vyčištění všech cache
npm run clean:cache      # Vyčištění pouze cache
```

## 🏗️ Architektura

```
src/
├── components/          # React komponenty
│   ├── MainForm.jsx    # Hlavní formulář
│   ├── Modal.jsx       # Modální okno
│   ├── ModalContent.jsx # Obsah modálu
│   ├── SideMenu.jsx    # Boční menu
│   └── DownloadOptions.jsx # Možnosti stahování
├── utils/               # Utility funkce
│   ├── qrUtils.jsx     # QR kód generování
│   └── devCacheUtils.jsx # DEV cache management
├── assets/              # Obrázky a ikony
├── App.jsx              # Hlavní komponenta
└── main.jsx            # Entry point
```

## 🎨 Použité technologie

- **Frontend:** React 19, JSX
- **Styling:** Tailwind CSS 4
- **Build tool:** Vite 7
- **QR kódy:** qrcode.react
- **Icons:** FontAwesome
- **PWA:** Service Worker
- **Development:** ESLint, PostCSS

## 🔧 Konfigurace

### Environment Variables

Vytvořte `.env.development` v kořenovém adresáři:

```env
VITE_NODE_ENV=development
VITE_DISABLE_CACHE=true
VITE_FORCE_REFRESH=true
VITE_DEBUG_MODE=true
```

### Vite konfigurace

Automatické vypnutí cache v DEV módu, source maps, HMR optimalizace.

## 📱 PWA Funkce

- **Service Worker** pro offline funkcionalitu
- **Manifest** pro instalaci na mobilní zařízení
- **Icons** v různých velikostech
- **Cache strategie** pro lepší výkon

## 🧪 Development

### Cache Management

Projekt obsahuje inteligentní systém pro správu cache v development prostředí:

- Automatické vypnutí všech typů cache
- Service Worker deaktivace v DEV
- HTTP cache headers
- localStorage/sessionStorage management

Více informací v [DEV_CACHE_README.md](./DEV_CACHE_README.md)

### Code Quality

- ESLint konfigurace
- React Hooks rules
- Moderní JavaScript syntax

## 📦 Build a Deployment

### Development Build

```bash
npm run build:dev
```

### Production Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## 🌐 Live Demo

Aplikace běží na: `http://localhost:5173` (dev) nebo `http://localhost:4173` (preview)

## 🤝 Contributing

1. Fork repozitáře
2. Vytvoř feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit změny (`git commit -m 'Add some AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otevři Pull Request

## 📄 Licence

Tento projekt je licencován pod MIT licencí - viz [LICENSE](LICENSE) soubor pro detaily.

## 🙏 Poděkování

- [qrcode.react](https://github.com/zpao/qrcode.react) - QR kód generování
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vite](https://vitejs.dev/) - Build tool
- [React](https://react.dev/) - UI framework

## 📞 Support

Máš otázky nebo problémy? Otevři [Issue](../../issues) nebo kontaktuj autora.

---

**Verze:** 1.0.3  
**Poslední aktualizace:** Srpen 2025  
**Autor:** J-Henry00
