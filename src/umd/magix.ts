//#snippet;
//#exclude = all;
if (typeof DEBUG == 'undefined') window.DEBUG = true;
(factory => {
    if (window.define) {
        define('/*#=modules.moduleId#*/', factory);
        defind('magix', factory);
    }
    window.Magix = factory();
})(() => {
    Inc('../tmpl/var_vars');
    Inc('../tmpl/var_cache');
    Inc('../tmpl/var_dom');
    Inc('../tmpl/var_path');
    Inc('../tmpl/call');
    let globalView = GUID();
    Mx_Cfg.views = {};
    Mx_Cfg.defaultView = globalView;
    let globalViewEntity;
    let isEsModule = o => o.__esModule || (window.Symbol && o[Symbol.toStringTag] === 'Module')
    let IsFunction = o => Type(o) == 'Function';
    let Async_Require = (name, fn) => {
        if (name &&
            name.prototype &&
            name.prototype instanceof View) {
            return fn(name);
        }
        if (globalView == name) {
            if (!globalViewEntity) {
                globalViewEntity = View.extend();
            }
            return fn(globalViewEntity);
        }
        let views = Mx_Cfg.views;
        let results = [];
        let view;
        let promiseCount = 0;
        let checkCount = () => {
            if (!promiseCount) {
                CallFunction(fn, results);
            }
        };
        let promise = (p, idx) => {
            let fn = (v) => {
                if (!results[idx]) {
                    promiseCount--;
                    results[idx] = isEsModule(v) ? v["default"] : v;
                    checkCount();
                }
            };
            p = p(fn);
            if (p && p.then) {
                p.then(fn);
            }
        };
        let seajsCallback = idx => {
            return m => {
                promiseCount--;
                results[idx] = isEsModule(m) ? m.default : m;
                checkCount();
            };
        };
        if (name) {
            if (!IsArray(name)) {
                name = [name];
            }
            for (let i = 0; i < name.length; i++) {
                view = views[name[i]];
                if (view) {
                    if (IsFunction(view) && !view.extend) {
                        promiseCount++;
                        promise(view, i);
                    }
                    else {
                        results[i] = isEsModule(view) ? view.default : view;
                    }
                    checkCount();
                }
                else {
                    if (window.seajs) {
                        promiseCount++;
                        seajs.use(name[i], seajsCallback(i));
                    }
                    else if (window.require) { // 兼容历史版本的写法
                        view = require(name[i]);
                        results[i] = isEsModule(view) ? view.default : view;
                        checkCount();
                    }
                }
            }
        }
        else {
            checkCount();
        }
    };
    Inc('../tmpl/extend');
    Inc('../tmpl/safeguard');
    Inc('../tmpl/event');
    Inc('../tmpl/router_hash');
    Inc('../tmpl/router_state');
    Inc('../tmpl/router');
    Inc('../tmpl/dispatcher');
    Inc('../tmpl/vframe');
    Inc('../tmpl/body');
    Inc('../tmpl/updater');
    Inc('../tmpl/quick');
    Inc('../tmpl/vdom');
    Inc('../tmpl/state');
    Inc('../tmpl/view');
    Inc('../tmpl/service');
    Inc('../tmpl/magix');
    Magix.default = Magix;
    Magix.addView = (name, promiseObj) => {
        let cfgViews = Mx_Cfg.views;
        promiseObj.__moduleid__ = name;
        cfgViews[name] = promiseObj;
        return promiseObj;
    };

    Vframe_GetVfId = node => {
        let id = node['@{~node#vframe.id}'] || (node['@{~node#vframe.id}'] = GUID(Vframe_RootId));
        if (!node.id) node.id = id;
        return id;
    }
    return Magix;
});