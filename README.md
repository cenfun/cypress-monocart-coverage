# cypress-monocart-coverage

[![](https://img.shields.io/npm/v/cypress-monocart-coverage)](https://www.npmjs.com/package/cypress-monocart-coverage)
[![](https://badgen.net/npm/dw/cypress-monocart-coverage)](https://www.npmjs.com/package/cypress-monocart-coverage)
![](https://img.shields.io/github/license/cenfun/cypress-monocart-coverage)

> A [Cypress](https://github.com/cypress-io/cypress) coverage plugin for [monocart coverage reports](https://github.com/cenfun/monocart-coverage-reports)

## Install
```sh
npm i cypress-monocart-coverage
```

## Feature
- Cypress 13+
- V8 Coverage Only
- Supported Browsers
    - chrome
    - chromium
    - edge

## Usage for E2E Testing
- add support
```js
// cypress/support/e2e.js
import 'cypress-monocart-coverage/support';
```
- add plugin
```js
// cypress.config.js
const { defineConfig } = require('cypress');
const CypressCoveragePlugin = require('cypress-monocart-coverage');
module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            CypressCoveragePlugin(on, config, {
                name: 'My Cypress e2e Coverage Report',
                entryFilter: {
                    '**/*.cy.js': true
                },
                outputDir: './coverage-reports/e2e',
                reports: [
                    'v8',
                    'console-details',
                    'raw'
                ]
            });
        }
    }
});
```

## Usage for Component Testing
- add support
```js
// cypress/support/component.js
import 'cypress-monocart-coverage/support';
```
- add plugin
```js
// cypress.config.js
const { defineConfig } = require('cypress');
const CypressCoveragePlugin = require('cypress-monocart-coverage');
module.exports = defineConfig({
    component: {
        setupNodeEvents(on, config) {
            CypressCoveragePlugin(on, config, {
                name: 'My Cypress component Coverage Report',
                entryFilter: {
                    '**/src/spec*.js': true
                },
                sourceFilter: {
                    '**/cypress/component/**': true
                },
                outputDir: './coverage-reports/component',
                reports: [
                    'v8',
                    'console-details',
                    'raw'
                ]
            });
        },

        devServer: {
            framework: 'react',
            bundler: 'webpack'
        }
    }
});
```

## How to Merging E2E and Component Coverage Reports
```js
"scripts": {
    "test": "npm run test:e2e && npm run test:component && npm run merge",
    "test:e2e": "npx cypress run --browser edge",
    "test:component": "npx cypress run --component --browser edge",
    "merge": "node ./merge-coverage.js"
}
```
- See example [merge-coverage.js](merge-coverage.js)
- See example [cypress.config.js](cypress.config.js)
- Check [monocart coverage reports](https://github.com/cenfun/monocart-coverage-reports) for more coverage options.