// webpack.config.js
const path = require('path');
const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  plugins: [
    new NxAppWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'babel',
      main: './src/main.tsx', // ✅ main entry
      index: './src/index.html',
      baseHref: '/',
      assets: ['./src/favicon.ico', './src/assets'],
      styles: ['./src/styles.scss'],
      outputHashing: process.env.NODE_ENV === 'production' ? 'all' : 'none',
      optimization: process.env.NODE_ENV === 'production',
    }),

    new NxReactWebpackPlugin(),

    new webpack.DefinePlugin({
      'process.env.REACT_APP_GOOGLE_CLIENT_ID': JSON.stringify(
        process.env.REACT_APP_GOOGLE_CLIENT_ID
      ),
    }),
  ],

  /**
   * ✅ Added: Serve static HTML, CSS, JS, videos directly from /public
   */
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [
        // ✅ Allow direct access to HTML pages in /public/pages/
        {
          from: /^\/pages\/.*$/,
          to: (context) => context.parsedUrl.pathname,
        },
        // ✅ Allow /assets/ and /videos/ to be served directly
        {
          from: /^\/assets\/.*$/,
          to: (context) => context.parsedUrl.pathname,
        },
        {
          from: /^\/videos\/.*$/,
          to: (context) => context.parsedUrl.pathname,
        },
      ],
    },
  },
};
