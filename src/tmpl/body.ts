/*
    dom event处理思路

    性能和低资源占用高于一切，在不特别影响编程体验的情况下，向性能和资源妥协

    1.所有事件代理到body上
    2.优先使用原生冒泡事件，使用mouseover+Magix.inside代替mouseenter
        'over<mouseover>':function(e){
            if(!Magix.inside(e.relatedTarget,e.eventTarget)){
                //enter
            }
        }
    3.事件支持嵌套，向上冒泡
    4.如果同一节点上同时绑定了mx-event和选择器事件，如
        <div data-menu="true" mx-click="clickMenu()"></div>

        'clickMenu<click>'(e){
            console.log('direct',e);
        },
        '$div[data-menu="true"]<click>'(e){
            console.log('selector',e);
        }

        那么先派发选择器绑定的事件再派发mx-event绑定的事件


    5.在当前view根节点上绑定事件，目前只能使用选择器绑定，如
        '$<click>'(e){
            console.log('view root click',e);
        }
    
    range:{
        app:{
            20:{
                mouseover:1,
                mousemove:1
            }
        }
    }
    view:{
        linkage:{
            40:1
        }
    }
 */
let Body_EvtInfoCache = new MxCache();
let Body_EvtInfoReg = /^([\w\-]+)\x1e(\d+)?(\x1e)?([^(]+)\(([\s\S]*?)\)$/;
let Body_RootEvents = {};
let Body_SearchSelectorEvents = {};

let Body_RootEvents_Modifier = {};
let Body_RootEvents_Flags = {};

let Body_Passive_True_Flag = 1;
let Body_Passive_False_Flag = 2;
let Body_Capture_True_Flag = 4;
let Body_Capture_False_Flag = 8;

let Body_Capture_True_Passive_False_Modifier = { capture: true, passive: false };
let Body_Capture_True_Passive_True_Modifier = { capture: true, passive: true };
let Body_Capture_False_Passive_False_Modifier = { capture: false, passive: false };
let Body_Capture_False_Passive_True_Modifier = { capture: false, passive: true };

/*
    passive:false, capture:true
    passive:true capture:true

    passive:false, capture:false,
    passive:false capture:false
*/
/*#if(modules.lockSubWhenBusy){#*/
let Body_Vframe_Busy = {};

let Body_FindInBusyVframe = (startId, pVf?) => {
    do {
        if (Body_Vframe_Busy[startId]) {
            return 1;
        }
        pVf = Vframe_Vframes[startId];
    } while (pVf && (startId = pVf.pId));
};
/*#}#*/
let Body_FindVframeInfo = (current, eventType) => {
    let vf, tempId, selectorObject, eventSelector, eventInfos = [],
        begin = current,
        info = GetAttribute(current, MX_PREFIX + eventType),
        match, view, vfs,
        selectorVfId,
        backtrace;
    if (info) {
        match = Body_EvtInfoCache.get(info);
        if (!match) {
            match = info.match(Body_EvtInfoReg) || Empty_Array;
            match = {
                v: match[1],
                b: match[2] | 0,
                t: match[3],
                n: match[4],
                i: match[5]
            };
            if (DEBUG) {
                match = Safeguard(match);
            }
            Body_EvtInfoCache.set(info, match);
        }
        match = Assign({}, match);
        if (DEBUG) {
            match = Assign(match, { r: info });
        }
    }
    //如果有匹配但没有处理的vframe或者事件在要搜索的选择器事件里
    if ((match && !match.v) || Body_SearchSelectorEvents[eventType]) {
        selectorVfId = begin['@{~node#owner.vframe}'];
        if (selectorVfId == Null) { //先找最近的vframe
            vfs = [begin];
            while (begin != Doc_Body && (begin = begin.parentNode)) {
                if (Vframe_Vframes[tempId = begin['@{~node#vframe.id}']] ||
                    (tempId = begin['@{~node#owner.vframe}'])) {
                    selectorVfId = tempId;
                    break;
                }
                vfs.push(begin);
            }
            for (info of vfs) {
                info['@{~node#owner.vframe}'] = selectorVfId || Empty;
            }
        }
        begin = current['@{~node#vframe.id}'];
        if (Vframe_Vframes[begin]) {
            /*
                如果当前节点是vframe的根节点，则把当前的vf置为该vframe
                该处主要处理这样的边界情况
                <mx-vrame src="./test" mx-click="parent()"/>
                //.test.js
                export default Magix.View.extend({
                    '$<click>'(){
                        console.log('test clicked');
                    }
                });
 
                当click事件发生在mx-vframe节点上时，要先派发内部通过选择器绑定在根节点上的事件，然后再派发外部的事件
            */
            backtrace = selectorVfId = begin;
        }
        // if (!selectorVfId) {
        //     selectorVfId = Mx_Cfg.rootId;
        // }

        if (selectorVfId) { //从最近的vframe向上查找带有选择器事件的view
            do {
                vf = Vframe_Vframes[selectorVfId];
                if (vf && (view = vf['@{~vframe.view.entity}'])) {
                    selectorObject = view['@{~view.selector.events.object}'];
                    eventSelector = selectorObject[eventType];
                    if (eventSelector) {
                        for (begin = eventSelector.length; begin--;) {
                            tempId = eventSelector[begin];
                            selectorObject = {
                                r: tempId,
                                v: selectorVfId,
                                n: tempId
                            };
                            if (tempId) {
                                /*
                                    事件发生时，做为临界的根节点只能触发`$`绑定的事件，其它事件不能触发
                                */
                                if (!backtrace &&
                                    current.matches(tempId)) {
                                    eventInfos.push(selectorObject);
                                }
                            } else if (backtrace) {
                                eventInfos.push(selectorObject);
                            }
                        }
                    }
                    //防止跨view选中，到带模板的view时就中止或未指定
                    if (view['@{~view.template}'] && !backtrace) {
                        break; //带界面的中止
                    }
                    backtrace = 0;
                }
            }
            while (vf && (selectorVfId = vf.pId));
        }
    }
    if (match) {
        eventInfos.push(match);
    }
    return eventInfos;
};


let Body_DOMEventProcessor = domEvent => {
    let { target, type/*#if(modules.webc){#*/, composed/*#}#*/ } = domEvent;
    /*#if(modules.webc){#*/
    if (composed) {
        target = domEvent.composedPath()[0];
    }
    /*#}#*/
    let eventInfos;
    let ignore;
    let vframe, view, eventName, fn;
    //let lastVfId;
    let params, arr = [], offset;
    /*#if(modules.remold){#*/
    let remold = Mx_Cfg.remold;
    /*#}#*/
    while (target &&
        target != Doc_Body &&
        /*#if(modules.remold){#*/
        (!remold || remold(target, type, domEvent)) &&
        /*#}#*/
        !domEvent.cancelBubble &&
        (!(ignore = target['@{~node#ignore.events}']) || !ignore[type])) {
        offset = 1;
        if (target.nodeType == offset) {
            eventInfos = Body_FindVframeInfo(target, type);
            if (eventInfos.length) {
                arr.length = 0;
                for (fn of eventInfos) {
                    let { v, n, i, t, b } = fn;
                    if (!v && DEBUG) {
                        return Mx_Cfg.error(Error(`bad ${type}:${fn.r}`));
                    }
                    // if (lastVfId != v) {
                    //     if (lastVfId && domEvent.cancelBubble) {
                    //         break;
                    //     }
                    //     lastVfId = v;
                    // }
                    vframe = Vframe_Vframes[v];
                    view = vframe && vframe['@{~vframe.view.entity}'];
                    if (view) {
                        if (view['@{~view.rendered}'] &&
                            view['@{~view.sign}']/*#if(modules.lockSubWhenBusy){#*/ &&
                            !Body_FindInBusyVframe(view.id)/*#}#*/) {
                            eventName = n + Spliter + type;
                            fn = view[eventName];
                            if (fn) {
                                domEvent.eventTarget = target;
                                params = i ? ParseExpr(i, vframe['@{~vframe.ref.data}']) : Empty_Object;
                                domEvent[Params] = params;
                                ToTry(fn, domEvent, view);
                            }
                            if (DEBUG) {
                                if (!fn) { //检测为什么找不到处理函数
                                    console.error('can not find event processor:' + n + '<' + type + '> from view:' + vframe.path);
                                }
                            }
                            if (target != view.root &&
                                !view['@{~view.selector.events.object}'][type]) {
                                if (t) {
                                    offset = b || offset;
                                } else {
                                    target = view.root;
                                    offset = 0;
                                }
                            }
                        }
                    } else {//如果处于删除中的事件触发，则停止事件的传播
                        if (DEBUG) {
                            if (view == null) {
                                console.warn(`vframe:${v} destroyed`)
                            } else if (view !== 0) { //销毁
                                console.error('can not find vframe:' + v);
                            }
                        }
                    }
                }
            } else {
                arr.push(target);
            }
            if (offset) {
                vframe = target['@{~node#vframe.id}'];
                if (vframe) {
                    vframe = Vframe_Vframes[vframe];
                    view = vframe && vframe['@{~vframe.view.entity}'];
                    if (view &&
                        view['@{~view.events.object}'][type]) {
                        arr.length = 0;
                    }
                }
            }
        }
        while (offset--) target = target.parentNode;
    }
    for (target of arr) {
        ignore = target['@{~node#ignore.events}'] || (target['@{~node#ignore.events}'] = {});
        ignore[type] = 1;
    }
};
let Body_DOMEventBind = (type, searchSelector, remove, flags) => {
    let counter = Body_RootEvents[type] | 0;
    let flag = Body_RootEvents_Flags[type] || (Body_RootEvents_Flags[type] = {});

    let offset = (remove ? -1 : 1),
        fn = remove ? RemoveEventListener : AddEventListener;
    if (flags & Body_Capture_True_Flag) {
        flag[Body_Capture_True_Flag] = (flag[Body_Capture_True_Flag] | 0) + offset;
    }
    if (flags & Body_Capture_False_Flag) {
        flag[Body_Capture_False_Flag] = (flag[Body_Capture_False_Flag] | 0) + offset;
    }
    if (flags & Body_Passive_True_Flag) {
        flag[Body_Passive_True_Flag] = (flag[Body_Passive_True_Flag] | 0) + offset;
    }
    if (flags & Body_Passive_False_Flag) {
        flag[Body_Passive_False_Flag] = (flag[Body_Passive_False_Flag] | 0) + offset;
    }

    let mod,
        lastMod = Body_RootEvents_Modifier[type];
    if (flag[Body_Passive_False_Flag]) {
        if (flag[Body_Capture_True_Flag]) {
            mod = Body_Capture_True_Passive_False_Modifier;
        } else {
            mod = Body_Capture_False_Passive_False_Modifier;
        }
    } else if (flag[Body_Capture_True_Flag]) {
        mod = Body_Capture_True_Passive_True_Modifier
    } else {
        mod = Body_Capture_False_Passive_True_Modifier;
    }
    if (!counter || remove === counter) { // remove=1  counter=1
        fn(Doc_Body, type, Body_DOMEventProcessor, remove ? lastMod : mod);
    } else if (mod != lastMod) {
        RemoveEventListener(Doc_Body, type, Body_DOMEventProcessor, lastMod);
        AddEventListener(Doc_Body, type, Body_DOMEventProcessor, mod);
    }
    Body_RootEvents_Modifier[type] = mod;
    Body_RootEvents[type] = counter + offset;
    if (searchSelector) { //记录需要搜索选择器的事件
        Body_SearchSelectorEvents[type] = (Body_SearchSelectorEvents[type] | 0) + offset;
    }
};