var acg = acg || {};
acg.ext = acg.ext || {};

//////// DANMAKU PART ////////
acg.ext._233_add(0.1, 'xxx', cc.color.WHITE, js233.CMT_SLIDING);
acg.ext._233_add(0.4, 'yyy', cc.color.RED, js233.CMT_SLIDING);
acg.ext._233_add(0.2, 'cccc', cc.color.WHITE, js233.CMT_TOP_STICKY);
acg.ext._233_add(1, 'zzzz', cc.color.WHITE, js233.CMT_TOP_STICKY);
acg.ext._233_add(1.6, 'tttr', cc.color.YELLOW, js233.CMT_BOTTOM_STICKY);
acg.ext._233_add(3, 'ffff', cc.color.YELLOW, js233.CMT_SLIDING);
acg.ext._233_add(3.8, 'aaa', cc.color.GREEN, js233.CMT_SLIDING);
acg.ext._233_add(5, 'QAQ', cc.color.GRAY, js233.CMT_SLIDING);
//////////////////////////////

var initStage = function () {
    acg.put(0, acg.img('h.png', {scale: 0.4}, ['delay', 4]));
    acg.commit();
    acg.ext.cp_enable(function (time, type, colour, cmt) {
        alert(time + '\n' + type + ' ' + colour + '\n' + cmt);
    });
    acg.ext._233_commit();
    acg.travel(0);
};

acg.bootstrap('game_canvas', 3 / 2, initStage);
