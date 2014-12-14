var acg = acg || {};

var initStage = function () {
    acg.put(3, acg.img('h.png',
        {x: 0.618, y: 0.618, ax: 1, ay: 1, scale: 0.3, zorder: 3},
        ['+',
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
        ]
    ));
    acg.put(1, acg.img('h.png',
        {x: 0.5, y: 0.5, scale: 0.18, opacity: 0.6, zorder: 10},
        ['+',
            ['bezier-to', 3.6, [cc.p(0.5, 0.3), cc.p(0.6, 0.8), cc.p(0.6, 0.3)]],
            ['jump-by', 1.6, cc.p(0, 0), 0.05, 8],
            ['repeat',
                ['ease-bounce-out', ['move-by', 1, cc.p(0, -0.1)]]
            , 3]
        ]
    ));
    acg.put(0, acg.img('h.png',
        {x: 0.3, y: 0.5, scale: 0.24, colour: [0, 255, 0]},
        ['delay', 10]
    ));
    acg.travel(0);
};

acg.bootstrap('game_canvas', initStage);
