var path = require('path')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'inline-source-map',
  bail: true,
  entry: {
    contentScript: path.join(__dirname, 'contentScript.ts'),
    background: path.join(__dirname, 'background.ts'),
    inpage: path.join(__dirname, 'inpage.ts'),
    'hot-reload': path.join(__dirname, 'hot-reload.js'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.join(__dirname, '..', 'build'),
    filename: '[name].js',
  },
}
