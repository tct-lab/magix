let Vframe_RootVframe;
let Vframe_Vframes = {};
let Vframe_RootId;
/*#if(modules.review){#*/
let Vframe_Review;
/*#}#*/
let Vframe_TranslateQuery = (pId, src, params, pVf?) => {
    if (src.includes(Spliter) &&
        (pVf = Vframe_Vframes[pId])) {
        TranslateData(pVf['@{~vframe#ref.data}'], params);
    }
};
let Vframe_Root = (rootId?, e?) => {
    if (!Vframe_RootVframe) {
        rootId = Vframe_RootId = Mx_Cfg.rootId;
        e = GetById(rootId);
        if (!e) {
            if (DEBUG) {
                console.error('can not find element:"' + rootId + '",use document.body as default');
            }
            e = Doc_Body;
        }
        Vframe_RootVframe = new Vframe(e);
        /*#if(modules.review){#*/
        Vframe_Review = Mx_Cfg.review;
        /*#}#*/
    }
    return Vframe_RootVframe;
};
let Vframe_Unroot = () => {
    if (Vframe_RootVframe) {
        Vframe_RootVframe.unmountVframe();
        Vframe_RootVframe = Null;
    }
}


let Vframe_AddVframe = (id, vframe) => {
    if (!Has(Vframe_Vframes, id)) {
        Vframe_Vframes[id] = vframe;
        /*#if(modules.mxevent){#*/
        Vframe.fire('add', {
            vframe
        });
        /*#}#*/
    }
};
let Vframe_RemoveVframe = (id, vframe?) => {
    vframe = Vframe_Vframes[id];
    if (vframe) {
        delete Vframe_Vframes[id];
        vframe.root['@{~node#mounted.vframe}'] = 0;
        /*#if(modules.mxevent){#*/
        Vframe.fire('remove', {
            vframe
        });
        /*#}#*/
        vframe.id = vframe.root = vframe.pId = vframe['@{~vframe#children}'] = Null; //清除引用,防止被移除的view内部通过setTimeout之类的异步操作有关的界面，影响真正渲染的view
        if (DEBUG) {
            let nodes = Doc_Document.querySelectorAll('#' + id);
            if (nodes.length > 1) {
                Mx_Cfg.error(Error(`remove vframe error. dom id:"${id}" duplicate`));
            }
        }
    }
};
/*#if(modules.richVframe){#*/
let Vframe_RunInvokes = (vf, list, o) => {
    list = vf['@{~vframe#invoke.list}']; //invokeList
    while (list.length) {
        o = list.shift();
        if (!o.r) { //remove
            CallFunction(vf.invoke, [o.n, o.a], vf);
            //vf.invoke(o.n, o.a); //name,arguments
        }
        delete list[o.k]; //key
    }
};
/*#}#*/

let Vframe_GetVfId = node => node['@{~node#vframe.id}'] || (node['@{~node#vframe.id}'] = GUID(Vframe_RootId));
function Vframe(root, pId?) {
    let me = this;
    let vfId = Vframe_GetVfId(root);
    me.id = vfId;
    me.root = root;
    me['@{~vframe#sign}'] = 1; //signature
    me['@{~vframe#children}'] = {}; //childrenMap
    me.pId = pId; /*#if(modules.richVframe){#*/
    me['@{~vframe#invoke.list}'] = []; //invokeList
    /*#}#*/
    me['@{~vframe#ref.data}'] = {};
    Vframe_AddVframe(vfId, me);
}
Assign(Vframe, {
    root() {
        return Vframe_RootVframe;
    },
    all() {
        return Vframe_Vframes;
    },
    byId(id) {
        return Vframe_Vframes[id];
    },
    byNode(node) {
        return Vframe_Vframes[node['@{~node#vframe.id}']];
    }
}/*#if(modules.mxevent){#*/, MxEvent/*#}#*/);

