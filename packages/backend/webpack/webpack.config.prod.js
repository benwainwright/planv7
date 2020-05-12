const merge = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const path = require("path");

const clientConfig = {
  mode: "production",
  target: "node",
  node: {
    process: false,
    fs: "empty",
    dns: "mock",
    net: "mock",
    tls: "mock",
  },
  entry: {
    app: [path.resolve(__dirname, "../src/start.ts")],
  },

  performance: {
    hints: false,
  },

  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/assets",
    pathinfo: false,
    filename: "server.js",
  },
  devtool: "source-map",
  optimization: {
    minimize: false,
    noEmitOnErrors: true,
    splitChunks: false,
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
    nodeExternals({
      modulesFromFile: true,
      whitelist: [/^@planv7/u],
    }),
  ],
  plugins: [
    new BundleAnalyzerPlugin({ openAnalyzer: false, analyzerMode: "static" }),
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
  ],
};

module.exports = merge(require("./webpack.common.config"), clientConfig);
