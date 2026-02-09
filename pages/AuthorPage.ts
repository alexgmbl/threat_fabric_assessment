import { Locator, Page } from '@playwright/test';

export class AuthorPage {
  readonly page: Page;
  readonly authorNameHeading: Locator;
  readonly worksSection: Locator;
  readonly ratingSortSelect: Locator;
  readonly worksListItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.authorNameHeading = page.locator('h1');
    this.worksSection = page.locator('#author-works');
    this.ratingSortSelect = page.locator('select#sort, select[name="sort"]');
    this.worksListItems = page.locator('#author-works li, .work-list li');
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
    }
  }

  async getTopRatedWorkTitle(): Promise<string> {
    const topWork = this.page.locator('#author-works li .booktitle, .work-list li .booktitle, #author-works li a').first();
    const title = await topWork.textContent();
    return title?.trim() ?? '';
  }
}
