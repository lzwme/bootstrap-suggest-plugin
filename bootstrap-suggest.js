/**
 * Bootstrap Search Suggest - v0.0.1
 * Description: 这是一个基于 bootstrap 按钮式下拉菜单组件的搜索建议插件，必须使用于按钮式下拉菜单组件上。
 * Author: lizhiwen#meizu.com
 * Date  : 2014-10-09
 * Update: 2014-10-20
 *===============================================================================
 * 一、功能说明：
 * 1. 搜索方式：从 data.value 的所有字段数据中查询 keyword 的出现，或字段数据包含于 keyword 中
 * 2. 支持单关键字、多关键字的输入搜索建议，多关键字可自定义分隔符
 * 3. 支持按 data 数据搜索、按  URL 请求搜索和按首次请求URL数据并缓存搜索三种方式【getDataMethod】
 * 4. 单关键字会设置输入框内容和 data-id 两个值，以 indexId 和 indexKey 取值 data 数据的次序为准；多关键字不支持 data-id 设置
 * 5. 对于单关键字支持，当 data-id 为空时，输入框会添加背景色警告
 * 
 * 二、使用参考：
 * 1. 引入 jQuery、bootstrap.min.css、bootstrap.min.js
 * 2. 引入插件js:bootstrap-suggest.min.js
 * 3. 初始化插件
 *		var bsSuggest = $("input#test").bsSuggest({
 *			url: "/rest/sys/getuserlist?keyword="
 *		});
 * 4. 方法参考：
 *  禁用提示：$("input#test").bsSuggest("disable");
 *  启用提示：$("input#test").bsSuggest("enable");
 *  销毁插件：$("input#test").bsSuggest("destroy");
 *
 *=============================================================================== 
 * (c) Copyright 2014 lizhiwen. All Rights Reserved.
 ********************************************************************************/
