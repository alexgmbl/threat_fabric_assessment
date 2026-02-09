import { Locator, Page } from '@playwright/test';

export class ResultsPage {
  readonly page: Page;
  readonly resultRows: Locator;
  readonly resultTitles: Locator;

  constructor(page: Page) {
    this.page = page;
    this.resultRows = page.locator('li.searchResultItem, .searchResults li, .search-results li, .results li').filter({ has: page.locator('a') });
    this.resultTitles = page.locator('.searchResultItem .booktitle, .searchResults .booktitle, .search-results .booktitle, .results .booktitle, h3.booktitle');
  }

  authorResult(authorName: string): Locator {
    return this.page.getByRole('link', { name: new RegExp(authorName, 'i') }).first();
  }

  async getResultsCount(): Promise<number> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForURL(/\/search\?/);

    const rowCount = await this.resultRows.count();
    const titleCount = await this.resultTitles.count();

    return Math.max(rowCount, titleCount);
  }

  async openAuthorProfile(authorName: string): Promise<void> {
    await this.openAuthor(authorName);
  }

  async openAuthor(authorName: string): Promise<void> {
    await this.authorResult(authorName).click();
  }
}
