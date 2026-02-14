const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode !== 'production';
  return {
    devtool: isDevelopment ? "source-map" : false,
    entry: {
      background: './src/background/index.ts',
      sidepanel: process.env.USE_MOCK === 'true'
        ? ['./src/mock/chrome.ts', './src/sidepanel/index.tsx']
        : './src/sidepanel/index.tsx',
      welcome: './src/pages/welcome/index.tsx',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true,
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.tsx?$/,
          use: [{
            loader: 'ts-loader',
            options: {
              transpileOnly: false, // Ensure type errors cause build failure
            }
          }],
          exclude: /node_modules/,
        },
        {
          test: /\.scss$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',   // Translates CSS into CommonJS
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  style: isDevelopment ? 'expanded' : 'compressed',
                },
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[contenthash][ext]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new webpack.DefinePlugin({
        'USE_MOCK': JSON.stringify(process.env.USE_MOCK === 'true'),
      }),
      new CopyPlugin({
        patterns: [
          { from: 'src/assets/manifest.json', to: 'manifest.json' },
          { from: 'src/assets/icons', to: 'icons' },
          { from: 'src/assets/_locales', to: '_locales' },
          { from: 'LICENSE', to: '.' },
        ],
      }),
      new HtmlWebpackPlugin({
        filename: 'sidepanel.html',
        chunks: ['sidepanel'],
        title: 'Marginalia Side Panel',
        meta: {
          viewport: 'width=device-width, initial-scale=1',
        },
        minify: {
          removeComments: true,
          collapseWhitespace: true,
        },
      }),
      new HtmlWebpackPlugin({
        filename: 'welcome.html',
        chunks: ['welcome'],
        title: 'Marginalia', // Title is updated by JS for i18n
        meta: {
          viewport: 'width=device-width, initial-scale=1',
        },
        minify: {
          removeComments: true,
          collapseWhitespace: true,
        },
      }),
      ...(isDevelopment ? [] : [new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
      })]),
    ],
    optimization: {
      minimizer: [
        `...`,
        new CssMinimizerPlugin(),
      ],
    },
  };
};
