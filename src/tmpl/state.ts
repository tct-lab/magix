/*#if(modules.state){#*/
let State_Data = {};
let State = Assign({
    get(key) {
        return key ? State_Data[key] : State_Data;
    },
    /**
     * 设置数据
     * @param {Object} data 数据对象
     */
    set(data) {
        Assign(State_Data, data);
    }
}/*#if(modules.mxevent){#*/, MxEvent/*#}#*/);
/*#}#*/