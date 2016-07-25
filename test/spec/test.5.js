/**
 * 测试五：(modal 中显示；不自动选中值；不显示按钮)
 */
/* eslint no-unused-vars:0 */
function test5() {
    describe('测试五：(modal 中显示；不自动选中值；不显示按钮)', function() {
        var lintAsync = window.lintAsync;
        var $input = $('#modalTest_input');
        var $dropdown = $input.next().find('ul');

        var param = {
            url: "data.json",
            effectiveFields: ["userName", "shortAccount"],
            searchFields: [ "shortAccount"],
            //showHeader: false,
            autoSelect: false,
            showBtn: false,
            idField: "userId",
            keyField: "userName"
        };

        it('基本初始化，数据请求成功测试', function() {
            return lintAsync(function($d) {
                //显示 modal 后
                $('#modalTest').modal('show').one('show.bs.modal', function() {
                    $d.resolve();
                });
            }).then(function() {
                return lintAsync(function($d) {
                    window.helperTest.initInput($input, param)
                        .one('onDataRequestSuccess', function(e, result) {
                            expect(result).to.have.property('value').with.length(31);
                            $d.resolve();
                        });
                });
            })
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

        describe('关闭 modal', function() {
            it('测试 modal 已关闭', function() {
                return lintAsync(function($d) {
                    //显示 modal 后
                    $('#modalTest').modal('hide').one('hidden.bs.modal', function() {
                        expect($input.is(':visible')).to.be.false;
                        $d.resolve();
                    });
                })
            });
        });
     });
}