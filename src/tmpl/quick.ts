let Q_TEXTAREA = 'textarea';
let Q_Create = (tag, props, children, specials) => {
    //html=tag+to_array(attrs)+children.html
    let token;
    if (tag) {
        props = props || Empty_Object;
        let compareKey = Empty,
            unary = children == 1,
            mxvKeys = specials,
            hasSpecials = specials,
            prop, value, c,
            reused,
            reusedTotal = 0,
            //outerHTML = '<' + tag,
            attrs = `<${tag}`,
            innerHTML = Empty,
            newChildren,
            prevNode,
            /*#if(modules.preloadViews){#*/
            viewList,
            /*#}#*/
            mxView = 0;
        if (children &&
            children != 1) {
            for (c of children) {
                if (c['@{~v#node.attrs}']) {
                    value = c['@{~v#node.attrs}'] + (c['@{~v#node.self.close}'] ? '/>' : `>${c['@{~v#node.html}']}</${c['@{~v#node.tag}']}>`);
                } else {
                    value = c['@{~v#node.html}'];
                    if (c['@{~v#node.tag}'] == V_TEXT_NODE) {
                        if (value) {
                            value = Updater_Encode(value);
                        } else {
                            continue
                        }
                    }
                }
                innerHTML += value;
                //merge text node
                if (prevNode &&
                    c['@{~v#node.tag}'] == V_TEXT_NODE &&
                    prevNode['@{~v#node.tag}'] == V_TEXT_NODE) {
                    //prevNode['@{~v#node.html}'] += c['@{~v#node.html}'];
                    prevNode['@{~v#node.html}'] += c['@{~v#node.html}'];
                } else {
                    /*#if(modules.preloadViews){#*/
                    if (c['@{~v#node.views}']) {
                        if (!viewList) viewList = [];
                        viewList.push(...c['@{~v#node.views}']);
                    }
                    /*#}#*/
                    //reused node if new node key equal old node key
                    if (c['@{~v#node.compare.key}']) {
                        if (!reused) reused = {};
                        reused[c['@{~v#node.compare.key}']] = (reused[c['@{~v#node.compare.key}']] || 0) + 1;
                        reusedTotal++;
                    }
                    //force diff children
                    mxvKeys = mxvKeys || c['@{~v#node.mxv.keys}'];
                    prevNode = c;
                    if (!newChildren) newChildren = [];
                    newChildren.push(c);
                }
            }
        }
        specials = specials || Empty_Object;
        for (prop in props) {
            value = props[prop];
            //布尔值
            if (value === false ||
                value == Null) {
                if (!specials[prop]) {
                    delete props[prop];
                }
                continue;
            } else if (value === true) {
                props[prop] = value = specials[prop] ? value : Empty;
            }
            if ((prop == Hash_Key ||
                prop == Tag_Prop_Id ||
                prop == Tag_Static_Key/*#if(modules.customTags){#*/ ||
                prop == Tag_Prop_Is/*#}#*/) &&
                !compareKey) {
                compareKey = value;
                if (prop != Tag_Prop_Id) {
                    delete props[prop];
                    continue;
                }
            } if (prop == MX_View &&
                value) {
                /*#if(modules.preloadViews){#*/
                prevNode = ParseUri(value);
                mxView = prevNode[Path];
                if (!viewList) {
                    viewList = [];
                }
                viewList.push([mxView, props[MX_OWNER], value, prevNode[Params]]);
                /*#}else{#*/
                mxView = ParseUri(value)[Path];
                /*#}#*/
                if (!compareKey) {
                    //否则如果是组件,则使用组件的路径做为key
                    compareKey = tag + Spliter + mxView;
                }
            }
            if (prop == Value &&
                tag == Q_TEXTAREA) {
                innerHTML = value;
                //attrs += value;
            } else if (prop == Tag_View_Params_Key) {
                mxvKeys = value;
                delete props[prop];
            } else {
                attrs += ` ${prop}="${value && Updater_Encode(value)}"`;
            }
        }
        /*#if(modules.customTags){#*/
        //自定义标签
        if (!compareKey && tag.includes('-')) {
            compareKey = tag;
        }
        /*#}#*/
        //attrs += outerHTML;
        //outerHTML += unary ? '/>' : `>${innerHTML}</${tag}>`;
        token = {
            '@{~v#node.html}': innerHTML,
            '@{~v#node.compare.key}': compareKey,
            '@{~v#node.tag}': tag,
            '@{~v#node.is.mx.view}': mxView,
            '@{~v#node.mxv.keys}': mxvKeys,
            '@{~v#node.attrs.specials}': specials,
            '@{~v#node.attrs.has.specials}': hasSpecials,
            '@{~v#node.attrs}': attrs,
            '@{~v#node.attrs.map}': props,
            '@{~v#node.children}': newChildren,
            '@{~v#node.reused}': reused,
            '@{~v#node.reused.total}': reusedTotal,
            /*#if(modules.preloadViews){#*/
            '@{~v#node.views}': viewList,
            /*#}#*/
            '@{~v#node.self.close}': unary
        };
    } else {
        token = {
            '@{~v#node.tag}': children ? Spliter : V_TEXT_NODE,
            '@{~v#node.html}': props + Empty
        };
    }
    return token;
};