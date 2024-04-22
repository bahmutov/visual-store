// @ts-ignore
import path from 'path'

const goldImages = 'cypress/gold'

type ODiffResult =
  | { match: true }
  | { match: true; newImage: true; reason: 'Copied new image to gold' }
  | {
      match: false
      result: string
      reason: string
      diffPercentage: number
      diffImagePath: string
    }

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('prints the rendered font', () => {
    cy.get('.login_wrapper').should('be.visible')

    let screenshotPath: string
    cy.screenshot('login-page', {
      overwrite: true,
      onAfterScreenshot($el, screenshot) {
        screenshotPath = screenshot.path
      },
    }).then(() => {
      const specName = path.relative('cypress/e2e', Cypress.spec.relative)
      const diffName = path.join(specName, 'login-page.png')
      const goldPath = path.join(goldImages, diffName)
      cy.log(`diffing ${screenshotPath} against ${goldPath}`)
      cy.task<ODiffResult>('diffImage', { screenshotPath, goldPath }).then(
        (result) => {
          // report the image diffing result, which could be
          // 1: a new image (no previous gold image found)
          // 2: images match
          // 3: images do not match
          // In that case log the diff image path
          // and the percentage of different pixels
          // and then grab the diff image and insert it into the DOM
          // using cy.document and base64 encoded image
          // https://on.cypress.io/document
          // https://on.cypress.io/readfile
          // Tip: make sure to throw an error at the end to fail the test
          if (result.match === true) {
            if ('newImage' in result && result.newImage) {
              cy.log('✅ new image')
            } else {
              cy.log('✅ images match')
            }
          } else {
            cy.log('🔥 images do not match')
            if (result.reason === 'pixel-diff') {
              cy.log(`pixels different: ${result.diffPercentage}`)
              cy.log(result.diffImagePath)
              cy.readFile(result.diffImagePath, 'base64', {
                log: false,
              }).then((diffImage) => {
                cy.document({ log: false })
                  .its('body', { log: false })
                  .then((body) => {
                    body.innerHTML =
                      '<img style="width:100%" src="data:image/png;base64,' +
                      diffImage +
                      '"/>'
                    throw new Error('images do not match')
                  })
              })
            }
          }
        },
      )
    })
  })
})
