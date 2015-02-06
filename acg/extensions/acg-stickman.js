var acg = acg || {};
acg.ext = acg.ext || {};

// Let's turn our lovely stickman by 90 deg...
// O+--===
//     ^ 61.8% of the whole body
// Therefore, LEGLEN = 0.618 * (HEADSIZE + BODYLEN).
acg.ext.sm_headsize = 0.2;
acg.ext.sm_bodylen = 0.1236;
acg.ext.sm_armlen = 0.1236;
acg.ext.sm_armpos = 0.1;    // The distance between arms and XXXXX.
acg.ext.sm_leglen = 0.2;
acg.ext.sm_strokew = 3;

acg.ext.stickman_oneleg = function (leglen, colour) {
    var leg = cc.DrawNode.create();
    leg.drawSegment(
        cc.p(0, 0), cc.p(0, -leglen),
        acg.ext.sm_strokew, colour);
    leg.setAnchorPoint(cc.p(0, 0));
    return leg;
}

acg.ext.stickman = function (attr, action, movements) {
    var headsize = acg.ext.sm_headsize * acg.height;
    var bodylen = acg.ext.sm_bodylen * acg.height;
    var leglen = acg.ext.sm_leglen * acg.height;
    var armlen = acg.ext.sm_armlen * acg.height;
    var armpos = acg.ext.sm_armpos * acg.height;
    //var c = cc.Layer.create();  // 'c' stands for container
    // For debug use
    var c = cc.LayerColor.create();
    attr.colour = [0, 0, 0];
    attr.opacity = 0.3;
    // The head
    var head = cc.DrawNode.create();
    head.drawDot(cc.p(headsize / 2, headsize / 2), headsize / 2, acg.colour.BLACK);
    head.setPosition(cc.p(0, leglen + bodylen));
    c.addChild(head);
    // The body -- Sounds like we're writing HTML...
    var body = cc.DrawNode.create();
    body.drawSegment(
        cc.p(headsize / 2, 0), cc.p(headsize / 2, bodylen),
        acg.ext.sm_strokew, acg.colour.BLACK);
    body.setPosition(cc.p(0, leglen));
    c.addChild(body);
    // The legs -- Oppa with long legs, oh, I said nothing.
    var leg1 = acg.ext.stickman_oneleg(leglen, acg.colour.BLACK);
    leg1.setPosition(cc.p(headsize / 2, 0));
    leg1.setRotation(5);
    body.addChild(leg1);
    var leg2 = acg.ext.stickman_oneleg(leglen, acg.colour.BLACK);
    leg2.setPosition(cc.p(headsize / 2, 0));
    leg2.setRotation(-5);
    body.addChild(leg2);
    // The arms -- I'm a programmer, not a gibbon.
    // Okay, I admit... The arms and the legs are exactly the same type.
    var arm1 = acg.ext.stickman_oneleg(armlen, acg.colour.BLACK);
    arm1.setPosition(cc.p(headsize / 2, armpos));
    arm1.setRotation(10);
    body.addChild(arm1);
    var arm2 = acg.ext.stickman_oneleg(armlen, acg.colour.BLACK);
    arm2.setPosition(cc.p(headsize / 2, armpos));
    arm2.setRotation(-10);
    body.addChild(arm2);
    attr.width = headsize / acg.width;
    attr.height = acg.ext.sm_headsize + acg.ext.sm_bodylen + acg.ext.sm_leglen;
    acg.init_matter(c, attr, action);
    return c._acg_id;
};
