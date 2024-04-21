describe('Login', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('prints the rendered font', () => {
    // using cypress-cdp plugin
    // get the name of the rendered font
    // for an text element with actual text
    // (not just top level body)
    cy.getCDPNodeId('.login_credentials').then((nodeId: number) => {
      cy.CDP('CSS.getPlatformFontsForNode', {
        nodeId,
      })
        // confirm the first rendered font is "Satisfy"
        .its('fonts')
        .should('not.be.empty')
        .its(0)
        .should('deep.include', { familyName: 'Satisfy' })
        // if you want to print the font family name
        // to the Command Log
        .its('familyName')
        .should('be.a', 'string')
    })
  })
})
