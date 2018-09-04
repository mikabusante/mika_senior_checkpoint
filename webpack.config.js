/* DO NOT EDIT */

const path = require('path');

module.exports = {
  entry: [
    'babel-polyfill', // enables async-await
    './client/index.js',
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'client')
        ],
        loader: 'babel-loader',
        options: {
          presets: ['react', 'env', 'stage-2']
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
};
