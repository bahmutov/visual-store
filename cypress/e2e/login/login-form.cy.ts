import { LoginPage } from '@support/pages/login.page'

describe('Login form', () => {
  // visit the login page before each test
  beforeEach(() => {
    cy.visit('/')
  })

  it('shows an error for empty username field', () => {
    // click on the login button without
    // entering any of the information
    LoginPage.getLogin().click()
    // the login page should show the error
    // with text "Epic sadface: Username is required"
    LoginPage.showsError('Epic sadface: Username is required')
  })

  it('shows an error for empty password field', () => {
    // enter username "name" into the input field
    // and click the login button
    // without entering the password
    LoginPage.getUsername().type('name')
    LoginPage.getLogin().click()
    // the login page should show the error
    // with text "Epic sadface: Password is required"
    LoginPage.showsError('Epic sadface: Password is required')
  })

  it('hides the username', () => {
    cy.get(LoginPage.selectors.username).type('username', { hide: true })
  })

  it(
    'checks if the username is at least 6 characters',
    { browser: ['electron', 'chrome'] },
    () => {
      // get the username input field and focus on it
      // https://on.cypress.io/get
      // https://on.cypress.io/focus
      cy.get(LoginPage.selectors.username)
        .focus()
        // type username that is too short
        // using the cy.realType command from cypress-real-events plugin
        .realType('abcd{enter}')
      // confirm the username input field has CSS pseudo class ":invalid"
      // https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
      // https://glebbahmutov.com/blog/form-validation-in-cypress/
      cy.get(LoginPage.selectors.username).should('match', ':invalid')
      // confirm the form is invalid by calling its method "checkValidity"
      cy.get(LoginPage.selectors.form)
        // we know we are getting a form element from the page
        // @ts-ignore
        .then(($el: JQuery<HTMLFormElement>) => $el[0].checkValidity())
        .should('be.false')
      // confirm the validation message on the username input field
      // includes the phrase "6 characters or more"
      cy.get(LoginPage.selectors.username)
        .should('have.prop', 'validationMessage')
        .should('include', '6 characters or more')
      // confirm the username input element
      // has property "validity" which is an object
      // with "tooShort: true" property
      cy.get(LoginPage.selectors.username)
        .should('have.prop', 'validity')
        .should('deep.include', {
          tooShort: true,
        })
    },
  )
})
