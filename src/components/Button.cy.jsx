import React from 'react'
import Button from './Button'

it('shows a button', () => {
  cy.mount(<Button label="Test button" />)
  cy.contains('button', 'Test button')
  // before taking the screenshot, make the viewport just enough
  // to show the button by itself
  // Tip: get the getBoundingClientRect of the "html" element
  // and set the viewport to its width and height
  // https://on.cypress.io/viewport
  //
  cy.imageDiff('button-default')
})
