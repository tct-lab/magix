//like 'login<click>' or '$<click>' or '$win<scroll>' or '$win<scroll>&passive,capture'
let View_EvtMethodReg = /^(\$?)([^<]*)<([^>]+)>(?:&(.+))?$/;
/*#if(modules.router&&modules.routerTip){#*/
let View_Tip_Suspend;
/*#}#*/
/*#if(modules.mixins){#*/
let processMixinsSameEvent = (exist, additional, temp?) => {
    if (exist['@{~viewmixin#list}']) {
        temp = exist;
    } else {
        temp = function (e) {
            ToTry(temp['@{~viewmixin#list}'], e, this);
        };
        temp['@{~viewmixin#list}'] = [exist];
        temp['@{~viewmixin#is.mixin}'] = 1;
    }
    temp['@{~viewmixin#list}'] = temp['@{~viewmixin#list}'].concat(additional['@{~viewmixin#list}'] || additional);
    return temp;
};
/*#}#*/
/*#if(!modules.async){#*/
let View_CheckAssign = view => {
    if (view['@{~view#assign.sign}']) {
        view['@{~view#assign.sign}']--;
    }
    if (view['@{~view#sign}'] && !view['@{~view#assign.sign}']) { //signature
        ToTry(view['@{~view#render.short}'], Empty_Array, view);
    }
};
/*#}#*/
let View_EndUpdate = view => {
    /*#if(modules.richVframe){#*/let o, f;/*#}#*/
    if (view['@{~view#sign}']) {
        /*#if(modules.richVframe){#*/
        f = view['@{~view#rendered}'];
        /*#}#*/
        view['@{~view#rendered}'] = 1;
        /*#if(modules.richVframe){#*/
        o = view.owner;
        o.mountZone();
        if (!f) {
            Timeout(Vframe_RunInvokes, 0, o);
        }
        /*#}else{#*/
        view.owner.mountZone();
        /*#}#*/
    }
};
let View_DelegateEvents = (me, destroy) => {
    let e, { '@{~view#events.object}': eventsObject,
        '@{~view#selector.events.object}': selectorObject,
        '@{~view#events.list}': eventsList, id } = me; //eventsObject
    for (e in eventsObject) {
        Body_DOMEventBind(e, selectorObject[
            e], destroy);
    }
    eventsObject = destroy ? RemoveEventListener : AddEventListener;
    for (e of eventsList) {
        eventsObject(e['@{~xevent#element}'], e['@{~xevent#name}'], e['@{~xevent#callback}'], id, e['@{~xevent#modifier}'], me);
    }
};
let View_Globals = {
    win: Doc_Window,
    doc: Doc_Document
};
/*#if(modules.mixins){#*/
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
                Mx_Cfg.error(Error('plugins duplicate property:' + p));
            }
            temp[p] = fn;
        }
    }
    for (p in temp) {
        if (!Has(proto, p)) {
            proto[p] = temp[p];
        }
    }
};
function merge(...args) {
    let me = this, _ = me['@{~view-factory#ctors}'] || (me['@{~view-factory#ctors}'] = []);
    View_MergeMixins(args, me[Prototype], _);
    return me;
}
/*#}#*/
function extend(props, statics) {
    let me = this;
    props = props || {};
    let ctor = props.ctor;
    /*#if(modules.mixins){#*/
    let ctors = [];
    if (ctor) ctors.push(ctor);
    /*#}#*/
    function NView(viewId, rootNode, ownerVf, initParams
        /*#if(modules.mixins){#*/, mixinCtors, cs, concatCtors/*#}#*/, z) {
        me.call(z = this, viewId, rootNode, ownerVf, initParams
            /*#if(modules.mixins){#*/, mixinCtors/*#}#*/);

        /*#if(modules.mixins){#*/
        cs = NView['@{~view-factory#ctors}'];
        if (cs) ToTry(cs, initParams, z);
        concatCtors = ctors.concat(mixinCtors);
        if (concatCtors.length) {
            ToTry(concatCtors, initParams, z);
        }
        /*#}else{#*/
        if (ctor) ToTry(ctor, initParams, z);
        /*#}#*/
    }
    /*#if(modules.mixins){#*/
    NView.merge = merge;
    /*#}#*/
    NView.extend = extend;
    return Extend(NView, me, props, statics);
}
let View_Prepare = oView => {
    if (!oView[Spliter]) { //只处理一次
        /*#if(modules.mixins){#*/
        oView[Spliter] = [];
        /*#}else{#*/
        oView[Spliter] = 1;
        /*#}#*/
        let prop = oView[Prototype],
            currentFn, matches, selectorOrCallback, events, eventsObject = {},
            eventsList = [],
            selectorObject = {},
            node, isSelector, p, item, mask, mod, modifiers;
        /*#if(modules.mixins){#*/
        matches = prop.mixins;
        if (matches) {
            View_MergeMixins(matches, prop, oView[Spliter]);
        }
        /*#}#*/
        for (p in prop) {
            currentFn = prop[p];
            matches = p.match(View_EvtMethodReg);
            if (matches) {
                [, isSelector, selectorOrCallback, events, modifiers] = matches;
                mod = {};
                if (modifiers) {
                    modifiers = modifiers.split(Comma);
                    for (item of modifiers) {
                        mod[item] = true;
                    }
                }
                events = events.split(Comma);
                for (item of events) {
                    node = View_Globals[selectorOrCallback];
                    mask = 1;
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
                        mask = 2;
                        node = selectorObject[item];
                        if (!node) {
                            node = selectorObject[item] = [];
                        }
                        if (!node[selectorOrCallback]) {
                            node[selectorOrCallback] = 1;
                            node.push(selectorOrCallback);
                        }
                    }
                    eventsObject[item] = eventsObject[item] | mask;
                    item = selectorOrCallback + Spliter + item;
                    node = prop[item];
                    //for in 就近遍历，如果有则忽略
                    if (!node) { //未设置过
                        prop[item] = currentFn;
                    }/*#if(modules.mixins){#*/
                    else if (node['@{~viewmixin#is.mixin}']) { //现有的方法是mixins上的
                        if (currentFn['@{~viewmixin#is.mixin}']) { //2者都是mixins上的事件，则合并
                            prop[item] = processMixinsSameEvent(currentFn, node);
                        } else if (Has(prop, p)) { //currentFn方法不是mixin上的，也不是继承来的，在当前view上，优先级最高
                            prop[item] = currentFn;
                        }
                    }
                    /*#}#*/
                }
            }
        }
        prop['@{~view#render.short}'] = prop.render;
        prop['@{~view#events.object}'] = eventsObject;
        prop['@{~view#events.list}'] = eventsList;
        prop['@{~view#selector.events.object}'] = selectorObject;
        prop['@{~view#assign.fn}'] = prop.assign;
    }/*#if(modules.mixins){#*/
    return oView[Spliter];
    /*#}#*/
};


