if (DEBUG) {
    var CheckNodes = (realNodes, vNodes) => {
        let index = 0;
        if (vNodes.length &&
            vNodes[0]['@{~v#node.tag}'] != Spliter) {
            for (let e of vNodes) {
                if (!realNodes[index]) {
                    console.error('real not match virtual nodes!');
                    break;
                }
                if (realNodes[index].nodeName.toLowerCase() != e['@{~v#node.tag}'].toLowerCase()) {
                    console.warn('virtual not match real nodes!');
                }
                index++;
            }
        }
    };
}
//let V_Active_Is_Diff = currentNode => Doc_Document.activeElement != currentNode;
let V_TEXT_NODE: (string | number) = Counter;
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
/*#if(modules.xview){#*/
let V_To_Reg = new RegExp(`${MX_TO}="\x05"`, 'g');
let V_TO_Update = (s, ref) => s.replace(V_To_Reg, `${MX_TO}="${ref['@{~updater-ref#view.id}']}"`);
/*#}#*/
let V_SetAttributes = (oldNode, newVDOM, lastVDOM?, ref?) => {
    let key, value,
        changed = 0,
        nsMap = newVDOM['@{~v#node.attrs.specials}'],
        nMap = newVDOM['@{~v#node.attrs.map}'],
        osMap,
        oMap,
        sValue;
    if (lastVDOM) {
        osMap = lastVDOM['@{~v#node.attrs.specials}'];
        oMap = lastVDOM['@{~v#node.attrs.map}'];
        for (key in oMap) {
            if (!Has(nMap, key)) {//如果旧有新木有
                changed = 1;
                if ((sValue = osMap[key])) {
                    if (ref) {
                        ref['@{~updater-ref#node.props}'].push([oldNode, sValue, Empty]);
                    } else {
                        oldNode[sValue] = Empty;
                    }
                } else {
                    oldNode.removeAttribute(key);
                }
            }
        }
    }
    for (key in nMap) {
        value = nMap[key];
        if ((sValue = nsMap[key])) {
            if (!lastVDOM || oldNode[sValue] != value) {
                changed = 1;
                if (ref) {
                    ref['@{~updater-ref#node.props}'].push([oldNode, sValue, value]);
                } else {
                    oldNode[sValue] = value;
                }
            }
        } else if (!lastVDOM || oMap[key] != value) {
            changed = 1;
            /*#if(modules.xview){#*/
            if (key == MX_TO) {
                value = ref['@{~updater-ref#view.id}'];
            }
            /*#}#*/
            oldNode.setAttribute(key, value);
        }
    }
    return changed;
};

