let CallIndex = 0;
let CallList = [];
let LastCallList = [];
let CallBreakTime = 12;
let StartCall = () => {
    let last = Date_Now(),
        next, args, context/*#if(modules.wait){#*/,
        wait = Mx_Cfg.retard/*#}#*/;
    try {
        while (CallBreakTime) {
            next = CallList[CallIndex];
            context = CallList[CallIndex - 1];
            args = CallList[CallIndex + 1];
            CallList[CallIndex] = Null;
            CallList[CallIndex - 1] = Null;
            CallList[CallIndex + 1] = Null;
            CallList[CallIndex + 2] = Null;
            CallIndex += 4;
            if (CallIndex > Thousand) {
                CallList.splice(0, CallIndex - 1);
                CallIndex = 1;
            }
            if (next) {
                if (next != Noop) {
                    if (IsArray(args)) {
                        next.apply(context, args);
                    } else {
                        next.call(context, args);
                    }
                }
                if (Date_Now() - last > CallBreakTime &&
                    CallList.length > CallIndex) {
                    /*#if(modules.wait){#*/
                    wait(1);
                    /*#}#*/
                    Timeout(StartCall);
                    console.log(`[CF] take a break of ${CallList.length} at ${CallIndex}`);
                    break;
                }
            } else {
                if (LastCallList.length) {
                    CallList.push(...LastCallList);
                    LastCallList.length = 0;
                } else {
                    /*#if(modules.wait){#*/
                    wait(0);
                    /*#}#*/
                    CallList.length = CallIndex = 0;
                    break;
                }
            }
        }
    } catch (ex) {
        Mx_Cfg.error(ex);
        Timeout(StartCall);
    }
};
let CallFunction = (fn, args?, context?, id?, last?) => {
    last = last ? LastCallList : CallList;
    if (id) {
        for (let i = last.length - 1; i >= CallIndex; i -= 4) {
            if (last[i] == id) {
                last[i - 3] = Null;
                last[i - 2] = Noop;
                last[i - 1] = Null;
                last[i] = Null;
                console.log('ignore id', id);
            }
        }
    }
    last.push(context, fn, args, id);
    if (!CallIndex) {
        CallIndex = 1;
        Timeout(StartCall);
    }
};

let LastCallFunction = (fn, args?, context?, id?) => {
    CallFunction(fn, args, context, id, 1);
};