function View(id, root, owner/*#if(modules.mixins){#*/, ops/*#}#*/, me) {
    me = this;
    me.root = root;
    me.owner = owner;
    me.id = id;
    me[Spliter] = id;
    /*#if(modules.router){#*/
    me['@{~view#observe.router}'] = {
        '@{~view-router#observe.params}': []
    };
    /*#}#*/
    me['@{~view#sign}'] = 1; //标识view是否刷新过，对于托管的函数资源，在回调这个函数时，不但要确保view没有销毁，而且要确保view没有刷新过，如果刷新过则不回调
    me['@{~view#updater.data.changed}'] = 1;

    if (DEBUG) {
        me['@{~view#updater.data}'] = Safeguard({
            id
        }, true, key => {
            if (key == 'id') {
                throw new Error(`avoid write ${key} to view data!`);
            }
        });
    } else {
        me['@{~view#updater.data}'] = {
            id
        };
    }
    me['@{~view#updater.keys}'] = {};
    me['@{~view#assign.sign}'] = 0;
    /*#if(modules.async){#*/
    me['@{~view#async.count}'] = 0;
    /*#}#*/
    /*#if(modules.mixins){#*/
    id = View['@{~view-factory#ctors}'];
    if (id) ToTry(id, ops, me);
    /*#}#*/
}
Assign(View, {
    /*#if(modules.mixins){#*/
    merge,
    /*#}#*/
    extend
});
Assign(View[Prototype], /*#if(modules.mxevent){#*/MxEvent,/*#}#*/ {
    init: Noop,
    render: Noop,
    assign: Noop,
    /*#if(modules.router&&modules.routerTip){#*/
    leaveTip(msg, fn) {
        let me = this;
        let changeListener = e => {
            if (View_Tip_Suspend) {
                e.stop();
            } else if (fn()) {
                e.stop();
                View_Tip_Suspend = 1;
                me.leaveConfirm(msg, () => {
                    View_Tip_Suspend = 0;
                    e.resolve();
                }, () => {
                    View_Tip_Suspend = 0;
                    e.reject();
                });
            }
            // let a = '@{~leave#router.change}', // a for router change
            //     b = '@{~leave#view.unload}'; // b for viewunload change
            // if (e.type != Change) {
            //     a = '@{~leave#view.unload}';
            //     b = '@{~leave#router.change}';
            // }
            // if (changeListener[a]) {
            //     e.stop();
            // } else if (!e['@{~router-tip#suspend}'] && fn()) {
            //     e.stop();
            //     changeListener[b] = 1;
            //     me.leaveConfirm(msg, () => {
            //         changeListener[b] = 0;
            //         e.resolve();
            //     }, () => {
            //         changeListener[b] = 0;
            //         e.reject();
            //     });
            // }
        };
        let unloadListener = e => {
            if (!e['@{~page-tip#msg}'] && fn()) {
                e['@{~page-tip#msg}'] = msg;
            }
        };
        Router.on(Change, changeListener);
        Router.on(Page_Unload, unloadListener);
        me.on('unload', changeListener);
        me.on('destroy', () => {
            Router.off(Change, changeListener);
            Router.off(Page_Unload, unloadListener);
        });
    },
    /*#}#*/
    observeLocation(params, isObservePath) {
        let me = this,
            loc;
        loc = me['@{~view#observe.router}'];
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
    get(key, result) {
        result = this['@{~view#updater.data}'];
        if (key) {
            result = result[key];
        }
        return result;
    },
    set(newData, unchanged) {
        let me = this,
            oldData = me['@{~view#updater.data}'],
            keys = me['@{~view#updater.keys}'];
        let changed = me['@{~view#updater.data.changed}'],
            now, old, p;
        for (p in newData) {
            now = newData[p];
            old = oldData[p];
            if ((!IsPrimitive(now) || old != now) &&
                !Has(unchanged, p)) {
                keys[p] = 1;
                changed = 1;
            }
            oldData[p] = now;
        }
        me['@{~view#updater.data.changed}'] = changed;
        return me;
    },
    changed() {
        if (DEBUG) {
            return Boolean(this['@{@{~view#updater.data.changed}}']);
        }
        return this['@{@{~view#updater.data.changed}}'];
    },
    digest(data, unchanged) {
        let me = this.set(data, unchanged);
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
        if (me['@{~view#updater.data.changed}'] && me['@{~view#sign}']) {
            /*#if(modules.async){#*/
            if (!me['@{~view#async.count}']) {
                me['@{~view#async.count}']++;
                Updater_Digest(me, 1);
            } else {
                me['@{~view#async.count}']++;
            }
            /*#}else{#*/
            if (DEBUG) {
                if (!me['@{~view#digesting.count}']) {
                    me['@{~view#digesting.count}'] = 1;
                    Updater_Digest(me);
                    me['@{~view#digesting.count}'] = 0;
                } else if (DEBUG) {
                    console.error('Avoid redigest while updater is digesting');
                }
            } else {
                Updater_Digest(me);
            }
            /*#}#*/
        }
    }
    /*#if(modules.richView){#*/,
    snapshot() {
        let me = this;
        me['@{~view#updater.data.string}'] = JSON_Stringify(me['@{~view#updater.data}']);
        return me;
    },
    altered() {
        let me = this;
        if (me['@{~view#updater.data.string}']) {
            return me['@{~view#updater.data.string}'] != JSON_Stringify(me['@{~view#updater.data}']);
        }
    },
    // translate(data) {
    //     return TranslateData(this['@{~view#updater.data}'], data);
    // },
    parse(origin) {
        return ParseExpr(origin, this.owner['@{~vframe#ref.data}']);
    }
    /*#}#*/
});