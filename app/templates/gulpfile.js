const gulp = require('gulp')
const gulpSass = require('gulp-sass')
const gulpSourcemaps = require('gulp-sourcemaps')
const gulpRename = require('gulp-rename')
const gulpClean = require('gulp-clean')
const gulpReplace = require('gulp-replace')
const relative = require('relative')
const prettier = require('prettier')
const resolve = require('resolve')
const webpackStream = require('webpack-stream')
const webpack = require('webpack')
const gulpEslint = require('gulp-eslint')
const gulpImagemin = require('gulp-imagemin')
const deepEqual = require('deep-equal')
const gulpStylelint = require('gulp-stylelint')
const del = require('del')
const path = require('path')
const argv = require('yargs').argv
const options = {
  'target': argv.target || 'weapp'
}

const isWeapp = options.target === 'weapp'
const isSwan = options.target === 'swan'
const isAliapp = options.target === 'aliapp'

let dependencies = null
let prevDependencies = null
let DEST = ''
let ADAPTER_SOURCE = ''

if (isWeapp) {
  DEST = 'distWeapp'
  ADAPTER_SOURCE = 'weapp'
} else if (isSwan) {
  DEST = 'distSwan'
  ADAPTER_SOURCE = 'swan'
} else {
  DEST = 'distAliapp'
  ADAPTER_SOURCE = 'aliapp'
}

// XML = 'src/**/*.{wxml,wxss}'

const SRC = {
  STYLE: ['src/**/*.{css,scss}', '!src/adapters/**/*'],
  SCRIPT: ['src/**/*.js', '!src/adapters/**/*'],
  JSON: ['src/**/*.json', '!src/project*.json', '!src/adapters/**/*'],
  IMAGE: ['src/**/*.{png,jpg,jpeg,gif,svg}', '!src/adapters/**/*'],
  CONFIG: 'src/project*.json',
  XML: ['src/**/*.wxml', '!src/adapters/**/*'],
  ADAPTER: `src/adapters/${ADAPTER_SOURCE}/**/*`,
  ADAPTER_INDEX: 'src/adapters/index.js',
}

function handleError (err) {
  console.log(err.toString())
  process.exit(-1)
}

function imagemin() {
  return gulp
    .src(SRC.IMAGE, {since: gulp.lastRun(imagemin)})
    .pipe(gulpImagemin({
      verbose: true,
    }))
    .pipe(gulp.dest(DEST))
}

function cleanDist() {
  return gulp.src(DEST, { allowEmpty: true }).pipe(gulpClean())
}

let preProcessAdapterPath = []
// 兼容代码预处理
function preProcessAdapter() {
  return gulp
    .src(SRC.ADAPTER, {since: gulp.lastRun(preProcessAdapter)})
    .pipe(
      gulpRename(path => {
        if (path.extname !== '') {
          preProcessAdapterPath.push(`src/${path.dirname}/${path.basename}${path.extname}`)
        }
      })
    )
    .pipe(gulp.dest('src'))
}
// 兼容代码预处理
function preProcessAdapterIndex() {
  return gulp
    .src(SRC.ADAPTER_INDEX)
    .pipe(
      gulpRename(path => {
        if (path.extname !== '') {
          preProcessAdapterPath.push(`src/common/adapters/${path.basename}${path.extname}`)
        }
      })
    )
    .pipe(gulp.dest('src/common/adapters'))
}
// 删除预处理后的兼容代码
function processedAdapterCodeClean() {
  return gulp
    .src(preProcessAdapterPath, { allowEmpty: true })
    .pipe(gulpClean())
}

function xml() {
  return gulp
    .src(SRC.XML, {since: gulp.lastRun(xml)})
    .pipe(gulp.dest(DEST))
}

function eslint() {
  return gulp
    .src(SRC.SCRIPT, {since: gulp.lastRun(eslint)})
    .pipe(
      gulpEslint({
        configFile: '.eslintrc',
        fix: true,
      })
    )
    .pipe(gulpEslint.format())
    .pipe(gulp.dest('./src/'))
}

