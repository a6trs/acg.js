var acg = acg || {};
acg.ext = acg.ext || {};

acg.ext._233_fontname = 'Arial';
acg.ext._233_fontsize = 26;
acg.ext._233_lineh = 32;
acg.ext._233s = {};

acg.ext._233_add = function (time, text, colour, type) {
    js233.addComment(time, text, colour, type);
};

acg.ext._233_commit = function () {
    var ops = js233.getAll();
};

acg.ext._233_addSliding = function (line, text, duration, colour) {
    colour = colour || acg.colour.WHITE;
    var lbl = cc.LabelTTF.create(text, acg.ext._233_fontname, acg.ext._233_fontsize);
    lbl.setLocalZOrder(2333333);
    lbl.setAnchorPoint(cc.p(0, 1));
    lbl.setNormalizedPositionX(1);
    lbl.setNormalizedPositionY(1 - (line * acg.ext._233_lineh) / acg.height);
    lbl.setColor(colour);
    lbl.runAction(cc.sequence(
        cc.moveBy(duration, cc.p(-(1 + lbl.getContentSize().width / acg.width), 0)),
        cc.removeSelf()));
    acg.scene.addChild(lbl);
};

acg.ext._233_addSticky = function (type, line, text, duration, colour) {
    colour = colour || acg.colour.WHITE;
    var lbl = cc.LabelTTF.create(text, acg.ext._233_fontname, acg.ext._233_fontsize);
    lbl.setLocalZOrder(2333333);
    if (type === 1) {
        // Top-sticky
        lbl.setAnchorPoint(cc.p(0.5, 1));
        lbl.setNormalizedPosition(cc.p(0.5, 1 - line * acg.ext._233_lineh / acg.width));
    } else id (type === 2) {
        // Bottom-sticky
        lbl.setAnchorPoint(cc.p(0.5, 0));
        lbl.setNormalizedPosition(cc.p(0.5, line * acg.ext._233_lineh / acg.width));
    } else {
        console.log('acg.ext._233_addSticky: Invalid type T^T');
        return;
    }
    lbl.setColor(colour);
    lbl.runAction(cc.sequence(cc.delayTime(duration), cc.removeSelf()));
    acg.scene.addChild(lbl);
};
