import { test, expect } from '../../src/fixtures';
import { customer } from '../../src/data/users';
import { toCents } from '../../src/pages/money';

const BACKPACK = 'Sauce Labs Backpack';
const ONESIE = 'Sauce Labs Onesie';

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(BACKPACK, ONESIE);
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  test('customer places an order end to end @smoke', async ({ page, checkoutPage }) => {
    await checkoutPage.fillCustomerInfo(customer);
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await checkoutPage.finish();

    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(page.locator('.shopping_cart_badge')).toBeHidden();
  });

  test('order totals are calculated correctly', async ({ checkoutPage }) => {
    await checkoutPage.fillCustomerInfo(customer);

    const { items, subtotal, tax, total } = await checkoutPage.summary();

    expect(items).toHaveLength(2);
    expect(toCents(subtotal)).toBe(items.reduce((sum, p) => sum + toCents(p), 0));
    expect(tax).toBeGreaterThan(0);
    expect(toCents(total)).toBe(toCents(subtotal) + toCents(tax));
  });

  const requiredFields = [
    { field: 'First Name', info: { ...customer, firstName: '' } },
    { field: 'Last Name', info: { ...customer, lastName: '' } },
    { field: 'Postal Code', info: { ...customer, postalCode: '' } },
  ];

  for (const { field, info } of requiredFields) {
    test(`shows an error when ${field} is empty`, async ({ page, checkoutPage }) => {
      await checkoutPage.fillCustomerInfo(info);

      await expect(checkoutPage.error).toHaveText(`Error: ${field} is required`);
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
  }

  test('cancel returns to the cart and keeps the items', async ({ page, checkoutPage, cartPage }) => {
    await checkoutPage.cancelButton.click();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.itemNames).toHaveText([BACKPACK, ONESIE]);
  });
});
