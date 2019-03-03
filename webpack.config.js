const path = require(`path`);

module.exports = {
  mode: `development`,
  entry: `./src/main.js`,
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `public`)
  },
  devtool: `source-map`,
  module: {
    rules: [{
      test: /\.js$/,
      use: `babel-loader`
    }]
  },
  devServer: {
    contentBase: path.join(__dirname, `public`),
    hot: true,
    compress: true
  }
};
