/**
 * 测试七：(淘宝搜索 API 测试)
 */
/* eslint no-unused-vars:0 */
function test7() {
    describe('测试七：(淘宝搜索 API 测试)', function() {
        var lintAsync = window.lintAsync;
        var $input = $('#test');
        var $dropdown = $input.next().find('ul');

        var param = {
            indexId: 2,             //data.value 的第几个数据，作为input输入框的内容
            indexKey: 1,            //data.value 的第几个数据，作为input输入框的内容
            allowNoKeyword: false,  //是否允许无关键字时请求数据。为 false 则无输入时不执行过滤请求
            multiWord: true,        //以分隔符号分割的多关键字支持
            separator: ",",         //多关键字支持时的分隔符，默认为空格
            getDataMethod: "url",   //获取数据的方式，总是从 URL 获取
            showHeader: true,       //显示多个字段的表头
            autoDropup: true,       //自动判断菜单向上展开
            effectiveFieldsAlias:{Id: "序号", Keyword: "关键字"},
            jsonp: 'callback',
            url: 'http://suggest.taobao.com/sug?code=utf-8&extras=1', /*优先从url ajax 请求 json 帮助数据，注意最后一个参数为关键字请求参数*/
            // url 获取数据时，对数据的处理，作为 fnGetData 的回调函数
            fnAdjustAjaxParam: function(keyword) { //调整 ajax 请求参数
                return {
                    data: {
                        t: (new Date()).getTime(),
                        q: keyword
                    },
                    timeout: 6000,
                    jsonp: 'callback'
                }
            },
            fnProcessData: function(json){
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
                return data;
            }
        };

        it('基本初始化测试', function() {
            return lintAsync(function() {
                window.helperTest.initInput($input, param);
                expect($input.data('bsSuggest').options.multiWord).to.be.true;
            });
        });

        it('数据请求成功测试', function() {
            return lintAsync(function($d) {
                $input.one('onDataRequestSuccess', function(e, result) {
                    expect(result.result.length).to.be.ok;
                    $d.resolve();
                })
                .val('flyme').trigger('keydown').trigger('keyup');
            }, 3000).then(function() {
                expect($dropdown.is(':visible')).to.be.true;
                expect($dropdown.find('tr').length).to.be.ok;
                $input.val('');
            });
        });

        //各种操作模拟测试
        window.helperTest.actionTest($input, $dropdown, {
            emptyShow: false, // 空输入时是否执行提示
            val: '电脑',     // 执行输入操作测试
            byurl: true
        });

        //各种方法测试
        window.helperTest.methodTest($input, $dropdown, {
            param: param,
            initVal: '手机',
            byurl: true
        });
     });
}
