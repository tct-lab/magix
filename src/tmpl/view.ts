//like 'login<click>' or '$<click>' or '$win<scroll>' or '$win<scroll>&{capture:true}'
let View_EvtMethodReg = /^(\$?)([^<]*)<([^>]+)>(?:\s*&(.+))?$/;

let processMixinsSameEvent = (exist, additional, temp?) => {
    if (exist['@{~viewmixin#list}']) {
        temp = exist;
    } else {
        temp = function (e, f) {
            for (f of temp['@{~viewmixin#list}']) {
                ToTry(f, e, this);
            }
        };
        temp['@{~viewmixin#list}'] = [exist];
        temp['@{~viewmixin#is.mixin}'] = 1;
    }
    temp['@{~viewmixin#list}'] = temp['@{~viewmixin#list}'].concat(additional['@{~viewmixin#list}'] || additional);
    return temp;
};
/*#if(!modules.async){#*/
// let View_CheckAssign = view => {
//     if (view['@{~view.assign.sign}']) {
//         view['@{~view.assign.sign}']--;
//     }
//     if (view['@{~view.sign}'] && !view['@{~view.assign.sign}']) { //signature
//         ToTry(view['@{~view.render.short}'], Empty_Array, view);
//     }
// };
/*#}#*/
let View_EndUpdate = view => {
    /*#if(modules.richVframe){#*/let o, f;/*#}#*/
    if (view['@{~view.sign}']) {
        /*#if(modules.richVframe){#*/
        f = view['@{~view.rendered}'];
        /*#}#*/
        view['@{~view.rendered}'] = 1;
        /*#if(modules.richVframe){#*/
        o = view.owner;
        Vframe_MountZone(o);
        if (!f) {
            CallFunction(Vframe_RunInvokes, o);
        }
        /*#}else{#*/
        Vframe_MountZone(view.owner);
        /*#}#*/
    }
};
let View_DelegateEvents = (me, destroy?) => {
    let e, { '@{~view.events.object}': eventsObject,
        '@{~view.selector.events.object}': selectorObject,
        '@{~view.events.list}': eventsList, id } = me; //eventsObject
    for (e in eventsObject) {
        Body_DOMEventBind(e, selectorObject[
            e], destroy, eventsObject[e]);
    }
    eventsObject = destroy ? RemoveEventListener : AddEventListener;
    for (e of eventsList) {
        eventsObject(e['@{~xevent#element}'], e['@{~xevent#name}'], e['@{~xevent#callback}'], e['@{~xevent#modifier}'], id, me);
    }
};
let View_Globals = {
    win: Doc_Window,
    doc: Doc_Document,
    root: Empty
};
function staticExtend(...args) {
    return Assign(this, ...args), this;
}
let View_MergeMixins = (mixins, proto, ctors) => {
    let temp = {}, p, node, fn, exist;
    for (node of mixins) {
        for (p in node) {
            fn = node[p];
            exist = temp[p];
            if (p == 'ctor') {
                ctors.push(fn);
                continue;
            } else if (View_EvtMethodReg.test(p)) {
                if (exist) {
                    fn = processMixinsSameEvent(exist, fn);
                } else {
                    fn['@{~viewmixin#is.mixin}'] = 1;
                }
            } else if (DEBUG &&
                exist &&
                fn != exist) { //只在开发中提示
                console.warn('plugins duplicate property:' + p);
            }
            temp[p] = fn;
        }
    }
    for (p in temp) {
        if (!Has(proto, p)) {
            proto[p] = temp[p];
        } else if (DEBUG) {
            console.warn('already exist ' + p + ',avoid override it!');
        }
    }
};
function merge(...args) {
    let me = this, _ = me['@{~view-factory#ctors}'] || (me['@{~view-factory#ctors}'] = []);
    View_MergeMixins(args, me[Prototype], _);
    return me;
}
let safeRender = render => function (...args) { return this['@{~view.sign}'] && ToTry(render, args, this); };
let execCtors = (list, params, me, cx?) => {
    if (list) {
        for (cx of list) {
            ToTry(cx, params, me);
        }
    }
}
function extend(props) {
    let me = this;
    props = props || {};
    let ctor = props.ctor;
    function NView(viewId, rootNode, ownerVf, initParams, z) {
        me.call(z = this, viewId, rootNode, ownerVf, initParams);
        if (ctor) ToTry(ctor, initParams, z);
        execCtors(NView['@{~view-factory#ctors}'], initParams, z);
    }
    NView.merge = merge;
    NView.extend = extend;
    NView.static = staticExtend;
    return Extend(NView, me, props);
}
let View_Prepare = oView => {
    if (!oView[Spliter]) { //只处理一次
        oView[Spliter] = 1;
        let prop = oView[Prototype],
            currentFn, matches, selectorOrCallback, events, eventsObject = {},
            eventsList = [],
            selectorObject = {},
            node, isSelector, p, item, mask, mod, modifiers;
        for (p in prop) {
            currentFn = prop[p];
            matches = p.match(View_EvtMethodReg);
            if (matches) {
                [, isSelector, selectorOrCallback, events, modifiers] = matches;
                mod = modifiers ? ToObject(modifiers) : Body_Capture_False_Passive_True_Modifier;
                events = events.split(Comma);
                for (item of events) {
                    node = View_Globals[selectorOrCallback];
                    mask = 0;
                    if (mod.passive ||
                        mod.passive == Null) {
                        mask |= Body_Passive_True_Flag;
                    } else {
                        mask |= Body_Passive_False_Flag;
                    }
                    if (mod.capture) {
                        mask |= Body_Capture_True_Flag;
                    } else {
                        mask |= Body_Capture_False_Flag;
                    }
                    if (isSelector) {
                        if (node) {
                            eventsList.push({
                                '@{~xevent#callback}': currentFn,
                                '@{~xevent#element}': node,
                                '@{~xevent#name}': item,
                                '@{~xevent#modifier}': mod
                            });
                            continue;
                        }
                        if (node === Empty) {
                            selectorOrCallback = Empty;
                        }
                        node = selectorObject[item];
                        if (!node) {
                            node = selectorObject[item] = [];
                        }
                        if (!node[selectorOrCallback]) {
                            node[selectorOrCallback] = 1;
                            node.push(selectorOrCallback);
                        }
                    }
                    eventsObject[item] |= mask;
                    item = selectorOrCallback + Spliter + item;
                    node = prop[item];
                    //for in 就近遍历，如果有则忽略
                    if (!node) { //未设置过
                        prop[item] = currentFn;
                    } else if (node['@{~viewmixin#is.mixin}']) { //现有的方法是mixins上的
                        if (currentFn['@{~viewmixin#is.mixin}']) { //2者都是mixins上的事件，则合并
                            prop[item] = processMixinsSameEvent(currentFn, node);
                        } else if (Has(prop, p)) { //currentFn方法不是mixin上的，也不是继承来的，在当前view上，优先级最高
                            prop[item] = currentFn;
                        }
                    }
                }
            }
        }
        if (prop['@{~view.render.short}'] != prop.render) {
            prop['@{~view.render.short}'] = prop.render = safeRender(prop.render);
        }
        prop['@{~view.events.object}'] = eventsObject;
        prop['@{~view.events.list}'] = eventsList;
        prop['@{~view.selector.events.object}'] = selectorObject;
        prop['@{~view.assign.fn}'] = prop.assign;
        prop['@{~view.template}'] = prop.tmpl;
    }
};
/*#if(modules.router&&modules.routerTip){#*/
let View_Exit_From_Router = '@{~tip-mutual#from.router}';
let View_Exit_From_Vframe = '@{~tip-mutual#from.vframe}';
let View_ExitList = [];
let View_RunExitList = (e, idx = 0) => {
    let head = View_ExitList[idx];
    if (head) {
        let [view, msg] = head;
        view.exitConfirm(msg, () => {
            View_RunExitList(e, idx + 1);
        }, () => {
            View_ExitList.length = 0;
            View_ExitList[e['@{~exit-tip#from}']] = 0;
            e.reject();
        });
    } else {
        View_ExitList.length = 0;
        View_ExitList[e['@{~exit-tip#from}']] = 0;
        e.resolve();
    }
};
/*#}#*/

