import React from 'react'
import 'cypress-map'
import { Route, BrowserRouter } from 'react-router-dom'
import { mount } from 'cypress/react'

Cypress.Commands.add('mount', mount)
