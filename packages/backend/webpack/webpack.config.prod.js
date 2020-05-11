const merge = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
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
    app: ["./src/start.ts"],
    vendor: ["@babel/polyfill", "react"],
  },

  performance: {
    hints: false,
  },

  output: {
    path: path.resolve(__dirname, "../dist/assets/"),
    publicPath: "/assets",
    pathinfo: false,
    filename: "[name].min.js",
  },
  devtool: "source-map",
  optimization: {
    noEmitOnErrors: true,
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

  externals: [
    "cross-spawn",
    "mongodb-memory-server-core",
    "pnpapi",
    nodeExternals({
      modulesFromFile: true,
      whitelist: [/^@planv7/u],
    }),
  ],
  plugins: [
    new BundleAnalyzerPlugin({ openAnalyzer: false, analyzerMode: "static" }),
    new webpack.NoEmitOnErrorsPlugin(),
    new CheckerPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
  ],
};

module.exports = merge(require("./webpack.common.config"), clientConfig);
