# Changelog

Všechny významné změny v tomto projektu budou dokumentovány v tomto souboru.

Formát je založen na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
a tento projekt dodržuje [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2025-08-14

### Přidáno

- 🆕 Struktura souborů byla vylepšena a rozložena do podsložek
- 🆕 Kompletní DEV cache management systém
- 🆕 Automatické vypnutí cache v development prostředí
- 🆕 Inteligentní Service Worker management
- 🆕 Utility funkce pro cache kontrolu
- 🆕 Vite konfigurace pro DEV optimalizaci
- 🆕 NPM scripts pro lepší cache management

### Změněno

- 🔄 Aktualizováno `vite.config.js` pro DEV cache management
- 🔄 Upraven `service-worker.js` pro DEV prostředí
- 🔄 Integrován cache management do `App.jsx`
- 🔄 Přidány nové NPM scripts

### Opraveno

- 🐛 Opraven cache problémy v development módu
- 🐛 Opraven Service Worker interference v DEV
- 🐛 Opraven problém s QR kódem při návratu z modálu "Vytvořit jiné" - nyní se správně stahuje původní QR kód z úvodní obrazovky místo QR kódu z modálu

## [1.0.1] - 2025-08-05

### Přidáno

- 🆕 Základní QR kód generování
- 🆕 Různé typy QR kódů (Wi-Fi, Email, SMS, atd.)
- 🆕 Stahování v různých formátech
- 🆕 Responsivní design s Tailwind CSS

### Změněno

- 🔄 Základní architektura aplikace
- 🔄 UI/UX vylepšení

## [1.0.0] - 2025-07-25

### Přidáno

- 🆕 Iniciální verze QR Code Generator
- 🆕 Základní React + Vite setup
- 🆕 Tailwind CSS integrace
- 🆕 PWA základní funkcionalita

---

## Typy změn

- 🆕 **Přidáno** pro nové funkce
- 🔄 **Změněno** pro změny v existujících funkcích
- 🐛 **Opraveno** pro opravy bugů
- 🗑️ **Odstraněno** pro odstraněné funkce
- 🔒 **Bezpečnost** pro bezpečnostní aktualizace
- 📚 **Dokumentace** pro změny v dokumentaci
