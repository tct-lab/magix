let V_SKIP_PROPS = {
    [Tag_Static_Key]: 1,
    [Tag_View_Params_Key]: 1
};

if (DEBUG) {
    var CheckNodes = (realNodes, vNodes) => {
        let index = 0;
        if (vNodes.length != 1 ||
            vNodes[0]['@{~v#node.tag}'] != Spliter) {
            for (let e of realNodes) {
                if (e.nodeName.toLowerCase() != vNodes[index]['@{~v#node.tag}'].toLowerCase()) {
                    console.error('real not match virtual!');
                }
                index++;
            }
        }
    };
}

let V_TEXT_NODE = Counter;
if (DEBUG) {
    V_TEXT_NODE = '#text';
}
/*#if(modules.xml){#*/
let V_W3C = 'http://www.w3.org/';
let V_NSMap = {
    svg: `${V_W3C}2000/svg`,
    math: `${V_W3C}1998/Math/MathML`
};
/*#}#*/
let V_SetAttributes = (oldNode, lastVDOM, newVDOM) => {
    let key, value,
        changed = 0,
        nsMap = newVDOM['@{~v#node.attrs.specials}'],
        osMap = lastVDOM['@{~v#node.attrs.specials}'],
        nMap = newVDOM['@{~v#node.attrs.map}'],
        oMap = lastVDOM['@{~v#node.attrs.map}'],
        sValue;
    if (lastVDOM) {
        for (key in oMap) {
            if (!Has(nMap, key)) {//如果旧有新木有
                changed = 1;
                if ((sValue = osMap[key])) {
                    oldNode[sValue] = Empty;
                } else {
                    oldNode.removeAttribute(key);
                }
            }
        }
    }
    for (key in nMap) {
        if (!Has(V_SKIP_PROPS, key)) {
            value = nMap[key];
            if ((sValue = nsMap[key])) {
                if (!lastVDOM || oldNode[sValue] != value) {
                    changed = 1;
                    oldNode[sValue] = value;
                }
            } else if (!lastVDOM || oMap[key] != value) {
                changed = 1;
                oldNode.setAttribute(key, value);
            }
        }
    }
    if (changed) {
        delete oldNode['@{~node#ignore.events}'];
    }
    return changed;
};

