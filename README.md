[![Code Climate](http://lzw.me/images/logo.png)](http://lzw.me)

Bootstrap Search Suggest - v0.0.1
====================

[Demo|示例](http://lzw.me/pages/demo/bootstrap-suggest-plugin) 

这是一个基于 bootstrap 按钮式下拉菜单组件的搜索建议插件，必须使用于按钮式下拉菜单组件上。

## 功能说明

* 搜索方式：从 data.value 的所有字段数据中查询 keyword 的出现，或字段数据包含于 keyword 中
* 支持单关键字、多关键字的输入搜索建议，多关键字可自定义分隔符
* 支持按 data 数据搜索、按  URL 请求搜索和按首次请求URL数据并缓存搜索三种方式【getDataMethod】
* 单关键字会设置输入框内容和 data-id 两个值，以 indexId 和 indexKey 取值 data 数据的次序为准；多关键字只设置输入框值
 
## 快速上手

1. 引入 jQuery、bootstrap.min.css、bootstrap.min.js
2. 引入插件js: `bootstrap-suggest.min.js`
3. 初始化插件

```js
    var bsSuggest = $("input#test").bsSuggest({
      url: "/rest/sys/getuserlist?keyword="
    });
```
具体使用请参考参数配置说明及demo 示例页面源码([Demo](http://lzw.me/pages/demo/bootstrap-suggest-plugin))

####方法参考
1. 禁用提示： `$("input#test").bsSuggest("disable");`
2. 启用提示： `$("input#test").bsSuggest("enable");`
3. 销毁插件： `$("input#test").bsSuggest("destroy");`

## 参数说明

参数列表中的值均为插件默认值
```js
{
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
}
```

## 使用示例

请参考 index.html 文件源代码，提供了自定义数据、URL 请求数据、百度搜索API、淘宝搜索API的接口演示。

## 二次开发

1. `npm install grunt-cli -g`
2. `npm install`
3. `grunt watch`

## Note on Patches / Pull Requests

* Fork the project.
* Make your feature addition or bug fix.
* Send me a pull request. Bonus points for topic branches.

## 设计制作

该插件由[志文工作室](http://lzw.me)开发和维护.