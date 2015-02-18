var cc = cc || {};
var acg = acg || {};
acg.ext = acg.ext || {};

acg.ext._cp_layer = null;
acg.ext._cp_ctrls = [];
acg.ext._cp_ctrls_showed = false;
acg.ext._cp_swiping = false;
acg.ext._cp_swipemax = 25;  // The time travelled if swiped te whole width
// Whether the animation is paused at the time when dragging started
// Used in both the timeline and the swipe-to-seek functionality
acg.ext._cp_shouldbepaused = null;

acg.ext._cp_colourdisp_tag = 12138;
acg.ext._cp_danmakutypes = ['danmaku-sliding.png', 'danmaku-stktop.png', 'danmaku-stkbottom.png'];
// Yeah, I copied these from Bilibili's Android client...
// Forgive me for the imprecise RGB values...
acg.ext._cp_textcolours = [
    '#ffffff', '#ff0000', '#ffff00', '#00ff00', '#2299ff', '#dd00dd',
    '#2299ff', '#22ff00', '#000088', '#ffbb00', '#9900bb', '#55dddd', '#887700'];

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

// angleFrom and angleTo are in radians
acg.ext.pushArcVerts = function (verts, centre, radius, angleFrom, angleTo) {
    var segments = 25,
        coef = (angleTo - angleFrom) / segments;
    for (var i = 0; i <= segments; i++) {
        var rads = i * coef;
        verts.push(cc.p(
            radius * Math.cos(rads + angleFrom) + centre.x,
            radius * Math.sin(rads + angleFrom) + centre.y));
    }
};

// The menu system of Cocos is plump. We write a simple one instead.
acg.ext.toggle_menu = function (optionsCnt, callback) {
    var menu = cc.Node.create();
    var curidx = 0;
    menu.selectedIndex = function () { return curidx; };
    cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
            return (acg.ext._cp_ctrls_showed
                && acg.ext.is_touch_in_content(touch, event));
        },
        onTouchEnded: function (touch, event) {
            if (!acg.ext.is_touch_in_content(touch, event)) return;
            curidx = (curidx + 1) % optionsCnt;
            callback(curidx);
        }
    }, menu);
    return menu;
};

