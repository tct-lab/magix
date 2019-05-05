/*#if(modules.router&&modules.routerState){#*/
let Win_History = Doc_Window.history;
let Router_DidUpdate;
let Router_UpdateState = (path, replace?: boolean) => Win_History[replace ? 'replaceState' : 'pushState'](Empty, Empty, path);
let Router_Popstate;
let Router_Update = (path, params, loc, replace, silent) => {
    path = ToUri(path, params);
    if (path != loc.srcQuery) {
        Router_Silent = silent;
        Router_UpdateState(path, replace);
        if (Router_Popstate) {
            Router_Popstate(1);
        } else {
            Router_Diff();
        }
    }
};
let Router_Bind = () => {
    let initialURL = Router_WinLoc.href;
    /*#if(modules.routerTip){#*/
    let lastHref = initialURL;
    let newHref, suspend;
    AddEventListener(Doc_Window, 'popstate', Router_Popstate = (f, e, resolve) => {
        newHref = Router_WinLoc.href;
        let initPop = !Router_DidUpdate && newHref == initialURL;
        Router_DidUpdate = 1;
        if (initPop) return;
        if (suspend) {
            /*#if(modules.routerTipLockUrl){#*/
            Router_UpdateState(lastHref);
            /*#}#*/
            return;
        }
        if (newHref != lastHref) {
            resolve = () => {
                e.p = 1;
                suspend = Empty;
                lastHref = newHref;
                if (!f) Router_UpdateState(newHref);
                Router_Diff();
            };
            e = {
                reject() {
                    suspend = Empty;
                    e.p = 1;
                    /*#if(!modules.routerTipLockUrl){#*/
                    Router_UpdateState(lastHref);
                    /*#}#*/
                },
                resolve,
                prevent() {
                    suspend = 1;
                    /*#if(modules.routerTipLockUrl){#*/
                    Router_UpdateState(lastHref);
                    /*#}#*/
                }
            };
            Router.fire(Change, e);
            if (!suspend && !e.p) {
                resolve();
            }
        }
    });
    AddEventListener(Doc_Window, 'onbeforeunload', (e, te, msg) => {
        e = e || Doc_Window.event;
        te = {};
        Router.fire(Page_Unload, te);
        if ((msg = te.msg)) {
            if (e) e.returnValue = msg;
            return msg;
        }
    });
    /*#}else{#*/
    AddEventListener(Doc_Window, 'popstate', () => {
        let initPop = !Router_DidUpdate && Router_WinLoc.href == initialURL;
        Router_DidUpdate = 1;
        if (initPop) return;
        Router_Diff();
    });
    /*#}#*/
    Router_Diff();
};
/*#}#*/