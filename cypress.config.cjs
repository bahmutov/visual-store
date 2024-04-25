const { defineConfig } = require('cypress')
const registerDataSession = require('cypress-data-session/src/plugin')
// https://github.com/bahmutov/cypress-split
const cypressSplit = require('cypress-split')
// https://github.com/bahmutov/cypress-on-fix
const cypressOnFix = require('cypress-on-fix')
const path = require('path')
const fs = require('fs')
const { compare } = require('odiff-bin')
const _ = require('lodash')
const pluralize = require('pluralize')
const ghCore = require('@actions/core')
require('console.table')
const {
  addVisualRegressionTrackerPlugin,
} = require('@visual-regression-tracker/agent-cypress')

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

module.exports = defineConfig({
  e2e: {
    // baseUrl, etc
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    experimentalRunAllSpecs: true,
    viewportHeight: 1200,
    scrollBehavior: 'center',
    env: {
      grepFilterSpecs: true,
      grepOmitFiltered: true,
      users: {
        standard: {
          username: 'standard_user',
          password: 'secret_sauce',
        },
        lockedOut: {
          username: 'locked_out_user',
          password: 'secret_sauce',
        },
        problem: {
          username: 'problem_user',
          password: 'secret_sauce',
        },
        glitch: {
          username: 'performance_glitch_user',
          password: 'secret_sauce',
        },
      },
      // list the files and file patterns to watch
      'cypress-watch-and-reload': {
        watch: ['src/**'],
      },
      visualRegressionTracker: {
        // URL where backend is running
        // Required
        apiUrl: 'http://localhost:4200',

        // Project name or ID
        // Required
        project: 'visual-store',

        // User apiKey
        // Required
        apiKey: 'DEFAULTUSERAPIKEYTOBECHANGED',

        // Current git branch
        // Required
        branchName: 'e3-solution',

        // Branch with baseline
        // Optional - when not set, main branch from project settings is used
        baselineBranchName: 'e3-solution',

        // Log errors instead of throwing exceptions
        // Optional - default false
        // enableSoftAssert: true,
      },
    },
    setupNodeEvents(cypressOn, config) {
      // fix https://github.com/cypress-io/cypress/issues/22428
      // const on = cypressOnFix(cypressOn)
      const on = cypressOn
      // implement node event listeners here
      // and load any plugins that require the Node environment
      // https://github.com/bahmutov/cypress-split
      // cypressSplit(on, config)
      // registerDataSession(on, config)
      // https://github.com/bahmutov/cypress-watch-and-reload
      require('cypress-watch-and-reload/plugins')(on, config)

      // https://github.com/bahmutov/cy-grep
      require('@bahmutov/cy-grep/src/plugin')(config)

      addVisualRegressionTrackerPlugin(on, config)

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
                rows.push([
                  '❌',
                  options.name,
                  result.diffPercentage.toFixed(3),
                ])
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

      // IMPORTANT to return the config object
      // with the any changed environment variables
      return config
    },
  },

  component: {
    // TODO: update to React + Vite
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
      webpackConfig: {
        resolve: {
          alias: {
            '@cypress': path.resolve(__dirname, 'cypress'),
          },
        },
        mode: 'development',
        devtool: false,
        module: {
          rules: [
            // application and Cypress files are bundled like React components
            // and instrumented using the babel-plugin-istanbul
            {
              test: /\.jsx?$/,
              // do not instrument node_modules
              // or Cypress component specs
              exclude: /node_modules|\.cy\.js/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env', '@babel/preset-react'],
                  plugins: ['istanbul'],
                },
              },
            },
          ],
        },
      },
    },
  },
})
