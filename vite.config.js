import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve' || mode === 'development';

  return {
    plugins: [react(), tailwindcss()],

    // Vypnutí cache v DEV prostředí
    server: {
      // Vypnutí HTTP cache headers
      headers: {
        'Cache-Control': isDev
          ? 'no-cache, no-store, must-revalidate'
          : undefined,
        Pragma: isDev ? 'no-cache' : undefined,
        Expires: isDev ? '0' : undefined,
      },
      // Vypnutí HMR cache
      hmr: {
        overlay: true,
      },
    },

    // Vypnutí build cache v DEV
    build: {
      // Vypnutí cache pro development
      cache: !isDev,
      // Vypnutí minifikace v DEV pro lepší debugging
      minify: !isDev,
      // Source maps v DEV
      sourcemap: isDev,
    },

    // Vypnutí dependency cache v DEV
    optimizeDeps: {
      force: isDev,
    },

    // Vypnutí CSS cache v DEV
    css: {
      devSourcemap: isDev,
    },
  };
});
