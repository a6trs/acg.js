var acg = acg || {};

// Wrap Cocos2d-x functions
acg.p = cc.p;
acg.colour = cc.color;
// ... and constants
acg.ALIGN_LEFT = cc.TEXT_ALIGNMENT_LEFT;
acg.ALIGN_CENTRE = cc.TEXT_ALIGNMENT_CENTER;    // also for vertical ones
acg.ALIGN_RIGHT = cc.TEXT_ALIGNMENT_RIGHT;
acg.ALILGN_TOP = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
acg.ALILGN_BOTTOM = cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM;

acg.matters = [];

// All function to be called when initialized can be put here
// They will be called in acg.bootstrap (acg-disp.js)
acg._init_callbacks = [];

acg.place = function (id) {
    var s = acg.matters[id];
    if (s) {
        s._acg_parent.addChild(s);
        acg.apply_attr(s, s._acg_attr);
        if (s._acg_action) s._acg_action.startWithTarget(s);
    }
};

acg.sweep = function (id) {
    var s = acg.matters[id];
    if (s) {
        s._acg_parent.removeChild(s, false);
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
    if (attr.x == undefined && attr.y == undefined) attr.x = attr.y = 0.5;
    if (attr.ax == undefined && attr.ay == undefined) attr.ax = attr.ay = 0.5;
    s.setNormalizedPosition(attr.x, attr.y);
    // FIXME: attr.ax and attr.ay don't work for layers (rects)
    s.setAnchorPoint(attr.ax, attr.ay);
    s.setScale(attr.scale || 1);
    // FIXME: attr.colour doesn't affect sprites
    if (attr.colour) s.setColor(cc.color.apply(null, attr.colour));
    else s.setColor(cc.color.WHITE);
    s.setOpacity(attr.opacity * 255.0 || 255);
    s.setRotation(attr.rotation || 0);
    s.setLocalZOrder(attr.zorder || 0);
    s.setVisible(attr.visible || true);   // deprecated

    // Call setContentSize() directly when creating the element.
    // Use if need to force update.
    if (s.setContentSize !== undefined && (attr.f_width && attr.f_height)) {
        s.setContentSize(cc.size(
            (attr.f_width || 1) * acg.width,
            (attr.f_height || 1) * acg.height));
    }

    // Class-specific attributes
    if (s instanceof cc.LabelTTF) {
        s.setFontName(attr.fontname || 'Arial');
        s.setFontSize(attr.fontsize || 24); // The default is 16 in Cocos2d-JS
        s.setHorizontalAlignment(attr.halign || acg.ALIGN_CENTRE);
        s.setVerticalAlignment(attr.valign || acg.ALIGN_CENTRE);
        s.setDimensions(attr.size || cc.size(0, 0));
        s.setString(attr.text || 'WHAT DO I NEED TO SAY??');
    }
    if (s instanceof cc.Sprite) {
        s.setFlippedX(attr.flipx || false);
        s.setFlippedY(attr.flipy || false);
    } else if (s instanceof cc.Layer) {
        attr.width = attr.width || 1;
        attr.height = attr.height || 1;
        s._setWidth(attr.width * acg.width);
        s._setHeight(attr.height * acg.height);
    }
};
