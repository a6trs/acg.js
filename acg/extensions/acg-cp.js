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
    btn.setAnchorPoint(cc.p(0, 0));
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

acg.ext.cp_timeline = function (callback) {
    var size = cc.director.getVisibleSize();
    var tl = cc.DrawNode.create();
    var tl_w = size.width * 0.72;
    var tl_h = size.height * 0.08;
    var tl_r = size.height * 0.012;
    tl.setAnchorPoint(cc.p(1, 0.5));
    tl._cp_callback = callback;
    tl.drawSegment(cc.p(tl_r, tl_h / 2), cc.p(tl_w - tl_r, tl_h / 2),
        tl_r, cc.color(255, 255, 255, 128));
    // For debug use
    //tl.drawDot(cc.p(0, 0), 1, cc.color.RED);
    //tl.drawDot(cc.p(tl_w, tl_h), 1, cc.color.RED);
    tl.setContentSize(cc.size(tl_w, tl_h));
    tl.setCascadeOpacityEnabled(true);
    var tl_thumb = cc.DrawNode.create();
    var thumb_r = size.height * 0.03;
    tl_thumb.drawDot(cc.p(0, 0), thumb_r, cc.color(255, 255, 255, 192));
    tl_thumb.setNormalizedPosition(cc.p(0.4, 0.5));
    tl._cp_thumb = tl_thumb;
    tl.addChild(tl_thumb);

    tl.setProgress = function (p) {
        this._cp_thumb.setNormalizedPositionX(p);
    };

    cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
            var b = acg.ext._cp_ctrls_showed
                && acg.ext.is_touch_in_content(touch, event);
            if (b) this.onTouchMoved(touch, event);
            return b;
        },
        onTouchMoved: function (touch, event) {
            if (!acg.ext.is_touch_in_content(touch, event)) return;
            var t = event.getCurrentTarget();
            var p = t.convertTouchToNodeSpace(touch);
            var time = p.x / t.getContentSize().width;
            t.setProgress(time);
            t._cp_callback(time);
        }
    }, tl);
    return tl;
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
    btn.setOpacity(0);
    cp.addChild(btn);
    var tl = acg.ext.cp_timeline(function (time) {
        acg.travel(time * acg.tot_time());
    });
    acg.ext._cp_ctrls[1] = tl;
    tl.setNormalizedPosition(cc.p(0.95, 0.08));
    tl.setOpacity(0);
    cp.addChild(tl);
    // Update the progress of the timeline regularly
    cc.director.getRunningScene().schedule(function () {
        tl.setProgress(acg.time / acg.tot_time());
        if (acg.paused) {
            btn.drawPlay();
            btn._cp_paused = true;
        }
    }, 0);

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
                tl.runAction(acg.ac.parse(['//',
                    ['move-to', 0.15, cc.p(0.95, 0.08)],
                    ['fade-out', 0.15]
                ]));
            } else {
                acg.ext._cp_ctrls_showed = true;
                btn.runAction(acg.ac.parse(['//',
                    ['move-to', 0.15, cc.p(0.02, 0.02)],
                    ['fade-in', 0.15]
                ]));
                tl.runAction(acg.ac.parse(['//',
                    ['move-to', 0.15, cc.p(0.95, 0.1)],
                    ['fade-in', 0.15]
                ]));
            }
        }
    }, cp);
};
