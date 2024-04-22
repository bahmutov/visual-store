describe('Login', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('prints the rendered font', () => {
    cy.get('.login_wrapper').should('be.visible')
    cy.imageDiff('login-page')
  })
})
