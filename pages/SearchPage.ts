import { Locator, Page } from '@playwright/test';

export class SearchPage {
  private readonly page: Page;
  private readonly searchInput: Locator;
  private readonly submitButton: Locator;
  private readonly advancedSearchLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input#searchBar');
    this.submitButton = page.locator('button[type="submit"]');
    this.advancedSearchLink = page.getByRole('link', { name: /advanced search/i });
  }

  async gotoHome(): Promise<void> {
    await this.page.goto('/');
  }

  async searchByText(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.submitButton.click();
  }

  async searchByAuthor(authorName: string): Promise<void> {
    await this.searchByText(authorName);
  }

  async openAdvancedSearch(): Promise<void> {
    await this.advancedSearchLink.click();
  }
}
