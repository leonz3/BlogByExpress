/**
 * Created by leon on 2015/2/5.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');

gulp.task('watch',function(){
    livereload.listen();
    gulp.watch('views/*/*.*');
});

gulp.task('default',['watch']);

gulp.task('requirejs-uglify',function(){
    return gulp.src('public/libs/requirejs/require.js')
        .pipe(uglify())
        .pipe(gulp.dest('public/libs/requirejs/min'));
});