(function ($) {
	/* 搜索建议插件 */
	$.fn.bsSuggest = function(opts) {
		//方法判断
		if (typeof opts === 'string' && methods[opts] ) {
			//如果是方法，则参数第一个为函数名，从第二个开始为函数参数
			return methods[opts].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}else if(typeof opts === 'object' || !opts){
			//调用初始化方法
			return methods.init.apply(this, arguments);
		}
	};

	var methods = {
		init: function(opts){
			//参数设置
			var self = this,
			options = $.extend({
				url: null,
				jsonp: null, //设置此参数名，将开启jsonp功能，否则使用json数据结构
				data: {},
				getDataMethod: "firstByUrl", //获取数据的方式，url：一直从url请求；data：从 options.data 获取；firstByUrl：第一次从Url获取全部数据
				indexId: 0,	//data.value 的第几个数据，作为input输入框的 data-id，设为 -1 则不设置此值
				indexKey: 0, //data.value 的第几个数据，作为input输入框的内容
				effectiveFields: null, //data 中有效的字段，非有效字段都会过滤，默认全部，对自定义getData方法无效  TODO
				allowNoKeyword: true, //是否允许无关键字时请求数据
				multiWord: false, //以分隔符号分割的多关键字支持
				separator: " ", //多关键字支持时的分隔符，默认为空格
				processData: processData, //格式化数据的方法
				getData: getData, //获取数据的方法
				autoMinWidth: false, //是否自动最小宽度，设为 false 则最小宽度与下拉式菜单等齐
				inputWarnColor: "rgba(255,0,0,.1)", //输入框内容不是下拉列表选择时的警告色
				listStyle: {"max-height": "375px", "max-width": "800px", "overflow": "auto"}, //列表的样式控制
				listHoverStyle: 'background: #07d; color:#fff', //提示框列表鼠标悬浮的样式
				listHoverCSS: "jhover", //提示框列表鼠标悬浮的样式名称
				keyLeft: 37,	//向左方向键
				keyUp: 38,		//向上方向键
				keyRight: 39,	//向右方向键
				keyDown: 40,	//向下方向键
				keyEnter: 13	//回车键
			}, opts);

			//参数处理
			if ($.isFunction(options.processData)) {
				processData = options.processData;
			}
			if ($.isFunction(options.getData)) {
				getData = options.getData;
			}
			if (options.getDataMethod === "firstByUrl" && options.url) {
				var hyphen = opts.url.indexOf('?') !== -1 ? '&' : "?", //简单判断，如果url已经存在？，则jsonp的连接符应该为&
					URL = opts.jsonp ? [opts.url, hyphen, opts.jsonp, '=?'].join('') : opts.url; //开启jsonp，则修订url，不可以用param传递，？会被编码为%3F
				
				$.ajax({
					type: 'GET',
					url: URL,
					dataType: 'json',
					timeout: 5000
				}).done(function(result) {
					options.data = result;
					options.url = null;
				}).fail(function (err) {
					throw new Error(err);
				});
			}
			
			//鼠标滑动到条目样式
			$("head:eq(0)").append('<style>.' + options.listHoverCSS + '{' + options.listHoverStyle + '}</style>');

			return self.each(function(){
				var $input = $(this),
					$dropdownMenu = $input.parent(".input-group").find("ul.dropdown-menu");
				//验证输入框对象是否符合条件
				if(checkInput(this) === false){
					return;
				}

				//移除 disabled 类，并禁用自动完成
				$input.removeClass("disabled").attr("autocomplete", "off");
				//dropdown-menu 增加修饰
				$dropdownMenu.css(options.listStyle || {
					"max-height": "300px", "max-width": "800px", "overflow": "auto"
				});
				
				//是否自动最小宽度
				if(options.autoMinWidth === false) {
					$dropdownMenu.css("min-width", $("#test").parent().width());
				}

				//开始事件处理
				$input.on("keydown", function (event) {
					var currentList, tipsKeyword = '';//提示列表上被选中的关键字
					
					//$(this).attr("data-id", "");
					
					if ($dropdownMenu.css('display') !== 'none') { //当提示层显示时才对键盘事件处理
						currentList = $dropdownMenu.find('.' + options.listHoverCSS);
						tipsKeyword = '';//提示列表上被选中的关键字
						
						if (event.keyCode === options.keyDown) { //如果按的是向下方向键
							if (currentList.length === 0) {
								//如果提示列表没有一个被选中,则将列表第一个选中 
								tipsKeyword = getPointKeyword($dropdownMenu.find('table tbody tr:first').mouseover());
							} else if (currentList.next().length === 0) {
								//如果是最后一个被选中,则取消选中,即可认为是输入框被选中，并恢复输入的值
								unHoverAll($dropdownMenu,options);
								$(this).val($(this).attr('alt')).attr("data-id", "");
							} else {
								unHoverAll($dropdownMenu,options);
								//将原先选中列的下一列选中 
								if (currentList.next().length !== 0) {
									tipsKeyword = getPointKeyword(currentList.next().mouseover());
								}
							}
							//控制滑动条
							adjustScroll($input, $dropdownMenu);
							
						} else if (event.keyCode === options.keyUp) { //如果按的是向上方向键 
							if (currentList.length === 0) {
								tipsKeyword = getPointKeyword($dropdownMenu.find('table tbody tr:last').mouseover());
							} else if (currentList.prev().length === 0) {
								unHoverAll($dropdownMenu, options);
								$(this).val($(this).attr('alt')).attr("data-id", "");
							} else {
								unHoverAll($dropdownMenu, options);
								if (currentList.prev().length !== 0) {
									tipsKeyword = getPointKeyword(currentList.prev().mouseover());
								}
							}
							
							//控制滑动条
							adjustScroll($input, $dropdownMenu);
						} else if (event.keyCode === options.keyEnter) {
							$dropdownMenu.hide().empty();
						} else {
							$(this).attr("data-id", "");
						}
						
						//支持空格为分割的多个提示
						//console.log(tipsKeyword);
						if (tipsKeyword && tipsKeyword.key !== ''){
							setValue($(this), tipsKeyword, opts);
						}
						
						setBackground ($input, options);
					}

				}).on("keyup", function () {
					var word, words;

					//如果弹起的键是回车、向上或向下方向键则返回 
					if (event.keyCode === options.keyDown || event.keyCode === options.keyUp || event.keyCode === options.keyEnter) {
						$(this).val($(this).val());//让鼠标输入跳到最后
						return;
					}
					
					word = $(this).val();
					
					//若输入框值没有改变或变为空则返回
					if ($.trim(word) !== '' && word === $(this).attr('alt')) {
						return;
					}
					
					//当按下键之前记录输入框值,以方便查看键弹起时值有没有变 
					$(this).attr('alt', $(this).val());
					
					if (opts.multiWord) {
						words = word.split( options.separator || ' ');
						word = words[words.length-1];
					}
					//是否允许空数据查询
					if (word.length === 0 && options.allowNoKeyword !== true) {
						return;
					}

					getData($.trim(word), $input, refreshDropMenu, options);
				}).on("focus", function () {
					//console.log("input focus");
					//$dropdownMenu.show();
				}).on("blur", function () {
					$dropdownMenu.css("display", "");
				}).on("click", function () {
					var word = $(this).val(), words;

					//console.log(word);
					if (
						$.trim(word) !== '' && word === $(this).attr('alt') ||
						$dropdownMenu.css('display') !== 'none'
					) {
						return;
					}

					if (options.multiWord) {
						words = word.split( options.separator || ' ');
						word = words[words.length-1];
					}
					
					//是否允许空数据查询
					if (word.length === 0 && options.allowNoKeyword !== true) {
						return;
					}
					
					getData($.trim(word), $input, refreshDropMenu, options);
				});
				
				//下拉按钮点击时
				$(this).parent().find("button:eq(0)").on("click", function(){
					self.click().focus();
				});
			});
			/**
			 * 设置输入框背景色
			 * 当设置了 indexId，而输入框的 data-id 为空时，输入框加载警告色
			 */
			function setBackground ($input, opts) {
				if ($input.val() === "" || opts.indexId === -1 || opts.multiWord || $input.attr("data-id") !== "") {
					return $input.css("background", "rgba(255,255,255,.1)");
				}
				return $input.css("background", opts.inputWarnColor || "rgba(255,255,0,.1)");
			}
			/**
			 * 调整滑动条
			 */
			function adjustScroll($input, $dropdownMenu) {
				//控制滑动条
				var $hover = $input.parent().find("tbody tr." + options.listHoverCSS), pos, maxHeight;
				if ($hover.length > 0) {
					pos = ($hover.index() + 3) * $hover.height();
					maxHeight = Number($dropdownMenu.css("max-height").replace("px", ""));
					
					if (pos > maxHeight || $dropdownMenu.scrollTop() > maxHeight) {
						$dropdownMenu.scrollTop(pos - maxHeight);
					} else {
						$dropdownMenu.scrollTop(0);
					}
				}
			}
			/**
			 * 解除所有列表 hover 样式
			 */
			function unHoverAll(ddiv,opts){
				ddiv = ddiv || $dropdownMenu;
				opts = opts || options;

				ddiv.find('tr.' + opts.listHoverCSS).removeClass(opts.listHoverCSS);
			}
			/**
			* 验证对象是否符合条件
			*   1. 必须为 bootstrap 下拉式菜单 
			*   2. 必须未初始化过
			*/
			function checkInput(target){
				var $input = $(target),
					$dropdownMenu = $input.parent(".input-group").find("ul.dropdown-menu"),
					data = $input.data('bsSuggest');
				
				//过滤非 bootstrap 下拉式菜单对象
				if ($dropdownMenu.length === 0) {
					return false;
				}

				//是否已经初始化的检测
				if(data){
					return false;
				}

				$input.data('bsSuggest',{target: target, options: options});
				return true;
			}
			
			/**
			 * 通过 ajax 或 json 参数获取数据
			 */
			function getData(keyword, $input, callback, opts) {
				var data, validData, filterData = {value:[]}, i, obj, hyphen, URL, len;
				
				keyword = keyword || "";
				opts = opts || options;

				/**给了url参数，则从服务器 ajax 请求帮助的 json **/
				//console.log(opts.url + keyword);
				if (opts.url) {
					hyphen = opts.url.indexOf('?') !== -1 ? '&' : "?"; //简单判断，如果url已经存在？，则jsonp的连接符应该为&
					URL = opts.jsonp ? [opts.url + keyword, hyphen, opts.jsonp, '=?'].join('') : opts.url + keyword; //开启jsonp，则修订url，不可以用param传递，？会被编码为%3F
					$.ajax({
						type: 'GET',
						/*data: "word=" + word,*/
						url: URL,
						dataType: 'json',
						timeout: 3000
					}).done(function(result) {
						callback($input, result, opts); //为 refreshDropMenu
					}).fail(handleError);
				} else {
					/**没有给出url 参数，则从 data 参数获取或自行构造data帮助内容 **/
					data = opts.data;
					validData = checkData(data);
					//本地的 data 数据，则在本地过滤
					if (validData) { //输入不为空时则进行匹配
						len = data.value.length;
						for (i = 0; i < len; i++) {
							for (obj in data.value[i]) {
								if (
									$.trim(data.value[i][obj]) &&
									inEffectiveFields(obj) === true &&
									(data.value[i][obj].toString().indexOf(keyword) !== -1 || keyword.indexOf(data.value[i][obj]) !== -1)
								){
									filterData.value.push(data.value[i]);
									break;
								}
							}
						}
						//console.log(filterData);
					}
					callback($input, filterData, opts);
				}//else
			}
			/**
			 * 数据处理
			 * url 获取数据时，对数据的处理，作为 getData 之后的回调处理 
			 */
			function processData(data){
				return validData = checkData(data);
			}
			/**
			 * 数据格式检测
			 * 检测 ajax 返回成功数据或 data 参数数据是否有效
			 * data 格式：{"value": [{}, {}...]}
			 */
			function checkData(data) {
				var isEmpty = true;
				for (var o in data) {
					if (o === 'value') {
						isEmpty = false;
						break;
					}
				}
				if (isEmpty) {
					handleError("返回数据格式错误!");
					return false;
				}
				if (data.value.length === 0) {
					handleError("返回数据为空!");
					return false;
				}

				return data;
			}
				
			/**
			 * 判断字段名是否在 effectiveFields 配置项中
			 * effectiveFields 为空时始终返回 TRUE
			 */
			function inEffectiveFields(filed) {
				if(
					$.isArray(opts.effectiveFields) &&
					opts.effectiveFields.length > 0 &&
					$.inArray(filed, opts.effectiveFields) === -1
				) {
					return false;
				}
				return true;
			}
			/**
			 * 下拉列表刷新
			 * 作为 getData 的 callback 函数调用
			 */
			function refreshDropMenu($input, data, opts) {
				var $dropdownMenu = $input.parent().find("ul.dropdown-menu"),
				len, i, j, index = 0,
				html = '<table class="table table-condensed">',
				thead = "<thead><tr>", tr,
				indexIdValue, indexKeyValue;
				
				opts = opts || options;
				data = processData(data);
				if (data === false || (len = data.value.length) === 0) {
					return $dropdownMenu.empty().hide();
					//return false;
				}
				
				//生成表头
				for (j in data.value[0]) {
					if (inEffectiveFields(j) === false) {
						continue;
					}
					
					if ( index === 0 ) {
						//表头第一列记录总数
						thead += '<th>' + j + "(" + len + ")" + '</th>';
					} else {
						thead += '<th>' + j + '</th>';
					}
					
					index++;
				}
				thead += "</tr></thead>";
				if (index < 2) {//只有一条数据时，不需要表头了
					thead = "";
				}
				html += thead + "<tbody>";
				
				//console.log(data, len);
				//按列加数据
				for (i = 0; i < len; i++) {
					index = 0;
					tr = ""; 
					indexIdValue = "";
					indexKeyValue = "";
					
					for (j in data.value[i]) {
						//标记作为 value 和 作为 id 的值
						if (opts.indexKey === index) {
							indexKeyValue = data.value[i][j];
						}
						if (opts.indexId === index) {
							indexIdValue = data.value[i][j];
						}
						
						index++;
						
						//过滤无效字段
						if (inEffectiveFields(j) === false) {
							continue;
						}
						
						tr +='<td data-name="' + j + '">' + data.value[i][j] + '</td>';
					}
					
					tr = '<tr data-index="' + i + '" data-indexid="' + indexIdValue +
						'" data-indexkey="' + indexKeyValue +'">' + tr + '</tr>';
					
					
					html += tr;
				}
				html += '</tbody></table>';
				
				$dropdownMenu.html(html).show();
				listEventBind($input, $dropdownMenu, opts);
				//scrollbar 存在时，调整 padding
				if (
					$dropdownMenu.css("max-height") &&
					$dropdownMenu.css("max-height") === $dropdownMenu.css("height") &&
					$dropdownMenu.css("min-width") &&
					$dropdownMenu.css("min-width") !== $dropdownMenu.css("width")
				) {
					$dropdownMenu.css("padding-right", "20px");
				} else {
					$dropdownMenu.css("padding-right", "");
				}
			}
			/**
			 * 绑定列表的 mouseover 事件监听 
			 */
			function listEventBind($input, dropdownMenu, opts) {
				dropdownMenu = dropdownMenu || $dropdownMenu;
				opts = opts || options;

				dropdownMenu.find('tbody tr').each(function (e) {
					$(this).off('mouseenter').on("mouseenter", function (e) {
						unHoverAll(dropdownMenu,opts);
						$(this).addClass(opts.listHoverCSS);
					}).off('mousedown').on("mousedown", function (e) {
						setValue($input, getPointKeyword($(this)), opts);
						setBackground ($input, opts);
					});
				});
			}
			/**
			 * 获取当前tr列的关键字数据
			 */
			function getPointKeyword(list) {
				var data = {};
				data.id = list.attr('data-indexid');
				data.key = list.attr('data-indexkey');
				return data;
			}
			/**
			 * 设置取得的值
			 */
			function setValue($input, keywords, opts){
				var _keywords = keywords || {},
				id = _keywords.id || "",
				key = _keywords.key || "",
				inputValList, inputIdList;

				if (opts && opts.multiWord) {//多关键字支持，只设置 val
					inputValList = $input.val().split(opts.separator || ' ');
					inputValList[inputValList.length - 1] = key;
					/*inputIdList = $input.attr("data-id").split(opts.separator || ' ');
					inputIdList[inputIdList.length - 1] = id;*/
					
					$input.val(inputValList.join(opts.separator || ' '))
						//.attr("data-id", inputIdList.join(opts.separator || ' '))
						.focus();
				} else {
					$input.attr("data-id", id).focus().val(key);
				}
			}
			/**
			 * 错误处理
			 */
			function handleError(err){
				console.log(err);
			}
		},
		show: function(){
			var data = this.data("bsSuggest");
			if (data && data.options) {
				this.parent().find("ul.dropdown-menu").show();
			}
			return this;
		},
		hide: function(){
			var data = this.data('bsSuggest');
			if (data && data.options) {
				this.parent().find("ul.dropdown-menu").css("display","");
			}
			return this;
		},
		disable: function (e) {
			if(!$(this).data("bsSuggest")) {
				return false;
			}
			$(this).attr("disabled", true).parent().find("button").addClass("disabled");
		},
		enable: function () {
			if(!$(this).data("bsSuggest")) {
				return false;
			}
			$(this).attr("disabled", false).parent().find("button").removeClass("disabled");
		},
		destroy: function(){
			$(this).off().data("bsSuggest", "");
			$(this).parent().find("button").off();//.addClass("disabled");
		}
	};
})(window.jQuery);