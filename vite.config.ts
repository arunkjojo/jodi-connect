import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load .env.{mode} into process.env
  const env = loadEnv(mode, process.cwd(), '');

  return {
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
          let outputFile = 'build/dev/firebase-messaging-sw.js';
          switch (mode) {
            case 'production':
              outputFile = 'build/prod/firebase-messaging-sw.js';
              break;
            case 'staging':
              outputFile = 'build/release/firebase-messaging-sw.js';
              break;
            case 'development':
            default:
              outputFile = 'build/dev/firebase-messaging-sw.js';
              break;
          }

          const outputDir = path.dirname(outputFile);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true }); // ✅ THIS LINE IS CRUCIAL
          }

          const templatePath = path.resolve('public/firebase-messaging-sw.js');
          if (!fs.existsSync(templatePath)) {
            console.warn(`⚠️ Missing service worker template file: ${templatePath}`);
            return;
          }

          const template = fs.readFileSync(templatePath, 'utf-8');
          const output = template
            .replace('__API_KEY__', env.VITE_FIREBASE_API_KEY ?? '')
            .replace('__AUTH_DOMAIN__', env.VITE_FIREBASE_AUTH_DOMAIN ?? '')
            .replace('__PROJECT_ID__', env.VITE_FIREBASE_PROJECT_ID ?? '')
            .replace('__STORAGE_BUCKET__', env.VITE_FIREBASE_STORAGE_BUCKET ?? '')
            .replace('__MESSAGING_SENDER_ID__', env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '')
            .replace('__APP_ID__', env.VITE_FIREBASE_APP_ID ?? '')
            .replace('__MEASUREMENT_ID__', env.VITE_FIREBASE_MEASUREMENT_ID ?? '');

          fs.writeFileSync(outputFile, output);
          console.log(`✅ Injected Firebase config to: ${outputFile}`);
        }
      }
    ],
    optimizeDeps: {
      exclude: ['lucide-react']
    }
  };
});