Assign(Vframe[Prototype], {
    mountView(viewPath, viewInitParams /*,keepPreHTML*/) {
        let me = this;
        let { id, root, pId } = me;
        let po, sign, view, params/*#if(modules.mixins){#*/, ctors/*#}#*/;
        if (!me['@{~vframe#alter.node}'] && root) { //alter
            me['@{~vframe#alter.node}'] = 1;
            me['@{~vframe#template}'] = root.innerHTML;
        }
        me.unmountView();
        if (root && viewPath) {
            po = ParseUri(viewPath);
            view = po[Path];
            me[Path] = viewPath;
            params = po[Params];
            Vframe_TranslateQuery(pId, viewPath, params);
            me['@{~vframe#view.path}'] = view;
            Assign(params, viewInitParams);
            sign = me['@{~vframe#sign}'];
            /*#if(modules.review){#*/
            Vframe_Review(view, params, view => {
                /*#}#*/
                Async_Require(view, TView => {
                    if (sign == me['@{~vframe#sign}']) { //有可能在view载入后，vframe已经卸载了
                        if (!TView) {
                            return Mx_Cfg.error(Error(`${id} cannot load:${view}`));
                        }
                        /*#if(modules.mixins){#*/ctors =/*#}#*/ View_Prepare(TView);
                        view = new TView(id, root, me, params/*#if(modules.mixins){#*/, ctors/*#}#*/);

                        if (DEBUG) {
                            let viewProto = TView.prototype;
                            let importantProps = {
                                id: 1,
                                owner: 1,
                                '@{~view#observe.router}': 1,
                                '@{~view#resource}': 1,
                                '@{~view#sign}': 1,
                                '@{~view#updater.data}': 1,
                                '@{~view#updater.digesting.list}': 1
                            };
                            for (let p in view) {
                                if (Has(view, p) && viewProto[p]) {
                                    throw new Error(`avoid write ${p} at file ${viewPath}!`);
                                }
                            }
                            view = Safeguard(view, true, (key, value) => {
                                if (Has(viewProto, key) ||
                                    (Has(importantProps, key) &&
                                        (key != '@{~view#sign}' || !isFinite(value)) &&
                                        ((key != 'owner' && key != 'root') || value !== Null))) {
                                    throw new Error(`avoid write ${key} at file ${viewPath}!`);
                                }
                            });
                        }
                        me['@{~vframe#view.entity}'] = view;
                        /*#if(modules.router){#*/
                        me['@{~vframe#update.tag}'] = Dispatcher_UpdateTag;
                        /*#}#*/
                        View_DelegateEvents(view);
                        ToTry(view.init, params, view);
                        SafeCallFunction(view['@{~view#assign.fn}'], params, view);
                        CallFunction(() => {
                            view['@{~view#render.short}']();
                            if (!view.tmpl) { //无模板
                                //me['@{~vframe#alter.node}'] = 0; //不会修改节点，因此销毁时不还原
                                //me['@{~vframe#template}'] = Empty;
                                if (!view['@{~view#rendered}']) {
                                    View_EndUpdate(view);
                                }
                            }
                        });
                        // view['@{~view#render.short}']();
                    }
                });
                /*#if(modules.review){#*/
            });
            /*#}#*/
        }
    },
    /**
     * 销毁对应的view
     */
    unmountView() {
        let me = this;
        let { '@{~vframe#view.entity}': v, root } = me;
        me['@{~vframe#invoke.list}'] = [];
        if (v) {
            me.unmountZone();
            me['@{~vframe#view.entity}'] = 0; //unmountView时，尽可能早的删除vframe上的$v对象，防止$v销毁时，再调用该 vfrmae的类似unmountZone方法引起的多次created
            if (v['@{~view#sign}']) {
                Unmark(v);
                v['@{~view#sign}'] = 0;
                /*#if(modules.mxevent){#*/
                v.fire('destroy');
                /*#}#*/
                View_DelegateEvents(v, 1);
                v.owner = v.root = Null;
            }
            if (root && me['@{~vframe#alter.node}'] /*&&!keepPreHTML*/) { //如果$v本身是没有模板的，也需要把节点恢复到之前的状态上：只有保留模板且$v有模板的情况下，这条if才不执行，否则均需要恢复节点的html，即$v安装前什么样，销毁后把节点恢复到安装前的情况
                SetInnerHTML(root, me['@{~vframe#template}']);
            }
        }
        me['@{~vframe#sign}']++; //增加signature，阻止相应的回调，见mountView
    },
    mountVframe(node, viewPath, viewInitParams) {
        let me = this,
            vf, id = me.id, c = me['@{~vframe#children}'];
        let vfId = Vframe_GetVfId(node);
        vf = Vframe_Vframes[vfId];
        if (!vf) {
            if (!Has(c, vfId)) { //childrenMap,当前子vframe不包含这个id
                me['@{~vframe#children.list}'] = 0; //childrenList 清空缓存的子列表
            }
            c[vfId] = vfId; //map
            vf = new Vframe(node, id);
        }
        vf.mountView(viewPath, viewInitParams);
        return vf;
    },
    mountZone(zone) {
        let me = this, it;
        zone = zone || me.root;
        let vframes = zone.querySelectorAll(`[${MX_View}]`);
        /*
            body(#mx-root)
                div(mx-vframe=true,mx-view='xx')
                    div(mx-vframe=true,mx-view=yy)
            这种结构，自动构建父子关系，
            根结点渲染，获取到子列表[div(mx-view=xx)]
                子列表渲染，获取子子列表的子列表
                    加入到忽略标识里
            会导致过多的dom查询

            现在使用的这种，无法处理这样的情况，考虑到项目中几乎没出现过这种情况，先采用高效的写法
            上述情况一般出现在展现型页面，dom结构已经存在，只是附加上js行为
            不过就展现来讲，一般是不会出现嵌套的情况，出现的话，把里面有层级的vframe都挂到body上也未尝不可，比如brix2.0
         */

        //me['@{~vframe#hold.fire}'] = 1; //hold fire creted
        //me.unmountZone(zoneId, 1); 不去清理，详情见：https://github.com/thx/magix/issues/27

        for (it of vframes) {
            if (!it['@{~node#mounted.vframe}']) { //防止嵌套的情况下深层的view被反复实例化
                it['@{~node#mounted.vframe}'] = 1;
                me.mountVframe(it, GetAttribute(it, MX_View));
            }
        }
        //me['@{~vframe#hold.fire}'] = 0;
    },
    unmountVframe(node, isVframeId) { //inner 标识是否是由内部调用，外部不应该传递该参数
        let me = this,
            vf, pId;
        node = node ? me['@{~vframe#children}'][isVframeId ? node : node['@{~node#vframe.id}']] : me.id;
        vf = Vframe_Vframes[node];
        if (vf) {
            vf.unmountView();
            pId = vf.pId;
            Vframe_RemoveVframe(node);
            vf = Vframe_Vframes[pId];
            if (vf && Has(vf['@{~vframe#children}'], node)) { //childrenMap
                delete vf['@{~vframe#children}'][node]; //childrenMap
                vf['@{~vframe#children.list}'] = 0;
            }
        }
    },
    unmountZone(root) {
        let me = this;
        let p, vf, unmount;
        for (p in me['@{~vframe#children}']) {
            if (root) {
                vf = Vframe_Vframes[p];
                unmount = vf && NodeIn(vf.root, root);
            } else {
                unmount = 1;
            }
            if (unmount) {
                me.unmountVframe(p, 1);
            }
        }
    },
    /*#if(modules.richVframe||modules.router){#*/
    children(me) {
        me = this;
        return me['@{~vframe#children.list}'] || (me['@{~vframe#children.list}'] = Keys(me['@{~vframe#children}']));
    },
    /*#}#*/
    /*#if(modules.richVframe){#*/
    parent(level, vf) {
        vf = this;
        level = (level >>> 0) || 1;
        while (vf && level--) {
            vf = Vframe_Vframes[vf.pId];
        }
        return vf;
    },
    invoke(name, args) {
        let result;
        let vf = this,
            view, fn, o, list = vf['@{~vframe#invoke.list}'],
            key;
        if ((view = vf['@{~vframe#view.entity}']) && view['@{~view#rendered}']) { //view rendered
            result = (fn = view[name]) && ToTry(fn, args, view);
        } else {
            o = list[key = Spliter + name];
            if (o) {
                o.r = args === o.a; //参数一样，则忽略上次的
            }
            o = {
                n: name,
                a: args,
                k: key
            };
            list.push(o);
            list[key] = o;
        }
        return result;
    }
    /*#}#*/
});