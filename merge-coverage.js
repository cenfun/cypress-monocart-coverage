const fs = require('fs');
const MCR = require('monocart-coverage-reports');

const merge = async () => {

    const inputDir = [
        './coverage-reports/e2e/raw',
        './coverage-reports/component/raw'
    ];

    // check input dir first
    for (const rawDir of inputDir) {
        if (!fs.existsSync(rawDir)) {
            console.log(`Skip merging coverage. The raw dir is not exist: ${rawDir}`);
            return;
        }
    }

    const coverageReport = MCR({
        // logging: 'debug',
        name: 'My Cypress merged Coverage Report',

        inputDir,
        outputDir: './coverage-reports/merged',
        sourcePath: {
            'cypress-monocart-coverage/': ''
        },
        reports: [
            'v8',
            'console-details'
        ],

        onEnd: () => {
            // remove the raw files if it useless
            inputDir.forEach((rawDir) => {
                fs.rmSync(rawDir, {
                    recursive: true,
                    force: true
                });
            });
        }
    });

    await coverageReport.generate();

};

merge();
