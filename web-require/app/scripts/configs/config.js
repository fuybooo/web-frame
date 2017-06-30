//noinspection JSFileReferences
require.config({
    baseUrl : './app/',
    waitSeconds: 0, //永不超时
    paths : {
        // 库文件
        'angular':'vendor/angular/angular',
        'angular-animate':'vendor/angular-animate/angular-animate',
        'angular-touch':'vendor/angular-touch/angular-touch',
        'angular-bootstrap':'vendor/angular-bootstrap/ui-bootstrap-tpls',
        'angular-ui-router':'vendor/angular-ui-router/release/angular-ui-router',
        'angular-sanitize':'vendor/angular-sanitize/angular-sanitize',
        'angular-ui-load':'vendor/angular-ui-load/angular-ui-load',
        'angular-async-loader':'vendor/angular-async-loader/angular-async-loader',
        'jquery':'vendor/jquery/jquery',
        'bootstrap-table':'vendor/bootstrap-table/src/bootstrap-table',
        'bootstrap-table-zh-CN':'vendor/bootstrap-table/src/locale/bootstrap-table-zh-CN',
        'bootstrap':'vendor/bootstrap/dist/js/bootstrap',
        'underscore':'vendor/underscore/underscore',
        'lodash':'vendor/lodash/lodash',
        'zTree':'vendor/zTree/js/jquery.ztree.all.min',
        'ECharts':'vendor/echarts/echarts-all',
        'bootstrap-datetimepicker':'vendor/bootstrap-datetimepicker/js/bootstrap-datetimepicker',
        'bootstrap-datetimepicker-zh-CN':'vendor/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN',
        'angular-translate': 'vendor/angular-translate/angular-translate.min',
        'angular-translate-loader-static-files': 'vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.min',

        'ueditor-config': 'vendor/ueditor/ueditor.config',
        'ueditor-all': 'vendor/ueditor/ueditor.all',
        'angular-ueditor': 'vendor/angular-ueditor/dist/angular-ueditor',

        'templates': 'scripts/template-cache/templates',

        // app文件
        'app': 'scripts/configs/app',
        'router': 'scripts/configs/router',
        'commonService': 'scripts/common/common-service',
        'dataService': 'scripts/common/data-service',
        'popupwinService': 'scripts/common/popupwin-service',
        'bootstrapTableDirective': 'scripts/common/bootstrap-table-directive',
        'commonDirective': 'scripts/common/common-directive',
        'moment': 'vendor/moment/moment'
    },
    shim : {
        'angular':{
            deps:['jquery'],
            exports : 'angular'
        },
        'angular-animate':{
            deps:['angular'],
            exports:'angular-animate'
        },
        'angular-touch':{
            deps:['angular'],
            exports:'angular-touch'
        },
        'angular-bootstrap':{
            deps:['angular'],
            exports:'angular-bootstrap'
        },
        'angular-ui-router':{
            deps:['angular'],
            exports:'angular-ui-router'
        },
        'angular-sanitize':{
            deps:['angular'],
            exports:'angular-sanitize'
        },
        'angular-ui-load':{
            deps:['angular'],
            exports:'angular-ui-load'
        },
        'angular-async-loader':{
            deps:['angular'],
            exports:'angular-async-loader'
        },
        'angular-translate':{
            deps:['angular']
        },
        'angular-translate-loader-static-files':{
            deps:['angular-translate', 'angular']
        },
        'angular-ueditor':{
            deps:['angular']
        },
        'bootstrap':{
            deps:['jquery']
        },
        'bootstrap-table':{
            deps:['bootstrap']
        },
        'zTree':{
            deps:['jquery']
        },
        'ECharts':{
            deps:['jquery']
        },
        'bootstrap-table-zh-CN':{
            deps:['bootstrap-table']
        },
        'templates': {
            deps:['angular']
        },
        'app':{
            deps:[
                'angular',
                'angular-async-loader',
                'angular-ui-router',
                'angular-ui-load',
                'angular-sanitize',
                'angular-animate',
                'angular-touch',
                'angular-bootstrap'
            ]
        },
        'router': {
            deps:['app']
        },
        'commonService': {
            deps:['app']
        },
        'dataService': {
            deps:['app']
        },
        'popupwinService': {
            deps:['app']
        },
        'bootstrapTableDirective': {
            deps:['app']
        },
        'commonDirective': {
            deps:['app']
        },
        'bootstrap-datetimepicker':{
            deps:['jquery', 'bootstrap']
        },
        'bootstrap-datetimepicker-zh-CN':{
            deps:['bootstrap-datetimepicker']
        }
    }
});

require(
    [
        'angular',
        'jquery',
        'underscore',

        'angular-async-loader',
        'angular-ui-load',
        'angular-ui-router',
        'angular-animate',
        'angular-sanitize',
        'angular-touch',
        'angular-bootstrap',
        'angular-translate',
        'angular-translate-loader-static-files',
        'ueditor-config',
        'ueditor-all',
        'angular-ueditor',
        'bootstrap',
        'zTree',
        'ECharts',
        'moment',
        // 'baidu-map',

        'bootstrap-table',
        'bootstrap-datetimepicker',

        'bootstrap-table-zh-CN',
        'bootstrap-datetimepicker-zh-CN',
        'templates',
        'app',
        'router',
        'commonService',
        'dataService',
        'popupwinService',
        'bootstrapTableDirective',
        'commonDirective',

        'require',
        'exports',
        'module'
    ],
    function (angular) {
        angular.element(document).ready(function () {
            angular.bootstrap(document,['app']);
        });
    }
);


