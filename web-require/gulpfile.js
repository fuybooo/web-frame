// 禁止提示框
process.env.DISABLE_NOTIFIER = true;
// 载入插件
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(), // gulp插件加载器
    browserSync = require('browser-sync'), // 静态服务器
    amdOptimize = require('amd-optimize'),
    rjs = require('requirejs');
/**
 * 合并压缩css
 */
gulp.task('style', function () {
    "use strict";
    return gulp.src([
        // 按顺序加载所有用到的css，如果有新增的css文件，必须放到这里
        'app/vendor/bootstrap/css/bootstrap.css',
        'app/vendor/bootstrap-table/bootstrap-table.css',
        'app/vendor/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
        'app/styles/base.css',
        'app/styles/popupwin.css',
        'app/styles/style.css'
    ]).pipe($.concat('styles.css')) // 合并所有上面列举的css，合并之后的文件名为styles.css
        .pipe($.autoprefixer()) // 自动添加浏览器厂商前缀，兼容各种浏览器
        .pipe($.csscomb()) // 重排css定义的属性
        .pipe($.cleanCss()) // 压缩css
        .pipe(gulp.dest('built/app/styles')); // 输出路径
});


/**
 * 生成template
 */
gulp.task('template', function () {
    return gulp.src('app/views/**/*.html')
    // 将所有的html模板放入到angular的template缓存中去，生成的文件是一个angular的模块，在app.js中会进行引入
        .pipe($.angularTemplatecache({
            root: 'app/views/'
        }))
        .pipe(gulp.dest('built/app/template-cache'));
});

/**
 * 处理图片
 */

/**
 * 压缩json
 */

/**
 * 临时处理图片、json、字体
 */
gulp.task('other', function () {
    "use strict";
    // 暂时只将fonts，json复制到built中
    gulp.src(['app/fonts/**/*.*']).pipe(gulp.dest('built/app/fonts'));
    gulp.src(['app/json/**/*.json']).pipe(gulp.dest('built/app/json'));
    // 对图片进行压缩
    gulp.src(['app/images/**/*.*'])
        .pipe($.cache($.imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
        .pipe(gulp.dest('built/app/images'));
});

/**
 * jshint，检查js中的语法错误
 */
gulp.task('jshint', function () {
    "use strict";
    gulp.src('app/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'));
});

/**
 * 监听文件改动执行检查
 */
gulp.task('watch', function () {
    "use strict";
    gulp.watch('app/scripts/**/*.js', ['jshint']);
});

/**
 * 启动静态服务
 */
gulp.task('serve', function () {
    browserSync.init({
        // open: false,
        server: {
            baseDir: './'
        }
    });
    gulp.watch(['./**/*.*']).on('change', browserSync.reload);
});
/**
 * 执行默认任务（开发）
 */
gulp.task('default', ['serve', 'watch']);
/**
 * 执行打包任务（发布）
 */
gulp.task('clean', function () {
    "use strict";
    gulp.src(['built/app'], {read: false}).pipe($.clean({force: true}));
});
gulp.task('release', ['style', 'template', 'other']);








