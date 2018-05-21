/* Gulp Project. Copyright © 2017. 
 * Maxim Buslaev, maximys@protonmail.com
 * ISC Licensed */
'use strict';

const
  newer = require('gulp-newer'),
  plumber = require('gulp-plumber'),
  gulp = require('gulp');


/*---------------------PUG -> HTML--------------------------*/
const
  pug = require('gulp-pug');

gulp.task('html', function () {
  return gulp.src('frontend/html/*.pug', { since: gulp.lastRun('html') })
    .pipe(plumber())
    .pipe(newer('public'))
    .pipe(pug({ pretty: '\t' }))
    .pipe(gulp.dest('public'))
});
/*---------------------END: PUG -> HTML--------------------------*/


/*---------------------IMG--------------------------*/
const imagemin = require('gulp-imagemin');

gulp.task('img', function () {
  return gulp.src('frontend/img/**/*.*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('public/img/'))
});
/*---------------------END: IMG--------------------------*/


/*---------------------PostCSS--------------------------*/
const
  postcss = require('gulp-postcss'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
  syntax_scss = require('postcss-scss'),
  precss = require("precss"),
  // postcss_css_reset = require('postcss-css-reset'),
  autoprefixer = require('autoprefixer'),
  assets = require('postcss-assets'),
  mqpacker = require('css-mqpacker'),
  sprites = require('postcss-sprites');

const base_plugins = [
  precss,
  assets({ loadPaths: ['img/'] }),
  // sprites({ spritePath: './public/img' }),
  // postcss_css_reset,
  autoprefixer({ browsers: ['last 3 version'] }),
  mqpacker({ sort: true })
];

gulp.task('css', function () {
  return gulp.src('frontend/css/*.scss', { since: gulp.lastRun('css') })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(postcss(base_plugins, { parser: syntax_scss }))
    .pipe(rename({ extname: '.css' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/styles'))
});
/*---------------------END: PostCSS--------------------------*/


/*---------------------Scripts--------------------------*/
const
  babel = require('gulp-babel');

gulp.task('scripts', function () {
  return gulp.src(['frontend/js/**/*.*', 'frontend/components/**/*.js'], { since: gulp.lastRun('scripts') })
    .pipe(newer('public/js'))
    .pipe(gulp.dest('public/js'))
});

gulp.task('js-es', function () {
  return gulp.src('public/js/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js'))
});
/*---------------------END: Scripts--------------------------*/


/*---------------------Build--------------------------*/
const
  uglify = require('gulp-uglify'),
  cssnano = require('cssnano'),
  optimization_plugins = [cssnano],
  del = require('del');

gulp.task('js-optim', function () {
  return gulp.src('public/js/**/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

gulp.task('сss-optim', function () {
  return gulp.src('public/**/*.css')
    .pipe(plumber())
    .pipe(postcss(optimization_plugins))
    .pipe(gulp.dest('public'));
});

gulp.task('clean', function () {
  return del('public/img/sprite');
});

gulp.task('build', gulp.parallel('js-optim', 'сss-optim', 'clean'));
/*---------------------END: Build--------------------------*/


/*---------------------RELOAD BROWSERS--------------------------*/
const browserSync = require('browser-sync').create();
gulp.task('reload', function (done) {
  browserSync.reload();
  done();
});
/*---------------------END: RELOAD BROWSERS--------------------------*/


gulp.task('default', gulp.series(gulp.parallel(gulp.series('img', 'css'), gulp.series('scripts', 'js-es'), gulp.series('html', function () {
  browserSync.init({
    server: {
      baseDir: "./public/",
      open: false
    }
  })
  gulp.watch('frontend/img/**/*.*', gulp.series('img', 'reload'));
  gulp.watch(['frontend/css/*.scss'], gulp.series('css', 'reload'));
  gulp.watch(['frontend/js/**/*.js', 'frontend/components/**/*.js'], gulp.series('scripts', 'js-es', 'reload'));
  gulp.watch(['frontend/html/*.pug'], gulp.series('html', 'reload'));
}))
));