//VARS
let Counter = 0;
let Empty = '';
let Empty_Array = [];
let Comma = ',';
let Null = null;
let Doc_Window = window;
/*#if(modules.router||modules.service){#*/
let Undefined = void Counter;
/*#}#*/
let Doc_Document = document;
let Timeout = Doc_Window.setTimeout;//setTimeout;
let Encode = encodeURIComponent;
let Value = 'value';
let Tag_Static_Key = '_';
let Tag_View_Params_Key = '$';
let Tag_Prop_Id = 'id';
/*#if(modules.customTags){#*/
let Tag_Prop_Is = 'is';
/*#}#*/
let Hash_Key = '#';
function Noop() { }
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
let MX_View = 'mx-view';
let ToString = Object[Prototype].toString;
let Type = o => ToString.call(o).slice(8, -1);
let IsObject = o => Type(o) == 'Object';
let IsArray = Array.isArray;
let GUID = (prefix?) => (prefix || Tag_Static_Key) + Counter++;
let GetById = id => Doc_Document.getElementById(id);
let SetInnerHTML = (n, html) => n.innerHTML = html;
let Mx_Cfg = {
    rootId: GUID(),
    /*#if(modules.require){#*/
    async require() { },
    /*#}#*/
    error(e) {
        throw e;
    }
};
let IsPrimitive = args => !args || typeof args != 'object';

let NodeIn = (a, b, r?) => {
    if (a && b) {
        r = a == b;
        if (!r) {
            try {
                r = (b.compareDocumentPosition(a) & 16) == 16;
            } catch (_magix) { }
        }
    }
    return r;
};
let Mark = (me, key, host?, m?, k?) => {
    k = Spliter + '@{~mark#object.deleted}';
    if (!me[k]) {
        k = Spliter + '@{~mark#object}';
        host = me[k] || (me[k] = {});
        if (!Has(host, key)) {
            host[key] = 0;
        }
        m = ++host[key];
    }
    return t => (t = me[k], t && m === t[key]);
};
let Unmark = me => {
    me[Spliter + '@{~mark#object}'] = 0;
    me[Spliter + '@{~mark#object.deleted}'] = 1;
};
let {
    assign: Assign,
    /*#if(modules.richVframe||modules.router){#*/
    keys: Keys,
    /*#}#*/
    hasOwnProperty: HasProp
} = Object;
let GA = Header.getAttribute;
let GetAttribute = (node, attr) => GA.call(node, attr);
let ApplyStyle = (key, css, node) => {
    if (DEBUG && IsArray(key)) {
        let result = [];
        for (let i = 0; i < key.length; i += 2) {
            result.push(ApplyStyle(key[i], key[i + 1]));
        }
        return result;
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
let ToTry = (fns, args?, context?, r?, e?) => {
    if (!IsArray(fns)) fns = [fns];
    if (!IsArray(args)) args = args && [args] || Empty_Array;
    for (e of fns) {
        try {
            r = e && e.apply(context, args);
        } catch (x) {
            Mx_Cfg.error(x);
        }
    }
    return r;
};

let Has = (owner, prop) => owner && HasProp.call(owner, prop);
let TranslateData = (data, params) => {
    let p, val;
    if (IsPrimitive(params)) {
        p = params + Empty;
        if (p[0] == Spliter) {
            params = data[p];
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