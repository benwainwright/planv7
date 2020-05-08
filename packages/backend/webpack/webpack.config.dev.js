const merge = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const StartServerPlugin = require("start-server-webpack-plugin");

const devServerConfig = {
  mode: "development",
  entry: ["webpack/hot/poll?1000", "./src/start.ts"],
  watch: true,

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
      whitelist: ["webpack/hot/poll?1000", /^@planv7/],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: "babel-loader" },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        exclude: /node_modules/,
        test: /\.css$/,
        use: ["css-loader"],
      },
    ],
  },
  plugins: [
    new StartServerPlugin("server.js"),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],

  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/",
    pathinfo: false,
    filename: "server.js",
  },
};

module.exports = merge(require("./webpack.common.config"), devServerConfig);
