import { LoginInfo } from '.'

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

  it('wrong password', () => {
    cy.get(selectors.username).type(user.username)
    cy.get(selectors.password).type('incorrect-password')
    cy.get(selectors.loginButton).click()
    // confirm the page shows errors and stays on login URL
    // https://on.cypress.io/contains
    cy.contains(
      selectors.error,
      'Epic sadface: Username and password do not match any user in this service',
    )
    cy.location('pathname').should('equal', '/')
    // confirm the error message is red
    // (the background color is rgb(226, 35, 26))
    const redColor = 'rgb(226, 35, 26)'
    cy.get('.error-message-container')
      .then(($el) => window.getComputedStyle($el[0]).backgroundColor)
      .should('equal', redColor)
    // confirm the username input has the error class
    cy.get(selectors.username)
      .should('have.class', 'error')
      // and the red bottom border line
      .then(($el) => window.getComputedStyle($el[0]).borderBottomColor)
      .should('equal', redColor)
    // tip: look up using computed style in the browser
    // https://glebbahmutov.com/cypress-examples/recipes/computed-style.html
  })
})
