//VARS
if (typeof DEBUG == 'undefined') window.DEBUG = true;
let Counter = 0;
let Empty = '';
let Empty_Array = [];
let Comma = ',';
let Null = null;
let Doc_Window = window;
let Undefined = void Counter;
let Doc_Document = document;
let Timeout = setTimeout;
let Encode = encodeURIComponent;
let Value = 'value';
let Tag_Static_Key = 'mxs';
let Tag_View_Params_Key = 'mxv';
let Hash_Key = '#';
function Noop() { }
let JSON_Stringify = JSON.stringify;
let Doc_Body = Doc_Document.body;
let Date_Now = Date.now;
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
let GUID = prefix => (prefix || 'mx_') + Counter++;
let GetById = id => Doc_Document.getElementById(id);
let SetInnerHTML = (n, html) => n.innerHTML = html;
let MxGlobalView = GUID();
let Mx_Cfg = {
    rootId: GUID(),
    defaultView: MxGlobalView,
    error(e) {
        throw e;
    }
};
let IsPrimitive = args => !args || typeof args != 'object';

let NodeIn = (a, b, r) => {
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
let {
    assign: Assign,
    keys: Keys,
    hasOwnProperty: HasProp
} = Object;
let Header = Doc_Document.head;
let Temp = Doc_Document.createElement('div');
let GA = Temp.getAttribute;
let GetAttribute = (node, attr) => GA.call(node, attr);
let ApplyStyle = (key, css) => {
    if (DEBUG && IsArray(key)) {
        for (let i = 0; i < key.length; i += 2) {
            ApplyStyle(key[i], key[i + 1]);
        }
        return;
    }
    if (css && !ApplyStyle[key]) {
        ApplyStyle[key] = 1;
        if (DEBUG) {
            if (key.indexOf('$throw_') === 0) {
                throw new Error(css);
            }
            SetInnerHTML(Temp, `<style id="${key}">${css}`);
            Header.appendChild(Temp.firstChild);
        } else {
            SetInnerHTML(Temp, `<style>${css}`);
            Header.appendChild(Temp.firstChild);
        }
    }
};
let ToTry = (fns, args, context, r, e) => {
    args = args || Empty_Array;
    if (!IsArray(fns)) fns = [fns];
    if (!IsArray(args)) args = [args];
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
        if (p[0] == Spliter && data.has(p)) {
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