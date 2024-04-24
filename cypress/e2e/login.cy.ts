it('handles the difference in robot images', () => {
  // intercept the outgoing request to any of the robot images
  // that have form like '**/Login_Bot_graphic*.png'
  // and replace it with the fixture image "robot-placeholder.png"
  // https://on.cypress.io/intercept
  // give the intercept an alias "botImage"
  cy.visit('/')
  cy.get('#login_button_container').should('be.visible')
  // confirm the bot image intercept was used
  // https://on.cypress.io/wait
  cy.imageDiff('01-login-page', { mode: 'sync' })
})
