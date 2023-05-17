// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import selectors from "./locators.ts";
import {expect, Page} from "@playwright/test";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dotenv from 'dotenv';
dotenv.config();


export async function authenticateSpotify(page: Page) {
    await page.goto('/');

    await expect(await page.locator(selectors.authorizationButton)).toBeVisible();

    await page.locator(selectors.authorizationButton).click({force: true});

    await page.waitForURL(/accounts/);

    await page.locator(selectors.spotifySelectors.userNameInput).fill(process.env.SPOTIFY_CLIENT_EMAIL);
    await page.locator(selectors.spotifySelectors.passwordInput).fill(process.env.SPOTIFY_CLIENT_PASSWORD);

    await page.locator(selectors.spotifySelectors.loginButton).click();

    await page.waitForURL('**/authorize*');

    await page.locator(selectors.spotifySelectors.allowButton).click();

    await page.waitForURL('spotify/player');
}
