const gulp      = require('gulp')
    , less      = require('gulp-less')
    , minifyCSS = require('gulp-csso')
    , watchLess = require('gulp-watch-less')
    , plumber = require('gulp-plumber')
require('events').EventEmitter.prototype._maxListeners = 100;

gulp.task('less', function(){
    return watchLess('public/styles/less/*.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest('public/styles/css'))
    })
gulp.task('lessIsMore', function(){
    return watchLess('public/styles/less/*.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest('public/styles/maxcss'))
})

gulp.task('default', [ 'less', 'lessIsMore' ])