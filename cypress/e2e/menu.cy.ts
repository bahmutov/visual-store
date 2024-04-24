// increase the truncation threshold to see more text
// in the menu items text assertion
chai.config.truncateThreshold = 200

it('checks the opened menu', () => {
  cy.visit('/')
  cy.get('[data-test="username"]').type('standard_user')
  cy.get('[data-test="password"]').type('secret_sauce')
  cy.get('[data-test="login-button"]').click()
  cy.location('pathname').should('eq', '/inventory')

  // open the menu by clicking on the button
  cy.contains('button', 'Open Menu').click()
  // confirm the menu element (the wrap column)
  // is visible and its children are the expected menu items
  // Hint: you can map the elements to their text content
  // using cy.map('innerText') from cypress-map plugin
  // https://github.com/bahmutov/cypress-map
  // and then use "deep.equal" assertion to check the array of strings
  const menuItems = ['ALL ITEMS', 'ABOUT', 'LOGOUT', 'RESET APP STATE']
  // take a screenshot of the menu column and image diff it as "menu"
})
