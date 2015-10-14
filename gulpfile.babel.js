import gulp from 'gulp';
import del from 'del';
import webpack from 'webpack-stream';
import named from 'vinyl-named';
import csswring from 'csswring';
import autoprefixer from 'autoprefixer';
import wct from 'web-component-tester';
import notify from 'gulp-notify';
import vulcanize from 'gulp-vulcanize';
import gulpif from 'gulp-if';
import eslint from 'gulp-eslint';
import postcss from 'gulp-postcss';
import plumber from 'gulp-plumber';
import browserSync from 'browser-sync';
import { simplaImports, name as ELEMENT_NAME } from './bower.json';
import path from 'path';
import gulprun from 'run-sequence';

const imports = simplaImports.map(dep => `../${dep}`),
      bs = browserSync.create();

// Get WCT going
wct.gulp.init(gulp);

const options = {
        webpack: {
          output: {
            filename: '[name].js'
          },
          module: {
            loaders: [
              { test: /\.js$/, loader: 'babel-loader' }
            ]
          }
        },
        postcss: [
          autoprefixer(),
          csswring()
        ],
        vulcanize: {
          inlineCss: true,
          inlineScripts: true,
          addedImports: imports
        },
        browserSync: {
          server: {
            baseDir: './',
            index: 'demo/index.html',
            routes: {
              '/': './bower_components',
              [`/${ELEMENT_NAME}.html`]: `./${ELEMENT_NAME}.html`
            }
          },
          open: false
        }
      },
      errorNotifier = () => plumber({ errorHandler: notify.onError('Error: <%= error.message %>') });

gulp.task('process', () => {
  return gulp.src(['src/*/*.{html,js,css}', 'src/*.{html,js,css}'])
          .pipe(errorNotifier())
            .pipe(gulpif('*.js', named(file => {
              let name = path.basename(file.path, path.extname(file.path)),
                  parent = path.basename(path.dirname(file.path));

              return parent === 'src' ? name : path.join(parent, name);
            })))

            .pipe(gulpif('*.css', postcss(options.postcss)))

            .pipe(gulpif('*.js', eslint()))
            .pipe(gulpif('*.js', eslint.format()))
            .pipe(gulpif('*.js', eslint.failAfterError()))

            .pipe(gulpif('*.js', webpack(options.webpack)))
          .pipe(gulp.dest('.tmp'));
});

gulp.task('build', ['process'], () => {
  return gulp.src([`.tmp/${ELEMENT_NAME}/${ELEMENT_NAME}.html`,`.tmp/${ELEMENT_NAME}.html`])
          .pipe(errorNotifier())
          .pipe(gulpif('*.html', vulcanize(options.vulcanize)))
          .pipe(gulp.dest('.'));
});

gulp.task('clean', () => {
  return del([ '.tmp' ]);
});

gulp.task('run', callback => {
  gulprun('build', 'clean', callback);
});

gulp.task('demo', (callback) => {
  gulp.watch('./*.{html,js}').on('change', bs.reload);

  return bs.init(options.browserSync);
});

gulp.task('test', ['build', 'test:local']);

gulp.task('watch', () => gulp.watch(['src/**/*'], ['run']));
gulp.task('default', ['run', 'demo', 'watch']);
