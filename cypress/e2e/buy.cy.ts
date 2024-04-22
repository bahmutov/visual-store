// use these selectors to find elements on the Login page
const selectors = {
  username: '[data-test="username"]',
  password: '[data-test="password"]',
  loginButton: '[data-test="login-button"]',
  error: '[data-test="error"]',
}
// use this selectors to fill the checkout form
const checkoutSelectors = {
  firstName: '[data-test="firstName"]',
  lastName: '[data-test="lastName"]',
  postalCode: '[data-test="postalCode"]',
  continueButton: '[data-test="continue"]',
}

describe('Store', () => {
  // image you have 3 image diffs to place anywhere in this test
  // where would you place them? Can you modify random CSS
  // in this application and see if the changes are detected?
  it('buys an item', () => {
    cy.visit('/')
    cy.get('.login_wrapper').should('be.visible')
    cy.get(selectors.username).type('standard_user')
    cy.get(selectors.password).type('secret_sauce')
    cy.get(selectors.loginButton).click()
    cy.location('pathname').should('equal', '/inventory')
    cy.get('.inventory_container').should('be.visible')
    cy.contains('button', 'Add to cart').click()
    cy.contains('.shopping_cart_badge', 1).should('be.visible')
    cy.get('a.shopping_cart_link').click()
    cy.location('pathname').should('equal', '/cart')
    cy.get('.cart_list').should('be.visible')
    cy.contains('button', 'Checkout').click()
    cy.location('pathname').should('equal', '/checkout-step-one')
    cy.get(checkoutSelectors.firstName).type('John')
    cy.get(checkoutSelectors.lastName).type('Doe')
    cy.get(checkoutSelectors.postalCode).type('90210')
    cy.get(checkoutSelectors.continueButton).click()
    cy.location('pathname').should('equal', '/checkout-step-two')
    cy.get('.checkout_summary_container').should('be.visible')
    cy.contains('button', 'Finish').click()
    cy.location('pathname').should('equal', '/checkout-complete')
    cy.get('.checkout_complete_container').should('be.visible')
  })
})
