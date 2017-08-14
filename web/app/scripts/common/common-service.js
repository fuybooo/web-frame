angular.module('app').factory('commonService', function ($timeout, $compile, $translate) {
    var service = {};
    /**
     * 全局计数器
     */
    service.counts = {
        customSelect: 0
    };
    /**
     * 所有的正则
     */
    service.REGEXP = {
        username: /^[\u4E00-\u9FA5A-Za-z0-9\-_@\.\|\/]+$/, // 只能包含数字/英文/汉字/下划线/减号/@符号/点/竖杠/斜杠
        pictureFile: /\.(?:jpg|png|gif)$/i // 图片的文件名称支持的格式
    };

    /**
     * 所有的sessionStorage
     */
    service.SESSION = {
        userInfo: 'userInfo',
        localLanguage: 'localLanguage',
        isValidateCodeShow: 'isValidateCodeShow'
    };
    /**
     * 所有的事件
     */
    service.EVENT = {
        login: 'login',
        ngRepeatFinished: 'ngRepeatFinished'
    };
    /**
     * 所有的事件的值
     */
    service.EVENT_KEY = {
        success: 'success',
        logout: 'logout',
        nav: 'nav'
    };
    /**
     * 所有状态
     */
    service.STATUS = {
        NOT_LOGGED_IN: -1,
        SUCCESS: 0,
        ERROR: 1
    };

    /**
     * language 多语言转换 translateLanguage
     * @type {null}
     */
    service.tl = function(key){
        return $translate.instant(key);
    };

    var timeout = null;
    /**
     * 弹出提示
     * @param text 提示文本，默认为操作成功，即不传任何参数时，弹出操作成功的提示
     * @param state 提示文本的样式，目前只支持 s：success， i：info， w：warning， d：danger，默认为s
     */
    service.alert = function (text, state) {
        if (arguments.length === 0) {
            text = '操作成功！';
            state = 0;
        }

        var cls = 'success';
        if (state === 's' || state === undefined || state === 0) {
            cls = 'success';
        } else if (state === 'i' || state === 2) {
            cls = 'info';
        } else if (state === 'w' || state === 3) {
            cls = 'warning';
        } else if (state === 'd' || state === 1) {
            cls = 'danger';
        } else {
            cls = 'danger';
        }
        var alertDiv = $('.alert-global-tip');
        var allCls = 'alert-success alert-info alert-warning alert-danger';
        if (alertDiv.length !== 0) {
            alertDiv.fadeIn(400).text(text).removeClass(allCls).addClass('alert-' + cls);
        } else {
            alertDiv = $('<div class="alert alert-' + cls + ' alert-global-tip" role="alert">' + text + '</div>').appendTo('body').fadeIn(400);
        }
        alertDiv.css('top', 100 + $('body').scrollTop());
        if (timeout) {
            $timeout.cancel();
        }
        timeout = $timeout(function () {
            alertDiv.fadeOut(400, function () {
                alertDiv.remove();
            });
        }, 1200);

    };

    /**
     * 字符串转换
     * @param str 需要被转换的字符串
     * @param type 转换的方式 默认为驼峰与中划线的互转，如 console.log(transformString('ss-bb')); // ssBb；console.log(transformString('ssBb')); // ss-bb
     */
    service.transformString = function (str, type) {
        var string = '';
        if (typeof type === 'undefined') {
            var reg_upper_letter = /[A-Z]/;
            var reg_upper_letter_g = /[A-Z]/g;
            var reg_separator = /-/;
            var reg_separator_letter = /-[a-zA-Z]/;
            var reg_separator_letter_g = /-[a-zA-Z]/g;
            var upperIndex = str.search(reg_upper_letter); // 大写字母第一次出现的位置
            var separatorIndex = str.search(reg_separator); // 分隔符第一次出现的位置
            var transType = 1; // 转换方法为大写转分隔符
            if (upperIndex !== -1) {
                if (separatorIndex !== -1) {
                    // 传入的字符串既包含大写字母，又包含分隔符，（不规范字符串）
                    if (upperIndex > separatorIndex) {// 分隔符先出现
                        transType = 2;// 转换方法为分割符转大写
                    }
                }
            } else {
                if (separatorIndex !== -1) {
                    transType = 2;// 转换方法为分割符转大写
                } else {
                    return str;
                }
            }
            var strSplitArr, strMatchArr;
            var i, l;
            if (transType === 1) {
                // 大写转分隔符
                strSplitArr = str.split(reg_upper_letter);// 以大写字母分割带转换字符串
                strMatchArr = str.match(reg_upper_letter_g);// 匹配大写字母出现的具体情况
                for (i = 0, l = strSplitArr.length; i < l; i++) {
                    string += strSplitArr[i];
                    if (i !== l - 1) {
                        string += '-' + strMatchArr[i].toLowerCase();
                    }
                }
                return string;
            } else {
                // 分隔符转大写
                strSplitArr = str.split(reg_separator_letter);
                strMatchArr = str.match(reg_separator_letter_g);
                for (i = 0, l = strSplitArr.length; i < l; i++) {
                    string += strSplitArr[i];
                    if (i !== l - 1) {
                        string += strMatchArr[i].slice(1).toUpperCase();
                    }
                }
                return string;
            }
        } else {
            // 其他转换方式
        }

        return string || str;
    };

    /**
     * 生成验证码
     */
    service.getValidateCode = function () {
        var VALIDATE_LENGTH = 6;
        var arr_num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        var arr_lower = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        var arr_upper = arr_lower.map(function (i) {
            return i.toUpperCase();
        });
        var arr = arr_num.concat(arr_lower).concat(arr_upper);
        var colors = ['muted', 'primary', 'success', 'info', 'warning', 'danger'];
        var code_span = '';
        var code = '';
        for (var i = 0; i < VALIDATE_LENGTH; i++) {
            var code_i = arr[Math.floor(Math.random() * arr.length)];
            code += code_i;
            code_span += '<span class="w__1_6 text-center text-' + colors[Math.floor(Math.random() * colors.length)] + '">' +
                code_i + '</span>';
        }
        service.validateCode = code;
        return '<span class="validate-code" title="换一张">' + code_span + '</span>';
    };

    /**
     * 打开快速编辑界面
     */
    service.showQuickEdit = function (options) {
        var removeEditPanel = function () {
            $('.js-edit-panel').remove();
        };
        var $editPanel = $('<div class="js-edit-panel edit-panel">' +
            '<div class="edit-panel-title bg-info">' +
            (options.title || '修改') +
            '<span class="js-edit-panel-close edit-panel-close">&#215;</span>' +
            '</div>' +
            '<div class="edit-panel-body">' +
            '<form name="' + options.field + '_form">' +
            // 根据不同的type生成不同的输入框类型
            '<input type="text" class="form-control" ng-model="' + options.field + '" name="' + options.field + '" ng-init="' + options.field + '=\'' + options.value + '\'">' +
            '</form>' +
            '</div>' +
            '<div class="edit-panel-footer">' +
            '<button class="btn btn-primary btn-sm js-sure-edit" ng-disabled="' + options.field + '_form.$pristine || ' + options.field + '_form.$invalid' + '">确定</button>' +
            '</div>' +
            '</div>');
        var target = options.target;
        target.append($compile($editPanel)(options.scope));

        // 计算弹出框应该显示的位置
        // 计算父元素距离顶部和底部的位置

        // 事件绑定
        // 点击关闭按钮关闭编辑框
        $('.js-edit-panel-close').off('click.close').on('click.close', function (e) {
            e.stopPropagation();
            removeEditPanel();
            target.parent().removeClass('show');
        });
        // 点击其他地方关闭编辑框
        $(document).off('click.close.editPanel').on('click.close.editPanel', function (e) {
            if ($('.js-edit-panel').length > 0 && !$.contains($('.js-edit-panel')[0], e.target)) {
                removeEditPanel();
                // 如果鼠标单击的是显示图标的td,或者是td内的元素,则不执行消失
                if (!(target.parent()[0] === e.target || (target.parent()[0] !== e.target && $.contains(target.parent()[0], e.target)))) {
                    target.parent().removeClass('show');
                }
            }
        });
        // 点击确定执行事件
        $('.js-sure-edit').off('click.sure.edit').on('click.sure.edit', options.ok);
    };
    /**
     * 查找指定父节点
     * @param ele 元素 dom对象
     * @param nodeName 指定元素名称
     * @desc 比如在如下结构中：<form><div><div><input>,查找input元素的父级form元素var form = findParentNode(inputElement, 'form');
     */
    service.findParentNode = function (ele, nodeName) {
        var parent = ele.parentNode;
        if (!parent) return null;
        if (parent.nodeName.toLowerCase() === nodeName.toLowerCase()) {
            return parent;
        } else {
            return service.findParentNode(parent, nodeName);
        }
    };

    service.isArray = function (object) {
        if (Object.prototype.toString.apply(object).indexOf('Array') !== -1) {
            return true;
        }
    };

    service.isObject = function (object) {
        if (Object.prototype.toString.apply(object).indexOf('Object') !== -1) {
            return true;
        }
    };
    /**
     * 支持数组和对象的深拷贝
     * @param src
     * @returns {*}
     */
    service.deepClone = function (src) {
        // 只支持 数组 和 对象 的深拷贝
        if (!(service.isArray(src) || service.isObject(src))) {
            return src;
        }
        var dest = arguments[1];
        dest = dest ? dest : (service.isArray(src) ? [] : {});
        for (var p in src) {
            if (!Object.hasOwnProperty(p)) {
                if (typeof src[p] === 'object') {
                    dest[p] = service.isArray(src) ? [] : {};
                    service.deepClone(src[p], dest[p]);
                } else {
                    dest[p] = src[p];
                }
            }
        }
        return dest;
    };

    /**
     * 数据的增删改
     */
    service.ADU = {
        /**
         * 新增记录
         * @param originArr 原始数据
         * @param newRecords 新记录，肯能是数组(只支持一维数组)，可能是一个对象
         */
        add: function (originArr, newRecords) {
            Array.prototype.splice.apply(originArr, [0, 0].concat(newRecords));
        },
        /**
         * 删除记录
         * @param originArr 原始数据
         * @param ids 可以是一个字符串， 表示单个id，可以是数组，表示多个id，删除多条数据
         */
        del: function (originArr, ids) {
            ids = [].concat(ids);
            for (var i = 0, l = originArr.length; i < l; i++) {
                var item = originArr[i];
                if (item) {
                    for (var j = 0, lj = ids.length; j < lj; j++) {
                        if (item.id === ids[j]) {
                            originArr.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        },
        /**
         * 修改记录
         * @param originArr 原始数据
         * @param newRecords 可以是一个对象-- 修改单条记录；可以是一个数组，修改多条记录
         */
        update: function (originArr, newRecords) {
            newRecords = [].concat(newRecords);
            for (var i = 0, l = originArr.length; i < l; i++) {
                var item = originArr[i];
                // 执行splice操作之后，l将会大于length
                if (item) {
                    for (var j = 0, lj = newRecords.length; j < lj; j++) {
                        var mItem = newRecords[j];
                        if (item.id === mItem.id) {
                            originArr.splice(i, 1);
                            break;
                        }
                    }
                }
            }
            Array.prototype.splice.apply(originArr, [0, 0].concat(newRecords));
        }
    };

    /**
     * 数组按属性值排序
     * @param arr 要排序的数组
     * @param pro 要排序的属性
     * @param isDesc 要排序的顺序 默认是false 即默认是asc
     * @param isNum 是否按照数字的排序规则排序 默认值为 false 即默认按字符串来排序
     */
    service.sort = function (arr, pro) {
        var isDesc = arguments[2];
        var isNum = arguments[3]; // 默认值为false
        arr.sort(function (a, b) {
            var _a = a[pro];
            var _b = b[pro];
            if (!isNum) {
                if (isDesc) {
                    return _a + '' < _b + '';
                } else {
                    return _a + '' > _b + '';
                }
            } else {
                if (isDesc) {
                    return _a - 0 < _b - 0;
                } else {
                    return _a - 0 > _b - 0;
                }
            }
        });
    };
    /**
     * 格式化时间
     * 1.不传参数，则以yyyy-MM-dd的形式格式化当前日期
     * 2.传一个参数
     *      1.如果参数为日期，则以yyyy-MM-dd的形式格式化之
     *      2.如果参数为字符串，则以该参数的形式格式化当前日期
     * 3.传两个参数，不论参数的次序
     *      将传进来的日期以传进来的格式格式化
     */
    service.dateTimeFormatter = function () {
        var date = new Date(), formatter = 'yyyy-MM-dd';
        var len = arguments.length;
        if (len === 1) {
            if (typeof arguments[0] === 'object') {
                date = arguments[0];
            }
            if (typeof arguments[0] === 'string') {
                formatter = arguments[0];
            }
        }
        if (len === 2) {
            if (typeof arguments[0] === 'object' && typeof arguments[1] === 'string') {
                date = arguments[0];
                formatter = arguments[1];
            } else if (typeof arguments[1] === 'object' && typeof arguments[0] === 'string') {
                date = arguments[1];
                formatter = arguments[0];
            }
        }

        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        var formatDate;
        switch (formatter) {
            case 'yyyy-MM-dd':
                formatDate = year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
                break;
        }
        return formatDate;
    };

    /**
     * 定义一个只会被执行一次的函数
     * @param fn
     * @param isClear 是否重新执行 默认为undefined，不重新执行
     */
    service.once = (function () {
        var memory = {};
        var _key = 0;
        return function (fn) {
            var isClear = arguments[1];
            if (isClear !== true) {
                for (var key in memory) {
                    if (!Object.hasOwnProperty(key)) {
                        // 判断函数是否在memory中
                        if (memory[key].fn === fn || memory[key].fn.toString() === fn.toString()) {
                            return memory[key].result;
                        }
                    }
                }
            }
            var result = fn();
            memory[_key] = {
                fn: fn,
                result: result
            };
            return result;
        };
    })();

    /**
     * 获取strs中每一个字符在str中顺次出现的索引值
     * @param str
     * @param strs
     * @example
     * behindString('abcdefgabcdefg', 'abcga')
     * 得到的结果为 [0,1,2,6,7]
     */
    service.getIndexes = function (str, strs) {
        str = str.toLowerCase();
        strs = strs.toLowerCase();
        /**
         * 返回字符串str中第一次出现ch之后的内容
         * @param str
         * @param ch
         */
        var getAfterString = function (str, ch) {
            var index = str.indexOf(ch);
            return {
                index: index,
                strBehind: str.slice(index + 1)
            };
        };
        var _str = str;
        var _strObjs = [];
        var i, l;
        for (i = 0, l = strs.length; i < l; i++) {

            var result = getAfterString(_str, strs[i]);
            _str = result.strBehind;
            _strObjs.push(result);
        }
        var indexes = [];
        for (i = 0, l = _strObjs.length; i < l; i++) {
            var index = 0;
            for (var j = 0; j <= i; j++) {
                index += _strObjs[j].index;

            }
            index += i;
            indexes.push(index);
        }
        return indexes;
    };

    /**
     * 将文字拆分为字符
     * @param str
     * @param n 关键字
     *
     * @example
     *
     * 对str进行拆分 凸显以n为关键字查询出来的结果
     * str = addPolicyCtrl
     * n = apc
     *
     * 则返回的结果应为： a（粗体）ddP(粗体)olic(粗体)yCtrl
     *
     */
    service.splitString = function (str, n) {
        str = str + '';
        var spans = '';
        var indexes = [];
        if (n) {
            indexes = service.getIndexes(str, n);
        }
        for (var i = 0, l = str.length; i < l; i++) {
            var cls = '';
            if (indexes.length !== 0) {
                if (i === indexes[0]) {
                    cls = 'text-match';
                    indexes.shift(); // 移除第一项
                }
            }
            spans += '<span class="' + cls + '">' + str.charAt(i) + '</span>';
        }
        return spans;
    };


    return service;

});