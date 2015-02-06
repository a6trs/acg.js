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

acg.ext.TAG_SM_HEAD = 1234;
acg.ext.TAG_SM_LEG1 = 1934;
acg.ext.TAG_SM_LEG2 = 1984;
acg.ext.TAG_SM_ARM1 = 1239;
acg.ext.TAG_SM_ARM2 = 1294;

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
    attr.width = headsize / acg.width;
    attr.height = acg.ext.sm_headsize + acg.ext.sm_bodylen + acg.ext.sm_leglen;
    var w = headsize;
    var h = attr.height * acg.height;
    var c = cc.Layer.create();  // 'c' stands for container
    // Initialize the container first, since we will use its duration later
    acg.init_matter(c, attr, action);

    // The head
    var head = cc.DrawNode.create();
    head.drawDot(cc.p(headsize / 2, headsize / 2), headsize / 2, acg.colour.BLACK);
    acg.init_matter(head, {x: 0, y: (leglen + bodylen) / h}, movements['head'], c);
    // The body -- Sounds like we're writing HTML...
    var body = cc.DrawNode.create();
    body.drawSegment(
        cc.p(headsize / 2, 0), cc.p(headsize / 2, bodylen),
        acg.ext.sm_strokew, acg.colour.BLACK);
    body.setPosition(cc.p(0, leglen));
    c.addChild(body);
    // The legs -- Oppa with long legs, oh, I said nothing.
    var leg1 = acg.ext.stickman_oneleg(leglen, acg.colour.BLACK);
    acg.init_matter(leg1,
        {x: 0.5, y: leglen / h, ax: 0, ay: 0}, movements['leg1'], c);
    var leg2 = acg.ext.stickman_oneleg(leglen, acg.colour.BLACK);
    acg.init_matter(leg2,
        {x: 0.5, y: leglen / h, ax: 0, ay: 0}, movements['leg2'], c);
    // The arms -- I'm a programmer, not a gibbon.
    // Okay, I admit... The arms and the legs are exactly the same type.
    var arm1 = acg.ext.stickman_oneleg(armlen, acg.colour.BLACK);
    acg.init_matter(arm1,
        {x: 0.5, y: (armpos + leglen) / h, ax: 0, ay: 0}, movements['arm1'], c);
    var arm2 = acg.ext.stickman_oneleg(armlen, acg.colour.BLACK);
    acg.init_matter(arm2,
        {x: 0.5, y: (armpos + leglen) / h, ax: 0, ay: 0}, movements['arm2'], c);

    return [c._acg_id, head._acg_id, leg1._acg_id, leg2._acg_id, arm1._acg_id, arm2._acg_id];
};
