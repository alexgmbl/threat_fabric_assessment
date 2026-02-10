import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';
import { ResultsPage } from '../../pages/ResultsPage';
import { AuthorPage } from '../../pages/AuthorPage';

test('advanced search for Harry Potter by Rowling & top-rated book', async ({ page }) => {
  const searchPage = new SearchPage(page);
  const resultsPage = new ResultsPage(page);
  const authorPage = new AuthorPage(page);

  await searchPage.gotoHome();
  await searchPage.advancedSearchByTitleAndAuthor('Harry Potter', 'Rowling');

  const resultsCount = await resultsPage.getResultsCount();
  expect(resultsCount).toBeGreaterThan(0);

  await resultsPage.openAuthorProfile('J. K. Rowling');

  const authorName = await authorPage.getAuthorName();
  expect(authorName).toContain('J. K. Rowling');

  await authorPage.sortWorksByRating();



  const topRatedBook = await authorPage.getTopRatedBookTitle();
  expect(await authorPage.getTopRatedBookTitle()).toBe('Harry Potter and the Half-Blood Prince');

});