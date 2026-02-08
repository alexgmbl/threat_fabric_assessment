import { Locator, Page } from '@playwright/test';

export class AuthorPage {
  private readonly page: Page;
  private readonly authorNameHeading: Locator;
  private readonly worksSection: Locator;
  private readonly sortBySelect: Locator;
  private readonly worksTitleLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.authorNameHeading = page.locator('h1');
    this.worksSection = page.locator('#author-works');
    this.sortBySelect = page.getByLabel(/sort/i).first();
    this.worksTitleLinks = page.locator('#author-works li .booktitle, #author-works li h3 a');
  }

  async gotoAuthorPage(authorKey: string): Promise<void> {
    const normalizedKey = authorKey.replace(/^\/authors\//, '').replace(/^\//, '');
    await this.page.goto(`/authors/${normalizedKey}`);
  }

  async getAuthorName(): Promise<string> {
    return (await this.authorNameHeading.textContent())?.trim() ?? '';
  }

  async hasWorksSection(): Promise<boolean> {
    return this.worksSection.isVisible();
  }

  async sortWorksByRating(): Promise<void> {
    const ratingValue = await this.sortBySelect.locator('option').evaluateAll((options) => {
      const ratingOption = options.find((option) => option.textContent?.toLowerCase().includes('rating'));
      return ratingOption ? ratingOption.getAttribute('value') : null;
    });

    if (!ratingValue) {
      throw new Error('Could not find a rating sort option for author works');
    }

    await this.sortBySelect.selectOption(ratingValue);
  }

  async getTopRatedWorkTitle(): Promise<string> {
    return (await this.worksTitleLinks.first().textContent())?.trim() ?? '';
  }
}
