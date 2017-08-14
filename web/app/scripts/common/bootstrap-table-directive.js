angular.module('app')
/**
 * 生成bootstraptable的指令
 *
 * 将该指令放在table的外层使用
 * @example
 *      <div bt-app-content></div>
 */
    .directive('btUser', function (commonService, dataService) {
        return {
            link: function (scope, ele, attrs) {
                // 初始化表格
                var table = $(ele);
                table.bootstrapTable({
                    striped: true,
                    height: 400,
                    classes: 'table table-hover table-layout-fixed',
                    columns: [
                        {
                            checkbox: true
                        },
                        {
                            title: '序号',
                            align: 'center',
                            sortable: true,
                            formatter: function (value, row, index) {
                                return index + 1;
                            }
                        },
                        {
                            field: 'userId',
                            title: '用户ID',
                            align: 'center'
                        },
                        {
                            field: 'userName',
                            title: '用户名',
                            align: 'center'
                        }
                    ]
                });
                var pageNumber = 1;
                var PAGE_SIZE = 40;
                var allData = [];

                var isTrigger = true;
                var lastScrollTop = 0;

                var loadData = function () {
                    isTrigger = false;
                    dataService.get(dataService.url.user, {
                        action: 'manyUsers',
                        pageNumber: pageNumber,
                        pageSize: PAGE_SIZE
                    }, function (data) {
                        Array.prototype.push.apply(allData, data.rows);
                        table.bootstrapTable('load', allData);
                        tableWrap.scrollTop(lastScrollTop);
                        isTrigger = true;
                    });
                };
                loadData();

                var tableWrap = table.parent();
                var MIN_HEIGHT = 50;
                var wrapHeight = tableWrap.height();
                tableWrap.off('scroll.user').on('scroll.user', function () {
                    var scrollTop = tableWrap.scrollTop();
                    var contentHeight = table.height();
                    var delta = contentHeight - wrapHeight - scrollTop;
                    if (delta - MIN_HEIGHT <= 0) {
                        // 加载下一页数据
                        if (isTrigger) {
                            lastScrollTop = scrollTop;
                            pageNumber++;
                            loadData();
                        }

                    }
                });

            }
        };
    })
    .directive('btAppContent', function ($compile, dataService) {
        "use strict";
        return {
            template: '<table class="main-table"></table>',
            link: function (scope, ele, attrs) {
                var $table = $(ele).find('.main-table');
                // 查询参数
                var queryObj = {
                    queryField: '',
                    queryValue: ''
                };
                // 分页排序参数
                var tableParams = {
                    sortName: 'updateTime',
                    sortOrder: 'desc',
                    pageSize: 10,
                    pageNumber: 1
                };
                // 加载表格数据
                var loadData = function () {
                    dataService.get(dataService.URL.content, $.extend(true, queryObj, tableParams), function (data) {
                        /* 模拟后台处理数据 start */
                        var result = {
                            total: data.total,
                            rows: data.rows.slice((tableParams.pageNumber - 1) * tableParams.pageSize, tableParams.pageNumber * tableParams.pageSize)
                        };
                        /* 模拟后台处理数据 end */
                        console.log('结果', result);
                        $table.bootstrapTable('load', result);
                        $compile($table)(scope);
                    });
                };
                // 初始化表格
                $table.bootstrapTable({
                    striped: true,
                    pagination: true,
                    pageNumber: tableParams.pageNumber,
                    pageSize: tableParams.pageSize,
                    pageList: [10, 20, 50, 100],
                    sidePagination: "server",
                    columns: [
                        {
                            checkbox: true
                        },
                        {
                            field: 'fileName',
                            title: '文件名',
                            formatter: function (value, row, index) {
                                var icon_cls = '';
                                // 判断是否是文件夹
                                if (row.isFolder) {
                                    icon_cls = 'pic_folder';
                                } else {
                                    // 根据fileName后缀来判断
                                    var suffix = value.slice(-value.lastIndexOf('.')).toLowerCase();
                                    switch (suffix) {
                                        case 'db':
                                            icon_cls = 'pic_db';
                                            break;
                                        case 'xls':
                                        case 'xlsx':
                                        case 'xlsm':
                                        case 'xlt':
                                        case 'xltx':
                                        case 'xltm':
                                            icon_cls = 'pic_excel';
                                            break;
                                        case 'pdf':
                                            icon_cls = 'pic_pdf';
                                            break;
                                        case 'bmp':
                                        case 'gif':
                                        case 'jpg':
                                        case 'png':
                                            icon_cls = 'pic_photo';
                                            break;
                                        case 'ppt':
                                        case 'pptx':
                                            icon_cls = 'pic_ppt';
                                            break;
                                        case 'rar':
                                        case 'zip':
                                        case 'war':
                                            icon_cls = 'pic_rar';
                                            break;
                                        case 'txt':
                                            icon_cls = 'pic_txt';
                                            break;
                                        case 'doc':
                                        case 'docx':
                                        case 'dot':
                                        case 'dotx':
                                        case 'dotm':
                                        case 'docm':
                                            icon_cls = 'pic_word';
                                            break;
                                        case 'wps':
                                            icon_cls = 'pic_wps';
                                            break;
                                    }
                                }
                                return '<span class="common-bg file-pic ' + icon_cls + '"></span>' +
                                       '<span bt-col-editable class="bt-col-editable" data-quick-edit-ok-fn="editFileName" data-qe-title="重命名" data-index="' + index + '" data-id="' + row.id + '" data-value="' + (value || '') + '"></span>';
                            }
                        },
                        {
                            field: 'category',
                            title: '分类'
                        },
                        {
                            field: 'size',
                            title: '大小'
                        },
                        {
                            field: 'updateTime',
                            title: '上传时间'
                        },
                        {
                            field: 'uploader',
                            title: '上传者'
                        },
                        {
                            field: 'download',
                            title: '下载次数'
                        },
                        {
                            field: 'browser',
                            title: '浏览次数'
                        },
                        {
                            title: '操作'
                        }
                    ],
                    onPageChange: function (number, size) {
                        tableParams.pageNumber = number;
                        tableParams.pageSize = size;
                        loadData();
                    },
                    onSort: function (name, order) {
                        tableParams.sortName = name;
                        tableParams.sortOrder = order;
                        loadData();
                    }
                });

                loadData();
                scope.editFileName = function(newValue, id, index){
                    // 维护一份最新的数据
                };
            }
        };
    })
;
