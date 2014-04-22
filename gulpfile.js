var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    path = require('path'),
    jade = require('gulp-jade'),
    compass = require('gulp-compass'),
    dest = '';

gulp.task('default', ['once', 'server', 'watch']);

gulp.task('server', function (next) {
    require('./server/server');
});

gulp.task('once', [
    'jade',
    'sass',
    'js',
    'img',
    'bower'
]);

gulp.task('jade', function () {
    var YOUR_LOCALS = {};
    gulp.src(['./client/jade/*.jade', './client/jade/**/*.jade'], {base: './client/jade/'})
        .pipe(jade({
            locals: YOUR_LOCALS
        }))
        .on('error', function (err) {
            console.error('Jade could not be compiled\n' + err.message);
        })
        .pipe(gulp.dest('./build/'))
});
gulp.task('bower', function () {
    gulp.src('./bower_components/*/*.js', {base: './bower_components/'})
        .pipe(gulp.dest('./build/vendor/'));
});
gulp.task('img', function () {
    gulp.src('./client/img/**', {base: './client/'})
        .pipe(gulp.dest('./build/'));
});
gulp.task('js', function () {
    gulp.src('./client/js/*.js', {base: './client/'})
        .pipe(gulp.dest('./build/'));
});
gulp.task('sass', function () {
    gulp.src('./client/sass/*.sass')
        .pipe(compass({
            css: 'build/css',
            sass: 'client/sass'
        }))
        .on('error', function (err) {
            console.error('Sass could not be compiled\n' + err.message);
        })
        .pipe(gulp.dest('./build/'));
});

gulp.task('watch', function () {
    var server = livereload();
    gulp.watch('./build/**/*').on('change', function (file) {
        console.log('Change', file);
        server.changed(file.path);
    });
    gulp.watch('./client/**/*.sass', ['sass']);
    gulp.watch('./client/**/*.jade', ['jade']);
    gulp.watch('./client/**/*.js', ['js']);
});