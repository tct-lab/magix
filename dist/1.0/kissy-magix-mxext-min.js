KISSY.add("magix/body",function(h,f,r){var p=f.has,j=f.listToMap("submit,focusin,focusout,mouseenter,mouseleave,mousewheel,change"),c=document.body,e={},i={},l=65536,m=function(b,a,d){d?b.setAttribute(a,d):d=b.getAttribute(a);return d},k,n={process:function(b){for(var a=b.target||b.srcElement;a&&1!=a.nodeType;)a=a.parentNode;var d=a,g=b.type,e=i[g]||(i[g]=RegExp("(?:^|,)"+g+"(?:,|$)"));if(!e.test(m(a,"mx-ie"))){for(var s="mx-"+g,u,o,A=[];d&&d!=c&&!(u=m(d,s),o=m(d,"mx-ie"),u||e.test(o));)A.push(d),
d=d.parentNode;if(u){g=m(d,"mx-owner");if(!g){e=d;for(o=k.all();e&&e!=c;)if(p(o,e.id)){m(d,"mx-owner",g=e.id);break}else e=e.parentNode}if(g)(g=(g=k.get(g))&&g.view)&&g.processEvent({info:u,se:b,tId:a.id||(a.id="mx-e-"+l--),cId:d.id||(d.id="mx-e-"+l--)});else throw Error("miss mx-owner:"+u);}else for(;A.length;)b=A.shift(),o=m(b,"mx-ie"),e.test(o)||(o=o?o+","+g:g,m(b,"mx-ie",o))}},on:function(b,a){var d=this;e[b]?e[b]++:(k=a,e[b]=1,j[b]?d.unbubble(0,c,b):c["on"+b]=function(a){(a=a||window.event)&&
d.process(a)})},un:function(b){var a=e[b];0<a&&(a--,a||(j[b]?this.unbubble(1,c,b):c["on"+b]=null),e[b]=a)}};n.unbubble=function(b,a,d){(b?r.undelegate:r.delegate).call(r,a,d,"[mx-"+d+"]",n.process)};return n},{requires:["magix/magix","event","sizzle"]});
KISSY.add("magix/event",function(h,f){var r=f.safeExec;return{fire:function(f,j,c,e){var i="~"+f,l=this[i];if(l){j||(j={});if(!j.type)j.type=f;for(var f=l.length,h=f-1,k,n;f--;){k=e?f:h-f;n=l[k];if(n.d||n.r)l.splice(k,1),h--;n.d||r(n.f,j,this)}}c&&delete this[i]},on:function(h,j,c){h="~"+h;h=this[h]||(this[h]=[]);f.isNumeric(c)?h.splice(c,0,{f:j}):h.push({f:j,r:c})},un:function(f,h){var c="~"+f,e=this[c];if(e)if(h)for(var c=e.length-1,i;0<=c;c--){if(i=e[c],i.f==h&&!i.d){i.d=1;break}}else delete this[c]}}},
{requires:["magix/magix"]});
KISSY.add("magix/magix",function(h){var f=[].slice,r=/\/\.\/|\/[^\/]+?\/\.{2}\/|([^:\/])\/\/+/,p=/\/[^\/]*$/,j=/[#?].*$/,c=/([^=&?\/#]+)=([^&=#?]*)/g,e=/^https?:\/\//i,i={},l=0,m={debug:false,iniFile:"app/ini",appName:"app",appHome:"./",tagName:"vframe",rootId:"magix_vf_root"},k=i.hasOwnProperty,n=function(a){return function(b,c,e){switch(arguments.length){case 0:e=a;break;case 1:e=o.isObject(b)?g(a,b):d(a,b)?a[b]:null;break;case 2:null===c?(delete a[b],e=c):a[b]=e=c}return e}},b=function(a){this.c=
[];this.x=a||20;this.b=this.x+5},a=function(a){return new b(a)},d=function(a,b){return a?k.call(a,b):0},g=function(a,b,c){for(var g in b)if(!c||!d(c,g))a[g]=b[g];return a};g(b.prototype,{get:function(a){var b=this.c,c,a="pathname"+a;if(d(b,a)&&(c=b[a],1<=c.f))c.f++,c.t=l++,c=c.v;return c},set:function(a,b){var c=this.c,a="pathname"+a,g=c[a];if(!d(c,a)){if(c.length>=this.b){c.sort(function(a,b){return b.f==a.f?b.t-a.t:b.f-a.f});for(var q=this.b-this.x;q--;)g=c.pop(),delete c[g.k]}g={};c.push(g);c[a]=
g}g.k=a;g.v=b;g.f=1;g.t=l++;return g},del:function(a){var a="pathname"+a,b=this.c,d=b[a];if(d)d.f=-1E5,d.v="",delete b[a]},has:function(a){return d(this.c,"pathname"+a)}});var t=a(60),s=a(),u=function(a,b,d,c,q,g){o.isArray(a)||(a=[a]);if(!b||!o.isArray(b)&&!b.callee)b=[b];for(c=0;c<a.length;c++)try{g=a[c],q=o.isFunction(g)&&g.apply(d,b)}catch(e){}return q},o={isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},mix:g,has:d,safeExec:u,noop:function(){},config:n(m),start:function(a){var b=
this,a=g(m,a);b.libEnv(a);b.libRequire(a.iniFile,function(d){m=g(a,d,a);var c=a.progress;b.libRequire(["magix/router","magix/vom"],function(d,g){d.on("!ul",g.locChged);d.on("changed",g.locChged);c&&g.on("progress",c);b.libRequire(a.extensions,d.start)})});a.ready&&(u(a.ready),delete a.ready)},keys:Object.keys||function(a){var b=[],c;for(c in a)d(a,c)&&b.push(c);return b},local:n({}),path:function(a,b){var d=a+"\n"+b,c=s.get(d);if(!c){e.test(b)?c=b:(a=a.replace(j,"").replace(p,"")+"/","/"==b.charAt(0)?
(c=e.test(a)?8:0,c=a.indexOf("/",c),c=a.substring(0,c)+b):c=a+b);for(;r.test(c);)c=c.replace(r,"$1/");s.set(d,c)}return c},pathToObject:function(a,b){var d=t.get(a);if(!d){var d={},g={},q="";j.test(a)?q=a.replace(j,""):~a.indexOf("=")||(q=a);if(q&&e.test(q))var o=q.indexOf("/",8),q=-1==o?"/":q.substring(o);a.replace(c,function(a,d,c){if(b)try{c=decodeURIComponent(c)}catch(q){}g[d]=c});d.pathname=q;d.params=g;t.set(a,d)}return d},objectToPath:function(a,b){var d=a.pathname,c=[],g=a.params,e,o;for(o in g)e=
g[o],b&&encodeURIComponent(e),c.push(o+"="+e);return d+(d&&c.length?"?":"")+c.join("&")},tmpl:function(a,b){return 1==arguments.length?{v:i[a],h:d(i,a)}:i[a]=b},listToMap:function(a,b){var d,c,g={},e;this.isString(a)&&(a=a.split(","));if(a&&(e=a.length))for(d=0;d<e;d++)c=a[d],g[b?c[b]:c]=b?c:1;return g},cache:a};return g(o,{libRequire:function(a,b){a?h.use(a.toString(),function(a){b&&b.apply(a,f.call(arguments,1))}):b&&b()},libEnv:function(a){var b=a.appHome,d=location,c=a.appName,b=this.path(d.href,
b+"/");a.appHome=b;var g=a.debug;g&&(g=0==b.indexOf(d.protocol+"//"+d.host+"/"));d="";(d=g?h.now():a.appTag)&&(d+=".js");h.config({packages:[{name:c,path:b,debug:a.debug=g,combine:a.appCombine,tag:d}]})},isArray:h.isArray,isFunction:h.isFunction,isObject:h.isObject,isRegExp:h.isRegExp,isString:h.isString,isNumber:h.isNumber})});
KISSY.add("magix/router",function(h,f,r,p){var j=window,c=f.has,e=f.mix,i=document,l=/^UTF-8$/i.test(i.charset||i.characterSet||"UTF-8"),m=f.config(),k=f.cache(),n=f.cache(),b,a,d,g=/#.*$/,t=/^[^#]*#?!?/,s=m.nativeHistory,u,o,A=function(a,b,d){if(a){d=this.params;f.isArray(a)||(a=a.split(","));for(var g=0;g<a.length&&!(b=c(d,a[g]));g++);}return b},J=function(){return c(this,"pathname")},K=function(){return c(this,"view")},w=function(){return this.hash.pathname!=this.query.pathname},q=function(a){return this.hash.params[a]!=
this.query.params[a]},v=function(a){return c(this.hash.params,a)},B=function(a){return c(this.query.params,a)},C=function(a){return this.params[a]},D=function(a){var a=f.pathToObject(a,l),b=a.pathname;b&&o&&(a.pathname=f.path(j.location.pathname,b));return a},x=e({getView:function(a){if(!d){d={rs:m.routes||{},nf:m.notFoundView};var b=m.defaultView;if(!b)throw Error("unset defaultView");d.home=b;var c=m.defaultPathname||"";d.rs[c]=b;d.pathname=c}a||(a=d.pathname);b=d.rs;b=f.isFunction(b)?b.call(m,
a):b[a];return{view:b?b:d.nf||d.home,pathname:b?a:d.nf?a:d.pathname}},start:function(){var a=x,b=j.history;u=s&&b.pushState;o=s&&!u;u?a.useState():a.useHash();a.route()},parseQH:function(a){var a=a||j.location.href,b=x,d=k.get(a);if(!d){var d=a.replace(g,""),c=a.replace(t,""),o=D(d),f=D(c),i={};e(i,o.params);e(i,f.params);d={pathnameDiff:w,paramDiff:q,hashOwn:v,queryOwn:B,get:C,href:a,srcQuery:d,srcHash:c,query:o,hash:f,params:i};k.set(a,d)}d.view||(a=b.getView(s?d.hash.pathname||d.query.pathname:
d.hash.pathname),e(d,a));return d},getChged:function(a,b){var d=b.href,c=a.href+"\n"+d,g=n.get(c);g||(c=d+"\n"+c,g=n.get(c));if(!g){var q,g={params:{}};if(a.pathname!=b.pathname)q=g.pathname=1;if(a.view!=b.view)q=g.view=1;var d=a.params,e=b.params,o;for(o in d)d[o]!=e[o]&&(q=1,g.params[o]=1);for(o in e)d[o]!=e[o]&&(q=1,g.params[o]=1);g.occur=q;g.isParam=A;g.isPathname=J;g.isView=K;n.set(c,g)}return g},route:function(){var d=x,c=d.parseQH(),g=a||{params:{},href:"~"},q=!a;a=c;g=d.getChged(g,c);g.occur&&
(b=c,d.fire("changed",{location:c,changed:g,force:q}))},navigate:function(a,d,g){var q=x;!d&&f.isObject(a)&&(d=a,a="");d&&(a=f.objectToPath({params:d,pathname:a},l));if(a){d=D(a);a={};a.params=e({},d.params);a.pathname=d.pathname;if(a.pathname){if(o&&(d=b.query)&&(d=d.params))for(var s in d)c(d,s)&&!c(a.params,s)&&(a.params[s]="")}else s=e({},b.params),a.params=e(s,a.params),a.pathname=b.pathname;s=f.objectToPath(a);if(u?s!=b.srcQuery:s!=b.srcHash)u?(q.poped=1,history[g?"replaceState":"pushState"]({},
i.title,s),q.route()):(e(a,b,a),a.srcHash=s,a.hash={params:a.params,pathname:a.pathname},q.fire("!ul",{loc:b=a}),s="#!"+s,g?location.replace(s):location.hash=s)}}},r);x.useState=function(){var a=x,b=location.href;p.on(j,"popstate",function(){var d=location.href==b;if(a.poped||!d)a.poped=1,a.route()})};x.useHash=function(){p.on(j,"hashchange",x.route)};return x},{requires:["magix/magix","magix/event","event"]});
KISSY.add("magix/vframe",function(h,f,r,p){var j=document,c=65536,e=window.CollectGarbage||f.noop,i=f.mix,h=f.config(),l=h.tagName,m=h.rootId,k=f.has,n,b,a=function(a){return"object"==typeof a?a:j.getElementById(a)};j.createElement(l);var d=/<script[^>]*>[\s\S]*?<\/script>/ig,g,t=function(a){this.id=a;this.cM={};this.rC=this.cC=0;this.sign=-2147483648;this.rM={}};i(t,{root:function(b,d){if(!n){g=d;var c=a(m);if(!c)c=j.createElement(l),c.id=m,j.body.insertBefore(c,j.body.firstChild);n=new t(m);b.add(n)}return n}});
i(i(t.prototype,r),{mountView:function(b,c){var e=this,h=a(e.id);h._bak?h._chgd=1:(h._bak=1,h._tmpl=h.innerHTML.replace(d,""));e.unmountView();if(b){var t=f.pathToObject(b),l=t.pathname,j=--e.sign;f.libRequire(l,function(b){if(j==e.sign){var d=e.owner;p.prepare(b);var s=new b({owner:e,id:e.id,$:a,path:l,vom:d,location:g});e.view=s;s.on("interact",function(a){if(!a.tmpl){if(h._chgd)h.innerHTML=h._tmpl;e.mountZoneVframes(0,0,1)}s.on("rendered",function(){e.mountZoneVframes(0,0,1)});s.on("prerender",
function(){e.unmountZoneVframes()});s.on("inited",function(){e.viewInited=1;e.fire("viewInited",{view:s})})},0);c=c||{};s.load(i(c,t.params,c))}})}},unmountView:function(){if(this.view){b||(b={caused:this.id});this.unmountZoneVframes();this.cAlter(b);this.view.destroy();var d=a(this.id);if(d&&d._bak)d.innerHTML=d._tmpl;delete this.view;delete this.viewInited;b=0;this.fire("viewUnmounted");e()}this.un("viewInited");this.sign--},mountVframe:function(a,b,d,c){var g=this.owner,e=g.get(a);if(!e)e=new t(a),
e.pId=this.id,k(this.cM,a)||this.cC++,this.cM[a]=c,g.add(e);e.mountView(b,d);return e},mountZoneVframes:function(b,d,g){this.unmountZoneVframes(b);var b=a(b||this.id).getElementsByTagName(l),e=b.length,i={};if(e)for(var f=0,h,q,v,t;f<e;f++){h=b[f];q=h.id||(h.id="magix_vf_"+c--);k(i,q)||(v=h.getAttribute("mx-view"),t=h.getAttribute("mx-defer"),(!t||v)&&this.mountVframe(q,v,d,g));h=a(h).getElementsByTagName(l);q=0;for(v=h.length;q<v;q++)i[h[q].id||(h[q].id="magix_vf_"+c--)]=1}this.cC==this.rC&&this.cCreated({})},
unmountVframe:function(a){var a=a||this.id,b=this.owner,d=b.get(a);if(d){var c=d.fcc;d.unmountView();b.remove(a,c);if((b=b.get(d.pId))&&k(b.cM,a))delete b.cM[a],b.cC--}},unmountZoneVframes:function(b){if(b){for(var b=a(b).getElementsByTagName(l),d={},c=this.cM,g=b.length-1,e;0<=g;g--)e=b[g].id,k(c,e)&&(d[e]=1);b=d}else b=this.cM;for(var f in b)this.unmountVframe(f)},cCreated:function(a){var b=this.view;if(b&&!this.fcc)this.fcc=1,delete this.fca,b.fire("created",a),this.fire("created",a);var d=this.owner;
d.vfCreated();b=this.id;if((d=d.get(this.pId))&&!k(d.rM,b))d.rM[b]=d.cM[b],d.rC++,d.rC==d.cC&&d.cCreated(a)},cAlter:function(a){delete this.fcc;if(!this.fca){var b=this.view,d=this.id;if(b)this.fca=1,b.fire("alter",a),this.fire("alter",a);if((b=this.owner.get(this.pId))&&k(b.rM,d)){var c=b.rM[d];b.rC--;delete b.rM[d];c&&b.cAlter(a)}}},locChged:function(a,b){var d=this.view;if(d&&d.sign&&d.rendered){var c=d.olChanged(b),g={location:a,changed:b,prevent:function(){this.cs=[]},toChildren:function(a){a=
a||[];f.isString(a)&&(a=a.split(","));this.cs=a}};c&&f.safeExec(d.locationChange,g,d);for(var d=g.cs||f.keys(this.cM),c=0,g=d.length,e=this.owner,i;c<g;c++)(i=e.get(d[c]))&&i.locChged(a,b)}}});return t},{requires:["magix/magix","magix/event","magix/view"]});
KISSY.add("magix/view",function(h,f,r,p,j){var c=f.safeExec,e=f.has,i=[],l=f.config(),m=f.mix,k=["render","renderUI"],n=function(a){return function(){var b;this.notifyUpdate()&&(b=a.apply(this,arguments));return b}},b=f.cache(40),a=function(a){m(this,a);this.sign=1};m(a,{wrapUpdate:function(){if(!this["~"]){this["~"]=1;for(var a=this.prototype,b,d=k.length-1,c;-1<d;d--)c=k[d],b=a[c],f.isFunction(b)&&b!=f.noop&&(a[c]=n(b))}}});var d=a.prototype,g=window.CollectGarbage||f.noop,t=/<[a-z]+(?:[^">]|"[^"]*")+(?=>)/g,
s=/\smx-owner\s*=/,u=/\smx-[^v][a-z]+\s*=/,o=function(a){return!s.test(a)&&u.test(a)?a+' mx-owner="'+o.t+'"':a},A={prevent:function(a){a=a||this.domEvent;a.preventDefault?a.preventDefault():a.returnValue=!1},stop:function(a){a=a||this.domEvent;a.stopPropagation?a.stopPropagation():a.cancelBubble=!0},halt:function(a){this.prevent(a);this.stop(a)}},J=/(\w+)(?:<(\w+)>)?(?:{([\s\S]*)})?/,K=/(\w+):([^,]+)/g;m(d,r);m(d,{render:f.noop,locationChange:f.noop,init:f.noop,hasTmpl:!0,enableEvent:!0,load:function(){var a=
this,b=a.hasTmpl,d=arguments,g=a.sign,f=e(a,"template"),h=function(e){if(g==a.sign){if(!f)a.template=a.wrapMxEvent(e);a.delegateEvents();a.fire("interact",{tmpl:b},1);c(a.init,d,a);a.fire("inited",0,1);c(a.render,i,a);if(!b&&!a.rendered)a.rendered=!0,a.fire("primed",null,1)}};b&&!f?a.fetchTmpl(h):h()},beginUpdate:function(){this.sign&&this.rendered&&(this.fire("refresh",0,1),this.fire("prerender"))},endUpdate:function(){if(this.sign)this.rendered||this.fire("primed",0,1),this.rendered=!0,this.fire("rendered"),
g()},notifyUpdate:function(){this.sign&&(this.sign++,this.fire("rendercall"));return this.sign},wrapMxEvent:function(a){o.t=this.id;return(""+a).replace(t,o)},setViewHTML:function(a){var b;this.beginUpdate();if(this.sign&&(b=this.$(this.id)))b.innerHTML=a;this.endUpdate()},observeLocation:function(a){var b;if(!this.$ol)this.$ol={keys:[]};b=this.$ol;var d=b.keys;if(f.isObject(a))b.pn=a.pathname,a=a.keys;if(a)b.keys=d.concat(f.isString(a)?a.split(","):a)},olChanged:function(a){var b=this.$ol;if(b){var d=
0;b.pn&&(d=a.isPathname());d||(d=a.isParam(b.keys));return d}return 1},destroy:function(){this.fire("refresh",0,1);this.fire("destroy",0,1,1);this.delegateEvents(1);this.sign=0},parentView:function(){var a=this.vom.get(this.owner.pId),b=null;if(a&&a.viewInited)b=a.view;return b},processEvent:function(a){if(this.enableEvent&&this.sign){var d=a.info,g=a.se,e=b.get(d);e||(e=d.match(J),e={n:e[1],f:e[2],i:e[3],p:{}},e.i&&e.i.replace(K,function(a,b,d){e.p[b]=d}),b.set(d,e));if(d=this.events){var f=d[g.type],
i=A[e.f];i&&i.call(A,g);(i=f&&f[e.n])&&c(i,m({view:this,currentId:a.cId,targetId:a.tId,domEvent:g,events:d,params:e.p},A),f)}}},delegateEvents:function(a){var b=this.events,a=a?p.un:p.on,d=this.vom,c;for(c in b)a.call(p,c,d)}});var w=function(a,b,d){for(var c in b)h.isObject(b[c])?(e(a,c)||(a[c]={}),w(a[c],b[c],1)):d&&(a[c]=b[c])};a.prototype.fetchTmpl=function(a){var b=this,d=b.template;if(h.isUndefined(d))if(d=f.tmpl(b.path),d.h)a(d.v);else{var g=l.appHome+b.path+".html",e=w[g],d=function(d){a(f.tmpl(b.path,
d))};e?e.push(d):(e=w[g]=[d],j({url:g+(l.debug?"?t="+h.now():""),success:function(a){c(e,a);delete w[g]},error:function(a,b){c(e,b);delete w[g]}}))}else a(d)};a.extend=function(a,b,d){var g=function(){g.superclass.constructor.apply(this,arguments);b&&c(b,arguments,this)};g.extend=this.extend;return h.extend(g,this,a,d)};a.prepare=function(a){if(!a.wrapUpdate){a.wrapUpdate=this.wrapUpdate;a.extend=this.extend;for(var b=a.prototype,d=a.superclass;d;)d=d.constructor,w(b,d.prototype),d=d.superclass}a.wrapUpdate()};
return a},{requires:["magix/magix","magix/event","magix/body","ajax"]});
KISSY.add("magix/vom",function(h,f,r,p){var j=r.has,c=r.mix,e=0,i=0,l=0,m=0,k={},n={},b=r.mix({all:function(){return k},add:function(a){if(!j(k,a.id))e++,k[a.id]=a,a.owner=b,b.fire("add",{vframe:a})},get:function(a){return k[a]},remove:function(a,d){var c=k[a];c&&(e--,d&&i--,delete k[a],b.fire("remove",{vframe:c}))},vfCreated:function(){if(!m){i++;var a=i/e;l<a&&b.fire("progress",{percent:l=a},m=1==a)}},root:function(){return f.root(b,n)},locChged:function(a){var d=a.loc,g;d?g=1:d=a.location;c(n,
d);if(!g)g=b.root(),a=a.changed,a.isView()?g.mountView(d.view):g.locChged(d,a)}},p);return b},{requires:["magix/vframe","magix/magix","magix/event"]});
KISSY.add("mxext/mmanager",function(h,f,r){var p=f.has,j=f.safeExec,c=function(b){h.isArray(b)||(b=[b]);for(var a=0,d;a<b.length;a++)d=b[a],delete d.cacheKey;return b},e=function(b){this.$mClass=b;this.$mCache=f.cache();this.$mCacheKeys={};this.$mMetas={}},i=[].slice,l={urlParams:1,postParams:1,cacheKey:1,cacheTime:1,before:1,after:1},m=function(b){var a={},d;for(d in b)l[d]||(a[d]=b[d]);return a},k=function(b,a,d){return function(){return b.apply(a,[a,d].concat(i.call(arguments)))}};f.mix(e,{create:function(b){if(!b)throw Error("MManager.create:modelClass ungiven");
return new e(b)}});var n=function(b){this.$host=b;this.$doTask=!1;this.$reqModels={}};f.mix(n.prototype,{fetchModels:function(b,a,d){var c=this;if(c.$doTask)return c.next(function(c){c.fetchModels(b,a,d)}),c;c.$doTask=!0;var e=c.$host,f=e.$mCache,i=e.$mCacheKeys,l=c.$reqModels;h.isArray(b)||(b=[b]);var m=b.length,n=0,r,w,q=Array(m),v=[],B={},C=[],D=h.isArray(a);D&&(v=Array(a.length));for(var x=function(b,k,x,z){if(!c.$destroy){n++;delete l[b.id];var E=b._cacheKey;q[k]=b;if(z)w=!0,r=z,B[k]=x;else if(b._doneAt=
h.now(),E){if(!f.has(E)){f.set(E,b);var y=b._after,F=b._meta;y&&j(y,[b,F]);e.fireAfter(F.name,[b])}}else y=b._after,F=b._meta,y&&j(y,[b,F]),e.fireAfter(F.name,[b]);if(2==d)(y=D?a[k]:a)&&(v[k]=j(y,[b,w?{msg:r}:null,w?B:null],c));else if(4==d){C[k]={m:b,e:w,s:r};for(k=C.i||0;y=C[k];k++)if(F=D?a[k]:a,v[k]=j(F,[y.m,y.e?{msg:y.s}:null,C.e?B:null,v],c),y.e)B[k]=y.s,C.e=1;C.i=k}if(E&&p(i,E))k=i[E].q,delete i[E],j(k,[x,z],b);if(n>=m)B.msg=r,b=w?B:null,1==d?(q.push(b),v[0]=j(a,q,c),v[1]=b):v.push(b),c.$ntId=
setTimeout(function(){c.doNext(v)},30)}},H=0,z;H<b.length;H++)if(z=b[H]){var I;I=e.getModel(z);var G=I.cacheKey;z=I.entity;var L=k(x,z,H);G&&p(i,G)?i[G].q.push(L):I.needUpdate?(l[z.id]=z,G&&(i[G]={q:[],e:z}),z.request(L)):L()}else throw Error("miss attrs:"+b);return c},fetchAll:function(b,a){return this.fetchModels(b,a,1)},saveAll:function(b,a){b=c(b);return this.fetchModels(b,a,1)},fetchOrder:function(b,a){var d=i.call(arguments,1);return this.fetchModels(b,1<d.length?d:a,4)},saveOrder:function(b,
a){var b=c(b),d=i.call(arguments,1);return this.fetchModels(b,1<d.length?d:a,4)},saveOne:function(b,a){var b=c(b),d=i.call(arguments,1);return this.reqModels(b,1<d.length?d:a,2)},fetchOne:function(b,a){var d=i.call(arguments,1);return this.fetchModels(b,1<d.length?d:a,2)},abort:function(){clearTimeout(this.$ntId);var b=this.$reqModels,a=this.$host.$mCacheKeys;if(b)for(var d in b){var c=b[d],e=c._cacheKey;if(e&&p(a,e)){var i=a[e];delete a[e];j(i,[!0,c,"aborted"],c)}c.abort()}this.$reqModels={};this.$queue=
[];this.$doTask=!1},next:function(b){if(!this.$queue)this.$queue=[];this.$queue.push(b);this.$doTask||this.doNext.apply(this,[this].concat(this.$latest||[]));return this},doNext:function(b){this.$doTask=!1;var a=this.$queue;a&&(a=a.shift())&&j(a,[this].concat(b),this);this.$latest=b},destroy:function(){this.$destroy=!0;this.abort()}});f.mix(e.prototype,{registerModels:function(b){var a=this.$mMetas;h.isArray(b)||(b=[b]);for(var d=0,c;d<b.length;d++){if((c=b[d])&&!c.name)throw Error("model must own a name attribute");
a[c.name]=c}},registerMethods:function(b){var a=this,d;for(d in b)a[d]=function(b){return function(){for(var d,c=arguments,e=[],i=0,f;i<c.length;i++)f=c[i],h.isFunction(f)?e.push(function(a){return function(){d||a.apply(a,arguments)}}(f)):e.push(f);var l=b.apply(a,e);return{destroy:function(){d=!0;l&&l.destroy&&l.destroy()}}}}(b[d])},createModel:function(b){var a=this.getModelMeta(b),d=new this.$mClass(m(a)),c=b.before||a.before;this.fireBefore(a.name,[d]);h.isFunction(c)&&j(c,[d,a,b]);d._after=b.after||
a.after;c=b.cacheKey||a.cacheKey;h.isFunction(c)&&(c=j(c,[a,b]));d._cacheKey=c;d._meta=a;d.set(m(b));d.setUrlParams(a.urlParams);d.setPostParams(a.postParams);d.setUrlParams(b.urlParams);d.setPostParams(b.postParams);return d},getModelMeta:function(b){var a=this.$mMetas,d;d=h.isString(b)?b:b.name;a=a[d];if(!a)throw Error("Not found:"+b.name);return a},getModel:function(b){var a=this.getCachedModel(b),d;a||(d=!0,a=this.createModel(b));return{entity:a,cacheKey:a._cacheKey,needUpdate:d}},saveAll:function(b,
a){return(new n(this)).saveAll(b,a)},fetchAll:function(b,a){return(new n(this)).fetchAll(b,a)},saveOrder:function(b,a){var d=new n(this);return d.saveOrder.apply(d,arguments)},fetchOrder:function(b,a){var d=new n(this);return d.fetchOrder.apply(d,arguments)},saveOne:function(b,a){var d=new n(this);return d.saveOne.apply(d,arguments)},fetchOne:function(b,a){var d=new n(this);return d.fetchOne.apply(d,arguments)},clearCacheByKey:function(b){var a=this.$mCache;h.isString(b)&&a.del(b)},clearCacheByName:function(b){for(var a=
this.$mCache,d=a.c,c=0;c<d.length;c++){var e=d[c].v;(e&&e._meta.name)==b&&a.del(e._cacheKey)}},getModelUrl:function(b){b=this.getModelMeta(b);return b.url?b.url:this.$mClass.prototype.url(b.uri)},listenBefore:function(b,a){r.on.call(this,b+"_before",a)},listenAfter:function(b,a){r.on.call(this,b+"_after",a)},unlistenBefore:function(b,a){r.un.call(this,b+"_before",a)},unlistenAfter:function(b,a){r.un.call(this,b+"_after",a)},fireBefore:function(b,a){r.fire.call(this,b+"_before",a)},fireAfter:function(b,
a){r.fire.call(this,b+"_after",a)},getCachedModel:function(b){var a=this.$mCache,d=null,c,e;h.isString(b)?c=b:(e=this.getModelMeta(b),c=b.cacheKey||e.cacheKey,h.isFunction(c)&&(c=j(c,[e,b])));if(c)if(d=this.$mCacheKeys[c])d=d.e;else if(d=a.get(c)){if(!e)e=d._meta;a=b.cacheTime||e.cacheTime||0;h.isFunction(a)&&(a=j(a,[e,b]));0<a&&h.now()-d._doneAt>a&&(this.clearCacheByKey(c),d=null)}return d}});return e},{requires:["magix/magix","magix/event"]});
KISSY.add("mxext/model",function(h,f){var r=function(c,e,i){for(var l in e)h.isObject(e[l])?(f.has(c,l)||(c[l]={}),r(c[l],e[l],!0)):i&&(c[l]=e[l])},p=function(c){c&&this.set(c);this.id=h.guid("m")},j=encodeURIComponent;f.mix(p,{GET:"GET",POST:"POST",extend:function(c,e){var i=function(){i.superclass.constructor.apply(this,arguments);e&&f.safeExec(e,[],this)};f.mix(i,this,{prototype:!0});r(c,this.prototype);return h.extend(i,this,c)}});f.mix(p.prototype,{urlMap:{},sync:f.noop,parse:function(c){return c},
getParamsObject:function(c){if(!c)c=p.GET;return this["$"+c]||null},getUrlParamsObject:function(){return this.getParamsObject(p.GET)},getPostParamsObject:function(){return this.getParamsObject(p.POST)},getPostParams:function(){return this.getParams(p.POST)},getUrlParams:function(){return this.getParams(p.GET)},getParams:function(c){var c=c?c.toUpperCase():p.GET,c=this["$"+c],e=[],i;if(c)for(var f in c)if(i=c[f],h.isArray(i))for(var m=0;m<i.length;m++)e.push(f+"="+j(i[m]));else e.push(f+"="+j(i));
return e.join("&")},setUrlParamsIf:function(c,e){this.setParams(c,e,p.GET,!0)},setPostParamsIf:function(c,e){this.setParams(c,e,p.POST,!0)},setParams:function(c,e,f,l){f=f?f.toUpperCase():p.GET;if(!this.$types)this.$types={};this.$types[f]=!0;f="$"+f;this[f]||(this[f]={});if(h.isObject(c))for(var j in c){if(!l||!this[f][j])this[f][j]=c[j]}else if(c&&(!l||!this[f][c]))this[f][c]=e},setPostParams:function(c,e){this.setParams(c,e,p.POST)},setUrlParams:function(c,e){this.setParams(c,e,p.GET)},removeParamsObject:function(c){if(!c)c=
p.GET;delete this["$"+c]},removePostParamsObject:function(){this.removeParamsObject(p.POST)},removeUrlParamsObject:function(){this.removeParamsObject(p.GET)},reset:function(){var c=this.$types;if(c){for(var e in c)f.has(c,e)&&delete this["$"+e];delete this.$types}c=this.$keys;e=this.$attrs;if(c){for(var i=0;i<c.length;i++)delete e[c[i]];delete this.$keys}},url:function(c){var e=this.get("url");if(c=c||this.get("uri")){var e=c.split(":"),f=this.urlMap;if(f){for(var h=0,j=e.length;h<j&&!(f=f[e[h]],
!f);h++);c=f||c}e=c}else if(!e)throw Error("model not set uri and url");return e},get:function(c){var e=!arguments.length,f=this.$attrs;return f?e?f:f[c]:null},set:function(c,e,f){if(!this.$attrs)this.$attrs={};if(f&&!this.$keys)this.$keys=[];if(h.isObject(c))for(var j in c)f&&this.$keys.push(j),this.$attrs[j]=c[j];else c&&(f&&this.$keys.push(c),this.$attrs[c]=e)},request:function(c,e){c||(c=function(){});var f=h.isFunction(c),j=c.success,m=c.error,k=this;k.$abort=!1;var n=function(b,a){if(!k.$abort)if(a)f&&
c(b,a,e),m&&m.call(k,a);else{if(b){var d=k.parse(b);h.isObject(d)||(d={data:d});k.set(d,null,!0)}f&&c(b,a,e);j&&j.call(k,b)}};n.success=function(b){n(b)};n.error=function(b){n(null,b||"request error")};k.$trans=k.sync(n,e)},abort:function(){this.$trans&&this.$trans.abort&&this.$trans.abort();delete this.$trans;this.$abort=!0},isAborted:function(){return this.$abort},beginTransaction:function(){this.$bakAttrs=h.clone(this.$attrs)},rollbackTransaction:function(){var c=this.$bakAttrs;if(c)this.$attrs=
c,delete this.$bakAttrs},endTransaction:function(){delete this.$bakAttrs}});return p},{requires:["magix/magix"]});
KISSY.add("mxext/view",function(h,f,r,p){var j=window,c=function(a){j.clearTimeout(a);j.clearInterval(a)},e=function(a){l(a.destroy,[],a)},i=0,l=f.safeExec,m=f.has,k={},n=function(a){if(!n.d)n.d=1,a.on("add",function(a){var a=a.vframe,c=k[a.id];if(c){for(var e=0;e<c.length;e++)b(a,c[e]);delete k[a.id]}}),a.on("remove",function(a){delete k[a.vframe.id]}),a.root().on("created",function(){k={}})},b=function(a,b){var c=a.view;if(c&&a.viewInited)l(c.receiveMessage,b,c);else{var e=function(c){a.un("viewInited",
e);l(c.view.receiveMessage,b,c.view)};a.on("viewInited",e)}};return r.extend({mxViewCtor:f.noop,navigate:function(){p.navigate.apply(p,arguments)},manage:function(a,b){var g=!0;1==arguments.length&&(b=a,a="res_"+i++,g=!1);if(!this.$res)this.$res={};var f;h.isNumber(b)?f=c:b&&b.destroy&&(f=e);this.$res[a]={hasKey:g,res:b,destroy:f};return b},getManaged:function(a){var b=this.$res;return b&&m(b,a)?b[a].res:null},removeManaged:function(a){var b=null,c=this.$res;if(c)if(m(c,a))b=c[a].res,delete c[a];
else for(var e in c)if(c[e].res===a){b=c[e].res;delete c[e];break}return b},destroyManaged:function(a){var b=this.$res;if(b){for(var c in b){var e=b[c],f=e.res,h=e.destroy,i=!1;h&&(h(f),i=!0);e.hasKey||delete b[c];this.fire("destroyManaged",{resource:f,processed:i})}"destroy"==a.type&&delete this.$res}},receiveMessage:f.noop,postMessageTo:function(a,c){var e=this.vom;n(e);f.isArray(a)||(a=[a]);c||(c={});for(var h=0,i;h<a.length;h++){i=a[h];var j=e.get(i);j?b(j,c):(k[i]||(k[i]=[]),k[i].push(c))}},
destroyMRequest:function(){var a=this.$res;if(a)for(var b in a){var c=a[b].res;c&&c.fetchOne&&c.fetchAll&&(c.destroy(),delete a[b])}}},function(){var a=this;a.home=f.config().appHome;a.beginUpdateHTML=a.beginUpdate;a.endUpdateHTML=a.endUpdate;a.on("interact",function(){a.on("rendercall",a.destroyMRequest);a.on("prerender",a.destroyManaged);a.on("destroy",a.destroyManaged)});a.mxViewCtor()})},{requires:["magix/magix","magix/view","magix/router"]});
(function(h){var f=function(){};if(!h.console)h.console={log:f,info:f,error:f};var r,p={};if(!h.Magix)h.Magix={config:function(f){for(var c in f)p[c]=f[c]},start:function(f){r=f}},KISSY.use("magix/magix",function(f,c){h.Magix=c;c.config(p);r&&c.start(r)})})(this);