angular.module('app').directive('appNav', function (commonService, dataService, $state) {
    'use strict';
    return {
        templateUrl: 'src/app/main/nav.html',
        controller: function($scope){
            // 获取导航栏数据
            dataService.get(dataService.URL.nav, function(data){
                $scope.navList = data;
            });
            // 获取用户名称
            $scope.userName = 'fuybooo@fuybooo.com';
        },
        link: function(scope, ele, attrs){
            scope.$on(commonService.EVENT.ngRepeatFinished, function(e, d){
                // 导航栏加载完成之后才能进行样式设置和事件绑定
                if(d === commonService.EVENT_KEY.nav){
                    // 基本样式设置
                    var POINT_COUNT = 13; // 保留小数点后13位小数
                    var $navUl = $(ele).find('.app-nav-content');
                    var $navLi = $navUl.find('li');
                    var navCount = scope.navList.length;
                    var itemWidth = 100 / navCount;
                    var itemWidthStr = itemWidth + '';
                    var pointIndex = itemWidthStr.indexOf('.');
                    if(pointIndex !== -1){
                        // 取小数点后13位小数, 不进行四舍五入
                        itemWidth = Math.floor(itemWidth * Math.pow(10, POINT_COUNT)) / Math.pow(10, POINT_COUNT);
                    }
                    $navLi.filter('.app-nav-item').width(itemWidth + '%');

                    // 激活当前导航栏
                    $navLi.each(function () {
                        var sref = $(this).attr('data-sref');
                        if (sref === $state.current.name) {
                            var target;
                            if ($(this).hasClass('app-nav-item')) {
                                target = $(this);
                            } else {
                                $navLi.filter('.app-nav-child-item').removeClass('active');
                                $(this).addClass('active');
                                target = $(this).parent().parent();
                            }
                            target.addClass('active');
                        }
                    });

                    // 事件绑定
                    $navLi.off('click.nav').on('click.nav', function(e){
                        e.stopPropagation();
                        var sref = $(this).attr('data-sref');
                        var target;
                        if($(this).hasClass('app-nav-item')){
                            target = $(this);
                        }else{
                            $navLi.filter('.app-nav-child-item').removeClass('active');
                            $(this).addClass('active');
                            target = $(this).parent().parent();
                        }
                        if($state.current.name === sref){
                            target.removeClass('hover');
                            return false;
                        }
                        // 进行页面跳转
                        $state.go(sref);
                        // 状态设置
                        $navLi.removeClass('active');

                        target.addClass('active').removeClass('hover');
                    });


                }

            });
        }
    };
});