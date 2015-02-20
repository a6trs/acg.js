var acg = acg || {};
acg.ext = acg.ext || {};

acg.ext._233_recs = [];
acg.ext._233_fontname = 'Arial';
acg.ext._233_fontsize = 26;
acg.ext._233_lineh = 32;
acg.ext._233_layer = null;
acg.ext._233_firstresume = true;

acg.ext._233_onpause_reg = function () {
    acg.ext._233_layer.getChildren().forEach(function (e) { e.pause(); });
};

acg.ext._233_onresume_reg = function () {
    if (acg.ext._233_firstresume) {
        acg.ext._233_firstresume = false;
        return;
    }
    // If the comment has already been shown, then let it go
    // Otherwise, remove it and use comments at current time instead.
    // XXX: This has to be done twice, or some comments won't disappear QwQ
    for (var i = 0; i < 2; i++) acg.ext._233_layer.getChildren().forEach(function (e) {
        if (e.isVisible()) e.resume();
        else e.removeFromParent(true);
    });
    // Find comments starting at time <acg.time>
    js233.reset();
    acg.sort(acg.ext._233_recs);
    var validRecs = acg.ext._233_recs.slice(acg.find(acg.ext._233_recs, acg.time) + 1);
    validRecs.forEach(function (a) {
        // 'a' stands for both array and arguments.
        js233.addComment.apply(null, [a.time - acg.time].concat(a.args));
    });
    var ops = js233.getOperations();
    acg.ext._233_doops(ops);
};

acg.ext._233_enable = function () {
    acg._onpause_callbacks.push(acg.ext._233_onpause_reg);
    acg._onresume_callbacks.push(acg.ext._233_onresume_reg);
};

acg.ext._233_add = function (time, text, colour, type) {
    // The 'time' field is used for acg.sort()
    acg.ext._233_recs.push({time: time, args: [text, colour, type]});
    js233.addComment(time, text, colour, type);
};

acg.ext._233_doops = function (ops) {
    ops.forEach(function (op) {
        switch (op.type) {
        case js233.CMT_SLIDING:
            acg.ext._233_addSliding(op.line, op.text, op.time, op.duration, op.colour);
            break;
        case js233.CMT_TOP_STICKY:
            acg.ext._233_addSticky(1, op.line, op.text, op.time, op.duration, op.colour);
            break;
        case js233.CMT_BOTTOM_STICKY:
            acg.ext._233_addSticky(2, op.line, op.text, op.time, op.duration, op.colour);
            break;
        default:
            break;
        }
    });
}

acg.ext._233_commit = function () {
    js233.setDurRange(5, 10, 2, 3.5);
    acg.ext._233_layer = cc.Layer.create();
    acg.ext._233_layer.setLocalZOrder(2333333);
    acg.scene.addChild(acg.ext._233_layer);
    var ops = js233.getOperations();
    acg.ext._233_doops(ops);
};

acg.ext._233_addSliding = function (line, text, time, duration, colour) {
    colour = colour || acg.colour.WHITE;
    var lbl = cc.LabelTTF.create(text, acg.ext._233_fontname, acg.ext._233_fontsize);
    lbl.setAnchorPoint(cc.p(0, 1));
    lbl.setNormalizedPositionX(1);
    lbl.setNormalizedPositionY(1 - (line * acg.ext._233_lineh) / acg.height);
    lbl.setColor(colour);
    lbl.enableStroke(cc.color.BLACK, 1);
    lbl.setVisible(false);
    lbl.runAction(cc.sequence(
        cc.delayTime(time), cc.show(),
        cc.moveBy(duration, cc.p(-(1 + lbl.getContentSize().width / acg.width), 0)),
        cc.removeSelf()));
    acg.ext._233_layer.addChild(lbl);
};

acg.ext._233_addSticky = function (type, line, text, time, duration, colour) {
    colour = colour || acg.colour.WHITE;
    var lbl = cc.LabelTTF.create(text, acg.ext._233_fontname, acg.ext._233_fontsize);
    lbl.setLocalZOrder(2333333);
    if (type === 1) {
        // Top-sticky
        lbl.setAnchorPoint(cc.p(0.5, 1));
        lbl.setNormalizedPosition(cc.p(0.5, 1 - line * acg.ext._233_lineh / acg.height));
    } else if (type === 2) {
        // Bottom-sticky
        lbl.setAnchorPoint(cc.p(0.5, 0));
        lbl.setNormalizedPosition(cc.p(0.5, line * acg.ext._233_lineh / acg.height));
    } else {
        console.log('acg.ext._233_addSticky: Invalid type T^T');
        return;
    }
    lbl.setColor(colour);
    lbl.enableStroke(cc.color.BLACK, 1);
    lbl.setVisible(false);
    lbl.runAction(cc.sequence(
        cc.delayTime(time), cc.show(),
        cc.delayTime(duration), cc.removeSelf()));
    acg.ext._233_layer.addChild(lbl);
};
