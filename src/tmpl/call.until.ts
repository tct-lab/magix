let Call_Until_Timer,
    Call_Until_Last_Time;
let Call_Until_Head,
    Call_Until_Tail,
    Call_Until_Delay = 32;
let Call_Until_Work = () => {
    let current = Call_Until_Head,
        prev;
    let diff = Date_Now() - Call_Until_Last_Time;
    while (current) {
        if (diff >= current['@{~cu#wait.time}']) {
            Timeout(current['@{~cu#resolve}']);
            if (prev) {
                prev['@{~cu#next}'] = current['@{~cu#next}'];
            } else {
                Call_Until_Head = current['@{~cu#next}'];
            }
        }
        prev = current;
        current = current['@{~cu#next}'];
    }
    if (Call_Until_Head) {
        Call_Until_Timer = Timeout(Call_Until_Work, Call_Until_Delay);
    } else {
        Call_Until_Tail = 0;
        Call_Until_Timer = 0;
    }
};
let Call_Until_Start = () => {
    if (!Call_Until_Timer) {
        Call_Until_Last_Time = Date_Now();
        Call_Until_Timer = Timeout(Call_Until_Work, Call_Until_Delay);
    }
};
let Call_Until_Stop = () => {
    if (Call_Until_Timer) {
        ClearTimeout(Call_Until_Timer);
        Call_Until_Timer = 0;
    }
};

let Call_Idle_Until = time => {
    return new GPromise(r => {
        let node = {
            '@{~cu#wait.time}': time,
            '@{~cu#resolve}': r
        };
        if (!Call_Until_Tail) {
            Call_Until_Head = node;
        } else {
            Call_Until_Tail['@{~cu#next}'] = node;
        }
        Call_Until_Tail = node;
        if (!CallRealTail) {
            Call_Until_Start();
        }
    });
};