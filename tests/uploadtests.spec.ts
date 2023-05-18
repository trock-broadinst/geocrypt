import { expect, test } from '@playwright/test';
import { generateRandomString, randomLargeFile, randomSmallFile } from './testUtils';

test('Tests uploading and encrypting a small file', async ({ page }) => {
  const password = generateRandomString()
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.goto('http://localhost:3000/');
  await page.getByText('0Kb/250MB').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles([randomSmallFile()]);
  await page.getByPlaceholder('Enter password').click();
  await page.getByPlaceholder('Enter password').fill(password);
  await page.getByPlaceholder('Enter password').press('Tab');
  await page.getByPlaceholder('Confirm password').fill(password); 
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Encrypt files and download' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('geocrypt');
});

test('Tests uploading and encrypting many small files', async ({ page }) => {
  const password = generateRandomString()
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.goto('http://localhost:3000/');
  await page.getByText('0Kb/250MB').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles([
    randomSmallFile('firstfile.txt'),
    randomSmallFile('secondfile.txt'),
  ]);
  await page.getByPlaceholder('Enter password').click();
  await page.getByPlaceholder('Enter password').fill(password);
  await page.getByPlaceholder('Enter password').press('Tab');
  await page.getByPlaceholder('Confirm password').fill(password);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Encrypt files and download' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('geocrypt');
});

test('Tests uploading and encrypting a single 50m large file', async ({ page }) => {
  const fileChooserPromise = page.waitForEvent('filechooser');
  const password = generateRandomString()
  await page.goto('http://localhost:3000/');
  await page.getByText('0Kb/250MB').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles([randomLargeFile()]);
  expect(await page.locator('div').filter({ hasText: "49MB" }).count()).toBe(5);
  await page.getByPlaceholder('Enter password').click();
  await page.getByPlaceholder('Enter password').fill(password);
  await page.getByPlaceholder('Enter password').press('Tab');
  await page.getByPlaceholder('Confirm password').fill(password);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Encrypt files and download' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('geocrypt');
});

test('Tests uploading and encrypting two 25m large files', async ({ page }) => {
  const fileChooserPromise = page.waitForEvent('filechooser');
  const password = generateRandomString()
  await page.goto('http://localhost:3000/');
  await page.getByText('0Kb/250MB').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles([randomLargeFile(),randomLargeFile('testfile.abc.xyz')]);
  expect(await page.locator('div').filter({ hasText: "25MB" }).count()).toBe(5);
  await page.getByPlaceholder('Enter password').click();
  await page.getByPlaceholder('Enter password').fill(password);
  await page.getByPlaceholder('Enter password').press('Tab');
  await page.getByPlaceholder('Confirm password').fill(password);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Encrypt files and download' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('geocrypt');
});

test('Tests removing files with the x button', async ({ page }) => {
  const password = generateRandomString()
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.goto('http://localhost:3000/');
  await page.getByText('0Kb/250MB').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles([
    randomSmallFile('testfile.1'),
    randomSmallFile('testfile.2'),
    randomSmallFile('testfile.3'),
    randomSmallFile('testfile.4'),
  ]);
  await page.locator('div').filter({ hasText: "testfile.1" }).getByRole('button', { name: '✖' }).nth(1).click();
  await page.locator('div').filter({ hasText: "testfile.3" }).getByRole('button', { name: '✖' }).nth(2).click();
  await page.getByPlaceholder('Enter password').click();
  await page.getByPlaceholder('Enter password').fill(password);
  await page.getByPlaceholder('Enter password').press('Tab');
  await page.getByPlaceholder('Confirm password').fill(password);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Encrypt files and download' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('geocrypt');
});