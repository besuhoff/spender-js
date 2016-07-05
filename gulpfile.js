var gulp            = require('gulp'),
    rename          = require('gulp-rename'),
    uglify          = require('gulp-uglify'),
    cssmin          = require('gulp-cssmin'),
    concat          = require('gulp-concat'),
    ngAnnotate      = require('gulp-ng-annotate'),
    sass            = require('gulp-sass'),
    rev             = require('gulp-rev'),
    merge           = require('merge-stream'),
    revdel          = require('gulp-rev-delete-original'),
    revreplace      = require('gulp-rev-replace'),
    clean           = require('gulp-clean'),
    filter          = require('gulp-filter'),
    base            = require('gulp-base'),
    templateCache   = require('gulp-angular-templatecache');

var vendorScripts = [
  'node_modules/jquery/dist/jquery.js',
  'node_modules/bootstrap/dist/js/bootstrap.js',
  'node_modules/lodash/lodash.js',
  'node_modules/angular/angular.js',
  'node_modules/angular-ui-router/release/angular-ui-router.js',
  'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
  'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
  'node_modules/restangular/dist/restangular.js',
  'node_modules/moment/moment.js',
  'node_modules/angular-moment/angular-moment.js',
  'node_modules/chart.js/dist/Chart.js',
  'node_modules/angular-chart.js/dist/angular-chart.js',
];

var vendorScriptsMin = [
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/bootstrap/dist/js/bootstrap.min.js',
  'node_modules/lodash/lodash.min.js',
  'node_modules/angular/angular.min.js',
  'node_modules/angular-ui-router/release/angular-ui-router.min.js',
  'node_modules/angular-ui-bootstrap/ui-bootstrap.min.js',
  'node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.min.js',
  'node_modules/restangular/dist/restangular.min.js',
  'node_modules/moment/moment.min.js',
  'node_modules/angular-moment/angular-moment.min.js',
  'node_modules/chart.js/dist/Chart.min.js',
  'node_modules/angular-chart.js/dist/angular-chart.min.js',
];

var vendorCss = [
  'node_modules/font-awesome/css/font-awesome.css',
  'src/css/lib/bootstrap.bootswatch-lumen.css',
];

var appCss = [
  'src/css/app/style.scss',
];

var fonts = [
  'node_modules/bootstrap/dist/fonts/**/*.*',
  'node_modules/font-awesome/fonts/**/*.*',
]

var files = [
  'src/index.html', 'src/favicon.png'
];

gulp.task('clean', function() {
  return gulp.src('build/', {read: false})
    .pipe(clean());
});

gulp.task('scripts-vendor', ['clean'], function() {
  return gulp.src(vendorScripts)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('scripts-vendor-min', ['clean'], function() {
  return gulp.src(vendorScriptsMin)
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('scripts-app', ['clean'], function() {
  return gulp.src('src/js/app/**/*.js')
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest('build/js/app'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('build/js/app'));
});

gulp.task('templates', ['clean'], function () {
  return gulp.src('src/js/app/**/*.html')
    .pipe(templateCache({ base: function(file) { return 'js/app/' + file.path.replace(file.base, ''); } }))
    .pipe(gulp.dest('build/js/app'));
});

gulp.task('css-vendor', ['clean'], function() {
  return gulp.src(vendorCss)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssmin())
    .pipe(gulp.dest('build/css'));
});

gulp.task('css-app', ['clean'], function() {
  return gulp.src(appCss)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssmin())
    .pipe(gulp.dest('build/css'));
});

gulp.task('fonts', ['clean'], function() {
  return gulp.src(fonts)
    .pipe(gulp.dest('build/fonts'));
});

gulp.task('files', ['clean'], function() {
  return gulp.src(files)
    .pipe(gulp.dest('build'));

});

gulp.task('scripts', ['scripts-app', 'scripts-vendor', 'scripts-vendor-min', 'templates']);
gulp.task('css', ['css-app', 'css-vendor']);

gulp.task('rev', ['files', 'scripts', 'css', 'fonts'], function() {
  var patterns = ['build/js/**/*.js', 'build/css/**/*.css', 'build/*.*'],

    notIndexFilter = filter(['**/*', '!build/index.html'], {restore: true});

    var jsStream = gulp.src(patterns[0], { base: 'build/js' })
      .pipe(rev())
      .pipe(gulp.dest('build/js'))
      .pipe(revdel())
      .pipe(base({ base: 'build', original: false }))
      .pipe(gulp.dest('build/js'))
      .pipe(rev.manifest('build/manifest.json', { merge: true, base: 'build' })),

      cssStream = gulp.src(patterns[1], { base: 'build/css' })
        .pipe(rev())
        .pipe(gulp.dest('build/css'))
        .pipe(revdel())
        .pipe(gulp.dest('build/css'))
        .pipe(base({ base: 'build', original: false }))
        .pipe(rev.manifest('build/manifest.json', { merge: true, base: 'build' })),

      filesStream = gulp.src(patterns[2], { base: 'build' })
        .pipe(notIndexFilter)
        .pipe(rev())
        .pipe(gulp.dest('build'))
        .pipe(revdel())
        .pipe(gulp.dest('build'))
        .pipe(base({ base: 'build', original: false }))
        .pipe(rev.manifest('build/manifest.json', { merge: true, base: 'build' }))
        .pipe(notIndexFilter.restore);

    return merge(jsStream, cssStream, filesStream)
      .pipe(gulp.dest('build'));
});

gulp.task('rev-replace', ['rev'], function() {
  return gulp.src('build/index.html')
    .pipe(revreplace({ base: 'build', manifest: gulp.src('build/manifest.json') }))
    .pipe(gulp.dest('build'));
});

gulp.task('rev-clean', ['rev-replace'], function() {
  return gulp.src('build/manifest.json')
    .pipe(clean());
});

gulp.task('default', ['rev-clean']);
