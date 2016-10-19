module.exports = {  
  entry: './main.ts',
  output: {
    filename: './js/bundle.js',
    publicPath: "../"
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
}