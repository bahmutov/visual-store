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

  it('tests the focused input element', () => {
    cy.mountWithRouter(<CartItem item={item} />)
    // find the input element with class "cart_quantity" and focus it
    // https://on.cypresss.io/focus
    // confirm the element is focused using an assertion "have.focus"
    //
    // before taking a screenshot, enable the focus emulation
    // using CDP protocol. This ensures that even if the browser
    // window itself is not focused (in the background),
    // the captured screenshot will show the focused element
    // https://chromedevtools.github.io/devtools-protocol/tot/Emulation/
    // https://github.com/bahmutov/cypress-cdp
    //
    // take the image diff of the current page
  })
})
