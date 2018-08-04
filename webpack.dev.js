const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')

const modules = fs.readdirSync('node_modules')

const dist = path.resolve(__dirname, 'dist')
const src = path.resolve(__dirname, 'src')

const ignores = [
  'vue-hot-reload-api'
]

const renames = {
  vue: 'Vue',
  lodash: '_',
  jquery: 'jQuery'
}

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: dist
  },
  module: {
    rules: [{
      include: [src],
      test: /\.js$/
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader',
        options: {
          sourceMap: true
        }
      }, {
        loader: 'css-loader'
      }]
    }, {
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.html$/,
      loader: 'html-loader'
    }]
  },
  externals: function (context, request, callback) {
    if(context === src && !ignores.includes(request) && modules.includes(request)) {
      const moduleDir = path.resolve(__dirname, 'node_modules', request)
      const pkg = require(path.resolve(moduleDir, 'package.json'))
      const modulePath = path.resolve(moduleDir, pkg.unpkg || pkg.main)
      console.log(modulePath)
      return callback(null, renames[request] || request)
    }
    callback()
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
}
