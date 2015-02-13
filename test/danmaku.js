var acg = acg || {};
acg.ext = acg.ext || {};

//////// DANMAKU PART ////////
//////////////////////////////

var initStage = function () {
    acg.put(0, acg.img('h.png', {scale: 0.4}, ['delay', 4]));
    acg.commit();
    acg.ext.cp_enable();
    acg.travel(0);
};

acg.bootstrap('game_canvas', 3 / 2, initStage);
