/*eslint one-var: 0 */

// Core deps
// Use require() because of rollup
const gulp = require('gulp');
const notify = require('gulp-notify');
const gulpif = require('gulp-if');
const size = require('gulp-size');
const plumber = require('gulp-plumber');
const gulprun = require('run-sequence');
const yargs = require('yargs');
const browserSync = require('browser-sync');
const wct = require('web-component-tester');

// HTML
const inline = require('gulp-inline-source');
const processInline = require('gulp-process-inline');
const minify = require('gulp-htmlmin');

// JS
const eslint = require('gulp-eslint');
const rollup = require('gulp-rollup-file');
const resolve = require('rollup-plugin-node-resolve');
const commonJs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const json = require('rollup-plugin-json');

// CSS
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssImport = require('postcss-import');

const bs = browserSync.create(),
      nightwatchServer = browserSync.create(),
      argv = yargs.boolean(['debug']).argv,
      errorNotifier = () => plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }),
      OPTIONS = {
        rollup: {
          plugins: [
            resolve({ main: true, browser: true }),
            commonJs(),
            json(),
            babel({
              exclude: 'node_modules/**/*'
            })
          ],
          format: 'iife'
        },
        postcss: [
          cssImport(),
          autoprefixer()
        ],
        inline: {
          compress: false,
          swallowErrors: true
        },
        HTMLmin: {
          removeComments: true,
          removeCommentsFromCDATA: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          caseSensitive: true,
          keepClosingSlash: true,
          customAttrAssign: [/\$=/],
          minifyCSS: true,
          minifyJS: true
        },
        browserSync: {
          server: {
            baseDir: './',
            index: 'demo/index.html',
            routes: {
              '/': './bower_components'
            }
          },
          open: false,
          notify: false
        },
        nightwatchServer: {
          server: {
            baseDir: './',
            index: 'nightwatch/server/index.html',
            routes: {
              '/components': './bower_components',
              '/components/simpla-text/simpla-text.html': './simpla-text.html',
              '/components/simpla-text/simpla-text-editor.html': './simpla-text-editor.html',
              '/': 'nightwatch/server'
            }
          },
          open: false,
          notify: false,
          port: 3333,
          ui: { port: false }
        },
        nightwatch: {
          configFile: 'nightwatch.conf.js'
        }
      };

gulp.task('build', () => {
  let styles = processInline(),
      scripts = processInline();

  return gulp.src(['src/*.html'])
          .pipe(errorNotifier())

          // Inline assets
          .pipe(inline(OPTIONS.inline))
          .pipe(eslint())
          .pipe(eslint.format())
          .pipe(gulpif(!argv.debug, eslint.failAfterError()))

          // JS
          .pipe(scripts.extract('script'))
            .pipe(rollup(OPTIONS.rollup))
          .pipe(scripts.restore())

          // CSS
          .pipe(styles.extract('style'))
            .pipe(postcss(OPTIONS.postcss))
          .pipe(styles.restore())

          .pipe(gulpif(!argv.debug, minify(OPTIONS.HTMLmin)))

          .pipe(size({ gzip: true }))
        .pipe(gulp.dest('.'))
});

gulp.task('build:tests:html', () => {
  let scripts = processInline();

  return gulp.src(['test/**/*.html'])
          .pipe(errorNotifier())

          // Inline assets
          .pipe(inline(OPTIONS.inline))
          .pipe(eslint())
          .pipe(eslint.format())

          // JS
          .pipe(scripts.extract('script'))
            .pipe(rollup(OPTIONS.rollup))
          .pipe(scripts.restore())

        .pipe(gulp.dest('./.test'));
});

gulp.task('build:tests:js', () => {
  return gulp.src(['test/*.js'])
          .pipe(errorNotifier())
          .pipe(eslint())
          .pipe(eslint.format())
          .pipe(rollup(OPTIONS.rollup))
          .pipe(gulp.dest('./.test'));
});

wct.gulp.init(gulp);

gulp.task('serve:nightwatch', () => nightwatchServer.init(OPTIONS.nightwatchServer));
gulp.task('serve:demo', () => bs.init(OPTIONS.browserSync));
gulp.task('serve', ['serve:demo', 'serve:nightwatch']);
gulp.task('refresh', () => bs.reload());

gulp.task('build:tests', ['build:tests:html', 'build:tests:js']);

gulp.task('test', ['build', 'build:tests', 'test:local']);

gulp.task('watch:src', () => gulp.watch(['src/**/*'], () => gulprun('build', 'refresh')));
gulp.task('watch:tests', () => gulp.watch(['test/**/*'], () => gulprun('build:tests')))
gulp.task('watch', ['watch:src', 'watch:tests']);

gulp.task('default', ['build', 'build:tests', 'serve', 'watch']);
