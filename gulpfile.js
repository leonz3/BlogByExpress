var fs = require('fs');
var path = require('path');
var lodash = require('lodash');
var webpack = require('webpack');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var nodemon = require('gulp-nodemon');
var gulpWebpack = require('gulp-webpack');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');

var reload = browserSync.reload;

var fileConf = {
    js: 'public/js/*/*.js',
    css: 'public/css/*.css',
    dest: 'public/build',
    view: 'views/*/*.html'
};

var getEntries = function (dir, parentDir) {
    var result = {};
    var dirs = fs.readdirSync(dir);
    var dirLength = dirs.length;
    if (!dirLength) return;
    dirs.forEach(function (item) {
        if (item === 'plugin' || item === 'partial') return;
        var file = path.resolve(dir, item);
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            var res = getEntries(file, item);
            result = lodash.assign(result, res);
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

var webpackConfig = {
    entry: getEntries(path.join(__dirname, 'public/js')),
    output: {
        path: path.join(__dirname, 'public/build'),
        filename: '[name].js'
    },
    resolve: {
        alias: {
            bootstrap: '../../libs/bootstrap/js'
        },
        modulesDirectories: ['public/libs']
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    plugins: [
        //new webpack.optimize.CommonsChunkPlugin('common.js'),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        ),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
};

gulp.task('webpack', function () {
    return gulp.src(fileConf.js)
        .pipe(gulpWebpack(webpackConfig))
        .pipe(gulp.dest(fileConf.dest));
});

gulp.task('minjs', function () {
    return gulp.src('public/build/*/*.js')
        .pipe(uglify())
        //.pipe(rename(function (path) {
        //    path.basename += '.min';
        //}))
        .pipe(gulp.dest(fileConf.dest));
});

gulp.task('mincss', function () {
    return gulp.src(fileConf.css)
        .pipe(autoprefixer())
        .pipe(minifycss())
        //.pipe(rename({
        //    suffix: '.min'
        //}))
        .pipe(gulp.dest(fileConf.dest));
});

gulp.task('server', function () {
    nodemon({
        script: 'app.js',
        ignore: [
            'node_modules/**',
            'public/**',
            'views/**'
        ],
        nodeArgs: ['--harmony'],
        env: {
            NODE_ENV: 'development'
        }
    });
});

gulp.task('watch', function () {
    //browserSync.init({
    //    proxy: "localhost:3000"
    //    //server:{
    //    //    baseDir: './'
    //    //}
    //});

    gulp.watch(fileConf.js, ['webpack']);

    //gulp.watch([fileConf.view, fileConf.js, fileConf.css]).on('change', reload);
});

gulp.task('minify', ['minjs', 'mincss']);

gulp.task('build', ['webpack', 'minify']);

gulp.task('default', ['server']);
