const gulp = require('gulp')
const gulpRename = require('gulp-rename')
const gulpClean = require('gulp-clean')
const gulpReplace = require('gulp-replace')
const relative = require('relative')
const prettier = require('prettier')
const resolve = require('resolve')
const webpackStream = require('webpack-stream')
const webpack = require('webpack')
const gulpEslint = require('gulp-eslint')
const deepEqual = require('deep-equal')
const gulpStylelint = require('gulp-stylelint')
const del = require('del')
const path = require('path')
const argv = require('yargs').argv
const options = {
  'target': argv.target || 'weapp'
}
const APP_TYPE = options.target

const isWeapp = options.target === 'weapp'
const isSwan = options.target === 'swan'
const isAliapp = options.target === 'aliapp'
const isQqapp = options.target === 'qqapp'
const isTtapp = options.target === 'ttapp'

let dependencies = null
let prevDependencies = null
let DEST = ''
let API_ADAPTER = ''

if (isWeapp) {
  DEST = 'distWeapp'
} else if (isSwan) {
  DEST = 'distSwan'
  API_ADAPTER = 'swan.'
} else if (isQqapp) {
  DEST = 'distQqapp'
  API_ADAPTER = 'qq.'
} else if (isTtapp) {
  DEST = 'distTtapp'
  API_ADAPTER = 'tt.'
}  else {
  DEST = 'distAliapp'
  API_ADAPTER = 'my.'
}

// XML = 'src/**/*.{wxml,wxss}'

const SRC = {
  STYLE: ['src/**/*.{css,scss}', '!src/adapters/**/*'],
  SCRIPT: ['src/**/*.js', '!src/adapters/**/*'],
  JSON: ['src/**/*.json', '!src/project*.json', '!src/adapters/**/*'],
  IMAGE: ['src/**/*.{png,jpg,jpeg,gif,svg}', '!src/adapters/**/*'],
  CONFIG: 'src/project*.json',
  XML: ['src/**/*.wxml', '!src/adapters/**/*'],
  ADAPTER: [`src/adapters/unique/${APP_TYPE}/**/*`, `src/adapters/common/${APP_TYPE}/**/*`]
}

function handleError (err) {
  console.log(err.toString())
  process.exit(-1)
}

function imagemin() {
  return gulp
    .src(SRC.IMAGE, {since: gulp.lastRun(imagemin)})
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
function compileXmlCommon () {
  return gulp
    .src(SRC.XML, {since: gulp.lastRun(xml)})
    .pipe(
      gulpReplace(/APP\_TYPE/g, function (match) {
        return `'${APP_TYPE}'`
      })
    )
}
function xml() {
  return compileXmlCommon().pipe(gulp.dest(DEST))
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

function compileScriptCommon() {
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
    ).pipe(
      gulpReplace(/APP\_TYPE/g, function (match) {
        return `'${APP_TYPE}'`
      })
    )
}
function pathScript() {
  return compileScriptCommon().pipe(gulp.dest(DEST))
}

// 支付宝小程序适配-组件生命周期/组件properties
function compileScript2Aliapp() {
  return compileScriptCommon()
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
    .pipe(
      gulpReplace(/wx\./g, function (match) {
        return API_ADAPTER
      })
    )
    .pipe(gulp.dest(DEST))
}

// 百度小程序适配 script
function compileScript2Swan() {
  return compileScriptCommon()
    .pipe(
      gulpReplace(/wx\./g, function (match) {
        return API_ADAPTER
      })
    )
    .pipe(gulp.dest(DEST))
}

// QQ小程序适配 script
function compileScript2Qqapp() {
  return compileScriptCommon()
    .pipe(
      gulpReplace(/wx\./g, function (match) {
        return API_ADAPTER
      })
    )
    .pipe(gulp.dest(DEST))
}

// 头条小程序适配 script
function compileScript2Ttapp() {
  return compileScriptCommon()
    .pipe(
      gulpReplace(/wx\./g, function (match) {
        return API_ADAPTER
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
  let cssName = ''

  if (isWeapp) {
    cssName = '.wxss'
  } else if (isQqapp) {
    cssName = '.qss'
  } else if (isSwan) {
    cssName = '.css'
  } else if (isTtapp) {
    cssName = '.ttss'
  } else {
    cssName = '.acss'
  }

  return gulp
    .src(SRC.STYLE, {since: gulp.lastRun(stylelint)})
    .pipe(gulpStylelint({
      failAfterError: false,
      fix: true,
    }).on('error', handleError))
    .pipe(gulp.dest('src'))
    .pipe(
      gulpRename(path => {
        path.extname = cssName
      })
    )
    .pipe(
      gulpReplace(/\.css/g, function (match) {
        return cssName
      })
    )
    .pipe(gulp.dest(DEST))
}

function compileXML2Swan() {
  return compileXmlCommon()
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
  return compileXmlCommon()
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

function compileXML2Qqapp() {
  return compileXmlCommon()
    .pipe(
      gulpReplace(/wx\:|\.wxml/g, function (match) {
        if (match === '.wxml') {
          return '.qml'
        } else {
          return 'qq:'
        }
      })
    )
    .pipe(
      gulpRename(path => {
        path.extname = '.qml'
      })
    )
    .pipe(gulp.dest(DEST))
}

function compileXML2Ttapp() {
  return gulp
    .src(SRC.XML)
    .pipe(
      gulpReplace(/wx\:|\.wxml/g, function (match) {
        if (match === '.wxml') {
          return '.ttml'
        } else {
          return 'tt:'
        }
      })
    )
    .pipe(
      gulpRename(path => {
        path.extname = '.ttml'
      })
    )
    .pipe(gulp.dest(DEST))
}

// todo
function copyConfig() {
  return gulp
    .src(`config/project.${APP_TYPE}.json`, {since: gulp.lastRun(copyConfig)})
    .pipe(
      gulpRename(path => {
        if (isWeapp || isQqapp || isTtapp) {
          path.basename = 'project.config'
        }
      })
    )
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


const swan = gulp.series(compileXML2Swan)
const axml = gulp.series(compileXML2Aliapp)
const qml = gulp.series(compileXML2Qqapp)
const ttml = gulp.series(compileXML2Ttapp)
let js = null
let mpXml = null

if (isAliapp) {
  js = gulp.series(eslint, compileScript2Aliapp, packDep)
  mpXml = axml
} else if (isSwan) {
  js = gulp.series(eslint, compileScript2Swan, packDep)
  mpXml = swan
} else if (isQqapp) {
  js = gulp.series(eslint, compileScript2Qqapp, packDep)
  mpXml = qml
} else if (isTtapp) {
  js = gulp.series(eslint, compileScript2Ttapp, packDep)
  mpXml = ttml
} else {
  js = gulp.series(eslint, pathScript, packDep)
  mpXml = xml
}


const styles = gulp.series(stylelint)
const config = gulp.series(copyConfig)
const adapter = gulp.series(preProcessAdapter)
const build = gulp.series(cleanDist, adapter, gulp.parallel(pathJson, imagemin, js, styles, config, mpXml))
const start = gulp.series(build)
// const watch = gulp.series(watch)
// todo watch优化

function watch() {
  gulp.watch(SRC.ADAPTER, preProcessAdapter)
  gulp.watch(SRC.STYLE, styles)
  gulp.watch(SRC.SCRIPT, js)
  gulp.watch(SRC.JSON, pathJson)
  gulp.watch(SRC.IMAGE, imagemin)
  gulp.watch(SRC.XML, mpXml)
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
