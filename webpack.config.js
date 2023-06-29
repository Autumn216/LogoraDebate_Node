const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UnusedWebpackPlugin = require('unused-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

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
            target: 'web',
            entry: {
                'debat': path.resolve(__dirname, 'src/index.js'),
                'synthese': path.resolve(__dirname, 'src/synthesis.js'),
                'synthese_norender': path.resolve(__dirname, 'src/synthesis-norender.js'),
                'argument_norender': path.resolve(__dirname, 'src/argument-norender.js'),
                'proposal_norender': path.resolve(__dirname, 'src/proposal-norender.js'),
                'group_norender': path.resolve(__dirname, 'src/group-norender.js'),
                'consultation_norender': path.resolve(__dirname, 'src/consultation-norender.js'),
                'widget_norender': path.resolve(__dirname, 'src/widget-norender.js'),
                'vote_norender': path.resolve(__dirname, 'src/group-norender.js'),
                'embed': path.resolve(__dirname, 'src/embed.js'),
                'embed_copy': path.resolve(__dirname, 'src/embed.js'),
                'synthese_copy': path.resolve(__dirname, 'src/synthesis.js'),
                'widget': path.resolve(__dirname, 'src/widget.js'),
                'widget_copy': path.resolve(__dirname, 'src/widget.js'),
                'auth': path.resolve(__dirname, 'src/auth.js')
            },
            output: {
                filename: '[name].js',
                chunkFilename: '[contenthash:10].js',
                path: path.resolve(__dirname, 'public/js'),
                publicPath: env.ASSET_PATH,
                globalObject: 'this'
            },
            devtool: production ? false : 'source-map',
            devServer: {
                static: {
                    directory: path.join(__dirname, 'public'),
                },
                compress: true,
            },
            resolve: {
                fallback: {
                    "url": require.resolve("url")
                },
                extensions: [".js", ".jsx", ".json", ".html", ".svg"],
            },
            optimization: {
                splitChunks: {
                    minSize: 1000 * 100
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
            module: {
                rules: [
                    {
                        test: /\.jsx?$/,
                        exclude: [/node_modules/, /\.composition.js$/, /\.test.jsx$/],
                        use: {
                            loader: 'babel-loader',
                        }
                    },
                    {
                        test: /\.(jpe?g|png|gif|svg)$/,
                        loader: 'image-webpack-loader',
                        enforce: 'pre',
                    },
                    {
                        test: /\.(png|jpg|jpeg)$/,
                        use: [{
                            loader: 'url-loader',
                            options: {
                                limit: 100000,
                            }
                        }]
                    },
                    {
                        test: /\.svg$/,
                        use: ['@svgr/webpack'],
                    },
                    {
                        test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                        loader: 'file-loader',
                    },
                    {
                        test: /\.html$/,
                        loader: "html-loader",
                    },
                    {
                        test: /\.(css|less)$/,
                        use: ["style-loader", "css-loader", "postcss-loader"]
                    },
                    {
                        test: /\.scss$/,
                        exclude: /\.module.scss$/,
                        use: [{
                            loader: 'style-loader',
                        }, {
                            loader: 'css-loader',
                        }, {
                            loader: 'postcss-loader'
                        }, {
                            loader: 'sass-loader'
                        }
                        ]
                    },
                    {
                        test: /\.module\.scss$/,
                        use: [{
                            loader: 'style-loader',
                        }, {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    exportGlobals: true,
                                    localIdentName: '[hash:base64:5]'
                                },
                                importLoaders: 2,
                            }
                        }, {
                            loader: 'postcss-loader'
                        }, {
                            loader: 'sass-loader'
                        }
                        ]
                    }
                ],
            },
            plugins: [
                new webpack.DefinePlugin(envKeys),
                new LodashModuleReplacementPlugin(),
                new CleanWebpackPlugin(),
                new HtmlWebpackPlugin({
                    filename: 'synthese-embed.html',
                    template: 'src/embed/synthese-embed.html',
                    cache: false,
                    minify: true,
                    chunks: ['embed_copy']
                }),
                new HtmlWebpackPlugin({
                    filename: 'synthese-amp.html',
                    template: 'src/embed/synthese-amp.html',
                    cache: false,
                    minify: true,
                    chunks: ['synthese_copy']
                }),
                new HtmlWebpackPlugin({
                    filename: 'widget-embed.html',
                    template: 'src/embed/widget-embed.html',
                    cache: false,
                    minify: true,
                    chunks: ['embed_copy']
                }),
                new HtmlWebpackPlugin({
                    filename: 'widget-amp.html',
                    template: 'src/embed/widget-amp.html',
                    cache: false,
                    minify: true,
                    chunks: ['widget_copy']
                }),
                new HtmlWebpackPlugin({
                    filename: 'embed.html',
                    template: 'src/embed/embed.html',
                    cache: false,
                    minify: true,
                    chunks: ['embed_copy']
                }),
                new HtmlInlineScriptPlugin({
                    scriptMatchPattern: [/embed_copy.js$/, /synthese_copy.js$/, /widget_copy.js$/]
                }),
                //new BundleAnalyzerPlugin()
            ]
        }
    ];
}