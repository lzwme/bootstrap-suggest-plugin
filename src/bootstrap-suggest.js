/**
 * Bootstrap Search Suggest
 * @desc    这是一个基于 bootstrap 按钮式下拉菜单组件的搜索建议插件，必须使用于按钮式下拉菜单组件上。
 * @author  renxia <lzwy0820#qq.com>
 * @github  https://github.com/lzwme/bootstrap-suggest-plugin.git
 * @since   2014-10-09
 *===============================================================================
 * (c) Copyright 2014-2016 http://lzw.me All Rights Reserved.
 ********************************************************************************/
(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object' && typeof module === 'object') {
        factory(require('jquery'));
    } else if (window.jQuery) {
        factory(window.jQuery);
    } else {
        throw new Error('Not found jQuery.');
    }
})(function($) {
    var $window = $(window);

    // 用于对 IE 的兼容判断
    var isIe = !!window.ActiveXObject || 'ActiveXObject' in window;

    // ie 下和 chrome 51 以上浏览器版本，出现滚动条时不计算 padding
    var notNeedCalcPadding;
    var chromeVer = navigator.userAgent.match(/Chrome\/(\d+)/);
    if (chromeVer) {
        chromeVer = Number(chromeVer[1]);
    }
    notNeedCalcPadding = isIe || chromeVer > 51;

    /**
     * 错误处理
     */
    function handleError(e1, e2) {
        if (!window.console || !window.console.trace) {
            return;
        }
        console.trace(e1);
        if (e2) {
            console.trace(e2);
        }
    }
    /**
     * 获取当前 tr 列的关键字数据
     */
    function getPointKeyword($list) {
        return $list.data();
    }
    /**
     * 设置选中的值
     */
    function setValue($input, keywords, options) {
        if (!keywords || !keywords.key) {
            return;
        }

        var separator = options.separator || ',',
            inputValList /*, inputIdList*/ ;

        if (options && options.multiWord) { // 多关键字支持，只设置 val
            inputValList = $input.val().split(separator);
            inputValList[inputValList.length - 1] = keywords.key;
            /*inputIdList = $input.attr('data-id').split(separator);
            inputIdList[inputIdList.length - 1] = id;*/

            $input.val(inputValList.join(separator))
                // .attr('data-id', inputIdList.join(options.separator))
                .focus();
        } else {
            $input.attr('data-id', keywords.id).focus().val(keywords.key);
        }

        $input.trigger('onSetSelectValue', [keywords, (options.data.value || options._lastData.value)[keywords.index]]);
    }
    /**
     * 调整选择菜单位置
     * @param {Object} $input
     * @param {Object} $dropdownMenu
     * @param {Object} options
     */
    function adjustDropMenuPos($input, $dropdownMenu, options) {
        if (!$dropdownMenu.is(':visible')) {
            return;
        }

        if (options.autoDropup) {
            setTimeout(function() {
                var $inputGroup = $dropdownMenu.parents('.input-group');

                if ( // 自动判断菜单向上展开
                    ($window.height() + $window.scrollTop() - $input.offset().top) < $dropdownMenu.height() && // 假如向下会撑长页面
                    $input.offset().top > ($dropdownMenu.height() + $window.scrollTop()) // 而且向上不会撑到顶部
                ) {
                    $inputGroup.addClass('dropup');
                } else {
                    $inputGroup.removeClass('dropup');
                }
            }, 10);
        }

        // 列表对齐方式
        var dmcss = {};
        if (options.listAlign === 'left') {
            dmcss = {
                'left': $input.siblings('div').width() - $input.parent().width(),
                'right': 'auto'
            };
        } else if (options.listAlign === 'right') {
            dmcss = {
                'left': 'auto',
                'right': 0
            };
        }

        // ie 下，不显示按钮时的 top/bottom
        if (isIe && !options.showBtn) {
            if (!$dropdownMenu.parents('.input-group').hasClass('dropup')) {
                dmcss.top = $input.parent().height();
                dmcss.bottom = 'auto';
            } else {
                dmcss.top = 'auto';
                dmcss.bottom = $input.parent().height();
            }
        }

        // 是否自动最小宽度
        if (!options.autoMinWidth) {
            dmcss['min-width'] = $input.parent().width();
        }
        /* else {
            dmcss['width'] = 'auto';
        }*/

        $dropdownMenu.css(dmcss);

        return $input;
    }
    /**
     * 设置输入框背景色
     * 当设置了 indexId，而输入框的 data-id 为空时，输入框加载警告色
     */
    function setBackground($input, options) {
        var inputbg, bg, warnbg;

        if ((options.indexId === -1 && !options.idField) || options.multiWord) {
            return $input;
        }

        inputbg = $input.css('background-color').replace(/ /g, '').split(',', 3).join(',');
        // console.log(inputbg);
        bg = options.inputBgColor || 'rgba(255,255,255,0.1)';
        warnbg = options.inputWarnColor || 'rgba(255,255,0,0.1)';

        if ($input.attr('data-id') || !$input.val()) {
            return $input.css('background', bg);
        }

        // 自由输入的内容，设置背景色
        if (!~warnbg.indexOf(inputbg)) {
            $input.trigger('onUnsetSelectValue') // 触发取消data-id事件
                .css('background', warnbg);
        }

        return $input;
    }
    /**
     * 调整滑动条
     */
    function adjustScroll($input, $dropdownMenu, options) {
        // 控制滑动条
        var $hover = $input.parent().find('tbody tr.' + options.listHoverCSS),
            pos, maxHeight;

        if ($hover.length) {
            pos = ($hover.index() + 3) * $hover.height();
            maxHeight = Number($dropdownMenu.css('max-height').replace('px', ''));

            if (pos > maxHeight || $dropdownMenu.scrollTop() > maxHeight) {
                pos = pos - maxHeight;
            } else {
                pos = 0;
            }

            $dropdownMenu.scrollTop(pos);
        }
    }
    /**
     * 解除所有列表 hover 样式
     */
    function unHoverAll($dropdownMenu, options) {
        $dropdownMenu.find('tr.' + options.listHoverCSS).removeClass(options.listHoverCSS);
    }
    /**
     * 验证 $input 对象是否符合条件
     *   1. 必须为 bootstrap 下拉式菜单
     *   2. 必须未初始化过
     */
    function checkInput($input, $dropdownMenu, options) {
        if (
            !$dropdownMenu.length || // 过滤非 bootstrap 下拉式菜单对象
            $input.data('bsSuggest') // 是否已经初始化的检测
        ) {
            return false;
        }

        $input.data('bsSuggest', {
            options: options
        });

        return true;
    }
    /**
     * 数据格式检测
     * 检测 ajax 返回成功数据或 data 参数数据是否有效
     * data 格式：{"value": [{}, {}...]}
     */
    function checkData(data) {
        var isEmpty = true, o;

        for (o in data) {
            if (o === 'value') {
                isEmpty = false;
                break;
            }
        }
        if (isEmpty) {
            handleError('返回数据格式错误!');
            return false;
        }
        if (!data.value.length) {
            // handleError('返回数据为空!');
            return false;
        }

        return data;
    }
    /**
     * 判断字段名是否在 options.effectiveFields 配置项中
     * @param  {String} field   要判断的字段名
     * @param  {Object} options
     * @return {Boolean}        effectiveFields 为空时始终返回 true
     */
    function inEffectiveFields(field, options) {
        var effectiveFields = options.effectiveFields;

        return !(field === '__index' ||
            effectiveFields.length &&
            !~$.inArray(field, effectiveFields));
    }
    /**
     * 判断字段名是否在 options.searchFields 搜索字段配置中
     */
    function inSearchFields(field, options) {
        return ~$.inArray(field, options.searchFields);
    }
    /**
     * 下拉列表刷新
     * 作为 fnGetData 的 callback 函数调用
     */
    function refreshDropMenu($input, data, options) {
        var $dropdownMenu = $input.parent().find('ul.dropdown-menu'),
            len, i, j, index = 0,
            tds,
            html = ['<table class="table table-condensed table-sm" style="margin:0">'],
            idValue, keyValue; // 作为输入框 data-id 和内容的字段值

        if (!data || !(len = data.value.length)) {
            $dropdownMenu.empty().hide();
            return $input;
        }

        var dataList = data.value;

        // 相同数据，不用继续渲染了
        if (
            options._lastData &&
            JSON.stringify(options._lastData.value) === JSON.stringify(dataList) &&
            $dropdownMenu.find('tr').length === len
        ) {
            $dropdownMenu.show();
            adjustDropMenuPos($input, $dropdownMenu, options);
            return $input;
        }
        options._lastData = data;

        // 生成表头
        if (options.showHeader) {
            html.push('<thead><tr>');
            for (j in dataList[0]) {
                if (!inEffectiveFields(j, options)) {
                    continue;
                }

                html.push('<th>', (options.effectiveFieldsAlias[j] || j),
                    index === 0 ? ('(' + len + ')') : '' , // 表头第一列记录总数
                    '</th>');

                index++;
            }
            html.push('</tr></thead>');
        }
        html.push('<tbody>');

        // console.log(data, len);
        // 按列加数据
        var dataI;
        for (i = 0; i < len; i++) {
            index = 0;
            tds = [];
            dataI = dataList[i];
            idValue = dataI[options.idField] || '';
            keyValue = dataI[options.keyField] || '';

            for (j in dataI) {
                // 标记作为 value 和 作为 id 的值
                if (!keyValue && options.indexKey === index) {
                    keyValue = dataI[j];
                }
                if (!idValue && options.indexId === index) {
                    idValue = dataI[j];
                }

                index++;

                // 过滤无效字段
                if (!inEffectiveFields(j, options)) {
                    continue;
                }

                tds.push('<td data-name="', j, '">', dataI[j], '</td>');
            }

            html.push('<tr data-index="', (dataI.__index || i), '" data-id="', idValue,
                '" data-key="', keyValue, '">', tds.join(''), '</tr>');
        }
        html.push('</tbody></table>');

        $dropdownMenu.html(html.join('')).show();

        // scrollbar 存在时，延时到动画结束时调整 padding
        setTimeout(function() {
            if (notNeedCalcPadding) {
                return;
            }

            var $table = $dropdownMenu.find('table:eq(0)'),
                pdr = 0,
                mgb = 0;

            if (
                $dropdownMenu.height() < $table.height() &&
                Number($dropdownMenu.css('min-width').replace('px', '')) < $dropdownMenu.width()
            ) {
                pdr = 18;
                mgb = 20;
            }

            $dropdownMenu.css('padding-right', pdr);
            $table.css('margin-bottom', mgb);
        }, 301);

        adjustDropMenuPos($input, $dropdownMenu, options);

        return $input;
    }
    /**
     * ajax 获取数据
     * @param  {Object} options
     * @return {Object}         $.Deferred
     */
    function ajax(options, keyword) {
        keyword = keyword || '';

        var ajaxParam = {
            type: 'GET',
            dataType: options.jsonp ? 'jsonp' : 'json',
            timeout: 5000
        };

        // jsonp
        if (options.jsonp) {
            ajaxParam.jsonp = options.jsonp;
        }

        // 自定义 ajax 请求参数生成方法
        if ($.isFunction(options.fnAdjustAjaxParam)) {
            ajaxParam = $.extend(ajaxParam, options.fnAdjustAjaxParam(keyword, options));
        }

        // url 调整
        ajaxParam.url = function() {
            if (! keyword || ajaxParam.data) {
                return ajaxParam.url || options.url;
            }

            var type = '?';
            if (/=$/.test(options.url)) {
                type = '';
            } else if (/\?/.test(options.url)) {
                type = '&';
            }

            return options.url + type + keyword;
        }();

        return $.ajax(ajaxParam).done(function(result) {
            options.data = options.fnProcessData(result);
        }).fail(handleError);
    }
    /**
     * 检测 keyword 与 value 是否存在互相包含
     * @param  {String}  keyword 用户输入的关键字
     * @param  {String}  key     匹配字段的 key
     * @param  {String}  value   key 字段对应的值
     * @param  {Object}  options
     * @return {Boolean}         包含/不包含
     */
    function isInWord(keyword, key, value, options) {
        value = $.trim(value);

        if (options.ignorecase) {
            keyword = keyword.toLocaleLowerCase();
            value = value.toLocaleLowerCase();
        }

        return value &&
            (inEffectiveFields(key, options) || inSearchFields(key, options)) && // 必须在有效的搜索字段中
            (
                ~value.indexOf(keyword) || // 匹配值包含关键字
                options.twoWayMatch && ~keyword.indexOf(value) // 关键字包含匹配值
            );
    }
    /**
     * 通过 ajax 或 json 参数获取数据
     */
    function getData(keyword, $input, callback, options) {
        var data, validData, filterData = {
                value: []
            },
            i, key, len;

        keyword = keyword || '';
        // 获取数据前对关键字预处理方法
        if ($.isFunction(options.fnPreprocessKeyword)) {
            keyword = options.fnPreprocessKeyword(keyword, options);
        }

        // 给了url参数，则从服务器 ajax 请求
        // console.log(options.url + keyword);
        if (options.url) {
            ajax(options, keyword).done(function(result) {
                callback($input, options.data, options); // 为 refreshDropMenu
                $input.trigger('onDataRequestSuccess', result);
                if (options.getDataMethod === 'firstByUrl') {
                    options.url = null;
                }
            });
        } else {
            // 没有给出 url 参数，则从 data 参数获取
            data = options.data;
            validData = checkData(data);
            // 本地的 data 数据，则在本地过滤
            if (validData) {
                if (!keyword) {
                    filterData = data;
                } else {
                    // 输入不为空时则进行匹配
                    len = data.value.length;
                    for (i = 0; i < len; i++) {
                        for (key in data.value[i]) {
                            if (
                                data.value[i][key] &&
                                isInWord(keyword, key, data.value[i][key] + '', options)
                            ) {
                                filterData.value.push(data.value[i]);
                                filterData.value[filterData.value.length - 1].__index = i;
                                break;
                            }
                        }
                    }
                }
            }

            callback($input, filterData, options);
        } // else
    }
    /**
     * 数据处理
     * url 获取数据时，对数据的处理，作为 fnGetData 之后的回调处理
     */
    function processData(data) {
        return checkData(data);
    }
    /**
     * 取得 clearable 清除按钮
     */
    function getIClear($input, options) {
        var $iClear = $input.prev('i.clearable');

        // 是否可清除已输入的内容(添加清除按钮)
        if (options.clearable && !$iClear.length) {
                $iClear = $('<i class="clearable glyphicon glyphicon-remove"></i>')
                    .prependTo($input.parent());
        }

        return $iClear.css({
            position: 'absolute',
            top: 12,
            right: options.showBtn ? ($input.next('.input-group-btn').width() || 33) + 2 : 12,
            zIndex: 4,
            cursor: 'pointer',
            fontSize: 12
        }).hide();
    }
    /**
     * 默认的配置选项
     * @type {Object}
     */
    var defaultOptions = {
        url: null,                      // 请求数据的 URL 地址
        jsonp: null,                    // 设置此参数名，将开启jsonp功能，否则使用json数据结构
        data: {
            value: []
        },                              // 提示所用的数据，注意格式
        indexId: 0,                     // 每组数据的第几个数据，作为input输入框的 data-id，设为 -1 且 idField 为空则不设置此值
        indexKey: 0,                    // 每组数据的第几个数据，作为input输入框的内容
        idField: '',                    // 每组数据的哪个字段作为 data-id，优先级高于 indexId 设置（推荐）
        keyField: '',                   // 每组数据的哪个字段作为输入框内容，优先级高于 indexKey 设置（推荐）

        /* 搜索相关 */
        autoSelect: true,               // 键盘向上/下方向键时，是否自动选择值
        allowNoKeyword: true,           // 是否允许无关键字时请求数据
        getDataMethod: 'firstByUrl',    // 获取数据的方式，url：一直从url请求；data：从 options.data 获取；firstByUrl：第一次从Url获取全部数据，之后从options.data获取
        delayUntilKeyup: false,         // 获取数据的方式 为 firstByUrl 时，是否延迟到有输入时才请求数据
        ignorecase: false,              // 前端搜索匹配时，是否忽略大小写
        effectiveFields: [],            // 有效显示于列表中的字段，非有效字段都会过滤，默认全部有效。
        effectiveFieldsAlias: {},       // 有效字段的别名对象，用于 header 的显示
        searchFields: [],               // 有效搜索字段，从前端搜索过滤数据时使用，但不一定显示在列表中。effectiveFields 配置字段也会用于搜索过滤
        twoWayMatch: true,              // 是否双向匹配搜索。为 true 即输入关键字包含或包含于匹配字段均认为匹配成功，为 false 则输入关键字包含于匹配字段认为匹配成功
        multiWord: false,               // 以分隔符号分割的多关键字支持
        separator: ',',                 // 多关键字支持时的分隔符，默认为半角逗号

        /* UI */
        autoDropup: false,              // 选择菜单是否自动判断向上展开。设为 true，则当下拉菜单高度超过窗体，且向上方向不会被窗体覆盖，则选择菜单向上弹出
        autoMinWidth: false,            // 是否自动最小宽度，设为 false 则最小宽度不小于输入框宽度
        showHeader: false,              // 是否显示选择列表的 header。为 true 时，有效字段大于一列则显示表头
        showBtn: true,                  // 是否显示下拉按钮
        inputBgColor: '',               // 输入框背景色，当与容器背景色不同时，可能需要该项的配置
        inputWarnColor: 'rgba(255,0,0,.1)', // 输入框内容不是下拉列表选择时的警告色
        listStyle: {
            'padding-top': 0,
            'max-height': '375px',
            'max-width': '800px',
            'overflow': 'auto',
            'width': 'auto',
            'transition': '0.3s',
            '-webkit-transition': '0.3s',
            '-moz-transition': '0.3s',
            '-o-transition': '0.3s'
        },                              // 列表的样式控制
        listAlign: 'left',              // 提示列表对齐位置，left/right/auto
        listHoverStyle: 'background: #07d; color:#fff', // 提示框列表鼠标悬浮的样式
        listHoverCSS: 'jhover',         // 提示框列表鼠标悬浮的样式名称
        clearable: false,               // 是否可清除已输入的内容

        /* key */
        keyLeft: 37,                    // 向左方向键，不同的操作系统可能会有差别，则自行定义
        keyUp: 38,                      // 向上方向键
        keyRight: 39,                   // 向右方向键
        keyDown: 40,                    // 向下方向键
        keyEnter: 13,                   // 回车键

        /* methods */
        fnProcessData: processData,     // 格式化数据的方法，返回数据格式参考 data 参数
        fnGetData: getData,             // 获取数据的方法，无特殊需求一般不作设置
        fnAdjustAjaxParam: null,        // 调整 ajax 请求参数方法，用于更多的请求配置需求。如对请求关键字作进一步处理、修改超时时间等
        fnPreprocessKeyword: null       // 搜索过滤数据前，对输入关键字作进一步处理方法。注意，应返回字符串
    };

    var methods = {
        init: function(options) {
            // 参数设置
            var self = this;
            options = options || {};

            // 默认配置有效显示字段多于一个，则显示列表表头，否则不显示
            if (undefined === options.showHeader && options.effectiveFields && options.effectiveFields.length > 1) {
                options.showHeader = true;
            }

            options = $.extend(true, {}, defaultOptions, options);

            // 旧的方法兼容
            if (options.processData) {
                options.fnProcessData = options.processData;
            }

            if (options.getData) {
                options.fnGetData = options.getData;
            }

            if (options.getDataMethod === 'firstByUrl' && options.url && !options.delayUntilKeyup) {
                ajax(options).done(function(result) {
                    options.url = null;
                    self.trigger('onDataRequestSuccess', result);
                });
            }

            // 鼠标滑动到条目样式
            if (!$('#bsSuggest').length) {
                $('head:eq(0)').append('<style id="bsSuggest">.' + options.listHoverCSS + '{' + options.listHoverStyle + '}</style>');
            }

            return self.each(function() {
                var $input = $(this),
                    $iClear = getIClear($input, options),
                    mouseenterDropdownMenu,
                    keyupTimer, // keyup 与 input 事件延时定时器
                    $dropdownMenu = $input.parents('.input-group').find('ul.dropdown-menu:eq(0)');

                // 验证输入框对象是否符合条件
                if (!checkInput($input, $dropdownMenu, options)) {
                    console.warn('不是一个标准的 bootstrap 下拉式菜单或已初始化:', $input);
                    return;
                }

                // 是否显示 button 按钮
                if (!options.showBtn) {
                    $input.css('border-radius', '4px')
                        .parents('.input-group:eq(0)').css('width', '100%')
                        .find('.btn:eq(0)').hide();
                }

                // 移除 disabled 类，并禁用自动完成
                $input.removeClass('disabled').prop('disabled', false).attr('autocomplete', 'off');
                // dropdown-menu 增加修饰
                $dropdownMenu.css(options.listStyle);

                // 默认背景色
                if (!options.inputBgColor) {
                    options.inputBgColor = $input.css('background-color');
                }

                // 开始事件处理
                $input.on('keydown', function(event) {
                    var currentList, tipsKeyword; // 提示列表上被选中的关键字

                    // $input.attr('data-id', '');

                    // 当提示层显示时才对键盘事件处理
                    if (!$dropdownMenu.is(':visible')) {
                        return;
                    }

                    currentList = $dropdownMenu.find('.' + options.listHoverCSS);
                    tipsKeyword = ''; // 提示列表上被选中的关键字

                    unHoverAll($dropdownMenu, options);

                    if (event.keyCode === options.keyDown) { // 如果按的是向下方向键
                        if (!currentList.length) {
                            // 如果提示列表没有一个被选中,则将列表第一个选中
                            tipsKeyword = getPointKeyword($dropdownMenu.find('tbody tr:first').mouseover());
                        } else if (!currentList.next().length) {
                            // 如果是最后一个被选中,则取消选中,即可认为是输入框被选中，并恢复输入的值
                            if (options.autoSelect) {
                                $input.val($input.attr('alt')).attr('data-id', '');
                            }
                        } else {
                            // 选中下一行
                            tipsKeyword = getPointKeyword(currentList.next().mouseover());
                        }
                        // 控制滑动条
                        adjustScroll($input, $dropdownMenu, options);

                        if (!options.autoSelect) {
                            return;
                        }
                    } else if (event.keyCode === options.keyUp) { // 如果按的是向上方向键
                        if (!currentList.length) {
                            tipsKeyword = getPointKeyword($dropdownMenu.find('tbody tr:last').mouseover());
                        } else if (!currentList.prev().length) {
                            if (options.autoSelect) {
                                $input.val($input.attr('alt')).attr('data-id', '');
                            }
                        } else {
                            // 选中前一行
                            tipsKeyword = getPointKeyword(currentList.prev().mouseover());
                        }

                        // 控制滑动条
                        adjustScroll($input, $dropdownMenu, options);

                        if (!options.autoSelect) {
                            return;
                        }
                    } else if (event.keyCode === options.keyEnter) {
                        tipsKeyword = getPointKeyword(currentList);
                        $dropdownMenu.hide().empty();
                    } else {
                        $input.attr('data-id', '');
                    }

                    // 设置值 tipsKeyword
                    // console.log(tipsKeyword);
                    setValue($input, tipsKeyword, options);
                }).on('keyup input', function(event) {
                    var word;

                    // 如果弹起的键是回车、向上或向下方向键则返回
                    if (~$.inArray(event.keyCode, [options.keyDown, options.keyUp, options.keyEnter])) {
                        $input.val($input.val()); // 让鼠标输入跳到最后
                        setBackground($input, options);
                        return;
                    }

                    if (event.keyCode) {
                        // $input.attr('data-id', '');
                        setBackground($input, options);
                    }

                    clearTimeout(keyupTimer);
                    keyupTimer = setTimeout(function() {
                        // console.log('input keyup', event);

                        word = $input.val();

                        // 若输入框值没有改变则返回
                        if ($.trim(word) && word === $input.attr('alt')) {
                            return;
                        }

                        // 当按下键之前记录输入框值,以方便查看键弹起时值有没有变
                        $input.attr('alt', word);

                        if (options.multiWord) {
                            word = word.split(options.separator).reverse()[0];
                        }

                        // 是否允许空数据查询
                        if (!word.length && !options.allowNoKeyword) {
                            return;
                        }

                        options.fnGetData($.trim(word), $input, refreshDropMenu, options);
                    }, 300);
                }).on('focus', function() {
                    // console.log('input focus');
                    adjustDropMenuPos($input, $dropdownMenu, options);
                }).on('blur', function() {
                    if (!mouseenterDropdownMenu) { // 不是进入下拉列表状态，则隐藏列表
                        $dropdownMenu.css('display', '');
                    }
                }).on('click', function() {
                    // console.log('input click');
                    var word = $input.val();

                    if (
                        $.trim(word) &&
                        word === $input.attr('alt') &&
                        $dropdownMenu.find('table tr').length
                    ) {
                        return $dropdownMenu.show();
                    }

                    // if ($dropdownMenu.css('display') !== 'none') {
                    if ($dropdownMenu.is(':visible')) {
                        return;
                    }

                    if (options.multiWord) {
                        word = word.split(options.separator).reverse()[0];
                    }

                    // 是否允许空数据查询
                    if (!word.length && !options.allowNoKeyword) {
                        return;
                    }

                    // console.log('word', word);
                    options.fnGetData($.trim(word), $input, refreshDropMenu, options);
                });

                // 下拉按钮点击时
                $input.parent().find('.btn:eq(0)').attr('data-toggle', '').click(function() {
                    var display = 'none';

                    // if ($dropdownMenu.is(':visible')) {
                    if ($dropdownMenu.css('display') === display) {
                        display = 'block';
                        if (options.url) {
                            $input.click().focus();
                            if (!$dropdownMenu.find('tr').length) {
                                display = 'none';
                            }
                        } else {
                            // 不以 keyword 作为过滤，展示所有的数据
                            refreshDropMenu($input, options.data, options);
                        }
                    }

                    $dropdownMenu.css('display', display);
                    return false;
                });

                // 列表中滑动时，输入框失去焦点
                $dropdownMenu.mouseenter(function() {
                        // console.log('mouseenter')
                        mouseenterDropdownMenu = 1;
                        $input.blur();
                    }).mouseleave(function() {
                        // console.log('mouseleave')
                        mouseenterDropdownMenu = 0;
                        $input.focus();
                    }).on('mouseenter', 'tbody tr', function() {
                        // 行上的移动事件
                        unHoverAll($dropdownMenu, options);
                        $(this).addClass(options.listHoverCSS);

                        return false; // 阻止冒泡
                    })
                    .on('mousedown', 'tbody tr', function() {
                        setValue($input, getPointKeyword($(this)), options);
                        setBackground($input, options);
                        $dropdownMenu.hide();
                    });

                // 存在清空按钮
                if ($iClear.length) {
                    $iClear.click(function () {
                        $input.val('').attr('data-id', '');
                        setBackground($input, options);
                    });

                    $input.parent().mouseenter(function() {
                        if (!$input.prop('disabled')) {
                            $iClear.show();
                        }
                    }).mouseleave(function() {
                        $iClear.hide();
                    });
                }

            });
        },
        show: function() {
            return this.each(function() {
                $(this).click();
            });
        },
        hide: function() {
            return this.each(function() {
                $(this).parent().find('ul.dropdown-menu').css('display', '');
            });
        },
        disable: function() {
            return this.each(function() {
                $(this).attr('disabled', true)
                    .parent().find('.btn:eq(0)').prop('disabled', true);
            });
        },
        enable: function() {
            return this.each(function() {
                $(this).attr('disabled', false)
                    .parent().find('.btn:eq(0)').prop('disabled', false);
            });
        },
        destroy: function() {
            return this.each(function() {
                $(this).off().removeData('bsSuggest').removeAttr('style')
                    .parent().find('.btn:eq(0)').off().show().attr('data-toggle', 'dropdown').prop('disabled', false) // .addClass('disabled');
                    .next().css('display', '').off();
            });
        },
        version: function() {
            return '0.1.17';
        }
    };

    $.fn.bsSuggest = function(options) {
        // 方法判断
        if (typeof options === 'string' && methods[options]) {
            var inited = true;
            this.each(function() {
                if (!$(this).data('bsSuggest')) {
                    return inited = false;
                }
            });
            // 只要有一个未初始化，则全部都不执行方法，除非是 init 或 version
            if (!inited && 'init' !== options && 'version' !== options) {
                return this;
            }

            // 如果是方法，则参数第一个为函数名，从第二个开始为函数参数
            return methods[options].apply(this, [].slice.call(arguments, 1));
        } else {
            // 调用初始化方法
            return methods.init.apply(this, arguments);
        }
    }
});
