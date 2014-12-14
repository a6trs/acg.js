var acg = acg || {};

// Wrap Cocos2d-x functions
acg.p = cc.p;
acg.colour = cc.color;

acg.matters = [];

acg.place = function (id) {
    var s = acg.matters[id];
    if (s) {
        cc.director.getRunningScene().addChild(s);
        if (s._acg_action) s.runAction(s._acg_action);
        // TODO: Remove these after implementing travel()
        s._acg_action._firstTick = false;
        s._acg_action._elapsed = 3;
    }
};

acg.sweep = function (id) {
    var s = acg.matters[id];
    if (s) {
        s.removeFromParent();
    }
};

acg.action_duration = function (id) {
    var _ref;   // Let's learn from CoffeeScript!
    return (_ref = acg.matters[id]._acg_action) ? _ref.getDuration() : 0;
};

acg.matter = function (id) {
    return acg.matters[id];
};

acg.put = function (time, id) {
    cc.director.getRunningScene().scheduleOnce(function() {
        acg.place(id);
    }, time);
    cc.director.getRunningScene().scheduleOnce(function() {
        acg.sweep(id);
    }, time + acg.action_duration(id));
};

acg.travel = function (time) {
};
