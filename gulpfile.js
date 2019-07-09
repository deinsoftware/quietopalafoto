'use strict';

const requireDir = require('require-dir');
requireDir('./gulp/tasks');

const { task, series, parallel } = require('gulp');

task('run', series('sass', 'jsLint', parallel('watch', 'browserSync')));

task('build', series('clean:docs', 'sass', parallel('files', 'images', 'data', 'fonts', 'config', 'webapp')));