const { task, src, dest } = require('gulp');
const { oneLine } = require('common-tags');

//Build
const useref = require('gulp-useref');
const uglify = require('gulp-uglify-es').default;
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const del = require('del');
const inject = require('gulp-inject-string');
const minifyHtml = require('gulp-htmlmin');

const metaTag = () => {
  const header = oneLine`
    <meta http-equiv="Content-Security-Policy" content="
      script-src 'self' https:
        *.aspnetcdn.com
        *.maxcdn.com
        cdnjs.cloudflare.com
        *.google.com
        *.twitter.com
        *.twimg.com
        *.facebook.com
        *.facebook.net
        *.google-analytics.com;
      font-src 'self' https:
        *.bootstrapcdn.com;
      style-src 'self' https: 'unsafe-inline'
        *.bootstrapcdn.com
        *.twitter.com
        *.twimg.com;
      child-src 'self' https:
        *.google.com/maps/
        *.twitter.com;
      img-src 'self' data: https:
        *.twimg.com
        *.doubleclick.net
        *.twitter.com
        *.fbcdn.net
        *.google-analytics.com;
      object-src 'none';
      base-uri 'none';
    ">
  `;
  return header;
}

task('files', (done) => {
  const options = {
    esversion: 8
  };

  src('dev/*.*')
    .pipe(useref())
    .pipe(inject.after('</title>', metaTag()))
    .pipe(gulpIf(['js/**/*.js', '!js/**/*.min.js'], uglify(options)))
    .pipe(gulpIf(['css/**/*.css', '!css/**/*.min.css'], cssnano()))
    .pipe(gulpIf(['*.html'], minifyHtml({ collapseWhitespace: true, removeComments: true })))
    .pipe(dest('docs'));
  done();
});

task('data', (done) => {
  src('dev/data/**/*.json').pipe(dest('docs/data'));
  done();
});

task('images', (done) => {
  src('dev/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(
      cache(
        imagemin({
          interlaced: true,
        }),
      ),
    )
    .pipe(dest('docs/images'));
  done();
});

task('fonts', (done) => {
  src('dev/fonts/**/*')
    .pipe(dest('docs/fonts'));
  done();
});

task('config', (done) => {
  src('dev/web.config')
    .pipe(dest('docs/'));
  done();
});

task('webapp', (done) => {
  src('dev/manifest.json')
    .pipe(dest('docs/'));
  done();
});

task('clean:docs', (done) => {
  const delete_paths = [
    'docs/**/*',
    '!docs/images',
    '!docs/images/**/*',
    '!docs/CNAME',
    '!docs/LICENSE',
    '!docs/.git',
  ];
  del.sync(delete_paths);
  done();
});

task('cache:clear', function(callback) {
  return cache.clearAll(callback);
});