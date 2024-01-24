const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: "XWatermark", // global variable name
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              "@babel/plugin-proposal-optional-chaining",
              "@babel/plugin-proposal-class-properties"
            ]
          }
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false
          },
          compress: {
            // drop_console: true,
            drop_debugger: true,
            pure_funcs: ["console.log"]
          }
        }
      })
    ]
  },
  devServer: {
    static: [
      {
        directory: path.join(__dirname, "example")
      },
      {
        directory: path.join(__dirname, "dist"),
        publicPath: "/dist/"
      }
    ],
    port: 9001,
    hot: true
  },
  watch: true
};
