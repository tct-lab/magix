let EventDefaultOptions = {
    bubbles: true,
    cancelable: true
};
//https://www.w3.org/TR/dom/#interface-event
let DispatchEvent = (element, type, data) => {
    let e = new Event(type, EventDefaultOptions);
    Assign(e, data);
    element.dispatchEvent(e);
};
let AttachEventHandlers = [];
let EventListen = (element, ...args) => element.addEventListener(...args);
let EventUnlisten = (element, ...args) => element.removeEventListener(...args);
let AddEventListener = (element, type, fn, eventOptions?, viewId?, view?) => {
    let h = {
        '@{~dom#view.id}': viewId,
        '@{~dom#real.fn}': fn,
        '@{~dom#type}': type,
        '@{~dom#element}': element,
        '@{~dom#event.proxy}'(e) {
            if (viewId) {
                ToTry(fn, e, view);
            } else {
                fn(e);
            }
        }
    };
    AttachEventHandlers.push(h);
    EventListen(element, type, h['@{~dom#event.proxy}'], eventOptions);
};
let RemoveEventListener = (element, type, cb, eventOptions?, viewId?) => {
    for (let c, i = AttachEventHandlers.length; i--;) {
        c = AttachEventHandlers[i];
        if (c['@{~dom#type}'] == type &&
            c['@{~dom#view.id}'] == viewId &&
            c['@{~dom#element}'] == element &&
            c['@{~dom#real.fn}'] == cb) {
            AttachEventHandlers.splice(i, 1);
            EventUnlisten(element, type, c['@{~dom#event.proxy}'], eventOptions);
            break;
        }
    }
};