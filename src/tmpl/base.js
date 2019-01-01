Assign(Noop[Prototype], MxEvent);
Noop.extend = function extend(props, statics) {
    let me = this;
    let ctor = props && props.ctor;
    function X(...a) {
        let t = this;
        me.apply(t, a);
        if (ctor) ctor.apply(t, a);
    }
    X.extend = extend;
    return Extend(X, me, props, statics);
};