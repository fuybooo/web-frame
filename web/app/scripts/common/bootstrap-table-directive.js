angular.module('app')
/**
 * 显示user信息的bootstrap-table
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

;
