var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var postcss = require('gulp-postcss');
var mqpacker = require('css-mqpacker');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var runSeq = require('run-sequence');



gulp.task('sass', function() {
    return gulp.src('./app/scss/*.scss') // Gets all files ending with .scss in app/scss and children dirs
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(postcss([
            require('css-mqpacker')({
                sort: true
            })
        ]))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//html

gulp.task('minify', function() {
    return gulp.src('app/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true,
                        minifyCSS: true,
                        minifyJS: true,
                        keepClosingSlash: true}))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//js
gulp.task('uglify', function() {
    gulp.src('app/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//img

//gulp.task('imagemin', function() {
  //  gulp.src('app/images/**/*')
    //    .pipe(imagemin())
      //  .pipe(gulp.dest('dist/images'))
        //.pipe(browserSync.reload({
         //  stream: true
       // }));
//});

gulp.task('imagemin', function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//pdf
gulp.task('copy:pdf', function() {
    gulp.src('app/pdf/*.pdf')
        .pipe(gulp.dest('dist/pdf'));
});

//favicon
gulp.task('copy:favicon', function() {
    gulp.src('app/*.png')
        .pipe(gulp.dest('dist'));
});

// font
gulp.task('copy:font.ttf', function() {
    gulp.src('app/fonts/*.ttf')
        .pipe(gulp.dest('dist/fonts'));
});


// Gulp watch syntax
gulp.task('watch', function(){
    gulp.watch('./app/scss/**/*.scss', ['sass']);
    // Other watchers
});

// change to dist after
gulp.task('browserSync', function() {
    browserSync.init({
        files: [
            'dist/**/*'
        ],
        server: {
            baseDir: 'dist'
        }
    })
});

gulp.task('watch', ['browserSync', 'sass'], function (){
    gulp.watch('app/scss/**/*.scss', ['sass']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('app/**/*.html', ['minify']);
    gulp.watch('app/js/**/*.js', ['uglify']);
    gulp.watch('app/images/**/*', ['imagemin']);
});

gulp.task('default', function (callback) {
    runSeq(
        'sass',
        'minify',
        'uglify',
        'imagemin',
        'copy:pdf',
        'copy:favicon',
        'copy:font.ttf',
        callback
    )
});

gulp.task('dev', function (callback) {
    runSeq(
        'default',
        'watch',
        'browserSync',
        callback
    )
});