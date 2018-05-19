/*!3.8.10 MIT kooboy_li@163.com*/define("magix",["$"],function(d){var v=d.isPlainObject,I=d.isArray,a=0,k="",l=[],V=",",S=null,f=window,o=void 0,n=document,g=d(n),u=f.setTimeout,r="changed",c="change",s="pageunload",A="value",T="mxs",m="#";function e(){}var b,i=JSON.stringify,y="\x1e",t="object",w="prototype",C="params",q="path",N="mx-view",h=/[#?].*$/,$=/([^=&?\/#]+)=?([^&#?]*)/g,p=/(?!^)=|&/,x=function(e){return(e||"mx_")+a++},j=x(),U={rootId:x(),defaultView:j,error:function(e){u(function(){throw e})}},E=function(e){return typeof e==t?e:n.getElementById(e)},P=function(e){return!e||typeof e!=t},H=function(e,t,n){var r,i,o,a=0;for(o in e)r=e[o],i=t[o],P(r)&&i===r||(a=n[o]=1),t[o]=r;return a},O=function(e,t,n){if(e=E(e),t=E(t),e&&t&&!(n=e==t))try{n=16==(16&t.compareDocumentPosition(e))}catch(e){}return n};function L(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])J(t,i)&&(e[i]=t[i]);return e}var Z,M=function(e,t,n){for(n in t=[],e)J(e,n)&&t.push(n);return t},R=U.hasOwnProperty,B=d("head"),D=function(e,t){t&&!D[e]&&(D[e]=1,B.append("<style>"+t))},z=function(e){return e.id||(e.$a=1,e.id=x())},F=function(e,t,n,r,i){t=t||l,I(e)||(e=[e]),I(t)||(t=[t]);for(var o=0,a=e;o<a.length;o++){i=a[o];try{r=i&&i.apply(n,t)}catch(e){U.error(e)}}return r},J=function(e,t){return e&&R.call(e,t)},Q=function(e,t,n){var r,i;if(!n&&P(t))(r=t+k)[0]==y&&(t=e[r]);else for(r in t)i=t[r],n&&!P(i)&&Q(e,i,n),r[0]==y&&(delete t[r],r=e[r]),t[r]=(i+k)[0]==y?e[i]:i;return t},X=function(e,t){return t.f-e.f||t.t-e.t};function _(e,t,n,r){(r=this).c=[],r.b=t||5,r.x=r.b+(e||20),r.r=n}L(_[w],{get:function(e){var t=this.c[y+e];return t&&(t.f++,t.t=a++,t=t.v),t},each:function(e,t,n){for(var r=0,i=(n=this).c;r<i.length;r++)e(i[r].v,t,n)},set:function(e,t){var n=this.c,r=y+e,i=n[r],o=this.b;if(!i){if(n.length>=this.x)for(n.sort(X);o--;)0<(i=n.pop()).f&&this.del(i.o);i={o:e},n.push(i),n[r]=i}i.v=t,i.f=1,i.t=a++},del:function(e){e=y+e;var t=this.c,n=t[e],r=this.r;n&&(n.f=-1,n.v=k,delete t[e],r&&F(r,n.o))},has:function(e){return J(this.c,y+e)}});var G=function(t,n){if(t)if(j==t)Z||(Z=jt.extend()),n(Z);else if(I(t))require(t,n);else try{n(require(t))}catch(e){require([t],n)}else n&&n()};function K(){}var W,Y=function(e,t,n,r,i){return K[w]=t[w],L(i=new K,n),L(e,r),(i.constructor=e)[w]=i,e},ee=d.find||d.zepto,te=ee.matchesSelector||ee.matches,ne=function(e,t){t=e.data,e.eventTarget=t.e,F(t.f,e,t.v)},re=function(e,t,n,r,i){i&&(t+="."+i.i),r?d(e).off(t,n):d(e).on(t,i,n)},ie=new _,oe=0,ae=function(e,t,n){try{n=decodeURIComponent(n)}catch(e){}W[t]=n},fe=function(e){var t,n=ie.get(e);return n||(W={},e==(t=e.replace(h,k))&&p.test(t)&&(t=k),e.replace(t,k).replace($,ae),ie.set(e,n={a:t,b:W})),{path:n.a,params:L({},n.b)}},ue=function(e,t,n){var r,i,o,a=[];for(i in t)r=t[i]+k,(!n||r||J(n,i))&&(r=encodeURIComponent(r),a.push(o=i+"="+r));return o&&(e+=(e&&(~e.indexOf("?")?"&":"?"))+a.join("&")),e},ce=function(e,t){var n,r={};if(e)for(var i=0,o=e;i<o.length;i++)n=o[i],r[t&&n?n[t]:n]=t?n:1+(0|r[n]);return r},se=new _,he=function(e,t,n){return se.has(e)?n=se.get(e):(n=F(Function("return "+e)),-1<e.indexOf(y)?Q(t,n,1):se.set(e,n)),n},de={config:function(e,t){return t=U,e&&(t=v(e)?L(t,e):t[e]),t},boot:function(t){L(U,t),G(U.ini,function(e){L(U,e,t),G(U.exts,function(){Re.on(r,Je),ye.on(r,Je),oe=1,Oe()})})},toMap:ce,toTry:F,toUrl:ue,parseUrl:fe,mix:L,has:J,keys:M,inside:O,node:E,applyStyle:D,guid:x,use:G,Cache:_,nodeId:z},$e={fire:function(e,t,n,r){var i,o,a,f,u=this,c=u[y+e];if(t||(t={}),t.type||(t.type=e),c)for(o=(i=c.length)-1;i--;)(f=c[a=r?i:o-i]).f?(f.x=1,F(f.f,t,u),f.x=k):f.x||(c.splice(a,1),o--);(c=u["on"+e])&&F(c,t,u),n&&u.off(e)},on:function(e,t){var n=y+e;(this[n]||(this[n]=[])).push({f:t})},off:function(e,t){var n,r=y+e,i=this[r];if(t){if(i)for(var o=0,a=i;o<a.length;o++)if((n=a[o]).f==t){n.f=k;break}}else delete this[r],delete this["on"+e]}};de.Event=$e;var ve={},le={},pe={},ge=0,me=function(e){for(var t=0,n=e=(e+k).split(",");t<n.length;t++){var r=n[t];J(le,r)?le[r]++:le[r]=1}return e},be=function(e){for(var t,n=0,r=e;n<r.length;n++)t=r[n],J(le,t)&&(--le[t]||(delete le[t],delete ve[t]))};var ye=L({get:function(e){var t=e?ve[e]:ve;return t},set:function(e){return ge=H(e,ve,pe)||ge,this},digest:function(e){e&&ye.set(e),ge&&(ge=0,this.fire(r,{keys:pe}),pe={})},diff:function(){return pe},clean:function(e){return{ctor:function(){e=me(e),this.on("destroy",function(){return be(e)})}}}},$e);de.State=ye;var we,xe="view",ke=new _,Ve=new _,Ae=f.location,Ie=0,Se={query:{},params:{},href:k},Te=/(?:^.*\/\/[^\/]+|#.*$)/gi,Ce=/^[^#]*#?!?/;function qe(e,t){return this[C][e]||t!==o&&t||k}var Ne,je,Ue,Ee,Pe,He=function(e,t){e="#!"+e,t?Ae.replace(e):Ae.hash=e},Oe=function(){var r,i,o=Ze().srcHash;re(f,"hashchange",function(e,t,n){i||(t=Ze(),(r=t.srcHash)!=o&&(n=function(){e.p=1,i=k,He(o=r),Me()},e={reject:function(){e.p=1,i=k,He(o)},resolve:n,prevent:function(){i=1}},Re.fire(c,e),i||e.p||n()))}),re(f,"beforeunload",function(e,t,n){if(e=e||f.event,t={},Re.fire(s,t),n=t.msg)return e&&(e.returnValue=n),n}),Me()},Le=n.title,Ze=function(e){e=e||Ae.href;var t,n,r,i,o=ke.get(e);return o||(o={get:qe,href:e,srcQuery:t=e.replace(Te,k),srcHash:n=e.replace(Ce,k),query:r=fe(t),hash:i=fe(n),params:L({},r[C],i[C])},oe&&(!function(e,t){if(Ne||(Ne=U.routes||{},je=U.unmatchView,Ue=U.defaultView,Ee=U.defaultPath||"/",Pe=U.rewrite),!e[xe]){var n=e.hash[q]||Ee;Pe&&(n=Pe(n,e[C],Ne)),t=Ne[n]||je||Ue,e[q]=n,e[xe]=t,v(t)&&L(e,t)}}(o),ke.set(e,o))),o},Me=function(){var e=Ze(),t=function(e,t){var n=e.href,r=t.href,i=n+y+r,o=Ve.get(i);if(!o){var a,f;o={params:f={},force:!n};for(var u=e[C],c=t[C],s=function(e){var t=u[e],n=c[e];t!=n&&(f[e]={from:t,to:n},a=1)},h=0,d=M(u).concat(M(c));h<d.length;h++)s(d[h]);u=e,c=t,f=o,s(q),s(xe),Ve.set(i,o={a:a,b:o})}return o}(Se,Se=e);return!Ie&&t.a&&((we=t.b)[q]&&(n.title=e.title||Le),Re.fire(r,we)),Ie=0,we},Re=L({parse:Ze,diff:Me,to:function(e,t,n,r){!t&&v(e)&&(t=e,e=k);var i,o,a,f,u=fe(e),c=u[C],s=u[q],h=Se[q],d=Se[C],$=Se.query[C];if(L(c,t),s)for(h in $)J(c,h)||(c[h]=k);else d&&(s=h,c=L({},d,c));o=Se,a=n,f=r,(i=ue(i=s,c,$))!=o.srcHash&&(Ie=f,He(i,a))}},$e);de.Router=Re;var Be,De,ze=0,Fe=function(e,t,n,r,i,o){if(e&&e.$a!=ze&&(n=e.$v)&&1<n.$a){(t?function(e,t,n){var r,i=e.$os;if(i)for(var o=0,a=i;o<a.length&&(r=a[o],!(n=J(t,r)));o++);return n}(n,t):Nt(n))&&n.$b();for(var a=0,f=e.children();a<f.length;a++)o=f[a],Fe(Qe[o],t)}},Je=function(e,t,n){t=Ke(),(n=e[xe])?t.mountView(n.to):(ze=a++,Fe(t,e.keys))},Qe={},Xe=function(e){if(!e.$b&&!e.$d&&e.$cc==e.$rc){e.$cr||(e.$cr=1,e.$ca=0,e.fire("created"));var t=e.id,n=e.pId,r=Qe[n];r&&!J(r.$e,t)&&(r.$e[t]=1,r.$rc++,Xe(r))}},_e=function(e,t){if(!e.$ca&&e.$cr){e.$cr=0,e.$ca=1,e.fire("alter",t);var n=e.id,r=e.pId,i=Qe[r];i&&J(i.$e,n)&&(i.$rc--,delete i.$e[n],_e(i,t))}},Ge=function(e,t,n,r){return r=(r=(r=Qe[e])&&r.$v)?r.$d.$a:{},0<t.indexOf(y)&&Q(r,n),r},Ke=function(e){return Be||(b=n.body,e=U.rootId,E(e)||(b.id=e),Be=new et(e)),Be},We=function(e,t){J(Qe,e)||(Qe[e]=t,et.fire("add",{vframe:t}),(e=E(e))&&(e.vframe=t))},Ye=[];function et(e,t,n){(n=this).id=e,n.$c={},n.$cc=0,n.$rc=0,n.$g=n.$g||1,n.$e={},n.$f=[],n.pId=t,We(e,n)}L(et,{all:function(){return Qe},get:function(e){return Qe[e]}},$e),L(et[w],$e,{mountView:function(e,t){var n,r,i,o,a,f=this,u=f.id,c=f.pId,s=f.$g,h=E(u);!f.$h&&h&&(f.$h=1,f.$i=h.innerHTML),f.unmountView(),f.$b=0,n=fe(e),i=n[q],h&&i&&(f[q]=e,r=++s,o=n[C],Ge(c,e,o),f.$j=n[q],L(o,t),G(i,function(e){if(r==f.$g){if(!e)return U.error(Error("id:"+u+" cannot load:"+i));a=qt(e),i=new e(u,f,o,a),f.$v=i,f.$a=ze,It(i),F(i.init,o,i),i.$b(),i.$e||(f.$h=0,i.$f||i.endUpdate())}}))},unmountView:function(){var e,t,n=this,r=n.$v,i=n.id;n.$f=[],r&&(De||(t=1,De={id:i}),n.$b=1,n.unmountZone(0,1),_e(n,De),(n.$v=0)<r.$a&&(r.$a=0,delete ot[i],delete at[i],r.fire("destroy",0,1,1),Vt(r,1),It(r,1),r.owner=0),r.$a--,(e=E(i))&&n.$h&&d(e).html(n.$i),t&&(De=0)),n.$g++},mountVframe:function(e,t,n){var r,i=this,o=i.id,a=i.$c;return _e(i,{id:e}),(r=Qe[e])||(J(a,e)||(i.$n=0,i.$cc++),a[e]=e,(r=Ye.pop())?et.call(r,e,o):r=new et(e,o)),r.mountView(t,n),r},mountZone:function(e,t){var n,r,i=this,o=[];e=e||i.id;var a,f=d("#"+e+" ["+N+"]");i.$d=1;for(var u=0,c=f;u<c.length;u++)(n=c[u]).$b||(r=z(n),n.$b=1,o.push([r,n.getAttribute(N)]));for(var s=0,h=o;s<h.length;s++)r=(a=h[s])[0],n=a[1],i.mountVframe(r,n);i.$d=0,t||Xe(i)},unmountVframe:function(e,t){var n,r,i,o;if(e=e?this.$c[e]:this.id,n=Qe[e]){var a=n.$cr,f=n.pId;n.unmountView(),i=a,(o=Qe[r=e])&&(delete Qe[r],et.fire("remove",{vframe:o,fcc:i}),(r=E(r))&&(r.$b=0,r.vframe=0,r.$a=0)),n.id=n.pId=n.$c=n.$e=0,n.$h=0,n.off("alter"),n.off("created"),Ye.push(n),(n=Qe[f])&&J(n.$c,e)&&(delete n.$c[e],n.$n=0,n.$cc--,t||Xe(n))}},unmountZone:function(e,t){var n;for(n in this.$c)(!e||n!=e&&O(n,e))&&this.unmountVframe(n,1);t||Xe(this)},parent:function(e,t){for(t=this,e=e>>>0||1;t&&e--;)t=Qe[t.pId];return t},children:function(e){return(e=this).$n||(e.$n=M(e.$c))},invoke:function(e,t){var n,r,i,o,a,f=this.$f;return(r=this.$v)&&r.$f?n=(i=r[e])&&F(i,t,r):((o=f[a=y+e])&&(o.r=t===o.a),o={n:e,a:t,k:a},f.push(o),f[a]=o),n}}),de.Vframe=et,d.fn.invokeView=function(e,t){for(var n,r=[],i=0;i<this.length;i++)n=this[i].vframe,r.push(n&&n.invoke(e,t));return r};var tt=new _(30,10),nt=/(?:([\w\-]+)\x1e)?([^(]+)\(([\s\S]*)?\)/,rt={},it={},ot={},at={},ft=0,ut=function(e,t){var n,r,i,o,a,f=[],u=e,c=e.getAttribute("mx-"+t),s=[],h=m,d=0;if(c&&((o=tt.get(c))||(o={v:(o=c.match(nt)||l)[1],n:o[2],i:o[3]},tt.set(c,o)),o=L({},o,{r:c})),o&&!o.v||it[t]){if((i=at[r=u.$d])&&1==i[u.$e]&&(a=1,h=r),!a){for(s.push(u);u!=b&&(u=u.parentNode);){if(Qe[r=u.id]||(i=at[r=u.$d])&&1==i[u.$e]){h=r;break}s.push(u)}for(var $=0,v=s;$<v.length;$++)c=v[$],(r=at[h])||(r=at[h]={}),r[i=c.$e||(c.$e=++ft)]=1,c.$d=h}if(h!=m){u=e.id,Qe[u]&&(d=h=u);do{if((n=Qe[h])&&(a=n.$v)){for(r in(i=a.$so)[t])i={r:r,v:h,n:r},r?!d&&te(e,r)&&f.push(i):d&&f.unshift(i);if(a.$e&&!d){o&&!o.v&&(o.v=h);break}d=0}}while(n&&(h=n.pId))}}return o&&f.push(o),f},ct=function(e){for(var t,n,r,i,o,a,f,u=e.target,c=e.type,s=[];u!=b;){if((t=ut(u,c)).length){s=[];for(var h=0,d=t;h<d.length;h++){var $=d[h],v=$.v,l=($.r,$.n),p=$.i;if(a!=v){if(a&&e.isPropagationStopped())break;a=v}(i=(r=Qe[v])&&r.$v)?(o=i[l+y+c])&&(e.eventTarget=u,f=p?he(p,i.$d.$a):{},e[C]=f,F(o,e,i)):e.stopPropagation()}}if((n=ot[o=u.$d])&&(n=n[u.$e])&&n[c]||e.isPropagationStopped()){s.length&&s.push(o);break}s.push(u),a=u.id,Qe[a]&&s.push(a),u=u.parentNode||b}if(o=s.length)for(n=m;o--;)(i=s[o]).nodeType?((t=ot[n])||(t=ot[n]={}),(f=t[a=i.$e||(i.$e=++ft)])||(f=t[a]={},i.$d=n),f[c]=1):n=i},st="http://www.w3.org/2000/svg",ht={option:[1,"<select multiple>"],thead:[1,"<table>"],col:[2,"<table><colgroup>"],tr:[2,"<table><tbody>"],td:[3,"<table><tbody><tr>"],area:[1,"<map>"],param:[1,"<object>"],g:[1,'<svg xmlns="'+st+'">'],all:[0,""]},dt=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i;ht.optgroup=ht.option,ht.tbody=ht.tfoot=ht.colgroup=ht.caption=ht.thead,ht.th=ht.td;var $t=n.implementation.createHTMLDocument(k),vt=$t.createElement("base");vt.href=n.location.href,$t.head.appendChild(vt);var lt=function(e,t){var n=z(t);e.$c[n]?e.unmountVframe(n,1):e.unmountZone(n,1)},pt={INPUT:[A,"checked"],TEXTAREA:[A],OPTION:["selected"]},gt=function(e,t){return 1==e.nodeType&&(e.$f?t=e.$g:((t=e.$a?k:e.id)||(t=e.getAttribute(T)),t||(t=e.getAttribute(N))&&(t=fe(t)[q]),e.$f=1,e.$g=t)),t},mt=function(e,t,n,r,i){for(var o,a,f,u,c,s=e.lastChild,h=t.firstChild,d=0,$={},v={};s;)d++,(f=gt(s))&&(f=$[f]||($[f]=[])).push(s),s=s.previousSibling,h&&((f=gt(h))&&(v[f]=1),h=h.nextSibling);for(;h;)(f=gt(h))&&(v[f]=1),h=h.nextSibling;for(h=t.firstChild,c=t.childNodes.length<d,s=e.firstChild;h;)d--,h=(o=h).nextSibling,(u=$[f=gt(o)])&&(u=u.pop())?(u!=s?c&&s.nextSibling==u?(e.appendChild(s),s=u.nextSibling):e.insertBefore(u,s):s=s.nextSibling,bt(u,o,e,n,r,i)):s?(f=gt(a=s))&&$[f]&&v[f]?(d++,n.c=1,e.insertBefore(o,a)):(s=s.nextSibling,bt(a,o,e,n,r,i)):(e.appendChild(o),n.c=1);for(;0<d--;)a=e.lastChild,lt(r,a),e.removeChild(a),n.c=1},bt=function(e,t,n,r,i,o,a){if(function(e,t){var n,r=e.nodeName,i=pt[r],o=0;if(i)for(var a=0,f=i;a<f.length;a++)e[n=f[a]]!=t[n]&&(o=1,e[n]=t[n]);return o}(e,t)||1==e.nodeType&&(a=e.hasAttribute("mxv"))||!e.isEqualNode||!e.isEqualNode(t))if(e.nodeName===t.nodeName)if(1===e.nodeType){var f=t.getAttribute(T);if(f&&f==e.getAttribute(T))return;var u=t.getAttribute(N),c=t.innerHTML,s=t.getAttribute("mxa"),h=!s||s!=e.getAttribute("mxa"),d=void 0,$=void 0,v=Qe[e.id],l=void 0,p=void 0,g=u&&fe(u),m=void 0,b=void 0,y=void 0;if(u&&v&&(!t.id||t.id==e.id)&&v.$j==g[q]&&(p=v.$v)){if(b=c!=v.$i,y=u!=v[q],l=e.getAttribute("mxv"),!b&&!y&&l)for(var w=0,x=m=l.split(V);w<x.length;w++)if(l=x[w],J(o,l)){y=1;break}y||b||a?(l=p.$g)?(m=g[C],Ge(v.pId,u,m),v.$i=c,v[q]=u,g={node:t,html:c,deep:!p.$e,mxv:a,inner:b,query:y,keys:o},h=1,F(l,[m,g],p)&&r.v.push(p),d=g.deep):d=$=1:h=1}else d=1,$=v;$&&(r.c=1,v.unmountVframe(0,1)),h&&function(e,t,n,r){var i,o,a,f;delete e.$f;var u=e.attributes,c=t.attributes;for(o=u.length;o--;)i=u[o].name,t.hasAttribute(i)||("id"==i?r||n.d.push([e,k]):(n.c=1,e.removeAttribute(i)));for(o=c.length;o--;)a=(i=c[o]).name,f=i[A],e.getAttribute(a)!=f&&("id"==a?n.d.push([e,f]):(n.c=1,e.setAttribute(a,f)))}(e,t,r,v&&u),d&&mt(e,t,r,i,o)}else e.nodeValue!==t.nodeValue&&(r.c=1,e.nodeValue=t.nodeValue);else lt(i,e),n.replaceChild(t,e),r.c=1},yt=function(t,n){var e,r,i=t.$k,o=t.$c,a=t.$b,f=Qe[a],u=f&&f.$v,c={d:[],v:[]},s=E(a),h=t.$a,d=function(e){n.i<n.length?yt(t,n):(c=n.slice(),n.i=n.length=0,e&&u.fire("domready"),F(c))};if(n.i=n.length,t.$c=0,t.$k={},o&&u&&0<u.$a&&(e=u.$e)){delete ot[a],delete at[a],r=function(e,t){var n=$t.createElement("div"),r=st==t.namespaceURI?"g":(dt.exec(e)||[0,""])[1].toLowerCase(),i=ht[r]||ht.all;n.innerHTML=i[1]+e;for(var o=i[0];o--;)n=n.lastChild;return n}(e(h,a),s),mt(s,r,c,f,i);for(var $=0,v=c.d;$<v.length;$++)(r=v[$])[0].id=r[1];for(var l=0,p=c.v;l<p.length;l++)(r=p[l]).$b();!c.c&&u.$f||u.endUpdate(a),c.c&&g.trigger({type:"htmlchanged",vId:a}),d(1)}else d()};function wt(e){var t,n=this;n.$b=e,n.$c=1,n.$a=((t={vId:e})[y]=1,t),n.$d=[],n.$k={}}L(wt[w],{get:function(e,t){return t=this.$a,e&&(t=t[e]),t},set:function(e){var t=this;return t.$c=H(e,t.$a,t.$k)||t.$c,t},digest:function(e,t){var n=this.set(e),r=n.$d;r.push(t),r.i||yt(n,r)},snapshot:function(){return this.$e=i(this.$a),this},altered:function(){if(this.$e)return this.$e!=i(this.$a)},translate:function(e){return Q(this.$a,e,1)},parse:function(e){return he(e,this.$a)}});var xt=/^(\$?)([^<]*)<([^>]+)>$/,kt=function(e,t,n){return e.a?n=e:((n=function(e){F(n.a,e,this)}).a=[e],n.b=1),n.a=n.a.concat(t.a||t),n},Vt=function(e,t){var n,r,i=e.$r;for(n in i)r=i[n],(t||r.x)&&At(i,n,1)},At=function(e,t,n,r){var i,o,a=e[t];return a&&a!=r&&((i=(o=a.e).destroy)&&n&&F(i,l,o),delete e[t]),o},It=function(e,t){var n,r,i,o,a,f,u=e.$eo,c=e.$so,s=e.$el,h=e.id;for(n in u)i=c[r=n],o=t,void 0,a=0|rt[r],f=o?-1:1,a&&o!==a||re(b,r,ct,o),rt[r]=a+f,i&&(it[r]=(0|it[r])+f);for(var d=0,$=s;d<$.length;d++)n=$[d],re(n.e,n.n,ne,t,{i:h,v:e,f:n.f,e:n.e})},St=[],Tt={win:f,doc:n},Ct=function(e,t,n){for(var r,i,o,a,f={},u=0,c=e;u<c.length;u++)for(r in i=c[u])o=i[r],a=f[r],"ctor"!=r?(xt.test(r)&&(a?o=kt(a,o):o.b=1),f[r]=o):n.push(o);for(r in f)J(t,r)||(t[r]=f[r])},qt=function(e){if(!e[y]){e[y]=[];var t=e[w],n=void 0,r=void 0,i=void 0,o={},a=[],f={},u=void 0,c=void 0,s=void 0,h=void 0,d=void 0;for(s in(r=t.mixins)&&Ct(r,t,e[y]),t)if(n=t[s],r=s.match(xt)){c=r[1],i=r[2];for(var $=0,v=r[3].split(V);$<v.length;$++){if(h=v[$],u=Tt[i],d=1,c){if(u){a.push({f:n,e:u,n:h});continue}d=2,(u=f[h])||(u=f[h]={}),u[i]=1}o[h]=o[h]|d,(u=t[h=i+y+h])?u.b&&(n.b?t[h]=kt(n,u):J(t,s)&&(t[h]=n)):t[h]=n}}g="$b",m=(l=t)[p="render"],l[p]=l[g]=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];0<(b=this).$a&&(b.$a++,b.fire("rendercall"),Vt(b),F(m,e,b))},t.$eo=o,t.$el=a,t.$so=f,t.$e=t.tmpl,t.$g=t.assign}var l,p,g,m,b;return e[y]},Nt=function(e){var t,n,r,i=e.$l;if(i.f&&(i.p&&(t=we[q]),!t&&i.k)){r=we[C];for(var o=0,a=i.k;o<a.length&&(n=a[o],!(t=J(r,n)));o++);}return t};function jt(e,t,n,r){(r=this).owner=t,r.id=e,r.$l={k:[]},r.$r={},r.$a=1,r.updater=r.$d=new wt(r.id),F(St,n,r)}var Ut=jt[w];L(jt,{merge:function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];Ct(e,Ut,St)},extend:function(e,t){var i=this,n=(e=e||{}).ctor,o=[];function r(e,t,n,r){i.call(this,e,t,n),F(o.concat(r),n,this)}return n&&o.push(n),r.extend=i.extend,Y(r,i,e,t)}}),L(Ut,$e,{init:e,beginUpdate:function(e,t){0<(t=this).$a&&t.$f&&t.owner.unmountZone(e,1)},endUpdate:function(e,t,n,r,i){0<(n=this).$a&&(e=e||n.id,t?i=t:(i=n.$f,n.$f=1),(r=n.owner).mountZone(e,t),i||u(n.wrapAsync(function(){!function(e,t,n){for(t=e.$f;t.length;)(n=t.shift()).r||e.invoke(n.n,n.a),delete t[n.k]}(r)}),0))},wrapAsync:function(n,r){var i=this,o=i.$a;return function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];if(0<o&&o==i.$a)return n.apply(r||i,e)}},observeLocation:function(e,t){var n;(n=this.$l).f=1,v(e)&&(t=e[q],e=e[C]),n.p=t,e&&(n.k=(e+k).split(V))},observeState:function(e){this.$os=(e+k).split(V)},capture:function(e,t,n,r){return r=this.$r,t?(At(r,e,1,t),r[e]={e:t,x:n}):t=(r=r[e])&&r.e,t},release:function(e,t){return At(this.$r,e,t)},leaveTip:function(r,i){var o=this,a=function(e){var t="a",n="b";e.type!=c&&(t="b",n="a"),a[t]?(e.prevent(),e.reject()):i()&&(e.prevent(),a[n]=1,o.leaveConfirm(function(){a[n]=0,e.resolve()},function(){a[n]=0,e.reject()},r))},e=function(e){i()&&(e.msg=r)};Re.on(c,a),Re.on(s,e),o.on("unload",a),o.on("destroy",function(){Re.off(c,a),Re.off(s,e)})},render:e}),de.View=jt;var Et=d.type,Pt=d.now||Date.now;function Ht(){this.id=x("b"),this.$={}}L(Ht[w],{get:function(e,t){var n=this.$;if(e){for(var r=I(e)?e.slice():(e+k).split("."),i=void 0;(i=r.shift())&&n;)n=n[i];i&&(n=o)}return t!==o&&Et(t)!=Et(n)&&(n=t),n},set:function(e,t){var n;v(e)||((n={})[e]=t,e=n),L(this.$,e)}});function Ot(e,t,n){(n=this[e])&&(delete this[e],F(n,t,n.e))}var Lt=function(e,t,n,r,i){if(e.$d)return e;if(e.$e)return e.enqueue(Lt.bind(e,e,t,n,r,i));e.$e=1,I(t)||(t=[t]);for(var c,s,h,d,$,v,l,p,g,o=e.constructor,a=0,f=o.$f,u=(c=n,s=o,h=e,d=t.length,$=r,v=o.$c,l=[],p=S,g=0,function(e,t){var n,r=this;g++;var i,o=r.$b,a=o.k,f={bag:l[e+1]=r,error:t};if(t?(p=t,s.fire("fail",f),n=1):v.has(a)||(a&&v.set(a,r),o.t=Pt(),(i=o.a)&&F(i,r,r),(i=o.x)&&s.clear(i),s.fire("done",f),n=1),!h.$d){var u=g==d;u&&(h.$e=0,2==$&&(l[0]=p,F(c,l,h))),1==$&&F(c,[t||S,r,u,e],h)}n&&s.fire("end",f)}),m=0,b=t;m<b.length;m++){var y=b[m];if(y){var w=o.get(y,i),x=w.e,k=x.$b.k,V=u.bind(x,a++),A=void 0;k&&f[k]?f[k].push(V):w.u?(k&&((A=[V]).e=x,f[k]=A,V=Ot.bind(f,k)),o.$s(x,V)):V()}}return e};function Zt(){var e=this;e.id=x("s"),e.$g=[]}L(Zt[w],{all:function(e,t){return Lt(this,e,t,2)},save:function(e,t){return Lt(this,e,t,2,1)},one:function(e,t){return Lt(this,e,t,1)},enqueue:function(e){var t=this;return t.$d||(t.$g.push(e),t.dequeue(t.$h)),t},dequeue:function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var n,r=this;r.$e||r.$d||(r.$e=1,u(function(){r.$e=0,r.$d||(n=r.$g.shift())&&F(n,r.$h=e)},0))},destroy:function(e){(e=this).$d=1,e.$g=0}});var Mt=function(e,t){return[i(t),i(e)].join(y)},Rt=function(e,t,n,r){(r=e&&e.$b)&&t[r.n]&&n.del(r.k)},Bt=L({add:function(e){var t,n=this.$b;I(e)||(e=[e]);for(var r=0,i=e;r<i.length;r++)if(t=i[r]){var o=t.name,a=t.cache;t.cache=0|a,n[o]=t}},create:function(e){var t=this.meta(e),n=0|e.cache||t.cache,r=new Ht;r.set(t),r.$b={n:t.name,a:t.after,x:t.cleans,k:n&&Mt(t,e)},v(e)&&r.set(e);var i=t.before;return i&&F(i,r,r),this.fire("begin",{bag:r}),r},meta:function(e){return this.$b[e.name||e]||e},get:function(e,t){var n,r;return t||(n=this.cached(e)),n||(n=this.create(e),r=1),{e:n,u:r}},clear:function(e){this.$c.each(Rt,ce((e+k).split(V)))},cached:function(e){var t,n,r=this.$c,i=this.meta(e),o=0|e.cache||i.cache;if(o&&(n=Mt(i,e)),n){var a=this.$f[n];a?t=a.e:(t=r.get(n))&&Pt()-t.$b.t>o&&(r.del(n),t=0)}return t}},$e);return Zt.extend=function(e,t,n){function r(){Zt.call(this)}return r.$s=e,r.$c=new _(t,n),r.$f={},r.$b={},Y(r,Zt,S,Bt)},de.Service=Zt,L(e[w],$e),e.extend=function e(t,n){var r=this,i=t&&t.ctor;function o(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];r.apply(this,e),i&&i.apply(this,e)}return o.extend=e,Y(o,r,t,n)},de.Base=e,de});