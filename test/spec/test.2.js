/**
 * 测试二 (首次从 URL 获取数据，显示 header，不显示按钮，忽略大小写)
 */
/* eslint no-unused-vars:0 */
function test2() {
    var lintAsync = window.lintAsync;
    describe('测试二：(首次从 URL 获取数据，显示 header，不显示按钮，忽略大小写)', function() {
        var $input = $('#test');
        var $dropdown = $input.next().find('ul');

        var param = {
            url: "data.json",
            effectiveFieldsAlias:{userName: "姓名"},
            ignorecase: true,
            showHeader: true,
            showBtn: false,     //不显示下拉按钮
            delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
            idField: "userId",
            keyField: "userName"
        };

        it('基本初始化，数据延迟测试，不显示按钮测试', function() {
            return lintAsync(function() {
                window.helperTest.initInput($input, param);
            }).then(function() {
                expect($input.data('bsSuggest').options.data.value.length).to.equal(0);
                expect($input.next().find('button').is(':visible')).to.be.false;
            });
        });

        it('触发keyup/keydown，数据请求成功测试', function() {
            return lintAsync(function($d) {
                $input.one('onDataRequestSuccess', function(e, result) {
                    expect(result).to.have.property('value').with.length(31);
                    $d.resolve();
                });

                $input.trigger('keydown').trigger('keyup');
            });
        });

        it('显示 header 测试：showHeader: true', function() {
            return lintAsync(function() {
                $input.val('').trigger('keydown').trigger('keyup');
            }).then(function() {
                expect($dropdown.find('th:eq(0)').text()).to.equal('姓名(31)');
            });
        });

        it('忽略大小写：ignorecase: true', function() {
            return lintAsync(function() {
                $input.val('TaNg').trigger('keydown').trigger('keyup');
            }).then(function() {
                expect($dropdown.find('td:contains("tang")').length).to.be.ok;
            });
        });

        window.helperTest.actionTest($input, $dropdown, {
            val: 'TanG',  //执行输入操作测试
        });

        window.helperTest.methodTest($input, $dropdown, {
            param: param
        });
     });
}
