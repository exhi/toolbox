
describe('Login', () => {
    it('Compares login prompt',   () => {
        cy.visit("admin")
        cy.matchImageSnapshot("login");
    });
    it('Rejects bad login',   () => {
        cy.visit("admin")
        cy.get('.bp3-input:first')
            .type('admin@xh.io')
        cy.get('.bp3-input:last')
            .type('badpassword')
            .type('{enter}')
        cy.contains('Login incorrect').should('exist')
    });

    it('Logs in',   () => {
        cy.visit("admin")
        cy.get('.bp3-input:first')
            .type('admin@xh.io').should('have.value', 'admin@xh.io')
        cy.get('.bp3-input:last')
            .type('[TODO - use cypress env]')
            .type('{enter}')
    });
});
