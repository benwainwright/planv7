const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const StartServerPlugin = require("start-server-webpack-plugin");

module.exports = {
  mode: "development",
  entry: ["webpack/hot/poll?1000", path.resolve(__dirname, "../src/run.ts")],
  watch: true,
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  optimization: {
    minimize: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  node: {
    dns: "mock",
    net: "mock",
    __dirname: false,
  },
  devtool: "source-map",
  target: "node",
  externals: [
    "pnpapi",
    nodeExternals({
      modulesFromFile: true,
      whitelist: ["webpack/hot/poll?1000", /^@choirpractise/u],
    }),
  ],
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
        exclude: /node_modules/u,
        test: /\.css$/u,
        use: ["css-loader"],
      },
    ],
  },
  plugins: [
    new StartServerPlugin("choirpractise-server.js"),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],

  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/",
    pathinfo: false,
    filename: "choirpractise-server.js",
  },
};
