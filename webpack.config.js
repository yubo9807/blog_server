const path = require('path');
const { DefinePlugin } = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    server: './src/server.ts',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js'
  },
  target: 'node',
  externals: [nodeExternals()],
  mode: 'production',
  // devtool: 'eval-source-map',
  plugins: [
    new DefinePlugin({
      'process.env': {
        APP_ENV: JSON.stringify(process.env.APP_ENV),
      }
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
}