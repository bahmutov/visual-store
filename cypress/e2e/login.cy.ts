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
  // solution 1: use synthetic time
  cy.clock(new Date(2020, 1, 14, 12, 34, 56))
  cy.visit('/')
  cy.get('.login_wrapper').should('be.visible')
  cy.imageDiff('login')
})

it('buys an item (replace content)', () => {
  // solution 2: replace the dynamic text
  cy.visit('/')
  cy.get('.login_wrapper').should('be.visible')
  // confirm the dynamic text has the right format
  cy.contains('#last-login', /^\d?\d:\d\d:\d\d [AP]M$/)
    // and then replace the dynamic text with static timestamp
    .invoke('text', '11:22:33 AM')
  cy.imageDiff('login2')
})
