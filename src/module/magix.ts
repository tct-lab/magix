if (typeof DEBUG == 'undefined') window.DEBUG = true;
Inc('../tmpl/var_vars');
Inc('../tmpl/var_cache');
Inc('../tmpl/var_dom');
Inc('../tmpl/var_path');
/*#if(modules.taskIdle){#*/
Inc('../tmpl/call.until');
/*#}#*/
Inc('../tmpl/call');
let M_Ext = '.js';
let ImportPromises = {};
/*#if(modules.load){#*/
let resourcesLoadCount = 0;
/*#}#*/
let Async_Require = async <T>(/*#if(modules.require){#*/names, params,/*#}else{#*/...names/*#}#*/): Promise<T[]> => {
    let a = [], b = [], f, s, p;
    let { paths
    /*#if(modules.load){#*/,
        request: load
        /*#}#*/
    } = Mx_Cfg;
    /*#if(modules.load){#*/
    if (!resourcesLoadCount) {
        load(1);
    }
    resourcesLoadCount++;
    /*#}#*/
    try {
        /*#if(modules.require){#*/
        if (!IsArray(names)) {
            names = [names];
        }
        await Mx_Cfg.require(names, params);
        /*#}#*/
        for (f of names) {
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
        names = await GPromise.all(a);
        for (f of names) {
            b.push(f.default);
        }
    } catch (ex) {
        Mx_Cfg.error(ex);
    }
    /*#if(modules.load){#*/
    resourcesLoadCount--;
    if (!resourcesLoadCount) {
        load(0);
    }
    /*#}#*/
    return b;
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