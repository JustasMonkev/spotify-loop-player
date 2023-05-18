import {defineConfig, devices} from '@playwright/test';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dotenv from 'dotenv';

dotenv.config();


export default defineConfig({
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: false,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:5173/',
        trace: 'on-first-retry',
    },
    timeout: 50000,
    /* Configure projects for major browsers */
    projects: [
        {
            retries: 1,
            name: 'chromium',
            use: {...devices['Desktop Chrome'], headless: true, viewport: {width: 1920, height: 1080}},
        }
    ],
});
