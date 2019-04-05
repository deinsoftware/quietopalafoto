var gulp = require('gulp');
var runSequence = require('run-sequence');

//Development
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var jshint = require('gulp-jshint');

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'dev',
    },
  });
});

gulp.task('jsLint', function () {
  gulp
    .src(['dev/js/**/*.js', '!dev/js/*.min.js'])
    .pipe(jshint())
    .pipe(jshint.reporter()); // Dump results
});

gulp.task('sass', function () {
  return gulp
    .src('dev/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(gulp.dest('dev/css'))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
});

//Watchers
gulp.task('watch', ['browserSync'], function () {
  gulp.watch('dev/scss/**/*.scss', ['sass']);
  gulp.watch('dev/*.html', browserSync.reload);
  gulp.watch('dev/css/**/*.css', browserSync.reload);
  gulp.watch('dev/data/**/*.json', browserSync.reload);
  gulp.watch('dev/js/**/*.js', browserSync.reload);
});

//Build
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var inject = require('gulp-inject-string');
var minifyHtml = require('gulp-minify-html');

function metaTag() {
  var header = '';
  header += '\n\n';
  header += '    <meta http-equiv="Content-Security-Policy" content="\n';
  header += "        script-src 'self' https: \n";
  header += '            *.aspnetcdn.com \n';
  header += '            *.maxcdn.com \n';
  header += '            cdnjs.cloudflare.com \n';
  header += '            *.google.com \n';
  header += '            *.twitter.com \n';
  header += '            *.twimg.com \n';
  header += '            *.facebook.com \n';
  header += '            *.facebook.net \n';
  header += '            *.google-analytics.com; \n';
  header += "        font-src 'self' https: \n";
  header += '            *.bootstrapcdn.com; \n';
  header += "        style-src 'self' https: 'unsafe-inline' \n";
  header += '            *.bootstrapcdn.com \n';
  header += '            *.twitter.com \n';
  header += '            *.twimg.com; \n';
  header += "        child-src 'self' https: \n";
  header += '            *.google.com/maps/ \n';
  header += '            *.twitter.com; \n';
  header += "        img-src 'self' data: https: \n";
  header += '            *.twimg.com \n';
  header += '            *.doubleclick.net \n';
  header += '            *.twitter.com \n';
  header += '            *.fbcdn.net \n';
  header += '            *.google-analytics.com; \n';
  header += "        object-src 'none'; \n";
  header += "        base-uri 'none'; \n";
  header += '    "> \n';
  header +=
    '    <meta http-equiv="Referrer-Policy" content="strict-origin" > \n';
  header += '\n\n';
  return header;
}

gulp.task('files', function () {
  return gulp
    .src('dev/*.*')
    .pipe(useref())
    .pipe(inject.after('</title>', metaTag()))
    .pipe(gulpIf(['js/**/*.js', '!js/**/*.min.js'], uglify()))
    .pipe(gulpIf(['css/**/*.css', '!css/**/*.min.css'], cssnano()))
    .pipe(gulpIf(['*.html'], minifyHtml()))
    .pipe(gulp.dest('docs'));
});

gulp.task('data', function () {
  return gulp.src('dev/data/**/*.json').pipe(gulp.dest('docs/data'));
});

gulp.task('images', function () {
  return gulp
    .src('dev/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(
      cache(
        imagemin({
          interlaced: true,
        }),
      ),
    )
    .pipe(gulp.dest('docs/images'));
});

gulp.task('fonts', function () {
  return gulp.src('dev/fonts/**/*').pipe(gulp.dest('docs/fonts'));
});

gulp.task('config', function () {
  return gulp.src('dev/web.config').pipe(gulp.dest('docs/'));
});

gulp.task('webapp', function () {
  return gulp.src('dev/manifest.json').pipe(gulp.dest('docs/'));
});

gulp.task('clean', function () {
  var delete_paths = [
    'docs/**/*',
    '!docs/images',
    '!docs/images/**/*',
    '!docs/CNAME',
    '!docs/LICENSE',
    '!docs/.git',
  ];
  return del.sync(delete_paths);
});

gulp.task('cache:clear', function (callback) {
  return cache.clearAll(callback);
});

// ---------------
// Sequences
// ---------------

gulp.task('run', function (callback) {
  runSequence(['sass', 'jsLint', 'browserSync', 'watch'], callback);
});

gulp.task('build', function (callback) {
  runSequence(
    'clean',
    'sass',
    ['files', 'images', 'data', 'fonts', 'config', 'webapp'],
    callback,
  );
});