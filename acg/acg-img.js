var acg = acg || {};
acg.ac = acg.ac || {};

acg.img = function (img, attr, action) {
    var s = cc.Sprite.create(img);
    if (attr.x && attr.y) s.setNormalizedPosition(attr.x, attr.y);
    if (attr.ax && attr.ay) s.setAnchorPoint(attr.ax, attr.ay);
    if (attr.scale) s.setScale(attr.scale);
    // FIXME: attr.colour doesn't affect sprites
    if (attr.colour) s.setColor(cc.color.apply(null, attr.colour));
    if (attr.opacity) s.setOpacity(attr.opacity * 255.0);
    if (attr.flipx) s.setFlippedX(attr.flipx);
    if (attr.flipy) s.setFlippedY(attr.flipy);
    if (attr.zorder) s.setLocalZOrder(attr.zorder);
    if (attr.visible) s.setVisible(attr.visible);   // deprecated
    if (action) s._acg_action = acg.ac.parse(action);
    s._acg_id = acg.matters.push(s) - 1;
    return s._acg_id;
};
