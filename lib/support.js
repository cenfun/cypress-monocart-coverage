const registerHooks = () => {
    before(() => {
        cy.task('coverageBefore');
    });

    after(() => {
        cy.task('coverageAfter');
    });
};

registerHooks();
