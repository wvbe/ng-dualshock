var bower = require('gulp-bower'),
    compass = require('gulp-compass'),
    gulp = require('gulp'),
    jade = require('gulp-jade'),
    livereload = require('gulp-livereload'),
	path = require('path');

var path = require('path');

gulp.task('default', [
	'once',
	//'server', // should not be in default, node-hid (dependency on linux) needs sudo,
				// so if you'd want to run server through gulp you had better make that
				// an explicit choice
	'watch'
]);
gulp.task('init', ['install', 'once']);

gulp.task('once', [
    'bower',
    'img',
    'jade',
    'js',
    'sass'
]);

gulp.task('server', function (next) {
	console.log('# Starting DualShock & Socket.io servers');
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



var liveReloadObnoxiousEventAmountBonusCodeTimeout = false;
var liveReloadObnoxiousEventAmountBonusCodeChanges = [];
var liveReloadObnoxiousEventAmountBonusCodeDebugLevel = 'not much';

gulp.task('watch', function () {
    var server = livereload();
    gulp.watch('./build/**/*').on('change', function (file) {
		liveReloadObnoxiousEventAmountBonusCodeChanges.push(file.path);
		if(!liveReloadObnoxiousEventAmountBonusCodeTimeout)
			liveReloadObnoxiousEventAmountBonusCodeTimeout = setTimeout(function() {
				var changeNum = liveReloadObnoxiousEventAmountBonusCodeChanges.length;
				console.log('# '+changeNum+' change'+(changeNum>1?'s':'')+' in build folder detected, live reload fired.');
				if(liveReloadObnoxiousEventAmountBonusCodeDebugLevel=='much')
					console.log('\t'+liveReloadObnoxiousEventAmountBonusCodeChanges.join('\n\t'));
				liveReloadObnoxiousEventAmountBonusCodeChanges = [];
			}, 10);
        server.changed(file.path);
    });
    gulp.watch('./client/**/*.jade', ['jade', function() { console.log('# Rebuilding change in Jade.'); }]);
    gulp.watch('./client/**/*.js', ['js', function() { console.log('# Rebuilding change in JS.'); }]);
    gulp.watch('./client/**/*.sass', ['sass', function() { console.log('# Rebuilding change in SASS.'); }]);
	console.log('# Watching Jade, JS and SASS to auto-build.');
	console.log('# Watching build folder to live reload.');
});