/*#if(modules.service){#*/
/*
    一个请求send后，应该取消吗？
    参见xmlhttprequest的实现
        https://chromium.googlesource.com/chromium/blink/+/master/Source/core
        https://chromium.googlesource.com/chromium/blink/+/master/Source/core/xmlhttprequest/XMLHttpService.cpp
    当请求发出，服务器接受到之前取消才有用，否则连接已经建立，数据开始传递，中止只会浪费。
    但我们很难在合适的时间点abort，而且像jsonp的，我们根本无法abort掉，只能任数据返回

    然后我们在自已的代码中再去判断、决定回调是否调用

    那我们是否可以这样做：
        1. 不取消请求
        2. 请求返回后尽可能的处理保留数据，比如缓存。处理完成后才去决定是否调用回调（Service_Send中的Done实现）

    除此之外，我们还要考虑
        1. 跨请求对象对同一个缓存的接口进行请求，而某一个销毁了。
            Service.add([{
                name:'Test',
                url:'/test',
                cache:20000
            }]);

            let r1=new Service();
            r1.all('Test',function(e,m){

            });

            let r2=new Service();
            r2.all('Test',function(e,m){

            });

            r1.destroy();

            如上代码，我们在实现时：
            r2在请求Test时，此时Test是可缓存的，并且Test已经处于r1请求中了，我们不应该再次发起新的请求，只需要把回调排队到r1的Test请求中即可。参见代码：Service_Send中的for,Service.cached。

            当r1进行销毁时，并不能贸然销毁r1上的所有请求，如Test请求不能销毁，只能从回调中标识r1的回调不能再被调用。r1的Test还要继续，参考上面讨论的请求应该取消吗。就算能取消，也需要查看Test的请求中，除了r1外是否还有别的请求要用，我们示例中是r2，所以仍然继续请求。参考Service#.destroy


 */
