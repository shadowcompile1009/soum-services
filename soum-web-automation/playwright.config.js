// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const dotenv = require('dotenv');

dotenv.config();



const environment = process.env.NODE_ENV || 'prod';

if (environment === 'prod') {
    dotenv.config({ path: '.env.prod' });
} else if (environment === 'staging') {
    dotenv.config({ path: '.env.staging' });
} else if (environment === 'release') {
    dotenv.config({ path: '.env.release' });
}

global.language = process.env.LANGUAGE || 'english';

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: 'allure-playwright',
  // Cast reporterOptions to 'any' to bypass type checking
  // This is a workaround to resolve the error
  // @ts-ignore
  reporterOptions: {
    allurePlaywright: {
      outputDir: './allure-results'
    }
  }
});
