import { LoginPage } from '@support/pages/login.page'
import { InventoryPage } from '@support/pages/inventory.page'
import { LoginInfo } from '..'

describe('Cart', () => {
  // create a small type on the fly using jsdoc comment
  // just to help type check help us
  const user: LoginInfo = Cypress.env('users').standard
  // we can even check if the user object is valid
  if (!user) {
    throw new Error('Missing the standard user')
  }

  // before each test, quickly login the user
  // or restore the previous user session
  beforeEach(() => {
    LoginPage.login(user.username, user.password)
    cy.visit('/inventory')
    cy.location('pathname').should('equal', '/inventory')
  })

  it(
    'adds items to the cart',
    { viewportHeight: 1200, tags: '@visual' },
    () => {
      // confirm the cart badge does not exist at first
      InventoryPage.getCartBadge().should('not.exist')

      // add the item "Sauce Labs Bike Light" to the cart
      // by clicking the button "Add to cart"
      InventoryPage.addItemToCart('Sauce Labs Bike Light')
      cy.contains('.inventory_item', 'Sauce Labs Bike Light').within(() => {
        // the button should switch to "Remove"
        cy.contains('button', 'Add to cart').should('not.exist')
        cy.contains('button', 'Remove')
      })
      // the shopping cart link should have number 1
      InventoryPage.getCartBadge()
        .should('have.text', 1)
        .scrollIntoView()
        .should('be.visible')

      cy.vrtTrack('1-one-item-in-cart')
      // cy.imageDiff('1-one-item-in-cart', {
      //   mode: 'sync',
      //   ignoreElements: ['.header_secondary_container', 'footer'],
      // })

      // add the item "Sauce Labs Bolt T-Shirt" to the cart
      // by clicking the button "Add to cart"
      InventoryPage.addItemToCart('Sauce Labs Bolt T-Shirt')
      cy.contains('.inventory_item', 'Sauce Labs Bolt T-Shirt').within(() => {
        // the button should switch to "Remove"
        cy.contains('button', 'Add to cart').should('not.exist')
        cy.contains('button', 'Remove')
      })
      // the shopping cart link should have number 2
      // tip: use https://on.cypress.io/scrollintoview command
      // to bring the shopping cart element into the viewport
      InventoryPage.getCartBadge()
        .should('have.text', 2)
        .scrollIntoView()
        .should('be.visible')
      // there should be two buttons with text "Remove"
      // on the inventory page
      // https://glebbahmutov.com/cypress-examples/#querying
      cy.get('.inventory_item:contains("Remove")').should('have.length', 2)

      cy.vrtTrack('2-two-items-in-cart')
      // cy.imageDiff('2-two-items-in-cart', {
      //   mode: 'sync',
      //   ignoreElements: ['.header_secondary_container', 'footer'],
      // })
    },
  )
})
