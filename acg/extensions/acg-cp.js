var cc = cc || {};
var acg = acg || {};
acg.ext = acg.ext || {};

acg.ext._cp_layer = null;
acg.ext._cp_ctrls = [];
acg.ext._cp_ctrls_showed = false;

acg.ext.cp_enable = function () {
    cc.director.setDisplayStats(false);
    // Create the touch listener layer
    var cp = cc.Layer.create();
    acg.ext._cp_layer = cp;
    cc.director.getRunningScene().addChild(cp, 1000);

    // Create the controls
    var size = cc.director.getVisibleSize();
    var btn = cc.DrawNode.create();
    acg.ext._cp_ctrls[0] = btn;
    btn.setNormalizedPosition(cc.p(0, -0.02));
    btn.setAnchorPoint(cc.p(0, 0));
    btn.setOpacity(0);
    cp.addChild(btn);
    var playbtn_r = size.height * 0.1;
    var offset = size.height * 0.02;
    btn.drawDot(cc.p(playbtn_r + offset, playbtn_r + offset),
        playbtn_r, cc.color(255, 255, 255, 128));
    btn.drawPoly([
        cc.p(offset + playbtn_r * 0.7113, offset + playbtn_r * 1.5),
        cc.p(offset + playbtn_r * 0.7113, offset + playbtn_r * 0.5),
        cc.p(offset + playbtn_r * 1.5774, offset + playbtn_r)
    ], cc.color(255, 255, 255, 128), 1, cc.color(0, 0, 0, 255));

    cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan: function (touch, event) {
            if (acg.ext._cp_ctrls_showed) {
                acg.ext._cp_ctrls_showed = false;
                btn.runAction(acg.ac.parse(['//',
                    ['move-to', 0.15, cc.p(0, -0.02)],
                    ['fade-out', 0.15]
                ]));
            } else {
                acg.ext._cp_ctrls_showed = true;
                btn.runAction(acg.ac.parse(['//',
                    ['move-to', 0.15, cc.p(0, 0)],
                    ['fade-in', 0.15]
                ]));
            }
        }
    }, cp);
};
