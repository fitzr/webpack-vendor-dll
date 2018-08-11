const fs = require('fs')
const readLine = require('readline')

const VENDOR_CHUNK_PATH = './dist/vendor-chunk.bundle.js'
const WEBPACK_CONFIG_PATH = './webpack.vendor-dll.js'

// pick up entries from vendor chunk file

function readEntries () {
  return new Promise (resolve => {
    const rs = fs.createReadStream(VENDOR_CHUNK_PATH)
    const rl = readLine.createInterface(rs)
    const entries = []

    rl.on('line', (line) => {
      if (line.startsWith('/***/ "./node_modules')) {
        const path = line.slice(7, -2)
        if (path.endsWith('.js')) {
          entries.push(path)
        }
      }
    }).on('close', () => {
      resolve(entries)
    })
  })
}


// make webpack config to build vendor dll

function writeWebpackConfig (entries) {
  const ws = fs.createWriteStream(WEBPACK_CONFIG_PATH)
  ws.write(CONTENT1)
  ws.write(entries.map(entry => `    '${entry}',`).join('\n'))
  ws.write(CONTENT2)
  ws.end()
}

const CONTENT1 = `
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: "development",
  context: __dirname,
  entry: [
`
const CONTENT2 = `
  ],
  output: {
    filename: "vendor-dll.js", // best use [hash] here too
    path: path.resolve(__dirname, "dist"),
    library: "vendor_lib_[hash]"
  },
  plugins: [
    new webpack.DllPlugin({
      name: "vendor_lib_[hash]",
      path: path.resolve(__dirname, "dist/vendor-manifest.json")
    })
  ]
}
`

// exe

async function execute () {
  const entries = await readEntries()
  writeWebpackConfig(entries)

  console.log('Generate webpack vendor conf finished successfully.')
}

execute()
