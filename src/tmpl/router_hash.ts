/*#if(modules.router&&modules.routerHash){#*/
let Router_UpdateHash = (path, replace?) => {
    Router_WinLoc[replace ? 'replace' : 'assign'](Hash_Key + path);
};
let Router_Update = (path, params, loc, replace, silent, lQuery) => {
    path = Router_PNR_Rebuild(path, params, lQuery);
    if (path != loc.srcHash) {
        Router_Silent = silent;
        Router_UpdateHash(path, replace);
    }
};
/*#if(modules.routerTip){#*/
let Router_Tip_Hashchange,
    Router_Tip_Beforeunload;
/*#}#*/
let Router_Bind = () => {
    /*#if(modules.routerTip){#*/
    let lastHash = Router_Parse().srcHash;
    let newHash, suspend;
    AddEventListener(Doc_Window, 'hashchange', Router_Tip_Hashchange = (e, loc, resolve) => {
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
                e['@{~router-tip#suspend}'] = 1;
                lastHash = newHash;
                suspend = Empty;
                Router_UpdateHash(newHash);
                Router_Diff();
            };
            e = {
                reject() {
                    e['@{~router-tip#suspend}'] = 1;
                    suspend = Empty;
                    /*#if(!modules.routerTipLockUrl){#*/
                    Router_UpdateHash(lastHash);
                    /*#}#*/
                },
                resolve,
                stop() {
                    e['@{~router-tip#suspend}'] = 1;
                    suspend = 1;
                    /*#if(modules.routerTipLockUrl){#*/
                    Router_UpdateHash(lastHash);
                    /*#}#*/
                }
            };
            Router.fire(Change, e);
            if (!suspend && !e['@{~router-tip#suspend}']) {
                resolve();
            }
        }
    });
    AddEventListener(Doc_Window, 'beforeunload', Router_Tip_Beforeunload = (e, te, msg) => {
        e = e || Doc_Window.event;
        te = {};
        Router.fire(Page_Unload, te);
        if ((msg = te['@{~page-tip#msg}'])) {
            if (e) e.returnValue = msg;
            return msg;
        }
    });
    /*#}else{#*/
    AddEventListener(Doc_Window, 'hashchange', Router_Diff);
    /*#}#*/
    Router_Diff();
};

let Router_Unbind = () => {
    /*#if(modules.routerTip){#*/
    RemoveEventListener(Doc_Window, 'hashchange', Router_Tip_Hashchange);
    RemoveEventListener(Doc_Window, 'beforeunload', Router_Tip_Beforeunload);
    /*#}else{#*/
    RemoveEventListener(Doc_Window, 'hashchange', Router_Diff);
    /*#}#*/
    Router_LLoc = Router_Init_Loc;
};
/*#}#*/
