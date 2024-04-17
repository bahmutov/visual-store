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
  })

  it('wrong password', () => {
    // type the valid username and some made up password
    // https://on.cypress.io/get
    // https://on.cypress.io/type
    //
    // click on the login button
    // https://on.cypress.io/click
    //
    // confirm the page shows errors and stays on login URL
    // https://on.cypress.io/contains
    // https://on.cypress.io/location
  })

  it('wrong username and password', () => {
    // make up both username and password
    // click on the login button
    // https://on.cypress.io/click
    // confirm the page shows errors and stays on login URL
  })

  it('successful logs in', () => {
    // type the valid username and password
    // click on the login button
    // https://on.cypress.io/click
    // confirm the page redirects to /inventory
  })
})
