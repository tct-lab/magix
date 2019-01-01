Inc('../tmpl/var_vars');
Inc('../tmpl/var_cache');
Inc('../tmpl/var_dom');
Inc('../tmpl/var_path');
let MxDefaultViewEntity;
let Async_Require = (name, fn) => {
    if (name) {
        if (MxGlobalView == name) {
            if (!MxDefaultViewEntity) {
                MxDefaultViewEntity = View.extend();
            }
            fn(MxDefaultViewEntity);
        } else {
            if (!IsArray(name)) name = [name];
            let a = [], c = 0;
            let count = name.length,
                paths = MX_Cfg.paths,
                check = i => {
                    return v => {
                        a[i] = v.default;
                        c++;
                        if (c == count) {
                            fn(...a);
                        }
                    };
                };
            for (let i = count, f, s, p; i--;) {
                f = name[i];
                s = f.indexOf('/');
                if (s > -1) {
                    p = f.slice(0, s);
                    f = f.slice(s + 1);
                    f = (paths[p] || `unset/${p}/path/`) + f;
                }
                if (!f.endsWith('.js')) {
                    f += '.js';
                }
                import(f).then(check(i));
            }
        }
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
export default Magix;