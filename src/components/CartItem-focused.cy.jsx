import React from 'react'
import CartItem from './CartItem'
import { InventoryData } from '../utils/InventoryData'
// want to make the item look just like the inventory list
// that is on the cart page?
// import the inventory list item CSS
import './InventoryListItem.css'
import { ShoppingCart } from '../utils/shopping-cart'

describe('CartItem', () => {
  beforeEach(() => {
    // set the shopping cart contents before the test starts
    ShoppingCart.setCartContents([{ id: 2, n: 1 }])
  })

  // Tip: when taking image diffs, I like prefixing them with
  // a number, like "00-component", "01-focused", "02-edited"
  // to make reviewing them easier

  // Tip 2: in the interactive mode "cypress open"
  // the browser must be visible in order for the focused
  // state to work. If you are editing the test file
  // while the browser is running in the background,
  // the focused state is NOT going to work
  it('changes the item quantity', () => {
    // pick an item from the inventory list
    const item = InventoryData[2]
    // mount the cart item (with the router), passing the item as a prop
    cy.mountWithRouter(<CartItem item={item} />)
    cy.get('.cart_item').should('be.visible')
    cy.imageDiff('00-CartItem')
    // confirm the item is on the page
    // and the quantity is 1 initially
    // and take an image diff with the input element focused
    // https://on.cypress.io/focus
    cy.get('.cart_item .cart_quantity').should('have.value', 1).focus()
    cy.imageDiff('01-CartItem-focused')
    // change the quantity to 5
    // https://on.cypress.io/type
    cy.get('.cart_item .cart_quantity').type('{selectAll}5')
    // and take another visual diff
    // confirm the input field has the new value 5
    cy.get('.cart_item .cart_quantity').should('have.value', 5)
    cy.imageDiff('02-CartItem-quantity-5')

    // try to delete the text to cause invalid number
    cy.get('.cart_item .cart_quantity')
      // https://on.cypress.io/type
      .type('{selectAll}{del}')
    // confirm the input field changes the value to 0
    cy.get('.cart_item .cart_quantity').should('have.value', 0)
    // and take another screenshot
    cy.imageDiff('03-CartItem-quantity-0')
  })
})
