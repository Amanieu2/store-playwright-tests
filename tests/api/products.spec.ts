import { test, expect } from '@playwright/test';
import { StoreApi, expectJson } from '../../src/api/StoreApi';
import { ErrorResponse, Product, ProductPage } from '../../src/api/schemas';

test.describe('API: products', () => {
  let api: StoreApi;

  test.beforeEach(({ request }) => {
    api = new StoreApi(request);
  });

  test('product list matches the contract @smoke', async () => {
    const page = await expectJson(await api.products(), 200, ProductPage);

    expect(page.products.length).toBeGreaterThan(0);
    expect(page.total).toBeGreaterThanOrEqual(page.products.length);
  });

  test('pagination returns the requested slice', async () => {
    const page = await expectJson(await api.products({ limit: 5, skip: 10 }), 200, ProductPage);

    expect(page.limit).toBe(5);
    expect(page.skip).toBe(10);
    expect(page.products.map((p) => p.id)).toEqual([11, 12, 13, 14, 15]);
  });

  test('sorting by price ascending', async () => {
    const page = await expectJson(
      await api.products({ sortBy: 'price', order: 'asc', limit: 30 }), 200, ProductPage,
    );
    const prices = page.products.map((p) => p.price);

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('single product is returned by id', async () => {
    const product = await expectJson(await api.product(1), 200, Product);

    expect(product.id).toBe(1);
  });

  test('unknown product id returns 404 with a message', async () => {
    const error = await expectJson(await api.product(999_999), 404, ErrorResponse);

    expect(error.message).toContain('999999');
  });

  test('search finds products by keyword', async () => {
    const page = await expectJson(await api.search('phone'), 200, ProductPage);

    expect(page.products.length).toBeGreaterThan(0);
    expect(
      page.products.some((p) => `${p.title} ${p.description}`.toLowerCase().includes('phone')),
    ).toBe(true);
  });

  test('search with no matches returns an empty list, not an error', async () => {
    const page = await expectJson(await api.search('zzqqxx-no-such-product'), 200, ProductPage);

    expect(page.products).toHaveLength(0);
    expect(page.total).toBe(0);
  });
});
