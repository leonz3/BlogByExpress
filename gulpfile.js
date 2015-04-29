var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var webpack = require('gulp-webpack');
var webpackConfig = require('./config/webpack.config');

var reload = browserSync.reload;

gulp.task('webpack', function () {
    return gulp.src('public/js/*/[!plugin].js')
        .pipe(webpack(require('./config/webpack.config')))
        .pipe(gulp.dest('public/build'));
});

gulp.task('minjs', function () {
    return gulp.src('public/js/*/*.js')
        .pipe(jshint())
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest('public/dist'));
});

gulp.task('mincss', function () {
    return gulp.src('public/css/*.css')
        .pipe(autoprefixer())
        .pipe(minifycss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('public/dist'));
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

gulp.task('browserSync', function () {
    browserSync.init({
        proxy: "localhost:3000"
        //server:{
        //    baseDir: './'
        //}
    });
    return gulp.watch(['views/*/*.html', 'public/js/*/*.js', 'public/css/*.css']).on('change', reload);
});

gulp.task('minify', ['minjs', 'mincss']);

gulp.task('default', ['server']);
