/*
  The application fetches some shopping stats from an API server.
  The stats are displayed on the Login page and affect visual testing.
  How would you solve the problem of such dynamic data in visual testing?

  1. Use a fixture to mock the API response.
  2. Confirm the fetched data is shown on the page and then replace
    it with static data
*/

const apiServerUrl = 'http://localhost:4200/stats'

// mock data for you to use if needed
const mockData = {
  totalItems: 777,
  lastSoldItem: 'Plasma TV',
}

it('shows the stats before login (stub the network call)', () => {
  // stub the network call and give it an alias
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept(apiServerUrl, mockData).as('getStats')
  cy.visit('/')
  // confirm the network call was made
  cy.wait('@getStats')
  // confirm the page shows the fetched data
  cy.get('#login_stats').should('be.visible')
  // visual assertion
  cy.imageDiff('stats-mock')
})

it('shows the stats before login (confirm the fetched data is shown)', () => {
  // do not stub the network call and give it an alias
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept(apiServerUrl).as('getStats')
  cy.visit('/')
  // confirm the page shows the fetched data
  cy.wait('@getStats')
    .its('response.body')
    .then((data) => {
      cy.get('#login_stats').should('be.visible')
      // confirm the server response is shown
      // and replace each field on the page with mock data
      cy.contains('.total-items', data.totalItems).invoke('text', '777')
      cy.contains('.last-item', data.lastSoldItem).invoke('text', 'Plasma TV')
    })
  // now the data is stable and we can take the screenshot
  cy.imageDiff('stats-replaced')
})
