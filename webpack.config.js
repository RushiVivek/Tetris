const path = require('path');

module.exports = {
  // The entry point file described above
  entry: './public/script.js',
  // The location of the build folder described above
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
};