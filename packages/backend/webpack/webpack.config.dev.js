const merge = require("webpack-merge");
const webpack = require("webpack");
const { CheckerPlugin } = require("awesome-typescript-loader");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const path = require("path");

const serverConfig = {
  mode: "development",
  entry: ["./src/start.ts"],
  target: "node",
  node: {
    dns: "mock",
    net: "mock",
    __dirname: false,
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/",
    pathinfo: false,
    filename: "server.js",
  },
  optimization: {
    minimize: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
      },
      {
        exclude: /node_modules/,
        test: /\.css$/,
        use: ["css-loader"],
      },
    ],
  },
  plugins: [
    new CheckerPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  externals: [
    nodeExternals({ modulesFromFile: true, whitelist: [/^@planv7/] }),
  ],
};
module.exports = merge(require("./webpack.common.config"), serverConfig);
