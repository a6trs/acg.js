var acg = acg || {};
acg.ext = acg.ext || {};

acg.ext._words_flow = [];
acg.ext._words_id = null;
acg.ext._words_colour = [255, 255, 255];

var colourEquals = function (c1, c2) {
    return c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2];
};

acg.ext.words_colour = function (r, g, b) {
    acg.ext._words_colour = [r, g, b];
};

acg.ext.words = function (time, text) {
    // We should put a space here if an empty string is passed,
    // or there will be some problems
    var r = {
        time: time + acg._cur_offset,
        text: text === '' ? ' ' : text,
        colour: acg.ext._words_colour
    };
    acg.ext._words_flow.push(r);
};

acg.ext.words_commit = function () {
    acg.sort(acg.ext._words_flow);
    var action = ['+', ['delay', acg.ext._words_flow[0].time]];
    var last = acg.ext._words_flow[acg.ext._words_flow.length - 1];
    acg.ext._words_flow.push({time: acg.tot_time(), colour: [0, 0, 0]});
    for (var i = 0; i < acg.ext._words_flow.length - 1; i++) {
        var cur = acg.ext._words_flow[i];
        var next = acg.ext._words_flow[i + 1];
        action.push(['change-text', cur.text]);
        action.push(['delay', next.time - cur.time]);
        if (!colourEquals(cur.colour, next.colour))
            action.push(['tint-to', 0.001, next.colour[0], next.colour[1], next.colour[2]]);
    }
    acg.ext._words_id = acg.text(
        {x: 0.5, y: 0, ax: 0.5, ay: 0,
            colour: acg.ext._words_flow[0].colour,
            fontsize: 26, text: ' ', zorder: 10012138}, action);
    acg.put(0, acg.ext._words_id);
};
