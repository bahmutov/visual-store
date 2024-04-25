// first import the 3rd party Cypress plugins
// to make them available in every command

// https://github.com/bahmutov/cypress-data-session
import 'cypress-data-session'
// https://github.com/bahmutov/cypress-map
import 'cypress-map'
// https://github.com/bahmutov/cypress-cdp
import 'cypress-cdp'

// @ts-ignore
require('cypress-watch-and-reload/support')

// @ts-ignore
import registerCypressGrep from '@bahmutov/cy-grep'

// import custom commands
import './commands'

registerCypressGrep()
