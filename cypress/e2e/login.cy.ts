it('shows a visual difference on each run', () => {
  cy.visit('/')
  // confirm the page shows the fetched data
  cy.get('#login_stats').should('be.visible')
  // visual assertion that will fail because
  // each screenshot will see something new
  cy.imageDiff('login')
})

it('runs the second test', () => {
  cy.visit('/')
})
