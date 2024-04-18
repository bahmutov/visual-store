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

  it('gets the computed style using $.css', () => {
    cy.get(selectors.username).type(user.username)
    cy.get(selectors.password).type('incorrect-password')
    cy.get(selectors.loginButton).click()
    cy.contains(
      selectors.error,
      'Epic sadface: Username and password do not match any user in this service',
    )
    // get the error message container
    // and assert that it has the correct font-size
    // Tip: you can invoke the 'css' method to get the computed style
    // https://on.cypress.io/invoke
    // https://api.jquery.com/css/
    // does it yield a value as written in the CSS file ErrorMessage.css?
    cy.get('.error-message-container')
      .invoke('css', 'font-size')
      .should('equal', '14px')
    // confirm the same value is returned by the window.getComputedStyle
    cy.get('.error-message-container')
      .then(($el) => {
        return window.getComputedStyle($el[0]).fontSize
      })
      .should('equal', '14px')
  })
})
