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

  async gotoHome(): Promise<void> {
    await this.goto();
  }

  async searchByAuthor(authorName: string): Promise<void> {
    await this.searchInput.fill(authorName);
    await this.submitButton.click();
  }

  async openAdvancedSearch(): Promise<void> {
    await this.advancedSearchLink.click();
  }

  async advancedSearchByTitleAndAuthor(title: string, author: string): Promise<void> {
    await this.page.goto('/advancedsearch');

    const titleInput = this.page.locator('input[name="title"], input#title').first();
    const authorInput = this.page.locator('input[name="author"], input#author').first();

    await titleInput.fill(title);
    await authorInput.fill(author);

    const submit = this.page
      .locator('form[action="/search"] button[type="submit"], form[action="/search"] input[type="submit"], button[type="submit"]')
      .first();

    await Promise.all([
      this.page.waitForURL(/\/search\?/),
      submit.click()
    ]);
  }
}
