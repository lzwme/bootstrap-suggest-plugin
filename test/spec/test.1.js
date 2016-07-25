/**
 * 测试一：基本功能测试
 */
/* eslint no-unused-vars:0 */
function test1() {
    var lintAsync = window.lintAsync;

    describe('测试一：(首次从 URL 获取数据)', function() {
        var $input = $('#test');
        var $dropdown = $input.next().find('ul');

        var param = {
            url: "data.json",
            idField: "userId",
            keyField: "userName"
        };

        it('基本初始化，数据请求成功测试', function(done) {
            lintAsync(function($d) {
                window.helperTest.initInput($input, param)
                    .one('onDataRequestSuccess', function(e, result) {
                        expect(result).to.have.property('value').with.length(31);
                        $d.resolve();
                        done();
                    });
            });
        });

        it('点击下拉按钮，显示全量数据测试', function() {
            return lintAsync(function() {
                $input.val('chunyun').trigger('keydwon').trigger('keyup');
            }, 400).then(function() {
                expect($dropdown.find('tr').length).to.equal(1);
            }).then(function() {
                return lintAsync(function() {
                    $input.next().find('button').click(); //隐藏
                    $input.next().find('button').click(); //显示
                })
            }).then(function() {
                expect($dropdown.find('tr').length).to.equal(31);
                $input.val('');
            });
        });



        //各种操作模拟测试
        window.helperTest.actionTest($input, $dropdown, {
            emptyShow: true, //空输入时是否执行提示
            val: 'TANG'  //执行输入操作测试
        });

        //各种方法测试
        window.helperTest.methodTest($input, $dropdown, {
            param: param
        });
    });
}
