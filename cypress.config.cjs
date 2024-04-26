const { defineConfig } = require('cypress')
const registerDataSession = require('cypress-data-session/src/plugin')
// https://github.com/bahmutov/cypress-split
const cypressSplit = require('cypress-split')
// https://github.com/bahmutov/cypress-on-fix
const cypressOnFix = require('cypress-on-fix')

const viteConfig = require('./vite.config.ts').default
const { initImageDiffing } = require('./image-diff.cjs')

module.exports = defineConfig({
  // for now Cypress component testing works with Vite v4
  // and does not support Vite v5 yet
  // https://github.com/cypress-io/cypress/issues/28347
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

      initImageDiffing(on, config)

      // IMPORTANT to return the config object
      // with the any changed environment variables
      return config
    },
  },

  component: {
    specPattern: ['src/components/**/*.cy.jsx', 'src/pages/**/*.cy.jsx'],
    supportFile: 'cypress/support/component.jsx',
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig,
    },
    setupNodeEvents(on, config) {
      initImageDiffing(on, config)
      return config
    },
  },
})
