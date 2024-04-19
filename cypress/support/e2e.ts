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

// import custom commands
import './commands'

// we need to know if we are running in interactive mode
// "cypress open" or in headless mode "cypress run
const interactiveMode = Cypress.config('isInteractive')

// only set the device metrics in headless mode
// in interactive mode we want to skip taking screenshots
// using Cypress.Commands.overwrite
// https://on.cypress.io/custom-commands
if (!interactiveMode) {
  before(() => {
    // set the browser to emulate a desktop device
    // with fixed dimensions and no device scale factor
    // https://chromedevtools.github.io/devtools-protocol/tot/Emulation/#method-setDeviceMetricsOverride
  })
} else {
  // use Cypress.Commands.overwrite()
}
