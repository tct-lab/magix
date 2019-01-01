let CacheSort = (a, b) => b['@{~cache-item#fre}'] - a['@{~cache-item#fre}'] || b['@{~cache-item#add.time}'] - a['@{~cache-item#add.time}'];
/**
 * Magix.Cache 类
 * @name Cache
 * @constructor
 * @param {Integer} [max] 缓存最大值，默认20
 * @param {Integer} [buffer] 缓冲区大小，默认5
 * @param {Function} [remove] 当缓存的元素被删除时调用
 * @example
 * let c = new Magix.cache(5,2);//创建一个可缓存5个，且缓存区为2个的缓存对象
 * c.set('key1',{});//缓存
 * c.get('key1');//获取
 * c.del('key1');//删除
 * c.has('key1');//判断
 * //注意：缓存通常配合其它方法使用，在Magix中，对路径的解析等使用了缓存。在使用缓存优化性能时，可以达到节省CPU和内存的双赢效果
 */
function Cache(max, buffer, remove, me) {
    me = this;
    me['@{~cache#list}'] = [];
    me['@{~cache#buffer.count}'] = buffer || 5; //buffer先取整，如果为0则再默认5
    me['@{~cache#max.count}'] = me['@{~cache#buffer.count}'] + (max || 20);
    me['@{~cache#remove.callback}'] = remove;
}

Assign(Cache[Prototype], {
    /**
     * @lends Cache#
     */
    /**
     * 获取缓存的值
     * @param  {String} key
     * @return {Object} 初始设置的缓存对象
     */
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
    /**
     * 设置缓存
     * @param {String} key 缓存的key
     * @param {Object} value 缓存的对象
     */
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
    /**
     * 删除缓存
     * @param  {String} key 缓存key
     */
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
    /**
     * 检测缓存中是否有给定的key
     * @param  {String} key 缓存key
     * @return {Boolean}
     */
    has(k) {
        return Has(this['@{~cache#list}'], Spliter + k);
    }
});