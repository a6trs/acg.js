var acg = acg || {};
acg.ac = acg.ac || {};

acg.init_matter = function (m, attr, action, parent) {
    acg.apply_attr(m, attr);
    if (action) m._acg_action = acg.ac.parse(action);
    else m._acg_action = acg.emptyAction;
    if (parent) {
        m._acg_parent = parent;
        // The child's action duration should be as long as its parent's
        var d1 = 0, d2 = m._acg_action.getDuration();
        if ((_ref = parent._acg_action)
                && (d1 = _ref.getDuration()) > d2) {
            m._acg_action = cc.Sequence.create(m._acg_action, cc.DelayTime.create(d1 - d2));
        }
    } else {
        m._acg_parent = acg.scene;
    }
    m._acg_id = acg.matters.push(m) - 1;
    m._acg_attr = attr;
};

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

acg.rect = function (attr, action) {
    var s = cc.LayerColor.create();
    acg.init_matter(s, attr, action);
    return s._acg_id;
};
