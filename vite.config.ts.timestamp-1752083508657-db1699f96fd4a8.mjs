// vite.config.ts
import { defineConfig, loadEnv } from "file:///home/project/node_modules/.pnpm/vite@5.4.19_@types+node@24.0.12/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/.pnpm/@vitejs+plugin-react@4.6.0_vite@5.4.19/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///home/project/node_modules/.pnpm/vite-plugin-pwa@0.19.8_vite@5.4.19_workbox-build@7.3.0_workbox-window@7.3.0/node_modules/vite-plugin-pwa/dist/index.js";
import fs from "fs";
import path from "path";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
        manifest: {
          name: "Jodi Connect - Find Your Perfect Match",
          short_name: "JodiConnect",
          description: "India's Premier Matrimony Platform",
          theme_color: "#00bcd4",
          background_color: "#ffffff",
          display: "standalone",
          orientation: "portrait",
          scope: "/",
          start_url: "/",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png"
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable"
            }
          ]
        },
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/images\.pexels\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "external-images",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 30 * 24 * 60 * 60
                  // 30 days
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: true
          // for local dev, disable in prod
        }
      }),
      {
        name: "inject-sw-env",
        closeBundle: () => {
          let outputFile = "build/dev/firebase-messaging-sw.js";
          switch (mode) {
            case "production":
              outputFile = "build/prod/firebase-messaging-sw.js";
              break;
            case "staging":
              outputFile = "build/release/firebase-messaging-sw.js";
              break;
            case "development":
              outputFile = "build/dev/firebase-messaging-sw.js";
              break;
            default:
              outputFile = "build/dev/firebase-messaging-sw.js";
              break;
          }
          const templatePath = path.resolve("public/firebase-messaging-sw.js");
          if (!fs.existsSync(templatePath)) {
            console.warn(`\u26A0\uFE0F Missing service worker template file: ${templatePath}`);
            return;
          }
          const template = fs.readFileSync(templatePath, "utf-8");
          const output = template.replace("__API_KEY__", env.VITE_FIREBASE_API_KEY ?? "").replace("__AUTH_DOMAIN__", env.VITE_FIREBASE_AUTH_DOMAIN ?? "").replace("__PROJECT_ID__", env.VITE_FIREBASE_PROJECT_ID ?? "").replace("__STORAGE_BUCKET__", env.VITE_FIREBASE_STORAGE_BUCKET ?? "").replace("__MESSAGING_SENDER_ID__", env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "").replace("__APP_ID__", env.VITE_FIREBASE_APP_ID ?? "").replace("__MEASUREMENT_ID__", env.VITE_FIREBASE_MEASUREMENT_ID ?? "");
          fs.writeFileSync(outputFile, output);
          console.log(`\u2705 Injected Firebase config to: ${outputFile}`);
        }
      }
    ],
    optimizeDeps: {
      exclude: ["lucide-react"]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICAvLyBMb2FkIC5lbnYue21vZGV9IGludG8gcHJvY2Vzcy5lbnZcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XG5cbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICByZWFjdCgpLFxuICAgICAgVml0ZVBXQSh7XG4gICAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxuICAgICAgICBpbmNsdWRlQXNzZXRzOiBbJ2Zhdmljb24uaWNvJywgJ2FwcGxlLXRvdWNoLWljb24ucG5nJywgJ21hc2tlZC1pY29uLnN2ZyddLFxuICAgICAgICBtYW5pZmVzdDoge1xuICAgICAgICAgIG5hbWU6ICdKb2RpIENvbm5lY3QgLSBGaW5kIFlvdXIgUGVyZmVjdCBNYXRjaCcsXG4gICAgICAgICAgc2hvcnRfbmFtZTogJ0pvZGlDb25uZWN0JyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0luZGlhXFwncyBQcmVtaWVyIE1hdHJpbW9ueSBQbGF0Zm9ybScsXG4gICAgICAgICAgdGhlbWVfY29sb3I6ICcjMDBiY2Q0JyxcbiAgICAgICAgICBiYWNrZ3JvdW5kX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgZGlzcGxheTogJ3N0YW5kYWxvbmUnLFxuICAgICAgICAgIG9yaWVudGF0aW9uOiAncG9ydHJhaXQnLFxuICAgICAgICAgIHNjb3BlOiAnLycsXG4gICAgICAgICAgc3RhcnRfdXJsOiAnLycsXG4gICAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3JjOiAncHdhLTE5MngxOTIucG5nJyxcbiAgICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcbiAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNyYzogJ3B3YS01MTJ4NTEyLnBuZycsXG4gICAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzcmM6ICdwd2EtNTEyeDUxMi5wbmcnLFxuICAgICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgICAgcHVycG9zZTogJ2FueSBtYXNrYWJsZSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHdvcmtib3g6IHtcbiAgICAgICAgICBza2lwV2FpdGluZzogdHJ1ZSxcbiAgICAgICAgICBjbGllbnRzQ2xhaW06IHRydWUsXG4gICAgICAgICAgY2xlYW51cE91dGRhdGVkQ2FjaGVzOiB0cnVlLFxuICAgICAgICAgIGdsb2JQYXR0ZXJuczogWycqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Z30nXSxcbiAgICAgICAgICBydW50aW1lQ2FjaGluZzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcL2ltYWdlc1xcLnBleGVsc1xcLmNvbVxcLy4qL2ksXG4gICAgICAgICAgICAgIGhhbmRsZXI6ICdDYWNoZUZpcnN0JyxcbiAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGNhY2hlTmFtZTogJ2V4dGVybmFsLWltYWdlcycsXG4gICAgICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgbWF4RW50cmllczogMTAwLFxuICAgICAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogMzAgKiAyNCAqIDYwICogNjAgLy8gMzAgZGF5c1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgZGV2T3B0aW9uczoge1xuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsIC8vIGZvciBsb2NhbCBkZXYsIGRpc2FibGUgaW4gcHJvZFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdpbmplY3Qtc3ctZW52JyxcbiAgICAgICAgY2xvc2VCdW5kbGU6ICgpID0+IHtcbiAgICAgICAgICBsZXQgb3V0cHV0RmlsZSA9ICdidWlsZC9kZXYvZmlyZWJhc2UtbWVzc2FnaW5nLXN3LmpzJztcbiAgICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Byb2R1Y3Rpb24nOlxuICAgICAgICAgICAgICBvdXRwdXRGaWxlID0gJ2J1aWxkL3Byb2QvZmlyZWJhc2UtbWVzc2FnaW5nLXN3LmpzJztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzdGFnaW5nJzpcbiAgICAgICAgICAgICAgb3V0cHV0RmlsZSA9ICdidWlsZC9yZWxlYXNlL2ZpcmViYXNlLW1lc3NhZ2luZy1zdy5qcyc7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGV2ZWxvcG1lbnQnOlxuICAgICAgICAgICAgICBvdXRwdXRGaWxlID0gJ2J1aWxkL2Rldi9maXJlYmFzZS1tZXNzYWdpbmctc3cuanMnO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIG91dHB1dEZpbGUgPSAnYnVpbGQvZGV2L2ZpcmViYXNlLW1lc3NhZ2luZy1zdy5qcyc7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHRlbXBsYXRlUGF0aCA9IHBhdGgucmVzb2x2ZSgncHVibGljL2ZpcmViYXNlLW1lc3NhZ2luZy1zdy5qcycpO1xuICAgICAgICAgIGlmICghZnMuZXhpc3RzU3luYyh0ZW1wbGF0ZVBhdGgpKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFx1MjZBMFx1RkUwRiBNaXNzaW5nIHNlcnZpY2Ugd29ya2VyIHRlbXBsYXRlIGZpbGU6ICR7dGVtcGxhdGVQYXRofWApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHRlbXBsYXRlID0gZnMucmVhZEZpbGVTeW5jKHRlbXBsYXRlUGF0aCwgJ3V0Zi04Jyk7XG4gICAgICAgICAgY29uc3Qgb3V0cHV0ID0gdGVtcGxhdGVcbiAgICAgICAgICAgIC5yZXBsYWNlKCdfX0FQSV9LRVlfXycsIGVudi5WSVRFX0ZJUkVCQVNFX0FQSV9LRVkgPz8gJycpXG4gICAgICAgICAgICAucmVwbGFjZSgnX19BVVRIX0RPTUFJTl9fJywgZW52LlZJVEVfRklSRUJBU0VfQVVUSF9ET01BSU4gPz8gJycpXG4gICAgICAgICAgICAucmVwbGFjZSgnX19QUk9KRUNUX0lEX18nLCBlbnYuVklURV9GSVJFQkFTRV9QUk9KRUNUX0lEID8/ICcnKVxuICAgICAgICAgICAgLnJlcGxhY2UoJ19fU1RPUkFHRV9CVUNLRVRfXycsIGVudi5WSVRFX0ZJUkVCQVNFX1NUT1JBR0VfQlVDS0VUID8/ICcnKVxuICAgICAgICAgICAgLnJlcGxhY2UoJ19fTUVTU0FHSU5HX1NFTkRFUl9JRF9fJywgZW52LlZJVEVfRklSRUJBU0VfTUVTU0FHSU5HX1NFTkRFUl9JRCA/PyAnJylcbiAgICAgICAgICAgIC5yZXBsYWNlKCdfX0FQUF9JRF9fJywgZW52LlZJVEVfRklSRUJBU0VfQVBQX0lEID8/ICcnKVxuICAgICAgICAgICAgLnJlcGxhY2UoJ19fTUVBU1VSRU1FTlRfSURfXycsIGVudi5WSVRFX0ZJUkVCQVNFX01FQVNVUkVNRU5UX0lEID8/ICcnKTtcblxuICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMob3V0cHV0RmlsZSwgb3V0cHV0KTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgXHUyNzA1IEluamVjdGVkIEZpcmViYXNlIGNvbmZpZyB0bzogJHtvdXRwdXRGaWxlfWApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgXSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J11cbiAgICB9XG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxjQUFjLGVBQWU7QUFDL1AsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUN4QixPQUFPLFFBQVE7QUFDZixPQUFPLFVBQVU7QUFFakIsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFFeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBRTNDLFNBQU87QUFBQSxJQUNMLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxRQUNkLGVBQWUsQ0FBQyxlQUFlLHdCQUF3QixpQkFBaUI7QUFBQSxRQUN4RSxV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
