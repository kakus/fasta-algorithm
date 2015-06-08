var gulp = require('gulp'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    gulpVariables = require('./gulpVariables');

gulp.task('build-view', function() {
    return gulp.src(gulpVariables.sourceFiles)
        .pipe(concat(gulpVariables.fileName))
        .pipe(gulp.dest('../build'));
});

gulp.task('live-view', function () {
    watch(gulpVariables.sourceFiles, function() {
        gulp.start('build-view');
    });
});

gulp.task('default', function () {
    with (console) {
        log("usage: gulp [build-view | live-view]");
        log("");
        log("          build-view        - builds library for view module and puts output in build folder.\n");
        log("          live-view         - builds library for view module after any change in source files\n");
        log("                              and puts output in build folder.\n");
        log("");
    }
});