describe('Login page', () => {
  // https://on.cypress.io/viewport
  // run this test in the desktop resolution 1024x768
  it('looks good in desktop resolution', () => {
    cy.visit('/')
    // confirm the login page has loaded
    // and take a screenshot using cy.imageDiff
    // ignore the dynamic robot image
  })

  // https://on.cypress.io/viewport
  // run this test in the mobile resolution 375x667
  it('looks good in mobile resolution', () => {
    cy.visit('/')
    // confirm the login page has loaded
    // and take a screenshot using cy.imageDiff
    // ignore the dynamic robot image
  })
})
