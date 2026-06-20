import { src, dest, watch, parallel, series } from 'gulp';
import path from 'path';

import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import concat from 'gulp-concat';
import autoprefixer from 'gulp-autoprefixer';
import esbuild from 'gulp-esbuild';
import plumber from 'gulp-plumber';

import imagemin from 'gulp-imagemin';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';

import { deleteSync } from 'del';
import bs from 'browser-sync';

const sass = gulpSass(dartSass);
const browserSync = bs.create();

export function browsersync() {
  browserSync.init({
    server: {
      baseDir: '.',
    },
    notify: false,
  });
}

export function styles() {
  return src('sass/style.sass')
    .pipe(
      plumber({
        errorHandler: function (err) {
          console.error(err.toString());
          this.emit('end');
        },
      }),
    )
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(concat('style.min.css'))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 3 versions', 'ie 11', 'not dead'],
        grid: 'autoplace',
      }),
    )
    .pipe(dest('css/'))
    .pipe(browserSync.stream());
}

function aliasPlugin() {
  return {
    name: 'alias-plugin',
    setup: function (build) {
      build.onResolve({ filter: /^@\// }, function (args) {
        const newPath = `${args.path.replace(/^@\//, 'js/')}.js`;

        return {
          path: path.resolve(process.cwd(), newPath),
          namespace: 'file',
        };
      });
    },
  };
}

export function scripts() {
  return src(['js/main.js'])
    .pipe(
      plumber({
        errorHandler: function (err) {
          console.log(err.toString());
          this.emit('end');
        },
      }),
    )
    .pipe(
      esbuild({
        bundle: true,
        minify: true,
        sourcemap: true,
        target: ['es5'],
        outfile: 'main.min.js',
        plugins: [aliasPlugin()],
      }),
    )
    .pipe(dest('js'))
    .pipe(browserSync.stream());
}

export function images() {
  return src('img/**/*.*', { encoding: false })
    .pipe(
      imagemin([
        imageminGifsicle({ interlaced: true }),
        imageminMozjpeg({ quality: 75, progressive: true }),
        imageminOptipng({ optimizationLevel: 3 }),
        imageminSvgo({
          plugins: [
            {
              name: 'removeViewBox',
              active: true,
            },
            {
              name: 'cleanupIds',
              active: true,
            },
          ],
        }),
      ]),
    )
    .pipe(dest('dist/img'));
}

function copyToDist() {
  return src(
    ['**/*.html', 'css/style.min.css', 'js/lang.js', 'js/main.min.js'],
    { base: '.' },
  ).pipe(dest('dist'));
}

export async function cleanDist() {
  return await deleteSync('dist');
}

export function watching() {
  watch(['sass/**/*.sass'], styles);
  watch(['js/**/*.js', '!js/main.min.js'], scripts);
  watch(['**/*.html']).on('change', browserSync.reload);
}

export const build = series(cleanDist, images, copyToDist);
export default parallel(styles, scripts, browsersync, watching);
