// include plug-ins
var gulp = require('gulp');
var compass = require('gulp-compass');
// var cssnano = require('gulp-cssnano');
// var concat = require('gulp-concat');
// var uglify = require('gulp-uglify');
// var svgSprite = require('gulp-svg-sprite');
// var svgmin = require('gulp-svgmin');
// var imagemin = require('gulp-imagemin');
// var pngquant = require('imagemin-pngquant');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');

// lint task
gulp.task('scss-lint', function () {
  gulp.src('./src/scss/*.scss')
    .pipe()
})

// compass task
gulp.task('compass', function () {
  gulp.src('./src/scss/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: 'src',
      sass: 'src/scss'
    }))
    .on('error', function(err) {
      // Would like to catch the error here
    })
    // .pipe(cssnano())
    .pipe(gulp.dest('src'));
});

// js task
// gulp.task('js', function(){

//   // app.js
//   gulp.src([
//     './src/js/main.js'
//     ])
//     .pipe(concat('app.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest('httpdocs/js'));

// });

// gulp.task('sprite', function(){

//   return gulp.src('./src/icons/**/*.svg')
//     .pipe(svgmin())
//     .pipe(svgSprite({
//       'mode': {
//         'css': {
//           'dest': './',
//           'layout': 'diagonal',
//           'sprite': 'httpdocs/images/sprite.svg',
//           'bust': false,
//           'render': {
//             'scss': {
//               'dest': 'src/scss/_sprite.scss',
//               'template': './src/templates/sprite-template.scss'
//             }
//           }
//         },
//         'symbol': {
//           'dest': './',
//           'prefix': '.icon-%s',
//           'inline': true,
//           'sprite': 'httpdocs/images/sprite.symbol.svg',
//           'bust': false
//         },
//       },
//       'shape': {
//         'dimension': {
//           // 'maxWidth': 20,
//           'maxHeight': 16,
//           'precision': 0,
//           'attributes': false
//         }
//       }
//     }))
//     .pipe(gulp.dest('./'));

// });

// gulp.task('imagemin', function(){

//   return gulp.src('./src/images/**/*')
//     .pipe(imagemin({
//       progressive: true,
//       svgoPlugins: [
//           {removeDimensions: false},
//           {cleanupIDs: false}
//       ],
//       use: [pngquant()]
//     }))
//     .pipe(gulp.dest('httpdocs/images'));

// });

// rerun the tasks when a file changes
gulp.task('watch', function () {

  watch('./src/scss/**/*.scss', function () {
    gulp.start('compass');
  });

  // watch('./src/js/**/*.js', function () {
  //   gulp.start('js');
  // });

  // watch('./src/icons/**/*.svg', function () {
  //   gulp.start('sprite');
  // });

  // watch('./src/images/**/*', function () {
  //   gulp.start('imagemin');
  // });

});

// default task
// gulp.task('default', ['sprite', 'svg', 'js', 'compass', 'watch']);
gulp.task('default', function(callback) {
  runSequence(
    ['compass'],
    'watch',
    callback);
});