var gulp = require('gulp'),
	livereload = require('gulp-livereload'),
	path = require('path'),
	jade = require('gulp-jade'),
	compass = require('gulp-compass'),
	dest = '';

gulp.task('default', ['server', 'watch']);

gulp.task('server', function(next) {
	require('./server');
});

gulp.task('once', ['jade', 'compass']);

gulp.task('jade', function() {
	  var YOUR_LOCALS = {};
  gulp.src('./dist/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .on('error', function(err) {
    	console.error('Jade could not be compiled\n'+err.message);
        // Would like to catch the error here
    })
    .pipe(gulp.dest('./public/'))
});

gulp.task('compass', function() {
    gulp.src('./dist/*.sass')
    .pipe(compass({
            config_file: './config.rb',
            css: 'public',
            sass: 'dist'
        }))
    .on('error', function(err) {
    	console.error('Compass could not be compiled\n'+err.message);
    })
    .pipe(gulp.dest('public'));
});

gulp.task('watch', function() {
	var server = livereload();
	var publicSourceFolder = path.join(__dirname, 'dist');
	gulp.watch('./public/**/*').on('change', function(file) {
		console.log('Change', file);
		server.changed(file.path);
	});
	gulp.watch('./dist/**/*.sass', ['compass']);
	gulp.watch('./dist/**/*.jade', ['jade']);
});