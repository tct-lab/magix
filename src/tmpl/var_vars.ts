//VARS
let Counter = 0;
let Empty = '';
let Empty_Array = [];
let Comma = ',';
let Null = null;
let Doc_Window = window;
let Thousand = 1000;
let GPromise = Promise;
/*#if(modules.service){#*/
let Undefined = void Counter;
/*#}#*/
let Doc_Document = document;
let Timeout = Doc_Window.setTimeout;//setTimeout;
/*#if(modules.waitSelector||modules.taskIdle){#*/
let ClearTimeout = Doc_Window.clearTimeout;
/*#}#*/
let Encode = encodeURIComponent;
let Value = 'value';
let Tag_Static_Key = '_';
let Tag_View_Params_Key = '$';
let Tag_Prop_Id = 'id';
/*#if(modules.customTags){#*/
let Tag_Prop_Is = 'is';
/*#}#*/
let Hash_Key = '#';
function Noop(...args) { }
/*#if(modules.richView||modules.service){#*/
let JSON_Stringify = JSON.stringify;
/*#}#*/
let Header = Doc_Document.head;
let Doc_Body;
let Pfm = Doc_Window.performance;
let Date_Now = Pfm.now.bind(Pfm);
/*
    关于spliter
    出于安全考虑，使用不可见字符\u0000，然而，window手机上ie11有这样的一个问题：'\u0000'+"abc",结果却是一个空字符串，好奇特。
 */
let Spliter = '\x1e';
let Prototype = 'prototype';
let Params = 'params';
let Path = 'path';
let MX_PREFIX = 'mx5-';
//let Tag_Porp_MX_Key = MX_PREFIX + 'key';
let MX_View = MX_PREFIX + 'view';
let MX_OWNER = MX_PREFIX + 'owner';
/*#if(modules.xview){#*/
let MX_FROM = MX_PREFIX + 'from';
let MX_TO = MX_PREFIX + 'to';
/*#}#*/
let GUID = (prefix?) => (prefix || Tag_Static_Key) + Counter++;
let GetById = id => Doc_Document.getElementById(id);
let SetInnerHTML = (n, html) => n.innerHTML = html;
let isRString = s => s[0] == Spliter;
let Empty_Object = {};
type InnerMxCfg = {
    rootId?: string,
    require?(...args): any,
    retard?(flag?: number): void
    request?(flag?: number): void
    error?(e: Error): void
    remold?(target: HTMLElement, type: string, event: Event): boolean
    recast?(e: object): void
    rebuild?(path: string, params: object, lastParams: object, loc?: object): string
    rewrite?(path: string, params: object, routes: object, loc?: object): string
    title?: string
    unmatchView?: string
    defaultView?: string
    defaultPath?: string
    routes?: {
        [key: string]: string | object
    }
    paths?: {
        [key: string]: string
    }
};
/**
 * require//加载模块前调用，可预加载其它模块
 * rewrite//重写路由，比如从/xinglie/blog 变为 /blog?user=xinglie
 * rebuild//重建路由，比如从/blog?user=xinglie变为/xinglie/blog
 * recast //渲染根view时拦截，比如强制锁定显示某个view
 * remold//事件拦截
 * retard //magix是否繁忙
 * request //magix是否请求模块资源
 */
let Mx_Cfg: InnerMxCfg = {
    rootId: GUID(),
    /*#if(modules.require){#*/
    require: Noop,
    /*#}#*/
    /*#if(modules.wait){#*/
    retard: Noop,
    /*#}#*/
    /*#if(modules.load){#*/
    request: Noop,
    /*#}#*/
    error(e) {
        throw e;
    }
};

let IsPrimitive = args => !args || typeof args != 'object';

let NodeIn = (a, b, ignoreSelf?, r?) => {
    if (a && b) {
        r = !ignoreSelf && a == b;
        if (!r) {
            try {
                r = (b.compareDocumentPosition(a) & 16) == 16;
            } catch { }
        }
    }
    return r;
};
let Mark = (me, key, host?, m?, k?) => {
    k = Spliter + '@{~mark#object}';
    if (me[k] != 0) {
        host = me[k] || (me[k] = {});
        if (!Has(host, key)) {
            host[key] = Date_Now();
        }
        m = ++host[key];
    }
    return t => (t = me[k], t && m === t[key]);
};
let Unmark = (me, key?, k?, host?) => {
    k = Spliter + '@{~mark#object}';
    if (key) {
        host = me[k];
        if (host) {
            host[key] = 0;
        }
    } else {
        me[k] = 0;
    }
};
let {
    assign: Assign,
    /*#if(modules.richVframe||modules.router){#*/
    keys: Keys,
    /*#}#*/
    hasOwnProperty: HasProp,
    prototype: ObjectProto
} = Object;
let ToString = ObjectProto.toString;
let Type = o => ToString.call(o).slice(8, -1);
let strObject = 'Object';
let IsObject = o => Type(o) == strObject;
let IsArray = Array.isArray;
let strFunction = 'Function';
let IsFunction = o => Type(o) == strFunction;
let strString = 'String';
let IsString = o => Type(o) == strString;
let strNumber = 'Number';
let IsNumber = o => Type(o) == strNumber;
let GA = Header.getAttribute;
let GetAttribute = (node, attr) => GA.call(node, attr);
let ApplyStyle = (key, css, node?) => {
    if (DEBUG && IsArray(key)) {
        let result = [];
        for (let i = 0; i < key.length; i += 2) {
            result.push(ApplyStyle(key[i], key[i + 1]));
        }
        /*#if(modules.removeStyle){#*/
        return () => {
            for (let r of result) {
                r();
            }
        };
        /*#}#*/
    }
    if (css && !ApplyStyle[key]) {
        ApplyStyle[key] = 1;
        if (DEBUG) {
            if (key.indexOf('$throw_') === 0) {
                throw new Error(css);
            }
            node = Doc_Document.createElement('style');
            node.id = key;
            SetInnerHTML(node, css);
            Header.appendChild(node);
            /*#if(modules.removeStyle){#*/
            return () => {
                ApplyStyle[key] = Null;
                Header.removeChild(node);
            };
            /*#}#*/
        } else {
            node = Doc_Document.createElement('style');
            SetInnerHTML(node, css);
            Header.appendChild(node);
            /*#if(modules.removeStyle){#*/
            return () => {
                ApplyStyle[key] = Null;
                Header.removeChild(node);
            };
            /*#}#*/
        }
    }
};
let ToTry = (fn, args?, context?, r?) => {
    try {
        if (IsArray(args)) {
            r = fn.apply(context, args);
        } else {
            r = fn.call(context, args);
        }
    } catch (x) {
        Mx_Cfg.error(x);
    }
    return r;
};

let Has = (owner, prop) => owner && HasProp.call(owner, prop);
let TranslateData = (data, params) => {
    let p, val;
    if (IsPrimitive(params)) {
        p = params + Empty;
        if (isRString(p)) {
            params = data.get(p);
        }
    } else {
        for (p in params) {
            val = params[p];
            val = TranslateData(data, val);
            params[p] = val;
        }
    }
    return params;
};