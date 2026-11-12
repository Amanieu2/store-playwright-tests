# Store Playwright Tests

[![Playwright tests](https://github.com/Amanieu2/store-playwright-tests/actions/workflows/playwright.yml/badge.svg)](https://github.com/Amanieu2/store-playwright-tests/actions/workflows/playwright.yml)
[![Report](https://img.shields.io/badge/Playwright-report-2EAD33)](https://Amanieu2.github.io/store-playwright-tests/)

End-to-end UI and API test automation for an online store, built with **Playwright and TypeScript**.
The suite runs in three browsers and in CI on every push and every night. After each run it publishes an HTML report
with traces, screenshots and videos of failures.

**Live report:** https://Amanieu2.github.io/store-playwright-tests/

## Coverage

| Area | System under test | Scenarios |
|---|---|---|
| UI: login | [SauceDemo](https://www.saucedemo.com) | Successful login, locked out user, wrong or empty credentials, protected pages, logout |
| UI: catalog | SauceDemo | Product list, sorting by price and name, product details match the catalog |
| UI: cart | SauceDemo | Add and remove, badge counter, persistence after reload, continue shopping |
| UI: checkout | SauceDemo | End-to-end order, **subtotal, tax and total math**, required-field validation, cancel |
| API: auth | [DummyJSON](https://dummyjson.com/docs) | JWT login, protected profile, invalid, missing and forged tokens |
| API: products | DummyJSON | Contract validation, pagination, sorting, search, 404 handling |
| API: carts | DummyJSON | Line totals, cart totals, discounts, consistency with catalog prices |

## Tech stack

Playwright Test · TypeScript · Zod (API contract validation) · Page Object Model · GitHub Actions · GitHub Pages

## Highlights

- **Page Object Model with fixtures.** Page objects are injected into tests, so a test reads like a user scenario.
- **Login once, reuse the session.** A setup project saves the authenticated state, and UI tests start already logged in. This makes the suite faster and keeps login logic in one place.
- **Cross-browser.** Chromium, Firefox and WebKit run in parallel.
- **Typed API contracts.** Every response is validated with Zod. A breaking API change fails with a readable list of mismatched fields.
- **Money math in cents.** Totals are compared as integers, so floating-point noise never causes a flaky failure.
- **Debuggable failures.** Traces, screenshots and videos are kept for failed tests. A JUnit XML report is produced for any CI.
- **Configurable.** Base URLs and credentials come from environment variables, so the same suite can target dev or staging.

## Project structure

```
src/pages/        Page objects: LoginPage, InventoryPage, CartPage, CheckoutPage
src/api/          StoreApi client and Zod schemas
src/data/         Test users and customer data
src/fixtures.ts   Custom test fixtures that inject page objects
tests/ui/         UI specs: login, inventory, cart, checkout
tests/api/        API specs: auth, products, carts
tests/auth.setup.ts   Logs in once and stores the session
.github/workflows/    CI pipeline
```

## Running locally

```bash
npm ci
npx playwright install
npm test                # everything
npm run test:ui         # UI in 3 browsers
npm run test:api        # API only
npm run test:smoke      # tests tagged @smoke
npm run test:headed     # watch Chromium run
npm run report          # open the HTML report
```

| Variable | Default |
|---|---|
| `UI_BASE_URL` | `https://www.saucedemo.com` |
| `API_BASE_URL` | `https://dummyjson.com` |
| `SAUCE_PASSWORD` | demo password |
| `API_USER` / `API_PASSWORD` | demo account |

## About me

Petr Kusevich, QA Lead. I build UI and API test automation and CI pipelines (Playwright, Java, REST, CI/CD),
with a background in banking and fintech systems.