let V_CreateNode = (vnode, owner, ref) => {
    let tag = vnode['@{~v#node.tag}'], c;
    if (tag == V_TEXT_NODE) {
        c = Doc_Document.createTextNode(vnode['@{~v#node.html}']);
    } else {
        c = Doc_Document.createElementNS(/*#if(modules.xml){#*/V_NSMap[tag] ||/*#}#*/ owner.namespaceURI, tag);
        V_SetAttributes(c, vnode);

        /*#if(modules.xview){#*/
        SetInnerHTML(c, V_TO_Update(vnode['@{~v#node.html}'], ref));
        /*#}else{#*/
        SetInnerHTML(c, vnode['@{~v#node.html}']);
        /*#}#*/
    }
    return c;
};
let V_GetKeyNodes = (list, nodes, start, end, realEnd) => {
    let keyedNodes = {},
        i, oc, cKey;//, iKey;
    for (i = end; i >= start; i--, realEnd--) {
        oc = list[i];
        cKey = oc['@{~v#node.compare.key}'];
        if (cKey) {
            //iKey = Spliter + cKey;
            //keyedNodes[iKey] = (keyedNodes[iKey] || 0) + 1;
            oc = keyedNodes[cKey] || (keyedNodes[cKey] = []);
            oc.push(nodes[realEnd]);
        }
    }
    return keyedNodes;
};
let V_IsSameVNode = (aVNode, bVNode) => {
    return (aVNode['@{~v#node.compare.key}'] &&
        bVNode['@{~v#node.compare.key}'] == aVNode['@{~v#node.compare.key}']) ||
        (!aVNode['@{~v#node.compare.key}'] &&
            !bVNode['@{~v#node.compare.key}'] &&
            aVNode['@{~v#node.tag}'] == bVNode['@{~v#node.tag}']) ||
        aVNode['@{~v#node.tag}'] == Spliter ||
        bVNode['@{~v#node.tag}'] == Spliter
        // (aVNode['@{~v#node.tag}'] == V_TEXT_NODE &&
        //     bVNode['@{~v#node.tag}'] == V_TEXT_NODE) ||
        // (aVNode['@{~v#node.tag}'] == Spliter ||
        //     bVNode['@{~v#node.tag}'] == Spliter) ||
        /*(aVNode['@{~v#node.compare.key}'] &&
            bVNode['@{~v#node.compare.key}'] == aVNode['@{~v#node.compare.key}'])/* ||
        (aVNode['@{~v#node.outer.html}'] ==
            bVNode['@{~v#node.outer.html}'])*/;
};
let V_Remove_Vframe_By_Node = (node, parentVf, elementNode, vf?) => {
    if (elementNode) {
        vf = Vframe_Vframes[node['@{~node#vframe.id}']];
        if (vf) {
            Vframe_Unmount(vf);
            //vf.unmount();
        } else {
            Vframe_UnmountZone(parentVf, node);
        }
    }
};
let V_Remove_Node_Task = (node, parent, parentVf, ref, view, ready) => {
    if (view['@{~view.sign}']) {
        V_Remove_Vframe_By_Node(node, parentVf, node.nodeType == 1);
        if (DEBUG) {
            if (!node.parentNode) {
                console.error('Avoid remove node on view.destroy in digesting');
            }
        }
        parent.removeChild(node);
        if (!(--ref['@{~updater-ref#async.count}'])) {
            CallFunction(ready);
        }
    }
};
let V_Insert_Node_Task = (realNode, oc, nodes, offset, view, ref, vframe, ready) => {
    if (view['@{~view.sign}']) {
        if (oc['@{~v#node.tag}'] == Spliter) {
            Vframe_UnmountZone(vframe, realNode);
            SetInnerHTML(realNode, oc['@{~v#node.html}']);
        } else {
            realNode.insertBefore(V_CreateNode(oc, realNode, ref), nodes[offset]);
        }
        if (!(--ref['@{~updater-ref#async.count}'])) {
            CallFunction(ready);
        }
    }
};
// let V_DecreaseUsed = (reused, resuedTotal, vnode, keyedNodes, list?) => {
//     if (reused[vnode['@{~v#node.compare.key}']]) {
//         reused[vnode['@{~v#node.compare.key}']]--;
//         resuedTotal--;
//         if (keyedNodes &&
//             (list = keyedNodes[vnode['@{~v#node.compare.key}']]) &&
//             list.length > 1) {
//             keyedNodes = Null;
//         }
//     }
//     return [resuedTotal, keyedNodes];
// };
let V_SetChildNodes = (realNode, lastVDOM, newVDOM, ref, vframe, keys/*#if(modules.async){#*/, view?, ready?/*#}#*/) => {
    /*#if(modules.async){#*/
    if (view['@{~view.sign}']) {
        /*#}#*/
        if (lastVDOM) {//view首次初始化，通过innerHTML快速更新
            if (lastVDOM['@{~v#node.mxv.keys}'] ||
                lastVDOM['@{~v#node.html}'] != newVDOM['@{~v#node.html}']) {
                let i, oi, oc,
                    oldChildren = lastVDOM['@{~v#node.children}'] || Empty_Array,
                    newChildren = newVDOM['@{~v#node.children}'] || Empty_Array,
                    reused = newVDOM['@{~v#node.reused}'] || Empty_Object,
                    resuedTotal = newVDOM['@{~v#node.reused.total}'],
                    oldReusedTotal = lastVDOM['@{~v#node.reused.total}'],
                    nodes = realNode.childNodes, compareKey,
                    keyedNodes,
                    oldRangeStart = 0,
                    newCount = newChildren.length,
                    oldRangeEnd = oldChildren.length - 1,
                    newRangeStart = 0,
                    newRangeEnd = newCount - 1;

                if (DEBUG &&
                    lastVDOM['@{~v#node.tag}'] != Q_TEXTAREA) {
                    CheckNodes(nodes, oldChildren);
                }
                // let newCount = newChildren.length - 1;
                // let oldCount = oldChildren.length - 1,
                //     nc,
                //     realNodeStep;
                // keyedNodes = {};
                // while (oldCount &&
                //     newCount) {
                //     oc = oldChildren[oldRangeStart];
                //     nc = newChildren[newRangeStart];
                //     if (oc['@{~v#node.outer.html}'] ==
                //         nc['@{~v#node.outer.html}']) {
                //         if (oc['@{~v#node.has.mxv}']) {
                //             V_SetNode(nodes[oldRangeStart], realNode, oc, nc, ref, vframe, keys);
                //         }
                //         if (reused[oc['@{~v#node.compare.key}']]) {
                //             reused[oc['@{~v#node.compare.key}']]--;
                //             resuedTotal--;
                //         }
                //         ++oldRangeStart;
                //         ++newRangeStart;
                //         --oldCount;
                //         --newCount;
                //     } else {
                //         break;
                //     }
                // }
                // while (oldCount > 1 &&
                //     newCount > 1) {
                //     oc = oldChildren[oldRangeEnd];
                //     nc = newChildren[newRangeEnd];
                //     if (oc && nc &&
                //         oc['@{~v#node.outer.html}'] ==
                //         nc['@{~v#node.outer.html}']) {
                //         if (oc['@{~v#node.has.mxv}']) {
                //             V_SetNode(nodes[oldRangeEnd], realNode, oc, nc, ref, vframe, keys);
                //         }
                //         if (reused[oc['@{~v#node.compare.key}']]) {
                //             reused[oc['@{~v#node.compare.key}']]--;
                //             resuedTotal--;
                //         }
                //         --oldRangeEnd;
                //         --newRangeEnd;
                //         --oldCount;
                //         --newCount;
                //     } else {
                //         break;
                //     }
                // }
                // if (resuedTotal > 0 &&
                //     oldReusedTotal > 0) {
                //     for (i = oldRangeEnd; i >= oldRangeStart; i--) {
                //         oc = oldChildren[i];
                //         compareKey = oc['@{~v#node.compare.key}'];
                //         if (compareKey) {
                //             compareKey = keyedNodes[compareKey] || (keyedNodes[compareKey] = []);
                //             compareKey.push(nodes[i]);
                //         }
                //     }
                // }

                // for (i = newRangeStart; i <= newRangeEnd; i++) {
                //     nc = newChildren[i];
                //     oc = oldRangeStart <= oldRangeEnd && oldChildren[oldRangeStart++];
                //     compareKey = keyedNodes[nc['@{~v#node.compare.key}']];
                //     if (compareKey && (compareKey = compareKey.pop())) {
                //         if (compareKey != nodes[i]) {
                //             for (oi = oldRangeStart, realNodeStep = 1;
                //                 oi <= oldRangeEnd;
                //                 oi++, realNodeStep++) {
                //                 oc = oldChildren[oi];
                //                 if (oc && nodes[i + realNodeStep] == compareKey) {
                //                     oldChildren.splice(oi, 1);
                //                     oldRangeStart--;
                //                     break;
                //                 }
                //             }
                //             realNode.insertBefore(compareKey, nodes[i]);
                //         }
                //         if (reused[oc['@{~v#node.compare.key}']]) {
                //             reused[oc['@{~v#node.compare.key}']]--;
                //         }
                //         /*#if(modules.async){#*/
                //         ref['@{~updater-ref#async.count}']++;
                //         CallFunction(V_SetNode, [compareKey, realNode, oc, nc, ref, vframe, keys, view, ready]);
                //         /*#}else{#*/
                //         V_SetNode(compareKey, realNode, oc, nc, ref, vframe, keys);
                //         /*#}#*/
                //     } else if (oc) {//有旧节点，则更新
                //         if (keyedNodes[oc['@{~v#node.compare.key}']] &&
                //             reused[oc['@{~v#node.compare.key}']]) {
                //             oldCount++;
                //             ref['@{~updater-ref#changed}'] = 1;
                //             realNode.insertBefore(V_CreateNode(nc, realNode), nodes[i]);
                //             oldRangeStart--;
                //         } else {/*#if(modules.async){#*/
                //             ref['@{~updater-ref#async.count}']++;
                //             CallFunction(V_SetNode, [nodes[i], realNode, oc, nc, ref, vframe, keys, view, ready]);
                //             /*#}else{#*/
                //             V_SetNode(nodes[i], realNode, oc, nc, ref, vframe, keys);
                //             /*#}#*/
                //         }
                //     } else {//添加新的节点
                //         if (nc['@{~v#node.tag}'] == Spliter) {
                //             SetInnerHTML(realNode, nc['@{~v#node.outer.html}']);
                //         } else {
                //             realNode.insertBefore(V_CreateNode(nc, realNode), nodes[i]);
                //         }
                //         ref['@{~updater-ref#changed}'] = 1;
                //     }
                // }
                // for (i = newCount; i < oldCount; i++) {
                //     oi = nodes[newRangeEnd + 1];//删除多余的旧节点
                //     if (oi.nodeType == 1) {
                //         vframe.unmountZone(oi);
                //     }
                //     if (DEBUG) {
                //         if (!oi.parentNode) {
                //             console.error('Avoid remove node on view.destroy in digesting');
                //         }
                //     }
                //     realNode.removeChild(oi);
                // }
                //-------new alg-------
                let oldStartNode = oldChildren[oldRangeStart],
                    oldEndNode = oldChildren[oldRangeEnd],
                    newStartNode = newChildren[newRangeStart],
                    newEndNode = newChildren[newRangeEnd],
                    realNodeRangeStart = oldRangeStart,
                    realNodeRangeEnd = oldRangeEnd,
                    currentNode;
                while (oldRangeStart <= oldRangeEnd &&
                    newRangeStart <= newRangeEnd) {
                    if (!oldStartNode) {
                        oldStartNode = oldChildren[++oldRangeStart];
                    } else if (!oldEndNode) {
                        oldEndNode = oldChildren[--oldRangeEnd];
                    } else if (V_IsSameVNode(newStartNode, oldStartNode)) {
                        /*#if(modules.async){#*/
                        if (newStartNode['@{~v#node.tag}'] == Spliter ||
                            oldStartNode['@{~v#node.tag}'] == Spliter) {
                            ref['@{~updater-ref#changed}'] = 1;
                            Vframe_UnmountZone(vframe, realNode);
                            if (newStartNode['@{~v#node.tag}'] == Spliter) {
                                realNodeRangeEnd = 0;
                                SetInnerHTML(realNode, newStartNode['@{~v#node.html}']);
                            } else {
                                SetInnerHTML(realNode, Empty);
                                realNode.appendChild(V_CreateNode(newStartNode, realNode, ref));
                            }
                        } else {
                            ref['@{~updater-ref#async.count}']++;
                            CallFunction(V_SetNode, [nodes[realNodeRangeStart], realNode, oldStartNode, newStartNode, ref, vframe, keys, view, ready]);
                        }
                        /*#}else{#*/
                        V_SetNode(nodes[realNodeRangeStart], realNode, oldStartNode, newStartNode, ref, vframe, keys);
                        /*#}#*/
                        //更新需要保留的节点，加速对节点索引
                        //如果当前节点已经在索引中，则要按顺序移除
                        //[resuedTotal, keyedNodes] = V_DecreaseUsed(reused, resuedTotal, oldStartNode, keyedNodes);
                        if (reused[oldStartNode['@{~v#node.compare.key}']]) {
                            reused[oldStartNode['@{~v#node.compare.key}']]--;
                            resuedTotal--;
                            compareKey = keyedNodes &&
                                keyedNodes[oldStartNode['@{~v#node.compare.key}']];
                            if (compareKey) {
                                --keyedNodes[oldStartNode['@{~v#node.compare.key}']];
                            }
                        }
                        realNodeRangeStart++;
                        oldStartNode = oldChildren[++oldRangeStart];
                        newStartNode = newChildren[++newRangeStart];
                    } else if (V_IsSameVNode(newEndNode, oldEndNode)) {
                        /*#if(modules.async){#*/
                        ref['@{~updater-ref#async.count}']++;
                        CallFunction(V_SetNode, [nodes[realNodeRangeEnd], realNode, oldEndNode, newEndNode, ref, vframe, keys, view, ready]);
                        /*#}else{#*/
                        V_SetNode(nodes[realNodeRangeEnd], realNode, oldEndNode, newEndNode, ref, vframe, keys);
                        /*#}#*/
                        //[resuedTotal, keyedNodes] = V_DecreaseUsed(reused, resuedTotal, oldEndNode, keyedNodes);
                        if (reused[oldEndNode['@{~v#node.compare.key}']]) {
                            reused[oldEndNode['@{~v#node.compare.key}']]--;
                            resuedTotal--;
                        }
                        realNodeRangeEnd--;
                        oldEndNode = oldChildren[--oldRangeEnd];
                        newEndNode = newChildren[--newRangeEnd];
                    } else if (V_IsSameVNode(newEndNode, oldStartNode)) {
                        oi = nodes[realNodeRangeStart];
                        realNode.insertBefore(oi, nodes[realNodeRangeEnd + 1]);
                        /*#if(modules.async){#*/
                        ref['@{~updater-ref#async.count}']++;
                        CallFunction(V_SetNode, [oi, realNode, oldStartNode, newEndNode, ref, vframe, keys, view, ready]);
                        /*#}else{#*/
                        V_SetNode(oi, realNode, oldStartNode, newEndNode, ref, vframe, keys);
                        /*#}#*/
                        //[resuedTotal, keyedNodes] = V_DecreaseUsed(reused, resuedTotal, oldStartNode, keyedNodes);
                        if (reused[oldStartNode['@{~v#node.compare.key}']]) {
                            reused[oldStartNode['@{~v#node.compare.key}']]--;
                            resuedTotal--;
                        }
                        realNodeRangeEnd--;
                        oldStartNode = oldChildren[++oldRangeStart];
                        newEndNode = newChildren[--newRangeEnd];
                    } else if (V_IsSameVNode(newStartNode, oldEndNode)) {
                        oi = nodes[realNodeRangeEnd];
                        realNode.insertBefore(oi, nodes[realNodeRangeStart++]);
                        /*#if(modules.async){#*/
                        ref['@{~updater-ref#async.count}']++;
                        CallFunction(V_SetNode, [oi, realNode, oldEndNode, newStartNode, ref, vframe, keys, view, ready]);
                        /*#}else{#*/
                        V_SetNode(oi, realNode, oldEndNode, newStartNode, ref, vframe, keys);
                        /*#}#*/
                        if (reused[oldEndNode['@{~v#node.compare.key}']]) {
                            reused[oldEndNode['@{~v#node.compare.key}']]--;
                            resuedTotal--;
                        }
                        //[resuedTotal, keyedNodes] = V_DecreaseUsed(reused, resuedTotal, oldEndNode, keyedNodes);
                        oldEndNode = oldChildren[--oldRangeEnd];
                        newStartNode = newChildren[++newRangeStart];
                    } else {
                        if (!keyedNodes &&
                            resuedTotal > 0 &&
                            oldReusedTotal > 0) {
                            keyedNodes = V_GetKeyNodes(oldChildren, nodes, oldRangeStart, oldRangeEnd, realNodeRangeEnd);
                        }
                        currentNode = nodes[realNodeRangeStart];
                        compareKey = keyedNodes &&
                            keyedNodes[newStartNode['@{~v#node.compare.key}']];
                        /**
                         * <div>{{=f}}</div>   =>  <div>aa</div>
                         * <div>aa</div>
                         * <div>bb</div>
                         */
                        if (compareKey &&
                            (compareKey = compareKey.pop()/*[--keyedNodes[Spliter + newStartNode['@{~v#node.compare.key}']]]*/)) {
                            oc = oldStartNode;
                            if (compareKey != currentNode) {
                                /**
                                 * <div>{{=x}}</div>    =>    <div>aa</div>
                                 * <div>aa</div>              <div>bb</div>
                                 * <div>bb</div>
                                 * <div>{{=y}}</div>
                                 */
                                for (oi = oldRangeStart + 1,
                                    i = realNodeRangeStart + 1;
                                    oi <= oldRangeEnd;
                                    oi++) {
                                    oc = oldChildren[oi];
                                    if (oc &&
                                        nodes[i++] == compareKey) {
                                        oldChildren[oi] = Null;
                                        break;
                                    }
                                }
                                oldRangeStart--;
                                realNode.insertBefore(compareKey, currentNode);
                            }
                            if (reused[oc['@{~v#node.compare.key}']]) {
                                reused[oc['@{~v#node.compare.key}']]--;
                            }
                            /*#if(modules.async){#*/
                            ref['@{~updater-ref#async.count}']++;
                            CallFunction(V_SetNode, [compareKey, realNode, oc, newStartNode, ref, vframe, keys, view, ready]);
                            /*#}else{#*/
                            V_SetNode(compareKey, realNode, oc, newStartNode, ref, vframe, keys);
                            /*#}#*/
                        } else {
                            /**
                             * <div>aa</div>    =>    <div>{{=f}}</div>
                             *                        <div>aa</div>
                             *                        <div>bb</div>
                             */
                            if ((keyedNodes &&
                                keyedNodes[oldStartNode['@{~v#node.compare.key}']] &&
                                reused[oldStartNode['@{~v#node.compare.key}']]) ||
                                (Vframe_Vframes[currentNode['@{~node#vframe.id}']] &&
                                    !newStartNode['@{~v#node.is.mx.view}'])) {
                                ref['@{~updater-ref#changed}'] = 1;
                                realNode.insertBefore(V_CreateNode(newStartNode, realNode, ref), currentNode);
                                oldRangeStart--;
                                realNodeRangeEnd++;
                            } else {
                                /*#if(modules.async){#*/
                                ref['@{~updater-ref#async.count}']++;
                                CallFunction(V_SetNode, [currentNode, realNode, oldStartNode, newStartNode, ref, vframe, keys, view, ready]);
                                /*#}else{#*/
                                V_SetNode(currentNode, realNode, oldStartNode, newStartNode, ref, vframe, keys);
                                /*#}#*/
                            }
                        }
                        ++realNodeRangeStart;
                        oldStartNode = oldChildren[++oldRangeStart];
                        newStartNode = newChildren[++newRangeStart];
                    }
                }
                for (i = newRangeStart, oi = 1;
                    i <= newRangeEnd;
                    i++, oi++) {
                    oc = newChildren[i];
                    ref['@{~updater-ref#changed}'] = 1;
                    ref['@{~updater-ref#async.count}']++;
                    CallFunction(V_Insert_Node_Task, [realNode, oc, nodes, realNodeRangeEnd + oi, view, ref, vframe, ready]);
                    // if (oc['@{~v#node.tag}'] == Spliter) {
                    //     Vframe_UnmountZone(realNode);
                    //     SetInnerHTML(realNode, oc['@{~v#node.html}']);
                    // } else {
                    //     realNode.insertBefore(V_CreateNode(oc, realNode), nodes[realNodeRangeEnd + oi]);
                    // }
                }
                if (!newCount &&
                    oldStartNode &&
                    oldStartNode['@{~v#node.tag}'] == Spliter) {
                    realNodeRangeEnd = nodes.length - 1;
                }
                for (i = realNodeRangeEnd; i >= realNodeRangeStart; i--) {//删除多余的旧节点
                    ref['@{~updater-ref#changed}'] = 1;
                    ref['@{~updater-ref#async.count}']++;
                    CallFunction(V_Remove_Node_Task, [nodes[i], realNode, vframe, ref, view, ready]);
                }
            }
        } else {
            ref['@{~updater-ref#changed}'] = 1;
            /*#if(modules.xview){#*/
            SetInnerHTML(realNode, V_TO_Update(newVDOM['@{~v#node.html}'], ref));
            /*#}else{#*/
            SetInnerHTML(realNode, newVDOM['@{~v#node.html}']);
            /*#}#*/
            /*#if(modules.richVframe||modules.router){#*/
            if (DEBUG) {
                if (vframe.root.nodeType == 1 && !vframe.root.parentNode) {
                    throw new Error(`unsupport mount "${vframe.path}". the root element is removed by other views`);
                }
                /*#if(!modules.innerView){#*/
                let pId = vframe.pId;
                let vf = Vframe_Vframes[pId];
                if (vf) {
                    let cs = vf.children();
                    for (let c of cs) {
                        if (c != vframe.id) {
                            let nv = Vframe_Vframes[c];
                            if (nv &&
                                nv['@{~vframe.view.entity}'] &&
                                nv['@{~vframe.view.entity}']['@{~view.template}'] &&
                                NodeIn(vframe.root, nv.root)) {
                                throw new Error(`unsupport nest "${vframe.path}" within "${nv.path}"`);
                            }
                        }
                    }
                }
                /*#}#*/
            }
            /*#}#*/
        }
        /*#if(modules.async){#*/
    }
    /*#}#*/
    /*#if(modules.async){#*/
    if (!ref['@{~updater-ref#async.count}']) {
        CallFunction(ready);
    }
    /*#}#*/
};
let V_SetNode = (realNode, oldParent, lastVDOM, newVDOM, ref, vframe, keys/*#if(modules.async){#*/, rootView?, ready?/*#}#*/) => {
    /*#if(modules.async){#*/
    if (rootView['@{~view.sign}']) {
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
            newAMap = newVDOM['@{~v#node.attrs.map}'];
        if (lastVDOM['@{~v#node.mxv.keys}'] ||
            lastVDOM['@{~v#node.attrs}'] != newVDOM['@{~v#node.attrs}'] ||
            lastVDOM['@{~v#node.html}'] != newVDOM['@{~v#node.html}']) {
            if (lastVDOM['@{~v#node.tag}'] == newVDOM['@{~v#node.tag}']) {
                if (lastVDOM['@{~v#node.tag}'] == V_TEXT_NODE) {
                    ref['@{~updater-ref#changed}'] = 1;
                    realNode.nodeValue = newVDOM['@{~v#node.html}'];
                } else if (!lastAMap[Tag_Static_Key] ||
                    lastAMap[Tag_Static_Key] != newAMap[Tag_Static_Key]) {
                    let newMxView = newAMap[MX_View],
                        newHTML = newVDOM['@{~v#node.html}'],
                        updateAttribute = lastVDOM['@{~v#node.attrs}'] != newVDOM['@{~v#node.attrs}'] || newVDOM['@{~v#node.attrs.has.specials}'],
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
                        updateAttribute = V_SetAttributes(realNode, newVDOM, lastVDOM, ref);
                        if (updateAttribute) {
                            ref['@{~updater-ref#changed}'] = 1;
                        }
                    }
                    //旧节点有view,新节点有view,且是同类型的view
                    if (newMxView && oldVf &&
                        oldVf['@{~vframe.view.path}'] == uri[Path] &&
                        (view = oldVf['@{~vframe.view.entity}'])) {
                        htmlChanged = newHTML != lastVDOM['@{~v#node.html}'];
                        paramsChanged = newMxView != oldVf[Path];
                        assign = newVDOM['@{~v#node.mxv.keys}'];
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
                            assign = view['@{~view.assign.fn}'];
                            //如果有assign方法,且有参数或html变化
                            //if (assign) {
                            params = uri[Params];
                            //处理引用赋值
                            Vframe_TranslateQuery(newAMap[MX_OWNER], newMxView, params);
                            oldVf[Path] = newMxView;//update ref
                            oldVf['@{~vframe.template}'] = newHTML;
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
                                let result = ToTry(assign, [params, newHTML],/*[params, uri],*/ view);
                                if (result !== false) {
                                    if (assign == View.prototype.assign) {
                                        console.warn(`${uri[Path]} need "assign" method for receive parameters changed`, params, newHTML);
                                    }
                                    ref['@{~updater-ref#view.renders}'].push(view);
                                }
                            } else if (ToTry(assign, [params, newHTML],/*[params, uri],*/ view) !== false) {
                                /*#if(!modules.async){#*/
                                //view['@{~view.assign.sign}']++;
                                /*#}#*/
                                ref['@{~updater-ref#view.renders}'].push(view);
                            }
                            //默认当一个组件有assign方法时，由该方法及该view上的render方法完成当前区域内的节点更新
                            //而对于不渲染界面的控制类型的组件来讲，它本身更新后，有可能需要继续由magix更新内部的子节点，此时通过deep参数控制
                            updateChildren = !view['@{~view.template}'];//uri.deep;
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
                        Vframe_Unmount(oldVf);
                        //oldVf.unmount();
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
                V_Remove_Vframe_By_Node(realNode, vframe, 1);
                oldParent.replaceChild(V_CreateNode(newVDOM, oldParent, ref), realNode);
            }
        }
        /*#if(modules.async){#*/
    }
    if (!(--ref['@{~updater-ref#async.count}'])) {
        CallFunction(ready);
    }
    /*#}#*/
};