
const MCR = require('monocart-coverage-reports');

const merge = async () => {

    const coverageReport = MCR({
        // logging: 'debug',
        name: 'My Cypress merged Coverage Report',

        inputDir: [
            './coverage-reports/e2e/raw',
            './coverage-reports/component/raw'
        ],
        outputDir: './coverage-reports/merged',
        sourcePath: {
            'cypress-monocart-coverage/': ''
        },
        reports: [
            'v8',
            'console-details'
        ]
    });

    await coverageReport.generate();

};

merge();
