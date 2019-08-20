var syntax = 'sass'

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	cleancss = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	notify = require('gulp-notify'),
	newer = require('gulp-newer')

// Local Server
gulp.task('browser-sync', function() {
	browserSync({
		proxy: 'xyzexclusive/',
		notify: false,
		files: ['./**/*.php'],
		port: 8081
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
})

// Sass|Scss Styles
gulp.task('styles', function() {
	return gulp
		.src('assets/css/**/*.' + syntax + '')
		.pipe(sass({ outputStyle: 'expanded' }).on('error', notify.onError()))
		.pipe(rename({ suffix: '.min', prefix: '' }))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleancss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
		.pipe(gulp.dest('assets/css'))
		.pipe(browserSync.stream())
})

// JS
gulp.task('scripts', function() {
	return (
		gulp
			.src([
				'assets/libs/jquery/jquery.min.js',
				'assets/libs/youtube/yt.js',
				'assets/libs/slick/slick.min.js',
				'assets/js/common.js' // Always at the end
			])
			.pipe(concat('scripts.min.js'))
			// .pipe(uglify()) // Mifify js (opt.)
			.pipe(gulp.dest('assets/js'))
			.pipe(browserSync.reload({ stream: true }))
	)
})

// HTML Live Reload
gulp.task('code', function() {
	return gulp
		.src('./**/*.php')
		.pipe(newer('./'))
		.pipe(gulp.dest('./'))
		.pipe(browserSync.reload({ stream: true }))
})

gulp.task('watch', function() {
	gulp.watch('assets/css/**/*.' + syntax + '', gulp.parallel('styles'))
	gulp.watch(['libs/**/*.js', 'assets/js/common.js'], gulp.parallel('scripts'))
	gulp.watch('./**/*.php', gulp.parallel('code'))
})

gulp.task(
	'default',
	gulp.parallel('styles', 'scripts', 'browser-sync', 'watch')
)
