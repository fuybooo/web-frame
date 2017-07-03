// 禁止提示框
process.env.DISABLE_NOTIFIER = true;
// 载入插件
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(), // gulp插件加载器
    browserSync = require('browser-sync'); // 静态服务器
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
 * 合并压缩js库文件
 */
gulp.task('lib', function () {
    "use strict";
    return gulp.src([
        // 按顺序加载所有js库文件，如果有新增的js库文件，必须放到这里
        'app/vendor/jquery/jquery.js',
        'app/vendor/underscore/underscore.js',
        'app/vendor/moment/moment.js',
        'app/vendor/angular/angular.js',
        'app/vendor/bootstrap/js/bootstrap.js',
        'app/vendor/echarts/echarts.js',
        'app/vendor/bootstrap-table/bootstrap-table.js',
        'app/vendor/bootstrap-datetimepicker/bootstrap-datetimepicker.js',
        'app/vendor/angular-ui-load/angular-ui-load.js',
        'app/vendor/angular-ui-router/angular-ui-router.js',
        'app/vendor/angular-animate/angular-animate.js',
        'app/vendor/angular-sanitize/angular-sanitize.js',
        'app/vendor/angular-touch/angular-touch.js',
        'app/vendor/angular-translate/angular-translate.min.js',
        'app/vendor/angular-ueditor/angular-ueditor.js',
        'app/vendor/bootstrap-datetimepicker/locales/bootstrap-datetimepicker.zh-CN.js',
        'app/vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
        'app/vendor/bootstrap-table/bootstrap-table-locale-all.js'
    ])
        .pipe($.concat('lib.js', {newLine: ';'})) // 合并所有列举的js，以分号分割
        .pipe($.uglify()) // 压缩
        .pipe(gulp.dest('built/app/lib')); // 输出
});
/**
 * 合并压缩js
 */
gulp.task('js', function () {
    "use strict";
    return gulp.src([
        // 按顺序加载项目中的js文件，在“其他文件”之上的文件一般不会有改动（文件名称的增减），除非新增公共的文件，否则此处不需要进行添加
        // 启动文件
        'app/scripts/configs/app.js',
        // 国际化 --- 需要改变时可以进行修改即可
        'app/scripts/language/cn.js',
        // 路由
        'app/scripts/configs/router.js',
        // 公共文件
        'app/scripts/common/common-service.js',
        'app/scripts/common/data-service.js',
        'app/scripts/common/common-directive.js',
        'app/scripts/common/common-filter.js',
        'app/scripts/common/bootstrap-table-directive.js',
        'app/scripts/common/popupwin-service.js',
        // 此处已经包含了在scripts中的所有js，所以新增的js文件无需添加在此处，除非新增的js文件放在了common或者configs中
        // 其他文件
        'app/scripts/**/*.js',
        '!app/scripts/common',
        '!app/scripts/configs'
    ]).pipe($.ngAnnotate())
        .pipe($.concat('app.js', {newLine: ';'})) // 合并
        .pipe($.uglify()) // 压缩
        .pipe(gulp.dest('built/app/scripts')); // 输出
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
gulp.task('release', ['style', 'lib', 'js', 'template', 'other']);



