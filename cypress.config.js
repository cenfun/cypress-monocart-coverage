const { defineConfig } = require('cypress');

const CypressCoveragePlugin = require('./lib');

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            CypressCoveragePlugin(on, config, {
                // logging: 'debug',
                name: 'My Cypress e2e Coverage Report',
                entryFilter: {
                    '**/*.cy.js': true
                },
                sourcePath: {
                    'cypress-monocart-coverage/': ''
                },
                outputDir: './coverage-reports/e2e'
            });
        }
    },

    component: {
        setupNodeEvents(on, config) {
            CypressCoveragePlugin(on, config, {
                // logging: 'debug',
                name: 'My Cypress component Coverage Report',
                entryFilter: {
                    '**/src/spec*.js': true
                },
                sourceFilter: {
                    '**/cypress/component/**': true
                },
                sourcePath: {
                    'cypress-monocart-coverage/': ''
                },
                outputDir: './coverage-reports/component'
            });
        },

        devServer: {
            framework: 'react',
            bundler: 'webpack'
        }
    }
});
