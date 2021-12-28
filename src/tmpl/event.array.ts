
/*#if(modules.mxevent){#*/
    let MxEvent = {
        fire(name, data) {
            let key = Spliter + name,
                me = this,
                list = me[key],
                idx = 0, len, t;
            if (!data) data = {};
            data.type = name;
            if (list) {
                for (len = list.length; idx < len; idx++) {
                    t = list[idx];
                    if (t['@{~mx-event#fn}']) {
                        t['@{~mx-event#processing}'] = 1;
                        ToTry(t['@{~mx-event#fn}'], data, me);
                        t['@{~mx-event#processing}'] = Empty;
                    } else if (!t['@{~mx-event#processing}']) {
                        list.splice(idx--, 1);
                        len--;
                    }
                }
            }
            // if (!cancel) {
            //     list = me[`on${name}`];
            //     if (list) ToTry(list, data, me);
            // }
            // return me;
        },
        on(name, fn, priority = 0) {
            let me = this;
            let key = Spliter + name;
            let list = me[key] || (me[key] = []),
                added,
                definition = {
                    '@{~mx-event#fn}': fn,
                    '@{~mx-event#priority}': priority
                };
            for (let i = 0; i < list.length; i++) {
                if (list[i]['@{~mx-event#priority}'] < priority) {
                    list.splice(i, 0, definition);
                    added = 1;
                    break;
                }
            }
            if (!added) {
                list.push(definition);
            }
            // return me;
        },
        off(name, fn) {
            let key = Spliter + name,
                me = this,
                list = me[key],
                t;
            if (fn) {
                if (list) {
                    for (t of list) {
                        if (t['@{~mx-event#fn}'] == fn) {
                            t['@{~mx-event#fn}'] = Empty;
                            break;
                        }
                    }
                }
            } else {
                me[key] = Null;
                //me[`on${name}`] = Null;
            }
            // return me;
        }
    };
    /*#}#*/