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

  it('takes screenshots', () => {
    cy.get(selectors.username).type(user.username)
    cy.get(selectors.password).type('wrong-password')
    // take a screenshot of the entire login page
    // https://on.cypress.io/screenshot
    // try to log in with wrong password
    // take a screenshot of the login form only
    // using id "login_button_container"
  })
})
