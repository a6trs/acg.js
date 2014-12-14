var acg = acg || {};
var cc = cc || {};

acg.bootstrap = function (elem, callback) {
    'use strict';
    cc.game.onStart = function () {
        cc.view.adjustViewPort(true);
        if (cc.sys.isMobile) {
            cc.view.setDesignResolutionSize(480, 320, cc.ResolutionPolicy.FIXED_WIDTH);
        } else {
            cc.view.setDesignResolutionSize(480, 320, cc.ResolutionPolicy.SHOW_ALL);
        }
        cc.view.resizeWithBrowserSize(true);
        cc.director.setDisplayStats(true);
        cc.director.runScene(new cc.Scene());
    };
    cc.game.run(elem);
    // Wait until the director is ready, and then call the function
    if (callback) {
        var timer = setInterval(function () {
            if (cc.director && cc.director.getRunningScene()) {
                clearInterval(timer);
                callback();
            }
        }, 300);
    }
};
