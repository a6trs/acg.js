var acg = acg || {};

acg.matters = [];

acg.place = function (id) {
    var s = acg.matters[id];
    if (s) {
        cc.director.getRunningScene().addChild(s);
        if (s._acg_action) s.runAction(s._acg_action);
    }
};

acg.matter = function (id) {
    return acg.matters[id];
}

acg.put = function (time, id) {
}
