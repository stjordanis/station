var path = require('path')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'inline-source-map',
  bail: true,
  entry: {
    contentScript: path.join(__dirname, 'contentScript.ts'),
    background: path.join(__dirname, 'background.ts'),
    inpage: path.join(__dirname, 'inpage.ts'),
  },
  output: {
    path: path.join(__dirname, '..', 'build'),
    filename: '[name].js',
  },
}
