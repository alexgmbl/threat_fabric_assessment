import { Locator, Page } from '@playwright/test';

export class ResultsPage {
  readonly page: Page;
  readonly resultRows: Locator;
  readonly resultTitles: Locator;

  constructor(page: Page) {
    this.page = page;
    this.resultRows = page.locator('.searchResults li.searchResultItem');
    this.resultTitles = page.locator('.searchResults li.searchResultItem .booktitle');
  }

  authorResult(authorName: string): Locator {
    return this.page.getByRole('link', { name: new RegExp(authorName, 'i') }).first();
  }

  async getResultsCount(): Promise<number> {
    return this.resultRows.count();
  }

  async openAuthorProfile(authorName: string): Promise<void> {
    await this.openAuthor(authorName);
  }

  async openAuthor(authorName: string): Promise<void> {
    await this.authorResult(authorName).click();
  }
}