function Bag() {
    this.id = GUID('b');
    this['@{~bag#attrs}'] = {};
}
Assign(Bag[Prototype], {
    get(key, dValue) {
        let me = this;
        //let alen = arguments.length;
        /*
            目前只处理了key中不包含.的情况，如果key中包含.则下面的简单的通过split('.')的方案就不行了，需要改为：

            let reg=/[^\[\]]+(?=\])|[^.\[\]]+/g;
            let a=['a.b.c','a[b.c].d','a[0][2].e','a[b.c.d][eg].a.b.c','[e.g.d]','a.b[c.d.fff]'];

            for(let i=0,one;i<a.length;i++){
              one=a[i];
              console.log(one.match(reg))
            }

            但考虑到key中有.的情况非常少，则优先使用性能较高的方案

            或者key本身就是数组
         */
        let attrs = me['@{~bag#attrs}'];
        if (key) {
            let tks = IsArray(key) ? key.slice() : (key + Empty).split('.'),
                tk;
            while ((tk = tks.shift()) && attrs) {
                attrs = attrs[tk];
            }
            if (tk) {
                attrs = Undefined;
            }
        }
        let type;
        if (dValue !== Undefined && (type = Type(dValue)) != Type(attrs)) {
            if (DEBUG) {
                console.warn('type neq:' + key + ' is not a(n) ' + type);
            }
            attrs = dValue;
        }
        if (DEBUG && me['@{~bag#meta.info}'] && me['@{~bag#meta.info}']['@{~meta#cache.key}']) { //缓存中的接口不让修改数据
            attrs = Safeguard(attrs);
        }
        return attrs;
    },
    set(key, val) {
        if (!IsObject(key)) {
            key = { [key]: val };
        }
        Assign(this['@{~bag#attrs}'], key);
    }
});
let Service_FetchFlags_ONE = 1;
let Service_FetchFlags_ALL = 2;
let Service_Cache_Done = (bagCacheKeys, cacheKey, fns?) => error => {
    fns = bagCacheKeys[cacheKey];
    if (fns) {
        delete bagCacheKeys[cacheKey]; //先删除掉信息
        ToTry(fns, error, fns['@{~service-cache-list#entity}']); //执行所有的回调
    }
};
// function Service_CacheDone(cacheKey, err, fns) {
//     fns = this[cacheKey]; //取出当前的缓存信息
//     if (fns) {
//         delete this[cacheKey]; //先删除掉信息
//         ToTry(fns, err, fns['@{~service-cache-list#entity}']); //执行所有的回调
//     }
// }
let Service_Task = (done, host, service, total, flag, bagCache) => {
    let doneArr = [];
    let errorArgs = Null;
    let currentDoneCount = 0;

    return (bag, idx, error) => {
        currentDoneCount++; //当前完成加1.
        let newBag;
        let mm = bag['@{~bag#meta.info}'];
        let cacheKey = mm['@{~meta#cache.key}'], temp;
        doneArr[idx + 1] = bag; //完成的bag
        if (error) { //出错
            errorArgs = error;
            //errorArgs[idx] = err; //记录相应下标的错误信息
            //Assign(errorArgs, err);
            newBag = 1; //标记当前是一个新完成的bag,尽管出错了
        } else if (!bagCache.has(cacheKey)) { //如果缓存对象中不存在，则处理。注意在开始请求时，缓存与非缓存的都会调用当前函数，所以需要在该函数内部做判断处理
            if (cacheKey) { //需要缓存
                bagCache.set(cacheKey, bag); //缓存
            }
            //bag.set(data);
            mm['@{~meta#cache.time}'] = Date_Now(); //记录当前完成的时间
            temp = mm['@{~meta#after}'];
            if (temp) { //有after
                ToTry(temp, bag, bag);
            }
            newBag = 1;
        }
        if (!service['@{~service#destroyed}']) { //service['@{~service#destroyed}'] 当前请求被销毁
            let finish = currentDoneCount == total;
            if (finish) {
                service['@{~service#busy}'] = 0;
                if (flag == Service_FetchFlags_ALL) { //all
                    doneArr[0] = errorArgs;
                    ToTry(done, doneArr, service);
                }
            }
            if (flag == Service_FetchFlags_ONE) { //如果是其中一个成功，则每次成功回调一次
                ToTry(done, [error || Null, bag, finish, idx], service);
            }
        }
        if (newBag) { //不管当前request或回调是否销毁，均派发end事件，就像前面缓存一样，尽量让请求处理完成，该缓存的缓存，该派发事件派发事件。
            /*#if(modules.mxevent){#*/
            host.fire('end', {
                bag,
                error
            });
            /*#}#*/
        }
    };
};
let Service_Send = (me, attrs, done, flag, save?) => {
    if (me['@{~service#destroyed}']) return me; //如果已销毁，返回
    if (me['@{~service#busy}']) { //繁忙，后续请求入队
        return me.enqueue(Service_Send.bind(me, me, attrs, done, flag, save));
    }
    me['@{~service#busy}'] = 1; //标志繁忙
    if (!IsArray(attrs)) {
        attrs = [attrs];
    }
    let host = me.constructor,
        requestCount = 0;
    //let bagCache = host['@{~service#cache}']; //存放bag的Cache对象
    let bagCacheKeys = host['@{~service#request.keys}']; //可缓存的bag key
    let removeComplete = Service_Task(done, host, me, attrs.length, flag, host['@{~service#cache}']);
    for (let bag of attrs) {
        if (bag) {
            let [bagEntity, update] = host.get(bag, save); //获取bag信息
            let cacheKey = bagEntity['@{~bag#meta.info}']['@{~meta#cache.key}']; //从实体上获取缓存key

            let complete = removeComplete.bind(bagEntity, bagEntity, requestCount++);
            let cacheList;

            if (cacheKey && bagCacheKeys[cacheKey]) { //如果需要缓存，并且请求已发出
                bagCacheKeys[cacheKey].push(complete); //放到队列中
            } else if (update) { //需要更新
                if (cacheKey) { //需要缓存
                    cacheList = [complete];
                    cacheList['@{~service-cache-list#entity}'] = bagEntity;
                    bagCacheKeys[cacheKey] = cacheList;
                    complete = Service_Cache_Done(bagCacheKeys, cacheKey); //替换回调，详见Service_CacheDone
                }
                host['@{~service#send}'](bagEntity, complete);
            } else { //不需要更新时，直接回调
                complete();
            }
        }
    }
    return me;
};

function Service() {
    let me = this;
    me.id = GUID('s');
    me['@{~service#list}'] = [];
}

