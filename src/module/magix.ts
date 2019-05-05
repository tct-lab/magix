if (typeof DEBUG == 'undefined') window.DEBUG = true;
Inc('../tmpl/var_vars');
Inc('../tmpl/var_cache');
Inc('../tmpl/var_dom');
Inc('../tmpl/var_path');
Inc('../tmpl/call');
let MxDefaultViewEntity;
let M_Ext = '.js';
let Async_Require = (name, fn) => {
    if (name) {
        if (MxGlobalView == name) {
            if (!MxDefaultViewEntity) {
                MxDefaultViewEntity = View.extend();
            }
            fn(MxDefaultViewEntity);
        } else {
            if (!IsArray(name)) name = [name];
            let a = [], b = [], paths = Mx_Cfg.paths, f, s, p;
            for (f of name) {
                s = f.indexOf('/');
                if (s > -1 && !f.startsWith('.')) {
                    p = f.slice(0, s);
                    f = f.slice(s + 1);
                    if (DEBUG) {
                        f = (paths[p] || `unset/${p}/path/`) + f;
                    } else {
                        f = paths[p] + f;
                    }
                }
                if (!f.endsWith(M_Ext)) {
                    f += M_Ext;
                }
                a.push(import(f));
            }
            Promise.all(a).then(args => {
                for (f of args) {
                    b.push(f.default);
                }
                CallFunction(fn, b);
            });
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
Inc('../tmpl/magix.d');
//强制转换
export default Magix as any as Magix5.Magix;