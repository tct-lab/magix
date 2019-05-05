/*#if(modules.router){#*/
let Magix_Booted = 0;
/*#}#*/
let Magix = {
    config(cfg, r) {
        r = Mx_Cfg;
        if (cfg) {
            if (IsObject(cfg)) {
                r = Assign(r, cfg);
            } else {
                r = r[cfg];
            }
        }
        return r;
    },
    boot(cfg) {
        Assign(Mx_Cfg, cfg); //先放到配置信息中，供ini文件中使用
        /*#if(modules.router){#*/
        /*#if(modules.mxevent){#*/
        Router.on(Changed, Dispatcher_NotifyChange);
        /*#}#*/
        Magix_Booted = 1;
        Router_Bind();
        /*#}else{#*/
        Vframe_Root().mountView(Mx_Cfg.defaultView);
        /*#}#*/
        if (DEBUG) {
            let whiteList = {
                defaultView: 1,
                error: 1,
                defaultPath: 1,
                recast: 1,
                rewrite: 1,
                rootId: 1,
                routes: 1,
                unmatchView: 1,
                title: 1
            };
            Mx_Cfg = Safeguard(Mx_Cfg, true, (key, value) => {
                if (Has(whiteList, key)) {
                    throw new Error(`avoid write ${key} to magix config!`);
                }
            });
        }
    },
    /*#if(modules.rich){#*/toMap: ToMap,
    toTry: ToTry,
    toUrl: ToUri,
    parseUrl: ParseUri,
    guid: GUID,
    use: Async_Require,
    dispatch: DispatchEvent,
    /*#}#*/
    guard: Safeguard,
    type: Type,
    has: Has,
    inside: NodeIn,
    applyStyle: ApplyStyle,
    Cache: MxCache,
    View,
    Vframe,
    /*#if(modules.state){#*/
    State,
    /*#}#*/
    /*#if(modules.service){#*/
    Service,
    /*#}#*/
    /*#if(modules.mxevent){#*/
    Event: MxEvent,
    /*#}#*/
    /*#if(modules.router){#*/
    Router,
    /*#}#*/
    node: GetById,
    task: CallFunction
};