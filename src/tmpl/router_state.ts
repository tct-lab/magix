/*#if(modules.router&&modules.routerState){#*/
let Win_History = Doc_Window.history;
let Router_UpdateState = (path, replace?: boolean) => Win_History[replace ? 'replaceState' : 'pushState'](Empty, Empty, path);
/*#if(modules.routerTip){#*/
let Router_Popstate;
let Router_Tip_Beforeunload;
/*#}#*/
let Router_Update = (path, params, loc, replace, silent) => {
    path = Router_PNR_Rebuild(path, params, Null, loc);
    if (path != loc.srcQuery) {
        Router_Silent = silent;
        Router_UpdateState(path, replace);
        /*#if(modules.routerTip){#*/
        Router_Popstate(1);
        /*#}else{#*/
        Router_Diff();
        /*#}#*/
    }
};
let Router_Bind = () => {
    /*#if(modules.routerTip){#*/
    let lastHref = Router_WinLoc.href;
    let newHref, suspend;
    AddEventListener(Doc_Window, 'popstate', Router_Popstate = (f, e) => {
        newHref = Router_WinLoc.href
        if (suspend) {
            /*#if(modules.routerTipLockUrl){#*/
            Router_UpdateState(lastHref);
            /*#}#*/
            return;
        }
        if (newHref != lastHref) {
            e = {
                '@{~exit-tip#from}': View_Exit_From_Router,
                '@{~exit-tip#mutual}': View_Exit_From_Vframe,
                reject() {
                    suspend = Empty;
                    /*#if(!modules.routerTipLockUrl){#*/
                    Router_UpdateState(lastHref);
                    /*#}#*/
                },
                resolve() {
                    suspend = Empty;
                    lastHref = newHref;
                    if (!f) Router_UpdateState(newHref);
                    Router_Diff();
                },
                stop() {
                    suspend = 1;
                    /*#if(modules.routerTipLockUrl){#*/
                    Router_UpdateState(lastHref);
                    /*#}#*/
                }
            };
            Router.fire(Change, e);
            View_RunExitList(e);
        }
    });
    AddEventListener(Doc_Window, 'onbeforeunload', Router_Tip_Beforeunload = (e, te, msg) => {
        e = e || Doc_Window.event;
        te = {};
        Router.fire(Page_Unload, te);
        if ((msg = te['@{~page-tip#msg}'])) {
            if (e) e.returnValue = msg;
            return msg;
        }
    });
    /*#}else{#*/
    AddEventListener(Doc_Window, 'popstate', Router_Diff);
    /*#}#*/
    Router_Diff();
};
let Router_Unbind = () => {
    /*#if(modules.routerTip){#*/
    RemoveEventListener(Doc_Window, 'popstate', Router_Popstate);
    RemoveEventListener(Doc_Window, 'beforeunload', Router_Tip_Beforeunload);
    /*#}else{#*/
    RemoveEventListener(Doc_Window, 'popstate', Router_Diff);
    /*#}#*/
    Router_LLoc = Router_Init_Loc;
};
/*#}#*/