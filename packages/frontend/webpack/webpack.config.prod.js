const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CheckerPlugin } = require("awesome-typescript-loader");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

const clientConfig = {
  mode: "production",
  node: {
    fs: "empty",
    dns: "mock",
    net: "mock",
    tls: "mock",
  },
  entry: {
    app: ["./src/entry-point.ts"],
    vendor: ["@babel/polyfill", "react"],
  },

  output: {
    path: path.resolve(__dirname, "../dist/assets/"),
    publicPath: "/assets",
    pathinfo: false,
    filename: "[name].min.js",
  },

  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },

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
            },
          },
        ],
      },
      {
        test: /\.css$/u,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  externals: ["module"],
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new CheckerPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),

    nodeExternals({
      modulesFromFile: true,
      whitelist: [/^@planv7/u],
    }),
    new webpack.EnvironmentPlugin(["NODE_ENV", "DEBUG", "JWT_PUBLIC_KEY"]),
  ],
};

module.exports = merge(require("./webpack.common.config"), clientConfig);
