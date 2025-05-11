const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    liveReload: true,
    hot: true,
    open: true,
    static: ["./"],
    port: 3000,
    proxy: [
      {
        context: ["/dreams.json"],
        target: "http://localhost:3000/dreams.json",
      },
    ],
  },
});
