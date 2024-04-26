// https://github.com/dmtrKovalenko/cypress-real-events
import 'cypress-real-events'

it('captures the opened menu', () => {
  cy.visit('/')
  cy.get('[data-test="username"]').type('standard_user')
  cy.get('[data-test="password"]').type('secret_sauce')
  cy.get('[data-test="login-button"]').click()
  cy.location('pathname').should('eq', '/inventory')

  // open the menu by clicking on the button
  // and confirm the ".bm-menu-wrap" is visible
  cy.contains('button', 'Open Menu').click()
  cy.get('.bm-menu-wrap')
    .should('be.visible')
    // we use a wait timeout because the menu has 0.5s transition
    // and we need it to finish before we can hover
    .stable('css', 'width')
  cy.log('**menu opened**')

  // hover over a menu item "About" which triggers the hover state
  //
  // capture and diff the current viewport only
  // without capturing the full footer element
})
