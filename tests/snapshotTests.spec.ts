import { expect, test } from "@playwright/test";
import { randomSmallFile } from "./testUtils";

// eslint-disable-next-line no-empty-pattern
test.beforeEach(async ({}, testInfo) => {
    // eslint-disable-next-line no-param-reassign
    testInfo.snapshotSuffix = '';
});

test("basic snapshot", async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForSelector('input[placeholder="Enter password"]')
    expect(await page.screenshot()).toMatchSnapshot("minimalScreenshot.png");
});

test("populated snapshot", async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForSelector('input[placeholder="Enter password"]')
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('0Kb/250MB').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([randomSmallFile()]);
    expect(await page.screenshot()).toMatchSnapshot("populatedScreenshot.png");
});