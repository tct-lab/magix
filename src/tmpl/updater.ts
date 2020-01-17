if (DEBUG) {
    var Updater_CheckInput = (view, html) => {
        if (/<(?:input|textarea|select)/i.test(html)) {
            let url = ParseUri(view.owner.path);
            let found = false, hasParams = false;
            for (let p in url.params) {
                hasParams = true;
                if (url.params[p][0] == Spliter) {
                    found = true;
                }
            }
            if (hasParams && !found) {
                console.warn('[!use at to pass parameter] path:' + view.owner.path + ' at ' + (view.owner.parent().path));
            }
        }
    };
}
let Updater_EM = {
    '&': '&#38;',
    '<': '&#60;',
    '>': '&#62;',
    '"': '&#34;',
    '\'': '&#39;',
    '\`': '&#96;'
};
let Updater_ER = /[&<>"'\`]/g;
let Updater_Safeguard = v => v == Null ? Empty : Empty + v;
let Updater_EncodeReplacer = m => Updater_EM[m];
let Updater_Encode = v => Updater_Safeguard(v).replace(Updater_ER, Updater_EncodeReplacer);

let Updater_UM = {
    '!': '%21',
    '\'': '%27',
    '(': '%28',
    ')': '%29',
    '*': '%2A'
};
let Updater_URIReplacer = m => Updater_UM[m];
let Updater_URIReg = /[!')(*]/g;
let Updater_EncodeURI = v => Encode(Updater_Safeguard(v)).replace(Updater_URIReg, Updater_URIReplacer);

let Updater_QR = /[\\'"]/g;
let Updater_EncodeQ = v => Updater_Safeguard(v).replace(Updater_QR, '\\$&');

let Updater_Ref = ($$, v, k) => {
    if (DEBUG && k === undefined) {
        console.error('check ref data!');
    }
    $$[k] = v;
    return k;
};
let Updater_Digest = (view /*#if(modules.async){#*/, fire/*#}#*/, tmpl) => {
    if (view['@{~view#sign}'] &&
        (tmpl = view.tmpl)) {
        let keys = view['@{~view#updater.keys}'],
            viewId = view.id,
            vf = Vframe_Vframes[viewId],
            ref = {
                '@{~updater-ref#view.renders}': []
         /*#if(modules.async){#*/, '@{~updater-ref#async.count}': 0/*#}#*/
            },
            vdom, data = view['@{~view#updater.data}'],
            refData = vf['@{~vframe#ref.data}'];
        view['@{~view#updater.data.changed}'] = 0;
        view['@{~view#updater.keys}'] = {};
        /*#if(modules.mxevent){#*/
        /*#if(modules.async){#*/
        if (fire) {
            /*#}#*/
            view.fire('dompatch');
            /*#if(modules.async){#*/
        }
        /*#}#*/
        /*#}#*/
        vdom = tmpl(data, Q_Create, viewId, Updater_Safeguard, Updater_EncodeURI, refData, Updater_Ref, Updater_EncodeQ, IsArray);
        if (DEBUG) {
            Updater_CheckInput(view, vdom['@{~v#node.outer.html}']);
        }
        /*#if(!modules.async){#*/
        V_SetChildNodes(view.root, view['@{~view#updater.vdom}'], vdom, ref, vf, keys);
        /*#}#*/
        /*#if(modules.async){#*/
        let ready = () => {
            /*#}#*/
            view['@{~view#updater.vdom}'] = vdom;
            /*#if(modules.async){#*/
            if (view['@{~view#async.count}'] > 1) {
                view['@{~view#async.count}'] = 1;
                Updater_Digest(view);
            } else {
                view['@{~view#async.count}'] = 0;
                /*#}#*/
                /*
                    在dom diff patch时，如果已渲染的vframe有变化，则会在vom tree上先派发created事件，同时传递inner标志，vom tree处理alter事件派发状态，未进入created事件派发状态
        
                    patch完成后，需要设置vframe hold fire created事件，因为带有assign方法的view在调用render后，vom tree处于就绪状态，此时会导致提前派发created事件，应该hold，统一在endUpdate中派发
        
                    有可能不需要endUpdate，所以hold fire要视情况而定
                */
                tmpl = ref['@{~updater-ref#changed}'] || !view['@{~view#rendered}'];
                for (vdom of ref['@{~updater-ref#view.renders}']) {
                    CallFunction(vdom['@{~view#render.short}'], Empty_Array, vdom, Spliter + vdom.id);
                    //CallFunction(View_CheckAssign, [vdom]);
                }
                if (tmpl) {
                    View_EndUpdate(view);
                }
                /*#if(modules.mxevent){#*/
                view.fire('domready');
                /*#}#*/
                /*#if(modules.async){#*/
            }
        }
        V_SetChildNodes(view.root, view['@{~view#updater.vdom}'], vdom, ref, vf, keys, view, ready);
        /*#}#*/
    }
};