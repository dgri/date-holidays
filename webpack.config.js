const path = require('path')
const fs = require('fs')
const webpack = require('webpack')

// -- Webpack configuration --

const config = {}

// Application entry point

// We build for node
config.target = 'node'

// Node module dependencies should not be bundled
config.externals = fs.readdirSync('node_modules')
  .reduce(function(acc, mod) {
    if (mod === '.bin') {
      return acc
    }

    acc[mod] = 'commonjs ' + mod
    return acc
  }, {})


// Output files in the build/ folder

config.resolve = {
  extensions: [
    '.js',
    '.json',
  ],
}

config.module = {}

config.module.rules = [

  // Use babel and eslint to build and validate JavaScript
  {
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      loader: 'babel-loader'
    }
  }
]

config.plugins = [
  // new webpack.optimize.UglifyJsPlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
]

let configLibrary = Object.assign({}, config)
configLibrary.entry = './src/index.js'
configLibrary.output = {
  path: path.join(__dirname, 'build'),
  libraryTarget: 'umd',
  // umdNamedDefine: true,
  filename: 'index.js',
}
// We are outputting a real node app!
configLibrary.node = {
  console: false,
  global: false,
  process: false,
  Buffer: false,
  __filename: false,
  __dirname: false,
}

module.exports = configLibrary