Assign(Service[Prototype], {
    all(attrs, done) {
        return Service_Send(this, attrs, done, Service_FetchFlags_ALL);
    },
    save(attrs, done) {
        return Service_Send(this, attrs, done, Service_FetchFlags_ALL, 1);
    },
    one(attrs, done) {
        return Service_Send(this, attrs, done, Service_FetchFlags_ONE);
    },
    enqueue(callback) {
        let me = this;
        if (!me['@{~service#destroyed}']) {
            me['@{~service#list}'].push(callback);
            me.dequeue(me['@{~service#last.arguments}']);
        }
        return me;
    },
    dequeue(...a) {
        let me = this,
            one;
        if (!me['@{~service#busy}'] && !me['@{~service#destroyed}']) {
            me['@{~service#busy}'] = 1;
            Timeout(() => { //前面的任务可能从缓存中来，执行很快
                me['@{~service#busy}'] = 0;
                if (!me['@{~service#destroyed}']) { //不清除setTimeout,但在回调中识别是否调用了destroy方法
                    one = me['@{~service#list}'].shift();
                    if (one) {
                        ToTry(one, me['@{~service#last.arguments}'] = a);
                    }
                }
            });
        }
    },
    destroy(me) {
        me = this;
        me['@{~service#destroyed}'] = 1; //只需要标记及清理即可，其它的不需要
        me['@{~service#list}'] = 0;
    }
});

let Manager_DefaultCacheKey = (meta, attrs, arr?) => {
    arr = [JSON_Stringify(attrs), JSON_Stringify(meta)];
    return arr.join(Spliter);
};
let Service_Manager = Assign({
    add(attrs) {
        let me = this;
        let metas = me['@{~service#metas}'],
            bag;
        if (!IsArray(attrs)) {
            attrs = [attrs];
        }
        for (bag of attrs) {
            if (bag) {
                let { name, cache } = bag;
                bag.cache = cache | 0;
                if (DEBUG && Has(metas, name)) {
                    throw new Error('service already exists:' + name);
                }
                metas[name] = bag;
            }
        }
    },
    create(attrs) {
        let me = this;
        let meta = me.meta(attrs);
        let cache = (attrs.cache | 0) || meta.cache;
        let entity = new Bag();
        entity.set(meta);
        entity['@{~bag#meta.info}'] = {
            '@{~meta#after}': meta.after,
            '@{~meta#cache.key}': cache && Manager_DefaultCacheKey(meta, attrs)
        };

        if (IsObject(attrs)) {
            entity.set(attrs);
        }
        let before = meta.before;
        if (before) {
            ToTry(before, entity, entity);
        }
        /*#if(modules.mxevent){#*/
        me.fire('begin', {
            bag: entity
        });
        /*#}#*/
        return entity;
    },
    meta(attrs) {
        let me = this;
        let metas = me['@{~service#metas}'];
        let name = attrs.name || attrs;
        let ma = metas[name];
        return ma || attrs;
    },
    get(attrs, createNew) {
        let me = this;
        let e, u;
        if (!createNew) {
            e = me.cached(attrs);
        }

        if (!e) {
            e = me.create(attrs);
            u = 1;
        }
        return [e, u];
    },
    cached(attrs) {
        let me = this;
        let bagCache = me['@{~service#cache}'];
        let entity;
        let cacheKey;
        let meta = me.meta(attrs);
        let cache = (attrs.cache | 0) || meta.cache;

        if (cache) {
            cacheKey = Manager_DefaultCacheKey(meta, attrs);
        }

        if (cacheKey) {
            let requestCacheKeys = me['@{~service#request.keys}'];
            let info = requestCacheKeys[cacheKey];
            if (info) { //处于请求队列中的
                entity = info['@{~service-cache-list#entity}'];
            } else { //缓存
                entity = bagCache.get(cacheKey);
                if (entity && Date_Now() - entity['@{~bag#meta.info}']['@{~meta#cache.time}'] > cache) {
                    bagCache.del(cacheKey);
                    entity = 0;
                }
            }
        }
        return entity;
    }
}/*#if(modules.mxevent){#*/, MxEvent/*#}#*/);
Service.extend = (sync, cacheMax, cacheBuffer) => {
    function NService() {
        Service.call(this);
    }
    NService['@{~service#send}'] = sync;
    NService['@{~service#cache}'] = new MxCache(cacheMax, cacheBuffer);
    NService['@{~service#request.keys}'] = {};
    NService['@{~service#metas}'] = {};
    return Extend(NService, Service, Null, Service_Manager);
};
/*#}#*/