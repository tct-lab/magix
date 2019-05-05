let CacheSort = (a, b) => b['@{~cache-item#fre}'] - a['@{~cache-item#fre}'] || b['@{~cache-item#add.time}'] - a['@{~cache-item#add.time}'];
function MxCache(max?: number, buffer?: number, remove?: (item: any) => void, me?: any) {
    me = this;
    me['@{~cache#list}'] = [];
    me['@{~cache#buffer.count}'] = buffer || 5; //buffer先取整，如果为0则再默认5
    me['@{~cache#max.count}'] = me['@{~cache#buffer.count}'] + (max || 20);
    me['@{~cache#remove.callback}'] = remove;
}

Assign(MxCache[Prototype], {
    get(key) {
        let me = this;
        let c = me['@{~cache#list}'];
        let r = c[Spliter + key];
        if (r) {
            r['@{~cache-item#fre}']++;
            r['@{~cache-item#add.time}'] = Counter++;
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
            if (c.length >= me['@{~cache#max.count}']) {
                c.sort(CacheSort);
                while (t--) {
                    r = c.pop();
                    //为什么要判断r['@{~cache-item#fre}']>0,考虑这样的情况：用户设置a,b，主动删除了a,重新设置a,数组中的a原来指向的对象残留在列表里，当排序删除时，如果不判断则会把新设置的删除，因为key都是a
                    //
                    if (r['@{~cache-item#fre}'] > 0) me.del(r.o); //如果没有引用，则删除
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
        r['@{~cache-item#add.time}'] = Counter++;
    },
    del(k) {
        k = Spliter + k;
        let c = this['@{~cache#list}'];
        let r = c[k],
            m = this['@{~cache#remove.callback}'];
        if (r) {
            r['@{~cache-item#fre}'] = -1;
            r['@{~cache-item#entity}'] = Empty;
            delete c[k];
            if (m) {
                ToTry(m, r['@{~cache-item#origin.key}']);
            }
        }
    },
    has(k) {
        return Has(this['@{~cache#list}'], Spliter + k);
    }
});