const gulp      = require('gulp')
    // , pug       = require('gulp-pug')
    , less      = require('gulp-less')
    , minifyCSS = require('gulp-csso')

// gulp.task('pug', function(){
// return gulp.src('views/*.pug')
//     .pipe(pug())
//     .pipe(gulp.dest('build/html'))
// })

gulp.task('less', function(){
return gulp.src('public/styles/less/*.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/styles/css'))
    // .pipe(gulp.dest('build/css'))
})
gulp.task('lessIsMore', function(){
return gulp.src('public/styles/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('public/styles/maxcss'))
})

gulp.task('default', [ 'less', 'lessIsMore' ])