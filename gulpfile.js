var $           = require('gulp-load-plugins')(),
browserSync = require('browser-sync'),
gulp        = require('gulp'),
less = require('gulp-less'),
path = require('path'),
del = require('del');

var files = {
    myScripts: ['./src/*.js', '!jquery*'],
    projectScripts: ['./src/*.js', '!*file.js']
};

gulp.task('clean', function (cb) {
    del('dist', cb);
});

gulp.task('lint', function () {
    return gulp.src(files.myScripts)
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('less', function () {
  return gulp.src('./src/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('scripts', ['lint', 'clean'], function () {
    return gulp.src(files.projectScripts)
        .pipe($.concat('slippry.js'))
        .pipe($.uglify())
        .pipe($.rename({extname: '.min.js'}))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function() {
  browserSync({
    proxy: 'slippry.dev'
  });
  gulp.watch([path.source + 'styles/**/*'], ['styles']);
  gulp.watch([path.source + 'scripts/**/*'], ['jshint', 'scripts']);
  gulp.watch([path.source + 'fonts/**/*'], ['fonts']);
  gulp.watch([path.source + 'images/**/*'], ['images']);
  gulp.watch(['bower.json'], ['wiredep']);
  gulp.watch('**/*.html', function() {
    browserSync.reload();
  });
});


gulp.task('default', ['lint', 'clean', 'less', 'scripts']);