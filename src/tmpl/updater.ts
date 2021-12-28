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
                console.warn('[!use # to pass parameter] path:' + view.owner.path + ' at ' + (view.owner.parent().path));
            }
        }
    };
}
let Updater_EM = {
    '&': 38,
    '<': 60,
    '>': 62,
    '"': 34,
    '\'': 39,
    '\`': 96
};
let Updater_ER = /[&<>"'\`]/g;
//let Updater_Safeguard = v => v == Null ? Empty : Empty + v;
let Updater_EncodeReplacer = m => `&#${Updater_EM[m]};`;
let Updater_Encode = v => (v + Empty).replace(Updater_ER, Updater_EncodeReplacer);

let Updater_UM = {
    '!': 1,
    '\'': 7,
    '(': 8,
    ')': 9,
    '*': 'A'
};
let Updater_URIReplacer = m => '%2' + Updater_UM[m];
let Updater_URIReg = /[!')(*]/g;
let Updater_EncodeURI = v => Encode(v).replace(Updater_URIReg, Updater_URIReplacer);

let Updater_QR = /[\\'"]/g;
let Updater_EncodeQ = v => (v + Empty).replace(Updater_QR, '\\$&');

let Updater_Ref = ($$, v, k) => {
    if ($$.has(v)) {
        k = $$.get(v);
    } else {
        /*#if(!modules.xview){#*/
        if (DEBUG) {
            if (k && $$.has(k)) {
                console.error(`map has different value for same key:${k},current value:${v},previous value:${$$.get(k)}`);
            }
        }
        /*#}#*/
        k = Spliter + (k || $$['@{~vframe-data-map#index}']++);
        if (!$$.has(k)) {
            $$.set(v, k);
            $$.set(k, v);
        }
    }
    return k;
    // if (DEBUG && k === undefined) {
    //     console.error('check ref data!');
    // }
    // $$[k] = v;
    // return k;
};
// let Updater_Ready_List = [];
// let Updater_Ready_Checker = ready => {
//     let findUnready = 0,
//         findCurrent = 0;
//     for (let r of Updater_Ready_List) {
//         if (r['@{~ready#callback}'] == ready) {
//             r['@{~ready#ok}'] = 1;
//             findCurrent = 1;
//         }
//         if (r['@{~ready#ok}']) {
//             if (!findUnready &&
//                 !r['@{~ready#invoke}']) {
//                 r['@{~ready#invoke}'] = 1;
//                 r['@{~ready#callback}']();
//                 r['@{~ready#callback}'] = Empty;
//             }
//         } else {
//             findUnready = 1;
//         }
//         if (findUnready &&
//             findCurrent) {
//             break;
//         }
//     }
//     findCurrent = Updater_Ready_List[Updater_Ready_List.length - 1];
//     if (findCurrent['@{~ready#callback}'] === Empty) {
//         Updater_Ready_List.length = 0;
//     }
// };
let Updater_Digest =/*#if(modules.preloadViews){#*/ async /*#}#*/(view /*#if(modules.async){#*/, fire?/*#}#*/, tmpl?) => {
    if (view['@{~view.sign}'] &&
        (tmpl = view['@{~view.template}'])) {
        let { '@{~view.updater.keys}': keys,
            id: viewId,
            '@{~view.updater.data}': data } = view,
            vf = Vframe_Vframes[viewId],
            ready, preRequires,
            ref = {
                '@{~updater-ref#view.renders}': [],
                '@{~updater-ref#node.props}': []
                /*#if(modules.xview){#*/, '@{~updater-ref#view.id}': viewId/*#}#*/
         /*#if(modules.async){#*/, '@{~updater-ref#async.count}': 0/*#}#*/
            },
            vdom,
            refData = vf['@{~vframe.ref.data}'];
        view['@{~view.updater.data.changed}'] = 0;
        view['@{~view.updater.keys}'] = {};
        /*#if(modules.lockSubWhenBusy){#*/
        Body_Vframe_Busy[viewId] = 1;
        /*#}#*/
        /*#if(modules.mxevent){#*/
        /*#if(modules.async){#*/
        if (fire) {
            /*#}#*/
            view.fire('dompatch');
            /*#if(modules.async){#*/
        }
        /*#}#*/
        /*#}#*/
        refData['@{~vframe-data-map#index}'] = 0;
        refData.clear();
        vdom = tmpl(/*#if(modules.catchHTMLError){#*/Mx_Cfg.error,/*#}#*/data, Q_Create, viewId, Updater_EncodeURI, refData, Updater_Ref, Updater_EncodeQ, IsArray);
        /*#if(modules.preloadViews){#*/
        tmpl = vdom['@{~v#node.views}'];
        if (tmpl) {
            preRequires = [];
            for (ready of tmpl) {
                Vframe_TranslateQuery(ready[1], ready[2], ready[3]);
                preRequires.push(Async_Require(ready[0], ready[3]));
            }
            await GPromise.all(preRequires);
        }
        /*#}#*/
        if (DEBUG) {
            Updater_CheckInput(view, vdom['@{~v#node.outer.html}']);
        }
        /*#if(modules.innerView){#*/
        if (vf.pId &&
            !view['@{~view.rendered}']) {
            Vframe_UnmountZone(Vframe_Vframes[vf.pId], vf.root, 1);
        }
        /*#}#*/
        /*#if(!modules.async){#*/
        V_SetChildNodes(view.root, view['@{~view.updater.vdom}'], vdom, ref, vf, keys);
        /*#}#*/
        /*#if(modules.async){#*/
        ready = () => {
            /*#}#*/
            view['@{~view.updater.vdom}'] = vdom;
            if (view['@{~view.sign}']) {
                tmpl = ref['@{~updater-ref#changed}'] || !view['@{~view.rendered}'];
                if (tmpl) {
                    View_EndUpdate(view);
                }
                for (vdom of ref['@{~updater-ref#view.renders}']) {
                    CallFunction(vdom['@{~view.render.short}'], Empty_Array, vdom);
                    //CallFunction(View_CheckAssign, [vdom]);
                }
                /*#if(modules.lockSubWhenBusy){#*/
                Body_Vframe_Busy[viewId] = 0;
                /*#}#*/
            }
            /*#if(modules.async){#*/
            if (view['@{~view.async.count}'] > 1) {
                view['@{~view.async.count}'] = 1;
                ref['@{~updater-ref#node.props}'].length = 0;
                Updater_Digest(view);
            } else {
                view['@{~view.async.count}'] = 0;
                /*#}#*/
                /*
                    在dom diff patch时，如果已渲染的vframe有变化，则会在vom tree上先派发created事件，同时传递inner标志，vom tree处理alter事件派发状态，未进入created事件派发状态
        
                    patch完成后，需要设置vframe hold fire created事件，因为带有assign方法的view在调用render后，vom tree处于就绪状态，此时会导致提前派发created事件，应该hold，统一在endUpdate中派发
        
                    有可能不需要endUpdate，所以hold fire要视情况而定
                */
                for ([vdom, viewId, refData] of ref["@{~updater-ref#node.props}"]) {
                    if (vdom[viewId] != refData) {
                        vdom[viewId] = refData;
                    }
                }
                /*#if(modules.mxevent){#*/
                view.fire('domready');
                /*#}#*/
                /*#if(modules.async){#*/
                keys = view['@{~view.async.resolves}'];
                for (vdom of keys) {
                    vdom();
                }
                keys.length = 0;
            }
        };
        // Updater_Ready_List.push({
        //     '@{~ready#callback}': ready
        // });
        CallFunction(V_SetChildNodes, [view.root, view['@{~view.updater.vdom}'], vdom, ref, vf, keys, view, ready]);
        //V_SetChildNodes(view.root, view['@{~view.updater.vdom}'], vdom, ref, vf, keys, view, ready);
        /*#}#*/
    }
};