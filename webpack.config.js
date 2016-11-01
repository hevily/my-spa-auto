var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');
var LiveReloadPlugin = require('webpack-livereload-plugin');


module.exports = {
	entry: {
		'app': './js/app.js',
		'vendors': ['jquery', 'bootstrap']
	},
	output: {
		//filename: './dist/js/app.js'
		path: path.resolve(__dirname, 'dist'),
		filename: 'app.js'
	},
	module: {
		//noParse:[/bootstrap/],
		loaders: [
			// 转化ES6的语法
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: /node_modules/,
				query: {
					compact: false
				}
			}, {
				test: /\.html$/,
				loader: "html"
			}, {
				test: /\.less$/,
				loader: ExtractTextPlugin.extract('style', 'css!less'),
			}, {
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style', 'css')
			}, {
				test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)$/,
				loader: 'file'
			}, {
				test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
				loader: 'url?limit=100000&name=[name].[ext]'
			}
		]
	},
	postcss: [
		autoprefixer({
			browsers: ['last 2 versions']
		})
	],
	plugins: [
		//new ExtractTextPlugin("./css/all.css"),
		new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
   		new LiveReloadPlugin({
   			port:8001,
   			appendScriptTag:true
   		})
	],
	//devtool: 'source-map',
	externals: {
		//"jquery": "jQuery"
		//"pnotify": "PNotify"
	},
	resolve: {
		extensions: ['', '.js', '.html'],
		alias: {
			'pnotify': './js/lib/pnotify',
			'jquery': path.join(__dirname, './js/lib/jquery.min'),
			'bootstrap': path.join(__dirname, './js/lib/bootstrap')
		}
	}
};