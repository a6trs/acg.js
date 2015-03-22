var cc = cc || {};
var acg = acg || {};
acg.ext = acg.ext || {};

acg.ext._res_path = '.';
acg.ext.set_res_path = function (path) {
    if (path.charAt(path.length - 1) === '/') path = path.substr(0, path.length - 1);
    acg.ext._res_path = path;
};
