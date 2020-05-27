const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = {
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
    app: [path.resolve(__dirname, "../src/run.ts")],
  },

  performance: {
    hints: false,
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },

  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/assets",
    pathinfo: false,
    filename: `planv7-server.js`,
  },
  devtool: "source-map",
  optimization: {
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

  externals: {
    fsevents: true,
    "koa-webpack": 'global["koa-webpack"]',
  },
  plugins: [
    new BundleAnalyzerPlugin({ openAnalyzer: false, analyzerMode: "static" }),
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
    new webpack.ProvidePlugin({
      React: "react",
    }),
  ],
};
