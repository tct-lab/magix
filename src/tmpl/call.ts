let CallBreakTime = 9,
    CallWorked,
    CallCurrent,
    CallCurrentExec,
    CallLogicTail,
    CallRealTail;
/*#if(modules.wait){#*/
let lastWaitState;
/*#}#*/
interface Navigator {
    scheduling?: {
        isInputPending(): boolean
    }
}
let ns = navigator.scheduling;
let StartCall = () => {
    let last = Date_Now(),
        out = last + CallBreakTime,
        args, fn, context/*#if(modules.wait){#*/,
        wait = Mx_Cfg.retard/*#}#*/;
    for (; ;) {
        if (CallCurrent) {//有待执行的任务
            if (DEBUG) {
                CallFunction['@{~call.fn#current}']++;
            }
            if (CallLogicTail == CallCurrent) {//如果当前节点是逻辑末尾，则删除逻辑末尾
                CallLogicTail = Null;
            }
            CallCurrentExec = CallCurrent;//当前正在执行的任务，先保存一下，有可能在fn中再追加新的任务，需要使用该节点进行调整关系
            context = CallCurrent['@{~call#context}'];
            args = CallCurrent['@{~call#args}'];
            fn = CallCurrent['@{~call#function}'];
            if (fn) {
                ToTry(fn, args, context);
            }
            CallCurrent = CallCurrent['@{~call#next}'];
            CallCurrentExec = Null;//clear current;
            if (CallCurrent && ((Date_Now() > out) ||
                (ns && ns.isInputPending()))) {
                /*#if(modules.wait){#*/
                if (lastWaitState != 1) {
                    wait(lastWaitState = 1);
                }
                /*#}#*/
                console.log(`CF take a break at ${CallFunction['@{~call.fn#current}']} of ${CallFunction['@{~call.fn#total}']}`);
                Timeout(StartCall);
                break;
            }
        } else {
            CallRealTail = CallWorked = Null;
            if (DEBUG) {
                delete CallFunction['@{~call.fn#total}'];
                delete CallFunction['@{~call.fn#current}'];
            }
            /*#if(modules.wait){#*/
            if (lastWaitState != 0) {
                wait(lastWaitState = 0);
            }
            /*#}#*/
            /*#if(modules.taskIdle){#*/
            Call_Until_Start();
            /*#}#*/
            break;
        }
    }
};
let CallFunction = (fn, args?, context?, /*#if(modules.taskCancel){#*/ id?, /*#}#*/ last?, current?) => {
    /*#if(modules.taskIdle){#*/
    Call_Until_Stop();
    /*#}#*/
    if (DEBUG) {
        if (!CallFunction['@{~call.fn#total}']) {
            CallFunction['@{~call.fn#total}'] = 0;
            CallFunction['@{~call.fn#current}'] = 0;
        }
        CallFunction['@{~call.fn#total}']++;
    }
    current = {
       /*#if(modules.taskCancel){#*/ '@{~call#id}': id,/*#}#*/
        '@{~call#function}': fn,
        '@{~call#context}': context,
        '@{~call#args}': args
    };
    if (last) {//指明放在真正的末尾
        if (CallRealTail) {//如果有，则直接追加
            CallRealTail['@{~call#next}'] = current;
        } else {//没有，则把当前待执行的头指定当前元素
            CallCurrent = current;
        }
        CallRealTail = current;//更新末尾
    } else {//需要放逻辑末尾
        last = CallLogicTail || CallCurrentExec;//合并统一判断
        //不存在逻辑末尾，但当前正在执行中，1种情况：执行已过逻辑末尾，此时需要把执行节点的下一个指向当前节点，以提高优先级
        if (last) {//有节点则更新
            //prev = last['@{~call#next}'];
            current['@{~call#next}'] = last['@{~call#next}'];
            last['@{~call#next}'] = current;
            if (CallRealTail == last) {//如果逻辑末尾或当前执行的与真实是同一个节点，则真实末尾节点需要移动
                CallRealTail = current;
            }
        } else if (CallCurrent) {//即不存在逻辑末尾，也不在执行中，比如先调用lastTask，再调用普通的task，则需要把普通的任务放在最前面
            current['@{~call#next}'] = CallCurrent;
            CallCurrent = current;
        } else {//初始化的情况
            CallCurrent = CallRealTail = current;
        }
        CallLogicTail = current;//更新逻辑末尾为当前节点
    }
    if (!CallWorked) {
        CallWorked = 1;
        Timeout(StartCall);
    }
};

let LastCallFunction = (fn, args?, context?/*#if(modules.taskCancel){#*/, id?/*#}#*/) => {
    CallFunction(fn, args, context/*#if(modules.taskCancel){#*/, id/*#}#*/, 1);
};
/*#if(modules.taskCancel){#*/
let CallCancel = id => {
    if (id &&
        CallCurrent) {
        let current = CallCurrent['@{~call#next}'];
        while (current) {
            if (current['@{~call#id}'] == id) {
                current['@{~call#function}'] =
                    current['@{~call#context}'] =
                    current['@{~call#args}'] =
                    current['@{~call#id}'] = Null;
            }
            current = current['@{~call#next}'];
        }
    }
};
/*#}#*/