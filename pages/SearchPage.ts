import { Locator, Page } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly advancedSearchLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.advancedSearchLink = page.getByRole('link', { name: /advanced search/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async gotoHome(): Promise<void> {
    await this.goto();
  }

  async searchByAuthor(authorName: string): Promise<void> {
    await this.page.goto(`/search?q=${encodeURIComponent(authorName)}`);
  }

  async openAdvancedSearch(): Promise<void> {
    await this.advancedSearchLink.click();
  }

  async advancedSearchByTitleAndAuthor(title: string, author: string): Promise<void> {
    await this.page.goto(`/search?q=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&mode=advanced`);
  }
}
