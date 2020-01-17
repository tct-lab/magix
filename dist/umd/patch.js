(() => {
    Magix.Vframe.get = Magix.Vframe.byId;
    let ViewBase = Magix.View.prototype;
    let ViewBaseDigest = ViewBase.digest;
    let isDOMTempalteCheckerRegexp = /if\s*\(\s*![^)]+\)\s*\{[^{]+\{\s*["']&["']\s*:\s*["']amp["']\s*,\s*["']<["']\s*:\s*["']lt["']\s*,\s*["']>["']\s*:\s*["']gt["']\s*,\s*["']"["']\s*:\s*["']#34["']\s*,\s*["']\\?'["']\s*:\s*["']#39["']\s*,\s*["']`["']\s*:\s*["']#96["']\s*\}/;
    let G_SPLITER = '\x1e';
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
    //
    let G_Tag_Key = 'mxs';
    let G_Tag_Attr_Key = 'mxa';
    let G_Tag_View_Key = 'mxv';
    let G_MX_VIEW = 'mx-view';
    let GA = document.documentElement.getAttribute;
    let G_GetAttribute = (node, attr) => GA.call(node, attr);
    let I_SVGNS = 'http://www.w3.org/2000/svg';
    let I_MATHNS = 'http://www.w3.org/1998/Math/MathML';
    let I_WrapMap = {
        // Support: IE <=9 only
        option: [1, '<select multiple>'],
        // XHTML parsers do not magically insert elements in the
        // same way that tag soup parsers do. So we cannot shorten
        // this by omitting <tbody> or other required elements.
        thead: [1, '<table>'],
        col: [2, '<table><colgroup>'],
        tr: [2, '<table><tbody>'],
        td: [3, '<table><tbody><tr>'],
        area: [1, '<map>'],
        param: [1, '<object>'],
        g: [1, `<svg xmlns="${I_SVGNS}">`],
        m: [1, `<math xmlns="${I_MATHNS}">`],
        _: [0, '']
    };
    let I_RTagName = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i;
    // Support: IE <=9 only
    I_WrapMap.optgroup = I_WrapMap.option;
    I_WrapMap.tbody = I_WrapMap.tfoot = I_WrapMap.colgroup = I_WrapMap.caption = I_WrapMap.thead;
    I_WrapMap.th = I_WrapMap.td;
    let I_Doc = document.implementation.createHTMLDocument('');
    let I_Base = I_Doc.createElement('base');
    I_Base.href = document.location.href;
    I_Doc.head.appendChild(I_Base);
    let IsPrimitive = args => !args || typeof args != 'object';
    let TranslateData = (data, params) => {
        let p, val;
        if (IsPrimitive(params)) {
            p = params + '';
            if (p[0] == G_SPLITER) {
                params = data[p];
            }
        }
        else {
            for (p in params) {
                val = params[p];
                val = TranslateData(data, val);
                params[p] = val;
            }
        }
        return params;
    };
    let Vframe_TranslateQuery = (pId, src, params, pVf) => {
        if (src.includes(G_SPLITER) &&
            (pVf = Magix.Vframe.byId(pId))) {
            TranslateData(pVf['c'], params);
        }
    };
    let I_UnmountVframs = (vf, n) => {
        if (n.nodeType == 1) {
            vf.unmountZone(n);
        }
    };
    let I_GetNode = (html, node) => {
        let tmp = I_Doc.createElement('div');
        // Deserialize a standard representation
        let ns = node.namespaceURI, tag;
        if (ns == I_SVGNS) {
            tag = 'g';
        }
        else if (ns == I_MATHNS) {
            tag = 'm';
        }
        else {
            tag = (I_RTagName.exec(html) || [0, ''])[1];
        }
        let wrap = I_WrapMap[tag] || I_WrapMap._;
        tmp.innerHTML = wrap[1] + html;
        // Descend through wrappers to the right content
        let j = wrap[0];
        while (j--) {
            tmp = tmp.lastChild;
        }
        return tmp;
    };
    //https://github.com/patrick-steele-idem/morphdom/blob/master/src/specialElHandlers.js
    let I_Specials = {
        INPUT: ['value', 'checked'],
        TEXTAREA: ['value'],
        OPTION: ['selected']
    };
    let I_SetAttributes = (oldNode, newNode, ref, keepId) => {
        let a, i, key, value;
        let oldAttributes = oldNode.attributes, newAttributes = newNode.attributes;
        for (i = oldAttributes.length; i--;) {
            a = oldAttributes[i].name;
            if (!newNode.hasAttribute(a)) {
                if (a == 'id') {
                    if (!keepId) {
                        ref.d.push([oldNode, '']);
                    }
                }
                else {
                    ref.c = 1;
                    oldNode.removeAttribute(a);
                }
            }
        }
        // Set new attributes.
        for (i = newAttributes.length; i--;) {
            a = newAttributes[i];
            key = a.name;
            value = a.value;
            if (oldNode.getAttribute && oldNode.getAttribute(key) != value) {
                if (key == 'id') {
                    ref.d.push([oldNode, value]);
                }
                else {
                    ref.c = 1;
                    oldNode.setAttribute(key, value);
                }
            }
        }
    };
    let I_SpecialDiff = (oldNode, newNode) => {
        let nodeName = oldNode.nodeName, i;
        let specials = I_Specials[nodeName];
        let result = 0;
        if (specials) {
            for (i of specials) {
                if (oldNode[i] != newNode[i]) {
                    result = 1;
                    oldNode[i] = newNode[i];
                }
            }
        }
        return result;
    };
    let I_GetCompareKey = (node) => {
        let key;
        if (node.nodeType == 1) {
            key = G_GetAttribute(node, G_MX_VIEW);
            if (key) {
                key = Magix.parseUrl(key).path;
            }
        }
        return key;
    };
    let I_SetChildNodes = (oldParent, newParent, ref, vframe, keys) => {
        let oldNode = oldParent.lastChild;
        let newNode = newParent.firstChild;
        let tempNew, tempOld, extra = 0, nodeKey, foundNode, keyedNodes = {}, newKeyedNodes = {}, next;
        // Extract keyed nodes from previous children and keep track of total count.
        while (oldNode) {
            extra++;
            nodeKey = I_GetCompareKey(oldNode);
            if (nodeKey) {
                nodeKey = keyedNodes[nodeKey] || (keyedNodes[nodeKey] = []);
                nodeKey.push(oldNode);
            }
            oldNode = oldNode.previousSibling;
            // if (newNode) {
            //     nodeKey = I_GetCompareKey(newNode);
            //     if (nodeKey) {
            //         newKeyedNodes[nodeKey] = 1;
            //     }
            //     newNode = newNode.nextSibling;
            // }
        }
        while (newNode) {
            nodeKey = I_GetCompareKey(newNode);
            if (nodeKey) {
                newKeyedNodes[nodeKey] = (newKeyedNodes[nodeKey] || 0) + 1;
            }
            newNode = newNode.nextSibling;
        }
        newNode = newParent.firstChild;
        //removed = newParent.childNodes.length < extra;
        oldNode = oldParent.firstChild;
        while (newNode) {
            extra--;
            tempNew = newNode;
            newNode = newNode.nextSibling;
            nodeKey = I_GetCompareKey(tempNew);
            foundNode = keyedNodes[nodeKey];
            if (foundNode && (foundNode = foundNode.pop())) {
                while (foundNode != oldNode) {
                    next = oldNode.nextSibling;
                    oldParent.appendChild(oldNode);
                    oldNode = next;
                }
                oldNode = foundNode.nextSibling;
                if (newKeyedNodes[nodeKey]) {
                    newKeyedNodes[nodeKey]--;
                }
                I_SetNode(foundNode, tempNew, oldParent, ref, vframe, keys);
            }
            else if (oldNode) {
                tempOld = oldNode;
                nodeKey = I_GetCompareKey(tempOld);
                if (nodeKey && keyedNodes[nodeKey] && newKeyedNodes[nodeKey]) {
                    extra++;
                    ref.c = 1;
                    ref.n.push([8, oldParent, tempNew, tempOld]);
                    //I_LazyId(ref, tempNew);
                    // If the old child had a key we skip over it until the end.
                    //oldParent.insertBefore(tempNew, tempOld);
                }
                else {
                    oldNode = oldNode.nextSibling;
                    I_SetNode(tempOld, tempNew, oldParent, ref, vframe, keys);
                }
            }
            else {
                //I_LazyId(ref, tempNew);
                // Finally if there was no old node we add the new node.
                //oldParent.appendChild(tempNew);
                ref.c = 1;
                ref.n.push([1, oldParent, tempNew]);
            }
        }
        // If we have any remaining unkeyed nodes remove them from the end.
        tempOld = oldParent.lastChild;
        while (extra-- > 0) {
            I_UnmountVframs(vframe, tempOld);
            ref.n.push([2, oldParent, tempOld]);
            tempOld = tempOld.previousSibling;
            //oldParent.removeChild(tempOld);
            ref.c = 1;
        }
    };
    let I_SetNode = (oldNode, newNode, oldParent, ref, vf, keys) => {
        //优先使用浏览器内置的方法进行判断
        /*
            特殊属性优先判断，先识别特殊属性是否发生了改变
            如果特殊属性发生了变化，是否更新取决于该节点上是否渲染了view
            如果渲染了view则走相关的view流程
            否则才更新特殊属性
     
            场景：<input value="{{=abc}}"/>
            updater.digest({abc:'abc'});
            然后用户删除了input中的abc修改成了123
            此时依然updater.digest({abc:'abc'}),问input中的值该显示abc还是123?
            目前是显示abc
        */
        if (I_SpecialDiff(oldNode, newNode) ||
            (oldNode.nodeType == 1 && oldNode.hasAttribute(G_Tag_View_Key)) ||
            !(oldNode.isEqualNode && oldNode.isEqualNode(newNode))) {
            if (oldNode.nodeName === newNode.nodeName) {
                // Handle regular element node updates.
                if (oldNode.nodeType === 1) {
                    let staticKey = G_GetAttribute(newNode, G_Tag_Key);
                    if (staticKey &&
                        staticKey == G_GetAttribute(oldNode, G_Tag_Key)) {
                        return;
                    }
                    // If we have the same nodename then we can directly update the attributes.
                    let newMxView = G_GetAttribute(newNode, G_MX_VIEW), newHTML = newNode.innerHTML;
                    let newStaticAttrKey = G_GetAttribute(newNode, G_Tag_Attr_Key);
                    let updateAttribute = !newStaticAttrKey || newStaticAttrKey != G_GetAttribute(oldNode, G_Tag_Attr_Key), updateChildren, unmountOld, oldVf = Magix.Vframe.byNode(oldNode), assign, view, uri = newMxView && Magix.parseUrl(newMxView), params, htmlChanged, paramsChanged;
                    if (newMxView && oldVf &&
                        (view = oldVf['b'])) {
                        htmlChanged = newHTML != oldVf['h'];
                        paramsChanged = newMxView != oldVf.path;
                        assign = G_GetAttribute(oldNode, G_Tag_View_Key);
                        //如果组件内html没改变，参数也没改变
                        //我们要检测引用参数是否发生了改变
                        if (!htmlChanged && !paramsChanged && assign) {
                            //对于mxv属性，带value的必定是组件
                            //所以对组件，我们只检测参数与html，所以组件的hasMXV=0
                            params = assign.split(',');
                            for (assign of params) {
                                //支持模板内使用this获取整个数据对象
                                //如果使用this来传递数据，我们把this的key处理成#号
                                //遇到#号则任意的数据改变都需要更新当前这个组件
                                if (assign == '#' || Magix.has(keys, assign)) {
                                    paramsChanged = 1;
                                    break;
                                }
                            }
                        }
                        //目前属性变化并不更新view,如果要更新，只需要再判断下updateAttribute即可
                        if (paramsChanged || htmlChanged) {
                            assign = view['h'] && view['g'];
                            if (assign) {
                                params = uri.params;
                                //处理引用赋值
                                Vframe_TranslateQuery(oldVf.pId, newMxView, params);
                                oldVf['h'] = newHTML;
                                //oldVf['@{vframe#data.stringify}'] = newDataStringify;
                                oldVf.path = newMxView; //update ref
                                uri = {
                                    node: newNode,
                                    //html: newHTML,
                                    deep: !view.tmpl,
                                    attr: updateAttribute,
                                    //mxv: hasMXV,
                                    inner: htmlChanged,
                                    query: paramsChanged,
                                    keys
                                };
                                //updateAttribute = 1;
                                /*if (updateAttribute) {
                                    updateAttribute = G_EMPTY;
                                    I_SetAttributes(oldNode, newNode, ref, 1);
                                }*/
                                if (Magix.toTry(assign, [params, uri], view)) {
                                    ref.v.push(view);
                                }
                                //默认当一个组件有assign方法时，由该方法及该view上的render方法完成当前区域内的节点更新
                                //而对于不渲染界面的控制类型的组件来讲，它本身更新后，有可能需要继续由magix更新内部的子节点，此时通过deep参数控制
                                updateChildren = uri.deep;
                            }
                            else {
                                unmountOld = 1;
                                updateChildren = 1;
                            }
                        } //else {//view没发生变化，则只更新特别的几个属性
                        //updateAttribute = 1;
                        //}
                    }
                    else {
                        updateChildren = 1;
                        unmountOld = oldVf;
                    }
                    if (unmountOld) {
                        ref.c = 1;
                        oldVf.unmountVframe(0, 1);
                    }
                    if (updateAttribute) {
                        //对于view，我们只更新特别的几个属性
                        I_SetAttributes(oldNode, newNode, ref, oldVf && newMxView);
                    }
                    // Update all children (and subchildren).
                    if (updateChildren) {
                        //ref.c = 1;
                        I_SetChildNodes(oldNode, newNode, ref, vf, keys);
                    }
                }
                else if (oldNode.nodeValue !== newNode.nodeValue) {
                    ref.c = 1;
                    oldNode.nodeValue = newNode.nodeValue;
                }
            }
            else {
                // we have to replace the node.
                I_UnmountVframs(vf, oldNode);
                //I_LazyId(ref, newNode);
                //oldParent.replaceChild(newNode, oldNode);
                ref.c = 1;
                ref.n.push([4, oldParent, newNode, oldNode]);
            }
        }
    };
    let Vframe_RunInvokes = (vf, list, o) => {
        list = vf['e']; //invokeList
        while (list.length) {
            o = list.shift();
            if (!o.r) { //remove
                vf.invoke(o.n, o.a); //name,arguments
            }
            delete list[o.k]; //key
        }
    };
    let View_EndUpdate = view => {
        let o, f;
        if (view['b']) {
            f = view['h'];
            view['h'] = 1;
            o = view.owner;
            o.mountZone();
            if (!f) {
                setTimeout(Vframe_RunInvokes, 0, o);
            }
        }
    };
    let Updater_Ref = ($$, v, k, f) => {
        if (!$$[G_SPLITER]) {
            $$[G_SPLITER] = 1;
        }
        for (f = $$[G_SPLITER]; --f;)
            if ($$[k = G_SPLITER + f] === v)
                return k;
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
    let Updater_Digest = view => {
        let keys = view['j'], changed = view['k'], vf = view.owner, ref = { d: [], v: [], n: [] }, node = view.root, tmpl = view.tmpl, vdom, data = view['e'], refData = vf['c'];
        view['k'] = 0;
        view['j'] = {};
        if (changed &&
            view &&
            node &&
            view['b'] > 0) {
            vdom = I_GetNode(tmpl(data, view.id, refData, Updater_Encode, Updater_Safeguard, Updater_EncodeURI, Updater_Ref, Updater_EncodeQ), node);
            I_SetChildNodes(node, vdom, ref, vf, keys);
            for (vdom of ref.d) {
                vdom[0].id = vdom[1];
            }
            for (vdom of ref.n) {
                if (vdom[0] == 1) {
                    vdom[1].appendChild(vdom[2]);
                }
                else if (vdom[0] == 2) {
                    vdom[1].removeChild(vdom[2]);
                }
                else if (vdom[0] == 4) {
                    vdom[1].replaceChild(vdom[2], vdom[3]);
                }
                else {
                    vdom[1].insertBefore(vdom[2], vdom[3]);
                }
            }
            for (vdom of ref.v) {
                vdom['c']();
            }
            if (tmpl) {
                View_EndUpdate(view);
            }
        }
    };
    Magix.View.merge({
        ctor() {
            let me = this;
            me.updater = {
                set(...a) {
                    return me.set.apply(me, a);
                },
                get(key) {
                    return me.get(key);
                },
                digest(...a) {
                    return me.digest.apply(me, a);
                }
            };
        }
    });
    ViewBase.digest = function (data, unchanged) {
        let tmpl = this.tmpl + '';
        if (isDOMTempalteCheckerRegexp.test(tmpl)) {
            this.set(data, unchanged);
            Updater_Digest(this);
        }
        else {
            ViewBaseDigest.apply(this, [data, unchanged]);
        }
    };
    ViewBase.setHTML = function (id, html) {
        let node = Magix.node(id);
        if (node) {
            node.innerHTML = html;
            View_EndUpdate(this);
        }
    };
})();
