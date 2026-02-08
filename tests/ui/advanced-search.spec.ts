import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';

test('user can open advanced search page', async ({ page }) => {
  const searchPage = new SearchPage(page);

  await searchPage.goto();
  await searchPage.openAdvancedSearch();

  await expect(page).toHaveURL(/\/advancedsearch/);
});
