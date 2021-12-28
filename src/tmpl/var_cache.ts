let CacheSort = (a, b) => b['@{~cache-item#fre}'] - a['@{~cache-item#fre}'];
//let CacheCounter = 0;
function MxCache(max?: number, buffer?: number/*, remove?: (item: any) => void*/, me?: any) {
    me = this;
    me['@{~cache#list}'] = [];
    me['@{~cache#buffer.count}'] = buffer || 20; //buffer先取整，如果为0则再默认5
    me['@{~cache#max.count}'] = me['@{~cache#buffer.count}'] + (max || 50);
    //me['@{~cache#remove.callback}'] = remove;
}

Assign(MxCache[Prototype], {
    get(key) {
        let me = this;
        let c = me['@{~cache#list}'];
        let r = c[Spliter + key];
        if (r) {
            r['@{~cache-item#fre}']++;
            //r['@{~cache-item#add.time}'] = CacheCounter++;
            r = r['@{~cache-item#entity}'];
        }
        return r;
    },
    set(okey, value) {
        let me = this;
        let c = me['@{~cache#list}'];
        let key = Spliter + okey;
        let r = c[key];
        let t = me['@{~cache#buffer.count}'];
        if (!r) {
            if (c.length > me['@{~cache#max.count}']) {
                c.sort(CacheSort);
                while (t--) {
                    r = c.pop();
                    if (r['@{~cache-item#fre}']) {//important
                        me.del(r['@{~cache-item#origin.key}']); //如果没有引用，则删除
                    }
                }
            }
            r = {
                '@{~cache-item#origin.key}': okey
            };
            c.push(r);
            c[key] = r;
        }
        r['@{~cache-item#entity}'] = value;
        r['@{~cache-item#fre}'] = 1;
        //r['@{~cache-item#add.time}'] = CacheCounter++;
    },
    del(k) {
        k = Spliter + k;
        let c = this['@{~cache#list}'];
        let r = c[k]/*,
            m = this['@{~cache#remove.callback}']*/;
        if (r) {
            r['@{~cache-item#fre}'] = 0;
            r['@{~cache-item#entity}'] = Empty;
            delete c[k];// = Null;
            //if (m) {
            //ToTry(m, r['@{~cache-item#origin.key}']);
            //}
        }
    },
    has(k) {
        return Has(this['@{~cache#list}'], Spliter + k);
    }
});