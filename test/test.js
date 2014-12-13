var acg = acg || {};

acg.bootstrap('game_canvas');

var initStage = function () {
    acg.place(acg.img('h.png', {x: 0.618, y: 0.618, ax: 1, ay: 1, scale: 0.3}));
    //acg.matter(0).runAction(cc.moveTo(1, cc.p(0.4, 0.4)));
    //acg.matter(0).runAction(cc.jumpBy(1, cc.p(0, 0), 0.05, 3));
    actions = ['+',
        ['move-to', 1, cc.p(0.6, 0.4)],
        ['jump-by', 1, cc.p(0, 0.3), 0.05, 3],
        ['//',
            ['rotate-by', 1.5, 180],
            ['fade-to', 1.5, 108]
        ],
        ['ease-elastic-out',
            ['move-by', 2, cc.p(-0.4, -0.4)]
        ],
        ['delay', 1],
        ['blink', 5, 4],
        ['flip-y', true],
        ['ease-sine-in-out',
            ['scale-to', 0.7, 3]
        ],
        ['ease-sine-in-out',
            ['scale-to', 0.7, 1]
        ]
    ];
    acg.matter(0).runAction(acg.ac.parse(actions));
};

timer = setInterval(function () {
    if (cc.director && cc.director.getRunningScene()) {
        clearInterval(timer);
        initStage();
    }
}, 300);
