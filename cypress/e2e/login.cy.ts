const apiServerUrl = 'http://localhost:4200/stats'

it('shows a visual difference on each run', () => {
  cy.visit('/')
  // confirm the page shows the fetched data
  cy.get('#login_stats').should('be.visible')
  // visual assertion
  cy.imageDiff('login')
})

it('runs the second test', () => {
  cy.visit('/')
})
