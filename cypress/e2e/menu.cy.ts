it('captures the opened menu', () => {
  cy.visit('/')
  cy.get('[data-test="username"]').type('standard_user')
  cy.get('[data-test="password"]').type('secret_sauce')
  cy.get('[data-test="login-button"]').click()
  cy.location('pathname').should('eq', '/inventory')

  // open the menu by clicking on the button
  // and confirm the ".bm-menu-wrap" is visible
  cy.contains('button', 'Open Menu').click()
  cy.get('.bm-menu-wrap').should('be.visible')
  cy.log('**menu opened 2**')
  // capture and diff the current viewport only
  // without capturing the full footer element
  cy.imageDiff('menu', { capture: 'clipToViewport' })
})
