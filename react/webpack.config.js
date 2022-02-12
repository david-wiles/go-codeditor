const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require("path");

module.exports = (env, argv) => {
  return {
    plugins: [new MiniCssExtractPlugin({
      filename: argv.mode === 'development' ? '[name].css' : '[name].[hash].css',
      chunkFilename: argv.mode === 'development' ? '[id].css' : '[id].[hash].css',
    })],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.module\.s(a|c)ss$/,
          use: [
            argv.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: argv.mode === 'development'
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: argv.mode === 'development'
              }
            }
          ],
        },
        {
          test: /\.s(a|c)ss$/,
          exclude: /\.module.(s(a|c)ss)$/,
          use: [
            argv.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: argv.mode === 'development'
              }
            }
          ]
        }
      ]
    },
    output: {
      path: path.resolve(__dirname, "../web")
    },
    resolve: {
      extensions: ['.js', '.jsx', '.scss']
    }
  };
}
