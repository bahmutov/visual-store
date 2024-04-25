import { LoginInfo } from '.'
import { LoginPage } from '@support/pages/login.page'

describe('Regular user', { viewportHeight: 1200 }, () => {
  beforeEach(() => {
    const user: LoginInfo = Cypress.env('users').standard
    LoginPage.login(user.username, user.password)
    cy.visit('/inventory')
  })

  it('loads the robot pic in the footer', () => {
    // get the footer robot image using its "alt" attribute
    // "Swag Bot Footer" and confirm it has loaded
    // Tip: use the "naturalWidth" property of the image
    // https://glebbahmutov.com/cypress-examples/recipes/image-loaded.html
  })

  it('loads every product image', () => {
    // iterate over every image in the inventory list
    // https://on.cypress.io/get
    // https://on.cypress.io/each
    // confirm the image element has loaded using its naturalWidth property
    // Tip: include the alt text in the assertion message
    cy.get('.inventory_container img').each(
      ($image: JQuery<HTMLImageElement>) => {
        // $image is a jQuery object with a single IMG element inside
      },
    )

    // now use a single visual assertion to capture the inventory list
    // do you see the robot claws picking from the top of the captured image?
    // can you remove that robot first before taking the screenshot
  })
})
