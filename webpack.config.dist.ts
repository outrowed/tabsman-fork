/* Copyright (c) 2018 Kamil Mikosz
 * Copyright (c) 2018 Sienori
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT */

import CopyWebpackPlugin from "copy-webpack-plugin";
import {
  getHTMLPlugins,
  getOutput,
  getCopyPlugins,
  getZipPlugin,
  getFirefoxCopyPlugins,
  getMiniCssExtractPlugin,
  getBufferPlugin,
  getEntry
} from "./webpack.utils.js";
import path from "path";
import config from "./config.json" with { type: "json" };
import { CleanWebpackPlugin} from "clean-webpack-plugin";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const isDev = false;
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

import manifest from "./src/manifest.json" with { type: "json" };
import manifestFirefox from "./src/manifest-ff.json" with { type: "json" };

const extVersion = manifest.version;
const ffExtVersion = manifestFirefox.version;

const generalConfig = {
  mode: "production",
  resolve: {
    alias: {
      src: path.resolve(import.meta.dirname, "src/")
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    fallback: {
      "url": import.meta.resolve("url/")
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

export default [
  {
    ...generalConfig,
    output: getOutput("chrome", config.tempDirectory),
    entry: getEntry(config.chromePath),
    optimization: {
      minimize: true
    },
    plugins: [
      new CleanWebpackPlugin(),
      ...getMiniCssExtractPlugin(),
      ...getHTMLPlugins("chrome", config.tempDirectory, config.chromePath),
      ...getCopyPlugins("chrome", config.tempDirectory, config.chromePath),
      getZipPlugin(`${config.extName}-for-chrome-${extVersion}`, config.distDirectory),
      ...getBufferPlugin(),
    ]
  },
  {
    ...generalConfig,
    entry: getEntry(config.firefoxPath),
    output: getOutput("firefox", config.tempDirectory),
    optimization: {
      minimize: true
    },
    plugins: [
      new CleanWebpackPlugin(),
      ...getMiniCssExtractPlugin(),
      ...getHTMLPlugins("firefox", config.tempDirectory, config.firefoxPath),
      ...getFirefoxCopyPlugins("firefox", config.tempDirectory, config.firefoxPath),
      getZipPlugin(`${config.extName}-for-firefox-${ffExtVersion}`, config.distDirectory),
      ...getBufferPlugin(),
    ]
  },
  {
    ...generalConfig,
    entry: { other: path.resolve(import.meta.dirname, `src/common/log.js`) },
    output: getOutput("copiedSource", config.tempDirectory),
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: `src`,
            to: path.resolve(import.meta.dirname, `${config.tempDirectory}/copiedSource/src/`),
            info: { minimized: true },
          },
          {
            from: "*",
            to: path.resolve(import.meta.dirname, `${config.tempDirectory}/copiedSource/`),
            globOptions: {
              ignore: ["**/BACKERS.md", "**/crowdin.yml"]
            }
          }
        ]
      }),
      getZipPlugin(`copiedSource-${config.extName}-${ffExtVersion}`, config.distDirectory, "other/")
    ]
  }
];
