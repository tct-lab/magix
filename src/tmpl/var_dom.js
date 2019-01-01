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
let AddEventListener = (element, type, fn, viewId, eventOptions, view) => {
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
    element.addEventListener(type, h['@{~dom#event.proxy}'], eventOptions);
};
let RemoveEventListener = (element, type, cb, viewId, eventOptions) => {
    for (let c, i = AttachEventHandlers.length; i--;) {
        c = AttachEventHandlers[i];
        if (c['@{~dom#type}'] == type &&
            c['@{~dom#view.id}'] == viewId &&
            c['@{~dom#element}'] == element &&
            c['@{~dom#real.fn}'] === cb) {
            AttachEventHandlers.splice(i, 1);
            element.removeEventListener(type, c['@{~dom#event.proxy}'], eventOptions);
            break;
        }
    }
};