acg.ext.cp_danmakuipt = function (callback) {
    var di = cc.DrawNode.create();
    var di_w = acg.width * 0.88;
    var di_h = 24;
    var di_br = 4;  // Border radius
    di.setAnchorPoint(cc.p(0.5, 1));
    //di.drawRect(cc.p(di_br, di_h), cc.p(di_w - di_br, 0), cc.color.WHITE, 0);
    //di.drawRect(cc.p(0, di_h - di_br), cc.p(di_w, di_br), cc.color.WHITE, 0);
    var vertices = [];
    // Cocos will draw a line between each two neighbouring arcs for us.
    // (I drew a line, I drew a line for you... -- Yellow by Coldplay)
    acg.ext.pushArcVerts(vertices, cc.p(di_br, di_br), di_br, -Math.PI / 2, -Math.PI);
    acg.ext.pushArcVerts(vertices, cc.p(di_br, di_h - di_br), di_br, Math.PI, Math.PI / 2);
    acg.ext.pushArcVerts(vertices, cc.p(di_w - di_br, di_h - di_br), di_br, Math.PI / 2, 0);
    acg.ext.pushArcVerts(vertices, cc.p(di_w - di_br, di_br), di_br, 0, -Math.PI / 2);
    // Don't care about that underscore. It makes no effect, and is just a little faster.
    di.drawPoly_(vertices, cc.color.WHITE, 1, cc.color.BLACK);
    di.setContentSize(cc.size(di_w, di_h));

    // The comment display type selector
    var dtypecnt = acg.ext._cp_danmakutypes.length;
    var cmttyp_menu = acg.ext.toggle_menu(dtypecnt, function (idx) {
        console.log(idx);
        for (var i = 0; i < dtypecnt; i++)
            cmttyp_menu.getChildByTag(i).setVisible(i === idx);
    });
    cmttyp_menu.setAnchorPoint(cc.p(0, 1));
    cmttyp_menu.setPosition(cc.p(0, -5));
    cmttyp_menu.setContentSize(cc.size(60, 45));
    cmttyp_menu.setCascadeOpacityEnabled(true);
    di.setCascadeOpacityEnabled(true);
    di.addChild(cmttyp_menu);
    for (var i = 0; i < dtypecnt; i++) {
        var s = cc.Sprite.create(acg.ext._cp_danmakutypes[i]);
        s.setAnchorPoint(cc.p(0, 0));
        s.setVisible(i === 0);
        cmttyp_menu.addChild(s, 0, i);
    }
    // The comment text colour selector
    var tclcnt = acg.ext._cp_textcolours.length;
    var cmtcl_menu = acg.ext.toggle_menu(tclcnt, function (idx) {
        cmtcl_menu.getChildByTag(acg.ext._cp_colourdisp_tag)
            .setColor(cc.color(acg.ext._cp_textcolours[idx]));
    });
    cmtcl_menu.setAnchorPoint(cc.p(0, 1));
    cmtcl_menu.setPosition(cc.p(75, -6));
    cmtcl_menu.setContentSize(cc.size(60, 45));
    cmtcl_menu.setCascadeOpacityEnabled(true);
    di.addChild(cmtcl_menu);
    var colourdispbg = cc.LayerColor.create(cc.color(0, 0, 0));
    colourdispbg.setContentSize(cc.size(54, 40.5));
    colourdispbg.setPosition(cc.p(0, 3));
    cmtcl_menu.addChild(colourdispbg, 0);
    var colourdisp = cc.LayerColor.create(cc.color(acg.ext._cp_textcolours[0]));
    colourdisp.setContentSize(cc.size(48, 36));
    colourdisp.setPosition(cc.p(3, 6));
    cmtcl_menu.addChild(colourdisp, 1, acg.ext._cp_colourdisp_tag);

    cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
            var b = acg.ext._cp_ctrls_showed
                && acg.ext.is_touch_in_content(touch, event);
            if (b) {
                // Show the HTML input element.
                var ipt = document.getElementById('acg_cp_danmaku');
                var container = document.getElementById('Cocos2dGameContainer');
                ipt.style.display = '';
                ipt.style.position = 'absolute';
                ipt.style.top = '5%';
                ipt.style.left = (container.offsetLeft + 0.06 * container.clientWidth) + 'px';
                ipt.style.width = (0.88 * container.clientWidth) + 'px';
                ipt.style['font-size'] =
                    (16 / acg.height * container.clientHeight) + 'px';
                // XXX: focus() doesn't work if called directly.
                setTimeout(function () { ipt.focus(); }, 10);
                ipt.onkeyup = function (e) {
                    if (e.keyCode === 13) {
                        // Send the comment.
                        callback(acg.time,
                            cmttyp_menu.selectedIndex(),
                            acg.ext._cp_textcolours[cmtcl_menu.selectedIndex()],
                            e.target.value);
                        e.target.value = '';
                        di.hideInput();
                    }
                };
            }
            return b;
        }
    }, di);
    di.hideInput = function () {
        document.getElementById('acg_cp_danmaku').style.display = 'none';
    };
    return di;
};

// danmakuSendCallback tells CP how to send a comment.
// If undefined then the comment sending input box won't be shown.
acg.ext.cp_enable = function (danmakuSendCallback) {
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
    var bi = undefined;
    if (danmakuSendCallback) {
        bi = acg.ext.cp_danmakuipt(danmakuSendCallback);
        acg.ext._cp_ctrls[2] = bi;
        bi.setNormalizedPosition(cc.p(0.5, 1));
        bi.setOpacity(0);
        cp.addChild(bi);
    }
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
                var t = tl.getProgress()
                    + touch.getDelta().x / acg.width    // (delta-x)/(W)
                    * acg.ext._cp_swipemax / acg.tot_time();
                tl.setProgress(t < 0 ? 0 : t);
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
                if (bi) {
                    bi.runAction(acg.ac.parse(['//',
                        ['move-to', 0.15, cc.p(0.5, 1)],
                        ['fade-out', 0.15]
                    ]));
                    bi.hideInput();
                }
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
                if (bi) {
                    bi.runAction(acg.ac.parse(['//',
                        ['move-to', 0.15, cc.p(0.5, 0.95)],
                        ['fade-in', 0.15]
                    ]));
                }
            } else {
                if (!acg.ext._cp_shouldbepaused) acg.resume();
                acg.ext._cp_shouldbepaused = null;
            }
        }
    }, cp);
};
