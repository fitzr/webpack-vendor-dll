const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const dist = path.resolve(__dirname, 'dist')
const src = path.resolve(__dirname, 'src')

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
  optimization: {
    splitChunks: {
      name: 'vendor-chunk',
      chunks: 'initial',
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
  ]
}
