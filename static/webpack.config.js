const path = require("path");

module.exports = {
  // multiple entry points - https://github.com/webpack/docs/wiki/multiple-entry-points
  entry: {
    odUdUiIndex: ["babel-polyfill", path.resolve(__dirname, "src/odUdUiPage/odUdUiIndex.ts")],
    schVsActDrawl: ["babel-polyfill", path.resolve(__dirname, "src/schVsActDrawlPage/schVsActDrawl.ts")],
  },

  output: {
    filename: "[name].js",
  },

  // https://webpack.js.org/configuration/externals/
  externals: {
    "plotly.js-dist": "Plotly",
    // 'moment': 'window.moment',
    // jquery: "jQuery",
  },

  // Enable sourcemaps for debugging webpack's output.
  // devtool: "source-map",
  devtool: false,

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
    ],
  },

  plugins: [],

  resolve: {
    extensions: [".js", ".ts"],
  },
};
