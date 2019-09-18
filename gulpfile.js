const gulp = require('gulp');
const gulpClean = require('gulp-clean')

const clean = () => {
    return gulp.src('dist', { allowEmpty: true }).pipe(gulpClean())
}

const script = () => {
    return gulp
        .src(['**/*'])
        .pipe(gulp.dest('dist'));
};

const build = gulp.series(clean, script);

module.exports = { build };
