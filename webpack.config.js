const webpack = require('webpack');
const path = require('path');

// Webpack Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const pagesConfig = require('./src/pages.config');


// SETTINGS
const CONST = {
    dir_source: 'src',
    dir_output: 'build',
    dir_loaders: 'loaders'
};

const PATH = [
    ['root', ''],
    ['source', CONST.dir_source],
    ['output', CONST.dir_output],
    ['loaders', CONST.dir_loaders]
].reduce((acc, pair) => {
    acc[pair[0]] = path.resolve.bind({}, __dirname, pair[1]);
    return acc;
}, {});


const proxyRules = [
    {
        context: ['/dictionary/**'],
        target: 'https://owlbot.info/api/v1/',
        secure: false,
        changeOrigin: true
    }
];

const sassLoaders = [
    'css-loader',
    'sass-loader?includePaths[]=' + [PATH.source('app_styles', 'globals')]
];

// MAIN
module.exports = (process_env) => {

    if (!process_env.name) {
        throw 'Environment not specified';
    }
    const ENV = require('./environments/' + process_env.name + '.config.js');
    if (!ENV) {
        throw 'Environment ' + process_env.name + ' not exists';
    }

    const resolveLoader = {
        alias: {
            'data-bind-loader': path.join(__dirname, './loaders/data-bind-loader.js')
        }
    };

    const resolve = {
        extensions: ['.js', '.json', '.scss'],
        modules: [PATH.source(), 'node_modules', 'app_modules'],
        alias: {
            core: PATH.source('core')
        }
    };

    const loaders = [
        {
            test: [/\.html$/],
            loaders: [
                'raw-loader',
            ],
            exclude: [/node_modules/, PATH.source('index.html')]
        },
        {
            test: /\.js$/,
            loaders: [
                // Babel is ES6+ converter to ES5
                //'babel-loader?presets[]=es2015',
                'data-bind-loader'
            ],
            exclude: [/node_modules/, PATH.source('index.js')]
        },
        {
            test: /\.json$/, loader: 'json-loader',
            exclude: [/node_modules/, /src\/static/]
        },
        {test: /\.css$/, loaders: ['to-string-loader', 'css-loader']},
        {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({
                fallbackLoader: 'style-loader',
                loader: sassLoaders.join('!')
            }),
            exclude: /node_modules/,
        },
        {
            test: /\.(png|jpe?g|gif|svg|woff2?|ttf|eot|ico)$/,
            loader: 'file?name=static/[name].[hash].[ext]?'
        }
    ];


    const plugins = [
        new webpack.NamedModulesPlugin(),
        new ExtractTextPlugin("app.css"),
        new webpack.DefinePlugin({
            ENV: JSON.stringify(ENV.runtime)
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'daemon',
        // }),

        ...pagesConfig.pages.map(fileName => new HtmlWebpackPlugin({
                template: PATH.source(pagesConfig.directory, fileName),
                path: PATH.output(),
                filename: fileName,
            })
        ),
        new CopyWebpackPlugin([
            {from: 'src/static'}
        ])
    ];

    if (ENV.build.compress) {
        plugins.push(new webpack.optimize.UglifyJsPlugin({
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
        }));
    }


    return {
        devtool: ENV.build.devtool,
        entry: {
            webapp: PATH.source('webapp.js'),
            webworker: PATH.source('webworker.js'),
            extclient: PATH.source('extclient.js'),
            extdaemon: PATH.source('extdaemon.js'),
            styles: PATH.source('index.scss')
        },
        output: {
            filename: '[name].js',
            path: PATH.output()
        },
        plugins,
        resolveLoader,
        resolve,
        module: {
            loaders,
        },
        devServer: {
            host: 'localhost',
            port: 3000,
            //open: true,
            inline: true,
            //historyApiFallback : true,
            disableHostCheck: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            },
            proxy: proxyRules,
            compress: true
        }
    };
};

