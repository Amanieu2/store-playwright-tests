import { test, expect } from '../../src/fixtures';
import { PASSWORD, users } from '../../src/data/users';

// These tests check login itself, so they start without the saved session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user logs in and sees the catalog @smoke', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(users.standard, PASSWORD);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).not.toHaveCount(0);
  });

  const negativeCases = [
    { name: 'locked out user', user: users.lockedOut, password: PASSWORD, error: 'Sorry, this user has been locked out.' },
    { name: 'wrong password', user: users.standard, password: 'wrong', error: 'Username and password do not match' },
    { name: 'unknown user', user: 'no_such_user', password: PASSWORD, error: 'Username and password do not match' },
    { name: 'empty username', user: '', password: PASSWORD, error: 'Username is required' },
    { name: 'empty password', user: users.standard, password: '', error: 'Password is required' },
  ];

  for (const c of negativeCases) {
    test(`rejects login: ${c.name}`, async ({ page, loginPage }) => {
      await loginPage.login(c.user, c.password);

      await expect(loginPage.error).toContainText(c.error);
      await expect(page).not.toHaveURL(/inventory\.html/);
    });
  }

  test('protected page redirects an anonymous user to login', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');

    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.error).toContainText('You can only access');
  });

  test('user can log out', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(users.standard, PASSWORD);
    await inventoryPage.logout();

    await expect(loginPage.loginButton).toBeVisible();
    await page.goto('/inventory.html');
    await expect(loginPage.error).toContainText('You can only access');
  });
});
