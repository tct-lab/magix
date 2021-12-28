let Magix_Booted = 0;
/*#if(modules.taskComplete){#*/
let TaskCompleteCheck = (schedule, callback) => {
    let taskCount = 0,
        taskCheck = (...args) => {
            if (!(--taskCount)) {
                callback(...args);
            }
        };
    return (...args) => {
        taskCount++;
        schedule(taskCheck, [...args]);
    };
};
/*#}#*/
let Magix = {
    version: '/*#=modules.__version#*/',
    config(cfg, ...args) {
        let r = Mx_Cfg;
        if (cfg) {
            if (IsObject(cfg)) {
                r = Assign(r, cfg, ...args);
            } else {
                r = r[cfg];
            }
        }
        return r;
    },
    boot(cfg) {
        if (!Magix_Booted) {
            Magix_Booted = 1;
            Assign(Mx_Cfg, cfg); //先放到配置信息中，供ini文件中使用
            /*#if(modules.router){#*/
            Router_Init_PNR();
            /*#if(modules.mxevent){#*/
            Router.on(Changed, Dispatcher_NotifyChange);
            /*#}#*/
            Router_Bind();
            /*#}else{#*/
            Vframe_mountView(Vframe_Root(), Mx_Cfg.defaultView);
            /*#}#*/
        }
    },
    unboot() {
        if (Magix_Booted) {
            Magix_Booted = 0;
            /*#if(modules.router){#*/
            /*#if(modules.mxevent){#*/
            Router.off(Changed, Dispatcher_NotifyChange);
            /*#}#*/
            Router_Unbind();
            /*#}#*/
            Vframe_Unroot();
        }
    },
    HIGH: Thousand,
    LOW: -Thousand,
    /*#if(modules.lang){#*/
    isObject: IsObject,
    isArray: IsArray,
    isFunction: IsFunction,
    isString: IsString,
    isNumber: IsNumber,
    isPrimitive: IsPrimitive,
    /*#}#*/
    /*#if(modules.waitSelector){#*/
    waitSelector(selector, timeout, context) {
        context = context || document;
        timeout = timeout || 30 * Thousand;
        let target, check, failed, timer = Timeout(() => failed = 1, timeout);
        return new GPromise((resolve, reject) => {
            check = () => {
                target = context.querySelector(selector);
                if (target) {
                    ClearTimeout(timer);
                    resolve(target);
                } else if (failed) {
                    reject();
                } else {
                    Timeout(check, CallBreakTime);
                }
            };
            Timeout(check, CallBreakTime);
        });
    },
    /*#}#*/
    attach: EventListen,
    detach: EventUnlisten,
    /*#if(modules.batchDOMEvent){#*/
    attachAll(targets, ...args) {
        for (let t of targets) {
            EventListen(t, ...args);
        }
    },
    detachAll(targets, ...args) {
        for (let t of targets) {
            EventUnlisten(t, ...args);
        }
    },
    /*#}#*/
    mix: Assign,
    toMap: ToMap,
    toTry: ToTry,
    toUrl: ToUri,
    parseUrl: ParseUri,
    guid: GUID,
    use: Async_Require,
    dispatch: DispatchEvent,
    guard: Safeguard,
    type: Type,
    has: Has,
    inside: NodeIn,
    applyStyle: ApplyStyle,
    Cache: MxCache,
    View,
    Vframe,
    /*#if(modules.state){#*/
    State,
    /*#}#*/
    /*#if(modules.service){#*/
    Service,
    /*#}#*/
    /*#if(modules.mxevent){#*/
    Event: MxEvent,
    /*#}#*/
    /*#if(modules.router){#*/
    Router,
    /*#}#*/
    mark: Mark,
    unmark: Unmark,
    node: GetById,
    task: CallFunction,
    lowTask: LastCallFunction,
    /*#if(modules.taskIdle){#*/
    taskIdle: Call_Idle_Until,
    /*#}#*/
    taskFinale() {
        return new GPromise(CallFunction);
    },
    lowTaskFinale() {
        return new GPromise(LastCallFunction);
    },
    delay(time) {
        return new GPromise(r => Timeout(r, time));
    },
    /*#if(modules.taskCancel){#*/
    taskCancel: CallCancel,
    /*#}#*/
    /*#if(modules.taskComplete){#*/
    /**
     * let checkIfReady=Matix.taskComplete((a,b,c)=>{
     *  console.log(a,b,c);
     * });
     * let process=index=>console.log(index);
     * for(let i=0;i<10;i++){
     *  Magix.task(process,[index]);
     *  checkIfReady(a,b,c);
     * }
     */
    taskComplete(callback) {
        return TaskCompleteCheck(CallFunction, callback);
    },
    lowTaskComplete(callback) {
        return TaskCompleteCheck(LastCallFunction, callback);
    }
    /*#}#*/
};