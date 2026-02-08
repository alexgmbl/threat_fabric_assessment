import { Locator, Page } from '@playwright/test';

export class SearchPage {
  private readonly page: Page;
  private readonly searchInput: Locator;
  private readonly submitButton: Locator;
  private readonly advancedSearchLink: Locator;
  private readonly advancedTitleInput: Locator;
  private readonly advancedAuthorInput: Locator;
  private readonly advancedSearchSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input#searchBar');
    this.submitButton = page.locator('button[type="submit"]');
    this.advancedSearchLink = page.getByRole('link', { name: /advanced search/i });
    this.advancedTitleInput = page.getByLabel(/title/i).first();
    this.advancedAuthorInput = page.getByLabel(/author/i).first();
    this.advancedSearchSubmitButton = page.getByRole('button', { name: /search/i }).first();
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

  async advancedSearchByTitleAndAuthor(title: string, author: string): Promise<void> {
    await this.openAdvancedSearch();
    await this.advancedTitleInput.fill(title);
    await this.advancedAuthorInput.fill(author);
    await this.advancedSearchSubmitButton.click();
  }
}
