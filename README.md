# Open Library Test Framework (Skeleton)

This is a starter Playwright framework for testing https://openlibrary.org with:

- UI testing using Page Object Model
- API testing via dedicated API client classes
- Parameterized API scenarios
- HTML reporting
- Clean and scalable folder structure

## Project Structure

```text
.
├─ tests/
│  ├─ api/
│  │  ├─ search-author.spec.ts
│  │  ├─ author-details.spec.ts
│  │  └─ search-book-author-website.spec.ts
│  └─ ui/
│     ├─ advanced-search.spec.ts
│     ├─ author-page.spec.ts
│     └─ advanced-search-rowling-top-rated.spec.ts
├─ pages/
├─ api/
│  ├─ OpenLibraryApiClient.ts
│  ├─ SearchApi.ts
│  ├─ AuthorApi.ts
│  └─ types.ts
├─ test-data/
│  ├─ authors.json
│  └─ book-search-authors.json
├─ playwright.config.ts
├─ package.json
└─ README.md
```

## API Client

`OpenLibraryApiClient` provides reusable typed methods with centralized error handling:

- `search(query, page?)` -> `GET /search.json`
- `searchByTitleAndAuthor(title, author, page?)` -> `GET /search.json`
- `getAuthorByKey(authorKey)` -> `GET /authors/{authorKey}.json`

## Getting Started

```bash
npm install
npx playwright install
npm test
```

## Run Tests

```bash
npm run test:ui
npm run test:api
```

## Reporting

Playwright generates HTML reports in `playwright-report/`.

```bash
npm run report
```
