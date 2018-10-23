let View_EvtMethodReg = /^(\$?)([^<]*)<([^>]+)>(?:&(.+))?$/;
/*#if(modules.viewProtoMixins){#*/
let processMixinsSameEvent = (exist, additional, temp) => {
    if (exist['@{~viewmixin#list}']) {
        temp = exist;
    } else {
        temp = function (e) {
            G_ToTry(temp['@{~viewmixin#list}'], e, this);
        };
        temp['@{~viewmixin#list}'] = [exist];
        temp['@{~viewmixin#is.mixin}'] = 1;
    }
    temp['@{~viewmixin#list}'] = temp['@{~viewmixin#list}'].concat(additional['@{~viewmixin#list}'] || additional);
    return temp;
};
/*#}#*/
//let View_MxEvt = /\smx-(?!view|vframe)[a-z]+\s*=\s*"/g;
/*#if(modules.resource){#*/
let View_DestroyAllResources = (me, lastly) => {
    let cache = me['@{view#resource}'], //reources
        p, c;
    for (p in cache) {
        c = cache[p];
        if (lastly || c.x) { //destroy
            View_DestroyResource(cache, p, 1);
        }
    }
};
let View_DestroyResource = (cache, key, callDestroy, old) => {
    let o = cache[key],
        fn, res;
    if (o && o != old) {
        //let processed=false;
        res = o.e; //entity
        fn = res.destroy;
        if (fn && callDestroy) {
            G_ToTry(fn, G_EMPTY_ARRAY, res);
        }
        delete cache[key];
    }
    return res;
};
/*#}#*/
let View_WrapMethod = (prop, fName, short, fn, me) => {
    fn = prop[fName];
    prop[fName] = prop[short] = function (...args) {
        me = this;
        if (me['@{view#sign}'] > 0) { //signature
            me['@{view#sign}']++;
            /*#if(!modules.mini){#*/
            me.fire('rendercall');
            /*#}#*/
            /*#if(modules.resource){#*/
            View_DestroyAllResources(me);
            /*#}#*/
            /*#if(!modules.keepHTML){#*/
            G_ToTry(fn, args, me);
            /*#}else{#*/
            fn.apply(me, args);
            /*#}#*/
        }
    };
};
let View_DelegateEvents = (me, destroy) => {
    let e, { '@{view#events.object}': eventsObject,
        '@{view#selector.events.object}': selectorObject,
        '@{view#events.list}': eventsList, id } = me; //eventsObject
    for (e in eventsObject) {
        Body_DOMEventBind(e, selectorObject[
            e], destroy);
    }
    for (e of eventsList) {
        G_DOMEventLibBind(e.e, e.n, G_DOMGlobalProcessor, destroy, {
            i: id,
            v: me,
            f: e.f,
            m: e.m,
            e: e.e
        });
    }
};
let View_Globals = {
    win: G_WINDOW,
    doc: G_DOCUMENT
};
/*#if(modules.viewProtoMixins||modules.viewMerge){#*/
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
            } else if (DEBUG && exist && p != 'extend' && p != G_SPLITER) { //只在开发中提示
                Magix_Cfg.error(Error('merge duplicate:' + p));
            }
            temp[p] = fn;
        }
    }
    for (p in temp) {
        if (!G_Has(proto, p)) {
            proto[p] = temp[p];
        }
    }
};
/*#}#*/
function merge(...args) {
    let me = this, _ = me._ || (me._ = []);
    View_MergeMixins(args, me[G_PROTOTYPE], _);
    return me;
}

function extend(props, statics) {
    let me = this;
    props = props || {};
    let ctor = props.ctor;
    /*#if(modules.viewProtoMixins){#*/
    let ctors = [];
    if (ctor) ctors.push(ctor);
    /*#}#*/
    function NView(nodeId, ownerVf, initParams/*#if(modules.viewProtoMixins){#*/, mixinCtors /*#}#*/, cs, z/*#if(modules.viewProtoMixins){#*/, concatCtors/*#}#*/) {
        me.call(z = this, nodeId, ownerVf, initParams/*#if(modules.viewProtoMixins){#*/, mixinCtors/*#}#*/);
        cs = NView._;
        /*#if(modules.viewProtoMixins){#*/
        if (cs) G_ToTry(cs, initParams, z);
        concatCtors = ctors.concat(mixinCtors);
        if (concatCtors.length) {
            G_ToTry(concatCtors, initParams, z);
        }
        /*#}else{#*/
        if (cs) G_ToTry(cs, initParams, z);
        if (ctor) ctor.call(z, initParams);
        /*#}#*/
    }
    NView.merge = merge;
    NView.extend = extend;
    return G_Extend(NView, me, props, statics);
}
/**
 * 预处理view
 * @param  {View} oView view子类
 * @param  {Vom} vom vom
 */
