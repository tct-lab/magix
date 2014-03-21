define("magix/magix",function(){var e=/\/\.\/|\/[^\/.]+?\/\.{2}\/|([^:\/])\/\/+|\.{2}\//,t=/\/[^\/]*$/,r=/[#?].*$/,n="",i=/([^=&?\/#]+)=?([^&=#?]*)/g,a="pathname",o=/^https?:\/\//i,s=0,c="/",f="vframe",u="\n",v=window.console,m=v&&v.error,h=function(){},d={tagName:f,rootId:"magix_vf_root",progress:h,coded:1,execError:function(e){m&&v.error(e)}},l=d.hasOwnProperty,p=function(e,t){return e?l.call(e,t):e},g=function(e){return function(t,r,n){switch(arguments.length){case 0:n=e;break;case 1:n=E._o(t)?w(e,t):p(e,t)?e[t]:null;break;case 2:null===r?(delete e[t],n=r):e[t]=n=r}return n}},x=function(e,t){return t.f==e.f?t.t-e.t:t.f-e.f},y=function(e,t){var r=this;return r.get?(r.c=[],r.x=e||20,r.b=r.x+(0|t||5),void 0):new y(e,t)},w=function(e,t,r){for(var n in t)r&&p(r,n)||(e[n]=t[n]);return e};w(y.prototype,{get:function(e){var t,r=this,n=r.c;return e=a+e,p(n,e)&&(t=n[e],t.f>=1&&(t.f++,t.t=s++,t=t.v)),t},list:function(){return this.c},set:function(e,t,r){var n=this,i=n.c,o=a+e,c=i[o];if(!p(i,o)){if(i.length>=n.b){i.sort(x);for(var f=n.b-n.x;f--;)c=i.pop(),delete i[c.k],c.m&&M(c.m,c.o,c)}c={},i.push(c),i[o]=c}return c.o=e,c.k=o,c.v=t,c.f=1,c.t=s++,c.m=r,t},del:function(e){e=a+e;var t=this.c,r=t[e];r&&(r.f=-1e5,r.v=n,delete t[e],r.m&&(M(r.m,r.o,r),r.m=n))},has:function(e){return e=a+e,p(this.c,e)}});var b=y(60),C=y(),M=function(e,t,r,n,i,a){for(E._a(e)||(e=[e]),t&&(E._a(t)||t.callee)||(t=[t]),n=0;e.length>n;n++)try{a=e[n],i=a&&a.apply(r,t)}catch(o){d.execError(o)}return i},E={mix:w,has:p,safeExec:M,noop:h,config:g(d),start:function(e){var t=this;w(d,e),t.use(["magix/router","magix/vom",d.iniFile],function(r,n,i){d=w(d,i,e),d["!tnc"]=d.tagName!=f,r.on("!ul",n.locChged),r.on("changed",n.locChged),n.on("progress",d.progress),t.use(d.extensions,r.start)})},keys:Object.keys||function(e){var t=[];for(var r in e)p(e,r)&&t.push(r);return t},local:g({}),path:function(i,a){var s=i+u+a,f=C.get(s);if(!f){if(o.test(a))f=a;else if(i=i.replace(r,n).replace(t,n)+c,a.charAt(0)==c){var v=o.test(i)?8:0,m=i.indexOf(c,v);f=i.substring(0,m)+a}else f=i+a;for(;e.test(f);)f=f.replace(e,"$1/");C.set(s,f)}return f},pathToObject:function(e,t){var s=e+u+t,f=b.get(s);if(!f){f={};var v={},m=n;r.test(e)?m=e.replace(r,n):~e.indexOf("=")||(m=e);var h=e.replace(m,n);if(m&&o.test(m)){var d=m.indexOf(c,8);m=~d?m.substring(d):c}h.replace(i,function(e,r,n){if(t)try{n=decodeURIComponent(n)}catch(i){}v[r]=n}),f[a]=m,f.params=v,b.set(s,f)}return f},objectToPath:function(e,t,r){var n,i=e[a],o=[],s=e.params;for(var c in s)n=s[c],(!r||n||p(r,c))&&(t&&(n=encodeURIComponent(n)),o.push(c+"="+n));return o.length&&(i=i+"?"+o.join("&")),i},listToMap:function(e,t){var r,n,i,a={};if(E._s(e)&&(e=e.split(",")),e&&(i=e.length))for(r=0;i>r;r++)n=e[r],a[t?n[t]:n]=t?n:1;return a},cache:y},P=Object.prototype.toString;return w(E,{use:function(e,t){$.isArray(e)||(e=[e]),e?require(e,t):t&&t()},_a:$.isArray,_f:$.isFunction,_o:function(e){return"[object Object]"==P.call(e)},_s:function(e){return"[object String]"==P.call(e)},_n:function(e){return"[object Number]"==P.call(e)},extend:function(e,t,r,n){e.superclass=t.prototype,t.prototype.constructor=t;var i=function(){};return i.prototype=t.prototype,e.prototype=new i,E.mix(e.prototype,r),E.mix(e,n),e.prototype.constructor=e,e}})}),define("magix/router",["magix/magix","magix/event"],function(e,t){var r,n,i,a,o=window,s="",c="pathname",f="view",u=e.has,v=e.mix,m=e.keys,h=e.config(),d=e.cache(),l=e.cache(40),p={params:{},href:s},g=/#.*$/,x=/^[^#]*#?!?/,y="params",w=h.nativeHistory,b=h.coded,C=function(t,r,n){if(t){n=this[y],e._s(t)&&(t=t.split(","));for(var i=0;t.length>i&&!(r=u(n,t[i]));i++);}return r},M=function(){return this[c]},E=function(){return this[f]},P=function(e,t,r,n){return r=this,n=r[y],arguments.length>1?n[e]=t:n[e]},_=function(t){var r=e.pathToObject(t,b),n=r[c];return n&&a&&(r[c]=e.path(o.location[c],n)),r},T=v({viewInfo:function(t,r){var i,a;if(!n){n={rs:h.routes||{},nf:h.notFoundView};var o=h.defaultView;n.dv=o;var f=h.defaultPathname||s;i=n.rs,n.f=e._f(i),n.f||i[f]||!o||(i[f]=o),n[c]=f}return t||(t=n[c]),i=n.rs,a=n.f?i.call(h,t,r):i[t],{view:a||n.nf||n.dv,pathname:t}},start:function(){var e=T,t=o.history;i=w&&t.pushState,a=w&&!i,i?e.useState():e.useHash(),e.route()},parseQH:function(e,t){e=e||o.location.href;var r=T,n=d.get(e);if(!n){var i=e.replace(g,s),a=e.replace(x,s),u=_(i),m=_(a),h={};v(h,u[y]),v(h,m[y]),n={get:P,set:P,href:e,refHref:p.href,srcQuery:i,srcHash:a,query:u,hash:m,params:h},d.set(e,n)}if(t&&!n[f]){var l;l=w?n.hash[c]||n.query[c]:n.hash[c];var b=r.viewInfo(l,n);v(n,b)}return n},getChged:function(e,t){var r=e.href,n=t.href,i=r+"\n"+n,a=l.get(i);if(!a){var o,s,u;a={},a[f]=u,a[c]=u,a[y]={};var v,h,d=[c,f];for(v=1;v>=0;v--)h=d[v],s=e[h],u=t[h],s!=u&&(a[h]={from:s,to:u},o=1);var p=e[y],g=t[y];for(d=m(p).concat(m(g)),v=d.length-1;v>=0;v--)h=d[v],s=p[h],u=g[h],s!=u&&(a[y][h]={from:s,to:u},o=1);a.occur=o,a.isParam=C,a.isPathname=M,a.isView=E,l.set(i,a)}return a},route:function(){var e=T,t=e.parseQH(0,1),n=!p.get,i=e.getChged(p,t);p=t,i.occur&&(r=t,e.fire("changed",{location:t,changed:i,force:n}))},navigate:function(t,n,o){var f=T;if(!n&&e._o(t)&&(n=t,t=s),n&&(t=e.objectToPath({params:n,pathname:t},b)),t){var m=_(t),h={};if(h[y]=v({},m[y]),h[c]=m[c],h[c]){if(a){var d=r.query[y];for(var l in d)u(d,l)&&!u(h[y],l)&&(h[y][l]=s)}}else{var p=v({},r[y]);h[y]=v(p,h[y]),h[c]=r[c]}var g,x=e.objectToPath(h,b,r.query[y]);g=i?x!=r.srcQuery:x!=r.srcHash,g&&(i?(f.poped=1,history[o?"replaceState":"pushState"](s,s,x),f.route()):(v(h,r,h),h.srcHash=x,h.hash={params:h[y],pathname:h[c]},f.fire("!ul",{loc:r=h}),x="#!"+x,o?location.replace(x):location.hash=x))}}},t);return T.useState=function(){var e=T,t=location.href;$(o).on("popstate",function(){var r=location.href==t;(e.poped||!r)&&(e.poped=1,e.route())})},T.useHash=function(){$(o).on("hashchange",T.route)},T}),define("magix/body",["magix/magix"],function(e){var t,r=e.has,n=e.mix,i={},a=document.body,o={},s=String.fromCharCode(26),c="mx-ei",f="mx-owner",u="addEventListener",v="removeEventListener",m=a[u],h={},d=65536,l="on",p=",",g=function(e){return e.id||(e.id="mx-e-"+d--)},x=function(e,t,r){return e&&e.setAttribute&&(r?e.setAttribute(t,r):r=e.getAttribute(t)),r},y=function(){this.returnValue=!1},w=function(){this.cancelBubble=!0},b={special:function(e){n(i,e)},process:function(e){if(e=e||window.event,e&&!e[l]){var n=e.target||e.srcElement||a;for(e[l]=1;n&&1!=n.nodeType;)n=n.parentNode;var i=n,o=e.type,u=h[o]||(h[o]=RegExp(p+o+"(?:,|$)"));if(!u.test(x(n,c))){for(var v,d,b="mx-"+o,$=[];i&&(v=x(i,b),d=x(i,c),!v&&!u.test(d));)$.push(i),i=i.parentNode;if(v){var C,M=v.split(s);if(M.length>1&&(C=M[0],v=M.pop()),C=C||x(i,f),!C)for(var E=i,P=t.all();E;){if(r(P,E.id)){x(i,f,C=E.id);break}E=E.parentNode}if(!C)throw Error("bad:"+v);var _=t.get(C),T=_&&_.view;T&&(m||(e.preventDefault=y,e.stopPropagation=w),T.pEvt({info:v,se:e,st:o,tId:g(n),cId:g(i)}))}else for(var O;$.length;)O=$.shift(),d=x(O,c)||l,u.test(d)||(d=d+p+o,x(O,c,d))}}},act:function(e,r,n){var s=o[e]||0,c=s>0?1:0,f=b.process;if(s+=r?-c:c,!s){n&&(t=n);var h=i[e];h?b.lib(a,e,r,f):m?a[r?v:u](e,f,!1):a[l+e]=r?null:f,r||(s=1)}o[e]=s}},C={focus:2,blur:2,mouseenter:2,mouseleave:2};return b.special(C),b.lib=function(e,t,r,n){var i=C[t];1==i?$(e)[r?"off":"on"](t,n):$(e)[(r?"un":"")+"delegate"]("[mx-"+t+"]",t,n)},b}),define("magix/event",["magix/magix"],function(e){var t=function(e){return"~"+e},r=e.safeExec,n={fire:function(e,n,i,a){var o=t(e),s=this,c=s[o];if(c){n||(n={}),n.type||(n.type=e);for(var f,u,v=c.length,m=v-1;v--;)f=a?v:m-v,u=c[f],(u.d||u.r)&&(c.splice(f,1),m--),u.d||r(u.f,n,s)}i&&delete s[o]},on:function(e,r,n){var i=t(e),a=this[i]||(this[i]=[]),o={f:r};isNaN(n)?(o.r=n,a.push(o)):a.splice(0|n,0,o)},off:function(e,r){var n=t(e),i=this[n];if(i)if(r){for(var a,o=i.length-1;o>=0;o--)if(a=i[o],a.f==r&&!a.d){a.d=1;break}}else delete this[n]},once:function(e,r){this.on(e,r,t)}};return n}),define("magix/vframe",["magix/magix","magix/event","magix/view"],function(e,t,r){var n,i,a,o,s,c=document,f=c.body,u=65536,v=e.safeExec,m=[],h=e.mix,d=e.config("tagName"),l=e.config("rootId"),p=e.config("!tnc"),g=e.has,x=p?"mx-vframe":"mx-defer",y=f.contains,w=p&&f.querySelectorAll,b=" "+d+"[mx-vframe]",$="alter",C="created",M=function(e){return"object"==typeof e?e:c.getElementById(e)},E=function(e,t,r){return t=M(e),t&&(r=w?c.querySelectorAll("#"+t.id+b):t.getElementsByTagName(d)),r||m},P=function(e){return e.id||(e.id="magix_vf_"+u--)},_=function(e,t,r){if(e=M(e),t=M(t),e&&t)if(e!==t)try{r=y?t.contains(e):16&t.compareDocumentPosition(e)}catch(n){r=0}else r=1;return r},T=function(e){var t=this;t.id=e,t.cM={},t.cC=0,t.rC=0,t.sign=1<<30,t.rM={},t.owner=s};return h(T,{root:function(e,t,r){if(!n){a=t,o=r,s=e;var i=M(l);i||(i=c.createElement(d),i.id=l,f.appendChild(i)),n=new T(l),e.add(n)}return n}}),h(h(T.prototype,t),{mountView:function(t,n){var i=this,c=M(i.id);if(c._bak?c._chgd=1:(c._bak=1,c._tmpl=c.innerHTML),i.unmountView(),t){var f=e.pathToObject(t),u=f.pathname,v=--i.sign;e.use(u,function(e){if(v==i.sign){r.prepare(e);var t=new e({owner:i,id:i.id,$:M,path:u,vom:s,location:a});i.view=t,t.on("interact",function(e){e.tmpl||(c._chgd&&(c.innerHTML=c._tmpl),i.mountZoneVframes()),t.on("primed",function(){i.viewPrimed=1,i.fire("viewMounted")}),t.on("rendered",function(){i.mountZoneVframes()}),t.on("prerender",function(){i.unmountZoneVframes(0,1)||i.cAlter()})},0),n=n||{},t.load(h(n,f.params,n),o)}})}},unmountView:function(){var e=this,t=e.view;if(t){i||(i={}),e.unmountZoneVframes(0,1),e.cAlter(i),delete e.view,t.oust();var r=M(e.id);r&&r._bak&&(r.innerHTML=r._tmpl),delete e.viewInited,e.viewPrimed&&(delete e.viewPrimed,e.fire("viewUnmounted")),i=0}e.sign--},mountVframe:function(e,t,r){var n=this;n.fcc&&n.cAlter();var i=s.get(e);return i||(i=new T(e),i.pId=n.id,g(n.cM,e)||n.cC++,n.cM[e]=1,s.add(i)),i.mountView(t,r),i},mountZoneVframes:function(e,t){var r=this,n=e||r.id;r.unmountZoneVframes(n,1);var i=E(n),a=i.length,o={};if(a)for(var s,c,f,u,v=0;a>v;v++)if(s=i[v],c=P(s),!g(o,c)&&(f=s.getAttribute("mx-view"),u=!s.getAttribute(x),u=u!=p,u||f)){r.mountVframe(c,f,t);for(var m,h=E(s),d=0,l=h.length;l>d;d++)m=h[d],o[P(m)]=1}r.cCreated()},unmountVframe:function(e,t){var r=this;e=e||r.id;var n=s.get(e);if(n){var i=n.fcc;n.unmountView(),s.remove(e,i);var a=s.get(n.pId);a&&g(a.cM,e)&&(delete a.cM[e],a.cC--,t||a.cCreated())}},unmountZoneVframes:function(e,t){var r,n,i=this,a=i.cM;for(n in a)e?_(n,e)&&i.unmountVframe(n,r=1):i.unmountVframe(n,r=1);return t||i.cCreated(),r},cCreated:function(e){var t=this;if(t.cC==t.rC){var r=t.view;r&&!t.fcc&&(t.fcc=1,delete t.fca,r.fire(C,e),t.fire(C,e)),s.vfCreated();var n=t.id,i=s.get(t.pId);i&&!g(i.rM,n)&&(i.rM[n]=i.cM[n],i.rC++,i.cCreated(e))}},cAlter:function(e){var t=this;e||(e={});var r=t.fcc;if(delete t.fcc,!t.fca&&r){var n=t.view,i=t.id;n&&(t.fca=1,n.fire($,e),t.fire($,e));var a=s.get(t.pId);a&&g(a.rM,i)&&(a.rC--,delete a.rM[i],a.cAlter(e))}},locChged:function(){var t=this,r=t.view;if(t.viewInited&&r.sign>0){var n=r.olChg(o),i={location:a,changed:o,prevent:function(){this.cs=m},to:function(t){t=t||m,e._s(t)&&(t=t.split(",")),this.cs=t}};n&&v(r.locationChange,i,r);for(var c,f=i.cs||e.keys(t.cM),u=0,h=f.length;h>u;u++)c=s.get(f[u]),c&&c.locChged()}}}),T}),define("magix/view",["magix/magix","magix/event","magix/body"],function(e,t,r){var n=e.safeExec,i=e.has,a=",",o=[],s=e.noop,c=e.mix,f="~",u=function(e){return function(){var t,r=this,n=r.notifyUpdate();return n&&(t=e.apply(r,arguments)),t}},v=e.cache(40),m="<",h=">",d=/\smx-(?!view|defer|owner|vframe)[a-z]+\s*=\s*"/g,l=String.fromCharCode(26),p={prevent:function(e){e=e||this.srcEvent,e.preventDefault()},stop:function(e){e=e||this.srcEvent,e.stopPropagation()},halt:function(e){this.prevent(e),this.stop(e)}},g=/(\w+)(?:<(\w+)>)?(?:\(?{([\s\S]*)}\)?)?/,x=/(\w+):([^,]+)/g,y=/([$\w]+)<([\w,]+)>/,w=function(e){var t=this;c(t,e),t.$ol={ks:[]},t.sign=1,n(w.ms,[e],t)};w.ms=[],w.prepare=function(e){if(!e[f]){e[f]=1;var t,r,n,i,o,c=e.prototype,v={};for(var d in c)if(t=c[d],r=d.match(y))for(n=r[1],i=r[2],i=i.split(a),o=i.length-1;o>-1;o--)r=i[o],v[r]=1,c[n+m+r+h]=t;else"render"==d&&t!=s&&(c[d]=u(t));i&&(c.$evts=v)}},w.mixin=function(e,t){t&&w.ms.push(t),c(w.prototype,e)},c(c(w.prototype,t),{render:s,locationChange:s,init:s,hasTmpl:!0,load:function(){var e=this,t=e.hasTmpl,r=arguments,i=e.sign,a=function(a){if(i>0&&i==e.sign){t&&(e.template=e.wrapMxEvent(a)),e.dEvts(),e.fire("interact",{tmpl:t},1),n(e.init,r,e),e.fire("inited",0,1),e.owner.viewInited=1,n(e.render,o,e);var s=!t&&!e.rendered;s&&(e.rendered=1,e.fire("primed",0,1))}};t?e.fetchTmpl(e.path,a):a()},beginUpdate:function(){var e=this;e.sign>0&&e.rendered&&(e.fire("refresh",0,1),e.fire("prerender"))},endUpdate:function(){var e=this;e.sign>0&&(e.rendered||(e.fire("primed",0,1),e.rendered=1),e.fire("rendered"))},notifyUpdate:function(){var e=this;return e.sign>0&&(e.sign++,e.fire("rendercall")),e.sign},wrapMxEvent:function(e){return(e+"").replace(d,"$&"+this.id+l)},wrapAsync:function(e){var t=this,r=t.sign;return function(){r==t.sign&&e&&e.apply(this,arguments)}},setViewHTML:function(e){var t,r=this;r.beginUpdate(),r.sign>0&&(t=r.$(r.id),t&&(t.innerHTML=e)),r.endUpdate()},observeLocation:function(t){var r,n=this;r=n.$ol,r.f=1;var i=r.ks;e._o(t)&&(r.pn=t.pathname,t=t.keys),t&&(r.ks=i.concat((t+"").split(a)))},olChg:function(e){var t=this,r=t.$ol,n=1;return r.f&&(n=0,r.pn&&(n=e.pathname),n||(n=e.isParam(r.ks))),n},oust:function(){var e=this;e.sign>0&&(e.sign=0,e.fire("refresh",0,1),e.fire("destroy",0,1,1),e.dEvts(1)),e.sign--},pEvt:function(e){var t=this;if(t.sign>0){var r=e.info,i=e.se,a=v.get(r);a||(a=r.match(g),a={n:a[1],f:a[2],i:a[3],p:{}},a.i&&a.i.replace(x,function(e,t,r){a.p[t]=r}),v.set(r,a));var o=a.n+m+e.st+h,s=t[o];if(s){var c=p[a.f];c&&c.call(p,i),n(s,{currentId:e.cId,targetId:e.tId,type:e.st,srcEvent:i,halt:p.halt,prevent:p.prevent,stop:p.stop,params:a.p},t)}}},dEvts:function(e){var t=this,n=t.$evts,i=t.vom;for(var a in n)r.act(a,e,i)}});var b={},C="?t="+Math.random(),M={},E={};return w.prototype.fetchTmpl=function(e,t){var r=this,a="template"in r;if(a)t(r.template);else if(i(M,e))t(M[e]);else{var o=e.indexOf("/"),s=e.substring(0,o);b[s]||(b[s]=require.s.contexts._.config.paths[s]);var c=b[s]+e.substring(o+1)+".html",f=E[c],u=function(r){t(M[e]=r)};f?f.push(u):(f=E[c]=[u],$.ajax({url:c+C,success:function(e){n(f,e),delete E[c]},error:function(e,t){n(f,t),delete E[c]}}))}},w.extend=function(t,r,i){var a=this,o=function(){o.superclass.constructor.apply(this,arguments),r&&n(r,arguments,this)};return o.extend=a.extend,e.extend(o,a,t,i)},w}),define("magix/vom",["magix/vframe","magix/magix","magix/event"],function(e,t,r){var n=t.has,i=t.mix,a=0,o=0,s=0,c=0,f={},u={},v={},m=t.mix({all:function(){return f},add:function(e){n(f,e.id)||(a++,f[e.id]=e,m.fire("add",{vframe:e}))},get:function(e){return f[e]},remove:function(e,t){var r=f[e];r&&(a--,t&&o--,delete f[e],m.fire("remove",{vframe:r}))},vfCreated:function(){if(!c){o++;var e=o/a;e>s&&m.fire("progress",{percent:s=e},c=1==e)}},locChged:function(t){var r,n=t.loc;if(n?r=1:n=t.location,i(u,n),!r){i(v,t.changed);var a=e.root(m,u,v);v.view?a.mountView(n.view):a.locChged()}}},r);return m}),define("mxext/mmanager",["magix/magix","magix/event"],function(e,t){var r=e.has,n=e.safeExec,i=e._a,a=e.mix,o="mr",s=String.fromCharCode(26),c=12e5,f=function(e,t,r){t=[];for(r in e)t.push(r,o,e[r]);return t},u=function(e,t,r){for(var n,i=[t.name],a={},o=e.length-1;o>-1;o--)n=e[o],a[n]?e.splice(o,1):i.push(a[n]=f(t[n]),f(r[n]));return i.join(s)},v=function(e){var t=e.cache;if(t){var r=0|e.cacheTime;t=r?r:t===!0?c:0|t}return t},m=Date.now||function(){return+new Date},h=m(),d=function(e){throw Error(e)},l=function(t,r){var a=this;a.$mClass=t,a.$mCache=e.cache(),a.$mCacheKeys={},a.$mMetas={},a.$sKeys=["postParams","urlParams"].concat(i(r)?r:[]),a.id="mm"+h--,n(l.ms,arguments,a)},p=[].slice,g=function(e,t,r){return function(){return e.apply(t,[t,r].concat(p.call(arguments)))}},x=function(e,t,r){var i=r.key,a=r.cKeys,o=a[i];if(o){var s=o.q;delete a[i],n(s,e)}},y=function(e){return function(){var t=new $(this),r=arguments,n=r[r.length-1];return n&&n.manage&&(n.manage(t),r=p.call(r,0,-1)),t[e].apply(t,r)}},w=function(e,t){return function(r,n){var i=p.call(arguments,1);return this.send(r,i.length>1?i:n,e,t)}};a(l,{create:function(e,t){return e||d("ungiven modelClass"),new l(e,t)},mixin:function(e,t){t&&l.ms.push(t),a(l.prototype,e)},ms:[]});var b={ALL:1,ONE:2,ORDER:4},$=function(e){this.$host=e,this.$busy=0,this.$reqs={},this.id=o+h--};return a($.prototype,{send:function(e,t,a,o){var s=this;if(s.$busy)return s.next(function(){this.send(e,t,a,o)}),s;s.$busy=1;var c=s.$host,f=c.$mCache,u=c.$mCacheKeys,v=s.$reqs;i(e)||(e=[e]);var h,l,p,y=e.length,w=0,$=Array(y),C=[],M={},E=[],P=i(t);P&&(C=Array(t.length));for(var _,T=function(e,r,i){if(!s.$destroy){w++,delete v[e.id];var o=e.$mm,u=o.key;if($[r]=e,i)h=1,p=1,l=i,M.msg=i,M[r]=i;else{if(p=0,!u||u&&!f.has(u)){u&&f.set(u,e),o.done=m();var d=o.after,g=o.meta;d&&n(d,[e,g]),c.fire("done",{model:e,meta:g})}!e.fromCache&&o.used>0&&(e.fromCache=1),o.used++}if(a==b.ONE){var x=P?t[r]:t;x&&(C[r]=n(x,[p?M:null,e,M],s))}else if(a==b.ORDER){E[r]={m:e,e:p,s:i};for(var _,T,O=E.i||0;_=E[O];O++)T=P?t[O]:t,_.e&&(M.msg=_.s,M[O]=_.s),C[O]=n(T,[_.e?M:null,_.m,M].concat(C),s);E.i=O}w>=y&&(h||(M=null),a==b.ALL?($.unshift(M),C[0]=M,C[1]=n(t,$,s)):C.unshift(M),s.$ntId=setTimeout(function(){s.doNext(C)},30))}},O=0;e.length>O;O++)if(_=e[O]){var V=c.getModel(_,o),I=V.cKey,k=V.entity,A=g(T,k,O);A.id=s.id,I&&r(u,I)?u[I].q.push(A):V.update?(v[k.id]=k,I&&(u[I]={q:[A],e:k},A=x),k.request(A,{key:I,cKeys:u})):A()}else d("empty model");return s},fetchAll:function(e,t){return this.send(e,t,b.ALL)},saveAll:function(e,t){return this.send(e,t,b.ALL,1)},fetchOrder:w(b.ORDER),saveOrder:w(b.ORDER,1),saveOne:w(b.ONE,1),fetchOne:w(b.ONE),abort:function(){var e=this;clearTimeout(e.$ntId);var t=e.$host,i=e.$reqs,a=t.$mCacheKeys;for(var o in i){var s=i[o],c=s.$mm.key;if(c&&r(a,c)){for(var f,u=a[c],v=u.q,m=[],h=[],d=0;v.length>d;d++)f=v[d],f.id!=e.id?m.push(f):e.$destroy||h.push(f);n(h,["abort"],e),m.length?u.q=m:s.abort()}else s.abort()}e.$reqs={},e.$queue=[],e.$busy=0},next:function(e){var t=this;if(t.$queue||(t.$queue=[]),t.$queue.push(e),!t.$busy){var r=t.$latest;t.doNext(r)}return t},doNext:function(e){var t=this;t.$busy=0;var r=t.$queue;if(r){var i=r.shift();i&&n(i,e,t)}t.$latest=e},destroy:function(){var e=this;e.$destroy=1,e.abort()}}),a(a(l.prototype,t),{registerModels:function(e){var t=this,r=t.$mMetas;i(e)||(e=[e]);for(var n,a,o=0;e.length>o;o++)n=e[o],n&&(a=n.name,a?r[a]&&d("already exist:"+a):d("miss name"),n.cache=v(n),r[a]=n)},registerMethods:function(e){a(this,e)},createModel:function(e){var t,r=this,i=r.getModelMeta(e),a=v(e)||i.cache,o=new r.$mClass;o.set(i),o.$mm=t={used:0};var s=e.before||i.before;s&&n(s,[o,i]);var c=e.after||i.after;return t.after=c,a&&(t.key=u(r.$sKeys,i,e)),t.meta=i,o.set(e),o.setUrlParams(i.urlParams),o.setPostParams(i.postParams),o.setUrlParams(e.urlParams),o.setPostParams(e.postParams),r.fire("inited",{model:o,meta:i}),o},getModelMeta:function(t){var r,n=this,i=n.$mMetas;r=e._s(t)?t:t.name;var a=i[r];return a||d("Unfound:"+r),a},getModel:function(e,t){var r,n,i=this;return t||(r=i.getCachedModel(e)),r||(n=1,r=i.createModel(e)),{entity:r,cKey:r.$mm.key,update:n}},saveAll:y("saveAll"),fetchAll:y("fetchAll"),saveOrder:y("saveOrder"),fetchOrder:y("fetchOrder"),saveOne:y("saveOne"),fetchOne:y("fetchOne"),createMRequest:function(e){var t=new $(this);return e&&e.manage&&e.manage(t),t},clearCacheByKey:function(e){var t=this,r=t.$mCache;r.del(e)},clearCacheByName:function(e){for(var t=this,r=t.$mCache,n=r.list(),i=0;n.length>i;i++){var a=n[i],o=a.v,s=o&&o.$mm;if(s){var c=s.meta.name;c==e&&r.del(s.key)}}},getCachedModel:function(e){var t,r=this,n=r.$mCache,i=null,a=r.getModelMeta(e),o=v(e)||a.cache;if(o&&(t=u(r.$sKeys,a,e)),t){var s=r.$mCacheKeys,c=s[t];c?i=c.e:(i=n.get(t),i&&o>0&&m()-i.$mm.done>o&&(r.clearCacheByKey(t),i=0))}return i}}),l}),define("mxext/model",["magix/magix"],function(e){var t=function(t,r){var n=this,i=function(){i.superclass.constructor.apply(this,arguments),r&&e.safeExec(r,arguments,this)};return e.mix(i,n,{prototype:!0}),e.extend(i,n,t)},r=+new Date,n=encodeURIComponent,i=e.has,a=e._o,o=e.toString,s=function(e){this.set(e),this.id="m"+r--};return e.mix(s,{GET:"GET",POST:"POST",extend:t}),e.mix(s.prototype,{sync:e.noop,getPostParams:function(){return this.getParams(s.POST)},getUrlParams:function(){return this.getParams(s.GET)},getParams:function(t){var r=this;t||(t=s.GET);var i,a="$"+t,o=r[a],c=[];for(var f in o){i=o[f],e._a(i)||(i=[i]);for(var u=0;i.length>u;u++)c.push(f+"="+n(i[u]))}return c.join("&")},setUrlParamsIf:function(e,t){this.setParams(e,t,s.GET,!0)},setPostParamsIf:function(e,t){var r=this;r.setParams(e,t,s.POST,!0)},setParams:function(e,t,r,n){var o=this,s="$"+r;o[s]||(o[s]={});var c=o[s];if(!a(e)&&e){var f={};f[e]=t,e=f}for(var u in e)n&&i(c,u)||(c[u]=e[u])},setPostParams:function(e,t){var r=this;r.setParams(e,t,s.POST)},setUrlParams:function(e,t){this.setParams(e,t,s.GET)},get:function(e,t,r){var n=this,i=arguments.length,a=2==i,s=n.$attrs;if(i){for(var c=(e+"").split(".");s&&c[0];)s=s[c.shift()];c[0]&&(s=r)}return a&&o.call(t)!=o.call(s)&&(s=t),s},set:function(e,t){var r=this;if(r.$attrs||(r.$attrs={}),a(e))for(var n in e)r.$attrs[n]=e[n];else e&&(r.$attrs[e]=t)},request:function(e,t){var r=this;r.$abt=0;var n=function(n,i){r.$abt?e("abort",null,t):n?e(n,i,t):(a(i)||(i={data:i}),r.set(i),e(n,i,t))};r.$trans=r.sync(n)},abort:function(){var e=this,t=e.$trans;t&&t.abort&&t.abort(),delete e.$trans,e.$abt=1},isAborted:function(){return this.$abt}}),s}),define("mxext/view",["magix/magix","magix/view","magix/router"],function(e,t,r){var n=window,i=0,a=e.safeExec,o=e.has,s=[],c="rendercall",f="destroy",u=function(e){n.clearTimeout(e),n.clearInterval(e)},v=function(e){a(e.destroy,s,e)},m=function(e){var t=this,r=t.$res,n=e.type==c,i=e.type!=f;for(var a in r){var o=r[a];(!n||o.mr)&&t.destroyManaged(a,i)}},h=t.extend({navigate:r.navigate,manage:function(t,r,n){var a=this,o=arguments,s=1,c=a.$res;if(1==o.length)r=t,t="res_"+i++,s=0;else{var f=c[t];f&&f.res!=r&&a.destroyManaged(t)}var m;e._n(r)?m=u:r&&r.destroy&&(m=v);var h={hk:s,res:r,ol:n,mr:r&&r.fetchOne,oust:m};return c[t]=h,r},getManaged:function(e,t){var r=this,n=r.$res,i=null;if(o(n,e)){var a=n[e];i=a.res,t&&delete n[e]}return i},removeManaged:function(e){return this.getManaged(e,1)},destroyManaged:function(e,t){var r,n=this,i=n.$res,a=i[e];if(a&&(!t||!a.ol)){r=a.res;var o=a.oust,s=0;o&&(o(r),s=1),a.hk&&t||delete i[e],n.fire("destroyManaged",{resource:r,processed:s})}return r}},function(){var e=this;e.$res={},e.on("interact",function(){e.on(c,m),e.on("prerender",m),e.on(f,m)}),a(h.ms,arguments,e)},{ms:[],mixin:function(t,r){r&&h.ms.push(r),e.mix(h.prototype,t)}});return h}),document.createElement("vframe");