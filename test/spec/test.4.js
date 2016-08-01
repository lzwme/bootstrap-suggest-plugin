/**
 * 测试四 autoDropup: true
 */
/* eslint no-unused-vars:0 */
function test4() {
    describe('测试四：(自动判断向上/下测试: autoDropup: true)', function() {
        var lintAsync = window.lintAsync;
        var $input = $('#test');
        //var $dropdown = $input.next().find('ul');
        var param = {
            url: "data.json",
            effectiveFieldsAlias:{userName: "姓名"},
            ignorecase: true,
            showHeader: true,
            showBtn: false,     //不显示下拉按钮
            delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
            idField: "userId",
            keyField: "userName",
            autoDropup: true
        };

        it('基本初始化，数据请求成功测试', function() {
            return lintAsync(function($d) {
                window.helperTest.initInput($input, param)
                    .one('onDataRequestSuccess', function(e, result) {
                        expect(result).to.have.property('value').with.length(31);
                        $d.resolve();
                    });
            });
        });

        it('触发keydown/keyup，超长，自动向上', function() {
            return lintAsync(function() {
                $input.trigger('keydown').trigger('keyup');
            }, 400).then(function() {
                expect($input.parent().hasClass('dropup')).to.be.true;
            });
        });

        it('录入关键字：chunyun，只有一条，自动向下', function() {
            return lintAsync(function() {
                $input.val('chunyun').focus().trigger('keydown').trigger('keyup');
            }, 400).then(function() {
                expect($input.parent().hasClass('dropup')).to.be.false;
            }).then(function() {
                //销毁，还原
                $input.parent().removeClass('dropup');
                $input.bsSuggest('destroy').val('');
            });
        });
    });
}
