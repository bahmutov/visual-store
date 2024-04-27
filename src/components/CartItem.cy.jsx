import React from 'react'
import CartItem from './CartItem'
import { InventoryData } from '../utils/InventoryData'
// want to make the item look just like the inventory list
// that is on the cart page?
// import the inventory list item CSS
// import './InventoryListItem.css'
import { ShoppingCart } from '../utils/shopping-cart'

describe('CartItem', () => {
  beforeEach(() => {
    // set the shopping cart contents before the test starts
    ShoppingCart.setCartContents([{ id: 2, n: 1 }])
  })

  // Tip: when taking image diffs, I like prefixing them with
  // a number, like "00-component", "01-focused", "02-edited"
  // to make reviewing them easier

  it('changes the item quantity', () => {
    // pick an item from the inventory list
    const item = InventoryData[2]
    // mount the cart item (with the router), passing the item as a prop
    cy.mountWithRouter(<CartItem item={item} />)
    // confirm the item is on the page
    // and the quantity is 1 initially
    // and take an image diff
    //
    // change the quantity to 5
    // https://on.cypress.io/type
    //
    // confirm the input field has the new value 5
    // and take another visual diff
    // Tip: to avoid focus changing between "cypress open" and "cypress run"
    // remove the focus from the element after typing
    // https://on.cypress.io/blur
    //
    // try to delete the number text to cause an invalid number
    // https://on.cypress.io/type
    //
    // confirm the input field changes the value to 0
    // again: make sure to blur the input field to avoid focus changing
    // and take another screenshot
  })
})
