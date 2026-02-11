## Open Library – UI & API Test Automation Framework

## 1. Purpose
This repository contains a structured test automation framework built to validate both UI and API layers of the Open Library application.
The objective of this implementation is to demonstrate:

- Clean framework architecture
- Scalable design patterns
- Maintainable and readable test code
- Robust synchronization strategies
- Clear documentation and execution simplicity

## 2. Technology Stack & Rationale
 Core Stack
| Component       | Technology                   |
| --------------- | ---------------------------- |
| Language        | TypeScript                   |
| Test Runner     | Playwright Test              |
| UI Automation   | Playwright                   |
| API Testing     | Playwright APIRequestContext |
| Reporting       | Playwright HTML Reporter     |
| Package Manager | npm                          |
  
  # Why Playwright + TypeScript?
  Playwright supports both UI and API testing within a single ecosystem.
  This reduces architectural complexity and eliminates the need for separate API libraries.
  Also, TypeScript provides: compile-time validation, safer refactoring, clearer API response handling.
  And Playwright natively supports: HTML reports, trace viewer, screenshots on failure, execution logs.


## 3. Project Structure

```text
.
├─ tests/
│  ├─ api/
│  └─ ui/
├─ pages/
├─ api/
├─ test-data/
├─ playwright.config.ts
├─ package.json
└─ README.md
```
Key Concepts:
- Tests follow Arrange / Act / Assert pattern
- Reusable page abstractions
- Clear separation between UI and API domains
- Minimal duplication

## 4. Setup & Installation
Prerequisites:
- Node.js ≥ 18.x
- npm

Verify installation:
```bash
node -v
npm -v
```
Install Dependencies
```bash
npm install
```
Install Playwright Browser
```bash
npx playwright install
```

## 5. Run Tests

```bash
npm run test:ui
npm run test:api
```

## 6. Reporting

Playwright generates HTML reports in `playwright-report/`.

```bash
npx playwright show-report
```

## 7. Implemented Scenarios
API Scenarios:

  - Search book by title and author
  - Retrieve author details
  - Validate author website
  - Author schema validation
  - Negative author lookup handling

UI Scenarios:

  - Basic search from homepage
  - Advanced search (title + author)
  - Author profile navigation
  - Sort works by rating
  - Validate top-rated work
