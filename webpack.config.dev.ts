/* Copyright (c) 2018 Kamil Mikosz
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT */

import { getHTMLPlugins, getOutput, getCopyPlugins, getFirefoxCopyPlugins, getMiniCssExtractPlugin, getBufferPlugin, getEntry } from "./webpack.utils.js";
import path from "path";
import config from "./config.json" with { type: "json" };
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const isDev = true;
const getSwcOptions = (isTypeScript: boolean) => ({
  jsc: {
    parser: isTypeScript
      ? { syntax: "typescript", tsx: true }
      : { syntax: "ecmascript", jsx: true },
    transform: {
      react: {
        runtime: "classic",
        development: isDev
      }
    }
  },
  env: {
    targets: {
      firefox: "57"
    }
  },
  sourceMaps: isDev
});

const generalConfig = {
  mode: "development",
  devtool: "source-map",
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src/")
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    fallback: {
      "url": path.resolve("url/")
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
          options: getSwcOptions(true)
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
          options: getSwcOptions(false)
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader",
            options: {
              esModule: false
            }
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"]
      }
    ]
  }
};

module.exports = [
  {
    ...generalConfig,
    entry: getEntry(config.chromePath),
    output: getOutput("chrome", config.devDirectory),
    plugins: [
      ...getMiniCssExtractPlugin(),
      ...getHTMLPlugins("chrome", config.devDirectory, config.chromePath),
      ...getCopyPlugins("chrome", config.devDirectory, config.chromePath),
      ...getBufferPlugin(),
    ]
  },
  {
    ...generalConfig,
    entry: getEntry(config.firefoxPath),
    output: getOutput("firefox", config.devDirectory),
    plugins: [
      ...getMiniCssExtractPlugin(),
      ...getFirefoxCopyPlugins("firefox", config.devDirectory, config.firefoxPath),
      ...getHTMLPlugins("firefox", config.devDirectory, config.firefoxPath),
      ...getBufferPlugin(),
    ]
  }
];
