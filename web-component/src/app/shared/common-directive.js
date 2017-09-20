angular.module('app')
/**
 * 根据json配置文件生成模板或者直接取模板内容
 */
    .directive('formGenerator', function (commonService) {
        /**
         * 生成json模板或者通过html路径获取模板内容
         * @param tElement
         * @param tAttrs
         * @returns {*}
         */
        var template = function (tElement, tAttrs) {
            var i;
            var templateData = '';
            var templateType = tAttrs.url.slice(-4);
            // 同步获取模板数据
            $.ajax({
                url: tAttrs.url,
                dataType: templateType,
                async: false,
                success: function (data) {
                    templateData = data;
                }
            });
            if (templateType === 'html') {
                return templateData;
            } else {
                // 处理json
                /**
                 * 解析可配置的json文件
                 * 1.根据项目需求配置每行显示的列数，form级别 < form内容级别
                 * 2.提示信息位置可配置，默认显示在输入框下方（不需要额外的样式），可配置在右侧显示（根据项目需求）
                 * 3.支持各种类型的表单控件，支持自定义表单控件（以指令方式配置）
                 * 4.目前只支持最多两个按钮，按钮样式可配置
                 * 5.支持各种验证器，angular默认验证器，自定义验证器（以指令方式配置）
                 */
                var formName = templateData.form.name;
                var labelCol = templateData.form.labelCol;
                var rightCol = templateData.form.rightCol;
                var btnOffsetCol = templateData.form.btnOffsetCol;
                var colType = templateData.form.colType;
                var formContentArr = [];
                var genBtnItemHtml = function (btnItem) {
                    return '<div class="col-' + colType + '-offset-' + btnOffsetCol + ' col-' + colType + '-' + btnItem.btnCol + '">' +
                        '<button class="btn btn-primary btn-block" ng-click="' + btnItem.click + '" ng-disabled="' + formName + '.$invalid || ' + formName + '.$pristine">' + btnItem.value + '</button>' +
                        '</div>';
                };
                // 表单内容
                angular.forEach(templateData.form.content, function (item) {
                    var ruleString = ' ';
                    var validArea = [];
                    var ngShowArr = [];
                    var _ngShowArr = [];
                    var formContentItem = '';
                    switch (item.type) {
                        case 'text':
                        case 'password':
                        case 'textarea':
                            if (item.limitRules) {
                                // 验证规则
                                angular.forEach(item.limitRules, function (rule) {
                                    _ngShowArr.push(formName + '.' + item.name + '.$error.' + rule.name);
                                    if (rule.type === 0) {
                                        // angular内置验证器
                                        if (rule.value === '') {
                                            // 不需要值，不需要值的验证器只支持required
                                            ruleString += rule.name + ' ';
                                        } else {
                                            // 需要值
                                            ruleString += 'ng-' + rule.name + '="' + rule.value + '" ';
                                        }
                                    } else {
                                        // 自定义验证器
                                        if (rule.value === '') {
                                            // 不需要值
                                            ruleString += commonService.transformString(rule.name) + ' ';
                                        } else {
                                            // 需要值
                                            ruleString += commonService.transformString(rule.name) + '="' + rule.value + '" ';
                                        }
                                    }
                                    validArea.push('<span ng-show="%%ngShow%%">' + item.label + rule.tip + '</span>');
                                });
                                // 处理ngShow,使得提示信息只显示一种
                                var ngShow = '';
                                for (i = 0; i < _ngShowArr.length; i++) {
                                    ngShow += '!' + _ngShowArr[i];
                                    if (i < _ngShowArr.length - 1) {
                                        ngShow += ' && ';
                                    }
                                }
                                for (i = 0; i < _ngShowArr.length; i++) {
                                    var _ngShow = ngShow;
                                    for (var j = i + 1; j < _ngShowArr.length; j++) {
                                        _ngShow = _ngShow.replace(' && !' + _ngShowArr[j], '');
                                    }
                                    ngShowArr[i] = _ngShow.replace('!' + _ngShowArr[i], _ngShowArr[i]);
                                }
                                for (i = 0; i < validArea.length; i++) {
                                    validArea[i] = validArea[i].replace('%%ngShow%%', ngShowArr[i]);
                                }
                            }
                            var labelStart = '<input type="' + item.type + '" ';
                            var labelEnd = '">';
                            if (item.type === 'textarea') {
                                labelStart = '<textarea';
                                labelEnd = '></textarea>';
                            }
                            formContentItem = '<div class="form-group">' +
                                '<label ' + (item.id ? 'for="' + item.id + '"' : '') + ' class="col-' + colType + '-' + labelCol + ' control-label">' + (item.required ? '<span class="c-red">*</span>' : '') + item.label + '</label>' +
                                '<div class="col-' + colType + '-' + rightCol + '">' +
                                labelStart + 'name="' + item.name + '" ng-model="' + item.model + '" placeholder="' + item.placeholder + item.label + '"' +
                                'class="form-control" ' + (item.id ? 'id="' + item.id + '"' : '') + ruleString + labelEnd +
                                '<span class="text-danger" ' +
                                'ng-show="' + formName + '.' + item.name + '.$dirty && ' + formName + '.' + item.name + '.$invalid">' +
                                validArea.join('') +
                                '</span>' +
                                '</div>' +
                                '</div>';
                            formContentArr[item.sort] = formContentItem;
                            break;
                        case 'checkbox':
                        case 'radio':
                            var itemHtml = '';
                            for (i = 0; i < item.checkItems.length; i++) {
                                var checkItem = item.checkItems[i];
                                itemHtml += '<div class="' + item.type + '">' +
                                    '<input type="' + item.type + '" ng-model="' + checkItem.model + '" ' + (checkItem.required ? 'required' : '') + ' >' + checkItem.label +
                                    '</div>';
                            }
                            formContentItem = '<div class="form-group">' +
                                '<div class="col-' + colType + '-offset-' + labelCol + ' col-' + colType + '-' + rightCol + '">' +
                                itemHtml +
                                '</div>' +
                                '</div>';
                            formContentArr[item.sort] = formContentItem;
                            break;
                        case 'button':
                            var btnItemHtml = genBtnItemHtml(item.btns[0]);
                            if (item.btns.length === 2) {
                                btnItemHtml += genBtnItemHtml(item.btns[1]);
                            }
                            formContentItem = '<div class="form-group">' + btnItemHtml + '</div>';
                            formContentArr[item.sort] = formContentItem;
                            break;
                        default:
                            // 将该配置项当做指令来处理
                            formContentItem = '<div ' +
                                commonService.transformString(item.type) + ' ' +
                                'data-formName="' + formName + '" ' +
                                'data-labelCol="' + labelCol + '" ' +
                                'data-rightCol="' + rightCol + '" ' +
                                'data-btnOffsetCol="' + btnOffsetCol + '" ' +
                                'data-colType="' + colType + '" ' +
                                'data-sort="' + item.sort + '" ' +
                                'data-name="' + item.name + '" ' +
                                'data-model="' + item.model + '"' +
                                ' ></div>';
                            formContentArr[item.sort] = formContentItem;
                            break;
                    }
                });
                return '<form class="form-horizontal" role="form" name="' + formName + '" novalidate>' +
                    formContentArr.join('') +
                    '</form>';
            }

        };
        return {
            template: template
        };
    })
    /**
     * 生成验证规则
     * 指令使用说明:
     * 1.用途:自动生成验证提示
     * 2.用法:
     *  1.基本用法
     *      1.在需要使用验证的输入框后面加上一个包含该指令的标签,如:
     *          <span validate-generator></span>
     *          能够处理angular所有的内置指令,默认的提示信息可以在指令内部修改.
     *  2.高级用法
     *      1.提示信息不是输入框的下一个元素,则可以指定一个id,如:
     *      <input id="inputId" required>
     *      <span></span>
     *      <span validate-generator="inputId"></span>
     *      2.提示信息不在form标签内
     *      <form name="formName"></form>
     *      <input id="inputId" required>
     *      <span validate-generator data-form="formName"></span>
     *      3.输入框中有自定义的指令验证器
     *      <input is-exist is-valid>
     *      <span validate-generator data-custom-validate="is-exist:已经存在|is-valid:不合法"></span>
     */
    .directive('validateGenerator', function (commonService) {
        return {
            replace: true,
            template: function (tEle, tAttr) {
                // 获取生成验证规则的目标
                var $target = tAttr.validateGenerator ? $('#' + tAttr.validateGenerator) : $(tEle).prev();
                // 找到验证规则，自定义验证规则需要在span标签上写明：data-custom-validate="custom-a:已经存在|custom-b:包含敏感字"；以中划线拼接
                var validates = [];
                // 添加angular内置验证规则
                var type = $target.attr('type');
                if (type === 'email') {
                    validates.push({name: 'email', desc: '邮箱格式不正确'});
                } else if (type === 'number') {
                    validates.push({name: 'number', desc: '数字格式不正确'});
                } else if (type === 'url') {
                    validates.push({name: 'url', desc: 'url格式不正确'});
                }
                var ngValidates = [
                    {name: 'required', desc: '必填项不能为空'},
                    {name: 'ng-minlength', desc: '最少字符限制'},
                    {name: 'ng-maxlength', desc: '最大字符限制'},
                    {name: 'ng-pattern', desc: '输入不符合规范'}
                ];
                for (var i = 0, l = ngValidates.length; i < l; i++) {
                    var item = ngValidates[i];
                    if (item.name in $target[0].attributes) {
                        var suffix = '';
                        if (item.name === 'ng-minlength' || item.name === 'ng-maxlength') {
                            suffix = $target.attr(item.name) + '位';
                        }
                        validates.push({name: item.name.replace('ng-', ''), desc: item.desc + suffix});
                    }
                }
                // 添加自定义验证规则
                validates = validates.concat(tAttr.customValidate ?
                    tAttr.customValidate.split('|').map(function (item) {
                        return {name: item.split(':')[0].trim(), desc: item.split(':')[1].trim()};
                    }).filter(function (item) {
                        return item.name in $target[0].attributes;
                    }).map(function (item) {
                        return {name: commonService.transformString(item.name), desc: item.desc};
                    }) : []);
                // 获取formName
                var formName = tAttr.form || $(commonService.findParentNode(tEle[0], 'form')).attr('name');
                if (!formName) {
                    throw new Error('Cannot find form!');
                }
                var _ngShowArr = [];
                var ngShowArr = [];
                var validateHtml = [];
                // 根据验证规则生成html
                angular.forEach(validates, function (rule) {
                    _ngShowArr.push(formName + '.' + $target[0].name + '.$error.' + rule.name);
                    validateHtml.push('<span ng-show="%%ngShow%%">' + rule.desc + '</span>');
                });
                // 处理ngShow,使得提示信息只显示一种
                var ngShow = '';
                for (i = 0; i < _ngShowArr.length; i++) {
                    ngShow += '!' + _ngShowArr[i];
                    if (i < _ngShowArr.length - 1) {
                        ngShow += ' && ';
                    }
                }
                for (i = 0; i < _ngShowArr.length; i++) {
                    var _ngShow = ngShow;
                    for (var j = i + 1; j < _ngShowArr.length; j++) {
                        _ngShow = _ngShow.replace(' && !' + _ngShowArr[j], '');
                    }
                    ngShowArr[i] = _ngShow.replace('!' + _ngShowArr[i], _ngShowArr[i]);
                }
                for (i = 0; i < validateHtml.length; i++) {
                    validateHtml[i] = validateHtml[i].replace('%%ngShow%%', ngShowArr[i]);
                }
                return '<span ng-show="!' + formName + '.' + $target[0].name + '.$pristine && !' + formName + '.' + $target[0].name + '.$valid" class="text-danger">' + validateHtml.join('') + '</span>';
            }
        };
    })
    /**
     * 验证码控件指令，生成一个表单控件（只支持一个控件占一行的情况）
     */
    .directive('validateCodeControl', function () {
        return {
            replace: true,
            template: function (tElement, tAttrs) {
                return '<div class="form-group">' +
                    '<label ' + (tAttrs.id ? 'for="' + tAttrs.id + '"' : '') + ' class="col-' + tAttrs.coltype + '-' + tAttrs.labelcol + ' control-label"><span class="c-red">*</span>验证码</label>' +
                    '<div class="col-' + tAttrs.coltype + '-' + tAttrs.rightcol + '">' +
                    '<input type="text" name="' + tAttrs.name + '" ng-model="' + tAttrs.model + '" placeholder="请输入验证码" ' +
                    'class="form-control w_50 fl" ' + (tAttrs.id ? 'id="' + tAttrs.id + '"' : '') + 'required>' +
                    '<validate-code></validate-code>' +
                    '<span class="form-error-tip text-danger" ' +
                    'ng-show="' + tAttrs.formname + '.' + tAttrs.name + '.$dirty && ' + tAttrs.formname + '.' + tAttrs.name + '.$invalid">验证码不能为空</span>' +
                    '</div>' +
                    '</div>';
            }

        };
    })
    /**
     * 验证码指令
     */
    .directive('validateCode', function ($compile, commonService) {
        return {
            restrict: 'EA',
            replace: true,
            template: commonService.getValidateCode,
            link: function (scope, ele) {
                // 点击刷新验证码
                $(ele).click(function () {
                    $(this).replaceWith($compile('<validate-code></validate-code>')(scope));
                });
            }
        };
    })
    /**
     * 使文字渐变（兼容谷歌浏览器）
     */
    .directive('gradientText', function () {
        return {
            link: function (scope, ele, attrs) {
                var MAX = attrs.level - 0 || 2;
                var c = function () {
                    return 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
                };
                var getBackgroundImage = function () {
                    if (MAX <= 2) {
                        return '-webkit-gradient(linear, left top, right bottom, from(' + c() + '), to(' + c() + '))';
                    }
                    var backgroundImage = '-webkit-linear-gradient(left, ';
                    for (var i = 0; i < MAX; i++) {
                        backgroundImage += c() + ' ' + i + (i === 0 ? '' : '0%');
                        if (i < MAX - 1) {
                            backgroundImage += ',';
                        } else {
                            backgroundImage += ')';
                        }
                    }
                    return backgroundImage;
                };
                $(ele).css('background-image', getBackgroundImage());
            }
        };
    })
    /**
     * 使文字渐变（兼容所有浏览器） --- 未完成
     */
    .directive('gradientTextNormal', function () {
        return {
            link: function (scope, ele) {
                var textArray = $(ele).text();
                var l = textArray.length;
                var get256Num = function (number) {
                    return number % 256;
                };
                var c = function () {
                    return Math.floor(Math.random() * 256);
                };
                // 获取文字颜色数组
                var colorArray = [];
                for (var i = 0; i < l; i++) {
                    colorArray.push({
                        r: c(),
                        g: c(),
                        b: c()
                    });
                }
                var getGradientText = function () {
                    var spans = '';
                    for (var i = 0; i < l; i++) {
                        var t = textArray[i];
                        var color = colorArray[i];
                        spans += '<span style="color: rgb(' + get256Num(color.r) + ',' + get256Num(color.g) + ',' + get256Num(color.b) + ')">' + t + '</span>';
                    }
                    $(ele).html(spans);
                };
                getGradientText();

            }
        };
    })
    /**
     * 提示敏感字
     */
    .directive('sensitiveWord', function ($timeout, dataService) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, c) {
                var timeout = null;
                scope.$watch(attrs.ngModel, function (n) {
                    if (!n) return;
                    if (timeout) $timeout.cancel();
                    timeout = $timeout(function () {
                        dataService.validateSensitiveWord(c.$modelValue, function (res) {
                            c.$setValidity('sensitiveWord', res.code === 0);
                        });
                    }, 300);
                });
            }
        };
    })
    /**
     *使按钮点击之后禁用2秒，防止多次点击
     */
    .directive('disabledAfterClick', function ($timeout) {
        return {
            link: function (scope, ele) {
                $(ele).off('click.dac').on('click.dac', function () {
                    $(ele).prop('disabled', true);
                    $timeout(function () {
                        $(ele).prop('disabled', false);
                    }, 2000);
                });
            }
        };
    })
    /**
     * 手动编译变量中的html
     *
     * compileBindHtml指令对应的值为需要编译的html
     * 如：
     * -- html --
     * <div compile-bind-html="{{htmlContent}}"></div>
     * -- js --
     * $scope.htmlContent = '<div class="text-center">居中显示</div>';
     * 如果没有使用compile-bind-html指令，则显示的内容为一段html代码即会将div标签也显示出来，使用之后，代码会正常显示
     *
     */
    .directive('compileBindHtml', function ($compile) {
        return {
            link: function (scope, ele, attrs) {
                scope.$watch("::" + attrs.compileBindHtml, function (html) {
                    if (html && html.indexOf("<") !== -1 && html.indexOf(">") !== -1) {
                        var linker = $compile(html);
                        linker(scope, function (clone) {
                            ele.empty();
                            ele.append(clone);
                        });
                    } else {
                        ele.empty();
                        ele.append(html);
                    }
                });
            }
        };
    })
    /**
     * ng-repeat完成之后发送事件
     * <tr ng-repeat="t in texts track by $index" repeat-finish="test-es-texts">
     */
    .directive('repeatFinish', function ($timeout) {
        return {
            link: function (scope, ele, attrs) {
                if (scope.$last) {
                    $timeout(function () {
                        scope.$emit(attrs.repeatFinish);
                    });
                }
            }
        };
    })
    /**
     * 自定义下拉框组件
     * 主要解决的问题：
     *  1.默认下拉框在各个浏览器下的样式不一致
     *  2.无法进行搜索
     *
     * 使用方法：
     *  1.构造数据
     *    1.基本数据构造：实现key和value两个属性即可
     *    2.多功能数据构造：
     *      1.级联数据构造
     *      2.查询数据构造
     *          1.拼音查询
     *          2.联合查询
     * 支持的功能：
     *  1.常规数据显示，需要基本数据构造
     *  2.级联下拉框
     *  3.查询下拉框（支持拼音查询），需要构造数据
     *
     *  @example
     *      <custom-select class="app-query-select" data-model="queryCondition" default cs-ng-model="query"></custom-select>
     *      可以在$scope.query中取得选中的值？
     *
     */
    // 使用span标签作为选择控件遇到问题：无法触发keydown事件，现在改为使用input框
    .directive('customSelect', function ($timeout, $compile, commonService) {
        return {
            restrict: 'AE',
            replace: true,
            template: '<div class="custom-select-wrap">' +
            '<input type="text" class="custom-select-main form-control" readonly>' +
            '<ul class="custom-select-list dn"></ul>' +
            '</div>',
            link: function (scope, ele, attrs) {
                var $main = $(ele).find('input.custom-select-main');
                var $list = $(ele).find('.custom-select-list');
                var isSearch = 'search' in attrs; // 是否为搜索输入框
                if (isSearch) {
                    $main = $main.prop('readonly', false);
                }
                var isDefault = 'default' in attrs;// 是否有默认值（默认为default的值，如果没有值，则为下拉框的第一项）
                var placeholder = attrs.placeholder;
                $main.attr('placeholder', placeholder);
                var ngModel = attrs.csNgModel;
                // var _$main = $main.clone().attr('ng-model', ngModel);
                // $main.remove();
                // $main = _$main;
                // $(ele).prepend($compile($main)(scope));
                var generatorList = function (data) {
                    var liHtml = '';
                    if (data.length === 0) {
                        liHtml = '<li class="custom-select-item custom-select-no-click">没有匹配记录</li>';
                    } else {
                        var n = arguments[1]; // 搜索框输入的关键字
                        for (var i = 0, l = data.length; i < l; i++) {
                            var item = data[i];
                            liHtml += '<li class="custom-select-item' + (i === 0 ? ' active' : '') + '" data-key="' + item.key + '" data-value="' + item.value + '">' + commonService.splitString(item.value, n) + '</li>';
                        }
                    }
                    $list.empty().append(liHtml);
                    return false;
                };

                var filterData = function (n) {
                    var _data = [];
                    if (n !== '') {
                        // 策略1，包含
                        // 策略2，贪婪匹配
                        // 仿照webStorm的文件搜索功能
                        var regStr = '';
                        for (var j = 0, lj = n.length; j < lj; j++) {
                            // var j_item = n.charAt(j);
                            // regStr += '(' + j_item.toUpperCase() + '|' + j_item.toLowerCase() + ').+?';
                            regStr += n.charAt(j) + '[\\s\\S]*?';
                        }
                        var reg = new RegExp(regStr, 'i');
                        for (var i = 0, l = data.length; i < l; i++) {
                            var item = data[i];
                            if (reg.test(item.value)) {
                                _data.push(data[i]);
                            }
                        }
                    } else {
                        _data = data;
                    }
                    return _data;
                };

                var searchResult = function (val) {
                    "use strict";
                    if (val) {
                        url += '?' + attrs.field + '=' + val;
                    }
                    $.ajax({
                        url: url,
                        type: 'get',
                        dataType: 'json',
                        async: false,
                        success: function (res) {
                            "use strict";
                            typeof scope[attrs.handle] === 'function' && (res = scope[attrs.handle](res));
                            console.log(res);
                            data = res;
                        }
                    });
                };
                // 初始化数据，根据指令中的data-model属性取得值
                var model = attrs.model;
                var url = attrs.url;
                var data = [];
                if (model) {
                    data = scope[model];
                } else if (url) {
                    // 发送同步请求数据
                    searchResult();
                }
                // 设置默认值
                if (isDefault) {
                    if (attrs.default === '') {
                        $main.attr('data-key', data[0].key).attr('data-value', data[0].value);
                        scope[ngModel] = data[0].value;
                    } else {
                        var _default = attrs.default.split(':');
                        var _key = _default[0];
                        var _value = _default[1];
                        $main.attr('data-key', _key).attr('data-value', _value).val(_value);
                        scope[ngModel] = _value;
                    }
                }

                if (data && data.length > 0 && data[0].key !== undefined && data[0].value !== undefined) {
                    generatorList(data);
                } else {
                    console.error('请使用data-model绑定下拉框的数据，且数据中必须包含key和value两个属性！');
                    return;
                }


                var count = ++commonService.counts.customSelect;
                $(ele)
                    .on('click.cs', '.custom-select-main', onClickMain)
                    .on('click.cs', '.custom-select-item:not(.custom-select-no-click)', onClickItem)
                    .on('mouseenter.cs', '.custom-select-item', onMouseEnterItem)
                ;
                $main.on('keydown.cs', onKeyDownCustomSelect);
                $main.on('keyup.cs', onKeyUpCustomSelect);
                // 引入count,使得各个下拉框互不影响
                $(document).off('click.customselect' + count).on('click.customselect' + count, onClickDocument);

                // 点击选择框控件
                function onClickMain() {
                    // 当前下拉框是否为显示的
                    var isCurrentVisible = $list.is(':visible');
                    // 隐藏所有的下拉框
                    $('.custom-select-list').addClass('dn');
                    // 取消所有选择控件的激活状态
                    $('.custom-select-main').removeClass('input-focus');

                    // 显示当前下拉框
                    if (!isCurrentVisible) {
                        $list.removeClass('dn');
                    }
                    // 函数结束之后需要return false以终止函数的运行。
                    // 如果不加上return false,当快速点击时会出现事件叠加
                    // return false,会阻止事件传播，即不会响应document上绑定的事件
                    return false;
                }

                // 鼠标经过下拉列表
                function onMouseEnterItem() {
                    $(this).addClass('active').siblings().removeClass('active');
                }

                // 点击下拉框的项
                function onClickItem() {
                    var key = $(this).attr('data-key');
                    var value = $(this).attr('data-value');
                    $main.attr('data-key', key).attr('data-value', value);
                    // key值为空则显示placeHolder的内容
                    if (key === '') {
                        $main.val('');
                        scope[ngModel] = '';
                    } else {
                        $main.val(value);
                        scope[ngModel] = value;
                    }
                    $list.addClass('dn');
                }

                // 点击文档隐藏下拉框
                function onClickDocument(e) {
                    // 1.鼠标点击的是右键，不处理
                    // 2.鼠标点击的元素在ele内部，不处理
                    // 3.鼠标点击的元素在ele外部，
                    //      1.取消select的激活状态
                    //      2.判断下拉框是否显示，如果显示则让其隐藏
                    if (e && e.which === 3) return;
                    if (ele[0].contains(e.target)) return;

                    if ($list.is(':visible')) {
                        $list.addClass('dn');
                    }

                }

                // 使用键盘控制下拉框
                // 1.enter执行选择
                // 2.up，down执行切换
                var timeout = null;

                function onKeyDownCustomSelect(e) {


                    var which = e.which;

                    var $activeLi = $list.find('.active');
                    // 对键值的处理

                    // enter
                    if (which === 13) {
                        $activeLi.click();
                    }
                    // esc
                    if (which === 27) {
                        $list.addClass('dn');
                    }

                    // up left  down right
                    if (which === 37 || which === 38 || which === 39 || which === 40) {
                        $list.removeClass('dn');
                        if ($activeLi.length === 0) {
                            $list.find('li:first').addClass('active');
                            $activeLi = $list.find('.active');
                        }


                        if (which === 37 || which === 38) {
                            // 向上翻
                            if ($activeLi.index() !== 0) {
                                $activeLi.prev().addClass('active').siblings().removeClass('active');

                                // // 控制滚动条滚动
                                // var list_s_t = $list.scrollTop();
                                // if(list_s_t > 0){
                                //     var overItemCount = Math.floor(list_s_t / itemHeight);
                                // }
                            }
                        }

                        if (which === 39 || which === 40) {
                            // 向下翻
                            if ($activeLi.index() !== data.length - 1) {
                                $activeLi.next().addClass('active').siblings().removeClass('active');
                            }
                        }

                        // 计算滚动条滚动所需参数
                        var listHeight = $list.height();
                        var itemHeight = $list.find('li:first').height();
                        var maxItemCount = Math.floor(listHeight / itemHeight);

                        // 移动激活的item之后对滚动条进行处理
                        $activeLi = $list.find('.active');
                        // 当前所在行
                        var currentLine = $activeLi.index() + 1;
                        var sub = currentLine - maxItemCount;
                        if (sub >= 0) {
                            $list.scrollTop(sub * itemHeight);
                        }
                    }

                }

                // 在keyup时进行检索
                var oldValue = '';

                function onKeyUpCustomSelect(e) {
                    // 判断某些按键不进行检索
                    // todo
                    var which = e.which;
                    if (which === 13 || which === 27 || (which >= 37 && which <= 40)) {
                        return;
                    }

                    var newValue = $main.val();
                    // 搜索策略：
                    // 按键弹起时，如果输入框的值发生了改变，则进行检索，如果检索结果没有发生改变，不更新下拉框
                    if (newValue !== oldValue) {
                        oldValue = newValue;
                        if (timeout) {
                            $timeout.cancel();
                        }
                        timeout = $timeout(function () {
                            generatorList(filterData(newValue), newValue);
                        }, 200);
                        $list.removeClass('dn');
                    }
                }


            }
        };
    })
    .directive('repeatFinish', function ($timeout, commonService) {
        return {
            scope: {
                repeatFinish: '@'
            },
            link: function (scope) {
                if (scope.$parent.$last) {
                    $timeout(function () {
                        scope.$emit(commonService.EVENT.ngRepeatFinished, scope.repeatFinish);
                    });
                }
            }
        };
    })
    /**
     * bootstrap-table可编辑
     */
    .directive('btColEditable', function (commonService, dataService) {
        return {
            template: function (tEle, tAttrs) {
                return '<span class="js-cell-value">' + tAttrs.value + '</span><span class="glyphicon glyphicon-pencil js-edit"></span>';
            },
            link: function (scope, ele, attrs) {
                $(ele).parent().mouseover(function () {
                    $(this).addClass('show');
                }).mouseleave(function () {
                    $(this).removeClass('show');
                }).find('.js-edit').click(function (e) {
                    if ($('.js-edit-panel').length !== 0) {
                        $('.js-edit-panel').remove();
                        return;
                    }
                    e.stopPropagation();
                    var $span = $(e.target).parent();
                    var $td = $span.parent();
                    var $tr = $td.parent();
                    var $table = $tr.parent().parent();
                    var $th = $table.find('thead tr th:nth-of-type(' + ($td.index() + 1) + ')');
                    var field = 'qe_' + $th.data().field;
                    var title = attrs.qeTitle || ('修改' + $th.find('.th-inner').text());
                    var id = $span.data().id;
                    var value = $span.data().value;
                    var index = $span.data().index;
                    var quickEditOkFn = attrs.quickEditOkFn; // 点击确定时运行的方法
                    commonService.showQuickEdit({
                        scope: scope,
                        field: field,
                        target: $span,
                        title: title,
                        value: value,
                        ok: function () {
                            scope[quickEditOkFn].apply(null, [scope[field], id, index]);
                        }
                    });
                });

            }
        };
    })
    /**
     * 多选天控件
     *
     * 使用data-model属性作为model
     * @example
     *  <select-day-control data-model="sdcModel2"></select-day-control>
     *  controller中可以在 $scope.sdcModel2中取得选中的值
     */
    .directive('selectDayControl', function ($compile) {
        "use strict";
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="sdc-wrap">' +
            '<input class="sdc-input form-control" ng-model="sdcValue">' +
            '<ul class="sdc-ul dn">' +
            '<li class="sdc-li" ng-repeat="d in ::days">{{::d}}</li>' + // 只绑定一次
            '</ul>' +
            '</div>',
            link: function (scope, ele, attrs) {
                var model = attrs.model;
                if (model) {
                    var $main = $(ele).find('.sdc-input');
                    var _$main = $main.clone().attr('ng-model', model);
                    $main.remove();
                    $(ele).prepend($compile(_$main)(scope));
                }
                // 默认的值：父controller中只存在一个该指令时，不需要指定model，使用默认的model即可
                scope.sdcValue = '';
                var _days = [];
                for (var i = 1; i < 32; i++) {
                    _days.push(('0' + i).slice(-2));
                }
                scope.days = _days;
                var selectedArr = [];
                $(ele).find('.sdc-ul').off('click').on('click', '.sdc-li', function (e) {
                    var text = $(this).text();
                    var index = selectedArr.indexOf(text);
                    if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                        if (index !== -1) {
                            selectedArr.splice(index, 1);
                        }
                    } else {
                        $(this).addClass('active');
                        if (index === -1) {
                            selectedArr.push(text);
                        }
                    }
                    var value = selectedArr.sort().join(',');
                    scope.$apply(function () {
                        if (model) {
                            scope[model] = value;
                        } else {
                            scope.sdcValue = value;
                        }
                    });
                    return false; // 这句话非常重要，如果没有这句话，该事件可能会出现不可意料的执行，如：点击10次，却执行11次，且this在不可意料中的执行时会变得不可意料，会导致出现不可意料的问题。
                });
                $(ele).find('.sdc-input').on('focus', function () {
                    $(ele).find('.sdc-ul').removeClass('dn');
                });
            }
        };
    })
    .directive('sliderSelect', function () {
        return {
            restrict: 'E',
            template: '<div class="df pr">' +
            '<span class="glyphicon glyphicon-minus slider-select-change slider-select-mimus"></span>' +
            '<span class="slider-select-value slider-select-value-min"></span>' +
            '<span class="slider-select-value slider-select-value-max"></span>' +
            '<span class="slider-select-value slider-select-value-current"></span>' +
            '<div class="slider-select">' +
            '<span class="slider-select-subject"></span>' +
            '</div>' +
            '<div class="slider-select-mask dn"></div>' +
            '<span class="glyphicon glyphicon-plus slider-select-change slider-select-plus"></span>' +
            '</div>',
            link: function (scope, ele, attrs) {

                var sliderBedWidth = attrs.width - 0 || 280;
                var max = sliderBedWidth - 10; // 减去滑块的宽度

                var maxValue = attrs.max - 0 || max;
                var minValue = attrs.min - 0 || 0;
                var currentValue = attrs.current - 0 || minValue;
                // 特殊类型：24小时制，且进行时间转化
                if (attrs.type === 'H') {
                    maxValue = 1440; // 一天1440分钟 24*60
                }
                var per = max / (maxValue - minValue);

                $(ele).find('.slider-select-value-min').text(minValue);
                $(ele).find('.slider-select-value-max').text(attrs.type === 'H' ? '24' : maxValue).css('left', sliderBedWidth + 20);
                var current = $(ele).find('.slider-select-value-current');
                var getCurrentValue = function (left) {
                    if (attrs.type === 'H') {
                        return ('0' + Math.floor(Math.ceil(left / per) / 60)).slice(-2) + ':' + ('0' + (Math.ceil(left / per) % 60)).slice(-2);
                    } else {
                        return Math.ceil(left / per);
                    }
                }
                var calcCurrent = function (left) {
                    // 初始化
                    if (left === undefined) {
                        current.text(currentValue).css('left', currentValue * per + 20);
                    } else {
                        // 根据left计算
                        current.text(getCurrentValue(left)).css('left', left + 20);
                    }
                }
                calcCurrent();
                var slider = $(ele).find('.slider-select-subject');
                var mask = $(ele).find('.slider-select-mask');
                var bed = $(ele).find('.slider-select').css('width', sliderBedWidth);
                $(ele).find('.slider-select-mask').css('width', sliderBedWidth);

                var getViewLeft = function (left) {
                    return Math.round(left / per) * per;
                };

                var oldX, oldY, left, top;
                slider.on('mousedown', function (e) {
                    mask.removeClass('dn');
                    // 获取当前鼠标的位置，判断是否在有效范围内
                    oldX = e.pageX;
                    left = slider.css('left');
                });
                mask.on('mousemove', function (e) {
                    var newLeft = e.pageX - oldX + (left.replace('px', '') - 0);
                    if (newLeft < 0) {
                        newLeft = 0;
                        mask.addClass('dn');
                    } else if (newLeft > max) {
                        newLeft = max;
                        mask.addClass('dn');
                    }
                    calcCurrent(getViewLeft(newLeft));
                    // slider.css('left', newLeft);
                    slider.css('left', getViewLeft(newLeft));
                }).on('mouseup', function (e) {
                    oldX = e.pageX;
                    left = slider.css('left');
                    mask.addClass('dn');
                });
                bed.on('click', function (e) {
                    var newLeft = e.offsetX > max ? max : e.offsetX;
                    calcCurrent(getViewLeft(newLeft));
                    // slider.css('left', newLeft);
                    slider.css('left', getViewLeft(newLeft));
                });
                $(ele).find('.slider-select-change').on('click', function () {
                    var newLeft = slider.css('left').replace('px', '') - 0;
                    if ($(this).hasClass('slider-select-mimus')) {
                        newLeft -= per;
                    } else {
                        newLeft += per;
                    }
                    if (newLeft > max) {
                        newLeft = max;
                    } else if (newLeft < 0) {
                        newLeft = 0;
                    }
                    calcCurrent(getViewLeft(newLeft));
                    // slider.css('left', newLeft);
                    slider.css('left', getViewLeft(newLeft));
                });
            }
        }
    })
    /**
     * 时间选择控件
     * @example
     * 使用方法1：使用默认的model
     * <time-range></time-range>
     *   使用方法2：使用自定义model
     * <time-range data-start-hour-model="startHour"
     *   data-start-minute-model="startMinute"
     *   data-end-hour-model="endHour"
     *   data-end-minute-model="endMinute"></time-range>
     */
    .directive('timeRange', function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="time-range-wrap">' +
            '<div class="time-range-content">' +
            '<select class="form-control time-range-select time-range-start-hour" ng-change="changeTime(1)" ng-init="startHour = hours[0]" ng-model="startHour" ng-options="h for h in hours"></select>' +
            '<span class="p05">:</span>' +
            '<select class="form-control time-range-select time-range-start-minute" ng-change="changeTime(2)" ng-init="startMinute = minutes[0]" ng-model="startMinute" ng-options="m for m in minutes"></select>' +
            '<span class="p010">-</span>' +
            '<select class="form-control time-range-select time-range-end-hour" ng-change="changeTime(3)" ng-init="endHour = hours[0]" ng-model="endHour" ng-options="h for h in hours"></select>' +
            '<span class="p05">:</span>' +
            '<select class="form-control time-range-select time-range-end-minute" ng-change="changeTime(4)" ng-init="endMinute = minutes[0]" ng-model="endMinute" ng-options="m for m in minutes"></select>' +
            '</div>' +
            '</div>',
            controller: function ($scope) {
                var hours = [];
                var minutes = [];
                for (var i = 0; i < 24; i++) {
                    hours.push(('0' + i).slice(-2));
                }
                for (var i = 0; i < 60; i++) {
                    minutes.push(('0' + i).slice(-2));
                }
                $scope.hours = hours;
                $scope.minutes = minutes;

            },
            link: function (scope, ele, attrs) {
                var startHour = attrs.startHourModel;
                var startMinute = attrs.startMinuteModel;
                var endHour = attrs.endHourModel;
                var endMinute = attrs.endMinuteModel;
                // 是否使用自定义的model
                if (startHour) {
                    var $main = $(ele).find('.time-range-content');
                    $main.find('.time-range-start-hour').attr({
                        'ng-model': startHour,
                        'ng-init': startHour + '=hours[0]'
                    });
                    $main.find('.time-range-start-minute').attr({
                        'ng-model': startMinute,
                        'ng-init': startMinute + '=hours[0]'
                    });
                    $main.find('.time-range-end-hour').attr({'ng-model': endHour, 'ng-init': endHour + '=hours[0]'});
                    $main.find('.time-range-end-minute').attr({
                        'ng-model': endMinute,
                        'ng-init': endMinute + '=hours[0]'
                    });
                    var _$main = $main.clone();
                    $main.remove();
                    $(ele).append($compile(_$main)(scope));
                }
            }
        };
    })
    /**
     * 自定义下拉框组件
     * 主要解决的问题：
     *  1.默认下拉框在各个浏览器下的样式不一致
     *  2.无法进行搜索
     *
     * 使用方法：
     *  1.构造数据
     *    1.基本数据构造：实现key和value两个属性即可
     *    2.多功能数据构造：
     *      1.级联数据构造
     *      2.查询数据构造
     *          1.拼音查询
     *          2.联合查询
     * 支持的功能：
     *  1.常规数据显示，需要基本数据构造
     *  2.级联下拉框
     *  3.查询下拉框（支持拼音查询），需要构造数据
     *
     *  @example
     *      <query-select class="app-query-select" data-model="queryCondition" default cs-ng-model="query"></query-select>
     *      可以在$scope.query中取得选中的值？
     *
     */
    // 使用span标签作为选择控件遇到问题：无法触发keydown事件，现在改为使用input框
    .directive('querySelect', function ($timeout, $compile, commonService) {
        return {
            restrict: 'AE',
            replace: true,
            template: '<div class="query-select-wrap">' +
            '<input type="text" class="query-select-show form-control disabled cd" readonly>' +
            '<div class="query-select-list-wrap dn">' +
            '<input type="text" class="query-select-main form-control" placeholder="输入搜索内容">' +
            '<ul class="query-select-list"></ul>' +
            '</div>' +
            '</div>',
            link: function (scope, ele, attrs) {
                var $show = $(ele).find('input.query-select-show');
                var $main = $(ele).find('input.query-select-main');
                var $listWrap = $(ele).find('.query-select-list-wrap');
                var $list = $(ele).find('.query-select-list');
                var placeholder = attrs.placeholder;
                $show.attr('placeholder', placeholder);
                var ngModel = attrs.csNgModel;
                var generatorList = function (data) {
                    var liHtml = '';
                    if (data.length === 0) {
                        liHtml = '<li class="query-select-item query-select-no-click">没有匹配记录</li>';
                    } else {
                        var n = arguments[1]; // 搜索框输入的关键字
                        for (var i = 0, l = data.length; i < l; i++) {
                            var item = data[i];
                            liHtml += '<li class="query-select-item' + (i === 0 ? ' active' : '') + '" data-key="' + item.key + '" data-value="' + item.value + '">' + commonService.splitString(item.value, n) + '</li>';
                        }
                    }
                    $list.empty().append(liHtml);
                    return false;
                };

                var filterData = function (n) {
                    var _data = [];
                    if (n !== '') {
                        // 策略1，包含
                        // 策略2，贪婪匹配
                        // 仿照webStorm的文件搜索功能
                        var regStr = '';
                        for (var j = 0, lj = n.length; j < lj; j++) {
                            // var j_item = n.charAt(j);
                            // regStr += '(' + j_item.toUpperCase() + '|' + j_item.toLowerCase() + ').+?';
                            regStr += n.charAt(j) + '[\\s\\S]*?';
                        }
                        var reg = new RegExp(regStr, 'i');
                        for (var i = 0, l = data.length; i < l; i++) {
                            var item = data[i];
                            if (reg.test(item.value)) {
                                _data.push(data[i]);
                            }
                        }
                    } else {
                        _data = data;
                    }
                    return _data;
                };

                // 初始化数据，根据指令中的data-model属性取得值
                var model = attrs.model;
                var data = [];
                if (model) {
                    data = scope[model];
                }

                if (data && data.length > 0 && data[0].key !== undefined && data[0].value !== undefined) {
                    generatorList(data);
                } else {
                    console.error('请使用data-model绑定下拉框的数据，且数据中必须包含key和value两个属性！');
                    return;
                }


                var count = ++commonService.counts.customSelect;
                $(ele)
                    .on('click.cs', '.query-select-show', onClickShow)
                    .on('click.cs', '.query-select-item:not(.query-select-no-click)', onClickItem)
                    .on('mouseenter.cs', '.query-select-item', onMouseEnterItem)
                ;
                $main.on('keydown.cs', onKeyDownQuerySelect);
                $main.on('keyup.cs', onKeyUpQuerySelect);
                // 引入count,使得各个下拉框互不影响
                $(document).off('click.queryselect' + count).on('click.queryselect' + count, onClickDocument);

                // 点击选择框控件
                function onClickShow() {
                    // 当前下拉框是否为显示的
                    var isCurrentVisible = $listWrap.is(':visible');
                    // 隐藏所有的下拉框
                    $('.query-select-list-wrap').addClass('dn');
                    // 取消所有选择控件的激活状态
                    $('.query-select-main').removeClass('input-focus');

                    // 显示当前下拉框
                    if (!isCurrentVisible) {
                        $listWrap.removeClass('dn');
                    }
                    // 函数结束之后需要return false以终止函数的运行。
                    // 如果不加上return false,当快速点击时会出现事件叠加
                    // return false,会阻止事件传播，即不会响应document上绑定的事件
                    return false;
                }

                // 鼠标经过下拉列表
                function onMouseEnterItem() {
                    $(this).addClass('active').siblings().removeClass('active');
                }

                // 点击下拉框的项
                function onClickItem() {
                    var key = $(this).attr('data-key');
                    var value = $(this).attr('data-value');
                    $show.attr('data-key', key).attr('data-value', value);
                    // key值为空则显示placeHolder的内容
                    if (key === '') {
                        $show.val('');
                        scope.$parent[ngModel] = '';
                    } else {
                        $show.val(value);
                        scope.$parent[ngModel] = value;
                    }
                    $listWrap.addClass('dn');
                }

                // 点击文档隐藏下拉框
                function onClickDocument(e) {
                    // 1.鼠标点击的是右键，不处理
                    // 2.鼠标点击的元素在ele内部，不处理
                    // 3.鼠标点击的元素在ele外部，
                    //      1.取消select的激活状态
                    //      2.判断下拉框是否显示，如果显示则让其隐藏
                    if (e && e.which === 3) return;
                    if (ele[0].contains(e.target)) return;

                    if ($listWrap.is(':visible')) {
                        $listWrap.addClass('dn');
                    }

                }

                // 使用键盘控制下拉框
                // 1.enter执行选择
                // 2.up，down执行切换
                var timeout = null;

                function onKeyDownQuerySelect(e) {


                    var which = e.which;

                    var $activeLi = $listWrap.find('.active');
                    // 对键值的处理

                    // enter
                    if (which === 13) {
                        $activeLi.click();
                    }
                    // esc
                    if (which === 27) {
                        $listWrap.addClass('dn');
                    }

                    // up left  down right
                    if (which === 37 || which === 38 || which === 39 || which === 40) {
                        $listWrap.removeClass('dn');
                        if ($activeLi.length === 0) {
                            $listWrap.find('li:first').addClass('active');
                            $activeLi = $listWrap.find('.active');
                        }


                        if (which === 37 || which === 38) {
                            // 向上翻
                            if ($activeLi.index() !== 0) {
                                $activeLi.prev().addClass('active').siblings().removeClass('active');

                                // // 控制滚动条滚动
                                // var list_s_t = $list.scrollTop();
                                // if(list_s_t > 0){
                                //     var overItemCount = Math.floor(list_s_t / itemHeight);
                                // }
                            }
                        }

                        if (which === 39 || which === 40) {
                            // 向下翻
                            if ($activeLi.index() !== data.length - 1) {
                                $activeLi.next().addClass('active').siblings().removeClass('active');
                            }
                        }

                        // 计算滚动条滚动所需参数
                        var listHeight = $list.height();
                        var itemHeight = $list.find('li:first').height();
                        var maxItemCount = Math.floor(listHeight / itemHeight);

                        // 移动激活的item之后对滚动条进行处理
                        $activeLi = $list.find('.active');
                        // 当前所在行
                        var currentLine = $activeLi.index() + 1;
                        var sub = currentLine - maxItemCount;
                        if (sub >= 0) {
                            $list.scrollTop(sub * itemHeight);
                        }
                    }

                }

                // 在keyup时进行检索
                var oldValue = '';

                function onKeyUpQuerySelect(e) {
                    // 判断某些按键不进行检索
                    // todo
                    var which = e.which;
                    if (which === 13 || which === 27 || (which >= 37 && which <= 40)) {
                        return;
                    }

                    var newValue = $main.val();
                    // 搜索策略：
                    // 按键弹起时，如果输入框的值发生了改变，则进行检索，如果检索结果没有发生改变，不更新下拉框
                    if (newValue !== oldValue) {
                        oldValue = newValue;
                        if (timeout) {
                            $timeout.cancel();
                        }
                        timeout = $timeout(function () {
                            generatorList(filterData(newValue), newValue);
                        }, 200);
                        $listWrap.removeClass('dn');
                    }
                }


            }
        };
    })

;
