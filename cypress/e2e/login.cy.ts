it('diffs an element', () => {
  cy.visit('/')
  // test diff the element with class "login_credentials_wrap-inner"
  // but first confirm it is visible and includes the text
  // "Accepted usernames are:"
  // Use name "credentials" for the diff image
  //
  // Hint: cy.imageDiff is a dual command
  // https://on.cypress.io/custom-commands
  cy.get('.login_credentials_wrap-inner')
    .should('be.visible')
    .and('include.text', 'Accepted usernames are:')
    .imageDiff('credentials')
})