let View_Prepare = oView => {
    if (!oView[G_SPLITER]) { //只处理一次
        oView[G_SPLITER] = /*#if(modules.viewProtoMixins){#*/[] /*#}else{#*/ 1 /*#}#*/;
        let prop = oView[G_PROTOTYPE],
            currentFn, matches, selectorOrCallback, events, eventsObject = {},
            eventsList = [],
            selectorObject = {},
            node, isSelector, p, item, mask, mod, modifiers;

        /*#if(modules.viewProtoMixins){#*/
        matches = prop.mixins;
        if (matches) {
            View_MergeMixins(matches, prop, oView[G_SPLITER]);
        }
        /*#}#*/
        for (p in prop) {
            currentFn = prop[p];
            matches = p.match(View_EvtMethodReg);
            if (matches) {
                [, isSelector, selectorOrCallback, events, modifiers] = matches;
                mod = {};
                if (modifiers) {
                    modifiers = modifiers.split(G_COMMA);
                    for (item of modifiers) {
                        mod[item] = true;
                    }
                }
                events = events.split(G_COMMA);
                for (item of events) {
                    node = View_Globals[selectorOrCallback];
                    mask = 1;
                    if (isSelector) {
                        if (node) {
                            eventsList.push({
                                f: currentFn,
                                e: node,
                                n: item,
                                m: mod
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
                    item = selectorOrCallback + G_SPLITER + item;
                    node = prop[item];
                    /*#if(modules.viewProtoMixins){#*/
                    //for in 就近遍历，如果有则忽略
                    if (!node) { //未设置过
                        prop[item] = currentFn;
                    } else if (node['@{~viewmixin#is.mixin}']) { //现有的方法是mixins上的
                        if (currentFn['@{~viewmixin#is.mixin}']) { //2者都是mixins上的事件，则合并
                            prop[item] = processMixinsSameEvent(currentFn, node);
                        } else if (G_Has(prop, p)) { //currentFn方法不是mixin上的，也不是继承来的，在当前view上，优先级最高
                            prop[item] = currentFn;
                        }
                    }
                    /*#}else{#*/
                    if (!node) {
                        prop[item] = currentFn;
                    }
                    /*#}#*/
                }
            }
        }
        //console.log(prop);
        View_WrapMethod(prop, 'render', '@{view#render.short}');
        prop['@{view#events.object}'] = eventsObject;
        prop['@{view#events.list}'] = eventsList;
        prop['@{view#selector.events.object}'] = selectorObject;
        prop['@{view#assign.fn}'] = prop.assign;
    }
    /*#if(modules.viewProtoMixins){#*/
    return oView[G_SPLITER];
    /*#}#*/
};
/*#if(modules.router){#*/
let View_IsObserveChanged = view => {
    let loc = view['@{view#observe.router}'];
    let res, i, params;
    if (loc.f) {
        if (loc.p) {
            res = Router_LastChanged[G_PATH];
        }
        if (!res && loc.k) {
            params = Router_LastChanged[G_PARAMS];
            for (i of loc.k) {
                res = G_Has(params, i);
                if (res) break;
            }
        }
        // if (res && loc.c) {
        //     loc.c.call(view);
        // }
    }
    return res;
};
/*#}#*/
if (DEBUG) {
    var Updater_CheckInput = (view, html) => {
        if (/<(?:input|textarea|select)/i.test(html)) {
            let url = G_ParseUri(view.owner.path);
            let found = false, hasParams = false;
            for (let p in url.params) {
                hasParams = true;
                if (url.params[p][0] == G_SPLITER) {
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
let Updater_Safeguard = v => '' + (v == null ? '' : v);
let Updater_EncodeReplacer = m => `&${Updater_EM[m]};`;
let Updater_Encode = v => Updater_Safeguard(v).replace(Updater_ER, Updater_EncodeReplacer);

let Updater_Ref = ($$, v, k, f) => {
    for (f = $$[G_SPLITER]; --f;)
        if ($$[k = G_SPLITER + f] === v) return k;
    $$[k = G_SPLITER + $$[G_SPLITER]++] = v;
    return k;
};
let Updater_UM = {
    '!': '%21',
    '\'': '%27',
    '(': '%28',
    ')': '%29',
    '*': '%2A'
};
let Updater_URIReplacer = m => Updater_UM[m];
let Updater_URIReg = /[!')(*]/g;
let Updater_EncodeURI = v => encodeURIComponent(Updater_Safeguard(v)).replace(Updater_URIReg, Updater_URIReplacer);

let Updater_QR = /[\\'"]/g;
let Updater_EncodeQ = v => Updater_Safeguard(v).replace(Updater_QR, '\\$&');

/*#if(modules.updaterAsync){#*/
let Updater_Digest_Async = (view, resolve) => {
    let keys = view['@{view#updater.keys}'],
        changed = view['@{view#updater.data.changed}'],
        selfId = view.id,
        vf = Vframe_Vframes[selfId],
        ref = { d: [], v: [], n: [] },
        node = G_GetById(selfId),
        tmpl, vdom, data = view['@{view#updater.data}'],
        refData = view['@{view#updater.ref.data}'];
    view['@{view#updater.data.changed}'] = 0;
    view['@{view#updater.keys}'] = {};
    if (changed && view['@{view#sign}'] > 0 && (tmpl = view.tmpl)) {
        delete Body_RangeEvents[selfId];
        delete Body_RangeVframes[selfId];
        Async_SetNewTask(vf, () => {
            Async_SetNewTask(vf, () => {
                view['@{view#updater.vdom}'] = vdom;
                view['@{view#ignore.outer.html}'] = 0;
                /*#if(modules.updaterAsync){#*/
                if (DEBUG) {
                    CheckNodes(node.childNodes, vdom['@{~v#node.children}']);
                }
                /*#}#*/
                vf['@{vframe#hold.fire}'] = tmpl = ref.c || !view['@{view#rendered}'];
                if (tmpl) {
                    view.endUpdate(selfId);
                }
                /*#if(!modules.mini){#*/
                if (ref.c) {
                    G_Trigger(G_DOCUMENT, 'htmlchanged', {
                        vId: selfId
                    });
                }
                view.fire('domready');
                /*#}#*/
                if (resolve) resolve();
            });
            Async_AddTask(vf, () => {
                for (data of ref.d) {
                    data[0].id = data[1];
                }
            });
            refData = ([f, containerNode, oldOrNewNode, newNodeOrOldVirtualNodes, virtualNodes, oldVNode, newVNode], index) => {
                if (f == 1) {
                    /*#if(modules.updaterAsync){#*/
                    newNodeOrOldVirtualNodes.push(virtualNodes);
                    /*#}#*/
                    containerNode.appendChild(oldOrNewNode);
                    /*#if(modules.updaterAsync){#*/
                    if (DEBUG) {
                        CheckNodes(containerNode.childNodes, newNodeOrOldVirtualNodes);
                    }
                    /*#}#*/
                } else if (f == 2) {
                    /*#if(modules.updaterAsync){#*/
                    newNodeOrOldVirtualNodes.pop();
                    /*#}#*/
                    containerNode.removeChild(oldOrNewNode);
                    /*#if(modules.updaterAsync){#*/
                    if (DEBUG) {
                        CheckNodes(containerNode.childNodes, newNodeOrOldVirtualNodes);
                    }
                    /*#}#*/
                } else if (f == 4) {
                    /*#if(modules.updaterAsync){#*/
                    for (index in virtualNodes) {
                        delete virtualNodes[index];
                    }
                    G_Assign(virtualNodes, oldVNode);
                    /*#}#*/
                    if (oldOrNewNode) {
                        containerNode.replaceChild(oldOrNewNode, newNodeOrOldVirtualNodes);
                    } else {
                        containerNode.innerHTML = oldVNode['@{~v#node.outer.html}'];
                    }
                } else {
                    /*#if(modules.updaterAsync){#*/
                    for (index = virtualNodes.length; index--;) {
                        if (virtualNodes[index] == oldVNode) {
                            virtualNodes.splice(index, 0, newVNode);
                            break;
                        }
                    }
                    /*#}#*/
                    containerNode.insertBefore(oldOrNewNode, newNodeOrOldVirtualNodes);
                    /*#if(modules.updaterAsync){#*/
                    if (DEBUG) {
                        CheckNodes(containerNode.childNodes, virtualNodes);
                    }
                    /*#}#*/
                }
            };
            for (data of ref.n) {
                Async_AddTask(vf, refData, data);
            }
            refData = data => {
                data['@{view#render.short}']();
            };
            for (data of ref.v) {
                Async_AddTask(vf, refData, data);
            }
            Async_CheckStatus(selfId);
        });
        Async_AddTask(vf, () => {
            /*#if(modules.updaterQuick){#*/
            vdom = tmpl(data, Q_Create, selfId, refData, Updater_Encode, Updater_Safeguard, Updater_EncodeURI, Updater_Ref, Updater_EncodeQ, G_IsArray, G_Assign);
            if (DEBUG) {
                Updater_CheckInput(view, vdom['@{~v#node.outer.html}']);
            }
            V_SetChildNodes(node, view['@{view#updater.vdom}'], vdom, ref, vf, keys, view['@{view#ignore.outer.html}']);
            view['@{view#ignore.outer.html}'] = 1;
            /*#}else{#*/
            vdom = I_GetNode(tmpl(data, selfId, refData, Updater_Encode, Updater_Safeguard, Updater_EncodeURI, Updater_Ref, Updater_EncodeQ), node);
            if (DEBUG) {
                Updater_CheckInput(view, vdom.innerHTML);
            }
            I_SetChildNodes(node, vdom, ref, vf, keys);
            /*#}#*/
            Async_CheckStatus(selfId);
        });
    } else {
        if (resolve) resolve();
    }
};
/*#}else{#*/
let Updater_Digest = (view, digesting) => {
    let keys = view['@{view#updater.keys}'],
        changed = view['@{view#updater.data.changed}'],
        selfId = view.id,
        vf = Vframe_Vframes[selfId],
        ref = { d: [], v: [], n: [] },
        node = G_GetById(selfId),
        tmpl, vdom, data = view['@{view#updater.data}'],
        refData = view['@{view#updater.ref.data}'],
        redigest = trigger => {
            if (digesting.i < digesting.length) {
                Updater_Digest(updater, digesting);
            } else {
                ref = digesting.slice();
                digesting.i = digesting.length = 0;
                /*#if(!modules.mini){#*/
                if (trigger) {
                    view.fire('domready');
                }
                /*#}#*/
                G_ToTry(ref);
            }
        };
    digesting.i = digesting.length;
    view['@{view#updater.data.changed}'] = 0;
    view['@{view#updater.keys}'] = {};
    if (changed && view['@{view#sign}'] > 0 && (tmpl = view.tmpl)) {
        view.fire('dompatch');
        delete Body_RangeEvents[selfId];
        delete Body_RangeVframes[selfId];
        /*#if(modules.updaterQuick){#*/
        vdom = tmpl(data, Q_Create, selfId, refData, Updater_Safeguard, Updater_EncodeURI, Updater_Ref, Updater_EncodeQ, G_IsArray, G_Assign);
        if (DEBUG) {
            Updater_CheckInput(view, vdom['@{~v#node.outer.html}']);
        }
        /*#}else{#*/
        vdom = I_GetNode(tmpl(data, selfId, refData, Updater_Encode, Updater_Safeguard, Updater_EncodeURI, Updater_Ref, Updater_EncodeQ), node);
        if (DEBUG) {
            Updater_CheckInput(view, vdom.innerHTML);
        }
        /*#}#*/
        /*#if(modules.updaterQuick){#*/
        V_SetChildNodes(node, view['@{view#updater.vdom}'], vdom, ref, vf, keys);
        view['@{view#updater.vdom}'] = vdom;
        /*#}else{#*/
        I_SetChildNodes(node, vdom, ref, vf, keys);
        /*#}#*/
        for (vdom of ref.d) {
            vdom[0].id = vdom[1];
        }
        /*
            在dom diff patch时，如果已渲染的vframe有变化，则会在vom tree上先派发created事件，同时传递inner标志，vom tree处理alter事件派发状态，未进入created事件派发状态

            patch完成后，需要设置vframe hold fire created事件，因为带有assign方法的view在调用render后，vom tree处于就绪状态，此时会导致提前派发created事件，应该hold，统一在endUpdate中派发

            有可能不需要endUpdate，所以hold fire要视情况而定
        */
        vf['@{vframe#hold.fire}'] = tmpl = ref.c || !view['@{view#rendered}'];
        for (vdom of ref.v) {
            vdom['@{view#render.short}']();
        }
        if (tmpl) {
            view.endUpdate(selfId);
        }
        /*#if(!modules.mini){#*/
        if (ref.c) {
            G_Trigger(G_DOCUMENT, 'htmlchanged', {
                vId: selfId
            });
        }
        /*#}#*/
        redigest(1);
    } else {
        redigest();
    }
};
/*#}#*/
/**
 * View类
 * @name View
 * @class
 * @constructor
 * @borrows Event.on as #on
 * @borrows Event.fire as #fire
 * @borrows Event.off as #off
 * @param {Object} ops 创建view时，需要附加到view对象上的其它属性
 * @property {String} id 当前view与页面vframe节点对应的id
 * @property {Vframe} owner 拥有当前view的vframe对象
 * @example
 * // 关于事件:
 * // html写法：
 *
 * //  &lt;input type="button" mx-click="test({id:100,name:'xinglie'})" value="test" /&gt;
 * //  &lt;a href="http://etao.com" mx-click="test({com:'etao.com'})"&gt;http://etao.com&lt;/a&gt;
 *
 * // js写法：
 *
 *     'test&lt;click&gt;':function(e){
 *          e.preventDefault();
 *          //e.current 处理事件的dom节点(即带有mx-click属性的节点)
 *          //e.target 触发事件的dom节点(即鼠标点中的节点，在current里包含其它节点时，current与target有可能不一样)
 *          //e.params  传递的参数
 *          //e.params.com,e.params.id,e.params.name
 *      },
 *      'test&lt;mousedown&gt;':function(e){
 *
 *       }
 *
 *  //上述示例对test方法标注了click与mousedown事件，也可以合写成：
 *  'test&lt;click,mousedown&gt;':function(e){
 *      alert(e.type);//可通过type识别是哪种事件类型
 *  }
 */


function View(id, owner, ops, me) {
    me = this;
    me.owner = owner;
    me.id = id;
    /*#if(modules.router){#*/
    me['@{view#observe.router}'] = {
        k: []
    };
    /*#}#*/
    /*#if(modules.resource){#*/
    me['@{view#resource}'] = {};
    /*#}#*/
    me['@{view#sign}'] = 1; //标识view是否刷新过，对于托管的函数资源，在回调这个函数时，不但要确保view没有销毁，而且要确保view没有刷新过，如果刷新过则不回调
    me['@{view#updater.data.changed}'] = 1;
    me['@{view#updater.data}'] = {
        id
    };
    me['@{view#updater.ref.data}'] = {
        [G_SPLITER]: 1
    };
    me['@{view#updater.digesting.list}'] = [];
    me['@{view#updater.keys}'] = {};
    /*#if(modules.viewMerge){#*/
    id = View._;
    if (id) G_ToTry(id, ops, me);
    /*#}#*/
}
G_Assign(View, {
    /**
     * @lends View
     */
    /**
     * 扩展View
     * @param  {Object} props 扩展到原型上的方法
     * @example
     * define('app/tview',function(require){
     *     let Magix = require('magix');
     *     Magix.View.merge({
     *         ctor:function(){
     *             this.$attr='test';
     *         },
     *         test:function(){
     *             alert(this.$attr);
     *         }
     *     });
     * });
     * //加入Magix.config的exts中
     *
     *  Magix.config({
     *      //...
     *      exts:['app/tview']
     *
     *  });
     *
     * //这样完成后，所有的view对象都会有一个$attr属性和test方法
     * //当然上述功能也可以用继承实现，但继承层次太多时，可以考虑使用扩展来消除多层次的继承
     * //同时当项目进行中发现所有view要实现某个功能时，该方式比继承更快捷有效
     *
     *
     */
    /*#if(modules.viewMerge){#*/
    merge,
    /*#}#*/
    /**
     * 继承
     * @param  {Object} [props] 原型链上的方法或属性对象
     * @param {Function} [props.ctor] 类似constructor，但不是constructor，当我们继承时，你无需显示调用上一层级的ctor方法，magix会自动帮你调用
     * @param {Array} [props.mixins] mix到当前原型链上的方法对象，该对象可以有一个ctor方法用于初始化
     * @param  {Object} [statics] 静态对象或方法
     * @example
     * let Magix = require('magix');
     * let Sortable = {
     *     ctor: function() {
     *         console.log('sortable ctor');
     *         //this==当前mix Sortable的view对象
     *         this.on('destroy', function() {
     *             console.log('dispose')
     *         });
     *     },
     *     sort: function() {
     *         console.log('sort');
     *     }
     * };
     * module.exports = Magix.View.extend({
     *     mixins: [Sortable],
     *     ctor: function() {
     *         console.log('view ctor');
     *     },
     *     render: function() {
     *         this.sort();
     *     }
     * });
     */
    extend
});
G_Assign(View[G_PROTOTYPE] /*#if(!modules.mini){#*/, MEvent/*#}#*/, {
    /**
     * @lends View#
     */
    /*#if(modules.viewInit){#*/
    /**
     * 初始化调用的方法
     * @beta
     * @module viewInit
     * @param {Object} extra 外部传递的数据对象
     */
    init: G_NOOP,
    /*#}#*/
    /*
     * 包装mx-event事件，比如把mx-click="test<prevent>({key:'field'})" 包装成 mx-click="magix_vf_root^test<prevent>({key:'field})"，以方便识别交由哪个view处理
     * @function
     * @param {String} html 处理的代码片断
     * @param {Boolean} [onlyAddPrefix] 是否只添加前缀
     * @return {String} 处理后的字符串
     * @example
     * View.extend({
     *     'del&lt;click&gt;':function(e){
     *         S.one(G_HashKey+e.currentId).remove();
     *     },
     *     'addNode&lt;click&gt;':function(e){
     *         let tmpl='&lt;div mx-click="del"&gt;delete&lt;/div&gt;';
     *         //因为tmpl中有mx-click，因此需要下面这行代码进行处理一次
     *         tmpl=this.wrapEvent(tmpl);
     *         S.one(G_HashKey+e.currentId).append(tmpl);
     *     }
     * });
     */
    /**
     * 通知当前view即将开始进行html的更新
     * @param {String} [id] 哪块区域需要更新，默认整个view
     */
    beginUpdate(id, me) {
        me = this;
        if (me['@{view#sign}'] > 0 && me['@{view#rendered}']) {
            me.owner.unmountZone(id, 1);
            /*me.fire('prerender', {
                id: id
            });*/
        }
    },
    /**
     * 通知当前view结束html的更新
     * @param {String} [id] 哪块区域结束更新，默认整个view
     */
    endUpdate(id, inner, me /*#if(modules.linkage){#*/, o, f /*#}#*/) {
        me = this;
        if (me['@{view#sign}'] > 0) {
            id = id || me.id;
            /*me.fire('rendered', {
                id
            });*/
            if (inner) {
                f = inner;
            } else {
                /*#if(modules.linkage){#*/
                f = me['@{view#rendered}'];
                /*#}#*/
                me['@{view#rendered}'] = 1;
            }
            /*#if(modules.linkage){#*/
            o = me.owner;
            o.mountZone(id, inner);
            if (!f) {
                /*#if(modules.es3){#*/
                Timeout(me.wrapAsync(() => {
                    Vframe_RunInvokes(o);
                }), 0);
                /*#}else{#*/
                Timeout(me.wrapAsync(Vframe_RunInvokes), 0, o);
                /*#}#*/
            }
            /*#}else{#*/
            me.owner.mountZone(id, inner);
            /*#}#*/
        }
    },
    /*#if(!modules.mini){#*/
    /**
     * 包装异步回调
     * @param  {Function} fn 异步回调的function
     * @return {Function}
     * @example
     * render:function(){
     *     setTimeout(this.wrapAsync(function(){
     *         //codes
     *     }),50000);
     * }
     * // 为什么要包装一次？
     * // 在单页应用的情况下，可能异步回调执行时，当前view已经被销毁。
     * // 比如上例中的setTimeout，50s后执行回调，如果你的回调中去操作了DOM，
     * // 则会出错，为了避免这种情况的出现，可以调用view的wrapAsync包装一次。
     * // (该示例中最好的做法是在view销毁时清除setTimeout，
     * // 但有时候你很难控制回调的执行，比如JSONP，所以最好包装一次)
     */
    wrapAsync(fn, context) {
        let me = this;
        let sign = me['@{view#sign}'];
        return (...a) => {
            if (sign > 0 && sign == me['@{view#sign}']) {
                return fn.apply(context || me, a);
            }
        };
    },
    /*#}#*/
    /*#if(modules.router){#*/
    /**
     * 监视地址栏中的参数或path，有变动时，才调用当前view的render方法。通常情况下location有变化不会引起当前view的render被调用，所以你需要指定地址栏中哪些参数有变化时才引起render调用，使得view只关注与自已需要刷新有关的参数
     * @param {Array|String|Object} params  数组字符串
     * @param {Boolean} [isObservePath] 是否监视path
     * @beta
     * @module router
     * @example
     * return View.extend({
     *      init:function(){
     *          this.observeLocation('page,rows');//关注地址栏中的page rows2个参数的变化，当其中的任意一个改变时，才引起当前view的render被调用
     *          this.observeLocation(null,true);//关注path的变化
     *          //也可以写成下面的形式
     *          //this.observeLocation('page,rows',true);
     *          //也可以是对象的形式
     *          this.observeLocation({
     *              path: true,
     *              params:['page','rows']
     *          });
     *      },
     *      render:function(){
     *          let loc=Magix.Router.parse();
     *          console.log(loc);//获取地址解析出的对象
     *          let diff=Magix.Router.diff();
     *          console.log(diff);//获取当前地址与上一个地址差异对象
     *      }
     * });
     */
    observeLocation(params, isObservePath) {
        let me = this,
            loc;
        loc = me['@{view#observe.router}'];
        loc.f = 1;
        if (G_IsObject(params)) {
            isObservePath = params[G_PATH];
            params = params[G_PARAMS];
        }
        //if (isObservePath) {
        loc.p = isObservePath;
        //}
        if (params) {
            loc.k = (params + G_EMPTY).split(G_COMMA);
        }
    },
    /*#}#*/
    /*#if(modules.state){#*/
    /**
     * 监视Magix.State中的数据变化
     * @param  {String|Array} keys 数据对象的key
     */
    observeState(keys) {
        this['@{view#observe.state}'] = (keys + G_EMPTY).split(G_COMMA);
    },
    /*#}#*/
    /*#if(modules.resource){#*/
    /**
     * 让view帮你管理资源，强烈建议对组件等进行托管
     * @param {String} key 资源标识key
     * @param {Object} res 要托管的资源
     * @param {Boolean} [destroyWhenCalleRender] 调用render方法时是否销毁托管的资源
     * @return {Object} 返回托管的资源
     * @beta
     * @module resource
     * @example
     * View.extend({
     *     render: function(){
     *         let me = this;
     *         let dropdown = new Dropdown();
     *
     *         me.capture('dropdown',dropdown,true);
     *     },
     *     getTest: function(){
     *         let dd = me.capture('dropdown');
     *         console.log(dd);
     *     }
     * });
     */
    capture(key, res, destroyWhenCallRender, cache) {
        cache = this['@{view#resource}'];
        if (res) {
            View_DestroyResource(cache, key, 1, res);
            cache[key] = {
                e: res,
                x: destroyWhenCallRender
            };
            //service托管检查
            if (DEBUG && res && (res.id + G_EMPTY).indexOf('\x1es') === 0) {
                res['@{service#captured}'] = 1;
                if (!destroyWhenCallRender) {
                    console.warn('beware! May be you should set destroyWhenCallRender = true');
                }
            }
        } else {
            cache = cache[key];
            res = cache && cache.e;
        }
        return res;
    },
    /**
     * 释放管理的资源
     * @param  {String} key 托管时的key
     * @param  {Boolean} [destroy] 是否销毁资源
     * @return {Object} 返回托管的资源，无论是否销毁
     * @beta
     * @module resource
     */
    release(key, destroy) {
        return View_DestroyResource(this['@{view#resource}'], key, destroy);
    },
    /*#}#*/
    /*#if(modules.tipRouter){#*/
    /**
     * 离开提示
     * @param  {String} msg 提示消息
     * @param  {Function} fn 是否提示的回调
     * @beta
     * @module tipRouter
     * @example
     * let Magix = require('magix');
     * module.exports = Magix.View.extend({
     *     init:function(){
     *         this.leaveTip('页面数据未保存，确认离开吗？',function(){
     *             return true;//true提示，false，不提示
     *         });
     *     }
     * });
     */
    leaveTip(msg, fn) {
        let me = this;
        let changeListener = e => {
            let a = '@{~tip#router.change}', // a for router change
                b = '@{~tip#view.unload}'; // b for viewunload change
            if (e.type != G_CHANGE) {
                a = '@{~tip#view.unload}';
                b = '@{~tip#router.change}';
            }
            if (changeListener[a]) {
                e.prevent();
                e.reject();
            } else if (fn()) {
                e.prevent();
                changeListener[b] = 1;
                me.leaveConfirm(() => {
                    changeListener[b] = 0;
                    e.resolve();
                }, () => {
                    changeListener[b] = 0;
                    e.reject();
                }, msg);
            }
        };
        let unloadListener = e => {
            if (fn()) {
                e.msg = msg;
            }
        };
        Router.on(G_CHANGE, changeListener);
        Router.on(G_PAGE_UNLOAD, unloadListener);
        me.on('unload', changeListener);
        me.on('destroy', () => {
            Router.off(G_CHANGE, changeListener);
            Router.off(G_PAGE_UNLOAD, unloadListener);
        });
    },
    /*#}#*/
    /**
     * 设置view的html内容
     * @param {String} id 更新节点的id
     * @param {Strig} html html字符串
     * @example
     * render:function(){
     *     this.setHTML(this.id,this.tmpl);//渲染界面，当界面复杂时，请考虑用其它方案进行更新
     * }
     */
    /*
        Q:为什么删除setHTML?
        A:统一使用updater更新界面。
        关于api的分级，高层api更内聚，一个api完成很多功能。方便开发者，但不灵活。
        底层api职责更单一，一个api只完成一个功能，灵活，但不方便开发者
        更新界面来讲，updater是一个高层api，但是有些功能却无法完成，如把view当成壳子或容器渲染第三方的组件，组件什么时间加载完成、渲染、更新了dom、如何通知magix等，这些问题在updater中是无解的，而setHTML这个api又不够底层，同样也无法完成一些功能，所以这个api食之无味，故删除
     */
    /*setHTML(id, html) {
        let me = this,
            n, i = me.id;
        me.beginUpdate(id);
        if (me['@{view#sign}'] > 0) {
            n = G_GetById(id);
            if (n) G_HTML(n, View_SetEventOwner(html, i), i);
        }
        me.endUpdate(id);
        me.fire('domready');
    }*/
    /**
     * 渲染view，供最终view开发者覆盖
     * @function
     */
    render: G_NOOP,
    /**
     * 获取放入的数据
     * @param  {String} [key] key
     * @return {Object} 返回对应的数据，当key未传递时，返回整个数据对象
     * @example
     * render: function() {
     *     this.set({
     *         a: 10,
     *         b: 20
     *     });
     * },
     * 'read&lt;click&gt;': function() {
     *     console.log(this.get('a'));
     * }
     */
    get(key, result) {
        result = this['@{view#updater.data}'];
        if (key) {
            result = result[key];
        }
        return result;
    },
    /**
     * 通过path获取值
     * @param  {String} path 点分割的路径
     * @return {Object}
     */
    /*gain: function (path) {
        let result = this.$d;
        let ps = path.split('.'),
            temp;
        while (result && ps.length) {
            temp = ps.shift();
            result = result[temp];
        }
        return result;
    },*/
    /**
     * 获取放入的数据
     * @param  {Object} obj 待放入的数据
     * @return {Updater} 返回updater
     * @example
     * render: function() {
     *     this.set({
     *         a: 10,
     *         b: 20
     *     });
     * },
     * 'read&lt;click&gt;': function() {
     *     console.log(this.get('a'));
     * }
     */
    set(obj, unchanged) {
        let me = this;
        me['@{view#updater.data.changed}'] = G_Set(obj, me['@{view#updater.data}'], me['@{view#updater.keys}'], unchanged) || me['@{view#updater.data.changed}'];
        return me;
    },
    /**
     * 检测数据变化，更新界面，放入数据后需要显式调用该方法才可以把数据更新到界面
     * @example
     * render: function() {
     *     this.updater.set({
     *         a: 10,
     *         b: 20
     *     }).digest();
     * }
     */
    digest(data, unchanged, resolve) {
        let me = this.set(data, unchanged)/*#if(!modules.updaterAsync){#*/,
            digesting = me['@{view#updater.digesting.list}']
            /*#}#*/;
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
        /*#if(modules.updaterAsync){#*/
        Updater_Digest_Async(me, resolve);
        /*#}else{#*/
        if (resolve) {
            digesting.push(resolve);
        }
        if (!digesting.i) {
            Updater_Digest(me, digesting);
        } else if (DEBUG) {
            console.warn('Avoid redigest while updater is digesting');
        }
        /*#}#*/
    }/*#if(!modules.mini){#*/,
    /**
     * 获取当前数据状态的快照，配合altered方法可获得数据是否有变化
     * @return {Updater} 返回updater
     * @example
     * render: function() {
     *     this.updater.set({
     *         a: 20,
     *         b: 30
     *     }).digest().snapshot(); //更新完界面后保存快照
     * },
     * 'save&lt;click&gt;': function() {
     *     //save to server
     *     console.log(this.updater.altered()); //false
     *     this.updater.set({
     *         a: 20,
     *         b: 40
     *     });
     *     console.log(this.updater.altered()); //true
     *     this.updater.snapshot(); //再保存一次快照
     *     console.log(this.updater.altered()); //false
     * }
     */
    snapshot() {
        let me = this;
        me['@{view#updater.data.string}'] = JSONStringify(me['@{view#updater.data}']);
        return me;
    },
    /**
     * 检测数据是否有变动
     * @return {Boolean} 是否变动
     * @example
     * render: function() {
     *     this.updater.set({
     *         a: 20,
     *         b: 30
     *     }).digest().snapshot(); //更新完界面后保存快照
     * },
     * 'save&lt;click&gt;': function() {
     *     //save to server
     *     console.log(this.updater.altered()); //false
     *     this.updater.set({
     *         a: 20,
     *         b: 40
     *     });
     *     console.log(this.updater.altered()); //true
     *     this.updater.snapshot(); //再保存一次快照
     *     console.log(this.updater.altered()); //false
     * }
     */
    altered() {
        let me = this;
        if (me['@{view#updater.data.string}']) {
            return me['@{view#updater.data.string}'] != JSONStringify(me['@{view#updater.data}']);
        }
    },
    /**
     * 翻译带@占位符的数据
     * @param {string} origin 源字符串
     */
    translate(data) {
        return G_TranslateData(this['@{view#updater.data}'], data);
    },
    /**
     * 翻译带@占位符的数据
     * @param {string} origin 源字符串
     */
    parse(origin) {
        return G_ParseExpr(origin, this['@{view#updater.ref.data}']);
    },
    changed() {
        return this['@{view#updater.data.changed}'];
    }
    /*#}#*/
    /**
     * 当前view的dom就绪后触发
     * @name View#domready
     * @event
     * @param {Object} e view 完成渲染后触发
     */

    /**
     * view销毁时触发
     * @name View#destroy
     * @event
     * @param {Object} e
     */

    /**
     * 异步更新ui的方法(render)被调用前触发
     * @name View#rendercall
     * @event
     * @param {Object} e
     */
});
Magix.View = View;