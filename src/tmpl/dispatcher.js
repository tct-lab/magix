/*#if(modules.router){#*/
let Dispatcher_UpdateTag = 0;

let View_IsObserveChanged = view => {
    let loc = view['@{~view#observe.router}'];
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
let Dispatcher_Update = (vframe, view, isChanged, cs, c) => {
    if (vframe && vframe['@{~vframe#update.tag}'] != Dispatcher_UpdateTag &&
        (view = vframe['@{~vframe#view.entity}']) &&
        view['@{~view#sign}'] > 1) {
        isChanged = View_IsObserveChanged(view);
        if (isChanged) { //检测view所关注的相应的参数是否发生了变化
            view['@{~view#render.short}']();
        }
        cs = vframe.children();
        for (c of cs) {
            Dispatcher_Update(Vframe_Vframes[c]);
        }
    }
};
/**
 * 向vframe通知地址栏发生变化
 * @param {Object} e 事件对象
 * @param {Object} e.location window.location.href解析出来的对象
 * @private
 */
let Dispatcher_NotifyChange = (e, vf, view) => {
    vf = Vframe_Root();
    if ((view = e[Router_VIEW])) {
        vf.mountView(view.to);
    } else {
        Dispatcher_UpdateTag = Counter++;
        Dispatcher_Update(vf);
    }
};
/*#}#*/