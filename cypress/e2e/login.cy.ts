describe('Login page', () => {
  it(
    'looks good in desktop resolution',
    // run this test in the desktop resolution 1024x768
    // https://on.cypress.io/viewport
    { viewportWidth: 1024, viewportHeight: 768 },
    () => {
      cy.visit('/')
      // confirm the login page has loaded
      // and take a screenshot using cy.imageDiff
      // ignore the dynamic robot image
      cy.get('.login_wrapper').should('be.visible')
      cy.imageDiff('login-desktop', {
        mode: 'sync',
        ignoreElements: '.bot_column',
      })
    },
  )

  it(
    'looks good in mobile resolution',
    // run this test in the mobile resolution 375x667
    // https://on.cypress.io/viewport
    { viewportWidth: 375, viewportHeight: 667 },
    () => {
      cy.visit('/')
      // confirm the login page has loaded
      // and take a screenshot using cy.imageDiff
      // ignore the dynamic robot image
      cy.get('.login_wrapper').should('be.visible')
      cy.imageDiff('login-mobile', {
        mode: 'sync',
        ignoreElements: '.bot_column',
      })
    },
  )
})
