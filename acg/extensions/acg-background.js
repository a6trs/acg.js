var acg = acg || {};
acg.ext = acg.ext || {};

acg.ext._background_flow = [];
acg.ext._background_id = null;

acg.ext.background = function (time, colour, dur) {
    var r = {time: time + acg._cur_offset, colour: colour, duration: dur || 0.2};
    acg.ext._background_flow.push(r);
};

acg.ext.background_commit = function () {
    acg.sort(acg.ext._background_flow);
    var action = ['+', ['delay', acg.ext._background_flow[0].time]];
    var last = acg.ext._background_flow[acg.ext._background_flow.length - 1];
    acg.ext._background_flow.push({time: acg.tot_time()});
    for (var i = 0; i < acg.ext._background_flow.length - 1; i++) {
        var cur = acg.ext._background_flow[i];
        var next = acg.ext._background_flow[i + 1];
        if (cur.time + cur.duration > next.time) {
            action.push(['tint-to', next.time - cur.time,
                cur.colour[0], cur.colour[1], cur.colour[2]]);
        } else {
            action.push(['tint-to', cur.duration,
                cur.colour[0], cur.colour[1], cur.colour[2]]);
            action.push(['delay', next.time - cur.time - cur.duration]);
        }
    }
    // Create the background image (okay, sprite)
    acg.ext._background_id = acg.rect(
        {x: 0, y: 0, colour: [0, 0, 0]}, action);
    acg.put(0, acg.ext._background_id);
};
