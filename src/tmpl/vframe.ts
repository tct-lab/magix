let Vframe_RootVframe;
let Vframe_Vframes = {};
let Vframe_RootId;

type VframeConstructor = {
    (root: HTMLElement, parentId?: string): object,
    fire(name: string, data?: object): void
}

let Vframe_TranslateQuery = (pId, src, params, pVf?) => {
    if (src.includes(Spliter) &&
        (pVf = Vframe_Vframes[pId])) {
        TranslateData(pVf['@{~vframe.ref.data}'], params);
        /*#if(modules.spreadMxViewParams){#*/
        if (params[Spliter]) {
            Assign(params, params[Spliter]);
            delete params[Spliter];
        }
        /*#}#*/
    }
};
let Vframe_Root = (rootId?, e?) => {
    if (!Vframe_RootVframe) {
        Doc_Body = Doc_Document.body;
        rootId = Vframe_RootId = Mx_Cfg.rootId;
        e = GetById(rootId);
        if (!e) {
            if (DEBUG) {
                console.warn('can not find element:"' + rootId + '",use document.body as default');
            }
            e = Doc_Body;
        }
        Vframe_RootVframe = new Vframe(e);
    }
    return Vframe_RootVframe;
};
let Vframe_Unroot = () => {
    if (Vframe_RootVframe) {
        Vframe_Unmount(Vframe_RemoveVframe);
        Vframe_RootVframe = Null;
    }
}


let Vframe_AddVframe = (id, vframe) => {
    if (!Has(Vframe_Vframes, id)) {
        Vframe_Vframes[id] = vframe;
        /*#if(modules.eventVframe){#*/
        (<VframeConstructor>Vframe).fire('add', {
            vframe
        });
        /*#}#*/
    }
};
let Vframe_RemoveVframe = (id, vframe?, root?) => {
    vframe = Vframe_Vframes[id];
    if (vframe) {
        delete Vframe_Vframes[id];
        root = vframe.root;
        root['@{~node#mounted.vframe}'] = 0;
        root['@{~node#vframe.id}'] = 0;
        /*#if(modules.eventVframe){#*/
        (<VframeConstructor>Vframe).fire('remove', {
            vframe
        });
        /*#}#*/
        vframe.id = vframe.root = vframe.pId = vframe['@{~vframe.children}'] = Null; //清除引用,防止被移除的view内部通过setTimeout之类的异步操作有关的界面，影响真正渲染的view
        if (DEBUG) {
            let nodes = Doc_Document.querySelectorAll('#' + id);
            if (nodes.length > 1) {
                Mx_Cfg.error(Error(`remove vframe error. dom id:"${id}" duplicate`));
            }
        }
    }
};
let Vframe_Unmount = (me, node?, isVframeId?, deep?) => {
    let vf, pId;
    node = node ? me['@{~vframe.children}'][isVframeId ? node : node['@{~node#vframe.id}']] : me.id;
    vf = Vframe_Vframes[node];
    if (vf) {
        pId = vf.pId;
        Vframe_unmountView(vf, deep);
        Vframe_RemoveVframe(node);
        vf = Vframe_Vframes[pId];
        if (vf && Has(vf['@{~vframe.children}'], node)) { //childrenMap
            delete vf['@{~vframe.children}'][node]; //childrenMap
            vf['@{~vframe.children.list}'] = 0;
        }
    }
};
/*#if(modules.richVframe){#*/
let Vframe_RunInvokes = (vf, list, name, resolve, view, fn, args) => {
    list = vf['@{~vframe.invoke.list}']; //invokeList
    view = vf['@{~vframe.view.entity}'];
    while (list.length) {
        [name, args, resolve] = list.shift();
        if (name) {
            CallFunction(resolve, (fn = view[name]) && ToTry(fn, args, view));
        }
    }
};
/*#}#*/

/*#if(modules.richVframeDescendants||(modules.router&&modules.routerTip)){#*/
let Vframe_CollectVframes = (start, vfs, onlyChild?) => {
    let children = start.children(),
        child, vf;
    for (child of children) {
        vf = Vframe_Vframes[child];
        vfs.push(vf);
        if (!onlyChild) {
            Vframe_CollectVframes(vf, vfs);
        }
    }
};
/*#}#*/

let Vframe_UnmountZone = (owner, root?, onlyInnerView?, deep?) => {
    let p, vf, unmount;
    for (p in owner['@{~vframe.children}']) {
        if (root) {
            vf = Vframe_Vframes[p];
            unmount = vf && NodeIn(vf.root, root, onlyInnerView);
        } else {
            unmount = 1;
        }
        if (unmount) {
            Vframe_Unmount(owner, p, unmount, deep);
            //owner.unmount(p, unmount, deep);
        }
    }
};

