import { type APIRequestContext, type APIResponse, expect, test } from '@playwright/test';
import { type z } from 'zod';

/** Thin client over the store API. Every call is a named step in the HTML report. */
export class StoreApi {
  constructor(private readonly request: APIRequestContext) {}

  login(username: string, password: string): Promise<APIResponse> {
    return test.step(`POST /auth/login as ${username || '<empty>'}`, () =>
      this.request.post('/auth/login', { data: { username, password, expiresInMins: 5 } }),
    );
  }

  me(token?: string): Promise<APIResponse> {
    return test.step('GET /auth/me', () =>
      this.request.get('/auth/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    );
  }

  products(params: Record<string, string | number> = {}): Promise<APIResponse> {
    return test.step(`GET /products ${JSON.stringify(params)}`, () =>
      this.request.get('/products', { params }),
    );
  }

  product(id: number): Promise<APIResponse> {
    return test.step(`GET /products/${id}`, () => this.request.get(`/products/${id}`));
  }

  search(query: string): Promise<APIResponse> {
    return test.step(`GET /products/search?q=${query}`, () =>
      this.request.get('/products/search', { params: { q: query } }),
    );
  }

  addCart(userId: number, products: { id: number; quantity: number }[]): Promise<APIResponse> {
    return test.step('POST /carts/add', () =>
      this.request.post('/carts/add', { data: { userId, products } }),
    );
  }
}

/** Asserts the status, then validates the JSON body against a schema and returns it typed. */
export async function expectJson<S extends z.ZodType>(
  response: APIResponse,
  status: number | number[],
  schema: S,
): Promise<z.infer<S>> {
  const allowed = Array.isArray(status) ? status : [status];
  expect(allowed, `${response.url()} -> ${response.status()} ${await response.text()}`).toContain(response.status());
  const parsed = schema.safeParse(await response.json());
  expect(parsed.success, parsed.success ? '' : JSON.stringify(parsed.error.issues, null, 2)).toBe(true);
  return parsed.data as z.infer<S>;
}
