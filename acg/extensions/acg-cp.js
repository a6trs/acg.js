var cc = cc || {};
var acg = acg || {};
acg.ext = acg.ext || {};

acg.ext._cp_layer = null;
acg.ext._cp_ctrls = [];
acg.ext._cp_ctrls_showed = false;
acg.ext._cp_swiping = false;
// Whether the animation is paused at the time when dragging started
// Used in both the timeline and the swipe-to-seek functionality
acg.ext._cp_shouldbepaused = null;

acg.ext.is_touch_in_content = function (touch, event) {
    var p = event.getCurrentTarget().convertTouchToNodeSpace(touch);
    var s = event.getCurrentTarget().getContentSize();
    return !(p.x < 0 || p.x > s.width || p.y < 0 || p.y > s.height);
};

acg.ext.touch_swiping = function (touch) {
    return cc.pDistanceSQ(touch.getStartLocation(), touch.getLocation()) > 100;
};

acg.ext.cp_playbtn = function (callback) {
    var btn = cc.DrawNode.create();
    var playbtn_r = acg.height * 0.1;
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
            // Update image
            var t = event.getCurrentTarget();
            if (t._cp_paused) t.drawPause(); else t.drawPlay();
            t._cp_paused = !t._cp_paused;
            t._cp_callback(t._cp_paused);
        }
    }, btn);
    return btn;
};

acg.ext.cp_timeline = function (callback) {
    var tl = cc.DrawNode.create();
    var tl_w = acg.width * 0.72;
    var tl_h = acg.height * 0.08;
    var tl_r = acg.height * 0.012;
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
    var thumb_r = acg.height * 0.03;
    tl_thumb.drawDot(cc.p(0, 0), thumb_r, cc.color(255, 255, 255, 192));
    tl_thumb.setNormalizedPosition(cc.p(0.4, 0.5));
    tl._cp_thumb = tl_thumb;
    tl.addChild(tl_thumb);

    tl.setProgress = function (p) {
        this._cp_thumb.setNormalizedPositionX(p);
        this._cp_callback(p);
    };
    tl.getProgress = function (p) {
        return this._cp_thumb.getNormalizedPositionX();
    };

    cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
            var b = acg.ext._cp_ctrls_showed
                && acg.ext.is_touch_in_content(touch, event);
            if (b) {
                this.onTouchMoved(touch, event);
                if (acg.ext._cp_shouldbepaused === null)
                    acg.ext._cp_shouldbepaused = acg.paused;
                acg.pause();
            }
            return b;
        },
        onTouchMoved: function (touch, event) {
            if (!acg.ext.is_touch_in_content(touch, event)) return;
            // Update thumb's position
            var t = event.getCurrentTarget();
            var p = t.convertTouchToNodeSpace(touch);
            var time = p.x / t.getContentSize().width;
            t.setProgress(time);
        },
        onTouchEnded: function () {
            // If not paused at the beginning of dragging, we resume it now
            if (!acg.ext._cp_shouldbepaused) acg.resume();
            acg.ext._cp_shouldbepaused = null;
        }
    }, tl);
    return tl;
};

acg.ext.cp_enable = function () {
    cc.director.setDisplayStats(false);
    // Create the touch listener layer
    var cp = cc.Layer.create();
    acg.ext._cp_layer = cp;
    acg.scene.addChild(cp, 100012138);

    // Create the controls
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
    acg.scene.schedule(function () {
        tl.setProgress(acg.time / acg.tot_time());
        btn._cp_paused = acg.paused;
        if (acg.paused) btn.drawPlay(); else btn.drawPause();
    }, 0);

    cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
            acg.ext._cp_swiping = false;
            if (!touch._startPoint) touch._startPoint = touch.getLocation();
            return true;
        },
        onTouchMoved: function (touch, event) {
            if (!acg.ext._cp_swiping && acg.ext.touch_swiping(touch)) {
                acg.ext._cp_swiping = true;
            }
            if (acg.ext._cp_swiping) {
                if (acg.ext._cp_shouldbepaused === null)
                    acg.ext._cp_shouldbepaused = acg.paused;
                acg.pause();
                tl.setProgress(tl.getProgress() + touch.getDelta().x / 600);
            }
        },
        onTouchEnded: function (touch, event) {
            if (!acg.ext._cp_swiping && acg.ext._cp_ctrls_showed) {
                acg.ext._cp_ctrls_showed = false;
                btn.runAction(acg.ac.parse(['//',
                    ['move-to', 0.15, cc.p(0.02, 0)],
                    ['fade-out', 0.15]
                ]));
                tl.runAction(acg.ac.parse(['//',
                    ['move-to', 0.15, cc.p(0.95, 0.08)],
                    ['fade-out', 0.15]
                ]));
            } else if (!acg.ext._cp_swiping) {
                acg.ext._cp_ctrls_showed = true;
                btn.runAction(acg.ac.parse(['//',
                    ['move-to', 0.15, cc.p(0.02, 0.02)],
                    ['fade-in', 0.15]
                ]));
                tl.runAction(acg.ac.parse(['//',
                    ['move-to', 0.15, cc.p(0.95, 0.1)],
                    ['fade-in', 0.15]
                ]));
            } else {
                if (!acg.ext._cp_shouldbepaused) acg.resume();
                acg.ext._cp_shouldbepaused = null;
            }
        }
    }, cp);
};
