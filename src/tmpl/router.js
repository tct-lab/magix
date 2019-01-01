/*#if(modules.router){#*/

let Changed = 'changed';
let Change = 'change';
let Page_Unload = 'pageunload';
let Router_VIEW = 'view';
let Router_HrefCache = new Cache();
let Router_ChgdCache = new Cache();
let Router_WinLoc = location;
let Router_LastChanged;
let Router_Silent = 0;
let Router_LLoc = {
    query: {},
    params: {},
    href: Empty
};
let Router_TrimHashReg = /(?:^.*\/\/[^\/]+|#.*$)/gi;
let Router_TrimQueryReg = /^[^#]*#?!?/;
function GetParam(key, defaultValue) {
    return this[Params][key] || defaultValue !== Undefined && defaultValue || Empty;
}
//let Router_Edge = 0;
let Router_Hashbang = Hash_Key + '!';
let Router_UpdateHash = (path, replace) => {
    path = Router_Hashbang + path;
    if (replace) {
        Router_WinLoc.replace(path);
    } else {
        Router_WinLoc.hash = path;
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
    let lastHash = Router_Parse().srcHash;
    let newHash, suspend;
    AddEventListener(Doc_Window, 'hashchange', (e, loc, resolve) => {
        if (suspend) {
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
                    Router_UpdateHash(lastHash);
                },
                resolve,
                prevent() {
                    suspend = 1;
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
    Router_Diff();
};

let Router_PNR_Routers, Router_PNR_UnmatchView,
    Router_PNR_DefaultView, Router_PNR_DefaultPath;

let Router_PNR_Rewrite;
let DefaultTitle = Doc_Document.title;
let Router_AttachViewAndPath = (loc, view) => {
    if (!Router_PNR_Routers) {
        Router_PNR_Routers = Mx_Cfg.routes || {};
        Router_PNR_UnmatchView = Mx_Cfg.unmatchView;
        Router_PNR_DefaultView = Mx_Cfg.defaultView;
        //支持默认配置带参数的情况
        Router_PNR_DefaultPath = ParseUri(Mx_Cfg.defaultPath || '/');
        Router_PNR_Rewrite = Mx_Cfg.rewrite;
    }
    if (!loc[Router_VIEW]) {
        let path = loc.hash[Path] /*|| (Router_Edge && loc.query[Path])*/;
        if (!path) {
            path = Router_PNR_DefaultPath[Path];
            Assign(loc[Params], Router_PNR_DefaultPath[Params]);
        }

        if (Router_PNR_Rewrite) {
            path = Router_PNR_Rewrite(path, loc[Params], Router_PNR_Routers);
        }
        view = Router_PNR_Routers[path] || Router_PNR_UnmatchView || Router_PNR_DefaultView;
        loc[Path] = path;
        loc[Router_VIEW] = view;
        if (IsObject(view)) {
            if (DEBUG) {
                if (!view.view) {
                    console.error(path, ' config missing view!', view);
                }
            }
            Assign(loc, view);
        }
    }
};

let Router_GetChged = (oldLocation, newLocation) => {
    let oKey = oldLocation.href;
    let nKey = newLocation.href;
    let tKey = oKey + Spliter + nKey;
    let result = Router_ChgdCache.get(tKey);
    if (!result) {
        let hasChanged, rps;
        result = {
            params: rps = {},
            force: !oKey //是否强制触发的changed，对于首次加载会强制触发一次
        };
        let oldParams = oldLocation[Params],
            newParams = newLocation[Params],
            tArr = Keys(oldParams).concat(Keys(newParams)),
            key;
        let setDiff = key => {
            let from = oldParams[key],
                to = newParams[key];
            if (from != to) {
                rps[key] = {
                    from,
                    to
                };
                hasChanged = 1;
            }
        };
        for (key of tArr) {
            setDiff(key);
        }
        oldParams = oldLocation;
        newParams = newLocation;
        rps = result;
        setDiff(Path);
        setDiff(Router_VIEW);
        Router_ChgdCache.set(tKey, result = {
            a: hasChanged,
            b: result
        });
    }
    return result;
};
let Router_Parse = href => {
    href = href || Router_WinLoc.href;

    let result = Router_HrefCache.get(href),
        srcQuery, srcHash, query, hash, params;
    if (!result) {
        srcQuery = href.replace(Router_TrimHashReg, Empty);
        srcHash = href.replace(Router_TrimQueryReg, Empty);
        query = ParseUri(srcQuery);
        hash = ParseUri(srcHash);
        params = Assign({}, query[Params], hash[Params]);
        result = {
            get: GetParam,
            href,
            srcQuery,
            srcHash,
            query,
            hash,
            params
        };
        if (Magix_Booted) {
            Router_AttachViewAndPath(result);
            Router_HrefCache.set(href, result);
        }
        if (DEBUG) {
            result.params = Safeguard(result.params);
            result = Safeguard(result);
        }
    }
    return result;
};
let Router_Diff = () => {
    let location = Router_Parse();
    let changed = Router_GetChged(Router_LLoc, Router_LLoc = location);
    if (!Router_Silent && changed.a) {
        Router_LastChanged = changed.b;
        if (Router_LastChanged[Path]) {
            Doc_Document.title = location.title || DefaultTitle;
        }
        Router.fire(Changed, Router_LastChanged);
    }
    Router_Silent = 0;
    if (DEBUG) {
        Router_LastChanged = Safeguard(Router_LastChanged);
    }
    return Router_LastChanged;
};
/**
 * 路由对象，操作URL
 * @name Router
 * @namespace
 * @borrows Event.on as on
 * @borrows Event.fire as fire
 * @borrows Event.off as off
 * @beta
 * @module router
 */
let Router = Assign({
    /**
     * @lends Router
     */
    /**
     * 解析href的query和hash，默认href为location.href
     * @param {String} [href] href
     * @return {Object} 解析的对象
     */
    parse: Router_Parse,
    /**
     * 根据location.href路由并派发相应的事件,同时返回当前href与上一个href差异对象
     * @example
     * let diff = Magix.Router.diff();
     * if(diff.params.page || diff.params.rows){
     *     console.log('page or rows changed');
     * }
     */
    diff: Router_Diff,
    /**
     * 导航到新的地址
     * @param  {Object|String} pn path或参数字符串或参数对象
     * @param {String|Object} [params] 参数对象
     * @param {Boolean} [replace] 是否替换当前历史记录
     * @example
     * let R = Magix.Router;
     * R.to('/list?page=2&rows=20');//改变path和相关的参数，地址栏上的其它参数会进行丢弃，不会保留
     * R.to('page=2&rows=20');//只修改参数，地址栏上的其它参数会保留
     * R.to({//通过对象修改参数，地址栏上的其它参数会保留
     *     page:2,
     *     rows:20
     * });
     * R.to('/list',{//改变path和相关参数，丢弃地址栏上原有的其它参数
     *     page:2,
     *     rows:20
     * });
     *
     * //凡是带path的修改地址栏，都会把原来地址栏中的参数丢弃
     * 传递对象，内部对value会进行encodeURIComponent操作，传递字符串需要开发者自己处理。
     * R.to({
     *  page:2,
     *  rows:20
     * },null,true);//使用location.replace操作hash
     * R.to({
     *  page:2,
     *  rows:20
     * },null,null,true);//静默更新url但不派发事件
     */
    to(pn, params, replace, silent) {
        if (!params && IsObject(pn)) {
            params = pn;
            pn = Empty;
        }
        let temp = ParseUri(pn);
        let tParams = temp[Params];
        let tPath = temp[Path];
        let lPath = Router_LLoc[Path]; //历史路径
        let lParams = Router_LLoc[Params];
        let lQuery = Router_LLoc.query[Params];
        Assign(tParams, params); //把路径中解析出来的参数与用户传递的参数进行合并

        if (tPath) { //设置路径带参数的形式，如:/abc?q=b&c=e或不带参数 /abc
            //if (!Router_Edge) { //pushState不用处理
                for (lPath in lQuery) { //未出现在query中的参数设置为空
                    if (!Has(tParams, lPath)) tParams[lPath] = Empty;
                }
            //}
        } else if (lParams) { //只有参数，如:a=b&c=d
            tPath = lPath; //使用历史路径
            tParams = Assign({}, lParams, tParams);
        }
        Router_Update(tPath, tParams, Router_LLoc, replace, silent, lQuery);
    }
}, MxEvent);
/*#}#*/