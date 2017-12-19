const webpack = require('webpack');
const path = require('path');

const config = {
    context: path.resolve(__dirname, 'web/'),
    entry: {
        dashboard: './dashboard/scss/main.scss',
        frontend: './frontend/scss/main.scss',
        frontendScripts: './frontend/typescript/main.ts'
    },
    resolve: {
        extensions: [ '.ts', '.tsx', '.js', '.scss' ]
    },
    output: {
        path: path.resolve(__dirname, 'web/dist'),
        filename: '[name].bundle.js',
        chunkFilename: '[id].bundle.js'
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }, {
                loader: "sass-loader",
                options: {  }
            }]
        }, {
            test: /\.ts$/,
            loader: 'ts-loader'
        }]
    }
};

module.exports = config;
