/**
 * mocha setup
 */
/* eslint no-undef:0 */

/**
 * 执行异步的验证，返回 deferred 对象以便于异步而持续的执行
 * @param  {Function} callback 要异步执行的方法
 * @param  {Number}   timeout  超时时间，超时则 resolve，进行后续执行
 * @param  {Function} done     mocha 异步 done
 * @return {Deferred}
 */
window.lintAsync = function(callback, timeout, done) {
    //用于延时执行，一般的动画时长为 300 ms
    timeout = timeout || 310;

    var $d = $.Deferred();
    try {
        var $p = callback($d);
        done && $p.then && $p.then(done);
    } catch (err) {
        done && done(err);
    }

    //超时直接回调
    setTimeout(function() {
        $d.resolve();
        done && done();
    }, timeout);

    return $d;
}

/**
 * PhantomJS 环境下执行截图，保存到 test_screenshots 目录
 */
function takeScreenshot() {
    if (window.callPhantom) {
        var date = new Date();
        var filename = ['test_screenshots/' + date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()].join('-') + '.' + date.getMilliseconds();
        console.log("Taking screenshot " + filename);
        callPhantom({
            'screenshot': filename
        });
    }
}

/**
 * 执行 setup
 */
function start() {
    if (typeof initMochaPhantomJS === 'function') {
        initMochaPhantomJS();
    }

    window.mocha.setup({
        ui: 'bdd',
        ignoreLeaks: true,
        timeout: 10000
    });

    window.expect = window.chai.expect;
    window.assert = window.chai.assert;
    window.should = window.chai.should;

    window.$input = $('#test');
    window.$dropdown = $input.next().find('ul');

    /** root hooks */
    afterEach(function() {
        //每一步执行后，执行截图
        //takeScreenshot();
    });
}

start();
