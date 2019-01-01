define('/*#=modules.moduleId#*/', () => {
    Inc('../tmpl/var_vars');
    Inc('../tmpl/var_cache');
    Inc('../tmpl/var_dom');
    Inc('../tmpl/var_path');
    let MxDefaultViewEntity;
    let Async_Require = (name, fn) => {
        if (name) {
            let a = [], n;
            if (MxGlobalView == name) {
                if (!MxDefaultViewEntity) {
                    MxDefaultViewEntity = View.extend();
                }
                fn(MxDefaultViewEntity);
            } else /*if (Doc_Window.seajs)*/ {
                seajs.use(name, (...g) => {
                    for (let m of g) {
                        a.push(m && m.__esModule && m.default || m);
                    }
                    if (fn) fn(...a);
                });
            } /*else {
                if (!IsArray(name)) name = [name];
                for (n of name) {
                    n = require(n);
                    a.push(n && n.__esModule && n.default || n);
                }
                if (fn) fn(...a);
            }*/
        } else {
            fn();
        }
    };
    Inc('../tmpl/extend');
    Inc('../tmpl/safeguard');
    Inc('../tmpl/event');
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
    Inc('../tmpl/base');
    Inc('../tmpl/magix');
    Magix.default = Magix;
    return Magix;
});