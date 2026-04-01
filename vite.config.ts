import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    // kagaz-kalam-hisab = repo name 
    base: mode === 'production' ? '/kagaz-kalam-hisab/' : '/',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'prompt',
        devOptions: { enabled: true },
        manifest: {
          name: env.VITE_APP_NAME || 'Kagaz Kalam Hisab',
          short_name: env.VITE_APP_NAME || 'KKH',
          description: 'A simple expense tracker - Kagaz Kalam Hisab',
          theme_color: '#facc15',
          background_color: '#09090b',
          display: 'standalone',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
    },
    preview: {
      port: 3000,
    },
  };
});
