KISSY.add("magix/magix",function(e){var t=[].slice,r=/\/\.\/|\/[^\/]+?\/\.{2}\/|([^:\/])\/\/+/,n=/\/[^\/]*$/,i=/[#?].*$/,a="",o=/([^=&?\/#]+)=?([^&=#?]*)/g,s="pathname",c=/^https?:\/\//i,f=0,u="/",l="vframe",v=function(){},h={tagName:l,rootId:"magix_vf_root",execError:v},d={}.hasOwnProperty,m=function(e){return function(t,r,n){switch(arguments.length){case 0:n=e;break;case 1:n=C.isObject(t)?x(e,t):y(e,t)?e[t]:null;break;case 2:null===r?(delete e[t],n=r):e[t]=n=r}return n}},p=function(e){var t=this;t.c=[],t.x=e||5,t.b=t.x+3},g=function(e){return new p(e)},y=function(e,t){return e?d.call(e,t):0},x=function(e,t,r){for(var n in t)r&&y(r,n)||(e[n]=t[n]);return e};x(p.prototype,{get:function(e){var t,r=this,n=r.c;return e=s+e,y(n,e)&&(t=n[e],t.f>=1&&(t.f++,t.t=f++,t=t.v)),t},set:function(e,t){var r=this,n=r.c;e=s+e;var i=n[e];if(!y(n,e)){if(n.length>=r.b){n.sort(function(e,t){return t.f==e.f?t.t-e.t:t.f-e.f});for(var a=r.b-r.x;a--;)i=n.pop(),delete n[i.k]}i={},n.push(i),n[e]=i}return i.k=e,i.v=t,i.f=1,i.t=f++,i},del:function(e){e=s+e;var t=this.c,r=t[e];r&&(r.f=-1e5,r.v=a,delete t[e])},has:function(e){return e=s+e,y(this.c,e)}});var w=g(20),b=g(),$=function(e,t,r,n,i,a){for(C.isArray(e)||(e=[e]),t&&(C.isArray(t)||t.callee)||(t=[t]),n=0;e.length>n;n++)try{a=e[n],i=a&&a.apply(r,t)}catch(o){h.execError(o)}return i},C={isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},mix:x,has:y,safeExec:$,noop:v,config:m(h),start:function(e){var t=this;x(h,e),t.libRequire(h.iniFile,function(r){h=x(h,r,e),h.tagNameChanged=h.tagName!=l;var n=h.progress;t.libRequire(["magix/router","magix/vom"],function(e,r){e.on("!ul",r.locChged),e.on("changed",r.locChged),n&&r.on("progress",n),t.libRequire(h.extensions,e.start)})})},keys:Object.keys||function(e){var t=[];for(var r in e)y(e,r)&&t.push(r);return t},local:m({}),path:function(e,t){var o=e+"\n"+t,s=b.get(o);if(!s){if(c.test(t))s=t;else if(e=e.replace(i,a).replace(n,a)+u,t.charAt(0)==u){var f=c.test(e)?8:0,l=e.indexOf(u,f);s=e.substring(0,l)+t}else s=e+t;for(;r.test(s);)s=s.replace(r,"$1/");b.set(o,s)}return s},pathToObject:function(e,t){var r=w.get(e);if(!r){r={};var n={},f=a;i.test(e)?f=e.replace(i,a):~e.indexOf("=")||(f=e);var l=e.replace(f,a);if(f&&c.test(f)){var v=f.indexOf(u,8);f=-1==v?u:f.substring(v)}l.replace(o,function(e,r,i){if(t)try{i=decodeURIComponent(i)}catch(a){}n[r]=i}),r[s]=f,r.params=n,w.set(e,r)}return r},objectToPath:function(e,t){var r,n=e[s],i=[],a=e.params;for(var o in a)r=a[o],t&&encodeURIComponent(r),i.push(o+"="+r);return i.length&&(n=n+"?"+i.join("&")),n},listToMap:function(e,t){var r,n,i,a={};if(C.isString(e)&&(e=e.split(",")),e&&(i=e.length))for(r=0;i>r;r++)n=e[r],a[t?n[t]:n]=t?n:1;return a},cache:g};return x(C,{libRequire:function(r,n){r?e.use(r+"",function(e){n&&n.apply(e,t.call(arguments,1))}):n&&n()},isArray:e.isArray,isFunction:e.isFunction,isObject:e.isObject,isRegExp:e.isRegExp,isString:e.isString,isNumber:e.isNumber})}),KISSY.add("magix/router",function(e,t,r,n){var i,a,o,s,c,f=window,u="",l="pathname",v=t.has,h=t.mix,d=document,m=/^UTF-8$/i.test(d.charset||d.characterSet||"UTF-8"),p=t.config(),g=t.cache(),y=t.cache(),x=/#.*$/,w=/^[^#]*#?!?/,b="params",$=p.nativeHistory,C=function(e,r,n){if(e){n=this[b],t.isArray(e)||(e=e.split(","));for(var i=0;e.length>i&&!(r=v(n,e[i]));i++);}return r},M=function(){return v(this,l)},E=function(){return v(this,"view")},S=function(e,t,r){return t=this,r=t[b],r[e]},T=function(e){var r=t.pathToObject(e,m),n=r[l];return n&&c&&(r[l]=t.path(f.location[l],n)),r},I=h({getView:function(e,r){if(!o){o={rs:p.routes||{},nf:p.notFoundView};var n=p.defaultView;if(!n)throw Error("unset defaultView");o.home=n;var i=p.defaultPathname||u;o.rs[i]=n,o[l]=i}var a;e||(e=o[l]);var s=o.rs;return a=t.isFunction(s)?s.call(p,e,r):s[e],{view:a?a:o.nf||o.home,pathname:a||$?e:o.nf?e:o[l]}},start:function(){var e=I,t=f.history;s=$&&t.pushState,c=$&&!s,s?e.useState():e.useHash(),e.route()},parseQH:function(e,t){e=e||f.location.href;var r=I,n=g.get(e);if(!n){var i=e.replace(x,u),a=e.replace(w,u),o=T(i),s=T(a),c={};h(c,o[b]),h(c,s[b]),n={get:S,href:e,srcQuery:i,srcHash:a,query:o,hash:s,params:c},g.set(e,n)}if(t&&!n.view){var v;v=$?n.hash[l]||n.query[l]:n.hash[l];var d=r.getView(v,n);h(n,d)}return n},getChged:function(e,t){var r=e.href,n=t.href,i=r+"\n"+n,a=y.get(i);if(a||(i=n+"\n"+i,a=y.get(i)),!a){var o,s,c;a={params:{}},s=e[l],c=t[l],s!=c&&(a[l]={from:s,to:c},o=1),s=e.view,c=t.view,s!=c&&(a.view={from:s,to:c},o=1);var f,u=e[b],v=t[b];for(f in u)s=u[f],c=v[f],u[f]!=v[f]&&(o=1,a[b][f]={from:s,to:c});for(f in v)s=u[f],c=v[f],u[f]!=v[f]&&(o=1,a[b][f]={from:s,to:c});a.occur=o,a.isParam=C,a.isPathname=M,a.isView=E,y.set(i,a)}return a},route:function(){var e=I,t=e.parseQH(0,1),r=a||{params:{},href:"~"},n=!a;a=t;var o=e.getChged(r,t);o.occur&&(i=t,e.fire("changed",{location:t,changed:o,force:n}))},navigate:function(e,r,n){var a=I;if(!r&&t.isObject(e)&&(r=e,e=u),r&&(e=t.objectToPath({params:r,pathname:e},m)),e){var o=T(e),f={};if(f[b]=h({},o[b]),f[l]=o[l],f[l]){if(c){var d=i.query;if(d&&(d=d[b]))for(var p in d)v(d,p)&&!v(f[b],p)&&(f[b][p]=u)}}else{var g=h({},i[b]);f[b]=h(g,f[b]),f[l]=i[l]}var y,x=t.objectToPath(f);y=s?x!=i.srcQuery:x!=i.srcHash,y&&(s?(a.poped=1,history[n?"replaceState":"pushState"](null,null,x),a.route()):(h(f,i,f),f.srcHash=x,f.hash={params:f[b],pathname:f[l]},a.fire("!ul",{loc:i=f}),x="#!"+x,n?location.replace(x):location.hash=x))}}},r);return I.useState=function(){var e=I,t=location.href;n.on(f,"popstate",function(){var r=location.href==t;(e.poped||!r)&&(e.poped=1,e.route())})},I.useHash=function(){n.on(f,"hashchange",I.route)},I},{requires:["magix/magix","magix/event","event"]}),KISSY.add("magix/body",function(e,t,r){var n,i=t.has,a=t.listToMap(""),o=document.body,s={},c=String.fromCharCode(26),f="mx-owner",u="mx-ie",l={},v=65536,h=function(e){return e.id||(e.id="mx-e-"+v--)},d=function(e,t,r){return r?e.setAttribute(t,r):r=e.getAttribute(t),r},m={process:function(e){for(var t=e.target||e.srcElement;t&&1!=t.nodeType;)t=t.parentNode;var r=t,a=e.type,s=l[a]||(l[a]=RegExp("(?:^|,)"+a+"(?:,|$)"));if(!s.test(d(t,u))){for(var v,m,p="mx-"+a,g=[];r&&r!=o&&(v=d(r,p),m=d(r,u),!v&&!s.test(m));)g.push(r),r=r.parentNode;if(v){var y,x=v.indexOf(c);x>-1&&(y=v.slice(0,x),v=v.slice(x));var w=d(r,f)||y;if(!w)for(var b=r,$=n.all();b&&b!=o;){if(i($,b.id)){d(r,f,w=b.id);break}b=b.parentNode}if(!w)throw Error("miss "+f+":"+v);var C=n.get(w),M=C&&C.view;M&&M.processEvent({info:v,se:e,st:a,tId:h(t),cId:h(r)})}else for(var E;g.length;)E=g.shift(),m=d(E,u),s.test(m)||(m=m?m+","+a:a,d(E,u,m))}},on:function(e,t){var r=this;if(s[e])s[e]++;else{n=t,s[e]=1;var i=a[e];i?r.unbubble(0,o,e):o["on"+e]=function(e){e=e||window.event,e&&r.process(e)}}},un:function(e){var t=this,r=s[e];if(r>0){if(r--,!r){var n=a[e];n?t.unbubble(1,o,e):o["on"+e]=null}s[e]=r}}};return m.unbubble=function(e,t,n){var i=e?r.undelegate:r.delegate;i.call(r,t,n,"[mx-"+n+"]",m.process)},m},{requires:["magix/magix","event","sizzle"]}),KISSY.add("magix/event",function(e,t){var r=function(e){return"~"+e},n=t.safeExec,i={fire:function(e,t,i,a){var o=r(e),s=this,c=s[o];if(c){t||(t={}),t.type||(t.type=e);for(var f,u,l=c.length,v=l-1;l--;)f=a?l:v-l,u=c[f],(u.d||u.r)&&(c.splice(f,1),v--),u.d||n(u.f,t,s)}i&&delete s[o]},on:function(e,n,i){var a=r(e),o=this[a]||(this[a]=[]);t.isNumeric(i)?o.splice(i,0,{f:n}):o.push({f:n,r:i})},un:function(e,t){var n=r(e),i=this[n];if(i)if(t){for(var a,o=i.length-1;o>=0;o--)if(a=i[o],a.f==t&&!a.d){a.d=1;break}}else delete this[n]}};return i},{requires:["magix/magix"]}),KISSY.add("magix/vframe",function(e,t,r,n){var i,a,o,s=document,c=65536,f=t.safeExec,u=[].slice,l=t.mix,v=t.config("tagName"),h=t.config("rootId"),d=!t.config("tagNameChanged"),m=t.has,p="mx-view",g=d?"mx-defer":"mx-vframe",y="alter",x="created",w=function(e){return"object"==typeof e?e:s.getElementById(e)},b=function(e,t,r){return r=w(e),r?r.getElementsByTagName(t):[]},$=function(e){return s.createElement(e)},C=function(e){return e.id||(e.id="magix_vf_"+c--)},M=function(e,t,r){if(e=w(e),t=w(t),e&&t)if(e!==t)try{r=t.contains?t.contains(e):16&t.compareDocumentPosition(e)}catch(n){r=0}else r=1;return r},E=/<script[^>]*>[\s\S]*?<\/script>/gi,S=function(e){var t=this;t.id=e,t.cM={},t.cC=0,t.rC=0,t.sign=1<<30,t.rM={}};return l(S,{root:function(e,t){if(!i){o=t;var r=w(h);r||(r=$(v),r.id=h,s.body.insertBefore(r,s.body.firstChild)),i=new S(h),e.add(i)}return i}}),l(l(S.prototype,r),{mountView:function(e,r,i){var a=this,s=w(a.id);if(s._bak?s._chgd=1:(s._bak=1,s._tmpl=s.innerHTML.replace(E,"")),a.unmountView(),e){var c=t.pathToObject(e),u=c.pathname,v=--a.sign;t.libRequire(u,function(e){if(v==a.sign){var t=a.owner;n.prepare(e);var h=new e({owner:a,id:a.id,$:w,path:u,vom:t,location:o});a.view=h,h.on("interact",function(e){e.tmpl||(s._chgd&&(s.innerHTML=s._tmpl),a.mountZoneVframes(0,0,1)),h.on("rendered",function(){a.mountZoneVframes(0,0,1)}),h.on("prerender",function(){a.unmountZoneVframes(0,1)||a.cAlter()}),h.on("inited",function(){a.viewInited=1,a.fire("viewInited",{view:h}),i&&f(i,h,a)})},0),r=r||{},h.load(l(r,c.params,r))}})}},unmountView:function(){var e=this;if(e.view){a||(a={}),e.unmountZoneVframes(0,1),e.cAlter(a),e.view.destroy();var t=w(e.id);t&&t._bak&&(t.innerHTML=t._tmpl),delete e.view,delete e.viewInited,a=0,e.fire("viewUnmounted")}e.sign--},mountVframe:function(e,t,r){var n=this,i=n.owner,a=i.get(e);return a||(a=new S(e),a.pId=n.id,m(n.cM,e)||n.cC++,n.cM[e]=1,i.add(a)),a.mountView(t,r),a},mountZoneVframes:function(e,t){var r=this,n=e||r.id;r.unmountZoneVframes(n,1);var i=b(n,v),a=i.length,o={};if(a)for(var s,c,f,u,l=0;a>l;l++)if(s=i[l],c=C(s),!m(o,c)&&(f=s.getAttribute(p),u=!s.getAttribute(g),u=u==d,u||f)){r.mountVframe(c,f,t);for(var h,y=b(s,v),x=0,w=y.length;w>x;x++)h=y[x],f=h.getAttribute(p),u=!h.getAttribute(g),u=u==d,u||f||(o[C(h)]=1)}r.cCreated()},unmountVframe:function(e,t){var r=this;e=e||r.id;var n=r.owner,i=n.get(e);if(i){var a=i.fcc;i.unmountView(),n.remove(e,a),r.fire("destroy");var o=n.get(i.pId);o&&m(o.cM,e)&&(delete o.cM[e],o.cC--,t||o.cCreated())}},unmountZoneVframes:function(e,t){var r,n,i,a=this;if(e){var o=a.cM,s={};for(i in o)M(i,e)&&(s[i]=1);r=s}else r=a.cM;for(i in r)n=1,a.unmountVframe(i,1);return t||a.cCreated(),n},invokeView:function(e){var t,r=this,n=r.view,i=u.call(arguments,1);return r.viewInited&&n[e]&&(t=f(n[e],i,n)),t},cCreated:function(e){var t=this;if(t.cC==t.rC){var r=t.view;r&&!t.fcc&&(t.fcc=1,delete t.fca,r.fire(x,e),t.fire(x,e));var n=t.owner;n.vfCreated();var i=t.id,a=n.get(t.pId);a&&!m(a.rM,i)&&(a.rM[i]=a.cM[i],a.rC++,a.cCreated(e))}},cAlter:function(e){var t=this;if(e||(e={}),delete t.fcc,!t.fca){var r=t.view,n=t.id;r&&(t.fca=1,r.fire(y,e),t.fire(y,e));var i=t.owner,a=i.get(t.pId);a&&m(a.rM,n)&&(a.rC--,delete a.rM[n],a.cAlter(e))}},locChged:function(e,r){var n=this,i=n.view;if(i&&i.sign&&i.rendered){var a=i.olChanged(r),o={location:e,changed:r,prevent:function(){this.cs=[]},toChildren:function(e){e=e||[],t.isString(e)&&(e=e.split(",")),this.cs=e}};a&&f(i.locationChange,o,i);for(var s,c=o.cs||t.keys(n.cM),u=0,l=c.length,v=n.owner;l>u;u++)s=v.get(c[u]),s&&s.locChged(e,r)}}}),S},{requires:["magix/magix","magix/event","magix/view"]}),KISSY.add("magix/view",function(e,t,r,n,i){var a=t.safeExec,o=t.has,s=",",c=[],f=t.noop,u=t.mix,l={render:1,renderUI:1},v="~",h=function(e){return function(){var t,r=this,n=r.notifyUpdate();return n&&(t=e.apply(r,arguments)),t}},d=t.cache(20),m=/\smx-(?!view|defer|owner)[a-z]+\s*=\s*['"]/g,p=String.fromCharCode(26),g=function(){this.render()},y={prevent:function(e){e=e||this.domEvent,e.preventDefault?e.preventDefault():e.returnValue=!1},stop:function(e){e=e||this.domEvent,e.stopPropagation?e.stopPropagation():e.cancelBubble=!0},halt:function(e){this.prevent(e),this.stop(e)}},x=/(\w+)(?:<(\w+)>)?(?:{([\s\S]*)})?/,w=/(\w+):([^,]+)/g,b=/([$\w]+)<([\w,]+)>/,$=function(e){var t=this;u(t,e),t.sign=1};$.prepare=function(e){var t=this,r=e.superclass;if(r&&t.prepare(r.constructor),!e[v]){e[v]=1,e.extend=t.extend;var n,i,a,c,u,d=e.prototype,m={};for(var g in d)if(o(d,g))if(n=d[g],i=g.match(b))for(a=i[1],c=i[2],c=c.split(s),u=c.length-1;u>-1;u--)i=c[u],m[i]=1,d[a+p+i]=n;else o(l,g)&&n!=f&&(d[g]=h(n));c&&(d.$evts=m)}},u(u($.prototype,r),{render:f,locationChange:f,init:f,hasTmpl:!0,enableEvent:!0,load:function(){var e=this,t=e.hasTmpl,r=arguments,n=e.sign,i=o(e,"template"),s=function(o){if(n==e.sign){i||(e.template=e.wrapMxEvent(o)),e.delegateEvents(),e.fire("interact",{tmpl:t},1),a(e.init,r,e),e.fire("inited",0,1),a(e.render,c,e);var s=!t&&!e.rendered;s&&(e.rendered=!0,e.fire("primed",null,1))}};t&&!i?e.fetchTmpl(s):s()},beginUpdate:function(){var e=this;e.sign&&e.rendered&&(e.fire("refresh",0,1),e.fire("prerender"))},endUpdate:function(){var e=this;e.sign&&(e.rendered||e.fire("primed",0,1),e.rendered=!0,e.fire("rendered"))},notifyUpdate:function(){var e=this;return e.sign&&(e.sign++,e.fire("rendercall")),e.sign},wrapMxEvent:function(e){return(e+"").replace(m,"$&"+this.id+p)},setViewHTML:function(e){var t,r=this;r.beginUpdate(),r.sign&&(t=r.$(r.id),t&&(t.innerHTML=e)),r.endUpdate()},observeLocation:function(e){var r,n=this;n.$ol||(n.$ol={keys:[]}),r=n.$ol;var i=r.keys;t.isObject(e)&&(r.pn=e.pathname,e=e.keys),e&&(r.keys=i.concat((e+"").split(s))),n.locationChange==f&&(n.locationChange=g)},olChanged:function(e){var t=this,r=t.$ol;if(r){var n=0;if(r.pn&&(n=e.isPathname()),!n){var i=r.keys;n=e.isParam(i)}return n}return 1},destroy:function(){var e=this;e.fire("refresh",0,1),e.fire("destroy",0,1,1),e.delegateEvents(1),e.sign=0},processEvent:function(e){var t=this;if(t.enableEvent&&t.sign){var r=e.info,n=e.se,i=d.get(r);i||(i=r.match(x),i={n:i[1],f:i[2],i:i[3],p:{}},i.i&&i.i.replace(w,function(e,t,r){i.p[t]=r}),d.set(r,i));var o=i.n+p+n.type,s=t[o];if(s){var c=y[i.f];c&&c.call(y,n),a(s,u({currentId:e.cId,targetId:e.tId,type:e.st,domEvent:n,params:i.p},y),t)}}},delegateEvents:function(e){var t=this,r=t.$evts,i=e?n.un:n.on,a=t.vom;for(var o in r)i.call(n,o,a)}});var C,M="?t="+e.now(),E={},S={};return $.prototype.fetchTmpl=function(t){var r=this,n="template"in r;if(n)t(r.template);else if(o(E,r.path))t(E[r.path]);else{if(!C){var s=r.path.substring(0,r.path.indexOf("/")),c=e.Config.packages[s];C=c.base||c.path}var f=C+r.path+".html",u=S[f],l=function(e){t(E[r.path]=e)};u?u.push(l):(u=S[f]=[l],i({url:f+M,success:function(e){a(u,e),delete S[f]},error:function(e,t){a(u,t),delete S[f]}}))}},$.extend=function(t,r,n){var i=this,o=function(){o.superclass.constructor.apply(this,arguments),r&&a(r,arguments,this)};return o.extend=i.extend,e.extend(o,i,t,n)},$},{requires:["magix/magix","magix/event","magix/body","ajax"]}),KISSY.add("magix/vom",function(e,t,r,n){var i=r.has,a=r.mix,o=0,s=0,c=0,f=0,u={},l={},v=r.mix({all:function(){return u},add:function(e){i(u,e.id)||(o++,u[e.id]=e,e.owner=v,v.fire("add",{vframe:e}))},get:function(e){return u[e]},remove:function(e,t){var r=u[e];r&&(o--,t&&s--,delete u[e],v.fire("remove",{vframe:r}))},vfCreated:function(){if(!f){s++;var e=s/o;e>c&&v.fire("progress",{percent:c=e},f=1==e)}},root:function(){return t.root(v,l)},locChged:function(e){var t,r=e.loc;if(r?t=1:r=e.location,a(l,r),!t){var n=v.root(),i=e.changed;i.isView()?n.mountView(r.view):n.locChged(r,i)}}},n);return v},{requires:["magix/vframe","magix/magix","magix/event"]}),KISSY.add("mxext/mmanager",function(e,t,r){var n=t.has,i=t.safeExec,a=t.mix,o=function(e){var r=this;r.$mClass=e,r.$mCache=t.cache(),r.$mCacheKeys={},r.$mMetas={}},s=[].slice,c={urlParams:1,postParams:1,cacheKey:1,cacheTime:1,before:1,after:1},f=function(e,t,r){return function(){return e.apply(t,[t,r].concat(s.call(arguments)))}},u=function(e,t){if(t)for(var r=e.length-1;r>-1;r--)u(e[r]);else{var n=e.$mm;!e.fromCache&&n.used>0&&(e.fromCache=!0),n.used++}};a(o,{create:function(e){if(!e)throw Error("MManager.create:modelClass ungiven");return new o(e)}});var l={ALL:1,ONE:2,ORDER:4},v=Date.now||function(){return+new Date},h=function(e){this.$host=e,this.$doTask=!1,this.$reqModels={}},d="_before",m="_after";return a(h.prototype,{send:function(e,r,a,o){var s=this;if(s.$doTask)return s.next(function(){this.send(e,r,a,o)}),s;s.$doTask=!0;var c=s.$host,h=c.$mCache,d=c.$mCacheKeys,m=s.$reqModels;t.isArray(e)||(e=[e]);var p,g=e.length,y=0,x=Array(g),w=[],b={},$=[],C=t.isArray(r);C&&(w=Array(r.length));for(var M,E=function(e,t,o,f){if(!s.$destroy){y++,delete m[e.id];var M=e.$mm,E=M.cacheKey;if(x[t]=e,o)p=!0,b.latestMsg=o,b.currentMsg=o,b[t]=o;else if(b.currentMsg="",!E||E&&!h.has(E)){E&&h.set(E,e),M.doneAt=v();var S=M.after,T=M.meta;S&&i(S,[e,T]),c.fireAfter(T.name,[e])}if(a==l.ONE){var I=C?r[t]:r;I&&(u(e),w[t]=i(I,[b,e],s))}else if(a==l.ORDER){$[t]={m:e,e:p,s:o};for(var O,P,V=$.i||0;O=$[V];V++)P=C?r[V]:r,u(O.m),O.e?(b.latestMsg=O.s,b.currentMsg=O.s):b.currentMsg="",w[V]=i(P,[b,O.m].concat(w),s),O.e&&(b[V]=O.s,$.e=1);$.i=V}if(y>=g&&(p&&(b.currentMsg=b.latestMsg),a==l.ALL?(u(x,1),x.unshift(b),w[0]=b,w[1]=i(r,x,s)):w.unshift(b),s.$ntId=setTimeout(function(){s.doNext(w)},30)),E&&n(d,E)){var A=d[E].q;delete d[E],i(A,[f,o],e)}}},S=0;e.length>S;S++){if(M=e[S],!M)throw Error("miss attrs:"+e);var T,I=c.getModel(M,o),O=I.cacheKey;T=I.entity;var P=f(E,T,S);O&&n(d,O)?d[O].q.push(P):I.needUpdate?(m[T.id]=T,O&&(d[O]={q:[],e:T}),T.request(P)):P()}return s},fetchAll:function(e,t){return this.send(e,t,l.ALL)},saveAll:function(e,t){return this.send(e,t,l.ALL,1)},fetchOrder:function(e,t){var r=s.call(arguments,1);return this.send(e,r.length>1?r:t,l.ORDER)},saveOrder:function(e,t){var r=s.call(arguments,1);return this.send(e,r.length>1?r:t,l.ORDER,1)},saveOne:function(e,t){var r=s.call(arguments,1);return this.send(e,r.length>1?r:t,l.ONE,1)},fetchOne:function(e,t){var r=s.call(arguments,1);return this.send(e,r.length>1?r:t,l.ONE)},abort:function(){var e=this;clearTimeout(e.$ntId);var t=e.$host,r=e.$reqModels,a=t.$mCacheKeys;if(r)for(var o in r){var s=r[o],c=s.$mm.cacheKey;if(c&&n(a,c)){var f=a[c];delete a[c],i(f,[!0,s,"aborted"],s)}s.abort()}e.$reqModels={},e.$queue=[],e.$doTask=!1},next:function(e){var t=this;if(t.$queue||(t.$queue=[]),t.$queue.push(e),!t.$doTask){var r=t.$latest||[];t.doNext.apply(t,[r])}return t},doNext:function(e){var t=this;t.$doTask=!1;var r=t.$queue;if(r){var n=r.shift();n&&i(n,e,t)}t.$latest=e},destroy:function(){var e=this;e.$destroy=!0,e.abort()}}),a(o.prototype,{registerModels:function(e){var r=this,n=r.$mMetas;t.isArray(e)||(e=[e]);for(var i,a,o=0;e.length>o;o++){if(i=e[o],a=i.name,i&&!a)throw Error("miss name attribute");if(n[a])throw Error("already exist:"+a);n[a]=i}},registerMethods:function(e){var t=this;a(t,e)},createModel:function(e){var r=this,n=r.getModelMeta(e),a=new r.$mClass;a.set(n,c),a.$mm={used:0};var o=e.before||n.before;r.fireBefore(n.name,[a]),t.isFunction(o)&&i(o,[a,n,e]);var s=e.after||n.after;a.$mm.after=s;var f=e.cacheKey||n.cacheKey;return t.isFunction(f)&&(f=i(f,[n,e])),a.$mm.cacheKey=f,a.$mm.meta=n,a.set(e,c),a.setUrlParams(n.urlParams),a.setPostParams(n.postParams),a.setUrlParams(e.urlParams),a.setPostParams(e.postParams),a},getModelMeta:function(e){var r,n=this,i=n.$mMetas;r=t.isString(e)?e:e.name;var a=i[r];if(!a)throw Error("Not found:"+e.name);return a},getModel:function(e,t){var r,n,i=this;return t||(r=i.getCachedModel(e)),r||(n=!0,r=i.createModel(e)),{entity:r,cacheKey:r.$mm.cacheKey,needUpdate:n}},saveAll:function(e,t){return new h(this).saveAll(e,t)},fetchAll:function(e,t){return new h(this).fetchAll(e,t)},saveOrder:function(){var e=new h(this);return e.saveOrder.apply(e,arguments)},fetchOrder:function(){var e=new h(this);return e.fetchOrder.apply(e,arguments)},saveOne:function(){var e=new h(this);return e.saveOne.apply(e,arguments)},fetchOne:function(){var e=new h(this);return e.fetchOne.apply(e,arguments)},createMRequest:function(){return new h(this)},clearCacheByKey:function(e){var t=this,r=t.$mCache;r.del(e)},clearCacheByName:function(e){for(var t=this,r=t.$mCache,n=r.c,i=0;n.length>i;i++){var a=n[i],o=a.v,s=o&&o.$mm;if(s){var c=s.meta.name;c==e&&r.del(s.cacheKey)}}},getModelUrl:function(e){var t=this,r=t.getModelMeta(e);return r.url?r.url:void 0},listenBefore:function(e,t){r.on.call(this,e+d,t)},listenAfter:function(e,t){r.on.call(this,e+m,t)},unlistenBefore:function(e,t){r.un.call(this,e+d,t)},unlistenAfter:function(e,t){r.un.call(this,e+m,t)},fireBefore:function(e,t){r.fire.call(this,e+d,t)},fireAfter:function(e,t){r.fire.call(this,e+m,t)},getCachedModel:function(e){var r,n,a=this,o=a.$mCache,s=null;if(t.isString(e)?r=e:(n=a.getModelMeta(e),r=e.cacheKey||n.cacheKey,t.isFunction(r)&&(r=i(r,[n,e]))),r){var c=a.$mCacheKeys,f=c[r];if(f)s=f.e;else if(s=o.get(r)){n||(n=s.$mm.meta);var u=e.cacheTime||n.cacheTime||0;t.isFunction(u)&&(u=i(u,[n,e])),u>0&&v()-s.$mm.doneAt>u&&(a.clearCacheByKey(r),s=null)}}return s}}),o},{requires:["magix/magix","magix/event"]}),KISSY.add("mxext/model",function(e,t){var r=function(r,n){var i=function(){i.superclass.constructor.apply(this,arguments),n&&t.safeExec(n,[],this)};return t.mix(i,this,{prototype:!0}),e.extend(i,this,r)},n=+new Date,i=function(e){e&&this.set(e),this.id="m"+n--},a=encodeURIComponent;return t.mix(i,{GET:"GET",POST:"POST",extend:r}),t.mix(i.prototype,{sync:t.noop,parse:function(e){return e},getPostParams:function(){return this.getParams(i.POST)},getUrlParams:function(){return this.getParams(i.GET)},getParams:function(e){var r=this;e=e?e.toUpperCase():i.GET;var n,o="$"+e,s=r[o],c=[];if(s)for(var f in s)if(n=s[f],t.isArray(n))for(var u=0;n.length>u;u++)c.push(f+"="+a(n[u]));else c.push(f+"="+a(n));return c.join("&")},setUrlParamsIf:function(e,t){this.setParams(e,t,i.GET,!0)},setPostParamsIf:function(e,t){var r=this;r.setParams(e,t,i.POST,!0)},setParams:function(e,r,n,a){n=n?n.toUpperCase():i.GET;var o=this;o.$types||(o.$types={}),o.$types[n]=!0;var s="$"+n;if(o[s]||(o[s]={}),t.isObject(e))for(var c in e)a&&o[s][c]||(o[s][c]=e[c]);else e&&(a&&o[s][e]||(o[s][e]=r))},setPostParams:function(e,t){var r=this;r.setParams(e,t,i.POST)},setUrlParams:function(e,t){this.setParams(e,t,i.GET)},reset:function(){var e=this,r=e.$types;if(r){for(var n in r)t.has(r,n)&&delete e["$"+n];delete e.$types}var i=e.$keys,a=e.$attrs;if(i){for(var o=0;i.length>o;o++)delete a[i[o]];delete e.$keys}},get:function(e){var t=this,r=!arguments.length,n=t.$attrs;return n?r?n:n[e]:null},set:function(e,r,n){var i=this;if(i.$attrs||(i.$attrs={}),n&&!i.$keys&&(i.$keys=[]),t.isObject(e)){t.isObject(r)||(r={});for(var a in e)n&&i.$keys.push(a),t.has(r,a)||(i.$attrs[a]=e[a])}else e&&(n&&i.$keys.push(e),i.$attrs[e]=r)},request:function(e,r){e||(e=function(){});var n=this;n.$abort=!1;var i=function(i,a){if(!n.$abort)if(i)e(i,a,r);else{if(a){var o=n.parse(a);t.isObject(o)||(o={data:o}),n.set(o,null,!0)}e(i,a,r)}};n.$trans=n.sync(i,r)},abort:function(){var e=this,t=e.$trans;t&&t.abort&&t.abort(),delete e.$trans,e.$abort=!0},isAborted:function(){return this.$abort}}),i},{requires:["magix/magix"]}),KISSY.add("mxext/view",function(e,t,r,n){var i=window,a=function(e){i.clearTimeout(e),i.clearInterval(e)},o=function(e){c(e.destroy,[],e)},s=0,c=t.safeExec,f=t.has,u=r.extend({mxViewCtor:t.noop,navigate:function(){n.navigate.apply(n,arguments)},manage:function(e,r){var n=this,i=arguments,c=!0;1==i.length&&(r=e,e="res_"+s++,c=!1),n.$res||(n.$res={});var f;t.isNumber(r)?f=a:r&&r.destroy&&(f=o);var u={hasKey:c,res:r,destroy:f};return n.$res[e]=u,r},getManaged:function(e){var t=this,r=t.$res;if(t.sign,r&&f(r,e)){var n=r[e],i=n.res;return i}return null},removeManaged:function(e){var t=this,r=null,n=t.$res;if(n)if(f(n,e))r=n[e].res,delete n[e];else for(var i in n)if(n[i].res===e){r=n[i].res,delete n[i];break}return r},destroyManaged:function(e){var t=this,r=t.$res;if(r){for(var n in r){var i=r[n],a=i.res,o=i.destroy,s=!1;o&&(o(a),s=!0),i.hasKey||delete r[n],t.fire("destroyManaged",{resource:a,processed:s})}"destroy"==e.type&&delete t.$res}},destroyMRequest:function(){var e=this,t=e.$res;if(t)for(var r in t){var n=t[r],i=n.res;i&&i.fetchOne&&i.fetchAll&&(i.destroy(),delete t[r])}}},function(){var e=this;e.on("interact",function(){e.on("rendercall",e.destroyMRequest),e.on("prerender",e.destroyManaged),e.on("destroy",e.destroyManaged)}),e.mxViewCtor()});return u},{requires:["magix/magix","magix/view","magix/router"]});