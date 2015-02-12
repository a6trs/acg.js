var acg = acg || {};
acg.ext = acg.ext || {};

acg.ext.nametag_width = 0.25;
acg.ext.nametag_bigfontsize = 28;
acg.ext.nametag_smallfontsize = 18;

// 'sx' and 'sy' stands for starting X and Y.
acg.ext.nametag = function (title, subtitle, sx, sy, colour) {
    colour = colour || acg.colour.BLACK;
    if (colour[0]) colour = acg.colour(colour[0], colour[1], colour[2]);
    // 'l' stands for both 'line' and 'layer'
    var l = cc.LayerColor.create();
    l.setCascadeOpacityEnabled(true);
    var txt1 = cc.LabelTTF.create(title, 'Arial', acg.ext.nametag_bigfontsize);
    txt1.setAnchorPoint(cc.p(0, 0));
    txt1.setPosition(cc.p(0, 0));
    txt1.setColor(colour);
    l.addChild(txt1);
    var txt2 = cc.LabelTTF.create(subtitle, 'Arial', acg.ext.nametag_smallfontsize);
    txt2.setAnchorPoint(cc.p(0, 1));
    txt2.setPosition(cc.p(0, -1));
    txt2.setColor(colour);
    l.addChild(txt2);
    acg.init_matter(l,
        // FIXME: Opacity 0 doesn't work here...
        {x: sx, y: sy, ax: 0, ay: 0, opacity: 0.001, colour: colour,
            width: acg.ext.nametag_width, height: 1 / acg.height}, ['+',
        ['fade-in', 0.8],
        ['delay', 1.4],
        ['fade-out', 0.8]
    ]);
    return l._acg_id;
};
