var acg = acg || {};

// Wrap Cocos2d-x functions
acg.p = cc.p;
acg.colour = cc.color;

acg.matters = [];

acg.time = 0;

acg.place = function (id) {
    var s = acg.matters[id];
    if (s) {
        cc.director.getRunningScene().addChild(s);
        acg.apply_attr(s, s._acg_attr);
        if (s._acg_action) s._acg_action.startWithTarget(s);
    }
};

acg.sweep = function (id) {
    var s = acg.matters[id];
    if (s) {
        s.removeFromParent(false);
    }
};

acg.action_duration = function (id) {
    var _ref;   // Let's learn from CoffeeScript!
    return (_ref = acg.matters[id]._acg_action) ? _ref.getDuration() : 0;
};

acg.matter = function (id) {
    return acg.matters[id];
};

acg.apply_attr = function (s, attr) {
    if (!(attr.x && attr.y)) attr.x = attr.y = 0.5;
    if (!(attr.ax && attr.ay)) attr.ax = attr.ay = 0.5;
    s.setNormalizedPosition(attr.x, attr.y);
    s.setAnchorPoint(attr.ax, attr.ay);
    s.setScale(attr.scale || 1);
    // FIXME: attr.colour doesn't affect sprites
    s.setColor(cc.color.apply(null, attr.colour) || cc.color.WHITE);
    s.setOpacity(attr.opacity * 255.0 || 255);
    s.setRotation(attr.rotation || 0);
    s.setFlippedX(attr.flipx || false);
    s.setFlippedY(attr.flipy || false);
    s.setLocalZOrder(attr.zorder || 0);
    s.setVisible(attr.visible || true);   // deprecated
};
