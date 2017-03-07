var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var postcss = require('gulp-postcss');
var mqpacker = require('css-mqpacker');

gulp.task('hello', function() {
    console.log('Hello Zell');
});


gulp.task('sass', function() {
    return gulp.src('./app/scss/*.scss') // Gets all files ending with .scss in app/scss and children dirs
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(postcss([
            require('css-mqpacker')({
                sort: true
            })
        ]))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Gulp watch syntax
gulp.task('watch', function(){
    gulp.watch('./app/scss/**/*.scss', ['sass']);
    // Other watchers
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })
});

gulp.task('watch', ['browserSync', 'sass'], function (){
    gulp.watch('app/scss/**/*.scss', ['sass']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});
