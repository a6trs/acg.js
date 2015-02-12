var acg = acg || {};
acg.ext = acg.ext || {};

acg.ext.speechbub_borderw = 3;
acg.ext.speechbub_horpadding = 6;
acg.ext.speechbub_fontsize = 24;

// 'sx' and 'sy' stands for starting X and Y.
// 'lex' and 'ley' stands for the line's ending X and Y.
acg.ext.speechbub = function (text, sx, sy, ax, ay, lex, ley, actions, colour) {
    colour = colour || acg.colour.BLACK;
    if (colour[0]) colour = acg.colour(colour[0], colour[1], colour[2]);
    var d = cc.DrawNode.create();
    d.setCascadeOpacityEnabled(true);
    var txt = cc.LabelTTF.create(text, 'Arial', acg.ext.speechbub_fontsize);
    txt.setAnchorPoint(cc.p(0, 0));
    txt.setPosition(cc.p(0, 0));
    txt.setColor(colour);
    d.addChild(txt);
    var sz = txt.getContentSize();
    var w = sz.width + acg.ext.speechbub_horpadding * 2,
        h = sz.height;
    d.drawSegment(cc.p(w * ax, h * ay), cc.p(w * lex, h * ley),
        acg.ext.speechbub_borderw / 2, colour);
    d.setContentSize(cc.size(w, h));
    acg.init_matter(d,
        {x: sx, y: sy, ax: ax, ay: ay, opacity: 1}, actions);
    return d._acg_id;
};
