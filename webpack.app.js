const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const dist = path.resolve(__dirname, 'dist')
const src = path.resolve(__dirname, 'src')

function AddScriptsPlugin(options) {
}

AddScriptsPlugin.prototype.apply = function (compiler) {
  compiler.hooks.compilation.tap('AddScriptsPlugin', (compilation) => {
    compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
      'AddScriptsPlugin',
      (data, cb) => {
        const inject = '\n<script type="text/javascript" src="./vendor-dll.js"></script>\n'
        data.html = data.html.replace('</div>', '</div>' + inject)
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
  plugins: [
    new webpack.DllReferencePlugin({
      context: ".",
      manifest: require("./dist/vendor-manifest.json")
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new AddScriptsPlugin()
  ]
}
