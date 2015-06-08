var gulp = require('gulp'),
    concat = require('gulp-concat'),
    viewVariables = require('./view/gulpVariables'),
    algorithmVariables = require('./algorithm/gulpVariables');

gulp.task('build-all', function() {
   gulp.run('build-fasta', 'build-fasta-view');
});

gulp.task('build-fasta-view', function() {
    return gulp.src(viewVariables.sourceFiles.map(function(a) {return 'view/' + a}))
        .pipe(concat(viewVariables.fileName))
        .pipe(gulp.dest('./build'));
});

gulp.task('build-fasta', function() {
    return gulp.src(algorithmVariables.sourceFiles.map(function(a) {return 'algorithm/' + a}))
        .pipe(concat(algorithmVariables.fileName))
        .pipe(gulp.dest('./build'));
});

gulp.task('default', function () {
    with (console) {
        log("usage: gulp [build-all | build-fasta | build-fasta-view]");
        log("");
        log("          build-all         - builds library for both modules and puts output in build folder.\n");
        log("          build-fasta       - builds library only for algorithm module and puts output in build folder.\n");
        log("          build-fasta-view  - builds library only for view module and puts output in build folder");
        log("");
        log("To run more specific tasks i.e. tests, see gulp commands for given module.");
    }
});