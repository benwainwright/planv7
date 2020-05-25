const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const path = require("path");

if (!process.env.JWT_PUBLIC_KEY) {
  throw new Error("Please set JWT_PUBLIC_KEY");
}
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
  externals: [
    nodeExternals({
      importType: "umd",
    }),
    {
      react: "React",
      "react-dom": "ReactDOM",
    },
  ],
  plugins: [
    new BundleAnalyzerPlugin({ openAnalyzer: false, analyzerMode: "static" }),
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),

    new webpack.EnvironmentPlugin(["JWT_PUBLIC_KEY"]),
  ],
};

module.exports = merge(require("./webpack.common.config"), clientConfig);
