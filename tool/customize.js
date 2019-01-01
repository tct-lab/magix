let path = require('path');
let fs = require('fs');
let rs = require('./lib/rs');
let tmpl = require('./lib/tmpl');
var pkg = require('../package.json');
let sep = path.sep;
let modulesReg = /\/\/#modules\s*=\s*([^\r\n]+)/;
let incReg = /Inc\((['"])(.+)\1\);*/g;
let modules = {
    router: 1
};
let copyFile = (from, to, callback) => {
    let folders = path.dirname(to).split(sep);
    let p = '';
    while (folders.length) {
        p += folders.shift() + sep;
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }
    let content = fs.readFileSync(from);
    if (callback) {
        content = callback(content + '');
    }
    fs.writeFileSync(to, content);
};
module.exports = (options, cb) => {
    let enableModules = options.enableModules;
    let loaderType = options.loaderType || 'unknown';
    let tmplFile = options.tmplFile;
    let aimFile = options.aimFile;
    let getModules = m => {
        let map = {};
        let others = [];
        m.split(',').forEach(function (m) {
            m = m.trim();
            map[m] = 1;
        });
        for (let p in modules) {
            if (!map[p]) {
                others.push(p);
            }
        }
        return {
            enables: map,
            others
        };
    };
    copyFile(tmplFile, aimFile, content => {
        let match = content.match(modulesReg),
            m;
        if (match) {
            m = getModules(match[1]);
        } else {
            m = getModules(enableModules);
        }
        let dir = path.dirname(tmplFile);
        content = content.replace(incReg, (match, q, name) => {
            let file = path.resolve(dir, name + '.js');
            return fs.readFileSync(file) + '';
        });
        let header = '\/\/#snippet;\r\n\/\/#exclude = all;\r\n/*!' + pkg.version + ' Licensed MIT*/';
        header += '\r\n/*\r\nauthor:kooboy_li@163.com\r\nloader:' + loaderType;
        header += '\r\nenables:' + Object.keys(m.enables);
        header += '\r\n\r\noptionals:' + m.others;
        header += '\r\n*/\r\n';
        m.enables[loaderType] = true;
        m.enables.moduleId = options.moduleId || 'magix';
        return rs.process(tmpl(header + content, m.enables));
    });
    if (cb) {
        cb(rs.getMap());
    }
};