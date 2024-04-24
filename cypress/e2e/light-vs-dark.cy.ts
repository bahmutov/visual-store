it('confirms the light and dark color themes', () => {
  // emulate the dark page color scheme
  // https://github.com/bahmutov/cypress-cdp
  // https://chromedevtools.github.io/devtools-protocol/tot/Emulation/
  // Tip: read the blog post "Emulate Media In Cypress Tests"
  // https://glebbahmutov.com/blog/cypress-emulate-media/
  cy.CDP('Emulation.setEmulatedMedia', {
    media: 'page',
    features: [
      {
        name: 'prefers-color-scheme',
        value: 'dark',
      },
    ],
  })
  cy.visit('/')
  // prevent CSS regressions by taking an image diff
  cy.imageDiff('login-dark')
  // switch back to the light color scheme
  cy.CDP('Emulation.setEmulatedMedia', {
    media: 'page',
    features: [
      {
        name: 'prefers-color-scheme',
        value: 'light',
      },
    ],
  })
  // and take another image diff
  cy.imageDiff('login-light')
})
