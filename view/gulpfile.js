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
        gulp.start('build');
    });
});
