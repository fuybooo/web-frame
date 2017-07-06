angular.module('app')
/**
 * 显示user信息的bootstrap-table
 *
 * 懒加载数据,分页显示示例
 * @example <table bt-user></table>
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
                        console.log('data');
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
                        console.log('isTrigger:', isTrigger);
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
    .directive('btTestUser', function (commonService, dataService) {
        return {
            link: function (scope, ele, attrs) {
                var pageParam = {
                    pageNumber: 1,
                    pageSize: 20
                };
                // 初始化表格
                var table = $(ele);
                table.bootstrapTable({
                    // 分页参数 start
                    pagination: true,
                    sidePagination: 'server',
                    pageNumber: 1,
                    pageSize: 20,
                    pageList: [10, 20, 50, 100],
                    // 分页参数 end
                    striped: true,
                    classes: 'table table-hover',
                    height: 400,
                    columns: [
                        {
                            checkbox: true
                        },
                        {
                            title: '序号',
                            align: 'center',
                            sortable: true,
                            width: '10%',
                            formatter: function (value, row, index) {
                                return (pageParam.pageNumber - 1) * pageParam.pageSize + index + 1;
                            }
                        },
                        {
                            field: 'userId',
                            title: '用户ID',
                            width: '20%',
                            align: 'center'
                        },
                        {
                            field: 'userName',
                            title: '用户名',
                            align: 'center'
                        }
                    ],
                    onPageChange: function(number, size){
                        pageParam.pageNumber = number;
                        pageParam.pageSize = size;
                        loadData();
                    },
                    onSort: function(name, order){
                    
                    }
                });
                var loadData = function () {
                    dataService.get(dataService.URL.user, {
                        action: 'manyUsers',
                        pageNumber: pageParam.pageNumber,
                        pageSize: pageParam.pageSize
                    }, function (data) {
                        // 模拟处理后台数据
                        
                        var pageData = {
                            total: data.length,
                            rows: data.slice((pageParam.pageNumber - 1) * pageParam.pageSize, pageParam.pageNumber * pageParam.pageSize)
                        };
                        
                        table.bootstrapTable('load', pageData);
                    });
                };
                loadData();
            }
        };
    })
;
