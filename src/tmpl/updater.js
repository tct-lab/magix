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
    '&': 'amp',
    '<': 'lt',
    '>': 'gt',
    '"': '#34',
    '\'': '#39',
    '\`': '#96'
};
let Updater_ER = /[&<>"'\`]/g;
let Updater_Safeguard = v => Empty + (v == Null ? Empty : v);
let Updater_EncodeReplacer = m => `&${Updater_EM[m]};`;
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
    if (!$$.has(v)) {
        k = Spliter + $$.size;
        $$.set(v, k);
        $$.set(k, v);
    }
    return $$.get(v);
};
let Updater_Digest = (view, digesting) => {
    let keys = view['@{~view#updater.keys}'],
        changed = view['@{~view#updater.data.changed}'],
        vf = view.owner,
        viewId = view.id,
        ref = { '@{~updater-ref#view.renders}': [] },
        tmpl, vdom, data = view['@{~view#updater.data}'],
        refData = view['@{~view#updater.ref.data}'],
        redigest = trigger => {
            if (digesting['@{~updater#digesting.count}'] < digesting.length) {
                Updater_Digest(view, digesting);
            } else {
                ref = digesting.slice();
                digesting['@{~updater#digesting.count}'] = digesting.length = 0;
                if (trigger) {
                    view.fire('domready');
                }
                ToTry(ref);
            }
        };
    digesting['@{~updater#digesting.count}'] = digesting.length;
    view['@{~view#updater.data.changed}'] = 0;
    view['@{~view#updater.keys}'] = {};
    if (changed && view['@{~view#sign}'] > 0 && (tmpl = view.tmpl)) {
        view.fire('dompatch');
        vdom = tmpl(data, Q_Create, viewId, Updater_Safeguard, Updater_EncodeURI, refData, Updater_Ref, Updater_EncodeQ, IsArray);
        if (DEBUG) {
            Updater_CheckInput(view, vdom['@{~v#node.outer.html}']);
        }
        V_SetChildNodes(view.root, view['@{~view#updater.vdom}'], vdom, ref, vf, keys);
        view['@{~view#updater.vdom}'] = vdom;
        /*
            在dom diff patch时，如果已渲染的vframe有变化，则会在vom tree上先派发created事件，同时传递inner标志，vom tree处理alter事件派发状态，未进入created事件派发状态

            patch完成后，需要设置vframe hold fire created事件，因为带有assign方法的view在调用render后，vom tree处于就绪状态，此时会导致提前派发created事件，应该hold，统一在endUpdate中派发

            有可能不需要endUpdate，所以hold fire要视情况而定
        */
        //vf['@{~vframe#hold.fire}'] = tmpl = ref['@{~updater-ref#changed}'] || !view['@{~view#rendered}'];
        for (vdom of ref['@{~updater-ref#view.renders}']) {
            vdom['@{~view#render.short}']();
        }
        if (tmpl) {
            view.endUpdate();
        }
        redigest(1);
    } else {
        redigest();
    }
};