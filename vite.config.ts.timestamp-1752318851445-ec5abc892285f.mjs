// vite.config.ts
import { defineConfig, loadEnv } from "file:///home/project/node_modules/.pnpm/vite@5.4.19_@types+node@24.0.13/node_modules/vite/dist/node/index.js";
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
            default:
              outputFile = "build/dev/firebase-messaging-sw.js";
              break;
          }
          const outputDir = path.dirname(outputFile);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICAvLyBMb2FkIC5lbnYue21vZGV9IGludG8gcHJvY2Vzcy5lbnZcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XG5cbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICByZWFjdCgpLFxuICAgICAgVml0ZVBXQSh7XG4gICAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxuICAgICAgICBpbmNsdWRlQXNzZXRzOiBbJ2Zhdmljb24uaWNvJywgJ2FwcGxlLXRvdWNoLWljb24ucG5nJywgJ21hc2tlZC1pY29uLnN2ZyddLFxuICAgICAgICBtYW5pZmVzdDoge1xuICAgICAgICAgIG5hbWU6ICdKb2RpIENvbm5lY3QgLSBGaW5kIFlvdXIgUGVyZmVjdCBNYXRjaCcsXG4gICAgICAgICAgc2hvcnRfbmFtZTogJ0pvZGlDb25uZWN0JyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0luZGlhXFwncyBQcmVtaWVyIE1hdHJpbW9ueSBQbGF0Zm9ybScsXG4gICAgICAgICAgdGhlbWVfY29sb3I6ICcjMDBiY2Q0JyxcbiAgICAgICAgICBiYWNrZ3JvdW5kX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgZGlzcGxheTogJ3N0YW5kYWxvbmUnLFxuICAgICAgICAgIG9yaWVudGF0aW9uOiAncG9ydHJhaXQnLFxuICAgICAgICAgIHNjb3BlOiAnLycsXG4gICAgICAgICAgc3RhcnRfdXJsOiAnLycsXG4gICAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3JjOiAncHdhLTE5MngxOTIucG5nJyxcbiAgICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcbiAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNyYzogJ3B3YS01MTJ4NTEyLnBuZycsXG4gICAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzcmM6ICdwd2EtNTEyeDUxMi5wbmcnLFxuICAgICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgICAgcHVycG9zZTogJ2FueSBtYXNrYWJsZSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHdvcmtib3g6IHtcbiAgICAgICAgICBza2lwV2FpdGluZzogdHJ1ZSxcbiAgICAgICAgICBjbGllbnRzQ2xhaW06IHRydWUsXG4gICAgICAgICAgY2xlYW51cE91dGRhdGVkQ2FjaGVzOiB0cnVlLFxuICAgICAgICAgIGdsb2JQYXR0ZXJuczogWycqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Z30nXSxcbiAgICAgICAgICBydW50aW1lQ2FjaGluZzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcL2ltYWdlc1xcLnBleGVsc1xcLmNvbVxcLy4qL2ksXG4gICAgICAgICAgICAgIGhhbmRsZXI6ICdDYWNoZUZpcnN0JyxcbiAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGNhY2hlTmFtZTogJ2V4dGVybmFsLWltYWdlcycsXG4gICAgICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgbWF4RW50cmllczogMTAwLFxuICAgICAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogMzAgKiAyNCAqIDYwICogNjAgLy8gMzAgZGF5c1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgZGV2T3B0aW9uczoge1xuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsIC8vIGZvciBsb2NhbCBkZXYsIGRpc2FibGUgaW4gcHJvZFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdpbmplY3Qtc3ctZW52JyxcbiAgICAgICAgY2xvc2VCdW5kbGU6ICgpID0+IHtcbiAgICAgICAgICBsZXQgb3V0cHV0RmlsZSA9ICdidWlsZC9kZXYvZmlyZWJhc2UtbWVzc2FnaW5nLXN3LmpzJztcbiAgICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Byb2R1Y3Rpb24nOlxuICAgICAgICAgICAgICBvdXRwdXRGaWxlID0gJ2J1aWxkL3Byb2QvZmlyZWJhc2UtbWVzc2FnaW5nLXN3LmpzJztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzdGFnaW5nJzpcbiAgICAgICAgICAgICAgb3V0cHV0RmlsZSA9ICdidWlsZC9yZWxlYXNlL2ZpcmViYXNlLW1lc3NhZ2luZy1zdy5qcyc7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGV2ZWxvcG1lbnQnOlxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgb3V0cHV0RmlsZSA9ICdidWlsZC9kZXYvZmlyZWJhc2UtbWVzc2FnaW5nLXN3LmpzJztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3Qgb3V0cHV0RGlyID0gcGF0aC5kaXJuYW1lKG91dHB1dEZpbGUpO1xuICAgICAgICAgIGlmICghZnMuZXhpc3RzU3luYyhvdXRwdXREaXIpKSB7XG4gICAgICAgICAgICBmcy5ta2RpclN5bmMob3V0cHV0RGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTsgLy8gXHUyNzA1IFRISVMgTElORSBJUyBDUlVDSUFMXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgdGVtcGxhdGVQYXRoID0gcGF0aC5yZXNvbHZlKCdwdWJsaWMvZmlyZWJhc2UtbWVzc2FnaW5nLXN3LmpzJyk7XG4gICAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKHRlbXBsYXRlUGF0aCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgXHUyNkEwXHVGRTBGIE1pc3Npbmcgc2VydmljZSB3b3JrZXIgdGVtcGxhdGUgZmlsZTogJHt0ZW1wbGF0ZVBhdGh9YCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBmcy5yZWFkRmlsZVN5bmModGVtcGxhdGVQYXRoLCAndXRmLTgnKTtcbiAgICAgICAgICBjb25zdCBvdXRwdXQgPSB0ZW1wbGF0ZVxuICAgICAgICAgICAgLnJlcGxhY2UoJ19fQVBJX0tFWV9fJywgZW52LlZJVEVfRklSRUJBU0VfQVBJX0tFWSA/PyAnJylcbiAgICAgICAgICAgIC5yZXBsYWNlKCdfX0FVVEhfRE9NQUlOX18nLCBlbnYuVklURV9GSVJFQkFTRV9BVVRIX0RPTUFJTiA/PyAnJylcbiAgICAgICAgICAgIC5yZXBsYWNlKCdfX1BST0pFQ1RfSURfXycsIGVudi5WSVRFX0ZJUkVCQVNFX1BST0pFQ1RfSUQgPz8gJycpXG4gICAgICAgICAgICAucmVwbGFjZSgnX19TVE9SQUdFX0JVQ0tFVF9fJywgZW52LlZJVEVfRklSRUJBU0VfU1RPUkFHRV9CVUNLRVQgPz8gJycpXG4gICAgICAgICAgICAucmVwbGFjZSgnX19NRVNTQUdJTkdfU0VOREVSX0lEX18nLCBlbnYuVklURV9GSVJFQkFTRV9NRVNTQUdJTkdfU0VOREVSX0lEID8/ICcnKVxuICAgICAgICAgICAgLnJlcGxhY2UoJ19fQVBQX0lEX18nLCBlbnYuVklURV9GSVJFQkFTRV9BUFBfSUQgPz8gJycpXG4gICAgICAgICAgICAucmVwbGFjZSgnX19NRUFTVVJFTUVOVF9JRF9fJywgZW52LlZJVEVfRklSRUJBU0VfTUVBU1VSRU1FTlRfSUQgPz8gJycpO1xuXG4gICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhvdXRwdXRGaWxlLCBvdXRwdXQpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBcdTI3MDUgSW5qZWN0ZWQgRmlyZWJhc2UgY29uZmlnIHRvOiAke291dHB1dEZpbGV9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdLFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgZXhjbHVkZTogWydsdWNpZGUtcmVhY3QnXVxuICAgIH1cbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLGNBQWMsZUFBZTtBQUMvUCxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sUUFBUTtBQUNmLE9BQU8sVUFBVTtBQUVqQixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUV4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFFM0Ms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
