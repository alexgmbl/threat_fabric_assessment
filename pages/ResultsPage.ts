import { Locator, Page } from '@playwright/test';

export class ResultsPage {
  readonly page: Page;
  readonly resultRows: Locator;
  readonly resultTitles: Locator;

  constructor(page: Page) {
    this.page = page;
    this.resultRows = page.locator('.searchResults li.searchResultItem, li.searchResultItem, [data-ol-search-result], main ol > li');
    this.resultTitles = page.locator('.searchResults li.searchResultItem .booktitle, li.searchResultItem .booktitle, [data-ol-search-result] .booktitle, main a[href*="/works/"]');
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
    await this.page.waitForLoadState('networkidle');

    const rowCount = await this.resultRows.count();
    const titleCount = await this.resultTitles.count();
    const authorCount = await this.page.locator('main a[href*="/authors/"]').count();

    return Math.max(rowCount, titleCount, authorCount);
  }

  async openAuthorProfile(authorName: string): Promise<void> {
    await this.openAuthor(authorName);
  }

  async openAuthor(authorName: string): Promise<void> {
    await this.authorResult(authorName).click();
  }
}
