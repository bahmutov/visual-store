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
    // intercept all CSS requests and respond with an empty string
    // or a 404 error
    // https://on.cypress.io/intercept
    cy.intercept(
      {
        method: 'GET',
        pathname: /\.css$/,
      },
      {
        error: 404,
      },
    ).as('css')
    cy.visit('/')
  })

  it('works even without CSS', () => {
    cy.get(selectors.username).type(user.username)
    cy.get(selectors.password).type(user.password)
    cy.get(selectors.loginButton).click()
    cy.location('pathname').should('equal', '/inventory')
  })
})
