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
    // visit the login page
    // https://on.cypress.io/visit
    cy.visit('/')
  })

  it('wrong password', () => {
    // type the valid username and some made up password
    // https://on.cypress.io/get
    // https://on.cypress.io/type
    cy.get(selectors.username).type(user.username)
    cy.get(selectors.password).type('incorrect-password')
    // click on the login button
    // https://on.cypress.io/click
    cy.get(selectors.loginButton).click()
    // confirm the page shows errors and stays on login URL
    // https://on.cypress.io/contains
    cy.contains(
      selectors.error,
      'Epic sadface: Username and password do not match any user in this service',
    )
    // https://on.cypress.io/location
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

  it('successful logs in', () => {
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
