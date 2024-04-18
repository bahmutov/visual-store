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
    // and assert that its background color is "rgb(226, 35, 26)"
    // First, use the "window.getComputedStyle"
    // Second, use cy.invoke('css', 'background-color')
    // Third, use "have.css" assertion
    // Which method worked?

    // 1: using window.getComputedStyle does not work
    cy.get('.error-message-container')
      .then(($el) => {
        return window.getComputedStyle($el[0]).backgroundColor
      })
      .should('equal', 'rgb(226, 35, 26)')
    // 2: using cy.invoke retries until the assertion passes
    cy.get('.error-message-container')
      .invoke('css', 'background-color')
      .should('equal', 'rgb(226, 35, 26)')
    // 3: using "have.css" assertion retries
    cy.get('.error-message-container').should(
      'have.css',
      'background-color',
      'rgb(226, 35, 26)',
    )
  })
})
