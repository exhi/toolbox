
describe('Login', () => {
    it('Compares login prompt',   () => {
        cy.visit("app")
        cy.matchImageSnapshot("login");
    });
    it('Rejects bad login',   () => {
        cy.visit("app")
        cy.get('.bp3-input:first')
            .type('toolbox@xh.io')
        cy.get('.bp3-input:last')
            .type('badpassword')
            .type('{enter}')
        cy.contains('Login incorrect').should('exist')
    });

    it('Logs in',   () => {
        cy.visit("app")
        cy.get('.bp3-input:first')
            .type('toolbox@xh.io').should('have.value', 'toolbox@xh.io')
        cy.get('.bp3-input:last')
            .type('Hoist_Toolb0x')
            .type('{enter}')
    });
});
