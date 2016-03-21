(function() {
    $("#test").bsSuggest({
        //url: "/rest/sys/getuserlist?keyword=",
        url: "data.json",
        /*effectiveFields: ["userName", "shortAccount"],
        searchFields: [ "shortAccount"],
        effectiveFieldsAlias:{userName: "姓名"},*/
        idField: "userId",
        keyField: "userName"
    }).on('onDataRequestSuccess', function (e, result) {
        console.log('onDataRequestSuccess: ', result);
    }).on('onSetSelectValue', function (e, keyword, data) {
        console.log('onSetSelectValue: ', keyword, data);
    }).on('onUnsetSelectValue', function () {
        console.log("onUnsetSelectValue");
    });

    /**
     * 不显示下拉按钮
     */
    $("#testNoBtn").bsSuggest({
        //url: "/rest/sys/getuserlist?keyword=",
        url: "data.json",
        /*effectiveFields: ["userName", "shortAccount"],
        searchFields: [ "shortAccount"],
        effectiveFieldsAlias:{userName: "姓名"},*/
        showBtn: false,     //不显示下拉按钮
        delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
        idField: "userId",
        keyField: "userName"
    }).on('onDataRequestSuccess', function (e, result) {
        console.log('onDataRequestSuccess: ', result);
    }).on('onSetSelectValue', function (e, keyword, data) {
        console.log('onSetSelectValue: ', keyword, data);
    }).on('onUnsetSelectValue', function () {
        console.log("onUnsetSelectValue");
    });

    //modal 中显示；不自动选中值；不显示按钮。
    $("#modalTest_input").bsSuggest({
        url: "data.json",
        autoSelect: false,
        showBtn: false,
        idField: "userId",
        keyField: "userName"
    }).on('onDataRequestSuccess', function (e, result) {
        console.log('onDataRequestSuccess: ', result);
    }).on('onSetSelectValue', function (e, keyword, data) {
        console.log('onSetSelectValue: ', keyword, data);
    }).on('onUnsetSelectValue', function () {
        console.log("onUnsetSelectValue");
    });

    /**
     * 从 data参数中过滤数据
     */
    var dataList = {value: []}, i = 5001;
    while(i--) {
        dataList.value.push({
            id: i,
            word: Math.random() * 100000,
            description: 'http://lzw.me'
        });
    }
    $("#test_data").bsSuggest({
        indexId: 2,  //data.value 的第几个数据，作为input输入框的内容
        indexKey: 1, //data.value 的第几个数据，作为input输入框的内容
        data: dataList
    }).on('onDataRequestSuccess', function (e, result) {
        console.log('从 json.data 参数中获取，不会触发 onDataRequestSuccess 事件', result);
    }).on('onSetSelectValue', function (e, keyword, data) {
        console.log('onSetSelectValue: ', keyword, data);
    }).on('onUnsetSelectValue', function () {
        console.log("onUnsetSelectValue");
    });

    /**
     * 百度搜索 API 测试
     */
    $("#baidu").bsSuggest({
        allowNoKeyword: false,   //是否允许无关键字时请求数据。为 false 则无输入时不执行过滤请求
        multiWord: true,         //以分隔符号分割的多关键字支持
        separator: ",",          //多关键字支持时的分隔符，默认为空格
        getDataMethod: "url",    //获取数据的方式，总是从 URL 获取
        url: 'http://unionsug.baidu.com/su?p=3&t='+ (new Date()).getTime() +'&wd=', /*优先从url ajax 请求 json 帮助数据，注意最后一个参数为关键字请求参数*/
        jsonp: 'cb',                      //如果从 url 获取数据，并且需要跨域，则该参数必须设置
        processData: function (json) {    // url 获取数据时，对数据的处理，作为 getData 的回调函数
            var index, len, data = {value: []};
            if (!json || !json.s || json.s.length === 0) {
                return false;
            }

            len = json.s.length;

            for (index = 0; index < len; index++) {
                data.value.push({
                    word: json.s[index]
                });
            }
            data.defaults = 'baidu';

            //字符串转化为 js 对象
            return data;
        }
    }).on('onDataRequestSuccess', function (e, result) {
        console.log('onDataRequestSuccess: ', result);
    }).on('onSetSelectValue', function (e, keyword, data) {
        console.log('onSetSelectValue: ', keyword, data);
    }).on('onUnsetSelectValue', function () {
        console.log("onUnsetSelectValue");
    });

    /**
     * 百度搜索 API 测试，附带关键字“手机”
     */
    $("#baiduPreKeyword").bsSuggest({
        allowNoKeyword: false,   //是否允许无关键字时请求数据。为 false 则无输入时不执行过滤请求
        multiWord: true,         //以分隔符号分割的多关键字支持
        separator: ",",          //多关键字支持时的分隔符，默认为空格
        getDataMethod: "url",    //获取数据的方式，总是从 URL 获取
        url: 'http://unionsug.baidu.com/su?p=3&wd=', /*优先从url ajax 请求 json 帮助数据，注意最后一个参数为关键字请求参数*/
        jsonp: 'cb',                      //如果从 url 获取数据，并且需要跨域，则该参数必须设置
        fnPreprocessKeyword: function(keyword) { //请求数据前，对输入关键字作进一步处理方法。注意，应返回字符串
            return $('#preKeyword').val() + keyword;
        },
        processData: function (json) {    // url 获取数据时，对数据的处理，作为 getData 的回调函数
            var index, len, data = {value: []};
            if (!json || !json.s || json.s.length === 0) {
                return false;
            }

            len = json.s.length;

            for (index = 0; index < len; index++) {
                data.value.push({
                    word: json.s[index]
                });
            }
            data.defaults = 'baidu';

            //字符串转化为 js 对象
            return data;
        }
    }).on('onDataRequestSuccess', function (e, result) {
        console.log('onDataRequestSuccess: ', result);
    }).on('onSetSelectValue', function (e, keyword, data) {
        console.log('onSetSelectValue: ', keyword, data);
    }).on('onUnsetSelectValue', function () {
        console.log("onUnsetSelectValue");
    });

    /**
     * 百度搜索 API 测试，ajax 参数调整回调
     */
    $("#baiduAdjustAjaxParam").bsSuggest({
        allowNoKeyword: false,   //是否允许无关键字时请求数据。为 false 则无输入时不执行过滤请求
        multiWord: true,         //以分隔符号分割的多关键字支持
        separator: ",",          //多关键字支持时的分隔符，默认为空格
        getDataMethod: "url",    //获取数据的方式，总是从 URL 获取
        url: 'http://unionsug.baidu.com/su?p=3', /*优先从url ajax 请求 json 帮助数据，注意最后一个参数为关键字请求参数*/
        jsonp: 'cb',
        fnAdjustAjaxParam: function(keyword, opts) {
        //调整 ajax 请求参数方法，用于更多的请求配置需求。如对请求关键字作进一步处理、修改超时时间等
            console.log('ajax 请求参数调整：', keyword, opts);
            return {
                timeout: 10000,
                data: {
                    t: (new Date()).getTime(),
                    wd: $('#customKeyword').val() +  keyword
                }
            };
        },
        processData: function (json) {    // url 获取数据时，对数据的处理，作为 getData 的回调函数
            var index, len, data = {value: []};
            if (!json || !json.s || json.s.length === 0) {
                return false;
            }

            len = json.s.length;

            for (index = 0; index < len; index++) {
                data.value.push({
                    word: json.s[index]
                });
            }
            data.defaults = 'baidu';

            //字符串转化为 js 对象
            return data;
        }
    }).on('onDataRequestSuccess', function (e, result) {
        console.log('onDataRequestSuccess: ', result);
    }).on('onSetSelectValue', function (e, keyword, data) {
        console.log('onSetSelectValue: ', keyword, data);
    }).on('onUnsetSelectValue', function () {
        console.log("onUnsetSelectValue");
    });

    /**
     * 淘宝搜索 API 测试
     */
    $("#taobao").bsSuggest({
        indexId: 2,             //data.value 的第几个数据，作为input输入框的内容
        indexKey: 1,            //data.value 的第几个数据，作为input输入框的内容
        allowNoKeyword: false,  //是否允许无关键字时请求数据。为 false 则无输入时不执行过滤请求
        multiWord: true,        //以分隔符号分割的多关键字支持
        separator: ",",         //多关键字支持时的分隔符，默认为空格
        getDataMethod: "url",   //获取数据的方式，总是从 URL 获取
        showHeader: true,       //显示多个字段的表头
        autoDropup: true,       //自动判断菜单向上展开
        effectiveFieldsAlias:{Id: "序号", Keyword: "关键字"},
        url: 'http://suggest.taobao.com/sug?code=utf-8&extras=1&q=', /*优先从url ajax 请求 json 帮助数据，注意最后一个参数为关键字请求参数*/
        jsonp: 'callback',               //如果从 url 获取数据，并且需要跨域，则该参数必须设置
        processData: function(json){     // url 获取数据时，对数据的处理，作为 getData 的回调函数
            var index, len, data = {value: []};

            if(! json || ! json.result || ! json.result.length) {
                return false;
            }

            len = json.result.length;

            for (index = 0; index < len; index++) {
                data.value.push({
                    "Id": (index + 1),
                    "Keyword": json.result[index][0],
                    "Count": json.result[index][1]
                });
            }
            console.log('淘宝搜索 API: ', data);
            return data;
        }
    }).on('onDataRequestSuccess', function (e, result) {
        console.log('onDataRequestSuccess: ', result);
    }).on('onSetSelectValue', function (e, keyword, data) {
        console.log('onSetSelectValue: ', keyword, data);
    }).on('onUnsetSelectValue', function () {
        console.log("onUnsetSelectValue");
    });

    $("form").submit(function() {
        return false;
    });
}());
