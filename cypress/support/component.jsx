import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom'
import { mount } from 'cypress/react'

// https://github.com/bahmutov/cypress-map
import 'cypress-map'
// https://github.com/bahmutov/cypress-cdp
import 'cypress-cdp'
// import custom commands
import './commands'

Cypress.Commands.add('mount', mount)

Cypress.Commands.add('mountWithRouter', (Component) => {
  return mount(
    <BrowserRouter initialEntries={[]}>
      <Route>{Component}</Route>
    </BrowserRouter>,
  )
})
