import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';
import { ResultsPage } from '../../pages/ResultsPage';
import { AuthorPage } from '../../pages/AuthorPage';

test('user can search and open an author page', async ({ page }) => {
  const searchPage = new SearchPage(page);
  const resultsPage = new ResultsPage(page);
  const authorPage = new AuthorPage(page);

  await searchPage.goto();
  await searchPage.searchByAuthor('J. R. R. Tolkien');

  await expect(resultsPage.resultRows.first()).toBeVisible();
  await resultsPage.openAuthor('Tolkien');

  await expect(authorPage.authorNameHeading).toBeVisible();
});
