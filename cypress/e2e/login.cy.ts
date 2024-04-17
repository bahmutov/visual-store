import { LoginInfo } from '.'

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
    // visit the login page
    cy.visit('/')
  })

  it('wrong password', () => {
    // type the valid username and some made up password
    cy.get(selectors.username).type(user.username)
    cy.get(selectors.password).type('incorrect-password')
    // click on the login button
    // https://on.cypress.io/click
    cy.get(selectors.loginButton).click()
    // confirm the page shows errors and stays on login URL
    cy.contains(
      selectors.error,
      'Epic sadface: Username and password do not match any user in this service',
    )
    cy.location('pathname').should('equal', '/')
  })

  it('wrong username and password', () => {
    // make up both username and password
    cy.get(selectors.username).type('user-not-found')
    cy.get(selectors.password).type('incorrect-password')
    // click on the login button
    // https://on.cypress.io/click
    cy.get(selectors.loginButton).click()
    // confirm the page shows errors and stays on login URL
    cy.contains(
      selectors.error,
      'Epic sadface: Username and password do not match any user in this service',
    )
    cy.location('pathname').should('equal', '/')
  })

  it.only('successful logs in', () => {
    // type the valid username and password
    cy.get(selectors.username).type(user.username)
    cy.get(selectors.password).type(user.password)
    // click on the login button
    // https://on.cypress.io/click
    cy.get(selectors.loginButton).click()
    // confirm the page redirects to /inventory
    cy.location('pathname').should('equal', '/inventory')
  })
})
