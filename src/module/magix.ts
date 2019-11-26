if (typeof DEBUG == 'undefined') window.DEBUG = true;
Inc('../tmpl/var_vars');
Inc('../tmpl/var_cache');
Inc('../tmpl/var_dom');
Inc('../tmpl/var_path');
Inc('../tmpl/call');
let M_Ext = '.js';
let ImportPromises = {};
let Async_Require = (name, fn) => {
    if (name) {
        if (!IsArray(name)) name = [name];
        let a = [], b = [], f, s, p;
        let paths = Mx_Cfg.paths;
        /*#if(modules.require){#*/
        let require = Mx_Cfg.require;
        /*#}#*/
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
            if (!ImportPromises[f]) {
                ImportPromises[f] = import(f);
            }
            a.push(ImportPromises[f]);
        }
        /*#if(modules.require){#*/
        require(name).then(() => {
            /*#}#*/
            Promise.all(a).then(args => {
                for (f of args) {
                    b.push(f.default);
                }
                CallFunction(fn, b);
            });
            /*#if(modules.require){#*/
        });
        /*#}#*/
    } else {
        CallFunction(fn);
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