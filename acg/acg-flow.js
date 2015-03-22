var acg = acg || {};

acg.EVENT_ENTER = 0;
acg.EVENT_LEAVE = 1;
acg._flow = [];
acg._flow_tmp = [];
// The index found in flow in the last update() call
acg._last_flow_idx = -1;

acg.time = 0;
acg.paused = true;
acg.timescale = 1;
acg._tottime = 0;   // only calculated after a commit() call

acg._offsets = [];
acg._cur_offset = 0;

acg._onpause_callbacks = [];
acg._onresume_callbacks = [];

acg.putOne = function (time, id) {
    time += acg._cur_offset;
    acg.matters[id]._acg_entertime = time;
    acg._flow_tmp.push({time: time, type: acg.EVENT_ENTER, id: id});
    acg._flow_tmp.push({time: time + acg.action_duration(id), type: acg.EVENT_LEAVE, id: id});
};

acg.put = function (time, ids) {
    if (isFinite(ids)) acg.putOne(time, ids);
    else if (typeof ids.length !== 'undefined') {
        // Does all browsers support forEach?
        for (var i = 0; i < ids.length; i++) acg.putOne(time, ids[i]);
    }
};

acg.begin_offset = function (offset) {
    acg._cur_offset += offset;
    acg._offsets.push(offset);
};

acg.end_offset = function () {
    acg._cur_offset -= acg._offsets.pop();
};

// Sorts an array by time.
acg.sort = function (a, l, r) {
    if (l === undefined) { l = 0; r = a.length - 1; }
    var i = l, j = r, x = a[(l + r) >> 1].time, t;
    while (i <= j) {
        while (a[i].time < x) i++;
        while (a[j].time > x) j--;
        if (i <= j) {
            t = a[i]; a[i] = a[j]; a[j] = t;
            i++; j--;
        }
    }
    if (i < r) acg.sort(a, i, r);
    if (j > l) acg.sort(a, l, j);
};

// Finds a given number in a sorted array using the binary chop method.
// I'm sorry, but I don't know how it works exactly. It just passes the test.
// Why should we +1 and -1 here and there??
acg.find = function (a, t) {
    if (t < a[0].time) return -1;
    var lo = 0, hi = a.length - 1;
    while (lo < hi - 1) {
        var mid = (lo + hi) >> 1;
        if (a[mid].time >= t) hi = mid;
        else lo = mid;
    }
    if (a[lo + 1].time === t) lo++; // What the...?
    while (lo > 0 && a[lo].time === a[lo - 1].time) lo--;
    return lo;
};

acg.tot_time = function () {
    if (acg._tottime > 0) return acg._tottime;
    var max = -1;
    for (f in acg._flow_tmp) if (f.time > max) max = f.time;
    return max;
};

acg.commit = function () {
    // All algorithmic stuff
    // Sort the arrays
    acg._flow = [];
    acg.sort(acg._flow_tmp);
    acg._tottime = acg._flow_tmp[acg._flow_tmp.length - 1];
    // Merge events happening at the same time
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
    // Post-process: calculate whether each matter is present at a given time
    acg._flow[-1] = {present: []};
    for (var i = 0; i < acg._flow.length; i++) {
        var cur = acg._flow[i];
        // http://stackoverflow.com/q/597588
        var present = acg._flow[i - 1].present.slice();
        for (e in cur.events) {
            if (e.type === acg.EVENT_LEAVE) {
                for (var j = 0; j < present.length; j++)
                    if (present[j] === e.id) present[j] = -1;
            } else {
                present.push(e.id);
            }
        };
        // Test data: [1, 0, 0, 0, 4, 2, 0, 9, 0] remove all zeroes
        cur.present = [];
        for (var j = 0; j < present.length; j++) {
            if (present[j] !== -1) cur.present.push(present[j]);
        }
        acg._flow[i] = cur;
    }
};

// Seek to any time.
acg.travel = function (time) {
    // Remove all present matters
    var idx = acg.find(acg._flow, acg.time);
    if (idx !== -1)
        for (id in acg._flow[idx].present) acg.sweep(id);
    // Place all matters that should be present
    idx = acg.find(acg._flow, time);
    if (idx !== -1)
        for (id in acg._flow[idx].present) acg.place(id);
    acg._last_flow_idx = acg.find(acg._flow, time);
    acg.time = time;
    acg.update(0);  // Redraw the whole stage
    acg.update(0);  // It **has** to be done twice - why?
};

acg.update = function (dt) {
    acg.time += dt * acg.timescale;
    if (acg.time > acg.tot_time()) {
        acg.time = acg.tot_time();
        acg.pause();
    }
    var idx = acg.find(acg._flow, acg.time);
    if (acg._last_flow_idx !== idx) {
        // New fellows are coming or present guys are leaving
        for (e in acg._flow[idx].events) {
            if (e.type === acg.EVENT_LEAVE) {
                acg.sweep(e.id);
            } else {
                acg.place(e.id);
            }
        }
        acg._last_flow_idx = idx;
    }
    // Update all actions
    for (id in acg._flow[idx].present) {
        var m = acg.matters[id];
        m._acg_action.step(acg.time - m._acg_entertime - m._acg_action.getElapsed());
    }
};

acg.pause = function () {
    if (!acg.paused) {
        acg.paused = true;
        acg.scene.unscheduleUpdate();
        for (f in acg._onpause_callbacks) f();
    }
};

acg.resume = function () {
    if (acg.paused) {
        acg.paused = false;
        acg.scene.scheduleUpdate();
        for (f in acg._onresume_callbacks) f();
    }
};

acg.set_timescale = function (ts) {
    // TODO: defensive argument type check.
    // XXX: Should negative timescales be allowed?
    acg.timescale = ts;
};

acg._init_callbacks.push(function () {
    acg.scene.update = acg.update;
    acg.resume();
});
