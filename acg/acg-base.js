var acg = acg || {};

// Wrap Cocos2d-x functions
acg.p = cc.p;
acg.colour = cc.color;

acg.matters = [];

acg.entertime = [];
acg.leavetime = [];

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
    acg.entertime.push({time: time, id: id});
    acg.leavetime.push({time: time + acg.action_duration(id), id: id});
};

acg.sort = function (a) {
    // TODO: Use quick sort instead of bubble sort
    var i, j, t;
    for (i = 0; i < a.length - 1; i++)
        for (j = i + 1; j < a.length; j++)
            if (a[i].time > a[j].time) {
                t = a[i]; a[i] = a[j]; a[j] = t;
            }
};

acg.find = function (a, t) {
    // TODO: Use binary chop method instead of linear scan
    if (t < a[0].time) return -1;
    var i = 0;
    while (i < a.length && t >= a[i].time) i++;
    i--;
    while (i > 0 && a[i - 1].time === a[i].time) i--;
    return i;
}

acg.commit = function () {
    // Sort the arrays
    acg.sort(acg.entertime);
    acg.sort(acg.leavetime);
};

acg.travel = function (time) {
    cc.director.getRunningScene().scheduleOnce(function() {
        acg.place(id);
    }, time);
    cc.director.getRunningScene().scheduleOnce(function() {
        acg.sweep(id);
    }, time + acg.action_duration(id));
};
