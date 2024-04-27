import React from 'react'
import CartItem from './CartItem'
import { InventoryData } from '../utils/InventoryData'
import './InventoryListItem.css'
import { ShoppingCart } from '../utils/shopping-cart'

describe('CartItem', () => {
  const item = InventoryData[2]

  beforeEach(() => {
    // set the shopping cart contents before the test starts
    ShoppingCart.setCartContents([{ id: item.id, n: 1 }])
  })

  it('removes the item from the cart', () => {
    // mount the cart item (with the router), passing the item as a prop
    // and pass the "showButton: true" prop
    cy.mountWithRouter(<CartItem item={item} showButton={true} />)
    // confirm using a functional assertion that "Remove" button is visible
    cy.contains('button', 'Remove').should('be.visible')
    // take a snapshot of the cart item
    cy.imageDiff('CartItem-remove-button')

    // spy on the "ShoppingCart.removeItem" method
    // https://on.cypress.io/spy
    // and give the spy an alias "removeItem"
    // https://on.cypress.io/as
    // https://glebbahmutov.com/cypress-examples/commands/spies-stubs-clocks.html
    cy.spy(ShoppingCart, 'removeItem').as('removeItem')
    // click the "Remove" button
    cy.contains('button', 'Remove').click()
    // confirm the entire cart item is gone
    cy.get('.cart_item').should('not.exist')
    cy.get('.removed_cart_item')
    // confirm the spy was called with the correct arguments
    cy.get('@removeItem').should('have.been.calledWithExactly', item.id)
  })
})
