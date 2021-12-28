/*#if(modules.router){#*/
let Dispatcher_UpdateTag = 0;

let View_IsObserveChanged = view => {
    let loc = view['@{~view.observe.router}'];
    let res, i, params;
    if (loc['@{~view-router#observed}']) {
        if (loc['@{~view-router#observe.path}']) {
            res = Router_LastChanged[Path];
        }
        if (!res && loc['@{~view-router#observe.params}']) {
            params = Router_LastChanged[Params];
            for (i of loc['@{~view-router#observe.params}']) {
                res = Has(params, i);
                if (res) break;
            }
        }
    }
    return res;
};
/**
 * 通知当前vframe，地址栏发生变化
 * @param {Vframe} vframe vframe对象
 * @private
 */
let Dispatcher_Update = async (vframe, tag, view?, cs?, c?, resolved?) => {
    if (tag == Dispatcher_UpdateTag &&
        vframe &&
        (view = vframe['@{~vframe.view.entity}']) &&
        view['@{~view.rendered}']) {
        cs = vframe.children();
        if (View_IsObserveChanged(view)) { //检测view所关注的相应的参数是否发生了变化
            //CallFunction(view['@{~view.render.short}'], Empty_Array, view);
            /**
             * render返回promise与其它值
             * 如果render未返回promise，且render中有异步渲染界面
             * 　　比如a 渲染　b,b监听路由参数,a在render中异步返回后更新界面且销毁b。
             * 　　路由消息，通知完a后，再通知a的子节点b，理论上这就不对了。
             * 如果render返回promise，且render中有异步渲染界面
             * 　　比如a 渲染　b,b监听路由参数,a在render中异步返回后更新界面且创建b。
             * 　　路由消息，通知完a后，等待a渲染完成，再通知a的子节点b，理论上这也不对。
             * 
             * 综上，渲染前保存a的子节点，渲染后只通知a上面还存在的子节点，删除及新增加的子节点不通知
             */
            if (DEBUG) {
                resolved = view['@{~view.render.short}']();
                if (!resolved ||
                    !resolved.then) {
                    console.info(vframe.path + ' `render` method recommand return promise value');
                } else {
                    await resolved;
                }
            } else {
                await view['@{~view.render.short}']();
            }
        }
        for (c of cs) {
            CallFunction(Dispatcher_Update, [Vframe_Vframes[c], tag]);
        }
    }
};
let Dispatcher_NotifyChange = (e, vf, view) => {
    /*#if(modules.recast){#*/
    if (Router_PNR_Recast) {
        Router_PNR_Recast(e);
    }
    /*#}#*/
    vf = Vframe_Root();
    if ((view = e[Router_VIEW])) {
        Vframe_mountView(vf, view.to);
    } else {
        Dispatcher_Update(vf, ++Dispatcher_UpdateTag);
    }
};
/*#}#*/