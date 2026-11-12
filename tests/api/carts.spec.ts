import { test, expect } from '@playwright/test';
import { StoreApi, expectJson } from '../../src/api/StoreApi';
import { Cart, Product } from '../../src/api/schemas';

test.describe('API: cart calculations', () => {
  let api: StoreApi;

  test.beforeEach(({ request }) => {
    api = new StoreApi(request);
  });

  test('cart totals are calculated from price and quantity @smoke', async () => {
    const cart = await expectJson(
      await api.addCart(1, [
        { id: 1, quantity: 2 },
        { id: 5, quantity: 1 },
      ]),
      [200, 201],
      Cart,
    );

    expect(cart.userId).toBe(1);
    expect(cart.totalProducts).toBe(2);
    expect(cart.totalQuantity).toBe(3);

    for (const line of cart.products) {
      expect(line.total, `line total for product ${line.id}`).toBeCloseTo(line.price * line.quantity, 2);
    }
    const sum = cart.products.reduce((acc, line) => acc + line.total, 0);
    expect(cart.total).toBeCloseTo(sum, 2);
    expect(cart.discountedTotal).toBeLessThanOrEqual(cart.total);
  });

  test('cart uses the current catalog price', async () => {
    const product = await expectJson(await api.product(1), 200, Product);

    const cart = await expectJson(await api.addCart(1, [{ id: 1, quantity: 1 }]), [200, 201], Cart);

    expect(cart.products[0].price).toBe(product.price);
  });
});
