var gulp            = require('gulp'),
    rename          = require('gulp-rename'),
    uglify          = require('gulp-uglify'),
    cssmin          = require('gulp-cssmin'),
    concat          = require('gulp-concat'),
    ngAnnotate      = require('gulp-ng-annotate'),
    sass            = require('gulp-sass'),
    templateCache   = require('gulp-angular-templatecache');

var vendorScripts = [
  'node_modules/c3/c3.js',
  'node_modules/d3/d3.js',
  'node_modules/lodash/lodash.js',
  'node_modules/angular/angular.js',
  'node_modules/angular-ui-router/release/angular-ui-router.js',
  'node_modules/angular-ui-bootstrap/ui-bootstrap.js',
  'node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.js',
  'node_modules/restangular/dist/restangular.js',
  'node_modules/moment/moment.js',
  'node_modules/angular-moment/angular-moment.js',
  'node_modules/c3-angularjs/c3-angular.js',
];

var vendorCss = [
  'node_modules/bootstrap/dist/css/bootstrap.css',
  'node_modules/c3/c3.css',
];

var appCss = [
  'src/css/style.scss',
];

var fonts = [
  'node_modules/bootstrap/dist/fonts/**/*.*',
]

var files = [
  'src/index.html', 'src/favicon.png'
];

//scripts
gulp.task('scripts-vendor', function() {
  return gulp.src(vendorScripts)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('scripts-app', function() {
  return gulp.src('src/js/app/**/*.js')
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest('build/js/app'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('build/js/app'));
});

gulp.task('templates', function () {
  return gulp.src('src/js/app/**/*.html')
    .pipe(templateCache({ base: function(file) { return 'js/app/' + file.path.replace(file.base, ''); } }))
    .pipe(gulp.dest('build/js/app'));
});

gulp.task('css-vendor', function() {
  return gulp.src(vendorCss)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssmin())
    .pipe(gulp.dest('build/css'));
});

gulp.task('css-app', function() {
  return gulp.src(appCss)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssmin())
    .pipe(gulp.dest('build/css'));
});

gulp.task('fonts', function() {
  return gulp.src(fonts)
    .pipe(gulp.dest('build/fonts'));
});

gulp.task('files', function() {
  return gulp.src(files)
    .pipe(gulp.dest('build'));
});

gulp.task('default', ['scripts-vendor', 'scripts-app', 'css-vendor', 'css-app', 'files', 'fonts', 'templates']);