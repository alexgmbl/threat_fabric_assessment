import { Locator, Page } from '@playwright/test';

export class AuthorPage {
  readonly page: Page;
  readonly authorNameHeading: Locator;
  readonly worksSection: Locator;
  readonly ratingSortSelect: Locator;
  readonly worksListItems: Locator;
  readonly topRatedWorkTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.authorNameHeading = page.locator('h1');
    this.worksSection = page.locator('#author-works, .work-list, .authorAllBooks, main');
    this.ratingSortSelect = page.locator('select#sort, select[name="sort"]');
    this.worksListItems = page.locator('#author-works li, .work-list li, .authorAllBooks li, main ol > li');
    this.topRatedWorkTitle = page.locator('#author-works a[href*="/works/"], .work-list a[href*="/works/"], .authorAllBooks a[href*="/works/"], main a[href*="/works/"]').first();
  }

  async goto(authorKey: string): Promise<void> {
    await this.page.goto(`/authors/${authorKey}`);
  }

  async getAuthorName(): Promise<string> {
    const name = await this.authorNameHeading.first().textContent();
    return name?.trim() ?? '';
  }

  async sortWorksByRating(): Promise<void> {
    if (await this.ratingSortSelect.count()) {
      const select = this.ratingSortSelect.first();
      const optionValue = await select.evaluate((el) => {
        const options: any[] = Array.from((el as any).options ?? []);
        const ratingOption: any = options.find((opt: any) => /rating/i.test(String(opt.label)) || /rating/i.test(String(opt.value)));
        return ratingOption?.value ?? null;
      });

      if (optionValue) {
        await select.selectOption(optionValue);
        await this.page.waitForLoadState('networkidle');
        return;
      }
    }

    const ratingSortLink = this.page.getByRole('link', { name: /rating/i }).first();
    if (await ratingSortLink.count()) {
      await ratingSortLink.click();
      await this.page.waitForLoadState('networkidle');
      return;
    }

    const current = new URL(this.page.url());
    current.searchParams.set('sort', 'rating');
    await this.page.goto(current.toString());
    await this.page.waitForLoadState('networkidle');
  }

  async getTopRatedWorkTitle(): Promise<string> {
    await this.topRatedWorkTitle.waitFor({ state: 'visible', timeout: 15000 });
    const title = await this.topRatedWorkTitle.textContent();
    return title?.trim() ?? '';
  }
}
