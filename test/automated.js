var test_ct = 0;
var test = function (desc, cond, errmsg) {
    document.write('Test #' + ++test_ct + ': ' + desc + ' ');
    document.write(cond ? '[Passed]' : ('[Failed, ' + errmsg + ']'));
    document.write('<br>');
}

var a1 = [-1, 5.5, 9, 6.6, 4, 6.6, 0, 3, 3, 4, 3];
a1 = a1.map(function (t) { return {time: t}; });
acg.sort(a1);
a1_0 = a1.map(function (t) { return t.time; });
test('acg.sort', a1_0.join(' ') === '-1 0 3 3 3 4 4 5.5 6.6 6.6 9', a1_0.join(' '));

var b2_1 = acg.find(a1, 9) === 10;
var b2_2 = acg.find(a1, 2) === 1;
var b2_3 = acg.find(a1, 3.5) === 2;
var b2_4 = acg.find(a1, 3) === 2;
var b2_5 = acg.find(a1, 4) === 5;
var b2_6 = acg.find(a1, -4) === -1;
test('acg.find', b2_1 && b2_2 && b2_3 && b2_4 && b2_5 && b2_6,
    [b2_1, b2_2, b2_3, b2_4, b2_5, b2_6]);

var a2 = [], ex = undefined;
try { acg.sort(a2); }
catch (e) { ex = e; }
test('acg.sort with zero length', ex === undefined, ex && ex.toString());
try { acg.find(a2, 3); }
catch (e) { ex = e; }
test('acg.find with zero length', ex === undefined, ex && ex.toString());
