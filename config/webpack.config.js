var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var _ = require('lodash');

var getEntries = function (dir, parentDir) {
    var result = {};
    var dirs = fs.readdirSync(dir);
    var dirLength = dirs.length;
    if (!dirLength) return;
    dirs.forEach(function (item) {
        if(item === 'plugin') return;
        var file = path.resolve(dir, item);
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            var res = getEntries(file, item);
            result = _.assign(result, res);
            if (!--dirLength) return;
        } else {
            var fileName = item.replace(/\.\w+$/, '');
            var key = parentDir ? parentDir + '/' + fileName : fileName;
            result[key] = file;
            if (!--dirLength) return;
        }
    });
    return result;
};

module.exports = {
    entry: getEntries('./public/js'),
    output: {
        path: '../public/build',
        filename: '[name].js'
    },
    resolve: {
        modulesDirectories: ['../public/libs']
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
        //new webpack.ProvidePlugin({
        //    'jquery': 'jquery',
        //    'kindeditor': 'kindeditor'
        //})
    ]
}