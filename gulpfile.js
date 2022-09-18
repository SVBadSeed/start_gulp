'use strict';

const gulp = require('gulp');
const series = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
        notofy: false
    })
}


function buildStyles() {
    return gulp.src('app/scss/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid: true
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
}


function scripts() {
    return gulp.src('app/js/main.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.stream());
}


function images() {
    return gulp.src('app/images/**/*')
        .pipe(imagemin([imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('dist/images'))
}


function build() {
    return gulp.src([
        'app/**/*.html',
        'app/css/style.min.css',
        'app/js/main.min.js'
    ], {base: 'app'})
        .pipe(gulp.dest('dist'))
}

function watching() {
    gulp.watch(['app/**/*.scss'], buildStyles);
    gulp.watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
    gulp.watch(['app/**/*.html']).on('change', browserSync.reload);
}


exports.buildStyles = buildStyles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.build = gulp.series(images, build);
exports.default = gulp.parallel(buildStyles, scripts, browsersync, watching);




















