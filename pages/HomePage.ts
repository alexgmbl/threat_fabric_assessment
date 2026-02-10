import { expect, Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly headerSearchInput: Locator;
  readonly headerSearchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerSearchInput = page
      .getByRole('searchbox', { name: /search/i })
      .or(page.getByPlaceholder(/search/i))
      .or(page.locator('input[name="q"]').first());
    this.headerSearchButton = page
      .getByRole('button', { name: /search/i })
      .or(page.locator('form[role="search"] button[type="submit"]'))
      .or(page.locator('button[type="submit"]').first());
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await expect(this.headerSearchInput).toBeVisible();
  }

  async search(query: string): Promise<void> {
    await this.headerSearchInput.fill(query);
    await this.headerSearchInput.press('Enter');
  }
}
