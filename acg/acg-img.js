var acg = acg || {};

acg.img = function (img, attr) {
    var s = cc.Sprite.create(img);
    if (attr.x && attr.y) s.setNormalizedPosition(attr.x, attr.y);
    if (attr.ax && attr.ay) s.setAnchorPoint(attr.ax, attr.ay);
    if (attr.scale) s.setScale(attr.scale);
    s._acg_id = acg.matters.push(s) - 1;
    return s._acg_id;
};
