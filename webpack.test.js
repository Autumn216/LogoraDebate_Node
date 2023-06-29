const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  target: 'node',
  externals: [nodeExternals({
    modulesFromFile: {
        excludeFromBundle: ['devDependencies']
    }
  })],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss', '.css'],
  },
  module: {
    rules: [
      {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
              loader: 'babel-loader',
              options: {
                  cacheDirectory: true
              }
          }
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
          test: /\.html$/,
          loader: "html-loader",
      },
      {
          test: /\.(css|less)$/,
          use: [{
              loader: MiniCssExtractPlugin.loader
          }, 'css-loader', 'postcss-loader']
      },
      {
          test: /\.module\.scss$/,
          use: [{
              loader: 'css-loader',
              options: {
                  modules: {
                      exportOnlyLocals: true,
                      localIdentName: '[hash:base64:5]'
                  }
              }
          }, {
              loader: 'postcss-loader'
          }, {
              loader: 'sass-loader'
          }]
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: '[name].css',
    })
  ]
};