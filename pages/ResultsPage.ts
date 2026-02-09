import { Locator, Page } from '@playwright/test';

export class ResultsPage {
  readonly page: Page;
  readonly resultRows: Locator;
  readonly resultTitles: Locator;

  constructor(page: Page) {
    this.page = page;
    this.resultRows = page.locator('.searchResults li.searchResultItem, li.searchResultItem, [data-ol-search-result]');
    this.resultTitles = page.locator('.searchResults li.searchResultItem .booktitle, li.searchResultItem .booktitle, [data-ol-search-result] .booktitle');
  }

  authorResult(authorName: string): Locator {
    return this.page
      .locator('a[href*="/authors/"]')
      .filter({ hasText: new RegExp(authorName, 'i') })
      .first();
  }

  async getResultsCount(): Promise<number> {
    await this.page.waitForURL(/\/search(\?|\/)/);
    await this.page.waitForLoadState('domcontentloaded');

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
