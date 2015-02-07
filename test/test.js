var acg = acg || {};
acg.ext = acg.ext || {};

var initStage = function () {
    // 3s -> 8.5s
    acg.begin_offset(2);    // OFFSET 1
    acg.begin_offset(5);    // OFFSET 2
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
            ]/*,
            ['delay', 1],
            ['blink', 5, 4],
            ['flip-y', true],
            ['ease-sine-in-out',
                ['scale-to', 0.7, 3]
            ],
            ['ease-sine-in-out',
                ['scale-to', 0.7, 1]
            ]*/
        ]
    ));
    acg.end_offset();   // OFFSET 2
    // 1s -> 9.2s
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
    // 0s -> 2s
    acg.put(0.01, acg.img('h.png',
        {x: 0.3, y: 0.5, scale: 0.24},
        ['fade-out', 2]
    ));
    // 9s -> 10s
    acg.put(9, acg.img('h.png',
        {x: 0.35, y: 0.55, scale: 0.24},
        ['delay', 1]
    ));
    acg.put(3, acg.text(
        {x: 0.5, y: 0.5, fontsize: 30, text: 'Hi, there',
            colour: [64, 255, 0], zorder: 100},
        ['ease-sine-out', ['move-by', 2, acg.p(0, 0.2)]]
    ));
    acg.put(1, acg.rect(
        {x: 0.4, y: 0.4, width: 0.5, height: 0.3, colour: [128, 128, 192]},
        ['tint-to', 1, 255, 100, 100]
    ));
    acg.put(1, acg.text(
        {x: 0.6, y: 0.7, fontsize: 36, text: '400',
            colour: [64, 255, 255], zorder: 100},
        ['+',
            ['delay', 1],
            ['ease-cubic-out', ['go-number', 2, 800]],
            ['ease-cubic-in-out', ['go-number', 2, 0]],
            ['delay', 1],
            ['change-text', 'Well, bye bye'],
            ['delay', 1]
        ]
    ));
    acg.put(5, acg.ext.nametag('ME', 'Subtitle', 0.2, 0.12));
    acg.put(5, acg.ext.nametag('YOU', 'Subtitle', 0.6, 0.1));
    acg.put(6, acg.ext.speechbub('Haha', 0.2, 0.5, 0.5, 0, 1.3, -0.3, ['+',
        ['move-by', 2, cc.p(-0.1, 0)],
        ['delay', 2]
    ]));
    acg.put(5, acg.ext.stickman({x: 0.5, y: 0.2}, ['+',
        ['move-by', 2, cc.p(-0.2, 0)],
        ['delay', 3]
    ], {
        'head': ['+', ['delay', 2], ['rotate-by', 0.5, 45]],
        'leg1': ['rotate-by', 1, 30],
        'leg2': ['rotate-by', 0.5, -60],
        'arm1': ['rotate-by', 1, 30],
        'arm2': ['rotate-by', 1, -30]
    }));
    acg.ext.background(3, [255, 255, 99]);
    acg.ext.background(6, [128, 255, 128]);
    acg.end_offset();   // OFFSET 1
    // Place these commits after flushing all offsets
    // Or undefined behaviours are waiting for you!
    acg.ext.background_commit();
    acg.commit();
    acg.ext.cp_enable();
    acg.travel(0);
};

acg.bootstrap('game_canvas', 3 / 2, initStage);
