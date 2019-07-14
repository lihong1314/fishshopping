import check from './scripts/check.mjs'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import path from 'path'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import webpack from 'webpack'
import objectRestSpread from '@babel/plugin-proposal-object-rest-spread'
import fastAsync from 'fast-async'
import {
  srcRoot,
  pagePath,
  componentPath,
  assetsPath
} from './scripts/config.mjs'

export default function() {
  return {
    devtool: 'cheap-module-source-map',

    entry: check.entries,

    output: {
      path: path.resolve('dist'),
      filename: '[name].js',
      libraryTarget: 'umd'
    },

    resolve: {
      extensions: ['.js'],
      modules: ['src', 'node_modules']
    },

    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [objectRestSpread, fastAsync]
          }
        },
        {
          test: /\.css?$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          })
        },
        {
          test: /\.less$/i,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'less-loader']
          })
        }
      ]
    },
    watchOptions: {
      ignored: /node_modules/
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: true,
        __ENV__: '"api.sit.ffan.com"',
        __QR__: '"h5.sit.ffan.com"'
      }),
      new CleanWebpackPlugin(['dist/*']),
      new ExtractTextPlugin('[name].wxss'),
      new CopyWebpackPlugin([
        {
          context: path.join(srcRoot, pagePath),
          from: '**/*.wxml',
          to: pagePath
        },
        {
          context: path.join(srcRoot, pagePath),
          from: '**/*.json',
          to: pagePath
        },
        {
          context: path.join(srcRoot, componentPath),
          from: '**/*.wxml',
          to: componentPath
        },
        {
          context: path.join(srcRoot, componentPath),
          from: '**/*.json',
          to: componentPath
        },
        {
          context: path.join(srcRoot, assetsPath),
          from: '**/*.*',
          to: assetsPath
        },
        {
          context: srcRoot,
          from: 'app.json'
        },
        {
          context: srcRoot,
          from: 'project.config.json'
        }
      ])
    ]
  }
}
