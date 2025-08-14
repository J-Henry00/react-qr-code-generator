# DEV Cache Management - Návod

## Přehled

Tento projekt obsahuje komplexní systém pro vypnutí cache v development prostředí, který zajišťuje, že se vždy načítají nejnovější verze souborů.

## Co je implementováno

### 1. Vite Konfigurace (`vite.config.js`)

- Automatické vypnutí cache v DEV módu
- Vypnutí HTTP cache headers
- Vypnutí build cache
- Vypnutí dependency cache
- Vypnutí CSS cache
- Source maps v DEV módu

### 2. DEV Cache Utility (`src/utils/devCacheUtils.jsx`)

- Automatická detekce DEV prostředí
- Vypnutí HTTP cache
- Vypnutí localStorage/sessionStorage cache
- Automatické odregistrování Service Worker v DEV
- Přidání meta tagů pro vypnutí cache
- Logování cache stavu

### 3. Service Worker (`public/service-worker.js`)

- Automatické přeskakování cache v DEV prostředí
- Vždy načítá ze sítě bez cache
- Automatické vymazání cache při aktualizaci

### 4. App.jsx Integrace

- Automatické spuštění cache management v DEV
- Service Worker registrace pouze v PROD
- Logování cache stavu

## Použití

### Spuštění v DEV módu

```bash
# Standardní DEV s vypnutým cache
npm run dev

# DEV s vynuceným vypnutím cache
npm run dev:no-cache

# Vyčištění cache
npm run clean:cache
```

### Kontrola cache stavu

V DEV módu se automaticky loguje cache stav do konzole:

- HTTP cache
- Service Worker registrace
- localStorage/sessionStorage
- Meta tagy

### Automatické funkce

1. **Při načtení stránky**: Automaticky se vypne cache
2. **Při reload**: Cache se vymaže
3. **Service Worker**: Automaticky se odregistruje v DEV
4. **Meta tagy**: Automaticky se přidají pro vypnutí cache

## Výhody

✅ **Žádné cache problémy** v development  
✅ **Automatické fungování** - není potřeba manuální konfigurace  
✅ **Kompletní pokrytí** všech typů cache  
✅ **Debugging friendly** - vždy aktuální kód  
✅ **Production ready** - cache funguje normálně v PROD

## Troubleshooting

### Cache se stále načítá

1. Zkontrolujte, že jste v DEV módu (`localhost:5173`)
2. Spusťte `npm run clean:cache`
3. Restartujte dev server

### Service Worker stále funguje

1. Zkontrolujte konzoli pro DEV cache logy
2. Service Worker se automaticky odregistruje v DEV
3. V PROD funguje normálně

### Problémy s HMR

1. Vite automaticky vypíná HMR cache v DEV
2. Zkontrolujte `vite.config.js` nastavení
3. Restartujte dev server

## Technické detaily

### Detekce DEV prostředí

```javascript
const isDev =
  import.meta.env.DEV ||
  import.meta.env.MODE === 'development' ||
  window.location.hostname === 'localhost';
```

### Cache headers v DEV

```
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

### Automatické vymazání

- HTTP cache: `caches.delete()`
- Service Worker: `registration.unregister()`
- Meta tagy: Automatické přidání
- localStorage: Označení jako disabled
