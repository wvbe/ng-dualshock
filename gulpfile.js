var bower = require('gulp-bower'),
    compass = require('gulp-compass'),
    gulp = require('gulp'),
    jade = require('gulp-jade'),
    livereload = require('gulp-livereload');

var path = require('path');

gulp.task('default', ['once', 'server', 'watch']);
gulp.task('init', ['install', 'once']);

gulp.task('once', [
    'bower',
    'img',
    'jade',
    'js',
    'sass'
]);

gulp.task('server', function (next) {
    require('./server/index');
});

gulp.task('jade', function () {
    var locals = {};
    gulp.src(['./client/jade/*.jade', './client/jade/**/*.jade'], {base: './client/jade/'})
        .pipe(jade({
            locals: locals
        }))
        .on('error', function (err) {
            console.error('Jade could not be compiled\n' + err.message);
        })
        .pipe(gulp.dest('./build/'))
});

gulp.task('install', function () {
    bower()
        .pipe(gulp.dest('./build/vendor/'));
});

gulp.task('bower', function () {
    gulp.src('./bower_components/*/**', {base: './bower_components/'})
        .pipe(gulp.dest('./build/vendor/'));
});

gulp.task('img', function () {
    gulp.src('./client/img/**', {base: './client/'})
        .pipe(gulp.dest('./build/'));
});

gulp.task('js', function () {
    gulp.src(['./client/js/*/*.js', './client/js/*.js'], {base: './client/'})
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
    gulp.watch('./client/**/*.jade', ['jade']);
    gulp.watch('./client/**/*.js', ['js']);
    gulp.watch('./client/**/*.sass', ['sass']);
});