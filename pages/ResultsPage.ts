import { Locator, Page } from '@playwright/test';

export class ResultsPage {
  readonly page: Page;
  readonly resultRows: Locator;
  readonly resultTitles: Locator;

  constructor(page: Page) {
    this.page = page;
    this.resultRows = page.locator('li.searchResultItem, .searchResults li, .search-results li').filter({ has: page.locator('a') });
    this.resultTitles = page.locator('li.searchResultItem .booktitle, .searchResults .booktitle, .search-results .booktitle');
  }

  authorResult(authorName: string): Locator {
    return this.page.getByRole('link', { name: new RegExp(authorName, 'i') }).first();
  }

  async getResultsCount(): Promise<number> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForURL(/\/search\?/);
    await this.page.waitForTimeout(500);
    return this.resultRows.count();
  }

  async openAuthorProfile(authorName: string): Promise<void> {
    await this.openAuthor(authorName);
  }

  async openAuthor(authorName: string): Promise<void> {
    await this.authorResult(authorName).click();
  }
}
