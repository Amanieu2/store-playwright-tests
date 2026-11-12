import { test, expect } from '../../src/fixtures';

const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';

test.describe('Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('badge counts added and removed items', async ({ inventoryPage }) => {
    await expect(inventoryPage.cartBadge).toBeHidden();

    await inventoryPage.addToCart(BACKPACK, BIKE_LIGHT);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.removeFromCart(BACKPACK);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('cart shows exactly the added items @smoke', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(BACKPACK, BIKE_LIGHT);
    await inventoryPage.openCart();

    await expect(cartPage.itemNames).toHaveText([BACKPACK, BIKE_LIGHT]);
  });

  test('cart survives a page reload', async ({ page, inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(BACKPACK);
    await page.reload();

    await expect(inventoryPage.cartBadge).toHaveText('1');
    await cartPage.goto();
    await expect(cartPage.itemNames).toHaveText([BACKPACK]);
  });

  test('item removed in the cart disappears from it', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(BACKPACK, BIKE_LIGHT);
    await inventoryPage.openCart();

    await cartPage.remove(BACKPACK);

    await expect(cartPage.itemNames).toHaveText([BIKE_LIGHT]);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('continue shopping returns to the catalog', async ({ page, inventoryPage, cartPage }) => {
    await inventoryPage.openCart();
    await cartPage.continueShoppingButton.click();

    await expect(page).toHaveURL(/inventory\.html/);
  });
});
