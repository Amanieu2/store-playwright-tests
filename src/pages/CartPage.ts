import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(private readonly page: Page) {
    this.items = page.locator('.cart_item');
    this.itemNames = page.locator('.cart_item .inventory_item_name');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  async remove(name: string): Promise<void> {
    await this.items.filter({ hasText: name }).getByRole('button', { name: 'Remove' }).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
