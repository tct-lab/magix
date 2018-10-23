define('magix', () => {
    if (typeof DEBUG == 'undefined') window.DEBUG = true;
    Inc('../tmpl/naked');
    Inc('../tmpl/variable');
    Inc('../tmpl/cache');
    /*#if(modules.defaultView){#*/
    let G_DefaultView;
    /*#}#*/
    let G_Require = (name, fn) => {
        if (name) {
            let a = [], n;
            /*#if(modules.defaultView){#*/
            if (MxGlobalView == name) {
                if (!G_DefaultView) {
                    G_DefaultView = View.extend();
                }
                fn(G_DefaultView);
            } else /*#}#*/
                if (G_WINDOW.seajs) {
                    seajs.use(name, (...g) => {
                        for (let m of g) {
                            a.push(m && m.__esModule && m.default || m);
                        }
                        if (fn) fn(...a);
                    });
                } else {
                    if (!G_IsArray(name)) name = [name];
                    for (n of name) {
                        n = require(n);
                        a.push(n && n.__esModule && n.default || n);
                    }
                    if (fn) fn(...a);
                }
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
    /*#if(modules.service||modules.updaterAsync){#*/
    let G_Now = Date.now;
    Inc('../tmpl/service');
    /*#if(modules.servicePush){#*/
    Inc('../tmpl/svsx');
    /*#}#*/
    /*#}#*/
    Inc('../tmpl/base');
    Magix.default = Magix;
    return Magix;
});