function pathScriptCommon() {
  return gulp
    .src(SRC.SCRIPT, {since: gulp.lastRun(pathScript)})
    .pipe(
      gulpReplace(/('src\/).*'/g, function (match) {
        let relativePath = `'${relative(
          `/src/${this.file.relative}`,
          `/${match.substring(1, match.length - 1)}`
        )}'`

        if (!/^'\.\.\/.*/.test(relativePath)) {
          relativePath = `'./${relativePath.substring(1, match.length)}`
        }

        return relativePath
      })
    )
    .pipe(
      gulpReplace(/\bfrom '[^\.]\S*'/g, function (match) {
        const dependency = match.substring(6, match.length - 1)
        const relativePath = relative(
          `/${this.file.relative}`,
          `/node/${dependency}`
        )

        dependencies = {
          ...dependencies,
          [dependency]: resolve.sync(dependency, { basedir: __dirname }),
        }

        return `from '${relativePath}'`
      })
    )
}
function pathScript() {
  return pathScriptCommon().pipe(gulp.dest(DEST))
}

// 支付宝小程序适配-组件生命周期/组件properties
function compileScript2Aliapp() {
  return pathScriptCommon()
    .pipe(
      gulpReplace(/attached|ready/g, function (match) {
        return 'didMount'
      })
    )
    .pipe(
      gulpReplace(/detached/g, function (match) {
        return 'didUnmount'
      })
    )
    .pipe(
      gulpReplace(/\.properties/g, function (match) {
        return '.props'
      })
    )
    .pipe(gulp.dest(DEST))
}

function packDep(done) {
  const flag = dependencies && deepEqual(dependencies, prevDependencies)
  console.log(dependencies)
  console.log(prevDependencies)

  if (flag) return done()

  prevDependencies = dependencies

  return gulp
    .src('src/app.js')
    .pipe(
      webpackStream(
        {
          mode: 'production',
          watch: false,
          entry: dependencies,
          output: {
            libraryTarget: 'umd',
            filename: '[name].js',
          },
        },
        webpack
      )
    )
    .pipe(gulp.dest(`${DEST}/node`))
}

function pathJson() {
  return gulp
    .src(SRC.JSON, {since: gulp.lastRun(pathJson)})
    .pipe(
      gulpReplace(/("src\/).*"/g, function (match) {
        const relativePath = `"${relative(
          `/src/${this.file.relative}`,
          `/${match.substring(1, match.length - 1)}`
        )}"`

        return relativePath
      })
    )
    .pipe(gulp.dest(DEST))
}

function stylelint() {
  return gulp
    .src(SRC.STYLE, {since: gulp.lastRun(stylelint)})
    .pipe(gulpStylelint({
      failAfterError: false,
      fix: true,
    }).on('error', handleError))
    .pipe(gulp.dest('src'))
    .pipe(
      gulpRename(path => {
        path.extname = isWeapp ? '.wxss' : (isSwan ? '.css' : '.acss')
      })
    )
    .pipe(
      gulpReplace(/\.css/g, function (match) {
        return isWeapp ? '.wxss' : (isSwan ? '.css' : '.acss')
      })
    )
    .pipe(gulp.dest(DEST))
}

function compileXML2Swan() {
  return gulp
    .src(SRC.XML)
    .pipe(
      gulpReplace(/(if|elif|for)=\"\{\{(.*?)\}\}\"/g, function (match, p1, p2) {
        return `${p1}="${p2}"`
      })
    )
    .pipe(
      gulpReplace(/wx\:|\.wxml/g, function (match) {
        if (match === '.wxml') {
          return '.swan'
        } else {
          return 's-'
        }
      })
    )
    .pipe(
      gulpReplace(/(\<template.*data=\")\{\{(.*?)\}\}\"/g, function (match, p1, p2) {
        return `${p1}{{{${p2}}}}"`
      })
    )
    .pipe(
      gulpRename(path => {
        path.extname = '.swan'
      })
    )
    .pipe(gulp.dest(DEST))
}

function compileXML2Aliapp() {
  return gulp
    .src(SRC.XML)
    .pipe(
      gulpReplace(/wx\:|\.wxml/g, function (match) {
        if (match === '.wxml') {
          return '.axml'
        } else {
          return 'a:'
        }
      })
    )
    .pipe(
      gulpReplace(/\s(capture\-bind|catch)\:?([a-z])ouch([a-z])/g, function (match, p1, p2, p3) {
        return ` catch${p2.toUpperCase()}ouch${p3.toUpperCase()}`
      })
    )
    .pipe(
      gulpReplace(/\s(bind|catch)\:?([a-z])ong([a-z])/g, function (match, p1, p2, p3) {
        const key = p1 === 'catch' ? p1 : 'on'
        return ` ${key}${p2.toUpperCase()}ong${p3.toUpperCase()}`
      })
    )
    .pipe(
      gulpReplace(/\s(bind|catch)\:?([a-z])/g, function (match, p1, p2) {
        const key = p1 === 'catch' ? p1 : 'on'
        return ` ${key}${p2.toUpperCase()}`
      })
    )
    .pipe(
      gulpRename(path => {
        path.extname = '.axml'
      })
    )
    .pipe(gulp.dest(DEST))
}

function copyConfig() {
  return gulp
    .src(`config/project.${isWeapp ? 'config' : (isSwan ? 'swan' : 'aliapp')}.json`, {since: gulp.lastRun(copyConfig)})
    .pipe(gulp.dest(DEST))
}

function sass() {

  return gulp
    .src('src/**/*.swan', {since: gulp.lastRun(sass), allowEmpty: true})
    .pipe(gulpClean())
    // .pipe(
    //   gulpRename(path => {
    //     path.extname = '.swan'
    //   })
    // )
    // .pipe(gulp.dest('src'))

  // return gulp
  //   .src(SRC.STYLE, {since: gulp.lastRun(sass)})
  //   .pipe(gulpSourcemaps.init())
  //   .pipe(gulpSass().on('error', gulpSass.logError))
  //   .pipe(gulpSourcemaps.write())
  //   .pipe(
  //     gulpRename(path => {
  //       path.extname = '.css'
  //     })
  //   )
  //   .pipe(gulp.dest(DEST))
}

function formatScript() {
  return gulp
    .src(SRC.SCRIPT, {since: gulp.lastRun(formatScript)})
    .pipe(
      gulpReplace(/([\s\S]*)/, (match, string) => {
        const options = {
          semi: false,
          singleQuote: true,
          trailingComma: 'all',
        }

        return prettier.format(string, options)
      })
    )
    .pipe(gulp.dest('src'))
}

const js = isAliapp ? gulp.series(eslint, compileScript2Aliapp, packDep) : gulp.series(eslint, pathScript, packDep)
const styles = gulp.series(stylelint)
const swan = gulp.series(compileXML2Swan)
const axml = gulp.series(compileXML2Aliapp)
const config = gulp.series(copyConfig)
const adapter = gulp.series(preProcessAdapterIndex, preProcessAdapter)
const build = gulp.series(cleanDist, adapter, gulp.parallel(pathJson, imagemin, js, styles, config, isWeapp ? xml : (isSwan ? swan : axml)))
const start = gulp.series(build, watch)

function watch() {
  gulp.watch(SRC.ADAPTER, preProcessAdapter)
  gulp.watch(SRC.ADAPTER_INDEX, preProcessAdapterIndex)
  gulp.watch(SRC.STYLE, styles)
  gulp.watch(SRC.SCRIPT, js)
  gulp.watch(SRC.JSON, pathJson)
  gulp.watch(SRC.IMAGE, imagemin)
  if (isWeapp) {
    gulp.watch(SRC.XML, xml)
  } else if (isSwan) {
    gulp.watch(SRC.XML, swan)
  } else {
    gulp.watch(SRC.XML, axml)
  }
  gulp.watch(SRC.CONFIG, config)
  gulp.watch([SRC.STYLE, SRC.SCRIPT, SRC.JSON, SRC.IMAGE, SRC.XML, SRC.CONFIG])
    .on('unlink', function(filepath) {
      const filePathFromSrc = path.relative(path.resolve('src'), filepath);
      const destFilePath = path.resolve('dist', filePathFromSrc);

      del.sync(destFilePath);
    })
}


gulp.task('js', js)

gulp.task('format', gulp.series(formatScript, eslint, stylelint))

gulp.task('stylelint', stylelint)

gulp.task('watch', watch)

gulp.task('start', start)
