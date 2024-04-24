/// <reference types="cypress" />

type ImageDiffOptions = { mode: 'sync' | 'async' }

declare namespace Cypress {
  interface Chainable {
    /**
     * Takes the page screenshot and compares it to the gold image
     * using the cy.task "diffImage". If the image is new (per-platform)
     * then it is copied to the "cypress/gold" folder.
     * If the image does not match, throws an error. The diff images
     * are saved to the screenshots folder.
     * @example
     *  cy.imageDiff('landing-page')
     */
    imageDiff(name: string, options: ImageDiffOptions): void

    /**
     * Fill the current form (the parent subject)
     * with the given values. The argument is an object
     * with the keys being selectors and values being the strings
     * to type into the input fields.
     * @example
     *  cy.get('form').fillForm({ '#name': 'Joe' }).submit()
     */
    fillForm(selectorsValues: object): Chainable<JQuery<HTMLFormElement>>

    /**
     * Returns elements that have "data-test" attribute with the given value
     * @example
     *  getByTest('checkout').should('be.visible')
     */
    getByTest(testId: string): Chainable<JQuery<HTMLElement>>
  }
}
