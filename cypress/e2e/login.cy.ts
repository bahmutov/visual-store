import { LoginInfo } from '.'
// https://github.com/bahmutov/cypress-map
import 'cypress-map'
// https://github.com/bahmutov/cypress-cdp
import 'cypress-cdp'

// use these selectors to find elements on the Login page
const selectors = {
  username: '[data-test="username"]',
  password: '[data-test="password"]',
  loginButton: '[data-test="login-button"]',
  error: '[data-test="error"]',
}

describe('Login', () => {
  // this is a valid user object with username and password
  const user: LoginInfo = Cypress.env('users').standard

  beforeEach(() => {
    // set the browser to emulate a desktop device
    // with fixed dimensions and no device scale factor
    // https://chromedevtools.github.io/devtools-protocol/tot/Emulation/#method-setDeviceMetricsOverride

    cy.visit('/')
  })

  it('logs in', () => {
    // how many screenshots does this test need?
    // set up several screenshots and save them to the "cypress/gold" folder
    cy.get('.error-message-container').should('be.empty')
    cy.screenshot('login-page', { overwrite: true })
    cy.get(selectors.username).type(user.username)
    cy.get(selectors.password).type('wrong-password')
    cy.get(selectors.loginButton).click()
    cy.get('.error-message-container').should('not.be.empty')
    cy.screenshot('login-error', { overwrite: true })
  })
})
