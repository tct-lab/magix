/*#if(modules.router&&modules.routerHash){#*/
let Router_UpdateHash = (path, replace?) => {
    if (path != Router_WinLoc.hash) {
        if (replace) {
            Router_WinLoc.replace(Hash_Key + path);
        } else {
            Router_WinLoc.hash = path;
        }
    }
};
let Router_Update = (path, params, loc, replace, silent, lQuery) => {
    path = ToUri(path, params, lQuery);
    if (path != loc.srcHash) {
        Router_Silent = silent;
        Router_UpdateHash(path, replace);
    }
};
let Router_Bind = () => {
    /*#if(modules.routerTip){#*/
    let lastHash = Router_Parse().srcHash;
    let newHash, suspend;
    AddEventListener(Doc_Window, 'hashchange', (e, loc, resolve) => {
        if (suspend) {
            /*#if(modules.routerTipLockUrl){#*/
            Router_UpdateHash(lastHash);
            /*#}#*/
            return;
        }
        loc = Router_Parse();
        newHash = loc.srcHash;
        if (newHash != lastHash) {
            resolve = () => {
                e.p = 1;
                lastHash = newHash;
                suspend = Empty;
                Router_UpdateHash(newHash);
                Router_Diff();
            };
            e = {
                reject() {
                    e.p = 1;
                    suspend = Empty;
                    /*#if(!modules.routerTipLockUrl){#*/
                    Router_UpdateHash(lastHash);
                    /*#}#*/
                },
                resolve,
                prevent() {
                    suspend = 1;
                    /*#if(modules.routerTipLockUrl){#*/
                    Router_UpdateHash(lastHash);
                    /*#}#*/
                }
            };
            Router.fire(Change, e);
            if (!suspend && !e.p) {
                resolve();
            }
        }
    });
    AddEventListener(Doc_Window, 'beforeunload', (e, te, msg) => {
        e = e || Doc_Window.event;
        te = {};
        Router.fire(Page_Unload, te);
        if ((msg = te.msg)) {
            if (e) e.returnValue = msg;
            return msg;
        }
    });
    /*#}else{#*/
    AddEventListener(Doc_Window, 'hashchange', Router_Diff);
    /*#}#*/
    Router_Diff();
};
/*#}#*/
