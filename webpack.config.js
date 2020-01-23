'use strict';

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

let pkg = JSON.parse(fs.readFileSync(__dirname + '/package.json').toString());

module.exports = {

    entry: './src/index.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build/',
        filename: 'project.bundle.js'
    },
    externals: {
          "phaser3-nineslice": "NineSlice",
          "phaser": "Phaser"
      },
    module: {
        rules: [
          {
            test: [ /\.vert$/, /\.frag$/ ],
            use: 'raw-loader'
          }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(pkg.version),
            __CLOUD_SAVE_URI__: JSON.stringify('http://localhost:5000/savedb'),
        }),
        new webpack.DefinePlugin({
            'CANVAS_RENDERER': JSON.stringify(true),
            'WEBGL_RENDERER': JSON.stringify(true)
        })
    ]

};
