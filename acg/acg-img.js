var acg = acg || {};
acg.ac = acg.ac || {};

acg.img = function (img, attr, action) {
    var s = cc.Sprite.create(img);
    if (attr.x && attr.y) s.setNormalizedPosition(attr.x, attr.y);
    if (attr.ax && attr.ay) s.setAnchorPoint(attr.ax, attr.ay);
    if (attr.scale) s.setScale(attr.scale);
    if (action) s._acg_action = acg.ac.parse(action);
    s._acg_id = acg.matters.push(s) - 1;
    return s._acg_id;
};
