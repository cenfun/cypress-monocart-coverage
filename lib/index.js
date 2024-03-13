const MCR = require('monocart-coverage-reports');
const EC = require('eight-colors');

let port;
let client;
let started = false;

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

    port = parseInt(rdpArgument.split('=')[1]);

}

const startCoverage = async () => {

    if (client || started) {
        return;
    }
    client = await MCR.CDPClient({
        port
    });

    await client.startCoverage();
    started = true;
};

const takeCoverage = async (coverageReport) => {
    if (!client || !started) {
        return;
    }

    const coverageData = await client.stopCoverage();
    await coverageReport.add(coverageData);

    await client.close();
    client = null;
    started = false;

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
            await startCoverage();
            return null;
        },

        coverageAfter: async () => {
            // one time in a file
            // EC.logMagenta('!!!!!!!!!!!!!!!!!coverageAfter');
            await takeCoverage(coverageReport);
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

