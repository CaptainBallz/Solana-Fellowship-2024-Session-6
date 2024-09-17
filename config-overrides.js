const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    // Add other fallbacks if needed
  };
  return config;
};
