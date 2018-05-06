const gulp = require('gulp')
const fs = require('fs')
const path = require('path')
const babel = require('gulp-babel')
const sass = require('gulp-sass')
const clean = require('gulp-clean')
const sequence = require('gulp-run-sequence')
const sourcemaps = require('gulp-sourcemaps')
const utils = require('./utils')

// Clean
const cleanDirs = ['es', 'lib', 'site', 'dist']
const cleans = []
cleanDirs.forEach(dir => {
  gulp.task(`clean:${dir}`, () => {
    return gulp.src(utils.resolve(dir))
      .pipe(clean({force: true}))
  })
  cleans.push(`clean:${dir}`)
})
gulp.task('clean', cleans)

// 编译esModules版本
gulp.task('build:es', () => {
  return gulp.src(utils.resolve('src/lib/**/*.js'))
    .pipe(babel())
    .pipe(gulp.dest(utils.resolve('es')))
})

// 分开编译JS，方便单个引入
gulp.task('build:lib', () => {
  return gulp.src(utils.resolve('src/lib/**/*.js'))
    .pipe(babel())
    .pipe(gulp.dest(utils.resolve('lib')))
})

// cp scss
gulp.task('cp:scss', function () {
  return gulp.src(utils.resolve('src/lib/**/*.scss'))
    .pipe(gulp.dest(utils.resolve('lib')))
    .pipe(gulp.dest(utils.resolve('es')))
})
// generator dist scss
gulp.task('gen:dist:scss', function () {
  const dist = path.resolve('../dist')
  if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist)
  }

  const targetPath = path.join(dist, 'index.scss')
  const str = '@import "../lib/styles/index.scss";'

  fs.writeFileSync(targetPath, str)

  // concat
  return gulp.src(utils.resolve('src/lib/styles/index.scss'))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(utils.resolve('dist')))
})

// 编译scss
gulp.task('build:scss', function () {
  // complie
  return gulp.src(utils.resolve('src/lib/**/index.scss'))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(utils.resolve('lib')))
    .pipe(gulp.dest(utils.resolve('es')))
})

gulp.task('default', function (cb) {
  sequence(['build:lib', 'build:es'], ['cp:scss', 'build:scss', 'gen:dist:scss'], cb)
})