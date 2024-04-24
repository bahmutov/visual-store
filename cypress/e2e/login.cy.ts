it('handles the difference in robot images', () => {
  cy.visit('/')
  cy.get('#login_button_container').should('be.visible')
  // load the robot placeholder fixture using "base64" encoding
  // https://on.cypress.io/fixture
  // form a base64 encoded image URL
  // and set it as the background image of the element ".bot_column"
  // tip: the CSS property "background-image" required
  // the form "url('data:image/png;base64,...')"
  // now the image diff should be stable and pass
  // cy.imageDiff('01-login-page', { mode: 'sync' })
})
