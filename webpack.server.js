const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const LoadablePlugin = require('@loadable/webpack-plugin');
const UnusedWebpackPlugin = require('unused-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

function selectDotEnv(mode) {
    switch (mode) {
        case 'production': return path.resolve('.', '.env.prod');
        case 'staging': return path.resolve('.', '.env.staging');
        case 'development': return path.resolve('.', '.env.dev');
    }
}

module.exports = (e, argv) => {
    let production = argv.mode === 'production';

    const env = dotenv.config({ path: selectDotEnv(e.TARGET_ENV) }).parsed;
    const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
    }, {});

    return [
        {
            target: "node",
            externals: [nodeExternals({
                modulesFromFile: {
                    excludeFromBundle: ['devDependencies']
                }
            })],
            entry: {
                init: path.resolve(__dirname, 'server/init.js'),
                app: path.resolve(__dirname, 'src/index.js'),
                argument_embed: path.resolve(__dirname, 'src/argument-norender.js'),
                proposal_embed: path.resolve(__dirname, 'src/proposal-norender.js'),
                consultation_embed: path.resolve(__dirname, 'src/consultation-norender.js'),
                group_embed: path.resolve(__dirname, 'src/group-norender.js'),
                comments_embed: path.resolve(__dirname, 'src/synthesis-norender.js'),
                vote_embed: path.resolve(__dirname, 'src/group-norender.js'),
                widget_embed: path.resolve(__dirname, 'src/widget-norender.js'),
            },
            output: {
                path: path.resolve(__dirname, 'dist'),
                filename: '[name].js',
                globalObject: 'this',
            },
            devtool: production ? false : 'source-map',
            resolve: {
                extensions: ['.js', '.jsx', '.json'],
            },
            module: {
                rules: [
                    {
                        test: /\.jsx?$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true
                            }
                        }
                    },
                    {
                        test: /\.svg$/,
                        use: ['@svgr/webpack'],
                    },
                    {
                        test: /\.html$/,
                        loader: "html-loader",
                    },
                    {
                        test: /\.(css|less)$/,
                        use: [{
                            loader: MiniCssExtractPlugin.loader
                        }, 'css-loader', 'postcss-loader']
                    },
                    {
                        test: /\.module\.scss$/,
                        use: [{
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../dist/css/',
                            },
                        }, {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    exportGlobals: true,
                                    localIdentName: '[hash:base64:5]'
                                }
                            }
                        }, {
                            loader: 'postcss-loader'
                        }, {
                            loader: 'sass-loader'
                        }]
                    },
                ]
            },
            optimization: {
                splitChunks: {
                    cacheGroups: {
                        default: {
                            minChunks: 100
                        }
                    }
                },
                minimizer: [
                    new TerserPlugin({
                        terserOptions: {
                            format: {
                                comments: false,
                            },
                        },
                        extractComments: false,
                    }),
                ],
            },
            plugins: [
                new webpack.DefinePlugin(envKeys),
                new CleanWebpackPlugin(),
                new LoadablePlugin(),
                new MiniCssExtractPlugin({
                    filename: '[name].css',
                    ignoreOrder: true
                }),
                new CopyWebpackPlugin({
                    patterns: [
                        './node_modules/swagger-ui-dist/swagger-ui.css',
                        './node_modules/swagger-ui-dist/swagger-ui-bundle.js',
                        './node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js',
                        './node_modules/swagger-ui-dist/favicon-16x16.png',
                        './node_modules/swagger-ui-dist/favicon-32x32.png'
                    ]
                })
            ]
        }
    ]
}