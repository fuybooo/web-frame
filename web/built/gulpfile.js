// 禁止提示框
process.env.DISABLE_NOTIFIER = true;
// 载入插件
var gulp = require('gulp'),
    browserSync = require('browser-sync');
gulp.task('serve', function () {
    browserSync.init({
        // open: false,
        server: {
            baseDir: './'
        }
    });
    gulp.watch(['./**/*.*']).on('change', browserSync.reload);
});
gulp.task('default', ['serve']);



