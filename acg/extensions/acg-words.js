var acg = acg || {};
acg.ext = acg.ext || {};

acg.ext._words_flow = [];
acg.ext._words_bg = null;
acg.ext._words_id = null;

acg.ext.words = function (time, text) {
    // We should put a space here if an empty string is passed,
    // or there will be some problems
    var r = {time: time + acg._cur_offset, text: text === '' ? ' ' : text};
    acg.ext._words_flow.push(r);
};

acg.ext.words_commit = function () {
    acg.sort(acg.ext._words_flow);
    var action = ['+', ['delay', acg.ext._words_flow[0].time]];
    var last = acg.ext._words_flow[acg.ext._words_flow.length - 1];
    acg.ext._words_flow.push({time: acg.tot_time()});
    for (var i = 0; i < acg.ext._words_flow.length - 1; i++) {
        var cur = acg.ext._words_flow[i];
        var next = acg.ext._words_flow[i + 1];
        action.push(['change-text', cur.text]);
        action.push(['delay', next.time - cur.time]);
    }
    acg.ext._words_bg = acg.rect(
        {x: 0, y: 0, colour: [255, 255, 255], opacity: 0.4,
            width: 1, height: 40 / acg.height, zorder: 10012137},
        ['delay', acg.tot_time()]
    );
    acg.ext._words_id = acg.text(
        {x: 0.5, y: 0, ax: 0.5, ay: 0, colour: [0, 0, 0],
            fontsize: 36, text: ' ', zorder: 10012138}, action);
    acg.put(0, acg.ext._words_bg);
    acg.put(0, acg.ext._words_id);
};
