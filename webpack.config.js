// webpack.config.js
const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  plugins: [
    new NxAppWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'babel',
      main: './src/main.tsx',        // ✅ This is the "main" entry
      index: './src/index.html',
      baseHref: '/',
      assets: ['./src/favicon.ico', './src/assets'],
      styles: ['./src/styles.scss'],
      outputHashing: process.env.NODE_ENV === 'production' ? 'all' : 'none',
      optimization: process.env.NODE_ENV === 'production',
    }),
    new NxReactWebpackPlugin({
      // svgr: false // uncomment only if you don't want SVG as React components
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_GOOGLE_CLIENT_ID': JSON.stringify(
        process.env.REACT_APP_GOOGLE_CLIENT_ID
      ),
    }),
  ],
};