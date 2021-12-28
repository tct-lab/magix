let Extend = (ctor, base, props?, cProto?: any) => {
    //bProto.constructor = base;
    Noop[Prototype] = base[Prototype];
    cProto = new Noop();
    Assign(cProto, props);
    //Assign(ctor, statics);
    cProto.constructor = ctor;
    ctor[Prototype] = cProto;
    return ctor;
};