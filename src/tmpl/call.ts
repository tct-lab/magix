let CallIndex = 0;
let CallList = [];
let CallBreakTime = 32;
let StartCall = () => {
    let last = Date_Now(),
        next;
    while (1) {
        next = CallList[CallIndex - 1];
        if (next) {
            next.apply(CallList[CallIndex], CallList[CallIndex + 1]);
            CallIndex += 3;
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
let CallFunction = (fn, args?, context?) => {
    CallList.push(fn, context, args);
    if (!CallIndex) {
        CallIndex = 1;
        Timeout(StartCall);
    }
};