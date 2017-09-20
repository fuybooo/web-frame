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
        // 按顺序加载所有用到的css，如果有新增的css文件，必须在这里添加
        'src/assets/style/bootstrap.css',
        'src/assets/style/bootstrap-table.css',
        'src/assets/style/bootstrap-datetimepicker.css',
        'src/assets/style/kalendae.css',
        'src/assets/style/base.css',
        'src/assets/style/popupwin.css',
        'src/assets/style/style.css'
    ]).pipe($.concat('styles.css')) // 合并所有上面列举的css，合并之后的文件名为styles.css
        .pipe($.autoprefixer()) // 自动添加浏览器厂商前缀，兼容各种浏览器
        .pipe($.csscomb()) // 重排css定义的属性
        .pipe($.cleanCss()) // 压缩css
        .pipe(gulp.dest('built/app/style/')); // 输出路径
});

/**
 * 合并压缩js库文件
 */
gulp.task('lib', function () {
    "use strict";
    return gulp.src([
        // 按顺序加载所有js库文件，如果有新增的js库文件，必须放到这里
        'src/assets/vendor/jquery/jquery.js',
        'src/assets/vendor/underscore/underscore.js',
        'src/assets/vendor/moment/moment.js',
        'src/assets/vendor/kalendae/kalendae.js',
        'src/assets/vendor/angular/angular.js',
        'src/assets/vendor/bootstrap/js/bootstrap.js',
        'src/assets/vendor/echarts/echarts.js',
        'src/assets/vendor/bootstrap-table/bootstrap-table.js',
        'src/assets/vendor/bootstrap-datetimepicker/bootstrap-datetimepicker.js',
        'src/assets/vendor/angular-ui-load/angular-ui-load.js',
        'src/assets/vendor/angular-ui-router/angular-ui-router.js',
        'src/assets/vendor/angular-animate/angular-animate.js',
        'src/assets/vendor/angular-sanitize/angular-sanitize.js',
        'src/assets/vendor/angular-touch/angular-touch.js',
        'src/assets/vendor/angular-translate/angular-translate.min.js',
        'src/assets/vendor/angular-ueditor/angular-ueditor.js',
        'src/assets/vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
        // 发布国际化版本时需要注意此处
        'src/assets/vendor/bootstrap-table/bootstrap-table-locale-all.js'
    ])
        .pipe($.concat('lib.js', {newLine: ';'})) // 合并所有列举的js，以分号分割
        .pipe($.uglify()) // 压缩
        .pipe(gulp.dest('built/app')); // 输出
});
/**
 * 合并压缩js
 */
gulp.task('js', function () {
    "use strict";
    return gulp.src([
        // 按顺序加载项目中的js文件，在“其他文件”之上的文件一般不会有改动（文件名称的增减），除非新增公共的文件，否则此处不需要进行添加
        // 环境
        'src/environments/env.setting.prod.js',
        // 启动文件
        'src/app/main/app.js',
        // 国际化 --- 需要改变时可以进行修改即可
        'src/assets/language/cn.js',
        // 路由
        'src/app/main/router.js',
        // 公共文件
        'src/app/shared/common-service.js',
        'src/app/shared/data-service.js',
        'src/app/shared/common-directive.js',
        'src/app/shared/common-filter.js',
        'src/app/shared/bootstrap-table-directive.js',
        'src/app/shared/popupwin-service.js',
        'src/app/main/nav-directive.js',
        // 此处已经包含了在scripts中的所有js，所以新增的js文件无需添加在此处，除非新增的js文件放在了common或者configs中
        // 其他文件
        'src/app/**/*.js',
        '!src/app/main',
        '!src/app/shared'
    ]).pipe($.ngAnnotate())
        .pipe($.concat('app.js', {newLine: ';'})) // 合并
        .pipe($.uglify()) // 压缩
        .pipe(gulp.dest('built/app')); // 输出
});

/**
 * 生成template
 */
gulp.task('template', function () {
    return gulp.src('src/app/**/*.html')
        // 将所有的html模板放入到angular的template缓存中去，生成的文件是一个angular的模块，在app.js中会进行引入
        .pipe($.angularTemplatecache({
            root: 'src/app/'
        }))
        .pipe(gulp.dest('built/app'));
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
    gulp.src(['src/assets/fonts/**/*.*']).pipe(gulp.dest('built/app/fonts'));
    gulp.src(['src/assets/json/**/*.json']).pipe(gulp.dest('built/app/json'));
    // 对图片进行压缩
    gulp.src(['src/assets/images/**/*.*'])
        .pipe($.cache($.imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
        .pipe(gulp.dest('built/app/images'));
});

/**
 * jshint，检查js中的语法错误
 */
gulp.task('jshint', function () {
    "use strict";
    gulp.src('src/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'));
});

/**
 * 监听文件改动执行检查
 */
gulp.task('watch', function () {
    "use strict";
    gulp.watch('src/**/*.js', ['jshint']);
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
    gulp.watch(['src/**/*.*', './index.html']).on('change', browserSync.reload);
});
/**
 * 执行默认任务（开发）
 */
gulp.task('default', ['serve', 'watch']);
/**
 * 执行打包任务（发布）
 *
 * 打包步骤：
 *  0.cd 到web目录下
 *  1.gulp clean
 *  2.gulp release
 */
gulp.task('clean', function () {
    "use strict";
    gulp.src(['built/app'], {read: false}).pipe($.clean({force: true}));
});

// gulp.task('p', ['style', 'lib', 'js', 'template', 'other']);
// gulp.task('r', ['release']);

gulp.task('release:concat', ['style', 'lib', 'js', 'template', 'other'], function() {
    "use strict";
    return gulp.src([
        'built/app/lib.js',
        'built/app/app.js',
        'built/app/templates.js'
    ]).pipe($.concat('scripts.js', {newLine: ';'})) // 合并
        .pipe($.uglify()) // 压缩
        .pipe(gulp.dest('built/app')); // 输出
});

gulp.task('clean:temp', ['release:concat'], function () {
    "use strict";
    gulp.src([
        'built/app/lib.js',
        'built/app/app.js',
        'built/app/templates.js'
    ], {read: false}).pipe($.clean({force: true}));
});
gulp.task('r', ['clean:temp']);




