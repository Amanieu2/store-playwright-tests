import { test, expect } from '../../src/fixtures';

test.describe('Catalog', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('shows the full catalog with names and prices @smoke', async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);
    for (const price of await inventoryPage.prices()) {
      expect(price).toBeGreaterThan(0);
    }
  });

  test('sorts by price, low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorts by price, high to low', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.prices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('sorts by name, Z to A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.names();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('product page shows the same name and price as the catalog', async ({ page, inventoryPage }) => {
    const name = (await inventoryPage.names())[0];
    const price = await inventoryPage.priceOf(name);

    await inventoryPage.openItem(name);

    await expect(page).toHaveURL(/inventory-item\.html\?id=\d+/);
    await expect(page.locator('.inventory_details_name')).toHaveText(name);
    await expect(page.locator('.inventory_details_price')).toHaveText(`$${price.toFixed(2)}`);
  });
});
