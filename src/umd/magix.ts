//magix-composer#snippet;
//magix-composer#exclude = loader;

interface Navigator {
    scheduling?: {
        isInputPending(): boolean
    }
}
if (typeof DEBUG == 'undefined') window.DEBUG = true;
define('/*#=modules.moduleId#*/', () => {
    Inc('../tmpl/var_vars');
    Inc('../tmpl/var_cache');
    Inc('../tmpl/var_dom');
    Inc('../tmpl/var_path');
    Inc('../tmpl/call')
    /*#if(modules.taskIdle){#*/
    Inc('../tmpl/call.until');
    /*#}#*/
    /*#if(modules.load){#*/
    let resourcesLoadCount = 0;
    /*#}#*/
    /*#if(modules.esmoduleCheck){#*/
    let isEsModule = o => o && (o.__esModule || (window.Symbol && o[Symbol.toStringTag] === 'Module'));
    /*#}#*/
    let Async_Require = <T>(/*#if(modules.require){#*/names, params,/*#}else{#*/...names/*#}#*/): Promise<T[]> => {
        return new GPromise(async r => {
            let a = [];
            try {
                /*#if(modules.require){#*/
                if (!IsArray(names)) {
                    names = [names];
                }
                await Mx_Cfg.require(names, params);
                /*#}#*/
                /*#if(modules.load){#*/
                let load = Mx_Cfg.request;
                if (!resourcesLoadCount) {
                    load(1);
                }
                resourcesLoadCount++;
                /*#}#*/
                //if (window.seajs) {
                seajs.use(names, (...g) => {
                    for (let m of g) {
                        if (!m && DEBUG) {
                            console.error('can not load', names);
                        }
                        /*#if(modules.esmoduleCheck){#*/
                        a.push(isEsModule(m) ? m.default : m);
                        /*#}else{#*/
                        a.push(m);
                        /*#}#*/
                    }
                    /*#if(modules.load){#*/
                    resourcesLoadCount--;
                    if (!resourcesLoadCount) {
                        load(0);
                    }
                    /*#}#*/
                    r(a);
                });
                /*} else {
                    if (!Array.isArray(name)) {
                        name = [name];
                    }
                    for (let n of name) {
                        let m = require(n);
                        a.push(isEsModule(m) ? m.default : m);
                    }
                    CallFunction(fn, a);
                }*/
            } catch (ex) {
                Mx_Cfg.error(ex);
            }
        });
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
    type InnerMagix = typeof Magix & { default: any }
    (<InnerMagix>Magix).default = Magix;
    return Magix;
});