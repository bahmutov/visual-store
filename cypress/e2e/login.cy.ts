import { LoginInfo } from '.'
// https://github.com/bahmutov/cypress-map
import 'cypress-map'

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
    cy.visit('/')
  })

  it('waits for the CSS property to stop changing', () => {
    cy.get(selectors.username).type(user.username)
    cy.get(selectors.password).type('incorrect-password')
    cy.get(selectors.loginButton).click()
    cy.contains(
      selectors.error,
      'Epic sadface: Username and password do not match any user in this service',
    )
    // get the error message container
    // and assert that its background color is stable
    // that is, it's not changing anymore. You do not know the expected color.
    // Tip: look up cy.stable command from the cypress-map plugin
  })
})
