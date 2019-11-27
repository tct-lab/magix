## API变更
### updater与view合并
原`updater`上的方法合并到`view`上，如
```js
render(){
    this.updater.digest();
}
```
变更为
```js
render(){
    this.digest();
}
```
> updater上的get,set,digest等均直接合并到view上

### vframe相关
> 由于原来设计的vframe与节点id关联，该方案在dom diff情况下并不健全，所以重新设计了vframe与dom节点的关系，故原来与vframe相关的api需要变化

#### 获取vframe
删除了`Magix.Vframe.get(id)`方法，由`Magix.Vframe.byId(id)`替代，同时提供了`Magix.Vframe.byNode(node)`可根据dom节点对象获取对应的`vframe`。新增`Magix.Vframe.root()`方便获取整个应用的根`vframe`

#### vframe对像上的方法

原来的`mountVframe`,`mountZone`,`unmountVframe`,`unmountZone`第一个参数由`dom`节点`id`变更为`dom`节点对象。

### view默认带assign方法
继承`view`后，需要重写`assign`方法，默认`assign`返回`false`，如果不重写，可能导致`view`不更新。该变更主要是减少之前无`assign`方法时，先销毁`view`再重建这个笨重的过程

`view`增加当前所在的根节点`root`属性

### 向view传参变更
统一使用新的写法
<mx-vframe src="path/to/view" *name="{{=name}}" *id="{{@id}}"/>

## 模板语法变更

[点击查看模板语法](https://github.com/thx/magix-composer/issues/1)
