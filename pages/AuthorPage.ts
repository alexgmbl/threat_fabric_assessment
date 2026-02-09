import { Locator, Page } from '@playwright/test';

export class AuthorPage {
  readonly page: Page;
  readonly authorNameHeading: Locator;
  readonly worksSection: Locator;
  readonly ratingSortSelect: Locator;
  readonly worksListItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.authorNameHeading = page.locator('h1:visible, h2:visible').first();
    this.worksSection = page.locator('#author-works, #works, .work-list, .searchResults, .search-results').first();
    this.ratingSortSelect = page.locator('select#sort, select[name="sort"], select[name="sortBy"]').first();
    this.worksListItems = page.locator('#author-works li, #works li, .work-list li, .searchResults li.searchResultItem');
  }

  async goto(authorKey: string): Promise<void> {
    await this.page.goto(`/authors/${authorKey}`);
  }

  async getAuthorName(): Promise<string> {
    const name = await this.authorNameHeading.textContent();
    return name?.trim() ?? '';
  }

  async sortWorksByRating(): Promise<void> {
    if (await this.ratingSortSelect.count()) {
      const select = this.ratingSortSelect;
      const optionValue = await select.evaluate((el) => {
        const options: any[] = Array.from((el as any).options ?? []);
        const ratingOption: any = options.find((opt: any) => /rating/i.test(String(opt.label)) || /rating/i.test(String(opt.value)));
        return ratingOption?.value ?? null;
      });

      if (optionValue) {
        await select.selectOption(optionValue);
        await this.page.waitForLoadState('domcontentloaded');
        return;
      }
    }

    const ratingSortLink = this.page.getByRole('link', { name: /rating/i }).first();
    if (await ratingSortLink.count()) {
      await Promise.all([
        this.page.waitForLoadState('domcontentloaded'),
        ratingSortLink.click()
      ]);
      return;
    }

    const url = new URL(this.page.url());
    if (url.pathname.includes('/authors/')) {
      url.searchParams.set('sort', 'rating');
      await this.page.goto(url.toString());
    }
  }

  async getTopRatedWorkTitle(): Promise<string> {
    await this.page.waitForLoadState('domcontentloaded');

    const title = await this.page.evaluate(() => {
      const selectors = [
        '#author-works li .booktitle',
        '#works li .booktitle',
        '.work-list li .booktitle',
        'a[itemprop="name"][href*="/works/"]',
        'li.searchResultItem .booktitle',
        '#author-works li a[href*="/works/"]',
        '#works li a[href*="/works/"]'
      ];

      for (const selector of selectors) {
        const el = (globalThis as any).document.querySelector(selector) as any;
        const text = el?.textContent?.trim();
        if (text) {
          return text;
        }
      }

      return '';
    });

    return title;
  }
}
