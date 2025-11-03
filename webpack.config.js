// webpack.config.js
const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { NxAppWebpackPlugin } = require("@nx/webpack/app-plugin");
const { NxReactWebpackPlugin } = require("@nx/react/webpack-plugin");
require("dotenv").config();

module.exports = {
  plugins: [
    new NxAppWebpackPlugin({
      tsConfig: "./tsconfig.app.json",
      compiler: "babel",
      main: "./src/main.tsx",
      index: "./src/index.html",
      baseHref: "/",
      assets: ["./src/favicon.ico"],
      styles: ["./src/styles.scss"],
      outputHashing: process.env.NODE_ENV === "production" ? "all" : "none",
      optimization: process.env.NODE_ENV === "production",
    }),

    new NxReactWebpackPlugin(),

    new webpack.DefinePlugin({
      "process.env.REACT_APP_GOOGLE_CLIENT_ID": JSON.stringify(
        process.env.REACT_APP_GOOGLE_CLIENT_ID
      ),
    }),

    new CopyWebpackPlugin({
      patterns: [
        // ✅ Copy raw HTML pages
        {
          from: path.resolve(__dirname, "public/pages"),
          to: "pages",
          noErrorOnMissing: true,
        },

        // ✅ Copy all of /public../assets (videos, images, etc.)
        {
          from: path.resolve(__dirname, "public/assets"),
          to: "assets",
          noErrorOnMissing: true,
        },

        // ✅ Copy /src../assets (icons, fonts, css that aren't bundled)
        {
          from: path.resolve(__dirname, "src/assets"),
          to: "assets",
          noErrorOnMissing: true,
        },
      ],
    }),

  ],

  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [
        { from: /^\/pages\/.*$/, to: (context) => context.parsedUrl.pathname },
        { from: /^\/assets\/.*$/, to: (context) => context.parsedUrl.pathname },
      ],
    },
    port: 4200,
    open: true,
  },
};