let V_CreateNode = (vnode, owner) => {
    let tag = vnode['@{~v#node.tag}'], c;
    if (tag == V_TEXT_NODE) {
        c = Doc_Document.createTextNode(vnode['@{~v#node.outer.html}']);
    } else {
        c = Doc_Document.createElementNS(/*#if(modules.xml){#*/V_NSMap[tag] ||/*#}#*/ owner.namespaceURI, tag);
        V_SetAttributes(c, 0, vnode);
        SetInnerHTML(c, vnode['@{~v#node.html}']);
    }
    return c;
};
let V_SetChildNodes = (realNode, lastVDOM, newVDOM, ref, vframe, keys/*#if(modules.async){#*/, view, ready/*#}#*/) => {
    if (lastVDOM) {//view首次初始化，通过innerHTML快速更新
        if (lastVDOM['@{~v#node.has.mxv}'] ||
            lastVDOM['@{~v#node.html}'] != newVDOM['@{~v#node.html}']) {
            let i, oi,
                oldChildren = lastVDOM['@{~v#node.children}'],
                newChildren = newVDOM['@{~v#node.children}'], oc, nc,
                oldCount = oldChildren.length,
                newCount = newChildren.length,
                reused = newVDOM['@{~v#node.reused}'],
                nodes = realNode.childNodes, compareKey,
                keyedNodes = {},
                oldVIndex = 0,
                realNodeStep;
            for (i = oldCount; i--;) {
                oc = oldChildren[i];
                compareKey = oc['@{~v#node.compare.key}'];
                if (compareKey) {
                    compareKey = keyedNodes[compareKey] || (keyedNodes[compareKey] = []);
                    compareKey.push(nodes[i]);
                }
            }
            if (DEBUG && lastVDOM['@{~v#node.tag}'] != Q_TEXTAREA) {
                CheckNodes(nodes, oldChildren);
            }
            for (i = 0; i < newCount; i++) {
                nc = newChildren[i];
                oc = oldChildren[oldVIndex++];
                compareKey = keyedNodes[nc['@{~v#node.compare.key}']];
                if (compareKey && (compareKey = compareKey.pop())) {
                    if (compareKey != nodes[i]) {
                        for (oi = oldVIndex, realNodeStep = 1;
                            oi < oldCount;
                            oi++ , realNodeStep++) {
                            oc = oldChildren[oi];
                            if (oc && nodes[i + realNodeStep] == compareKey) {
                                oldChildren.splice(oi, 1);
                                oldVIndex--;
                                break;
                            }
                        }
                        realNode.insertBefore(compareKey, nodes[i]);
                    }
                    if (reused[oc['@{~v#node.compare.key}']]) {
                        reused[oc['@{~v#node.compare.key}']]--;
                    }
                    /*#if(modules.async){#*/
                    ref['@{~updater-ref#async.count}']++;
                    CallFunction(V_SetNode, [compareKey, realNode, oc, nc, ref, vframe, keys, view, ready]);
                    /*#}else{#*/
                    V_SetNode(compareKey, realNode, oc, nc, ref, vframe, keys);
                    /*#}#*/
                } else if (oc) {//有旧节点，则更新
                    if (keyedNodes[oc['@{~v#node.compare.key}']] &&
                        reused[oc['@{~v#node.compare.key}']]) {
                        oldCount++;
                        ref['@{~updater-ref#changed}'] = 1;
                        realNode.insertBefore(V_CreateNode(nc, realNode), nodes[i]);
                        oldVIndex--;
                    } else {/*#if(modules.async){#*/
                        ref['@{~updater-ref#async.count}']++;
                        CallFunction(V_SetNode, [nodes[i], realNode, oc, nc, ref, vframe, keys, view, ready]);
                        /*#}else{#*/
                        V_SetNode(nodes[i], realNode, oc, nc, ref, vframe, keys);
                        /*#}#*/
                    }
                } else {//添加新的节点
                    if (nc['@{~v#node.tag}'] == Spliter) {
                        SetInnerHTML(realNode, nc['@{~v#node.outer.html}']);
                    } else {
                        realNode.appendChild(V_CreateNode(nc, realNode));
                    }
                    ref['@{~updater-ref#changed}'] = 1;
                }
            }
            for (i = newCount; i < oldCount; i++) {
                oi = nodes[newCount];//删除多余的旧节点
                if (oi.nodeType == 1) {
                    vframe.unmountZone(oi);
                }
                if (DEBUG) {
                    if (!oi.parentNode) {
                        console.error('Avoid remove node on view.destroy in digesting');
                    }
                }
                realNode.removeChild(oi);
            }
        }
    } else {
        ref['@{~updater-ref#changed}'] = 1;
        SetInnerHTML(realNode, newVDOM['@{~v#node.html}']);
        /*#if(modules.richVframe||modules.router){#*/
        if (DEBUG) {
            if (vframe.root.nodeType == 1 && !vframe.root.parentNode) {
                throw new Error(`unsupport mount "${vframe.path}". the root element is removed by other views`);
            }
            let pId = vframe.pId;
            let vf = Vframe_Vframes[pId];
            if (vf) {
                let cs = vf.children();
                for (let c of cs) {
                    if (c != vframe.id) {
                        let nv = Vframe_Vframes[c];
                        if (nv &&
                            nv['@{~vframe#view.entity}'] &&
                            nv['@{~vframe#view.entity}'].tmpl &&
                            NodeIn(vframe.root, nv.root)) {
                            throw new Error(`unsupport nest "${vframe.path}" within "${nv.path}"`);
                        }
                    }
                }
            }
        }
        /*#}#*/
    }
    /*#if(modules.async){#*/
    if (!ref['@{~updater-ref#async.count}'] && view['@{~view#sign}']) {
        ready();
    }
    /*#}#*/
};
let V_SetNode = (realNode, oldParent, lastVDOM, newVDOM, ref, vframe, keys/*#if(modules.async){#*/, rootView, ready/*#}#*/) => {
    /*#if(modules.async){#*/
    if (rootView['@{~view#sign}']) {
        ref['@{~updater-ref#async.count}']--;
        /*#}#*/
        if (DEBUG) {
            if (lastVDOM['@{~v#node.tag}'] != Spliter &&
                newVDOM['@{~v#node.tag}'] != Spliter) {
                if (oldParent.nodeName == 'TEMPLATE') {
                    console.error('unsupport template tag');
                }
                if (
                    (realNode.nodeName == '#text' &&
                        lastVDOM['@{~v#node.tag}'] != '#text') ||
                    (realNode.nodeName != '#text' &&
                        realNode.nodeName.toLowerCase() != lastVDOM['@{~v#node.tag}'].toLowerCase())) {
                    console.error('Your code is not match the DOM tree generated by the browser. near:' + lastVDOM['@{~v#node.html}'] + '. Is that you lost some tags or modified the DOM tree?');
                }
            }
        }
        let lastAMap = lastVDOM['@{~v#node.attrs.map}'],
            newAMap = newVDOM['@{~v#node.attrs.map}'],
            lastNodeTag = lastVDOM['@{~v#node.tag}'];
        if (lastVDOM['@{~v#node.has.mxv}'] ||
            lastVDOM['@{~v#node.outer.html}'] != newVDOM['@{~v#node.outer.html}']) {
            if (lastNodeTag == Spliter) {
                ref['@{~updater-ref#changed}'] = 1;
                SetInnerHTML(oldParent, newVDOM['@{~v#node.outer.html}']);
            } else if (lastNodeTag == newVDOM['@{~v#node.tag}']) {
                if (lastNodeTag == V_TEXT_NODE) {
                    ref['@{~updater-ref#changed}'] = 1;
                    realNode.nodeValue = newVDOM['@{~v#node.outer.html}'];
                } else if (!lastAMap[Tag_Static_Key] ||
                    lastAMap[Tag_Static_Key] != newAMap[Tag_Static_Key]) {
                    let newMxView = newAMap[MX_View],
                        newHTML = newVDOM['@{~v#node.html}'],
                        commonAttrs = lastVDOM['@{~v#node.attrs}'] != newVDOM['@{~v#node.attrs}'],
                        updateAttribute = lastVDOM['@{~v#node.attrs.specials}'] || commonAttrs,
                        updateChildren, unmountOld,
                        oldVf = Vframe_Vframes[realNode['@{~node#vframe.id}']],
                        assign,
                        view,
                        uri = newMxView && ParseUri(newMxView),
                        params,
                        htmlChanged,
                        paramsChanged;
                    /*
                        如果存在新旧view，则考虑路径一致，避免渲染的问题
                     */

                    /*
                        只检测是否有参数控制view而不检测数据是否变化的原因：
                        例：view内有一input接收传递的参数，且该input也能被用户输入
                        var d1='xl';
                        var d2='xl';
                        当传递第一份数据时，input显示值xl，这时候用户修改了input的值且使用第二份数据重新渲染这个view，问input该如何显示？
                    */
                    if (updateAttribute) {
                        updateAttribute = V_SetAttributes(realNode, lastVDOM, newVDOM);
                        if (updateAttribute) {
                            ref['@{~updater-ref#changed}'] = 1;
                        }
                    }
                    //旧节点有view,新节点有view,且是同类型的view
                    if (newMxView && oldVf &&
                        oldVf['@{~vframe#view.path}'] == uri[Path] &&
                        (view = oldVf['@{~vframe#view.entity}'])) {
                        htmlChanged = newHTML != lastVDOM['@{~v#node.html}'];
                        paramsChanged = newMxView != oldVf[Path];
                        assign = lastAMap[Tag_View_Params_Key];
                        if (!htmlChanged && !paramsChanged && assign) {
                            params = assign.split(Comma);
                            for (assign of params) {
                                if (assign == Hash_Key || Has(keys, assign)) {
                                    paramsChanged = 1;
                                    break;
                                }
                            }
                        }
                        if (paramsChanged ||
                            htmlChanged /*#if(modules.checkAttr){#*/ ||
                            updateAttribute/*#}#*/) {
                            assign = view['@{~view#rendered}'] && view['@{~view#assign.fn}'];
                            //如果有assign方法,且有参数或html变化
                            //if (assign) {
                            params = uri[Params];
                            //处理引用赋值
                            Vframe_TranslateQuery(oldVf.pId, newMxView, params);
                            oldVf[Path] = newMxView;//update ref
                            oldVf['@{~vframe#template}'] = newHTML;
                            //如果需要更新，则进行更新的操作
                            // uri = {
                            //     //node: newVDOM,//['@{~v#node.children}'],
                            //     //html: newHTML,
                            //     //mxv: hasMXV,
                            //     node: realNode,
                            //     attr: updateAttribute,
                            //     deep: !view.tmpl,
                            //     inner: htmlChanged,
                            //     query: paramsChanged
                            // };
                            //updateAttribute = 1;
                            if (DEBUG) {
                                let result = ToTry(assign, params,/*[params, uri],*/ view);
                                if (result !== true && result !== false) {
                                    if (assign == View.prototype.assign) {
                                        console.error(`override ${uri[Path]} "assign" method and make sure returned true or false value`);
                                    } else {
                                        console.error(`${uri[Path]} "assign" method only allow returned true or false value`);
                                    }
                                }
                                if (result) {
                                    /*#if(!modules.async){#*/
                                    view['@{~view#assign.sign}']++;
                                    /*#}#*/
                                    ref['@{~updater-ref#view.renders}'].push(view);
                                }
                            } else if (ToTry(assign, params,/*[params, uri],*/ view)) {
                                /*#if(!modules.async){#*/
                                view['@{~view#assign.sign}']++;
                                /*#}#*/
                                ref['@{~updater-ref#view.renders}'].push(view);
                            }
                            //默认当一个组件有assign方法时，由该方法及该view上的render方法完成当前区域内的节点更新
                            //而对于不渲染界面的控制类型的组件来讲，它本身更新后，有可能需要继续由magix更新内部的子节点，此时通过deep参数控制
                            updateChildren = !view.tmpl;//uri.deep;
                            // } else {
                            //     unmountOld = 1;
                            //     updateChildren = 1;
                            //     if (DEBUG) {
                            //         if (updateAttribute) {
                            //             console.warn(`There is no "assign" method in ${uri[Path]},so magix remount it when attrs changed`);
                            //         }
                            //     }
                            // }
                        }// else {
                        // updateAttribute = 1;
                        //}
                    } else {
                        updateChildren = 1;
                        unmountOld = oldVf;
                    }
                    if (unmountOld) {
                        ref['@{~updater-ref#changed}'] = 1;
                        oldVf.unmountVframe();
                    }
                    // Update all children (and subchildren).
                    //自闭合标签不再检测子节点
                    if (updateChildren &&
                        !newVDOM['@{~v#node.self.close}']) {
                        V_SetChildNodes(realNode, lastVDOM, newVDOM, ref, vframe, keys/*#if(modules.async){#*/, rootView, ready/*#}#*/);
                    }
                }
            } else {
                ref['@{~updater-ref#changed}'] = 1;
                vframe.unmountZone(realNode);
                oldParent.replaceChild(V_CreateNode(newVDOM, oldParent), realNode);
            }
        }
        /*#if(modules.async){#*/
        if (!ref['@{~updater-ref#async.count}']) {
            ready();
        }
    }
    /*#}#*/
};