// the login page includes a "last login" element
// that changes every time the page is loaded
// It really shows the current time
// How do we perform visual testing in the presence
// of a dynamic time stamp?
// 1: use cy.clock to set the current date before the cy.visit
// https://on.cypress.io/clock
// 2: confirm the time is displayed correctly
// but then replace it with synthetic constant
// and then take a snapshot
it('buys an item', () => {
  cy.visit('/')
  cy.get('.login_wrapper').should('be.visible')
  // cannot take a screenshot since it is always different
  // cy.imageDiff('login')
})
