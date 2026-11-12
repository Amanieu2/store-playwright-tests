import { test, expect } from '@playwright/test';
import { StoreApi, expectJson } from '../../src/api/StoreApi';
import { ErrorResponse, LoginResponse, User } from '../../src/api/schemas';
import { apiUser } from '../../src/data/users';

test.describe('API: authentication', () => {
  let api: StoreApi;

  test.beforeEach(({ request }) => {
    api = new StoreApi(request);
  });

  test('valid credentials return tokens @smoke', async () => {
    const body = await expectJson(await api.login(apiUser.username, apiUser.password), 200, LoginResponse);

    expect(body.username).toBe(apiUser.username);
  });

  test('token gives access to the current user profile', async () => {
    const { accessToken, id } = await expectJson(
      await api.login(apiUser.username, apiUser.password), 200, LoginResponse,
    );

    const me = await expectJson(await api.me(accessToken), 200, User);

    expect(me.id).toBe(id);
    expect(me.username).toBe(apiUser.username);
  });

  const invalidLogins = [
    { name: 'wrong password', username: apiUser.username, password: 'wrong-password' },
    { name: 'unknown user', username: 'no_such_user_42', password: apiUser.password },
    { name: 'empty credentials', username: '', password: '' },
  ];

  for (const c of invalidLogins) {
    test(`login is rejected: ${c.name}`, async () => {
      const body = await expectJson(await api.login(c.username, c.password), 400, ErrorResponse);

      expect(body).not.toHaveProperty('accessToken');
    });
  }

  test('profile is not available without a token', async () => {
    await expectJson(await api.me(), 401, ErrorResponse);
  });

  test('profile is not available with a forged token', async () => {
    await expectJson(await api.me('forged.token.value'), [401, 403, 500], ErrorResponse);
  });
});
