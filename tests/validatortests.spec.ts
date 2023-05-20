import { expect, test } from '@playwright/test';
import { generateRandomString } from './testUtils';

test('Tests showing password', async ({ page }) => {
  const password = generateRandomString()
  await page.goto('http://localhost:3000/');

  await page.getByPlaceholder('Enter password').click();
  await page.getByPlaceholder('Enter password').fill(password);
  await page.getByPlaceholder('Enter password').press('Tab');
  await page.getByPlaceholder('Confirm password').fill(password); 
  await page.getByRole('button', { name: '⏿' }).click();
  expect(await page.locator('input#password1').getAttribute("type")).toBe("text");
  expect(await page.locator('input#password2').getAttribute("type")).toBe("text");
});

test('Tests password confirm warning', async ({ page }) => {
  const password = generateRandomString()
  await page.goto('http://localhost:3000/');

  await page.getByPlaceholder('Enter password').click();
  await page.getByPlaceholder('Enter password').fill(password);
  await page.getByText('Please confirm password');
});

test('Tests matching password warning', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByPlaceholder('Enter password').click();
  await page.getByPlaceholder('Enter password').fill(generateRandomString());
  await page.getByPlaceholder('Enter password').press('Tab');
  await page.getByPlaceholder('Confirm password').fill(generateRandomString()); 
  await page.getByText('Passwords do not match');
});

test('Tests matching yet insufficient passwords', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByPlaceholder('Enter password').click();
  await page.getByPlaceholder('Enter password').fill('tube');
  await page.getByPlaceholder('Enter password').press('Tab');
  await page.getByPlaceholder('Confirm password').fill('tube'); 
  await page.getByText('password must be at least 6 characters long, contain at least one number and one capital letter');
});