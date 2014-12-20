var acg = acg || {};
acg.ac = acg.ac || {};

acg.init_matter = function (m, attr, action) {
    acg.apply_attr(m, attr);
    if (action) m._acg_action = acg.ac.parse(action);
    m._acg_id = acg.matters.push(m) - 1;
    m._acg_attr = attr;
}

acg.img = function (img, attr, action) {
    var s = cc.Sprite.create(img);
    acg.init_matter(s, attr, action);
    return s._acg_id;
};

acg.text = function (attr, action) {
    var s = cc.LabelTTF.create();
    acg.init_matter(s, attr, action);
    return s._acg_id;
};
