import { type Locator, type Page } from '@playwright/test';
import { parsePrice } from './money';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly error: Locator;
  readonly itemPrices: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly completeHeader: Locator;

  constructor(private readonly page: Page) {
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.finishButton = page.getByTestId('finish');
    this.error = page.getByTestId('error');
    this.itemPrices = page.locator('.cart_item .inventory_item_price');
    this.subtotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');
    this.completeHeader = page.locator('.complete-header');
  }

  async fillCustomerInfo(info: Partial<CustomerInfo>): Promise<void> {
    if (info.firstName !== undefined) await this.firstName.fill(info.firstName);
    if (info.lastName !== undefined) await this.lastName.fill(info.lastName);
    if (info.postalCode !== undefined) await this.postalCode.fill(info.postalCode);
    await this.continueButton.click();
  }

  async summary(): Promise<{ items: number[]; subtotal: number; tax: number; total: number }> {
    return {
      items: (await this.itemPrices.allTextContents()).map(parsePrice),
      subtotal: parsePrice(await this.subtotal.innerText()),
      tax: parsePrice(await this.tax.innerText()),
      total: parsePrice(await this.total.innerText()),
    };
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
