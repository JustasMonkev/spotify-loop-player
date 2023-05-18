import {test, expect} from '@playwright/test'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import selectors from '../test-utils/locators.ts'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {authenticateSpotify} from '../test-utils/spotify-test-auth.ts'
import {Song} from "../src/types/song";


test.beforeEach(async ({page}) => {
    await authenticateSpotify(page)

    await page.waitForURL('spotify/player')

    await expect(await page.locator(selectors.songStarTimeInput)).toBeHidden()
    await expect(await page.locator(selectors.songEndTimeInput)).toBeHidden()
    await expect(await page.locator(selectors.playSongButton)).toBeHidden()
    await expect(await page.locator(selectors.pauseSongButton)).toBeHidden()
})

test.describe('Spotify search', () => {
    test('check if search input works', async ({page}) => {
        await page.locator(selectors.songSearchInput).type('emin')
        await page.waitForSelector(selectors.searchResults)

        const searchResults = await page
            .locator(selectors.searchResults)
            .all()
            .then((element) =>
                Promise.all(element.map(async (el) => await el.innerText())),
            )

        expect(searchResults.length).toBeGreaterThan(0)
    })

    // #TODO: Fix this test
    test.skip('check if search result list closes when clicking on clear search button', async ({page}) => {
        await page.locator(selectors.songSearchInput).type('emin')
        await page.waitForSelector(selectors.searchResults)

        const searchResults = await page
            .locator(selectors.searchResults)
            .all()
            .then((element) =>
                Promise.all(element.map(async (el) => await el.innerText())),
            )
        expect(searchResults.length).toBeGreaterThan(0)

        const clearSearchInput = await page.$(selectors.clearSearchButton);

        await clearSearchInput.click();

        await expect(await page.locator(selectors.searchResults)).toBeHidden()

        await expect(await page.locator(selectors.songSearchInput)).toBeEmpty();
    })
})

test.describe('Spotify play and pause controls', () => {

    test('check if user can select song from search results', async ({page}) => {
        await page.locator(selectors.songSearchInput).type('Eminem')
        await page.waitForSelector(selectors.searchResults)

        const searchResults = await page
            .locator(selectors.searchResults)
            .all()

        await searchResults[0].click()

        await expect(await page.locator(selectors.songStarTimeInput)).toBeVisible()
        await expect(await page.locator(selectors.songEndTimeInput)).toBeVisible()
        await expect(await page.locator(selectors.playSongButton)).toBeVisible()
        await expect(await page.locator(selectors.pauseSongButton)).toBeVisible()

        const selectedUri = await page.evaluate(() => localStorage.getItem('song'))
        expect(selectedUri).not.toBeNull()

        await expect(await page.locator(selectors.songName).getAttribute('class')).toBeNull()
    })

    test('check if user can play song', async ({page}) => {
        await page.locator(selectors.songSearchInput).type('Eminem')
        await page.waitForSelector(selectors.searchResults)

        const searchResults = await page
            .locator(selectors.searchResults)
            .all()

        await searchResults[0].click()

        await page.locator(selectors.playSongButton).click()

        await page.waitForSelector(selectors.pauseSongButton)

        await expect(await page.locator(selectors.disabledSongButton)).toBeVisible()
        await expect(await page.locator(selectors.pauseSongButton)).toBeVisible()

        await expect(await page.locator(selectors.songName)).toBeVisible()
        await expect(await page.locator(selectors.songArtist)).toBeVisible()
        await expect(await page.locator(selectors.songImage)).toBeVisible()

        const songImage = await page.locator(selectors.songImage)

        await expect(await songImage.getAttribute('src')).not.toBeNull()
        await expect(await songImage.getAttribute('alt')).not.toBeNull()
        await expect(await songImage).toHaveClass('rotating')

    })

    test('check if user can pause song', async ({page}) => {
        await page.locator(selectors.songSearchInput).type('Eminem')
        await page.waitForSelector(selectors.searchResults)

        const searchResults = await page
            .locator(selectors.searchResults)
            .all()

        await searchResults[0].click()

        await page.locator(selectors.playSongButton).click()

        await page.waitForSelector(selectors.pauseSongButton)

        await expect(await page.locator(selectors.disabledSongButton)).toBeVisible()
        await expect(await page.locator(selectors.pauseSongButton)).toBeVisible()
        await page.locator(selectors.pauseSongButton).click()

        await expect(await page.locator(selectors.playSongButton)).toBeVisible()
    })

    test('check if refresh does not the currently playing song', async ({page}) => {
        await page.locator(selectors.songSearchInput).type('Eminem')
        await page.waitForSelector(selectors.searchResults)

        const searchResults = await page
            .locator(selectors.searchResults)
            .all()

        await searchResults[0].click()

        await page.locator(selectors.playSongButton).click()

        await page.waitForSelector(selectors.pauseSongButton)

        await expect(await page.locator(selectors.disabledSongButton)).toBeVisible()
        await expect(await page.locator(selectors.pauseSongButton)).toBeVisible()

        await page.reload()

        await expect(await page.locator(selectors.songName)).toBeVisible()
        await expect(await page.locator(selectors.songArtist)).toBeVisible()
        await expect(await page.locator(selectors.songImage)).toBeVisible()
    })

    test('check if when removing the access_token from local storage it is redirected to the main page', async ({page}) => {
        await page.locator(selectors.songSearchInput).type('Eminem')
        await page.waitForSelector(selectors.searchResults)

        await page.evaluate(() => localStorage.clear());

        await page.reload()

        await expect(await page.locator(selectors.authorizationButton)).toBeVisible()
    })

    test('check if local storage is updated when selecting a new song', async ({page}) => {
        await page.locator(selectors.songSearchInput).type('Eminem')
        await page.waitForSelector(selectors.searchResults)

        let searchResults = await page
            .locator(selectors.searchResults)
            .all()

        await searchResults[0].click()

        await expect(await page.locator(selectors.songName)).toBeVisible()

        const firstSong = JSON.parse(await page.evaluate(() => localStorage.getItem('song'))) as Song

        expect(firstSong).not.toBeNull()

        await page.locator(selectors.songSearchInput).clear()

        await page.locator(selectors.songSearchInput).type('Skepta')
        await page.waitForSelector(selectors.searchResults)

        searchResults = await page
            .locator(selectors.searchResults)
            .all()


        await searchResults[0].click()

        await expect(await page.locator(selectors.songName)).toBeVisible()

        await expect(await page.locator(selectors.songName)).not.toEqual(firstSong.name)

        const secondSong = JSON.parse(await page.evaluate(() => localStorage.getItem('song'))) as Song

        expect(secondSong).not.toBeNull()

        expect(firstSong).not.toEqual(secondSong)
    })
})