let Vframe_MountZone = (owner, zone?, it?, vframes?) => {
    zone = zone || owner.root;
    /*#if(modules.xview){#*/
    vframes = zone.querySelectorAll(`[${MX_View}][${MX_FROM}="${owner.id}"],[${MX_View}][${MX_TO}="${owner.id}"]`);
    /*#}else{#*/
    vframes = zone.querySelectorAll(`[${MX_View}][${MX_OWNER}="${owner.id}"]`);
    /*#}#*/
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

    //me['@{~vframe.hold.fire}'] = 1; //hold fire creted
    //me.unmountZone(zoneId, 1); 不去清理，详情见：https://github.com/thx/magix/issues/27

    for (it of vframes) {
        if (!it['@{~node#mounted.vframe}']) { //防止嵌套的情况下深层的view被反复实例化
            it['@{~node#mounted.vframe}'] = 1;
            owner.mount(it, GetAttribute(it, MX_View));
        }
    }
    //me['@{~vframe.hold.fire}'] = 0;
};
/**
  * 销毁对应的view
  */
let Vframe_unmountView = (owner, deep?) => {
    let { '@{~vframe.view.entity}': v,
        root, pId } = owner;
    if (v) {
        owner['@{~vframe.view.entity}'] = 0; //unmountView时，尽可能早的删除vframe上的$v对象，防止$v销毁时，再调用该 vfrmae的类似unmountZone方法引起的多次created
        if (v['@{~view.sign}']) {
            v['@{~view.sign}'] = 0;
            Unmark(v);
            if (v['@{~view.template}']) {
                Vframe_UnmountZone(owner, 0, 0, 1);
            }
            /*#if(modules.mxevent){#*/
            v.fire('destroy');
            /*#}#*/
            View_DelegateEvents(v, 1);
            //v.owner = v.root = Null;
            if (root &&
                owner['@{~vframe.alter.node}'] &&
                v['@{~view.template}']) {
                SetInnerHTML(root, owner['@{~vframe.template}']);
                /*#if(modules.innerView){#*/
                if (pId &&
                    owner['@{~vframe.template}'] &&
                    !deep) {
                    Vframe_MountZone(Vframe_Vframes[pId], root);
                }
                /*#}#*/
            }
        }
    }
    owner['@{~vframe.sign}']++; //增加signature，阻止相应的回调，见mountView
};
let Vframe_mountView = async (owner, viewPath, viewInitParams?, deep?) => {
    let { id, root, pId } = owner;
    let po, sign, view, params, TView;
    if (!owner['@{~vframe.alter.node}'] &&
        root) { //alter
        owner['@{~vframe.alter.node}'] = 1;
        owner['@{~vframe.template}'] = root.innerHTML;
    }
    Vframe_unmountView(owner, deep);
    if (root && viewPath) {
        po = ParseUri(viewPath);
        view = po[Path];
        owner[Path] = viewPath;
        params = po[Params];
        /*#if(modules.xview){#*/
        pId = GetAttribute(root, MX_OWNER);
        /*#}#*/
        Vframe_TranslateQuery(pId, viewPath, params);
        owner['@{~vframe.view.path}'] = view;
        Assign(params, viewInitParams);
        sign = owner['@{~vframe.sign}'];
        [TView] = await Async_Require<FunctionConstructor>(view/*#if(modules.require){#*/, params/*#}#*/);
        if (sign == owner['@{~vframe.sign}'] &&
            TView) { //有可能在view载入后，vframe已经卸载了
            //if (TView) {
            View_Prepare(TView);
            view = new TView(id, root, owner, params);

            if (DEBUG) {
                let viewProto = TView.prototype;
                let importantProps = {
                    id: 1,
                    owner: 1,
                    root: 1,
                    '@{~view.observe.router}': 1,
                    '@{~view.resource}': 1,
                    '@{~view.sign}': 1,
                    '@{~view.updater.data}': 1,
                    '@{~view.updater.digesting.list}': 1
                };
                for (let p in view) {
                    if (Has(view, p) && viewProto[p]) {
                        throw new Error(`avoid write ${p} at file ${viewPath}!`);
                    }
                }
                view = Safeguard(view, true, (key, value) => {
                    if (Has(viewProto, key) ||
                        (Has(importantProps, key) &&
                            (key != '@{~view.sign}' || !isFinite(value)) &&
                            ((key != 'owner' && key != 'root') || value !== Null))) {
                        throw new Error(`avoid write ${key} at file ${viewPath}!`);
                    }
                });
            }
            owner['@{~vframe.view.entity}'] = view;
            /*#if(modules.router){#*/
            //me['@{~vframe.update.tag}'] = Dispatcher_UpdateTag;
            /*#}#*/
            View_DelegateEvents(view);
            ToTry(view.init, params, view);
            ToTry(view['@{~view.assign.fn}'], [params, owner['@{~vframe.template}']], view);
            view['@{~view.render.short}']();
            if (!view['@{~view.template}'] &&
                !view['@{~view.rendered}']) { //无模板且未触发渲染
                View_EndUpdate(view);
            }
            // } else {
            //     //if (DEBUG) {
            //     //Mx_Cfg.error(Error(`${id} cannot load:${view}`));
            //     //}
            // }
        }
    }
};

