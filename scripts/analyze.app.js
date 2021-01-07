const ora = require('ora');
const chalk = require('chalk');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const getImageLoaderConfig = require('./utils/get-image-loader-config');

const common = require('./common.app');

common();

const spinner = ora(chalk.yellowBright(`Analyzing...`)).start();
const config = require(`../webpack/webpack.prod`)(getImageLoaderConfig());
config.plugins = config.plugins.filter((plugin) => !(plugin instanceof ScriptExtHtmlWebpackPlugin));
config.plugins.push(new BundleAnalyzerPlugin());

webpack(config, (err) => {
    spinner.stop();
    if (err) {
        console.log(chalk.redBright(`🛑 ${err.message}`));
        return;
    }
});
