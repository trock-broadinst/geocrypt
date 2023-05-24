import { expect, test } from "@playwright/test";

// eslint-disable-next-line no-empty-pattern
test.beforeEach(async ({}, testInfo) => {
    // eslint-disable-next-line no-param-reassign
    testInfo.snapshotSuffix = '';
});

test.use({ 
    colorScheme: 'dark'
});

test("basic snapshot", async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForSelector('input[placeholder="Enter password"]')
    expect(await page.screenshot()).toMatchSnapshot("darkmodeScreenshot.png");
});