let Vframe_GetVfId = node => node['@{~node#vframe.id}'] || (node['@{~node#vframe.id}'] = GUID(Vframe_RootId));


function Vframe(root, pId?) {
    let me = this;
    let vfId = Vframe_GetVfId(root);
    me.id = vfId;
    me.root = root;
    me['@{~vframe.sign}'] = 1; //signature
    me['@{~vframe.children}'] = {}; //childrenMap
    me.pId = pId; /*#if(modules.richVframe){#*/
    me['@{~vframe.invoke.list}'] = []; //invokeList
    /*#}#*/
    me['@{~vframe.ref.data}'] = new Map();
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
}
    /*#if(modules.eventVframe){#*/
    , MxEvent
    /*#}#*/
);

Assign(Vframe[Prototype], {
    mount(node, viewPath, viewInitParams, deep) {
        let me = this,
            vf, id = me.id, c = me['@{~vframe.children}'];
        let vfId = Vframe_GetVfId(node);
        vf = Vframe_Vframes[vfId];
        if (!vf) {
            if (!Has(c, vfId)) { //childrenMap,当前子vframe不包含这个id
                me['@{~vframe.children.list}'] = 0; //childrenList 清空缓存的子列表
            }
            c[vfId] = vfId; //map
            vf = new Vframe(node, id);
        }
        Vframe_mountView(vf, viewPath, viewInitParams, deep);
        return vf;
    },
    unmount(...args) {
        Vframe_Unmount(this, ...args);
    },
    /*#if(modules.richVframe||modules.router){#*/
    children() {
        return this['@{~vframe.children.list}'] || (this['@{~vframe.children.list}'] = Keys(this['@{~vframe.children}']));
    },
    /*#}#*/
    /*#if(modules.richVframe){#*/
    /*#if(modules.richVframeDescendants){#*/
    descendants(onlyChild) {
        let vfs = [];
        Vframe_CollectVframes(this, vfs, onlyChild);
        return vfs;
    },
    /*#}#*/
    parent(level, vf) {
        vf = this;
        level = (level >>> 0) || 1;
        while (vf && level--) {
            vf = Vframe_Vframes[vf.pId];
        }
        return vf;
    },
    invoke(name, ...args) {
        let vf = this,
            view, fn, list = vf['@{~vframe.invoke.list}'];
        return new GPromise(resolve => {
            if ((view = vf['@{~vframe.view.entity}']) &&
                view['@{~view.rendered}']) { //view rendered
                resolve((fn = view[name]) && ToTry(fn, args, view));
            } else {
                list.push([name, args, resolve]);
            }
        });
    }/*#if(modules.richVframeInvokeCancel){#*/,
    invokeCancel(name) {
        let list = this['@{~vframe.invoke.list}'];
        if (name) {
            for (let e of list) {
                if (e[0] == name) {
                    e[0] = '';
                }
            }
        } else {
            list.length = 0;
        }
    }
    /*#}#*/
    /*#}#*/
    /*#if(modules.router&&modules.routerTip){#*/
    , async exit(resolve, reject, stop = Noop) {
        let e = {
            '@{~exit-tip#from}': View_Exit_From_Vframe,
            '@{~exit-tip#mutual}': View_Exit_From_Router,
            resolve,
            reject,
            stop,
        },
            vfs = [], vf;
        Vframe_CollectVframes(this, vfs);
        for (vf of vfs) {
            await vf.invoke('@:{~view#exit.listener}', e);
        }
        View_RunExitList(e);
    }
    /*#}#*/
});