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

  it('changes the item quantity', () => {
    // pick an item from the inventory list
    const item = InventoryData[2]
    // mount the cart item (with the router), passing the item as a prop
    cy.mountWithRouter(<CartItem item={item} />)
    // confirm the item is on the page
    // and the quantity is 1 initially
    // and we change it to 5
    cy.get('.cart_item .cart_quantity')
      .should('have.value', 1)
      // https://on.cypress.io/type
      .type('{selectAll}5')
    // confirm the input field has the new value 5
    cy.get('.cart_item .cart_quantity').should('have.value', 5)
    // try to delete the text to cause invalid number
    cy.get('.cart_item .cart_quantity')
      // https://on.cypress.io/type
      .type('{selectAll}{del}')
    // confirm the input field changes the value to 0
    cy.get('.cart_item .cart_quantity').should('have.value', 0)
  })
})
