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

  it('freezes all CSS animations', () => {
    // insert a style tag into the body of the page
    // that freezes all CSS animations
    // by setting them to "none !important"
    // See "How Cypress Freezes CSS Animations And You Can Too"
    // https://glebbahmutov.com/blog/css-animations/
    cy.get('body').invoke(
      'append',
      Cypress.$(`
      <style id="__cypress-animation-disabler">
        *, *:before, *:after {
          transition-property: none !important;
          animation: none !important;
        }
      </style>
    `),
    )

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
    // Which method worked?

    // 1: using window.getComputedStyle works!
    cy.log('**getComputedStyle**')
    cy.get('.error-message-container')
      .then(($el) => {
        return window.getComputedStyle($el[0]).backgroundColor
      })
      .should('equal', 'rgb(226, 35, 26)')

    // 2: using cy.invoke also works!
    cy.log('**invoke css**')
    cy.get('.error-message-container')
      .invoke('css', 'background-color')
      .should('equal', 'rgb(226, 35, 26)')
  })
})
