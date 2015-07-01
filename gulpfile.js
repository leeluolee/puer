var gulp = require('gulp');
var webpack = require('gulp-webpack');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');
var source = require('vinyl-source-stream');
var regularify = require('regularify');
var browserify = require('browserify');
var pkg = require("./package.json");



var wpConfig = {
  output: {
    filename: "client.bundle.js",
    library: "puer",
    libraryTarget: "umd"
  },
  module: {
    loaders: [
        { test: /\.html$/, loader: "text" }
    ]
  }
}


gulp.task('client', function() {
  browserify(['./src/client/client.js'], {})
    .transform(regularify({
      END: '}',
      BEGIN: '{',
      rglExt: ['html'],
      rglcExt: ['rglc']
    }))
    .bundle()
    .on('error', function(err){
      console.log('!!!!!!!!!!!!' + err)
      // kao....
      done(null)
      this.end();
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('src/client'))

  // gulp.src("client/client.js")
  //   .pipe(webpack(wpConfig))
  //   .pipe(gulp.dest('./client'))
  //   .on("error", function(err) {
  //     throw err
  //   })
});

gulp.task('jshint', function(){
      // jshint
  gulp.src(['libs/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))

})



gulp.task('watch', ["client", 'jshint'], function() {
  gulp.watch(['libs/**/*.js'], ['jshint']);
  gulp.watch(['client/*.js'], ['client']);
})

gulp.task('default', ['watch']);

gulp.task('mocha', function() {
  return gulp.src(['test/spec/*.js'])
    .pipe(mocha({ reporter: 'spec' }))
    .on('error', function() {
      console.log('\u0007');
    })
});