var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    dest = '';

gulp.task('default', ['server', 'watch']);
gulp.task('server', function(next) {
	require('./server');
});
gulp.task('watch', function() {
  var server = livereload();
  gulp.watch('**/*').on('change', function(file) {
  	console.log('Change', file);
      server.changed(file.path);
  });
});