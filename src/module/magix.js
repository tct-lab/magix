if (typeof DEBUG == 'undefined') window.DEBUG = true;
Inc('../tmpl/naked');
Inc('../tmpl/variable');
Inc('../tmpl/cache');
/*#if(modules.defaultView){#*/
let G_DefaultView;
/*#}#*/
let G_Require = (name, fn) => {
    if (name) {
        /*#if(modules.defaultView){#*/
        if (MxGlobalView == name) {
            if (!G_DefaultView) {
                G_DefaultView = View.extend();
            }
            fn(G_DefaultView);
        } else {/*#}#*/
            let a = [], n, c = 0;
            if (!G_IsArray(name)) name = [name];
            let check = i => {
                return v => {
                    a[i] = v.default;
                    c++;
                    if (c == a.length) {
                        fn(...a);
                    }
                };
            };
            let paths = Magix_Cfg.paths;
            for (let i = name.length, f, s, p; i--;) {
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
            /*#if(modules.defaultView){#*/
        }
        /*#}#*/
    } else {
        fn();
    }
};
Inc('../tmpl/extend');
Inc('../tmpl/safeguard');
Inc('../tmpl/magix');
Inc('../tmpl/event');
/*#if(modules.state){#*/
Inc('../tmpl/state');
/*#}#*/
/*#if(modules.router){#*/
Inc('../tmpl/router');
/*#}#*/
/*#if(modules.router||modules.state){#*/
Inc('../tmpl/dispatcher');
/*#}#*/
Inc('../tmpl/vframe');
Inc('../tmpl/body');
Inc('../tmpl/async');
/*#if(modules.updaterQuick){#*/
Inc('../tmpl/quick');
Inc('../tmpl/vdom');
/*#}else{#*/
Inc('../tmpl/dom');
/*#}#*/
Inc('../tmpl/view');
/*#if(modules.service){#*/
let G_Now = Date.now;
Inc('../tmpl/service');
/*#if(modules.servicePush){#*/
Inc('../tmpl/svsx');
/*#}#*/
/*#}#*/
Inc('../tmpl/base');
export default Magix;