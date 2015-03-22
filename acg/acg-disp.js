var acg = acg || {};
var cc = cc || {};

acg.width = 0;
acg.height = 0;
acg.scene = null;

acg.bootstrap = function (elem, aspect_ratio, callback) {
    'use strict';
    cc.game.onStart = function () {
        cc.view.adjustViewPort(true);
        acg.width = 320 * aspect_ratio;
        acg.height = 320;
        cc.view.setDesignResolutionSize(acg.width, acg.height, cc.ResolutionPolicy.SHOW_ALL);
        cc.view.resizeWithBrowserSize(true);
        cc.director.setDisplayStats(true);
        cc.director.runScene(new cc.Scene());
    };
    cc.game.run(elem);
    // Wait until the director is ready, and then call the function
    var timer = setInterval(function () {
        // Putting this line inside the if block will cause CP to crash
        // Since CP is initialized as soon as the director is initialized.
        acg.scene = cc.director.getRunningScene();
        if (cc.director && cc.director.getRunningScene()) {
            clearInterval(timer);
            if (callback) callback();
            // Call all function registered
            for (f in acg._init_callbacks) f();
        }
    }, 300);
};
