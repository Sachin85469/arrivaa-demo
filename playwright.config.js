const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './dev/tools',
  testMatch: 'site.spec.js',
  timeout: 30000,
  webServer: {
    command: 'python -m http.server 8000',
    cwd: './website',
    port: 8000,
    reuseExistingServer: true,
  },
  use: {
    channel: 'chrome',
    headless: true,
  },
  projects: [
    {
      name: 'Desktop 1366x800',
      use: {
        viewport: { width: 1366, height: 800 },
      },
    },
    {
      name: 'Tablet 900x800',
      use: {
        viewport: { width: 900, height: 800 },
      },
    },
    {
      name: 'Mobile 390x780',
      use: {
        viewport: { width: 390, height: 780 },
        isMobile: true,
      },
    },
  ],
});
