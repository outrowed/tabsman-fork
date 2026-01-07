/* Copyright (c) 2018 Kamil Mikosz
 * Copyright (c) 2018 Sienori
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT */

import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ZipPlugin from "zip-webpack-plugin";
import { resolve } from "path";
import webpack from "webpack";

const getHTMLPlugins = (browserDir, outputDir = "dev", sourceDir = "src") => [
  new HtmlWebpackPlugin({
    title: "Popup",
    filename: resolve(import.meta.dirname, `${outputDir}/${browserDir}/popup/index.html`),
    template: `${sourceDir}/popup/index.html`,
    chunks: ["popup"]
  }),
  new HtmlWebpackPlugin({
    title: "Options",
    filename: resolve(import.meta.dirname, `${outputDir}/${browserDir}/options/index.html`),
    template: `${sourceDir}/options/index.html`,
    chunks: ["options"]
  }),
  new HtmlWebpackPlugin({
    title: "Replaced",
    filename: resolve(import.meta.dirname, `${outputDir}/${browserDir}/replaced/index.html`),
    template: `${sourceDir}/replaced/index.html`,
    chunks: ["replaced"]
  }),
  new HtmlWebpackPlugin({
    title: "Replaced",
    filename: resolve(import.meta.dirname, `${outputDir}/${browserDir}/replaced/replaced.html`),
    template: `${sourceDir}/replaced/index.html`,
    chunks: ["replaced"]
  }),
  new HtmlWebpackPlugin({
    title: "Offscreen",
    filename: resolve(import.meta.dirname, `${outputDir}/${browserDir}/offscreen/index.html`),
    template: `${sourceDir}/offscreen/index.html`,
    chunks: ["offscreen"]
  })
];

const getOutput = (browserDir, outputDir = "dev") => {
  return {
    path: resolve(import.meta.dirname, `${outputDir}/${browserDir}`),
    filename: "[name]/[name].js"
  };
};

const getEntry = (sourceDir = "src") => {
  return {
    popup: resolve(import.meta.dirname, `${sourceDir}/popup/index.js`),
    options: resolve(import.meta.dirname, `${sourceDir}/options/index.js`),
    replaced: resolve(import.meta.dirname, `${sourceDir}/replaced/replaced.js`),
    background: resolve(import.meta.dirname, `${sourceDir}/background/background.js`),
    offscreen: resolve(import.meta.dirname, `${sourceDir}/offscreen/offscreen.js`)
  };
};

const getCopyPlugins = (browserDir, outputDir = "dev", sourceDir = "src") => [
  new CopyWebpackPlugin({
    patterns: [
      {
        from: `${sourceDir}/icons`,
        to: resolve(import.meta.dirname, `${outputDir}/${browserDir}/icons`)
      },
      {
        from: `${sourceDir}/_locales`,
        to: resolve(import.meta.dirname, `${outputDir}/${browserDir}/_locales`)
      },
      {
        from: `${sourceDir}/manifest.json`,
        to: resolve(import.meta.dirname, `${outputDir}/${browserDir}/manifest.json`)
      }
    ]
  })
];

const getFirefoxCopyPlugins = (browserDir, outputDir = "dev", sourceDir = "src") => [
  new CopyWebpackPlugin({
    patterns: [
      {
        from: `${sourceDir}/icons`,
        to: resolve(import.meta.dirname, `${outputDir}/${browserDir}/icons`)
      },
      {
        from: `${sourceDir}/_locales`,
        to: resolve(import.meta.dirname, `${outputDir}/${browserDir}/_locales`)
      },
      {
        from: `${sourceDir}/manifest-ff.json`,
        to: resolve(import.meta.dirname, `${outputDir}/${browserDir}/manifest.json`)
      }
    ]
  })
];

const getMiniCssExtractPlugin = () => [
  new MiniCssExtractPlugin({
    filename: "[name]/[name].css"
  })
];

const getZipPlugin = (browserDir, outputDir = "dist", exclude = "") =>
  new ZipPlugin({
    path: resolve(import.meta.dirname, `${outputDir}`),
    filename: browserDir,
    extension: "zip",
    fileOptions: {
      mtime: new Date(),
      mode: 0o100664,
      compress: true,
      forceZip64Format: false
    },
    zipOptions: {
      forceZip64Format: false
    },
    exclude: exclude
  });

const getBufferPlugin = () => [
  new webpack.ProvidePlugin({
    Buffer: [import.meta.resolve("buffer/"), "Buffer"],
  }),
];

export {
  getHTMLPlugins,
  getOutput,
  getCopyPlugins,
  getFirefoxCopyPlugins,
  getMiniCssExtractPlugin,
  getBufferPlugin,
  getZipPlugin,
  getEntry
};
