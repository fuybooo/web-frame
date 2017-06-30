/**
 * 弹出层插件
 * @author fuyb
 * @date 2017-04-15
 *
 */
define(function(require) {
    var $ = require('jquery');
    var app = require('app');
    app.factory('Popupwin', function ($http, $compile) {
        /**
         * 默认配置项
         */
        var DEF = {
            cls: '', // 弹出层的类名
            isMask: true, // 是否启动遮罩层
            isKeyboard: true, // 是否启动快捷键 ESC为关闭，空格为确认执行当前选中的按钮，默认会选中确认，只有一个按钮是选中一个按钮
            zIndex: 200, // 在文档流上的位置，如果需要较高位置可以配置
            animation: 'random', // 动画效果： 'none':无效果, 'fade': 渐渐的出来 , 'top': 上边, 'right': 右边, 'bottom': 下边, 'left': 左边, 'random': 随机
            animationTime: 400, // 动画效果的时间
            okBtnText: '确定', // 执行ok事件按钮的文本
            okBtnCls: 'btn-primary btn-sm',
            closeBtnText: '取消', // 执行取消事件按钮的文本
            closeBtnCls: 'btn-primary btn-sm',
            btnPosition: 'right',// 底部按钮的位置 left， center， right
            isFooter: true,// 是否需要底部按钮
            isOkOnly: true, // 只有确定按钮
            isCancelOnly: false, // 只有取消按钮
            title: '温馨提示', // 弹出窗标题
            text: '操作成功!',
            textCls: 'text-primary',
            defaultText: '您确定删除吗？',
            top: 100,
            width: 300,
            html: '<p class="text-center"></p>',
            closeWinAfterOk: true, // 是否在点击ok之后关闭弹出
            closeWinAfterClose: true // 是否在点击close之后关闭弹出
            /**
             *
             * scope,
             * htmlUrl
             *
             */
        };
        var zIndex = DEF.zIndex;
        var findMaxPop = function(){
            var $allPopupwin = $('.popupwin:visible');
            var shown_count = $allPopupwin.length;
            if (shown_count !== 0) {
                var $maxPop = $($allPopupwin[0]);
                for (var i = 1; i < shown_count; i++) {
                    if ($($allPopupwin[i]).css('z-index') - 0 > $maxPop.css('z-index') - 0) {
                        $maxPop = $($allPopupwin[i]);
                    }
                }
                return $maxPop;
            }
        };
        /**
         * 弹出层
         * @param {Object} options 配置项
         */
        var PopupWin = function (options) {
            // 判断参数
            // 如果没有参数，弹出一个没有任何事件的提示框,默认提示语为DEF.text
            // 如果参数是一个字符串，弹出一个没有任何事件，提示语为传入的字符串的提示框
            // 如果传如的参数是一个函数，则提示语变为‘确认删除吗？’，函数为点击确认时的回调 这是最常用的用法，即弹出一个是否删除的提示
            // 如果需要改变提示语，则传入一个对象，有两个属性，一个是text，一个是ok，这是次常用的用法---该用法没有传两个参数方便2017-05-24
            // 如果传日两个参数，第一个是字符串，第二个是函数，则，执行上述做法
            if (typeof options === 'object') {
                this.options = options;
            } else if (typeof options === 'function') {
                this.options = {text: DEF.defaultText, ok: options};
            } else if (typeof options === 'string') {
                this.options = {text: options};
                if(arguments[1]){
                    this.options.ok = arguments[1];
                }
            } else if (typeof options === 'undefined') {
                this.options = {};
            }
            this.init();
        };

        PopupWin._count = 0;
        /**
         * 创建遮罩层，调用时不需要显式使用new关键字
         * @param {Object} options
         */
        PopupWin.create = function () {
            PopupWin._count++;
            return new PopupWin(arguments[0], arguments[1]);
        };
        /**
         * 关闭最上层的弹框
         */
        PopupWin.close = function(){
            var $maxPop = findMaxPop();
            if($maxPop){
                $maxPop.prev().fadeOut(function(){
                    $(this).remove();
                });
                $maxPop.fadeOut(function(){
                    $(this).remove();
                });
            }
        };
        /**
         * 获取当前的层级
         * @returns {number}
         */
        PopupWin.currentIndex = function(){
            var $maxPop = findMaxPop();
            if($maxPop){
                return ($maxPop.css('z-index') - zIndex - 1) / 10;
            }else{
                return 0;
            }
        };
        /**
         * 初始化插件
         */
        PopupWin.prototype.init = function () {
            // 合并默认条件
            this.options = $.extend({}, DEF, this.options);
            zIndex = this.options.zIndex;
            if (!this.options.htmlUrl && this.options.html === DEF.html) {
                this.options.html = this.options.html
                    .replace('><', '>' + this.options.text + '<')
                    .replace('">', ' ' + this.options.textCls + '">');
            }
            /**
             * 将页面所有的按钮都置为失去焦点状态
             */
            $('button, [type="button"], [type="submit"], [type="reset"]').blur();
            this.initContainer();
            this.initPopupwin();

        };
        PopupWin.prototype.initContainer = function () {
            var cls = this.options.cls;
            if (cls === '') {
                cls = 'popup-win-' + PopupWin._count;
            } else {
                /* 查看当前class是否已经存在，若存在，则修改cls */
                var allPopupwins = $('.popupwin');
                for (var i = 0, l = allPopupwins.length; i < l; i++) {
                    if ($(allPopupwins[i]).hasClass('pw-' + cls)) {
                        cls = cls + '-' + PopupWin._count;
                        break;
                    }
                }
            }
            var popHtmlArray = [
                // 遮罩层
                '<div class="popupwin-bg pw-bg-' + cls + '"></div>',
                // 弹出层
                '<div class="popupwin pw-' + cls + '">',
                // 头部
                '<div class="pw-header">',
                // 标题
                '<span class="pw-title">' + this.options.title + '</span>',
                // 关闭
                '<span class="pw-close pw-js-close">&#215;</span>',
                '</div>',
                // 内容
                '<div class="pw-body"></div>'
            ];
            if(this.options.isFooter){
                popHtmlArray = popHtmlArray.concat([
                    // 底部
                    '<div class="pw-footer text-' + this.options.btnPosition + '">',
                    // 取消
                    '<button type="button" class="btn ' + this.options.closeBtnCls + ' pw-btn-close pw-js-close">' + this.options.closeBtnText + '</button>',
                    // 确定
                    '<button type="button" class="btn ' + this.options.okBtnCls + ' pw-btn-ok">' + this.options.okBtnText + '</button>',
                    '</div>'
                ]);
            }
            popHtmlArray = popHtmlArray.concat(['</div>']);
            this.$pop = $(popHtmlArray.join(''));
            this.$bg = $(this.$pop[0]);
            this.$container = $(this.$pop[1]);
            this.$title = this.$container.find('.pw-title');
            this.$close = this.$container.find('.pw-js-close');
            this.$body = this.$container.find('.pw-body');
            this.$okBtn = this.$container.find('.pw-btn-ok');
            this.$closeBtn = this.$container.find('.pw-btn-close');
            if (this.options.isOkOnly) {
                this.$closeBtn.hide();
            } else if (this.options.isCancelOnly) {
                this.$okBtn.hide();
            }
        };

        PopupWin.prototype.initEvent = function () {
            var that = this;
            this.$close.off('click.pw').on('click.pw', $.proxy(this.closeEvent, this));
            this.$okBtn.off('click.pw').on('click.pw', $.proxy(this.okEvent, this));
            if (this.options.isKeyboard) {
                $('body').off('keydown.pw').on('keydown.pw', function (e) {
                    var $maxPop = findMaxPop();
                    if($maxPop){
                        var key = e.which || e.keyCode;
                        if (key === 27) {
                            $maxPop.find('.pw-js-close').click();
                        }
                        // 2017-05-02 空格事件遇到问题
                        // else if (key === 32) {
                        //     // 阻止事件传播，默认行为--浏览器空格键默认会激活选中的按钮
                        //     e.stopPropagation();
                        //     e.preventDefault();
                        //     if (that.options.isOkOnly) {
                        //         $maxPop.find('.pw-btn-ok').click();
                        //     } else if (that.options.isCancelOnly) {
                        //         $maxPop.find('.pw-js-close').click();
                        //     } else {
                        //         $maxPop.find('.pw-btn-ok').click();
                        //     }
                        // }
                    }
                });
            }
        };
        PopupWin.prototype.closeEvent = function () {
            if (this.options.close) {
                this.options.close();
                if(this.options.closeWinAfterClose){
                    this.animate('close');
                }
            }else{
                this.animate('close');
            }
        };
        PopupWin.prototype.okEvent = function () {
            if (this.options.ok) {
                this.options.ok();
                if(this.options.closeWinAfterOk){
                    this.animate('close');
                }
            } else {
                this.$close.click();
            }
        };
        PopupWin.prototype.initPopupwin = function () {
            var that = this;
            if (this.options.htmlUrl) {
                $http({
                    method: 'GET',
                    url: that.options.htmlUrl
                }).success(function (html) {
                    if (that.options.scope) {
                        that.bindBtn(html);
                    }
                    that.initEvent();
                    that.$body.empty().append(html);
                    that.appendToBody();
                    that.show();
                });
            } else {
                if (that.options.scope) {
                    that.bindBtn(that.options.html);
                }
                that.initEvent();
                that.$body.empty().append(that.options.html);
                that.appendToBody();
                that.show();
            }
            this.$okBtn.text(this.options.okBtnText);
            this.$closeBtn.text(this.options.closeBtnText);
            var shown_count = $('.popupwin:visible').length;
            var bgZindex = this.options.zIndex + shown_count * 10;
            var popupwinZindex = this.options.zIndex + shown_count * 10 + 1;
            this.$bg.css('z-index', bgZindex);
            this.$container.css('z-index', popupwinZindex);
        };
        PopupWin.prototype.show = function () {
            this.animate('show');
        };
        PopupWin.prototype.close = function () {
            this.animate('close');
        };
        PopupWin.prototype.animate = function (type) {
            var an = this.options.animation;
            var anTime = this.options.animationTime;
            var that = this;
            if (type === 'close') {
                if (an === 'fade') {
                    this.$bg.fadeOut(600);
                    this.$container.fadeOut(600);
                } else {
                    this.$bg.hide();
                    if (an === 'none') {
                        this.$container.hide();
                    } else {
                        var obj = {top: 0, right: 1, bottom: 2, left: 3};
                        var array = [{top: -1000}, {left: 1800}, {top: 1000}, {left: -1800}, {opacity: 0}, {width: 0}];
                        if (an === 'random') {
                            this.$container.animate(array[Math.floor(Math.random() * 6)], anTime, function () {
                                that.$container.hide();
                            });
                        } else {
                            this.$container.animate(array[obj[an]], anTime, function () {
                                that.$container.hide();
                            });
                        }
                    }
                }
                // 关闭遮罩层时解绑
                $('body').off('keydown.pw');
                setTimeout(function () {
                    that.$pop.remove();
                }, 700);
            } else {
                this.$container.css('min-width', that.options.width);
                this.$container.css('top', $('body').scrollTop() + that.options.top); // 需要计算滚动条的值
                this.$container.fadeIn(anTime);
                this.$bg.fadeIn(anTime);
            }

        };
        /* 初始化按钮为禁用状态 */
        PopupWin.prototype.bindBtn = function (html) {
            // 判断模板中是否存在form表单且form表单中是否存在button
            // 如果存在,则需要将确定按钮的状态按需置为禁用
            var $html = $(html);
            if(!$html.length) return;
            var $form = $html[0].nodeName === 'FORM' ? $html : $html.find('form');
            if ($form.length !== 0 && $form.find('button').length === 0) {
                var formName = $form.attr('name');
                this.$okBtn.attr('ng-disabled', formName + '.$invalid || ' + formName + '.$pristine');
            }
        };
        PopupWin.prototype.appendToBody = function () {
            if (this.options.scope) {
                $('body').append($compile(this.$pop)(this.options.scope));
            } else {
                $('body').append(this.$pop);
            }

        };
        return PopupWin;
    });
});
