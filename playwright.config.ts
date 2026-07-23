import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Tests erwarten deutsche UI-Texte (Shop-Standardsprache) — ohne das faellt
    // navigator.language im Testbrowser oft auf en-US, lib/locale.ts detectLocale()
    // wechselt dann auf Englisch und alle deutschen Text-Locators schlagen fehl.
    locale: 'de-DE',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
});
