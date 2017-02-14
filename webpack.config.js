module.exports = {
  devtool: 'source-map',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/test`
  },
  resolve: {
    extensions: ['.js', '.ts'],
    modules: ['node_modules', 'src']
  }
}