function View(id, root, owner, params, me?) {
    me = this;
    me.root = root;
    me.owner = owner;
    me.id = id;
    //me[Spliter] = id;
    /*#if(modules.router){#*/
    me['@{~view.observe.router}'] = {
        '@{~view-router#observe.params}': []
    };
    /*#}#*/
    me['@{~view.sign}'] = 1; //标识view是否刷新过，对于托管的函数资源，在回调这个函数时，不但要确保view没有销毁，而且要确保view没有刷新过，如果刷新过则不回调
    me['@{~view.updater.data.changed}'] = 1;
    me['@{~view.updater.data}'] = {};
    me['@{~view.updater.keys}'] = {};
    //me['@{~view.assign.sign}'] = 0;
    /*#if(modules.async){#*/
    me['@{~view.async.count}'] = 0;
    me['@{~view.async.resolves}'] = [];
    /*#}#*/
    execCtors(View['@{~view-factory#ctors}'], params, me);
}
Assign(View, {
    merge,
    extend
});
Assign(View[Prototype], /*#if(modules.mxevent){#*/MxEvent,/*#}#*/ {
    init: Noop,
    render: Noop,
    assign: Noop,
    /*#if(modules.router&&modules.routerTip){#*/
    observeExit(msg, fn) {
        let me = this;
        if (!me['@:{~view#exit.listener}']) {
            let changeListener = e => {
                if (View_ExitList[e['@{~exit-tip#mutual}']]) {
                    e.stop();
                    e.reject();
                } else if (fn()) {
                    e.stop();
                    View_ExitList[e['@{~exit-tip#from}']] = 1;
                    View_ExitList.push([me, msg]);
                }
            }, unloadListener = e => {
                if (!e['@{~page-tip#msg}'] &&
                    fn()) {
                    e['@{~page-tip#msg}'] = msg;
                }
            };
            Router.on(Change, changeListener);
            Router.on(Page_Unload, unloadListener);
            me['@:{~view#exit.listener}'] = changeListener;
            me.on('destroy', () => {
                Router.off(Change, changeListener);
                Router.off(Page_Unload, unloadListener);
            });
        }
    },
    /*#}#*/
    /*#if(modules.router){#*/
    observeLocation(params, isObservePath) {
        let me = this,
            loc;
        loc = me['@{~view.observe.router}'];
        loc['@{~view-router#observed}'] = 1;
        if (IsObject(params)) {
            isObservePath = params[Path];
            params = params[Params];
        }
        loc['@{~view-router#observe.path}'] = isObservePath;
        if (params) {
            loc['@{~view-router#observe.params}'] = (params + Empty).split(Comma);
        }
    },
    /*#}#*/
    get(key, result) {
        result = this['@{~view.updater.data}'];
        if (key) {
            result = result[key];
        }
        return result;
    },
    set(newData) {
        let me = this,
            oldData = me['@{~view.updater.data}'],
            keys = me['@{~view.updater.keys}'];
        let changed = me['@{~view.updater.data.changed}'],
            now, old, p, c;
        for (p in newData) {
            now = newData[p];
            old = oldData[p];
            c = !IsPrimitive(now) || old != now;
            if (c) {
                keys[p] = 1;
                changed = 1;
            }
            oldData[p] = now;
        }
        me['@{~view.updater.data.changed}'] = changed;
        return me;
    },
    digest(data) {
        data = this.set(data);
        /*
            view:
            <div>
                <mx-dropdown mx-focusout="rerender()"/>
            <div>

            view.digest=>dropdown.focusout=>view.redigest=>view.redigest.end=>view.digest.end

            view.digest中嵌套了view.redigest，view.redigest可能操作了view.digest中引用的dom,这样会导致view.redigest.end后续的view.digest中出错

            expect
            view.digest=>dropdown.focusout=>view.digest.end=>view.redigest=>view.redigest.end

            如果在digest的过程中，多次调用自身的digest，则后续的进行排队。前面的执行完成后，排队中的一次执行完毕
        */
        /*#if(modules.async){#*/
        return new GPromise<void>(resolve => {
            /*#}#*/
            if (data['@{~view.updater.data.changed}']) {
                /*#if(modules.async){#*/
                data['@{~view.async.count}']++;
                data['@{~view.async.resolves}'].push(resolve);
                if (data['@{~view.async.count}'] == 1) {
                    Updater_Digest(data, 1);
                }
                /*#}else{#*/
                if (DEBUG) {
                    if (!data['@{~view.digesting.count}']) {
                        data['@{~view.digesting.count}'] = 1;
                        Updater_Digest(data);
                        data['@{~view.digesting.count}'] = 0;
                    } else if (DEBUG) {
                        console.error('Avoid redigest while updater is digesting');
                    }
                } else {
                    Updater_Digest(data);
                }
                /*#}#*/
            }
            /*#if(modules.async){#*/
            else if (data['@{~view.async.count}']) {
                data['@{~view.async.resolves}'].push(resolve);
            } else {
                resolve();
            }
        });
        /*#}#*/
    },
    finale() {
        let me = this;
        return new GPromise<void>(resolve => {
            if (me['@{~view.async.count}']) {
                me['@{~view.async.resolves}'].push(resolve);
            } else {
                resolve();
            }
        });
    },
    /*#if(modules.richView){#*/
    changed() {
        return this['@{~view.updater.data.changed}'];
    },
    // snapshot() {
    //     let me = this;
    //     me['@{~view.updater.data.string}'] = JSON_Stringify(me['@{~view.updater.data}']);
    //     return me;
    // },
    // altered() {
    //     let me = this;
    //     if (me['@{~view.updater.data.string}']) {
    //         return me['@{~view.updater.data.string}'] != JSON_Stringify(me['@{~view.updater.data}']);
    //     }
    // },
    translate(data) {
        return TranslateData(this.owner['@{~vframe.ref.data}'], data);
    },
    /*#}#*/
    parse(origin) {
        return ParseExpr(origin, this.owner['@{~vframe.ref.data}']);
    }
});