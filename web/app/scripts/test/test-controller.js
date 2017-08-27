angular.module('app').controller('TestController', function($scope, commonService, dataService, $timeout, $window){
    "use strict";
    console.log('测试controller：TestController');
    new Kalendae(document.getElementById("test-kalendae-multi-1"), {
        months:1,
        mode:'multiple',
        viewStartDate: '2017-10-01',
        format: 'YYYY-MM-DD',
        subscribe: {
            'date-clicked': function (date) {
                console.log(date._i, this.getSelected());
            }
        }
    });
    // 隐藏不需要显示的部分
    $('.k-title').addClass('dni');
    $('.k-header').addClass('dni');
    $('.k-out-of-month').addClass('dni');


    // 获取选择的数据
    $scope.getSelected = function(){
        console.log($scope.sdcModel1);
        console.log($scope.sdcModel2);
        console.log($scope.sdcValue);
    };


    // 多选框赋值测试
    // $scope.checkbox1 = true;
    // $scope.checkbox1 = false;


    $timeout(function(){
        $scope.checkbox1 = true;
    }, 1000);

    /**
     * 计算三针重合
     * 思路：
     *      1.计算12小时制的所有情况，即12 × 60 × 60种情况
     *      2.计算每种情况下各针的角度，如果三者相等，则保存
     *
     *      1.秒针一秒转360/60度
     *      2.分针一秒转360/60/60度
     *      3.时针一秒转360/60/60/60度
     *
     *      精确计算只有2次会重合，即12:00:00 00:00:00
     */
    var one = [];
    for(var timer = 0;timer < 12 * 60 * 60; timer ++){
        var hour = Math.floor(timer / (60 * 60));
        var minute = Math.floor(timer % (60 * 60) / 60);
        var second = Math.floor(timer % (60 * 60) % 60);

        var hourAngular = Math.round (((timer * (360/12/60/60)) % 360 ) * 1000000) / 1000000;
        var minuteAngular = Math.round (((timer * (360/60/60)) % 360 ) * 1000000) / 1000000;
        var secondAngular = Math.round (((timer * (360/60)) % 360 ) * 1000000) / 1000000;

        if(hourAngular === minuteAngular){
            one.push({
                hour: hour,
                minute: minute,
                second: second
            });
        }
    }
    console.log('三针一线的情况：', one);


    // // 测试高德地图
    // var script = document.createElement('script');
    // script.src = 'https://webapi.amap.com/maps?v=1.3&amp;key=0d9e58dc8d6846f9b539006dac2c73ee&callback=initMap';
    // document.body.appendChild(script);
    // $window.initMap = function(){
    //     var map = new AMap.Map('container', {
    //         center: [117.000923, 36.675807],
    //         zoom: 6
    //     });
    //     map.plugin(["AMap.ToolBar"], function() {
    //         map.addControl(new AMap.ToolBar());
    //     });
    // };

    // 测试百度地图
    // var script = document.createElement('script');
    // script.src = 'http://api.map.baidu.com/api?v=2.0&ak=MVuRuOOlkNQMUTwEsN4GO8EuzxujlwF6&callback=baiduMapLoaded()';
    // document.body.appendChild(script);
    // $window.baiduMapLoaded = function(){
    //     var map = new BMap.Map('container');
    //     //鼠标滚轮
    //     map.enableScrollWheelZoom();
    //     //启动地图的惯性拖拽
    //     map.enableInertialDragging();
    //     //启用连续缩放效果
    //     map.enableContinuousZoom();
    //
    //     //比例尺控件
    //     map.addControl(new BMap.ScaleControl());
    //     //缩略图控件
    //     map.addControl(new BMap.OverviewMapControl());
    //     //地图类型控件
    //     map.addControl(new BMap.MapTypeControl());
    //     //定位控件
    //     map.addControl(new BMap.GeolocationControl());
    //
    //     //中心点
    //     var point = new BMap.Point(114.4252160000,35.0468480000);
    //
    //     //构建地图
    //     map.centerAndZoom(point, 13);
    //
    //     var getBoundary = function(){
    //         var boundary = new BMap.Boundary();
    //         console.log(boundary);
    //         boundary.get('封丘县', function(rs){
    //             console.log('rs', rs);
    //             map.clearOverlays();
    //             var count = rs.boundaries.length;
    //             if (count === 0) {
    //                 alert('未能获取当前输入行政区域');
    //                 return ;
    //             }
    //             var pointArray = [];
    //             for (var i = 0; i < count; i++) {
    //                 var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#ff0000"}); //建立多边形覆盖物
    //                 map.addOverlay(ply);  //添加覆盖物
    //                 pointArray = pointArray.concat(ply.getPath());
    //             }
    //             map.setViewport(pointArray);    //调整视野
    //             // addlabel();
    //         });
    //     };
    //     getBoundary();
    //
    // };

    $scope.showTimeRange = function(){
        console.log('使用默认model');
        console.log($scope.startHour);
        console.log($scope.startMinute);
        console.log($scope.endHour);
        console.log($scope.endMinute);
        console.log('使用自定义model');
        console.log($scope.startHour1);
        console.log($scope.startMinute1);
        console.log($scope.endHour1);
        console.log($scope.endMinute1);
    }
});