import { Locator, Page } from '@playwright/test';

export class ResultsPage {
  readonly page: Page;
  readonly resultRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.resultRows = page.locator('.searchResults li.searchResultItem');
  }

  authorResult(authorName: string): Locator {
    return this.page.getByRole('link', { name: new RegExp(authorName, 'i') }).first();
  }

  async openAuthor(authorName: string): Promise<void> {
    await this.authorResult(authorName).click();
  }
}
