import { defineConfig, devices } from '@playwright/test';
import { STORAGE_STATE } from './src/data/paths';

const UI_BASE_URL = process.env.UI_BASE_URL ?? 'https://www.saucedemo.com';
const API_BASE_URL = process.env.API_BASE_URL ?? 'https://dummyjson.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // Logs in once and saves the session, so UI tests start already authenticated.
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { baseURL: UI_BASE_URL },
    },
    {
      name: 'chromium',
      testDir: './tests/ui',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], baseURL: UI_BASE_URL, storageState: STORAGE_STATE },
    },
    {
      name: 'firefox',
      testDir: './tests/ui',
      dependencies: ['setup'],
      use: { ...devices['Desktop Firefox'], baseURL: UI_BASE_URL, storageState: STORAGE_STATE },
    },
    {
      name: 'webkit',
      testDir: './tests/ui',
      dependencies: ['setup'],
      use: { ...devices['Desktop Safari'], baseURL: UI_BASE_URL, storageState: STORAGE_STATE },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: API_BASE_URL,
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
