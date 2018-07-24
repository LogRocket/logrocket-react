// Karma configuration
// Generated on Wed Jun 08 2016 15:19:09 GMT-0400 (EDT)
const path = require('path');
const webpack = require('webpack');

module.exports = function(config) {
  const customLaunchers = {
    bs_chrome_53_windows_10: {
      base: 'BrowserStack',
      browser: 'chrome',
      browser_version: '53',
      os: 'Windows',
      os_version: '10',
    },
    bs_firefox_47_windows_10: {
      base: 'BrowserStack',
      browser: 'firefox',
      browser_version: '47',
      os: 'Windows',
      os_version: '10',
    },
    bs_safari_10_osx_sierra: {
      base: 'BrowserStack',
      browser: 'safari',
      browser_version: '10.0',
      os: 'OS X',
      os_version: 'Sierra',
    },
    bs_ie_11_windows_10: {
      base: 'BrowserStack',
      browser: 'IE',
      browser_version: '11',
      os: 'Windows',
      os_version: '10',
    },
  };

  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    frameworks: ['mocha', 'sinon'],
    mochaReporter: {
      showDiff: true
    },

    // list of files / patterns to load in the browser
    files: [
      './test/allTests.js',
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './test/allTests.js': ['webpack']
    },

    // list of files to exclude
    exclude: [
    ],

    webpack: {
      // devtool: 'eval-source-map',
      module: {
        loaders: [{
          test: /\.js$/,
          loaders: ['babel-loader'],
          exclude: /.*node_modules/,
        }, {
          test: /\.json$/,
          loaders: ['json-loader'],
        }],
      },

      noInfo: true,
      externals: {
        'cheerio': 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true,
      },
    },

    webpackMiddleware: {
      noInfo: true
    },

    reporters: ['mocha', 'junit'].concat(process.env.COVERAGE ? ['coverage'] : []),
    coverageReporter: {
      type: 'lcov',
      // dir: 'coverage',
      // file: 'coverage.json',
    },

    junitReporter: {
      outputDir: process.env.CIRCLE_TEST_REPORTS || 'reports',
      outputFile: 'benchmark.xml',
    },

    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    browserConsoleLogOptions: {
      terminal: false,
    },

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: process.env.CI ? Object.keys(customLaunchers) : ['Chrome'],

    // For when we get BrowserStack running again:
    browserStack: {
      project: 'LogRocket React',
      name: 'LogRocket Karma Tests',
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
      startTunnel: false,
      tunnelIdentifier: process.env.BROWSERSTACK_TUNNEL_IDENTIFIER,
    },

    browserNoActivityTimeout: 1000000,
    captureTimeout: 120000,
    // browserDisconnectTimeout: 1000000,
    browserDisconnectTolerance: 3,

    timeout: 12000000,
    customLaunchers: customLaunchers,

    client: {
      captureConsole: false,
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: process.env.CI ? true : false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  });
}
