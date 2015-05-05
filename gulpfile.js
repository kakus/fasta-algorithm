var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    karma = require('karma').server,
    runner = require('karma').runner;

var projectFiles = [ 'src/**/*.js', 'test/**/*.js' ],

    // The order of files here it the order in which they will be merged into
    // one file.
    sourceFiles = [
      'src/Utils.js',
      'src/IndexingArray.js',
      'src/FindHotspots.js'
    ];


gulp.task('jshint', function() {
   return gulp.src('src/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build', function() {
   return gulp.src(sourceFiles)
      .pipe(concat('fasta.js'))
      .pipe(gulp.dest('build'));
});

gulp.task('test', ['build'], function(done) {
   karma.start({
      configFile: __dirname + '/karma.conf.js',
   }, function() { done() });
});

gulp.task('start-test-server', function(done) {
   karma.start({
      configFile: __dirname + '/karma.conf.js',
      singleRun: false
   }, function() { done() });
});

gulp.task('run-tests', ['build'], function(done) {
   runner.run({port: 9876}, function() { done() });
});

gulp.task('watch', function() {
   gulp.watch(projectFiles, ['jshint', 'build', 'run-tests']);
});

gulp.task('default', function() {
   with (console) {
      log("usage: gulp [build | test | start-test-server | watch]");
      log("");
      log("          build             - builds library and puts output in build folder.\n");
      log("          test              - run test once.\n");
      log("          watch             - watch src files and test files, so when");
      log("                              they change, lint them and run test.");
      log("                              Before you WATCH start test server.\n");
      log("          start-test-server - start test server so when you change");
      log("                              something the test will be executed.");
   }
});
