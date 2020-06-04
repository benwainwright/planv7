const { CheckerPlugin } = require("awesome-typescript-loader");
const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
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
    app: [
      "react-hot-loader/patch",
      "@babel/polyfill",
      "./src/application/frontend-entry-point.ts",
    ],
    vendor: ["react-hot-loader/patch", "react"],
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
        test: /\.(?:j|t)sx?$/u,
        exclude: /node_modules/u,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                "@babel/preset-env",
                { modules: false, targets: { browsers: "last 2 versions" } },
              ],
              ["@babel/preset-typescript", { onlyRemoveTypeImports: true }],
              "@babel/preset-react",
            ],
            plugins: [
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              "babel-plugin-parameter-decorator",
              ["@babel/plugin-proposal-class-properties"],
              "react-hot-loader/babel",
            ],
          },
        },
      },
      {
        exclude: /node_modules/u,
        test: /\.css$/u,
        use: {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: true,
            reloadAll: true,
          },
        },
      },
    ],
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    module: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
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
