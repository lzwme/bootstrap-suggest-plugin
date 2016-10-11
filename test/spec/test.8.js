/**
 * 测试八: twoWayMatch 配置项测试
 */
/* eslint no-unused-vars:0 */
function test8() {
    var lintAsync = window.lintAsync;

    describe('测试八: twoWayMatch 配置项测试', function() {
        var $input = $('#test');
        var $dropdown = $input.next().find('ul');

        var param = {
            url: "data.json",
            idField: "userId",
            keyField: "userName"
        };

        it('不设置 twoWayMatch(默认为 true)', function() {
            return lintAsync(function($d) {
                window.helperTest.initInput($input, param)
                    .one('onDataRequestSuccess', function(e, result) {
                        expect(result).to.have.property('value').with.length(31);
                        $d.resolve();
                    });
            }).then(function () {
                return lintAsync(function() {
                    $input.val('chunyun').trigger('keydwon').trigger('keyup');
                }, 310);
            }).then(function() {
                expect($dropdown.find('tr').length).to.equal(1);
            }).then(function() {
                return lintAsync(function() {
                    $input.val('chun123yun').trigger('keydwon').trigger('keyup');
                }, 310);
            }).then(function() {
                expect($dropdown.find('tr').length).to.equal(0);
            }).then(function() {
                return lintAsync(function() {
                    $input.val('chunyun111').trigger('keydwon').trigger('keyup');
                }, 310);
            }).then(function() {
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

        it('twoWayMatch = true', function() {
            return lintAsync(function($d) {
                param.twoWayMatch = true;

                window.helperTest.initInput($input, param)
                    .one('onDataRequestSuccess', function(e, result) {
                        expect(result).to.have.property('value').with.length(31);
                        $d.resolve();
                    });
            }).then(function () {
                return lintAsync(function() {
                    $input.val('chunyun').trigger('keydwon').trigger('keyup');
                }, 310);
            }).then(function() {
                expect($dropdown.find('tr').length).to.equal(1);
            }).then(function() {
                return lintAsync(function() {
                    $input.val('chun123yun').trigger('keydwon').trigger('keyup');
                }, 310);
            }).then(function() {
                expect($dropdown.find('tr').length).to.equal(0);
            }).then(function() {
                return lintAsync(function() {
                    $input.val('chunyun111').trigger('keydwon').trigger('keyup');
                }, 310);
            }).then(function() {
                expect($dropdown.find('tr').length).to.equal(1);
            });
        });

        it('twoWayMatch = false', function() {
            return lintAsync(function($d) {
                param.twoWayMatch = false;

                window.helperTest.initInput($input, param)
                    .one('onDataRequestSuccess', function(e, result) {
                        expect(result).to.have.property('value').with.length(31);
                        $d.resolve();
                    });
            }).then(function () {
                return lintAsync(function() {
                    $input.val('chunyun').trigger('keydwon').trigger('keyup');
                }, 310);
            }).then(function() {
                expect($dropdown.find('tr').length).to.equal(1);
            }).then(function() {
                return lintAsync(function() {
                    $input.val('chun123yun').trigger('keydwon').trigger('keyup');
                }, 310);
            }).then(function() {
                expect($dropdown.find('tr').length).to.equal(0);
            }).then(function() {
                return lintAsync(function() {
                    $input.val('chunyun111').trigger('keydwon').trigger('keyup');
                }, 310);
            }).then(function() {
                expect($dropdown.find('tr').length).to.equal(0);
            });
        });
    });
}
