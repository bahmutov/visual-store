it('handles the difference in robot images', () => {
  cy.visit('/')
  cy.get('#login_button_container').should('be.visible')
  // image diff the entire page
  // but ignore any element with the class "bot_column"
  // see the cy.imageDiff JSDoc documentation
  // in the file cypress/support/index.d.ts
  // cy.imageDiff('01-login-page', { ... })
})
