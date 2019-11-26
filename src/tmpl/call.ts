let CallIndex = 0;
let CallList = [];
let CallBreakTime = 32;
let StartCall = () => {
    let last = Date_Now(),
        next;
    while (CallBreakTime) {
        next = CallList[CallIndex - 1];
        if (next) {
            if (next !== Null) {
                //ToTry(next, CallList[CallIndex + 1], CallList[CallIndex]);
                next.apply(CallList[CallIndex], CallList[CallIndex + 1]);
            }
            CallIndex += 4;
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
};
let CallFunction = (fn, args?, context?, id?) => {
    if (!CallIndex) {
        CallIndex = 1;
        Timeout(StartCall);
    }
    if (id) {
        for (let i = CallIndex; i < CallList.length; i += 4) {
            if (CallList[i + 2] == id) {
                CallList[i - 1] = Null;
                console.log('ignore id', id);
            }
        }
    }
    CallList.push(fn, context, args, id);
};

let SafeCallFunction = (fn, args?, context?, id?) => {
    CallFunction(ToTry, [fn, args, context], Null, id);
};