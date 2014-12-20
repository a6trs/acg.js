var acg = acg || {};
acg.ac = acg.ac || {};

acg.img = function (img, attr, action) {
    var s = cc.Sprite.create(img);
    acg.apply_attr(s, attr);
    if (action) s._acg_action = acg.ac.parse(action);
    s._acg_id = acg.matters.push(s) - 1;
    s._acg_attr = attr;
    return s._acg_id;
};
