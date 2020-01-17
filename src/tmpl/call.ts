let CallIndex = 0;
let CallList = [];
let CallBreakTime = 32;
let StartCall = () => {
    let last = Date_Now(),
        next, args, context;
    try {
        while (CallBreakTime) {
            next = CallList[CallIndex - 1];
            context = CallList[CallIndex];
            args = CallList[CallIndex + 1];
            CallIndex += 4;
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
                    Timeout(StartCall);
                    console.log(`[CF] take a break of ${CallList.length} at ${CallIndex}`);
                    break;
                }
            } else {
                CallList.length = CallIndex = 0;
                break;
            }
        }
    } catch (ex) {
        Mx_Cfg.error(ex);
        Timeout(StartCall);
    }
};
let CallFunction = (fn, args?, context?, id?) => {
    if (!CallIndex) {
        CallIndex = 1;
        Timeout(StartCall);
    }
    if (id) {
        for (let i = CallList.length - 1; i >= CallIndex; i -= 4) {
            if (CallList[i] == id) {
                CallList[i - 3] = Noop;
                console.log('ignore id', id);
            }
        }
    }
    CallList.push(fn, context, args, id);
};