import {test} from '@playwright/experimental-ct-react';
import App from "../src/App";
import {expect} from "@playwright/test";


test.use({viewport: {width: 500, height: 500}});

test('spotify auth button', async ({mount}) => {
    const component = await mount(<App/>);
    expect(await component.getByLabel('[aria-label]')).toBeTruthy();
    await expect(component).toHaveScreenshot();
});
