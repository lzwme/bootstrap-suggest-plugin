function mochaRun() {
    // mocha.checkLeaks();
    // mocha.globals(['jQuery']);
    mocha.run();
}

window.test8();
window.test1();
window.test2();
window.test3();
window.test4();
window.test5();
window.test6();
//淘宝接口测试，只支持浏览器测试
//mocha-phantomjs 不支持 https
if (typeof window.callPhantom === 'undefined') {
    window.test7();
}

mochaRun();
