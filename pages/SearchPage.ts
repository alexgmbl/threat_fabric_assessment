import { Locator, Page } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly submitButton: Locator;
  readonly advancedSearchLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input#searchBar');
    this.submitButton = page.locator('button[type="submit"]');
    this.advancedSearchLink = page.getByRole('link', { name: /advanced search/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async searchByAuthor(authorName: string): Promise<void> {
    await this.searchInput.fill(authorName);
    await this.submitButton.click();
  }

  async openAdvancedSearch(): Promise<void> {
    await this.advancedSearchLink.click();
  }
}
