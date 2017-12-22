const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name].css",
    disable: process.env.NODE_ENV === "development"
});

const config = {
    context: path.resolve(__dirname, 'web/'),
    entry: {
        dashboard: [
            './dashboard/scss/main.scss',
            './dashboard/typescript/main.ts'
        ],
        frontend: [
            './frontend/scss/main.scss',
            './frontend/typescript/main.ts'
        ]
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
            use: extractSass.extract({
                use: [
                    {
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }
                ],
                fallback: "style-loader"
            })
        }, {
            test: /\.ts$/,
            loader: 'ts-loader'
        }]
    },
    plugins: [
        extractSass
    ]
};

module.exports = config;
