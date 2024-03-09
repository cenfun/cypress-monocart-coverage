const MCR = require('monocart-coverage-reports');
const EC = require('eight-colors');
const playwright = require('playwright');

let pwBrowser;
const pages = [];

function browserLaunchHandler(browser, launchOptions) {

    const browserName = browser.name;
    const supportedBrowsers = [
        'chrome',
        'chromium',
        'edge'
    ];
    const supported = supportedBrowsers.find((it) => browserName.includes(it));
    if (!supported) {
        EC.logYellow(`Warning: Coverage will not be collected with an unsupported browser "${browserName}", try "cypress run --browser chrome"`);
        return;
    }

    // find how Cypress is going to control Chrome browser
    const rdpArgument = launchOptions.args.find((arg) => arg.startsWith('--remote-debugging-port'));
    if (!rdpArgument) {
        EC.logYellow('Could not find launch argument that starts with --remote-debugging-port');
        return;
    }
    const rdp = parseInt(rdpArgument.split('=')[1]);

    playwright.chromium.connectOverCDP(`http://localhost:${rdp}`).then((pb) => {
        pwBrowser = pb;
    });

}

const updatePages = () => {
    if (!pwBrowser) {
        return;
    }

    pwBrowser.contexts().forEach((context) => {
        context.pages().forEach((page) => {
            if (!pages.includes(page)) {
                pages.push(page);
            }
        });
    });

};

const startCoverage = async () => {

    updatePages();

    if (!pages.length) {
        return;
    }

    for (const page of pages) {

        if (page._startCoverageEnabled) {
            continue;
        }

        await Promise.all([
            page.coverage.startJSCoverage({
                resetOnNavigation: false
            }),
            page.coverage.startCSSCoverage({
                resetOnNavigation: false
            })
        ]);

        page._startCoverageEnabled = true;

    }

};

const takeCoverage = async (coverageReport) => {
    if (!pages.length) {
        return;
    }

    for (const page of pages) {
        const [jsCoverage, cssCoverage] = await Promise.all([
            page.coverage.stopJSCoverage(),
            page.coverage.stopCSSCoverage()
        ]);
        const coverageList = [... jsCoverage, ... cssCoverage];
        await coverageReport.add(coverageList);
    }

    // clean pages
    pages.length = 0;

};

module.exports = (on, cypressConfig, coverageOptions = {}) => {

    // EC.logCyan('collecting coverage ....');

    const coverageReport = MCR(coverageOptions);
    coverageReport.cleanCache();

    on('before:browser:launch', browserLaunchHandler);

    // on('before:run', (details) => {
    //     EC.logMagenta('!!!!!!!!!!!!!!!!!before:run');
    // });

    on('task', {

        coverageBefore: async () => {
            // could be called multiple times in a file
            // EC.logMagenta('!!!!!!!!!!!!!!!!!coverageBefore');
            await startCoverage().catch((e) => {
                EC.logRed(e.message);
            });
            return null;
        },

        coverageAfter: async () => {
            // one time in a file
            // EC.logMagenta('!!!!!!!!!!!!!!!!!coverageAfter');
            await takeCoverage(coverageReport).catch((e) => {
                EC.logRed(e.message);
            });
            return null;
        }
    });

    on('after:run', async (results) => {

        // EC.logMagenta('!!!!!!!!!!!!!!!!!after:run');
        if (coverageReport.hasCache()) {
            await coverageReport.generate();
        }

    });

    return cypressConfig;
};

