const path = require("path");
const webpack = require("webpack");

/** @typedef {import('webpack').Configuration} WebpackConfig **/
/** @type WebpackConfig */
const webExtensionConfig = {
  mode: "none", // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
  target: "webworker", // extensions run in a webworker context
  entry: {
    extension: "./src/extension.ts", // source of the web extension main file
    "test/suite/index": "./src/test/suite/index.ts", // source of the web extension test runner
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist"),
    libraryTarget: "commonjs",
    devtoolModuleFilenameTemplate: "../../[resource-path]",
  },
  resolve: {
    mainFields: ["browser", "module", "main"], // look for `browser` entry point in imported node modules
    extensions: [".ts", ".js"], // support ts-files and js-files
    alias: {
      // provides alternate implementation for node module and source files
    },
    fallback: {
      // Webpack 5 no longer polyfills Node.js core modules automatically.
      // see https://webpack.js.org/configuration/resolve/#resolvefallback
      // for the list of Node.js core module polyfills.
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer"),
      console: require.resolve("console-browserify"),
      constants: require.resolve("constants-browserify"),
      crypto: require.resolve("crypto-browserify"),
      domain: require.resolve("domain-browser"),
      events: require.resolve("events"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify"),
      path: require.resolve("path-browserify"),
      punycode: require.resolve("punycode"),
      process: require.resolve("process/browser"),
      querystring: require.resolve("querystring-es3"),
      stream: require.resolve("stream-browserify"),
      string_decoder: require.resolve("string_decoder"),
      sys: require.resolve("util"),
      timers: require.resolve("timers-browserify"),
      tty: require.resolve("tty-browserify"),
      url: require.resolve("url/"),
      util: require.resolve("util/"),
      vm: require.resolve("vm-browserify"),
      zlib: require.resolve("browserify-zlib"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser", // provide a shim for the global `process` variable
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  externals: {
    vscode: "commonjs vscode", // ignored because it doesn't exist
    "node:util": "commonjs util",
    "node:worker_threads": "commonjs worker_threads",
    "node:util/types": "commonjs util/types",
    "node:url": "commonjs url",
    "node:tls": "commonjs tls",
    "node:zlib": "commonjs zlib",
    "node:stream": "commonjs stream",
    "node:stream/web": "commonjs stream/web",
    "node:querystring": "commonjs querystring",
    "node:process": "commonjs process",
    "node:perf_hooks": "commonjs perf_hooks",
    "node:path": "commonjs path",
    "node:os": "commonjs os",
    "node:net": "commonjs net",
    "node:http2": "commonjs http2",
    "node:http": "commonjs http",
    "node:https": "commonjs https",
    "node:fs": "commonjs fs",
    "node:events": "commonjs events",
    "node:diagnostics_channel": "commonjs diagnostics_channel",
    "node:crypto": "commonjs crypto",
    "node:console": "commonjs console",
    "node:child_process": "commonjs child_process",
    "node:buffer": "commonjs buffer",
    "node:async_hooks": "commonjs async_hooks",
    "node:assert": "commonjs assert",
  },
  performance: {
    hints: false,
  },
  devtool: "nosources-source-map", // create a source map that points to the original source file
};
module.exports = [webExtensionConfig];
