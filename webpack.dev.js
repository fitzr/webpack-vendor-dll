const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')

const modules = fs.readdirSync('node_modules')

const dist = path.resolve(__dirname, 'dist')
const src = path.resolve(__dirname, 'src')

const ignores = [
  'vue-hot-reload-api',
]

const renames = {
  vue: 'Vue',
  lodash: '_',
  jquery: 'jQuery',
  'element-ui': 'ELEMENT'
}

let modulePaths = new Set()

function AddScriptsPlugin(options) {
  // Configure your plugin with options...
}

AddScriptsPlugin.prototype.apply = function (compiler) {
  compiler.hooks.compilation.tap('AddScriptsPlugin', (compilation) => {
    compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
      'AddScriptsPlugin',
      (data, cb) => {
        const inject = [...modulePaths].map(p => `<script src="../node_modules/${p}"></script>`).join('\n')
        data.html = data.html.replace('</div>', '</div>\n' + inject)
        cb(null, data)
      }
    )
  })
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
    }, {
      test: /\.(woff|woff2|eot|ttf|svg)$/,
      loader: 'file-loader?name=font/[name].[ext]'
    }]
  },
  externals: function (context, request, callback) {
    if(context === src && !ignores.includes(request) && modules.includes(request)) {
      const moduleDir = path.resolve(__dirname, 'node_modules', request)
      const pkg = require(path.resolve(moduleDir, 'package.json'))
      const modulePath = path.join(request, pkg.unpkg || pkg.main)
      modulePaths.add(modulePath)
      console.log(modulePath)
      return callback(null, renames[request] || request)
    }
    callback()
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new AddScriptsPlugin()
  ]
}
