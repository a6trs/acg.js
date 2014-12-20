var acg = acg || {};

acg.EVENT_ENTER = 0;
acg.EVENT_LEAVE = 1;
acg._flow = [];
acg._flow_tmp = [];
// The index found in flow in the last update() call
acg._last_flow_idx = -1;

acg.put = function (time, id) {
    acg.matters[id]._acg_entertime = time;
    acg._flow_tmp.push({time: time, type: acg.EVENT_ENTER, id: id});
    acg._flow_tmp.push({time: time + acg.action_duration(id), type: acg.EVENT_LEAVE, id: id});
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
};

acg.commit = function () {
    // All algorithmic stuff
    // Sort the arrays
    acg._flow = [];
    acg.sort(acg._flow_tmp);
    var last_time = -1;
    for (var i = 0; i < acg._flow_tmp.length; i++) {
        var cur = acg._flow_tmp[i];
        if (Math.abs(cur.time - last_time) <= 0.01) {
            acg._flow[acg._flow.length - 1].events.push(cur);
        } else {
            acg._flow.push({time: cur.time, events: [cur]});
            last_time = cur.time;
        }
    }
    acg._flow[-1] = {present: []};
    for (var i = 0; i < acg._flow.length; i++) {
        var cur = acg._flow[i];
        // http://stackoverflow.com/q/597588
        var present = acg._flow[i - 1].present.slice();
        cur.events.forEach(function (e) {
            if (e.type === acg.EVENT_LEAVE) {
                for (var j = 0; j < present.length; j++)
                    if (present[j] === e.id) present[j] = -1;
            } else {
                present.push(e.id);
            }
        });
        // Test data: [1, 0, 0, 0, 4, 2, 0, 9, 0] remove all zeroes
        cur.present = [];
        for (var j = 0; j < present.length; j++) {
            if (present[j] !== -1) cur.present.push(present[j]);
        }
        acg._flow[i] = cur;
    }
    console.log();
};

acg.travel = function (time) {
    var idx = acg.find(acg._flow, acg.time);
    if (idx !== -1) {
        acg._flow[idx].present.forEach(function (id) {
            acg.sweep(id);
            console.log('sweep: ' + id);
        });
    }
    idx = acg.find(acg._flow, time);
    if (idx !== -1) {
        acg._flow[idx].present.forEach(function (id) {
            acg.place(id);
        });
    }
    acg._last_flow_idx = acg.find(acg._flow, time);
    acg.time = time;
    cc.director.getRunningScene().update = acg.update;
    cc.director.getRunningScene().scheduleUpdate();
};

acg.update = function (dt) {
    acg.time += dt;
    var idx = acg.find(acg._flow, acg.time);
    if (acg._last_flow_idx !== idx) {
        acg._flow[idx].events.forEach(function (e) {
            if (e.type === acg.EVENT_LEAVE) {
                acg.sweep(e.id);
                console.log('flow-sweep: ' + e.id);
            } else {
                acg.place(e.id);
                console.log('flow-place: ' + e.id);
            }
        });
        acg._last_flow_idx = idx;
    }
    acg._flow[idx].present.forEach(function (id) {
        var m = acg.matters[id];
        m._acg_action.step(acg.time - m._acg_entertime - m._acg_action.getElapsed());
    });
};
