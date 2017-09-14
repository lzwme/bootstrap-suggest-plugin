/**
 * 各种基本测试的生成方法
 * @type {Object}
 */
/* eslint no-unused-expressions:0 */

var lintAsync = window.lintAsync;

window.helperTest = {
    initInput: function($input, param) {
        return $input.bsSuggest('hide').bsSuggest('destroy').val('').bsSuggest(param);
    },
    /**
     * 基本方法测试
     */
    methodTest: function($input, $dropdown, params) {
        params.title = params.title || '';
        params.initVal = params.initVal || ''; //init 方法测试使用

        describe(params.title + '各种方法测试', function() {
            it('方法测试：disabe', function() {
                $input.bsSuggest('disable');
                expect($input.prop('disabled')).to.be.true;
            });

            it('方法测试：enable', function() {
                $input.bsSuggest('enable');
                expect($input.prop('disabled')).to.be.false;
            });

            it('方法测试：show', function() {
                return lintAsync(function() {
                    $input.bsSuggest('show');
                    expect($dropdown.is(':visible')).to.be.true;
                }, 100)
            });

            it('方法测试：hide', function() {
                $input.bsSuggest('hide');
                expect($dropdown.is(':visible')).to.be.false;
            });

            it('方法测试：version', function() {
                expect(/^.+$/i.test($.fn.bsSuggest('version'))).to.be.true;
            });

            it('方法测试：destory', function(done) {
                lintAsync(function() {
                    $input.bsSuggest('destroy').val('')
                        .trigger('keydown').trigger('keyup');
                }, 300).then(function() {
                    expect($dropdown.is(':visible')).to.be.false;
                    done();
                });
            });

            it('方法测试：init', function() {
                return lintAsync(function() {
                    $input.bsSuggest('init', params.param)
                    $input.val(params.initVal).trigger('keydown').trigger('keyup').focus();
                }, 500).then(function() {
                    expect($dropdown.is(':visible')).to.be.true;
                }).then(function() {
                    $input.val('');
                });
            });
        });
    },
    /** 各种输入操作模拟测试 */
    actionTest: function($input, $dropdown, params) {
        params.title = params.title || '';

        describe(params.title + '各种基本输入操作模拟', function() {
            it('触发 keyup/keydown 事件', function() {
                return lintAsync(function() {
                        $dropdown.html('').hide();
                        $input.val('').trigger('keydown').trigger('keyup');
                    })
                    .then(function() {
                        if (params.emptyShow !== false) {
                            expect($dropdown.is(':visible')).to.be.true;
                            expect(!!$dropdown.find('tr').length).to.be.true;
                        } else {
                            expect($dropdown.is(':visible')).to.be.false;
                            expect(!!$dropdown.find('tr').length).to.be.false;
                        }
                    });
            });

            //配置了 val 参数才执行
            params.val !== undefined && it('输入模拟：' + params.val, function() {
                return lintAsync(function($d) {
                        //通过url获取数据的方式
                        params.byurl &&
                            $input.one('onDataRequestSuccess', function() {
                                $d.resolve();
                            });

                        $input.val(params.val).trigger('keydown').trigger('keyup');
                    }, params.byurl ? 3000 : 310)
                    .then(function() {
                        return lintAsync(function() {
                            expect($dropdown.is(':visible')).to.be.true;
                            expect($dropdown.find('tr').length).to.be.ok;
                        }, 100)
                    });
            });

            it('选择模拟', function() {
                return lintAsync(function($d) {
                        $input.val('').one('onSetSelectValue', function(e, keyword) {
                            expect(keyword.length).to.be.ok;
                            $d.resolve();
                        });
                        $dropdown.find('tr:eq(1)').trigger('mouseenter').trigger('mousedown');
                    })
                    .then(function() {
                        return lintAsync(function() {
                            expect($dropdown.is(':visible')).to.be.false;
                            expect($input.val().length).to.be.ok;
                        }, 100)
                    });
            });

            it('输入模拟：TANGTANGTANGTANGTANGTANGTANGFFFFFFFFFF', function() {
                return lintAsync(function($d) {
                    //通过url获取数据的方式
                    params.byurl &&
                        $input.one('onDataRequestSuccess', function() {
                            $d.resolve();
                        });

                    $input.val('TANGTANGTANGTANGTANGTANGTANGFFFFFFFFFF').trigger('keydown').trigger('keyup');
                }, params.byurl ? 3000 : 310)
                .then(function() {
                    expect($dropdown.html()).to.be.equal('');
                    expect($dropdown.find('tr').length).to.equal(0);
                });
            });

            it('触发 blur 事件', function() {
                return lintAsync(function() {
                        $input.trigger('blur');
                    })
                    .then(function() {
                        expect($dropdown.is(':visible')).to.be.false;
                    });
            });
        });
    }
}
