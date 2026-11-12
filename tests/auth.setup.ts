import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { PASSWORD, users } from '../src/data/users';
import { STORAGE_STATE } from '../src/data/paths';

setup('log in as standard user and save session', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(users.standard, PASSWORD);
  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: STORAGE_STATE });
});
