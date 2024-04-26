// @ts-check
const path = require('path')
const fs = require('fs')
const { compare } = require('odiff-bin')
// @ts-expect-error
const _ = require('lodash')
const pluralize = require('pluralize')
const ghCore = require('@actions/core')
require('console.table')
const fastify = require('fastify')

async function diffAnImage(options, config) {
  if (!options) {
    throw new Error('Missing diff options')
  }
  const { screenshotPath, goldPath } = options
  if (!fs.existsSync(goldPath)) {
    console.log('New image %s', screenshotPath)
    if (config.env.failOnMissingGoldImage) {
      console.error('Missing gold image %s', goldPath)
      console.error(
        'Adding new gold images not allowed failOnMissingGoldImage=true',
      )
      throw new Error(`Missing gold image ${goldPath}`)
    }

    console.log('Copied to %s', goldPath)
    // ensure the target folder exists
    const goldFolder = path.dirname(goldPath)
    if (!fs.existsSync(goldFolder)) {
      fs.mkdirSync(goldFolder, { recursive: true })
      console.log('Created folder %s', goldFolder)
    }
    fs.copyFileSync(screenshotPath, goldPath)
    return {
      match: true,
      newImage: true,
      reason: 'Copied new image to gold',
    }
  } else {
    const basename = path.basename(screenshotPath, '.png')
    const diffImagePath = path.join(
      config.screenshotsFolder,
      `${basename}-diff.png`,
    )
    const odiffOptions = {
      diffColor: '#ff00ff', // cyan
      antialiasing: true,
      threshold: 0.1,
      ignoreRegions: options.ignoreRegions,
    }
    const result = await compare(
      goldPath,
      screenshotPath,
      diffImagePath,
      odiffOptions,
    )
    if (options.ignoreRegions && options.ignoreRegions.length) {
      console.log(
        'diffing %s and %s with %d ignored regions',
        screenshotPath,
        goldPath,
        options.ignoreRegions.length,
      )
    } else {
      console.log('diffing %s and %s', screenshotPath, goldPath)
    }
    console.log('with result diff in image %s', diffImagePath)
    console.dir(result)

    // if we work on a PR we want to update the Gold images
    // so that the user reviews the changes
    if (result.match === false && config.env.updateGoldImages) {
      console.log('Updating gold image %s', goldPath)
      fs.copyFileSync(screenshotPath, goldPath)
      result.match = true
      result.reason = 'Updated gold image'
    }

    return {
      ...result,
      diffImagePath,
    }
  }
}

function initImageDiffing(on, config) {
  // Create a local server to receive image approval
  const server = fastify({ logger: true })
  server.options('/approve', (req, res) => {
    res
      .headers({
        Allow: 'OPTIONS, POST',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'content-type',
      })
      .status(200)
      .send()
  })

  server.post('/approve', async (req, res) => {
    const options = req.body
    const { screenshotPath, goldPath } = options
    console.log(
      '👍 User approved image %s to replace %s',
      screenshotPath,
      goldPath,
    )
    // ensure the target folder exists
    const goldFolder = path.dirname(goldPath)
    if (!fs.existsSync(goldFolder)) {
      fs.mkdirSync(goldFolder, { recursive: true })
      console.log('Created folder %s', goldFolder)
    }
    fs.copyFileSync(screenshotPath, goldPath)

    res
      .headers({
        'access-control-allow-origin': '*',
        'access-control-request-headers': 'Content-Type',
      })
      .send({ status: 'ok' })
  })
  server.listen({ port: 9555 }).then(() => {
    console.log('image server listening on port 9555')
  })

  const imagesToDiff = []
  on('before:run', () => {
    imagesToDiff.length = 0
  })
  on('after:run', async () => {
    if (imagesToDiff.length) {
      console.log('Need to diff %d images', imagesToDiff.length)
      const bySpec = _.groupBy(imagesToDiff, (o) => o.relativeSpecName)
      const specNames = Object.keys(bySpec)

      const specsText = pluralize('spec', specNames.length, true)
      const imagesText = pluralize('image', imagesToDiff.length, true)
      const title = `Visual testing: ${specsText}, ${imagesText}`
      if (process.env.GITHUB_ACTIONS) {
        ghCore.summary.addHeading(title)
      } else {
        console.log(title)
      }

      let newImages = 0
      let matchingImages = 0
      let differentImages = 0

      for (const specName of specNames) {
        console.log('diffing images for spec %s', specName)
        const images = bySpec[specName]
        // output github summary rows for this spec
        const rows = []

        for (const options of images) {
          const result = await diffAnImage(options, config)
          if (result.newImage) {
            newImages += 1
            rows.push(['🖼️', options.name, '--'])
          } else if (result.match === true) {
            matchingImages += 1
            rows.push(['✅', options.name, '--'])
          } else {
            differentImages += 1
            rows.push(['❌', options.name, result.diffPercentage.toFixed(3)])
          }
        }

        if (process.env.GITHUB_ACTIONS) {
          ghCore.summary.addHeading(specName, 2).addTable([
            [
              { data: 'Status', header: true },
              { data: 'Name', header: true },
              { data: 'Diff %', header: true },
            ],
            ...rows,
          ])
        } else {
          console.log('spec %s', specName)
          console.table(['Status', 'Name', 'Diff %'], rows)
        }
      }

      // end of all diffing
      const countsText = `Visual testing: ${newImages} 🖼️ ${matchingImages} ✅ ${differentImages} ❌`
      if (process.env.GITHUB_ACTIONS) {
        ghCore.summary.addRaw(countsText, true).write()
        // set the job outputs
        ghCore.setOutput('new_images', newImages)
        ghCore.setOutput('matching_images', matchingImages)
        ghCore.setOutput('different_images', differentImages)
        const countsWords = `${newImages} new images ${matchingImages} matching ${differentImages} different`
        ghCore.setOutput('visual_description', countsWords)
        // match the github action status
        ghCore.setOutput(
          'visual_status',
          differentImages > 0 ? 'failure' : 'success',
        )
      } else {
        console.log(countsText)
      }
    }
  })

  on('task', {
    rememberToDiffImage(options) {
      const { screenshotPath, goldPath } = options
      console.log(
        '💾 Remember to diff images\n - %s\n - %s',
        screenshotPath,
        goldPath,
      )
      imagesToDiff.push(options)
      return null
    },

    approveImage(options) {
      const { screenshotPath, goldPath } = options
      console.log(
        '👍 User approved image %s to replace %s',
        screenshotPath,
        goldPath,
      )
      // ensure the target folder exists
      const goldFolder = path.dirname(goldPath)
      if (!fs.existsSync(goldFolder)) {
        fs.mkdirSync(goldFolder, { recursive: true })
        console.log('Created folder %s', goldFolder)
      }
      fs.copyFileSync(screenshotPath, goldPath)

      return null
    },

    diffImage(options) {
      return diffAnImage(options, config)
    },
  })
}

module.exports = { initImageDiffing }