const path = require('path');

module.exports = {
  mode: 'production',
  watch: false,
  entry: './src/resources/scripts/index.ts',
  resolve: { 
      alias: { 
          "react": "preact/compat",
          "react-dom/test-utils": "preact/test-utils",
          "react-dom": "preact/compat",     // Must be below test-utils
          "react/jsx-runtime": "preact/jsx-runtime"
      }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist', 'public', 'js'),
  },
};