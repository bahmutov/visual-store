// @ts-ignore
import path from 'path'

const goldImages = 'cypress/gold'

type ODiffResult =
  | { match: true; reason?: string }
  | { match: true; newImage: true; reason: 'Copied new image to gold' }
  | {
      match: false
      result: string
      reason: string
      diffPercentage: number
      diffImagePath: string
    }

Cypress.Commands.add('imageDiff', (name: string) => {
  // grab the real screenshot path
  let screenshotPath: string
  cy.screenshot(name, {
    overwrite: true,
    onAfterScreenshot($el, screenshot) {
      screenshotPath = screenshot.path
    },
    log: false,
  }).then(() => {
    const rootFolder = Cypress.config('projectRoot')
    const specName = path.relative(rootFolder, Cypress.spec.absolute)

    const diffNameDirname = specName
    const goldNameFolder = diffNameDirname
      .replaceAll('/', '-')
      .replaceAll('.', '-')

    const goldPath = path.join(goldImages, goldNameFolder, Cypress.platform)
    const diffName = path.join(goldPath, `${name}.png`)
    const relativeScreenshotPath = path.relative(rootFolder, screenshotPath)

    cy.log(`diffing ${relativeScreenshotPath} against ${diffName}`)
    cy.task<ODiffResult>('diffImage', {
      screenshotPath: relativeScreenshotPath,
      goldPath: diffName,
    }).then((result) => {
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
          if (result.reason) {
            cy.log(result.reason)
          }
        }
      } else {
        cy.log('🔥 images do not match')
        if (result.reason === 'pixel-diff') {
          cy.log(`pixels different: ${result.diffPercentage}`)
          const relativeDiffPath = path.relative(
            rootFolder,
            result.diffImagePath,
          )
          cy.log(relativeDiffPath)
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
    })
  })
})

Cypress.Commands.add(
  'fillForm',
  // @ts-ignore
  { prevSubject: 'element' },
  ($form, inputs) => {
    cy.wrap($form, { log: false }).within(() => {
      // iterate over the input fields
      // and type into each selector (key) the value
      Cypress._.forEach(inputs, (value, selector) => {
        cy.get(selector).type(value)
        // confirm the input has been set correctly
        cy.get(selector).should('have.value', value)
      })

      Cypress._.forEach(inputs, (value, selector) => {
        // confirm the input still holds the entered value
        cy.get(selector).should('have.value', value)
      })
    })
  },
)

Cypress.Commands.add('getByTest', (testId) => {
  const log = Cypress.log({ name: 'getByTest', message: testId })
  // query the elements by the "data-test=..." attribute
  cy.get(`[data-test="${testId}"]`)
})
