import { expect, Locator, Page } from '@playwright/test';

export class SearchResultsPage {
  readonly page: Page;
  readonly resultsHeading: Locator;
  readonly resultItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.resultsHeading = page.getByRole('heading', { name: /search|results/i }).first();
    this.resultItems = page
      .locator('li.searchResultItem')
      .or(page.locator('[data-ol-search-result]'))
      .or(page.locator('main li:has(a[href*="/works/"])'));
  }

  async waitForResults(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await Promise.race([
      this.page.waitForURL(/\/search(\?|\/|$)/),
      expect(this.resultsHeading).toBeVisible({ timeout: 10_000 })
    ]);
    await expect(this.resultItems.first()).toBeVisible();
  }

  async isResultsPageDisplayed(): Promise<boolean> {
    const hasSearchUrl = /\/search(\?|\/|$)/.test(this.page.url());
    const hasHeading = await this.resultsHeading.isVisible().catch(() => false);
    return hasSearchUrl || hasHeading;
  }

  async getResultCount(): Promise<number> {
    await this.waitForResults();
    return this.resultItems.count();
  }

  async getTitleOfResult(index: number): Promise<string> {
    await this.waitForResults();

    const resultItem = this.resultItems.nth(index);
    await expect(resultItem).toBeVisible();

    const directTitle = resultItem.locator('.booktitle').first();
    if (await directTitle.count()) {
      const directText = (await directTitle.innerText()).trim();
      if (directText) {
        return directText;
      }
    }

    const workLink = resultItem.locator('a[href*="/works/"]').first();
    if (await workLink.count()) {
      const workTitle = (await workLink.innerText()).trim();
      if (workTitle) {
        return workTitle;
      }
    }

    const anyLink = resultItem.getByRole('link').first();
    if (await anyLink.count()) {
      return (await anyLink.innerText()).trim();
    }

    return (await resultItem.innerText()).trim();
  }
}
