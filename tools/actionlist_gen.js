var actionList = function (cc_code) {
    var a = cc_code.split('\n');
    var ret = '';
    a.forEach(function (s) {
        var r = s.match(/^cc.[a-z]+\w+/);
        if (r && r[0] != 'cc.log') {
            var key = r[0].substr(3);
            var splits = key.split(/[A-Z]/g);
            var matches = key.match(/[A-Z]/g);
            key = splits[0];
            if (matches) {
                for (var i = 0; i < matches.length; i++)
                    key += '-' + matches[i].toLowerCase() + splits[i + 1];
            }
            ret += "'" + key + "': " + r[0] + ',<br>';
        }
    });
    return ret;
};
