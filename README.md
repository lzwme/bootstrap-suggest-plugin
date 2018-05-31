[![Code Climate](https://lzw.me/images/logo.png)](https://lzw.me)

Bootstrap Search Suggest
========

[Demo|示例](http://lzw.me/pages/demo/bootstrap-suggest-plugin)

这是一个基于 bootstrap 按钮式下拉菜单组件的搜索建议插件，必须使用于按钮式下拉菜单组件上。

[![Built with Grunt][grunt-img]][grunt-url]
[![NPM version][npm-image]][npm-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![GitHub issues][issues-img]][issues-url]
[![GitHub forks][forks-img]][forks-url]
[![GitHub stars][stars-img]][stars-url]

[grunt-img]: https://cdn.gruntjs.com/builtwith.png
[grunt-url]: https://gruntjs.com
[stars-img]: https://img.shields.io/github/stars/lzwme/bootstrap-suggest-plugin.svg
[stars-url]: https://github.com/lzwme/bootstrap-suggest-plugin/stargazers
[forks-img]: https://img.shields.io/github/forks/lzwme/bootstrap-suggest-plugin.svg
[forks-url]: https://github.com/lzwme/bootstrap-suggest-plugin/network
[issues-img]: https://img.shields.io/github/issues/lzwme/bootstrap-suggest-plugin.svg
[issues-url]: https://github.com/lzwme/bootstrap-suggest-plugin/issues
[npm-image]: https://img.shields.io/npm/v/bootstrap-suggest-plugin.svg?style=flat-square
[npm-url]: https://npmjs.org/package/bootstrap-suggest-plugin
[gemnasium-image]: https://img.shields.io/gemnasium/lzwme/bootstrap-suggest-plugin.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/lzwme/bootstrap-suggest-plugin
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: https://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/bootstrap-suggest-plugin.svg?style=flat-square
[download-url]: https://npmjs.org/package/bootstrap-suggest-plugin

## 浏览器支持

* 支持 ie8+,chrome,firefox,safari

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
$("input#test").bsSuggest({
    url: "/rest/sys/getuserlist?keyword="
});
```
具体使用请参考参数配置说明及 demo 示例页面源码([Demo](http://lzw.me/pages/demo/bootstrap-suggest-plugin/demo))

## NPM 方式

[![bootstrap-suggest-plugin](https://nodei.co/npm/bootstrap-suggest-plugin.png)](https://npmjs.org/package/bootstrap-suggest-plugin)

```js
require('bootstrap-suggest-plugin');
//import from 'bootstrap-suggest-plugin';

$("#test").bsSuggest({
    url: "/rest/sys/getuserlist?keyword="
});
```

## 使用示例

### 方法调用
1. 禁用提示： `$("input#test").bsSuggest("disable");`
2. 启用提示： `$("input#test").bsSuggest("enable");`
3. 销毁插件： `$("input#test").bsSuggest("destroy");`
4. 查看版本：`$("input#test").bsSuggest("version");`

### 事件监听
1. `onDataRequestSuccess`: 当  AJAX 请求数据成功时触发，并传回结果到第二个参数
2. `onSetSelectValue`：当从下拉菜单选取值时触发，并传回设置的数据到第二个参数
3. `onUnsetSelectValue`：当设置了 idField，且自由输入内容时触发（与背景警告色显示同步）
4. `onShowDropdown`：下拉菜单显示时触发
5. `onHideDropdown`：下拉菜单隐藏式触发

### 示例参考

```js
$("#test").bsSuggest('init', {
    url: "/rest/sys/getuserlist?keyword=",
    effectiveFields: ["userName", "email"],
    searchFields: [ "shortAccount"],
    effectiveFieldsAlias:{userName: "姓名"},
    clearable: true,
    idField: "userId",
    keyField: "userName"
}).on('onDataRequestSuccess', function (e, result) {
    console.log('onDataRequestSuccess: ', result);
}).on('onSetSelectValue', function (e, selectedData, selectedRawData) {
    console.log('onSetSelectValue: ', e.target.value, selectedData, selectedRawData);
}).on('onUnsetSelectValue', function () {
    console.log('onUnsetSelectValue');
}).on('onShowDropdown', function (e, data) {
    console.log('onShowDropdown', e.target.value, data);
}).on('onHideDropdown', function (e, data) {
    console.log('onHideDropdown', e.target.value, data);
});
```
更多详细用法，可参考 [demo/index.html](https://github.com/lzwme/bootstrap-suggest-plugin/blob/master/demo/index.html) 和 [demo/demo.js](https://github.com/lzwme/bootstrap-suggest-plugin/blob/master/demo/demo.js) 文件源代码，提供了自定义数据、URL 请求数据、百度搜索 API、淘宝搜索 API 的接口演示。

## 配置参数

参数列表中的值均为插件默认值
```js
var defaultOptions = {
    url: null,                      //请求数据的 URL 地址
    jsonp: null,                    //设置此参数名，将开启jsonp功能，否则使用json数据结构
    data: {
        value: []
    },                              //提示所用的数据，注意格式
    indexId: 0,                     //每组数据的第几个数据，作为input输入框的 data-id，设为 -1 且 idField 为空则不设置此值
    indexKey: 0,                    //每组数据的第几个数据，作为input输入框的内容
    idField: '',                    //每组数据的哪个字段作为 data-id，优先级高于 indexId 设置（推荐）
    keyField: '',                   //每组数据的哪个字段作为输入框内容，优先级高于 indexKey 设置（推荐）

    /* 搜索相关 */
    autoSelect: true,               //键盘向上/下方向键时，是否自动选择值
    allowNoKeyword: true,           //是否允许无关键字时请求数据
    getDataMethod: 'firstByUrl',    //获取数据的方式，url：一直从url请求；data：从 options.data 获取；firstByUrl：第一次从Url获取全部数据，之后从options.data获取
    delayUntilKeyup: false,         //获取数据的方式 为 firstByUrl 时，是否延迟到有输入时才请求数据
    ignorecase: false,              //前端搜索匹配时，是否忽略大小写
    effectiveFields: [],            //有效显示于列表中的字段，非有效字段都会过滤，默认全部。
    effectiveFieldsAlias: {},       //有效字段的别名对象，用于 header 的显示
    searchFields: [],               //有效搜索字段，从前端搜索过滤数据时使用，但不一定显示在列表中。effectiveFields 配置字段也会用于搜索过滤
    twoWayMatch: true,              // 是否双向匹配搜索。为 true 即输入关键字包含或包含于匹配字段均认为匹配成功，为 false 则输入关键字包含于匹配字段认为匹配成功

    multiWord: false,               //以分隔符号分割的多关键字支持
    separator: ',',                 //多关键字支持时的分隔符，默认为半角逗号
    delay: 300,                     //搜索触发的延时时间间隔，单位毫秒

    /* UI */
    autoDropup: false,              //选择菜单是否自动判断向上展开。设为 true，则当下拉菜单高度超过窗体，且向上方向不会被窗体覆盖，则选择菜单向上弹出
    autoMinWidth: false,            //是否自动最小宽度，设为 false 则最小宽度不小于输入框宽度
    showHeader: false,              //是否显示选择列表的 header。为 true 时，有效字段大于一列则显示表头
    showBtn: true,                  //是否显示下拉按钮
    inputBgColor: '',               //输入框背景色，当与容器背景色不同时，可能需要该项的配置
    inputWarnColor: 'rgba(255,0,0,.1)', //输入框内容不是下拉列表选择时的警告色
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
    },                              //列表的样式控制
    listAlign: 'left',              //提示列表对齐位置，left/right/auto
    listHoverStyle: 'background: #07d; color:#fff', //提示框列表鼠标悬浮的样式
    listHoverCSS: 'jhover',         //提示框列表鼠标悬浮的样式名称
    clearable: false,               // 是否可清除已输入的内容

    /* key */
    keyLeft: 37,                    //向左方向键，不同的操作系统可能会有差别，则自行定义
    keyUp: 38,                      //向上方向键
    keyRight: 39,                   //向右方向键
    keyDown: 40,                    //向下方向键
    keyEnter: 13,                   //回车键

    /* methods */
    fnProcessData: processData,     //格式化数据的方法，返回数据格式参考 data 参数
    fnGetData: getData,             //获取数据的方法，无特殊需求一般不作设置
    fnAdjustAjaxParam: null,        //调整 ajax 请求参数方法，用于更多的请求配置需求。如对请求关键字作进一步处理、修改超时时间等
    fnPreprocessKeyword: null       //搜索过滤数据前，对输入关键字作进一步处理方法。注意，应返回字符串
};
```

## 二次开发

`git clone` 项目，进入项目目录，执行如下命令：

1. 安装grunt `npm install grunt-cli -g`
2. 安装依赖 `yarn` 或 `npm install`
3. 实时开发 `npm start`
4. 执行测试 `npm test`
4. 执行编译 `npm run build`

提示：对于 phantomjs 的依赖，如下载超时，可使用其他工具下载，然后放到命令行提示的目录，解压，将解压的目录重命名为命令行提示正在解压的名称。然后重新执行 `npm install`。

## Note on Patches / Pull Requests

* Fork the project.
* Make your feature addition or bug fix.
* Send me a pull request. Bonus points for topic branches.

## License

bootstrap-suggest-plugin is released under the MIT license.

该插件由[志文工作室](https://lzw.me)开发和维护。
