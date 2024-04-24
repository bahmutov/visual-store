it('shows the print view', () => {
  // we want to confirm the application login page
  // looks good when printed
  // Tip: you can use cy.CDP to emulate the print media
  // https://github.com/bahmutov/cypress-cdp
  // https://chromedevtools.github.io/devtools-protocol/tot/Emulation/
  cy.visit('/')
  // confirm how the login page looks by taking an image diff
  // cy.imageDiff('login-print')
})
