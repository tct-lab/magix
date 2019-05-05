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
                if (t.f) {
                    t.x = 1;
                    ToTry(t.f, data, me);
                    t.x = Empty;
                } else if (!t.x) {
                    list.splice(idx--, 1);
                    len--;
                }
            }
        }
        list = me[`on${name}`];
        if (list) ToTry(list, data, me);
        return me;
    },
    on(name, f) {
        let me = this;
        let key = Spliter + name;
        let list = me[key] || (me[key] = []);
        list.push({
            f
        });
        return me;
    },
    off(name, fn) {
        let key = Spliter + name,
            me = this,
            list = me[key],
            t;
        if (fn) {
            if (list) {
                for (t of list) {
                    if (t.f == fn) {
                        t.f = Empty;
                        break;
                    }
                }
            }
        } else {
            delete me[key];
            delete me[`on${name}`];
        }
        return me;
    }
};
/*#}#*/