let path = require('path');
let fs = require('fs');
let rs = require('./lib/rs');
let tmpl = require('./lib/tmpl');
let pkg = require('../package.json');
let ts = require('typescript');
let sep = path.sep;
let modulesReg = /\/\/#modules\s*=\s*([^\r\n]+)/;
let incReg = /Inc\((['"])(.+)\1\);*/g;
let modules = {
    async: 1,
    removeStyle: 1,//是否可移除applyStyle生成的样式
    waitSelector: 1,//是否支持waitSelector方法
    batchDOMEvent: 1,//是否支持批量dom事件处理
    catchHTMLError: 1,//捕获html中的错误

    router: 1,//路由
    routerHash: 1,//hash路由
    routerState: 1,//hisotry跌幅
    routerTip: 1,//支持路由拦截并提示
    routerTipLockUrl: 1,//支持销定url
    routerForceState: 1,//强制使用state

    richView: 1,//提供snapshot,alter等接口
    richVframe: 1,//提供parent,invoke等接口
    eventVframe: 1,//是否支持事件
    innerView: 1,//是否支持在view内部模板中渲染其它view
    richVframeInvokeCancel: 1,//vframe的invoke方法是否有对应的invokeCancel方法
    richVframeDescendants: 1,//是否有descendants方法

    recast: 1,//拦截渲染
    require: 1,//模块加载前处理逻辑
    remold: 1,//事件拦截处理
    rebuild: 1,//重写路由
    rewrite: 1,//重定向路由
    xml: 1,//是否支持svg math等标签
    customTags: 1,//自定义标签
    checkAttr: 1,//子view属性变化时，是否通知更新
    webc: 1,//webcomponent
    lang: 1,//是否提供isArray isObject等方法
    xview: 1,//是否支持跨view传递带有mx-view的虚拟dom
    taskComplete: 1,//是否支持taskComplete方法
    spreadMxViewParams: 1,//是否支持展开*="{{#expr}}" magix-view的参数
    preloadViews: 1,//预加载模板中的view
    esmoduleCheck: 1,//是否检测esmodule

    lockSubWhenBusy: 1,//某个view更新繁忙时，锁定子view
    load: 1,//是否提供资源加载的内部状态接口
    wait: 1,//是否有内部状态接口
    taskIdle: 1,//任务是否支持空闲检测
    taskCancel: 1,//任务可以取消
    service: 1,//接口服务
    state: 1,//Magix.State对象
    mxevent: 1//是否有事件派发
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
    let { enableModules,
        loaderType,
        tmplFile,
        aimFile,
        tmplTSFile,
        aimTSFile,
        toJS,
        moduleId } = options;
    let getModules = m => {
        let map = {
            __version: pkg.version
        };
        let others = [];
        m.split(',').forEach(m => {
            m = m.trim();
            if (modules[m]) {
                map[m] = 1;
            }
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
            let file = path.resolve(dir, name + '.ts');
            return fs.readFileSync(file) + '';
        });
        if (loaderType == 'module') {
            delete m.enables.seajs;
            delete m.others.seajs;
        }
        let enables = { ...m.enables };
        delete enables.__version;
        header = '/*\r\nversion:' + pkg.version + ' Licensed MIT';
        header += '\r\nauthor:kooboy_li@163.com'
        header += '\r\nloader:' + loaderType;
        header += '\r\nenables:' + Object.keys(enables);
        header += '\r\noptionals:' + m.others;
        header += '\r\n*/\r\n';
        m.enables[loaderType] = true;
        m.enables.moduleId = moduleId || 'magix';
        content = rs.process(tmpl(header + content, m.enables));
        if (toJS) {
            let result = ts.transpileModule(content, {
                compilerOptions: {
                    target: 'esnext',
                    module: ts.ModuleKind.None
                }
            });
            content = result.outputText;
        }
        return content;
    });
    if (fs.existsSync(tmplTSFile)) {
        copyFile(tmplTSFile, aimTSFile, content => {
            let match = content.match(modulesReg),
                m;
            if (match) {
                m = getModules(match[1]);
            } else {
                m = getModules(enableModules);
            }
            let dir = path.dirname(tmplTSFile);
            content = content.replace(incReg, (match, q, name) => {
                let file = path.resolve(dir, name + '.ts');
                return fs.readFileSync(file) + '';
            });
            if (loaderType == 'module') {
                delete m.enables.seajs;
                delete m.others.seajs;
            }
            let enables = { ...m.enables };
            delete enables.__version;
            header = '/*!' + pkg.version + ' Licensed MIT*/';
            header += '\r\n/*\r\nauthor:kooboy_li@163.com\r\nloader:' + loaderType;
            header += '\r\nenables:' + Object.keys(enables);
            header += '\r\n\r\noptionals:' + m.others;
            header += '\r\n*/\r\n';
            m.enables[loaderType] = true;
            m.enables.moduleId = options.moduleId || 'magix';
            return rs.process(tmpl(header + content, m.enables));
        });
    }
    if (cb) {
        cb(rs.getMap());
    }
};