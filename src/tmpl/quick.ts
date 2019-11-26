let Q_TEXTAREA = 'textarea';
let Q_Empty_Object = {};
let Q_Create = (tag, props, children, specials, unary) => {
    //html=tag+to_array(attrs)+children.html
    let token;
    if (tag) {
        props = props || Q_Empty_Object;
        let compareKey = Empty,
            hasMxv = specials,
            prop, value, c,
            reused = {},
            outerHTML = '<' + tag,
            attrs,
            innerHTML = Empty,
            newChildren = [],
            prevNode;
        if (children) {
            for (c of children) {
                value = c['@{~v#node.outer.html}'];
                if (c['@{~v#node.tag}'] == V_TEXT_NODE) {
                    value = value ? Updater_Encode(value) : ' ';//无值的文本节点我们用一个空格占位，这样在innerHTML的时候才会有文本节点
                }
                innerHTML += value;
                //merge text node
                if (prevNode &&
                    c['@{~v#node.tag}'] == V_TEXT_NODE &&
                    prevNode['@{~v#node.tag}'] == V_TEXT_NODE) {
                    //prevNode['@{~v#node.html}'] += c['@{~v#node.html}'];
                    prevNode['@{~v#node.outer.html}'] += c['@{~v#node.outer.html}'];
                } else {
                    //reused node if new node key equal old node key
                    if (c['@{~v#node.compare.key}']) {
                        reused[c['@{~v#node.compare.key}']] = (reused[c['@{~v#node.compare.key}']] || 0) + 1;
                    }
                    //force diff children
                    if (c['@{~v#node.has.mxv}']) {
                        hasMxv = 1;
                    }
                    prevNode = c;
                    newChildren.push(c);
                }
            }
        }
        specials = specials || Q_Empty_Object;
        for (prop in props) {
            value = props[prop];
            //布尔值
            if (value === false ||
                value == Null) {
                delete props[prop];
                continue;
            } else if (value === true) {
                props[prop] = value = specials[prop] ? value : Empty;
            }
            if (prop == Tag_Prop_Id) {//如果有id优先使用
                compareKey = value;
            } else if (prop == MX_View &&
                value &&
                !compareKey) {
                //否则如果是组件,则使用组件的路径做为key
                compareKey = ParseUri(value)[Path];
            } else if ((prop == Tag_Static_Key/*#if(modules.customTags){#*/ || prop == Tag_Prop_Is/*#}#*/) && !compareKey) {
                compareKey = value;
            } else if (prop == Tag_View_Params_Key) {
                hasMxv = 1;
            }
            if (prop == Value &&
                tag == Q_TEXTAREA) {
                innerHTML = value;
            } else if (!Has(V_SKIP_PROPS, prop)) {
                outerHTML += ` ${prop}="${value && Updater_Encode(value)}"`;
            }
        }
        /*#if(modules.customTags){#*/
        //自定义标签
        if (!compareKey && tag.includes('-')) {
            compareKey = tag;
        }
        /*#}#*/
        attrs = outerHTML;
        outerHTML += unary ? '/>' : `>${innerHTML}</${tag}>`;
        token = {
            '@{~v#node.outer.html}': outerHTML,
            '@{~v#node.html}': innerHTML,
            '@{~v#node.compare.key}': compareKey,
            '@{~v#node.tag}': tag,
            '@{~v#node.has.mxv}': hasMxv,
            '@{~v#node.attrs.specials}': specials,
            '@{~v#node.attrs}': attrs,
            '@{~v#node.attrs.map}': props,
            '@{~v#node.children}': newChildren,
            '@{~v#node.reused}': reused,
            '@{~v#node.self.close}': unary
        };
    } else {
        token = {
            '@{~v#node.tag}': props ? Spliter : V_TEXT_NODE,
            '@{~v#node.outer.html}': children + Empty
        };
    }
    return token;
};