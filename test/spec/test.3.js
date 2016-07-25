/**
 * 测试三：(从 json.data 中获取数据)
 */
/* eslint no-unused-vars:0 */
function test3() {
    var lintAsync = window.lintAsync;
    describe('测试三：(从 json.data 中获取数据)', function() {
        var $input = $('#test');
        var $dropdown = $input.next().find('ul');

        var dataList = {value: []}, i = 50;
        while(i--) {
            dataList.value.push({
                id: i,
                word: Math.random() * 10000000,
                description: 'http://lzw.me'
            });
        }

        var param = {
            indexId: 2,  //data.value 的第几个数据，作为input输入框的内容
            indexKey: 1, //data.value 的第几个数据，作为input输入框的内容
            data: dataList
        };

        it('基本初始化测试', function() {
            return lintAsync(function() {
                window.helperTest.initInput($input, param)
                    .trigger('keydown').trigger('keyup');
            }).then(function() {
                expect($input.data('bsSuggest').options.data.value.length).to.equal(50);
                expect($input.next().find('button').is(':visible')).to.be.true;
            });
        });

        window.helperTest.actionTest($input, $dropdown, {
            val: dataList.value[0].word,  //执行输入操作测试
        });

        window.helperTest.methodTest($input, $dropdown, {
            param: param
        });
     });
}
