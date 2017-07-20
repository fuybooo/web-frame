angular.module('app').controller('DashboardController', function ($scope, commonService, dataService) {
    'use strict';
    // 从后台获取数据
    $scope.summary = {
        devices: 30,
        users: 28
    };
    // 初始化时间控件
    $('.js-dash-device-date').datetimepicker({
        format: 'YYYY-MM-DD',
        defaultDate: commonService.dateTimeFormatter()
    });

    var doc = document;
    // 获取违规设备数据

    var violationDeviceData = {
        x: ['越狱', '安装违规应用', '未备份', '密码错误5次'],
        y: [3, 6, 5, 10]
    };
    echarts.init(doc.getElementById('violation-device-chart')).setOption({
        xAxis: {
            type: 'category',
            data: violationDeviceData.x,
            axisLabel: {
                textStyle: {
                    color: '#333',
                    fontSize: 14,
                    fontFamily: '微软雅黑'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#777',
                    width: 1
                }
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            axisLine: {
                lineStyle: {
                    color: '#777',
                    width: 1
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dotted',
                    color: '#e6e6e6'
                }
            }
        },
        grid: {
            borderWidth: 0,
            containLabel: true
        },
        series: [
            {
                type: 'bar',
                barCategoryGap: '50%',
                itemStyle: {
                    normal: {
                        color: '#57b2e1',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#777'
                            }
                        }
                    },
                    emphasis: {
                        color: '#84c8e9'
                    }
                },
                data: violationDeviceData.y
            }
        ]
    });

    // 获取设备状态数据
    var deviceStateData = {
        notActivation: 11,
        activation: 22,
        login: 33,
        notLogin: 44,
        locking: 55
    };
    var radius = [80, 65];
    var labelStyle = {
        normal: {
            label: {
                formatter: function (params) {
                    return (100 - params.value).toFixed(2) + '%'
                },
                textStyle: {
                    baseline: 'top',
                    color: 'rgba(2, 176, 150, 1)',
                    fontSize: 16
                }
            }
        }
    };
    var labelBottom = {
        normal: {
            color: '#ccc',
            label: {
                show: true,
                position: 'center'
            },
            labelLine: {
                show: false
            }
        },
        emphasis: {
            color: 'rgba(0,0,0,0)'
        }
    };
    var labelTop = {
        normal: {
            label: {
                show: true,
                position: 'center',
                formatter: '{b}',
                textStyle: {
                    baseline: 'bottom',
                    fontSize: 16
                }
            },
            labelLine: {
                show: false
            },
            color: 'rgba(2, 176, 150, 1)'
        }
    };
    echarts.init(doc.getElementById('device-state-chart')).setOption({
        series: [
            {
                type: 'pie',
                center: ['10%', '50%'],
                radius: radius,
                x: '0%',
                itemStyle: labelStyle,
                data: [
                    {name: 'other', value: 100 - deviceStateData.notActivation, itemStyle: labelBottom},
                    {name: '未激活', value: deviceStateData.notActivation, itemStyle: labelTop}
                ]
            },
            {
                type: 'pie',
                center: ['30%', '50%'],
                radius: radius,
                x: '20%',
                itemStyle: labelStyle,
                data: [
                    {name: 'other', value: 100 - deviceStateData.activation, itemStyle: labelBottom},
                    {name: '已激活', value: deviceStateData.activation, itemStyle: labelTop}
                ]
            },
            {
                type: 'pie',
                center: ['50%', '50%'],
                radius: radius,
                x: '40%',
                itemStyle: labelStyle,
                data: [
                    {name: 'other', value: 100 - deviceStateData.login, itemStyle: labelBottom},
                    {name: '已登录', value: deviceStateData.login, itemStyle: labelTop}
                ]
            },
            {
                type: 'pie',
                center: ['70%', '50%'],
                radius: radius,
                x: '60%',
                itemStyle: labelStyle,
                data: [
                    {name: 'other', value: 100 - deviceStateData.notLogin, itemStyle: labelBottom},
                    {name: '未登录', value: deviceStateData.notLogin, itemStyle: labelTop}
                ]
            },
            {
                type: 'pie',
                center: ['90%', '50%'],
                radius: radius,
                x: '80%',
                itemStyle: labelStyle,
                data: [
                    {name: 'other', value: 100 - deviceStateData.locking, itemStyle: labelBottom},
                    {name: '已锁定', value: deviceStateData.locking, itemStyle: labelTop}
                ]
            }
        ]
    });

    // 获取设备型号数据

    var deviceModelData = {
        names: ['Android1', 'Android2', 'Android3', 'Android4'],
        values: [
            {
                name: 'Android1',
                value: 23
            },
            {
                name: 'Android2',
                value: 33
            },
            {
                name: 'Android3',
                value: 13
            },
            {
                name: 'Android4',
                value: 31
            }
        ]
    };
    echarts.init(doc.getElementById('device-model-chart')).setOption({
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            x: 'right',
            data: deviceModelData.names
        },
        series: [
            {
                name: '设备型号',
                type: 'pie',
                radius: ['85%', '40%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'inside',
                            formatter: '{d}%',
                            textStyle: {
                                baseline: 'center',
                                fontSize: 12,
                                color: '#FFF'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        color: function (params) {
                            return ['#32897d', '#1bb7a0', '#39b5b9', '#52a3bb', '#619cc4','#6d90c5', '#e7dddb'][params.dataIndex]
                        }
                    }
                },
                center: ['45%', '45%'],
                data: deviceModelData.values
            }
        ]
    });

    // 获取操作系统数据

    var deviceSystemData = {
        names: ['Android', 'IOS'],
        values: [
            {
                name: 'Android',
                value: '70'
            },
            {
                name: 'IOS',
                value: '30'
            }

        ]
    };
    echarts.init(doc.getElementById('device-system-chart')).setOption({
        tooltip : {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            data: deviceSystemData.names
        },
        series : [
            {
                name: '操作系统',
                type: 'pie',
                radius : '85%',
                center: ['45%', '45%'],
                data:deviceSystemData.values,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    });

    // 获取安卓系统版本

    var deviceAndroidData = {
        x: ['Android5.1.1', 'Android5.3.1', 'Android6.2.3', 'Android6.3.1', 'Android6.4.1'],
        y: [3, 14, 6, 7, 3]
    };
    echarts.init(doc.getElementById('device-android-version-chart')).setOption({
        xAxis: {
            type: 'category',
            data: deviceAndroidData.x,
            axisLabel: {
                interval: 0, // 显示全部x轴数据
                rotate: 20, // 倾斜角度
                textStyle: {
                    color: '#333',
                    fontSize: 14,
                    fontFamily: '微软雅黑'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#777',
                    width: 1
                }
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            axisLine: {
                lineStyle: {
                    color: '#777',
                    width: 1
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dotted',
                    color: '#e6e6e6'
                }
            }
        },
        grid: {
            borderWidth: 0,
            containLabel: true
        },
        series: [
            {
                type: 'bar',
                barCategoryGap: '50%',
                itemStyle: {
                    normal: {
                        color: '#57b2e1',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#777'
                            }
                        }
                    },
                    emphasis: {
                        color: '#84c8e9'
                    }
                },
                data: deviceAndroidData.y
            }
        ]
    });

    // 获取IOS系统版本

    var deviceIosData = {
        x: ['IOS9.1.1', 'IOS9.2.1', 'IOS10.2.3', 'IOS11.3.1', 'IOS12.4.1'],
        y: [3, 14, 6, 7, 3]
    };
    echarts.init(doc.getElementById('device-ios-version-chart')).setOption({
        xAxis: {
            type: 'category',
            data: deviceIosData.x,
            axisLabel: {
                interval: 0, // 显示全部x轴数据
                textStyle: {
                    color: '#333',
                    fontSize: 14,
                    fontFamily: '微软雅黑'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#777',
                    width: 1
                }
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            axisLine: {
                lineStyle: {
                    color: '#777',
                    width: 1
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dotted',
                    color: '#e6e6e6'
                }
            }
        },
        grid: {
            borderWidth: 0,
            containLabel: true
        },
        series: [
            {
                type: 'bar',
                barCategoryGap: '50%',
                itemStyle: {
                    normal: {
                        color: '#57b2e1',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#777'
                            }
                        }
                    },
                    emphasis: {
                        color: '#84c8e9'
                    }
                },
                data: deviceIosData.y
            }
        ]
    });

    // 配置图表的显示
    $scope.dashConfig = {
        deviceCount: true,
        userCount: true,
        deviceViolation: true,
        deviceState: true,
        deviceModel: true,
        deviceSystem: true,
        deviceAndroidVersion: true,
        deviceIosVersion: true
    };
});