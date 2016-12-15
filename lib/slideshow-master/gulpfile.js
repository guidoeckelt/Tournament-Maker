const gulp = require('gulp');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-ruby-sass');


// JS
gulp.task('lint', () => {
  return gulp.src('./src/js/slideshow.js')
    .pipe(jshint({esversion: 6}))
    .pipe(jshint.reporter('default'));
});

gulp.task('js', () => {
  return gulp.src('./src/js/slideshow.js')
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});


// CSS
gulp.task('sass', () => {
  return sass('./src/scss/slideshow.scss', {style: 'compressed'})
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/css'));
});




gulp.task('default', ['js', 'sass']);