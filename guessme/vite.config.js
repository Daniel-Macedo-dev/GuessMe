import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png', 'icons/*.svg'],

      manifest: {
        name: 'GuessMe — Dossiê Digital',
        short_name: 'GuessMe',
        description: 'AI-powered investigation game with case files, evidence, replay, and stats',
        theme_color: '#070b0f',
        background_color: '#070b0f',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'any',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        // Cache app shell and assets
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],

        // SPA fallback — serve cached index.html for all navigation
        navigateFallback: 'index.html',

        // Never intercept API calls — Gemini responses must not be cached
        navigateFallbackDenylist: [/^\/api\//],

        runtimeCaching: [
          // Google Fonts CSS — stale-while-revalidate so updates are picked up
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
          // Google Fonts files — long-lived, cache-first
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },

      // Service worker is disabled in dev to avoid confusing hot-reload behaviour
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
