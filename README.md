[![Code Climate](http://lzw.me/images/logo.png)](http://lzw.me)

Bootstrap Search Suggest [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
========

[Demo|示例](http://lzw.me/pages/demo/bootstrap-suggest-plugin)

这是一个基于 bootstrap 按钮式下拉菜单组件的搜索建议插件，必须使用于按钮式下拉菜单组件上。

## 功能说明

* 搜索方式：从 data.value 的有效字段数据中查询 keyword 的出现，或字段数据包含于 keyword 中
* 支持单关键字、多关键字的输入搜索建议，多关键字可自定义分隔符
* 支持按 data 数组数据搜索、按  URL 请求搜索和按首次请求URL数据并缓存搜索三种方式
* 单关键字会设置 data-id 和输入框内容两个值，以 indexId/idField 和 indexKey/idFiled 取值 data 的数据为准；多关键字只设置输入框值

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

####方法调用
1. 禁用提示： `$("input#test").bsSuggest("disable");`
2. 启用提示： `$("input#test").bsSuggest("enable");`
3. 销毁插件： `$("input#test").bsSuggest("destroy");`
4. 查看版本：`$("input#test").bsSuggest("version");`

####事件监听
1. dataRequestSuccess: 当  AJAX 请求数据成功时触发，并传回结果到第二个参数
2. onSetSelectValue：当从下拉菜单选取值时触发，并传回设置的数据到第二个参数
3. onUnsetSelectValue：当设置了 idField，且自由输入内容时触发（与背景警告色显示同步）
```js
$("input#test")
    .on("dataRequestSuccess", function (event, result) {
        console.log(result);
    })
    .on('onSetSelectValue', function (e, keyword) {
        console.log('onSetSelectValue: ', keyword);
    })
    .on('onUnsetSelectValue', function (e) {
        console.log("onUnsetSelectValue");
    });
```

## 配置参数

参数列表中的值均为插件默认值
```js
{
    url: null,                      //请求数据的 URL 地址
    jsonp: null,                    //设置此参数名，将开启jsonp功能，否则使用json数据结构
    data: {},                       //提示所用的数据
    getDataMethod: "firstByUrl",    //获取数据的方式，url：一直从url请求；data：从 options.data 获取；firstByUrl：第一次从Url获取全部数据，之后从options.data获取
    indexId: 0,                     //每组数据的第几个数据，作为input输入框的 data-id，设为 -1 且 idField 为空则不设置此值
    indexKey: 0,                    //每组数据的第几个数据，作为input输入框的内容
    idField: "",                    //每组数据的哪个字段作为 data-id，优先级高于 indexId 设置（推荐）
    keyField: "",                   //每组数据的哪个字段作为输入框内容，优先级高于 indexKey 设置（推荐）
    effectiveFields: [],            //有效显示于列表中的字段，非有效字段都会过滤，默认全部，对自定义getData方法无效
    effectiveFieldsAlias: {},       //有效字段的别名对象，用于 header 的显示
    searchFields: [],               //有效搜索字段，从前端搜索过滤数据时使用。effectiveFields 配置字段也会用于搜索过滤
    showHeader: false,              //是否显示选择列表的 header，默认有效字段大于一列时显示，否则不显示
    showBtn: true,                  //是否显示下拉按钮
    allowNoKeyword: true,           //是否允许无关键字时请求数据
    multiWord: false,               //以分隔符号分割的多关键字支持
    separator: ",",                 //多关键字支持时的分隔符，默认为半角逗号
    processData: processData,       //格式化数据的方法，返回数据格式参考 data 参数
    getData: getData,               //获取数据的方法
    autoMinWidth: false,            //是否自动最小宽度，设为 false 则最小宽度不小于输入框宽度
    autoDropup: false,              //选择菜单是否自动判断向上展开。设为 true，则当下拉菜单高度超过窗体，且向上方向不会被窗体覆盖，则选择菜单向上弹出
    listAlign: "left",              //提示列表对齐位置，left/right/auto
    inputBgColor: '',               //输入框背景色，当与容器背景色不同时，可能需要该项的配置
    inputWarnColor: "rgba(255,0,0,.1)", //输入框内容不是下拉列表选择时的警告色
    listStyle: {
        "padding-top":0, "max-height": "375px", "max-width": "800px",
        "overflow": "auto", "width": "auto",
        "transition": "0.3s", "-webkit-transition": "0.3s", "-moz-transition": "0.3s", "-o-transition": "0.3s"
    },                              //列表的样式控制
    listHoverStyle: 'background: #07d; color:#fff', //提示框列表鼠标悬浮的样式
    listHoverCSS: "jhover",         //提示框列表鼠标悬浮的样式名称
    keyLeft: 37,                    //向左方向键
    keyUp: 38,                      //向上方向键
    keyRight: 39,                   //向右方向键
    keyDown: 40,                    //向下方向键
    keyEnter: 13                    //回车键
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