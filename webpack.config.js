const webpack = require('webpack');
const path = require('path');

const ReactToHtmlPlugin = require('react-to-html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const jsSourcePath = path.join(__dirname, './src/script');
const buildPath = path.join(__dirname, './public');
const imgPath = path.join(__dirname, './public/img');
const sourcePath = path.join(__dirname, './src/script/index.jsx');

// Common plugins
const plugins = [
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: 'vendor',
    //     minChunks: Infinity,
    //     filename: 'vendor-[hash].js',
    // }),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(nodeEnv),
        },
    }),
    new webpack.NamedModulesPlugin(),
    // new HtmlWebpackPlugin({
    //     template: path.join(sourcePath, 'index.html'),
    //     path: buildPath,
    //     filename: 'index.html',
    // }),
    new ReactToHtmlPlugin('index.html', 'index.js'),
    new webpack.LoaderOptionsPlugin({
        options: {
            postcss: [
                autoprefixer({
                    browsers: [
                        'last 3 version',
                        'ie >= 10',
                    ],
                }),
            ],
            context: sourcePath,
        },
    }),
];

// Common rules
const rules = [
    {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
            'babel-loader',
            //'jsx-loader'
        ],
    },
    {
        test: /\.(png|gif|jpg|svg)$/,
        include: imgPath,
        use: 'url-loader?limit=20480&name=assets/[name]-[hash].[ext]',
    },
];

if (isProduction) {
    // Production plugins
    plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
            },
            output: {
                comments: false,
            },
        }),
        new ExtractTextPlugin('style-[hash].css')
    );

    // Production rules
    rules.push(
        {
            test: /\.scss$/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                }, {
                    loader: 'sass-loader',
                    options: {
                        includePaths: [
                            'src/style'
                        ]
                    }
                }]
            }),
        }
    );
} else {
    // Development plugins
    plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );

    // Development rules
    rules.push(
        {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: [
                'style-loader',
                // Using source maps breaks urls in the CSS loader
                // https://github.com/webpack/css-loader/issues/232
                // This comment solves it, but breaks testing from a local network
                // https://github.com/webpack/css-loader/issues/232#issuecomment-240449998
                // 'css-loader?sourceMap',
                'css-loader',
                'postcss-loader',
                'sass-loader?sourceMap',
            ],
        }
    );
}

module.exports = {
    devtool: isProduction ? 'eval' : 'source-map',
    context: jsSourcePath,
    entry: './index.jsx',
    // entry: {
    //     js: './index.jsx',
    //     vendor: [
    //         'babel-polyfill',
    //         'es6-promise',
    //         'immutable',
    //         'isomorphic-fetch',
    //         'react-dom',
    //         'react',
    //     ],
    // },
    output: {
        path: buildPath,
        publicPath: '/',
        //filename: 'app-[hash].js',
        filename: 'index.js',
    },
    module: {
        rules,
    },
    resolve: {
        extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
        modules: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'src/script'),
            path.resolve(__dirname, 'src/script/modules'),
            path.resolve(__dirname, 'node_modules'),
            jsSourcePath,
        ],
    },
    plugins,
    devServer: {
        contentBase: isProduction ? './build' : './source',
        historyApiFallback: true,
        port: 3000,
        compress: isProduction,
        inline: !isProduction,
        hot: !isProduction,
        host: 'localhost',
        stats: {
            assets: true,
            children: false,
            chunks: false,
            hash: false,
            modules: false,
            publicPath: false,
            timings: true,
            version: false,
            warnings: true,
            colors: {
                green: '\u001b[32m',
            },
        },
    },
};