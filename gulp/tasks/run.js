const { task, src, dest, watch, series } = require('gulp');

//Development
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const jshint = require('gulp-jshint');

task('browserSync', (done) => {
  browserSync.init({
    server: {
      baseDir: 'dev',
    },
  });
  done();
});

task('browserSyncReload', (done) => {
  browserSync.reload();
  done();
});

task('jsLint', (done) => {
  src(['dev/js/**/*.js', '!dev/js/*.min.js'])
    .pipe(jshint())
    .pipe(jshint.reporter()); // Dump results
  done();
});

task('sass', (done) => {
  src('dev/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(dest('dev/css'))
    .pipe(browserSync.stream());
  done();
});

//Watchers
task('watch', (done) => {
  watch('dev/scss/**/*.scss', series('sass'));
  watch(
    ['dev/*.html', 'dev/css/**/*.css', 'dev/data/**/*.json', 'dev/js/**/*.js'],
    series('browserSyncReload'),
  );
  done();
});
