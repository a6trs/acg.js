var cc = cc || {};
var acg = acg || {};
acg.ext = acg.ext || {};

acg.ext._cp_layer = null;
acg.ext._cp_ctrls = [];
acg.ext._cp_ctrls_showed = false;

acg.ext.is_touch_in_content = function (touch, event) {
    var p = event.getCurrentTarget().convertTouchToNodeSpace(touch);
    var s = event.getCurrentTarget().getContentSize();
    return !(p.x < 0 || p.x > s.width || p.y < 0 || p.y > s.height);
}

acg.ext.cp_playbtn = function (callback) {
    var size = cc.director.getVisibleSize();
    var btn = cc.DrawNode.create();
    var playbtn_r = size.height * 0.1;
    btn._cp_paused = false;
    btn._cp_callback = callback;
    btn.drawPlay = function () {
        btn.clear();
        btn.drawDot(cc.p(playbtn_r, playbtn_r),
            playbtn_r, cc.color(255, 255, 255, 128));
        btn.drawPoly([
            cc.p(playbtn_r * 0.7113, playbtn_r * 1.5),
            cc.p(playbtn_r * 0.7113, playbtn_r * 0.5),
            cc.p(playbtn_r * 1.5774, playbtn_r)
        ], cc.color(255, 255, 255, 128), 1, cc.color(0, 0, 0, 255));
    };
    btn.drawPause = function () {
        btn.clear();
        btn.drawDot(cc.p(playbtn_r, playbtn_r),
            playbtn_r, cc.color(255, 255, 255, 128));
        btn.drawPoly([
            cc.p(playbtn_r * 0.7113, playbtn_r * 1.5),
            cc.p(playbtn_r * 0.7113, playbtn_r * 0.5),
            cc.p(playbtn_r * 0.8613, playbtn_r * 0.5),
            cc.p(playbtn_r * 0.8613, playbtn_r * 1.5)
        ], cc.color(255, 255, 255, 128), 1, cc.color(0, 0, 0, 255));
        btn.drawPoly([
            cc.p(playbtn_r * 1.2887, playbtn_r * 1.5),
            cc.p(playbtn_r * 1.2887, playbtn_r * 0.5),
            cc.p(playbtn_r * 1.1387, playbtn_r * 0.5),
            cc.p(playbtn_r * 1.1387, playbtn_r * 1.5)
        ], cc.color(255, 255, 255, 128), 1, cc.color(0, 0, 0, 255));
    };
    btn.drawPause();
    btn.setContentSize(cc.size(playbtn_r * 2, playbtn_r * 2));

    cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
            return (acg.ext._cp_ctrls_showed
                && acg.ext.is_touch_in_content(touch, event));
        },
        onTouchEnded: function (touch, event) {
            if (!acg.ext.is_touch_in_content(touch, event)) return;
            var t = event.getCurrentTarget();
            if (t._cp_paused) t.drawPause(); else t.drawPlay();
            t._cp_paused = !t._cp_paused;
            t._cp_callback(t._cp_paused);
        }
    }, btn);
    return btn;
};

acg.ext.cp_enable = function () {
    cc.director.setDisplayStats(false);
    // Create the touch listener layer
    var cp = cc.Layer.create();
    acg.ext._cp_layer = cp;
    cc.director.getRunningScene().addChild(cp, 1000);

    // Create the controls
    var size = cc.director.getVisibleSize();
    var btn = acg.ext.cp_playbtn(function (paused) {
        if (paused) acg.pause(); else acg.resume();
    });
    acg.ext._cp_ctrls[0] = btn;
    btn.setNormalizedPosition(cc.p(0.02, 0));
    btn.setAnchorPoint(cc.p(0, 0));
    btn.setOpacity(0);
    cp.addChild(btn);

    cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
            return true;
        },
        onTouchEnded: function (touch, event) {
            if (acg.ext._cp_ctrls_showed) {
                acg.ext._cp_ctrls_showed = false;
                btn.runAction(acg.ac.parse(['//',
                    ['move-to', 0.15, cc.p(0.02, 0)],
                    ['fade-out', 0.15]
                ]));
            } else {
                acg.ext._cp_ctrls_showed = true;
                btn.runAction(acg.ac.parse(['//',
                    ['move-to', 0.15, cc.p(0.02, 0.02)],
                    ['fade-in', 0.15]
                ]));
            }
        }
    }, cp);
};
