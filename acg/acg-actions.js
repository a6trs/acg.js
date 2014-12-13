var acg = acg || {};
acg.ac = acg.ac || {};
var cc = cc || {};

// Use tools/actionlist_gen.html to generate this.

// Removed:
// * action-interval
// * targeted-action
// * action-ease
// * remove-self
// * call-func
// * animate
// * all 'Action's in names
// TODO: Make actionlist_gen do this automatically.

// TODO: Add items for cc.Follow and cc.Speed
// FIXME: Got some problems with ease actions' shortened names by Cocos.
// For example, search 'cc.easeSineIn' in Cocos2d-HTML5's JS file.
acg.ac.action_map = {
    // Shortened ones
    '+': cc.sequence,
    '//': cc.spawn,
    // Original ones
    'show': cc.show,
    'hide': cc.hide,
    'toggle-visibility': cc.toggleVisibility,
    'flip-x': cc.flipX,
    'flip-y': cc.flipY,
    'place': cc.place,
    'sequence': cc.sequence,
    'repeat': cc.repeat,
    'persist': cc.repeatForever,    // renamed
    'spawn': cc.spawn,
    'rotate-to': cc.rotateTo,
    'rotate-by': cc.rotateBy,
    'move-by': cc.moveBy,
    'move-to': cc.moveTo,
    'skew-to': cc.skewTo,
    'skew-by': cc.skewBy,
    'jump-by': cc.jumpBy,
    'jump-to': cc.jumpTo,
    'bezier-at': cc.bezierAt,
    'bezier-by': cc.bezierBy,
    'bezier-to': cc.bezierTo,
    'scale-to': cc.scaleTo,
    'scale-by': cc.scaleBy,
    'blink': cc.blink,
    'fade-to': cc.fadeTo,
    'fade-in': cc.fadeIn,
    'fade-out': cc.fadeOut,
    'tint-to': cc.tintTo,
    'tint-by': cc.tintBy,
    'delay': cc.delayTime,  // renamed
    'reverse': cc.reverseTime,  // renamed
    'ease-rate': cc.EaseRateAction.create,
    'ease-in': cc.EaseIn.create,
    'ease-out': cc.EaseOut.create,
    'ease-in-out': cc.EaseInOut.create,
    'ease-exponential-in': cc.EaseExponentialIn.create,
    'ease-exponential-out': cc.EaseExponentialOut.create,
    'ease-exponential-in-out': cc.EaseExponentialInOut.create,
    'ease-sine-in': cc.EaseSineIn.create,
    'ease-sine-out': cc.EaseSineOut.create,
    'ease-sine-in-out': cc.EaseSineInOut.create,
    'ease-elastic-in': cc.EaseElasticIn.create,
    'ease-elastic-out': cc.EaseElasticOut.create,
    'ease-elastic-in-out': cc.EaseElasticInOut.create,
    'ease-bounce-in': cc.EaseBounceIn.create,
    'ease-bounce-out': cc.EaseBounceOut.create,
    'ease-bounce-in-out': cc.EaseBounceInOut.create,
    'ease-back-in': cc.EaseBackIn.create,
    'ease-back-out': cc.EaseBackOut.create,
    'ease-back-in-out': cc.EaseBackInOut.create,
    'ease-bezier': cc.EaseBezierAction.create,
    'ease-quadratic-in': cc.EaseQuadraticActionIn.create,
    'ease-quadratic-out': cc.EaseQuadraticActionOut.create,
    'ease-quadratic-in-out': cc.EaseQuadraticActionInOut.create,
    'ease-quartic-in': cc.EaseQuarticActionIn.create,
    'ease-quartic-out': cc.EaseQuarticActionOut.create,
    'ease-quartic-in-out': cc.EaseQuarticActionInOut.create,
    'ease-quintic-in': cc.EaseQuinticActionIn.create,
    'ease-quintic-out': cc.EaseQuinticActionOut.create,
    'ease-quintic-in-out': cc.EaseQuinticActionInOut.create,
    'ease-circle-in': cc.EaseCircleActionIn.create,
    'ease-circle-out': cc.EaseCircleActionOut.create,
    'ease-circle-in-out': cc.EaseCircleActionInOut.create,
    'ease-cubic-in': cc.EaseCubicActionIn.create,
    'ease-cubic-out': cc.EaseCubicActionOut.create,
    'ease-cubic-in-out': cc.EaseCubicActionInOut.create
};

acg.ac.parse = function (a) {
    for (var i = 1; i < a.length; i++) {
        if (typeof(a[i][0]) === 'string') {
            // a[i] is an array representing an action, parse it
            a[i] = acg.ac.parse(a[i]);
        }
    }
    return acg.ac.action_map[a[0]].apply(null, a.slice(1));
};
