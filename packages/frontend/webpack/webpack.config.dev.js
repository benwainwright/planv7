const merge = require("webpack-merge");
const { CheckerPlugin } = require("awesome-typescript-loader");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

const clientConfig = {
  mode: "development",
  node: {
    fs: "empty",
    dns: "mock",
    net: "mock",
    tls: "mock",
  },
  entry: {
    app: ["./src/index.tsx"],
    vendor: ["@babel/polyfill", "react"],
  },

  output: {
    path: path.resolve(__dirname, "../dist/assets/"),
    publicPath: "/assets",
    pathinfo: false,
    filename: "[name].js",
  },

  optimization: {
    minimize: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },

  devtool: "cheap-module-eval-source-map",
  module: {
    rules: [
      {
        test: /\.ts(?:x?)$/u,
        exclude: /node_modules/u,
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
        test: /\.css$/u,
        use: ["style-loader", "css-loader"],
      },
      {
        enforce: "pre",
        test: /.js$/u,
        loader: require.resolve("source-map-loader"),
      },
    ],
  },
  externals: ["module"],
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new CheckerPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.EnvironmentPlugin([
      "NODE_ENV",
      "DEBUG",
      "JWT_PUBLIC_KEY",
      "APP_LOG_LEVEL",
    ]),
  ],
};

module.exports = merge(require("./webpack.common.config"), clientConfig);
