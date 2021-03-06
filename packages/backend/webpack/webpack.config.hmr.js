const { CheckerPlugin } = require("awesome-typescript-loader");
const webpack = require("webpack");
const path = require("path");

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  target: "web",
  mode: "development",
  node: {
    fs: "empty",
    dns: "mock",
    net: "mock",
    tls: "mock",
  },
  entry: {
    app: ["./src/application/frontend-entry-point.ts"],
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
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    module: true,
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new CheckerPlugin(),
    new webpack.EnvironmentPlugin([
      "NODE_ENV",
      "DEBUG",
      "JWT_PUBLIC_KEY",
      "APP_LOG_LEVEL",
    ]),
  ],
};
