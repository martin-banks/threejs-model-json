'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const baseEnv = process.env.NODE_ENV
const project = require('../src/content/project.json').name

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

function getPublicPath () {
  if (baseEnv === 'production' || baseEnv === 'PROD') return config.build.assetsPublicPath
  // if (baseEnv === 'UAT') return `${config.build.assetsPublicPath}${project}/`
  if (baseEnv === 'UAT') return config.build.assetsPublicPath
  return config.dev.assetsPublicPath
}
console.log('config', JSON.stringify(config, 'utf-8', 2))
console.log({ baseEnv, assetsPublicPath: config.build.assetsPublicPath, project }, getPublicPath())


// Exported config
module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: getPublicPath()
    // publicPath: (baseEnv === 'production' || baseEnv === 'PROD' || baseEnv === 'UAT')
    //   ? config.build.assetsPublicPath
    //   : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      // {
      //   test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      //   loader: 'url-loader',
      //   options: {
      //     limit: 10000,
      //     name: utils.assetsPath('[path]/img/[name].[hash:7].[ext]')
      //   }
      // },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        // unique name generated to prevent naming confilcts of images from multiple sources (eg, portrait/landscape dirs)
        // filename__6characterRandomString
        loader: 'file-loader',
        options: {
          name: utils.assetsPath('[path][name].[hash:7].[ext]'),
        },
        // use: 'file-loader?hash=sha512&digest=hex&name=[path][name]__[hash:7].[ext]',
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(obj)(\?.*)?$/,
        // test: /\.obj$/,
        loader: 'webpack-obj-loader',
      },
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}