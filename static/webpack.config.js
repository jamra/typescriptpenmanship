module.exports = {  
  entry: './main.ts',
  output: {
    filename: './js/bundle.js',
    publicPath: "../"
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
};