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

  it('changes the error color from the test', () => {
    cy.get(selectors.username).type(user.username)
    cy.get(selectors.password).type('incorrect-password')
    cy.get(selectors.loginButton).click()
    cy.contains(
      selectors.error,
      'Epic sadface: Username and password do not match any user in this service',
    )
    // confirm the error message is red
    // (the background color is rgb(226, 35, 26))
    const redColor = 'rgb(226, 35, 26)'
    cy.get('.error-message-container')
      .then(($el) => window.getComputedStyle($el[0]).backgroundColor)
      .should('equal', redColor)
    // from the test change the background color of the error element
    // to green color and confirm the computed style is green
    // Tip: all Cypress query commands yield a jQuery object
    cy.get('.error-message-container').invoke(
      'css',
      'background-color',
      'green',
    )
    cy.get('.error-message-container')
      .then(($el) => window.getComputedStyle($el[0]).backgroundColor)
      .should('equal', 'rgb(0, 128, 0)')
  })
})
