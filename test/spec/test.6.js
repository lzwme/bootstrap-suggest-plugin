/**
 * 测试六：(百度搜索 API 测试)
 */
/* eslint no-unused-vars:0 */
function test6() {
    describe('测试六：(百度搜索 API 测试)', function() {
        var lintAsync = window.lintAsync;
        var $input = $('#test');
        var $dropdown = $input.next().find('ul');

        var param = {
            allowNoKeyword: false,   //是否允许无关键字时请求数据。为 false 则无输入时不执行过滤请求
            multiWord: true,         //以分隔符号分割的多关键字支持
            separator: ",",          //多关键字支持时的分隔符，默认为空格
            getDataMethod: "url",    //获取数据的方式，总是从 URL 获取
            url: 'http://unionsug.baidu.com/su?p=3&wd=', //优先从url ajax 请求 json 帮助数据，注意最后一个参数为关键字请求参数
            jsonp: 'cb',                        //如果从 url 获取数据，并且需要跨域，则该参数必须设置
            fnProcessData: function (json) {    // url 获取数据时，对数据的处理，作为 fnGetData 的回调函数
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
                    expect(result.q).to.equal('flyme');
                    expect(result.s.length).to.equal(10);
                    $d.resolve();
                })
                .val('flyme').trigger('keydown').trigger('keyup');
            }, 3000).then(function() {
                expect($dropdown.is(':visible')).to.be.true;
                expect($dropdown.find('tr').length).to.equal(10);
                $input.val('');
            });
        });

        //各种操作模拟测试
        window.helperTest.actionTest($input, $dropdown, {
            emptyShow: false, // 空输入时是否执行提示
            val: 'git',     // 执行输入操作测试
            byurl: true
        });

        //各种方法测试
        window.helperTest.methodTest($input, $dropdown, {
            param: param,
            initVal: '魅族',
            byurl: true
        });
     });
}
