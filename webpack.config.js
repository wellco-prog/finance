const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const flatpickr = require("flatpickr");

module.exports = {
    entry: './src/app.js',
    mode: 'development',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },

    devServer: {

        compress: true,
        port: 9000,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",  // Вставляет стили в DOM
                    "css-loader",    // Преобразует CSS в CommonJS
                ],
            },
        ],

    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',

        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./styles", to: "styles"},
                {from: "./static", to: "static"},


            ],
        }),
    ],

};