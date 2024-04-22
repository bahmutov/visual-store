const { defineConfig } = require('cypress')
const registerDataSession = require('cypress-data-session/src/plugin')
// https://github.com/bahmutov/cypress-split
const cypressSplit = require('cypress-split')
// https://github.com/bahmutov/cypress-on-fix
const cypressOnFix = require('cypress-on-fix')
const path = require('path')
const fs = require('fs')
const { compare } = require('odiff-bin')

module.exports = defineConfig({
  e2e: {
    // baseUrl, etc
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    experimentalRunAllSpecs: true,
    env: {
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
    },
    setupNodeEvents(cypressOn, config) {
      // fix https://github.com/cypress-io/cypress/issues/22428
      const on = cypressOnFix(cypressOn)
      // implement node event listeners here
      // and load any plugins that require the Node environment
      // https://github.com/bahmutov/cypress-split
      cypressSplit(on, config)
      registerDataSession(on, config)
      // https://github.com/bahmutov/cypress-watch-and-reload
      require('cypress-watch-and-reload/plugins')(on, config)

      on('task', {
        async diffImage(options) {
          if (!options) {
            throw new Error('Missing diff options')
          }
          const { screenshotPath, goldPath } = options
          if (!fs.existsSync(goldPath)) {
            console.log('New image %s', screenshotPath)
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
            const options = {
              diffColor: '#ff00ff', // cyan
              antialiasing: true,
              threshold: 0.1,
            }
            const result = await compare(
              goldPath,
              screenshotPath,
              diffImagePath,
              options,
            )
            console.log('diffing %s and %s', screenshotPath, goldPath)
            console.log('with result diff in image %s', diffImagePath)
            console.dir(result)
            return {
              ...result,
              diffImagePath,
            }
          }
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
