const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    mode: 'development',
    entry: {
        main: path.resolve(__dirname, 'src', 'main.js')
    },
    output: {
        filename: 'index.[contenthash].js',
        path: path.resolve(__dirname, 'docs')
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': path.resolve('src'),
        }
    },
    plugins: [
        new HTMLWebpackPlugin({
            title: 'authorization',
            template: path.resolve(__dirname, 'public', 'index.html')
        }),
        new VueLoaderPlugin(),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            {
                test: /\.js$/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'vue-style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'vue-style-loader', 'css-loader', 'sass-loader']
            },
            { test: /\.(png|jpe?g|gif|svg|webp|ico)$/i, type: 'asset/inline' }
        ]
    }
}