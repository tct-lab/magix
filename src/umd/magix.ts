//#snippet;
//#exclude = all;
if (typeof DEBUG == 'undefined') window.DEBUG = true;
(factory => {
    if (window.define) {
        define('/*#=modules.moduleId#*/', factory);
    }
    window.Magix = factory();
})(() => {
    Inc('../tmpl/var_vars');
    Inc('../tmpl/var_cache');
    Inc('../tmpl/var_dom');
    Inc('../tmpl/var_path');
    Inc('../tmpl/call');
    let globalView = GUID();
    Mx_Cfg.defaultView = globalView;
    let globalViewEntity;
    let dynamicAddViews = {};
    let Async_Require = (name, fn, a, n) => {
        if (name) {
            a = [];
            if (name == globalView) {
                if (!globalViewEntity) {
                    globalViewEntity = View.extend();
                }
                a.push(globalViewEntity);
                if (fn) CallFunction(fn, a);
            } else if (dynamicAddViews[name]) {
                a.push(dynamicAddViews[name]);
                if (fn) CallFunction(fn, a);
            } else {
                /*#if(modules.seajs){#*/
                seajs.use(name, (...g) => {
                    for (let m of g) {
                        a.push(m && m.__esModule && m.default || m);
                    }
                    if (fn) {
                        CallFunction(fn, a);
                    }
                });
                /*#}else if(!modules.webpack){#*/
                if (!IsArray(name)) name = [name];
                for (n of name) {
                    n = require(n);
                    a.push(n && n.__esModule && n.default || n);
                }
                if (fn) CallFunction(fn, a);
                /*#}#*/
            }
        } else {
            fn();
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
    Magix.addView = (path, view) => {
        dynamicAddViews[path] = view.__esModule && view.default || view;
    };
    return Magix;
});