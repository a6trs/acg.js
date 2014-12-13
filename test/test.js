var acg = acg || {};

acg.bootstrap('game_canvas');

var initStage = function () {
    acg.place(acg.img('h.png', {x: 0.618, y: 0.618, ax: 1, ay: 1, scale: 0.3}));
};

timer = setInterval(function () {
    if (cc.director && cc.director.getRunningScene()) {
        clearInterval(timer);
        initStage();
    }
}, 300);
