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
