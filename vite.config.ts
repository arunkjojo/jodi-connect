import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';

export default defineConfig({
  server: {
    port: 3001
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Jodi Connect - Find Your Perfect Match',
        short_name: 'JodiConnect',
        description: 'India\'s Premier Matrimony Platform',
        theme_color: '#00bcd4',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.pexels\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'external-images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true, // for local dev, disable in prod
      },
    }),
    {
      name: 'inject-sw-env',
      closeBundle: () => {
        const template = fs.readFileSync('public/firebase-messaging-sw.template.js', 'utf-8');
        const output = template
          .replace('__API_KEY__', process.env.VITE_FIREBASE_API_KEY!)
          .replace('__AUTH_DOMAIN__', process.env.VITE_FIREBASE_AUTH_DOMAIN!)
          .replace('__PROJECT_ID__', process.env.VITE_FIREBASE_PROJECT_ID!)
          .replace('__STORAGE_BUCKET__', process.env.VITE_FIREBASE_STORAGE_BUCKET!)
          .replace('__MESSAGING_SENDER_ID__', process.env.VITE_FIREBASE_MESSAGING_SENDER_ID!)
          .replace('__APP_ID__', process.env.VITE_FIREBASE_APP_ID!);

        fs.writeFileSync('public/firebase-messaging-sw.js', output);
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});