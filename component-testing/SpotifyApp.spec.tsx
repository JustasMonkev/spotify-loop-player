import {test} from '@playwright/experimental-ct-react';
import SpotifyApp from "../src/SpotifyApp";
import {expect} from "@playwright/test";


test.use({viewport: {width: 1920, height: 1080}});

const cookies = [
    {
        "name": "access_token", value: 'dummy_token', url: 'http://localhost:3100/'
    }
]

test('spotify song player', async ({mount, page}) => {

    await page.context().addCookies(cookies);

    await page.evaluate(() => {
        localStorage.setItem('song', JSON.stringify({
            name: "Nike Air",
            image: "https://i.scdn.co/image/ab67616d00001e023828721743dc5ffb197cb903",
            artist: "Anezzi",
            uri: "13ZWKQn8RnPBLeNC0g0XGb",
            duration: 187657
        }));
    });


    const component = await mount(<SpotifyApp/>);
    await expect(component).toHaveText('Now playing: Nike Air By: AnezziPlay SongPause TrackSong History');

    await expect(component).toHaveScreenshot();
});
