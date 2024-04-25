describe('Login', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('captures the login page', () => {
    // confirm the login form is visible
    // run the custom command "cy.imageDiff"
    // to compare the current page to the gold image
    // Tip: find the custom command TS definition in cypress/support/index.d.ts
    // and the implementation in cypress/support/commands.ts
    cy.get('.login_wrapper').should('be.visible')
    cy.imageDiff('login-page')
  })
})
