/*!3.8.10 MIT kooboy_li@163.com*/KISSY.add("magix",(e,t,r)=>{let i=e.all,n=e.isObject,o=e.isArray,l=0,a="",f=[],s=",",$=null,d=window,h=void 0,u=document,c=i(u),p=d.setTimeout,g="changed",b="change",m="pageunload",v="value",y="mxs",w="#";function x(){}let k,V=JSON.stringify,I="\x1e",A="object",S="prototype",T="params",C="path",j="mx-view",q=/[#?].*$/,N=/([^=&?\/#]+)=?([^&#?]*)/g,U=/(?!^)=|&/,E=e=>(e||"mx_")+l++,O=E(),H={rootId:E(),defaultView:O,error(e){p(()=>{throw e})}},P=e=>typeof e==A?e:u.getElementById(e),L=e=>!e||typeof e!=A,Z=(e,t,r)=>{let i,n,o,l=0;for(o in e)i=e[o],n=t[o],L(i)&&n===i||(r[o]=1,l=1),t[o]=i;return l},M=(e,t,r)=>{if(e=P(e),t=P(t),e&&t&&!(r=e==t))try{r=16==(16&t.compareDocumentPosition(e))}catch(e){}return r},{assign:R,keys:B,hasOwnProperty:D}=Object,z=i("head"),F=(e,t)=>{t&&!F[e]&&(F[e]=1,z.append(`<style>${t}`))},J=e=>e.id||(e.$a=1,e.id=E()),K=(e,t,r,i,n)=>{t=t||f,o(e)||(e=[e]),o(t)||(t=[t]);for(n of e)try{i=n&&n.apply(r,t)}catch(e){H.error(e)}return i},Q=(e,t)=>e&&D.call(e,t),X=(e,t,r)=>{let i,n;if(!r&&L(t))(i=t+a)[0]==I&&(t=e[i]);else for(i in t)n=t[i],r&&!L(n)&&X(e,n,r),i[0]==I&&(delete t[i],i=e[i]),t[i]=(n+a)[0]==I?e[n]:n;return t},Y=(e,t)=>t.f-e.f||t.t-e.t;function _(e,t,r,i){(i=this).c=[],i.b=t||5,i.x=i.b+(e||20),i.r=r}R(_[S],{get(e){let t=this.c[I+e];return t&&(t.f++,t.t=l++,t=t.v),t},each(e,t,r,i,n){i=(r=this).c;for(n of i)e(n.v,t,r)},set(e,t){let r=this,i=r.c,n=I+e,o=i[n],a=r.b;if(!o){if(i.length>=r.x)for(i.sort(Y);a--;)(o=i.pop()).f>0&&r.del(o.o);o={o:e},i.push(o),i[n]=o}o.v=t,o.f=1,o.t=l++},del(e){e=I+e;let t=this.c,r=t[e],i=this.r;r&&(r.f=-1,r.v=a,delete t[e],i&&K(i,r.o))},has(e){return Q(this.c,I+e)}});let G=(t,r)=>{e.use(t&&t+a,(e,...t)=>{r&&r.apply(e,t)})},W=e.extend,ee=r.test;function te(e,t){t=this,e.eventTarget=t.e,K(t.f,e,t.v)}let re=(e,r,i,n,o)=>{o?t[`${n?"un":a}delegate`](e,r,i,o):t[n?"detach":"on"](e,r,i,o)};let ie,ne=new _,oe=0,le=(e,t,r)=>{try{r=decodeURIComponent(r)}catch(e){}ie[t]=r},ae=e=>{let t,r=ne.get(e);return r||(ie={},e==(t=e.replace(q,a))&&U.test(t)&&(t=a),e.replace(t,a).replace(N,le),ne.set(e,r={a:t,b:ie})),{path:r.a,params:{...r.b}}},fe=(e,t,r)=>{let i,n,o,l=[];for(n in t)i=t[n]+a,(!r||i||Q(r,n))&&(i=encodeURIComponent(i),l.push(o=n+"="+i));return o&&(e+=(e&&(~e.indexOf("?")?"&":"?"))+l.join("&")),e},se=(e,t)=>{let r,i={};if(e)for(r of e)i[t&&r?r[t]:r]=t?r:1+(0|i[r]);return i},$e=new _,de=(e,t,r)=>($e.has(e)?r=$e.get(e):(r=K(Function(`return ${e}`)),e.indexOf(I)>-1?X(t,r,1):$e.set(e,r)),r),he={config:(e,t)=>(t=H,e&&(t=n(e)?R(t,e):t[e]),t),boot(e){R(H,e),G(H.ini,t=>{R(H,t,e),G(H.exts,()=>{Re.on(g,Je),ye.on(g,Je),oe=1,Pe()})})},toMap:se,toTry:K,toUrl:fe,parseUrl:ae,mix:R,has:Q,keys:B,inside:M,node:P,applyStyle:F,guid:E,use:G,Cache:_,nodeId:J},ue={fire(e,t,r,i){let n,o,l,f,s=this,$=s[I+e];if(t||(t={}),t.type||(t.type=e),$)for(o=(n=$.length)-1;n--;)(f=$[l=i?n:o-n]).f?(f.x=1,K(f.f,t,s),f.x=a):f.x||($.splice(l,1),o--);($=s[`on${e}`])&&K($,t,s),r&&s.off(e)},on(e,t){let r=I+e;(this[r]||(this[r]=[])).push({f:t})},off(e,t){let r,i=I+e,n=this,o=n[i];if(t){if(o)for(r of o)if(r.f==t){r.f=a;break}}else delete n[i],delete n[`on${e}`]}};he.Event=ue;let ce={},pe={},ge={},be=0,me=e=>{e=(e+a).split(",");for(let t of e)Q(pe,t)?pe[t]++:pe[t]=1;return e},ve=e=>{let t,r;for(t of e)Q(pe,t)&&((r=--pe[t])||(delete pe[t],delete ce[t]))};let ye={get(e){let t=e?ce[e]:ce;return t},set(e){return be=Z(e,ce,ge)||be,this},digest(e){e&&ye.set(e),be&&(be=0,this.fire(g,{keys:ge}),ge={})},diff:()=>ge,clean:e=>({ctor(){e=me(e),this.on("destroy",()=>ve(e))}}),...ue};he.State=ye;let we,xe="view",ke=new _,Ve=new _,Ie=d.location,Ae=0,Se={query:{},params:{},href:a},Te=/(?:^.*\/\/[^\/]+|#.*$)/gi,Ce=/^[^#]*#?!?/;function je(e,t){return this[T][e]||t!==h&&t||a}let qe,Ne,Ue,Ee,Oe,He=(e,t)=>{e="#!"+e,t?Ie.replace(e):Ie.hash=e},Pe=()=>{let e,t,r=Ze().srcHash;re(d,"hashchange",(i,n,o)=>{t||(n=Ze(),(e=n.srcHash)!=r&&(o=(()=>{i.p=1,r=e,t=a,He(e),Me()}),i={reject(){i.p=1,t=a,He(r)},resolve:o,prevent(){t=1}},Re.fire(b,i),t||i.p||o()))}),re(d,"beforeunload",(e,t,r)=>{if(e=e||d.event,t={},Re.fire(m,t),r=t.msg)return e&&(e.returnValue=r),r}),Me()},Le=u.title,Ze=e=>{e=e||Ie.href;let t,r,i,o,l,f=ke.get(e);return f||(f={get:je,href:e,srcQuery:t=e.replace(Te,a),srcHash:r=e.replace(Ce,a),query:i=ae(t),hash:o=ae(r),params:l={...i[T],...o[T]}},oe&&(((e,t)=>{if(qe||(qe=H.routes||{},Ne=H.unmatchView,Ue=H.defaultView,Ee=H.defaultPath||"/",Oe=H.rewrite),!e[xe]){let r=e.hash[C]||Ee;Oe&&(r=Oe(r,e[T],qe)),t=qe[r]||Ne||Ue,e[C]=r,e[xe]=t,n(t)&&R(e,t)}})(f),ke.set(e,f))),f},Me=()=>{let e=Ze(),t=((e,t)=>{let r=e.href,i=t.href,n=r+I+i,o=Ve.get(n);if(!o){let i,l;o={params:l={},force:!r};let a,f=e[T],s=t[T],$=B(f).concat(B(s)),d=e=>{let t=f[e],r=s[e];t!=r&&(l[e]={from:t,to:r},i=1)};for(a of $)d(a);f=e,s=t,l=o,d(C),d(xe),Ve.set(n,o={a:i,b:o})}return o})(Se,Se=e);return!Ae&&t.a&&((we=t.b)[C]&&(u.title=e.title||Le),Re.fire(g,we)),Ae=0,we},Re={parse:Ze,diff:Me,to(e,t,r,i){!t&&n(e)&&(t=e,e=a);let o=ae(e),l=o[T],f=o[C],s=Se[C],$=Se[T],d=Se.query[T];if(R(l,t),f)for(s in d)Q(l,s)||(l[s]=a);else $&&(f=s,l={...$,...l});var h,u,c,p;u=Se,c=r,p=i,(h=fe(h=f,l,d))!=u.srcHash&&(Ae=p,He(h,c))},...ue};he.Router=Re;let Be,De,ze=0,Fe=(e,t,r,i,n,o)=>{if(e&&e.$a!=ze&&(r=e.$v)&&r.$a>1){(t?((e,t,r)=>{let i,n=e.$os;if(n)for(i of n)if(r=Q(t,i))break;return r})(r,t):Et(r))&&r.$b(),n=e.children();for(o of n)Fe(Ke[o],t)}},Je=(e,t,r)=>{t=_e(),(r=e[xe])?t.mountView(r.to):(ze=l++,Fe(t,e.keys))},Ke={},Qe=e=>{if(!e.$b&&!e.$d&&e.$cc==e.$rc){e.$cr||(e.$cr=1,e.$ca=0,e.fire("created"));let{id:t,pId:r}=e,i=Ke[r];i&&!Q(i.$e,t)&&(i.$e[t]=1,i.$rc++,Qe(i))}},Xe=(e,t)=>{if(!e.$ca&&e.$cr){e.$cr=0,e.$ca=1,e.fire("alter",t);let{id:r,pId:i}=e,n=Ke[i];n&&Q(n.$e,r)&&(n.$rc--,delete n.$e[r],Xe(n,t))}},Ye=(e,t,r,i)=>(i=(i=(i=Ke[e])&&i.$v)?i.$d.$a:{},t.indexOf(I)>0&&X(i,r),i),_e=e=>(Be||(k=u.body,e=H.rootId,P(e)||(k.id=e),Be=new tt(e)),Be),Ge=(e,t)=>{Q(Ke,e)||(Ke[e]=t,tt.fire("add",{vframe:t}),(e=P(e))&&(e.vframe=t))},We=(e,t,r)=>{for(t=e.$f;t.length;)(r=t.shift()).r||e.invoke(r.n,r.a),delete t[r.k]},et=[];function tt(e,t,r){(r=this).id=e,r.$c={},r.$cc=0,r.$rc=0,r.$g=r.$g||1,r.$e={},r.$f=[],r.pId=t,Ge(e,r)}R(tt,{all:()=>Ke,get:e=>Ke[e]},ue),R(tt[S],ue,{mountView(e,t){let r,i,n,o,l,a,f=this,{id:s,pId:$,$g:d}=f,h=P(s);!f.$h&&h&&(f.$h=1,f.$i=h.innerHTML),f.unmountView(),f.$b=0,r=ae(e),n=r[C],h&&n&&(f[C]=e,i=++d,o=r[T],a=Ye($,e,o),f.$j=r[C],R(o,t),G(n,e=>{if(i==f.$g){if(!e)return H.error(Error(`id:${s} cannot load:${n}`));l=Ut(e),n=new e(s,f,o,l),f.$v=n,f.$a=ze,Ct(n),K(n.init,o,n),n.$b(),n.$e||(f.$h=0,n.$f||n.endUpdate())}}))},unmountView(){let e,t,r=this,{$v:n,id:o}=r;r.$f=[],n&&(De||(t=1,De={id:o}),r.$b=1,r.unmountZone(0,1),Xe(r,De),r.$v=0,n.$a>0&&(n.$a=0,delete lt[o],delete at[o],n.fire("destroy",0,1,1),At(n,1),Ct(n,1),n.owner=0),n.$a--,(e=P(o))&&r.$h&&i(e).html(r.$i),t&&(De=0)),r.$g++},mountVframe(e,t,r){let i,n=this,o=n.id,l=n.$c;return Xe(n,{id:e}),(i=Ke[e])||(Q(l,e)||(n.$n=0,n.$cc++),l[e]=e,(i=et.pop())?tt.call(i,e,o):i=new tt(e,o)),i.mountView(t,r),i},mountZone(e,t){let r,n,o=this,l=[];e=e||o.id;let a=i(`#${e} [${j}]`);o.$d=1;for(r of a)r.$b||(n=J(r),r.$b=1,l.push([n,r.getAttribute(j)]));for([n,r]of l)o.mountVframe(n,r);o.$d=0,t||Qe(o)},unmountVframe(e,t){let r;if(e=e?this.$c[e]:this.id,r=Ke[e]){let{$cr:l,pId:a}=r;r.unmountView(),n=l,(o=Ke[i=e])&&(delete Ke[i],tt.fire("remove",{vframe:o,fcc:n}),(i=P(i))&&(i.$b=0,i.vframe=0,i.$a=0)),r.id=r.pId=r.$c=r.$e=0,r.$h=0,r.off("alter"),r.off("created"),et.push(r),(r=Ke[a])&&Q(r.$c,e)&&(delete r.$c[e],r.$n=0,r.$cc--,t||Qe(r))}var i,n,o},unmountZone(e,t){let r,i=this;for(r in i.$c)(!e||r!=e&&M(r,e))&&i.unmountVframe(r,1);t||Qe(i)},parent(e,t){for(t=this,e=e>>>0||1;t&&e--;)t=Ke[t.pId];return t},children(e){return(e=this).$n||(e.$n=B(e.$c))},invoke(e,t){let r,i,n,o,l,a=this.$f;return(i=this.$v)&&i.$f?r=(n=i[e])&&K(n,t,i):((o=a[l=I+e])&&(o.r=t===o.a),o={n:e,a:t,k:l},a.push(o),a[l]=o),r}}),he.Vframe=tt,r[S].invokeView=function(e,t){let r,i,n=[];for(r of this)i=r.vframe,n.push(i&&i.invoke(e,t));return n};let rt=new _(30,10),it=/(?:([\w\-]+)\x1e)?([^(]+)\(([\s\S]*)?\)/,nt={},ot={},lt={},at={},ft=0,st=(e,t)=>{let r,i,n,o,l,a,s=[],$=e,d=e.getAttribute(`mx-${t}`),h=[],u=w,c=0;if(d&&((l=rt.get(d))||(l={v:(l=d.match(it)||f)[1],n:l[2],i:l[3]},rt.set(d,l)),l={...l,r:d}),l&&!l.v||ot[t]){if((n=at[i=$.$d])&&1==n[$.$e]&&(a=1,u=i),!a){for(h.push($);$!=k&&($=$.parentNode);){if(Ke[i=$.id]||(n=at[i=$.$d])&&1==n[$.$e]){u=i;break}h.push($)}for(d of h)(i=at[u])||(i=at[u]={}),i[n=d.$e||(d.$e=++ft)]=1,d.$d=u}if(u!=w){$=e.id,Ke[$]&&(c=u=$);do{if((r=Ke[u])&&(a=r.$v)){o=(n=a.$so)[t];for(i in o)n={r:i,v:u,n:i},i?!c&&ee(e,i)&&s.push(n):c&&s.unshift(n);if(a.$e&&!c){l&&!l.v&&(l.v=u);break}c=0}}while(r&&(u=r.pId))}}return l&&s.push(l),s},$t=e=>{let t,r,i,n,o,l,a,f,{target:s,type:$}=e,d=[];for(;s!=k;){if((t=st(s,$)).length){d=[];for(let{v:r,r:d,n:h,i:u}of t){if(a!=r){if(a&&e.isPropagationStopped())break;a=r}(n=(i=Ke[r])&&i.$v)?(l=n[o=h+I+$])&&(e.eventTarget=s,f=u?de(u,n.$d.$a):{},e[T]=f,K(l,e,n)):e.stopPropagation()}}if((r=lt[l=s.$d])&&(r=r[s.$e])&&r[$]||e.isPropagationStopped()){d.length&&d.push(l);break}d.push(s),a=s.id,Ke[a]&&d.push(a),s=s.parentNode||k}if(l=d.length)for(r=w;l--;)(n=d[l]).nodeType?((t=lt[r])||(t=lt[r]={}),(f=t[a=n.$e||(n.$e=++ft)])||(f=t[a]={},n.$d=r),f[$]=1):r=n},dt=(e,t,r)=>{let i=0|nt[e],n=r?-1:1;i&&r!==i||re(k,e,$t,r),nt[e]=i+n,t&&(ot[e]=(0|ot[e])+n)},ht="http://www.w3.org/2000/svg",ut={option:[1,"<select multiple>"],thead:[1,"<table>"],col:[2,"<table><colgroup>"],tr:[2,"<table><tbody>"],td:[3,"<table><tbody><tr>"],area:[1,"<map>"],param:[1,"<object>"],g:[1,`<svg xmlns="${ht}">`],all:[0,""]},ct=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i;ut.optgroup=ut.option,ut.tbody=ut.tfoot=ut.colgroup=ut.caption=ut.thead,ut.th=ut.td;let pt=u.implementation.createHTMLDocument(a),gt=pt.createElement("base");gt.href=u.location.href,pt.head.appendChild(gt);let bt=(e,t)=>{let r=J(t);e.$c[r]?e.unmountVframe(r,1):e.unmountZone(r,1)},mt={INPUT:[v,"checked"],TEXTAREA:[v],OPTION:["selected"]},vt=(e,t)=>(1==e.nodeType&&(e.$f?t=e.$g:((t=e.$a?a:e.id)||(t=e.getAttribute(y)),t||(t=e.getAttribute(j))&&(t=ae(t)[C]),e.$f=1,e.$g=t)),t),yt=(e,t,r,i,n)=>{let o,l,a,f,s,$=e.lastChild,d=t.firstChild,h=0,u={},c={};for(;$;)h++,(a=vt($))&&(a=u[a]||(u[a]=[])).push($),$=$.previousSibling,d&&((a=vt(d))&&(c[a]=1),d=d.nextSibling);for(;d;)(a=vt(d))&&(c[a]=1),d=d.nextSibling;for(d=t.firstChild,s=t.childNodes.length<h,$=e.firstChild;d;)h--,o=d,d=d.nextSibling,(f=u[a=vt(o)])&&(f=f.pop())?(f!=$?s&&$.nextSibling==f?(e.appendChild($),$=f.nextSibling):e.insertBefore(f,$):$=$.nextSibling,wt(f,o,e,r,i,n)):$?(a=vt(l=$))&&u[a]&&c[a]?(h++,r.c=1,e.insertBefore(o,l)):($=$.nextSibling,wt(l,o,e,r,i,n)):(e.appendChild(o),r.c=1);for(;h-- >0;)l=e.lastChild,bt(i,l),e.removeChild(l),r.c=1},wt=(e,t,r,i,n,o,l)=>{if(((e,t)=>{let r,i=e.nodeName,n=mt[i],o=0;if(n)for(r of n)e[r]!=t[r]&&(o=1,e[r]=t[r]);return o})(e,t)||1==e.nodeType&&(l=e.hasAttribute("mxv"))||!e.isEqualNode||!e.isEqualNode(t))if(e.nodeName===t.nodeName)if(1===e.nodeType){let r=t.getAttribute(y);if(r&&r==e.getAttribute(y))return;let f,$,d,h,u,c,p,g,b=t.getAttribute(j),m=t.innerHTML,w=t.getAttribute("mxa"),x=!w||w!=e.getAttribute("mxa"),k=Ke[e.id],V=b&&ae(b);if(b&&k&&(!t.id||t.id==e.id)&&k.$j==V[C]&&(h=k.$v)){if(c=m!=k.$i,g=p=b!=k[C],d=e.getAttribute("mxv"),!c&&!g&&d){u=d.split(s);for(d of u)if(Q(o,d)){g=1;break}}g||c||l?(d=h.$g)?(u=V[T],Ye(k.pId,b,u),k.$i=m,k[C]=b,V={node:t,html:m,deep:!h.$e,mxv:l,inner:c,query:g,keys:o},x=1,K(d,[u,V],h)&&i.v.push(h),f=V.deep):($=1,f=1):x=1}else f=1,$=k;$&&(i.c=1,k.unmountVframe(0,1)),x&&((e,t,r,i)=>{let n,o,l,f;delete e.$f;let s=e.attributes,$=t.attributes;for(o=s.length;o--;)n=s[o].name,t.hasAttribute(n)||("id"==n?i||r.d.push([e,a]):(r.c=1,e.removeAttribute(n)));for(o=$.length;o--;)l=(n=$[o]).name,f=n[v],e.getAttribute(l)!=f&&("id"==l?r.d.push([e,f]):(r.c=1,e.setAttribute(l,f)))})(e,t,i,k&&b),f&&yt(e,t,i,n,o)}else e.nodeValue!==t.nodeValue&&(i.c=1,e.nodeValue=t.nodeValue);else bt(n,e),r.replaceChild(t,e),i.c=1},xt=(e,t)=>{let r,i,n=e.$k,o=e.$c,l=e.$b,a=Ke[l],f=a&&a.$v,s={d:[],v:[]},$=P(l),d=e.$a,h=r=>{t.i<t.length?xt(e,t):(s=t.slice(),t.i=t.length=0,r&&f.fire("domready"),K(s))};if(t.i=t.length,e.$c=0,e.$k={},o&&f&&f.$a>0&&(r=f.$e)){delete lt[l],delete at[l],i=((e,t)=>{let r=pt.createElement("div"),i=ht==t.namespaceURI?"g":(ct.exec(e)||[0,""])[1].toLowerCase(),n=ut[i]||ut.all;r.innerHTML=n[1]+e;let o=n[0];for(;o--;)r=r.lastChild;return r})(r(d,l),$),yt($,i,s,a,n);for(i of s.d)i[0].id=i[1];for(i of s.v)i.$b();!s.c&&f.$f||f.endUpdate(l),s.c&&c.fire("htmlchanged",{vId:l}),h(1)}else h()};function kt(e){let t=this;t.$b=e,t.$c=1,t.$a={vId:e,[I]:1},t.$d=[],t.$k={}}R(kt[S],{get(e,t){return t=this.$a,e&&(t=t[e]),t},set(e){let t=this;return t.$c=Z(e,t.$a,t.$k)||t.$c,t},digest(e,t){let r=this.set(e),i=r.$d;i.push(t),i.i||xt(r,i)},snapshot(){return this.$e=V(this.$a),this},altered(){let e=this;if(e.$e)return e.$e!=V(e.$a)},translate(e){return X(this.$a,e,1)},parse(e){return de(e,this.$a)}});let Vt=/^(\$?)([^<]*)<([^>]+)>$/,It=(e,t,r)=>(e.a?r=e:((r=function(e){K(r.a,e,this)}).a=[e],r.b=1),r.a=r.a.concat(t.a||t),r),At=(e,t)=>{let r,i,n=e.$r;for(r in n)i=n[r],(t||i.x)&&St(n,r,1)},St=(e,t,r,i)=>{let n,o,l=e[t];return l&&l!=i&&((n=(o=l.e).destroy)&&r&&K(n,f,o),delete e[t]),o},Tt=(e,t,r,i,n)=>{i=e[t],e[t]=e[r]=function(...e){(n=this).$a>0&&(n.$a++,n.fire("rendercall"),At(n),K(i,e,n))}},Ct=(e,t)=>{let r,{$eo:i,$so:n,$el:o,id:l}=e;for(r in i)dt(r,n[r],t);for(r of o)re(r.e,r.n,te,t,{i:l,v:e,f:r.f,e:r.e})},jt=[],qt={win:d,doc:u},Nt=(e,t,r)=>{let i,n,o,l,a={};for(n of e)for(i in n)o=n[i],l=a[i],"ctor"!=i?(Vt.test(i)&&(l?o=It(l,o):o.b=1),a[i]=o):r.push(o);for(i in a)Q(t,i)||(t[i]=a[i])},Ut=e=>{if(!e[I]){e[I]=[];let t,r,i,n,o,l,a,f,$,d=e[S],h={},u=[],c={};(r=d.mixins)&&Nt(r,d,e[I]);for(a in d)if(t=d[a],r=a.match(Vt)){[,l,i,n]=r,n=n.split(s);for(f of n){if(o=qt[i],$=1,l){if(o){u.push({f:t,e:o,n:f});continue}$=2,(o=c[f])||(o=c[f]={}),o[i]=1}h[f]=h[f]|$,(o=d[f=i+I+f])?o.b&&(t.b?d[f]=It(t,o):Q(d,a)&&(d[f]=t)):d[f]=t}}Tt(d,"render","$b"),d.$eo=h,d.$el=u,d.$so=c,d.$e=d.tmpl,d.$g=d.assign}return e[I]},Et=e=>{let t,r,i,n=e.$l;if(n.f&&(n.p&&(t=we[C]),!t&&n.k)){i=we[T];for(r of n.k)if(t=Q(i,r))break}return t};function Ot(e,t,r,i){(i=this).owner=t,i.id=e,i.$l={k:[]},i.$r={},i.$a=1,i.updater=i.$d=new kt(i.id),K(jt,r,i)}let Ht=Ot[S];R(Ot,{merge(...e){Nt(e,Ht,jt)},extend(e,t){let r=this,i=(e=e||{}).ctor,n=[];function o(e,t,i,o){r.call(this,e,t,i),K(n.concat(o),i,this)}return i&&n.push(i),o.extend=r.extend,W(o,r,e,t)}}),R(Ht,ue,{init:x,beginUpdate(e,t){(t=this).$a>0&&t.$f&&t.owner.unmountZone(e,1)},endUpdate(e,t,r,i,n){(r=this).$a>0&&(e=e||r.id,t?n=t:(n=r.$f,r.$f=1),(i=r.owner).mountZone(e,t),n||p(r.wrapAsync(We),0,i))},wrapAsync(e,t){let r=this,i=r.$a;return(...n)=>{if(i>0&&i==r.$a)return e.apply(t||r,n)}},observeLocation(e,t){let r;(r=this.$l).f=1,n(e)&&(t=e[C],e=e[T]),r.p=t,e&&(r.k=(e+a).split(s))},observeState(e){this.$os=(e+a).split(s)},capture(e,t,r,i){return i=this.$r,t?(St(i,e,1,t),i[e]={e:t,x:r}):t=(i=i[e])&&i.e,t},release(e,t){return St(this.$r,e,t)},leaveTip(e,t){let r=this,i=n=>{let o="a",l="b";n.type!=b&&(o="b",l="a"),i[o]?(n.prevent(),n.reject()):t()&&(n.prevent(),i[l]=1,r.leaveConfirm(()=>{i[l]=0,n.resolve()},()=>{i[l]=0,n.reject()},e))},n=r=>{t()&&(r.msg=e)};Re.on(b,i),Re.on(m,n),r.on("unload",i),r.on("destroy",()=>{Re.off(b,i),Re.off(m,n)})},render:x}),he.View=Ot;let Pt=e.type,Lt=e.now;function Zt(){this.id=E("b"),this.$={}}R(Zt[S],{get(e,t){let r,i=this.$;if(e){let t,r=o(e)?e.slice():(e+a).split(".");for(;(t=r.shift())&&i;)i=i[t];t&&(i=h)}return t!==h&&(r=Pt(t))!=Pt(i)&&(i=t),i},set(e,t){n(e)||(e={[e]:t}),R(this.$,e)}});function Mt(e,t,r){(r=this[e])&&(delete this[e],K(r,t,r.e))}let Rt=(e,t,r,i,n,o)=>{let l=[],a=$,f=0;return function(s,d){let h,u=this;f++;let c=u.$b,p=c.k;l[s+1]=u;let g,b={bag:u,error:d};if(d?(a=d,t.fire("fail",b),h=1):o.has(p)||(p&&o.set(p,u),c.t=Lt(),(g=c.a)&&K(g,u,u),(g=c.x)&&t.clear(g),t.fire("done",b),h=1),!r.$d){let t=f==i;t&&(r.$e=0,2==n&&(l[0]=a,K(e,l,r))),1==n&&K(e,[d||$,u,t,s],r)}h&&t.fire("end",b)}},Bt=(e,t,r,i,n)=>{if(e.$d)return e;if(e.$e)return e.enqueue(Bt.bind(e,e,t,r,i,n));e.$e=1,o(t)||(t=[t]);let l=e.constructor,a=0,f=l.$f,s=Rt(r,l,e,t.length,i,l.$c);for(let e of t)if(e){let t,r=l.get(e,n),i=r.e,o=i.$b.k,$=s.bind(i,a++);o&&f[o]?f[o].push($):r.u?(o&&((t=[$]).e=i,f[o]=t,$=Mt.bind(f,o)),l.$s(i,$)):$()}return e};function Dt(){let e=this;e.id=E("s"),e.$g=[]}R(Dt[S],{all(e,t){return Bt(this,e,t,2)},save(e,t){return Bt(this,e,t,2,1)},one(e,t){return Bt(this,e,t,1)},enqueue(e){let t=this;return t.$d||(t.$g.push(e),t.dequeue(t.$h)),t},dequeue(...e){let t,r=this;r.$e||r.$d||(r.$e=1,p(()=>{r.$e=0,r.$d||(t=r.$g.shift())&&K(t,r.$h=e)},0))},destroy(e){(e=this).$d=1,e.$g=0}});let zt=(e,t)=>[V(t),V(e)].join(I),Ft=(e,t,r,i)=>{(i=e&&e.$b)&&t[i.n]&&r.del(i.k)},Jt={add(e){let t,r=this.$b;o(e)||(e=[e]);for(t of e)if(t){let{name:e,cache:i}=t;t.cache=0|i,r[e]=t}},create(e){let t=this.meta(e),r=0|e.cache||t.cache,i=new Zt;i.set(t),i.$b={n:t.name,a:t.after,x:t.cleans,k:r&&zt(t,e)},n(e)&&i.set(e);let o=t.before;return o&&K(o,i,i),this.fire("begin",{bag:i}),i},meta(e){return this.$b[e.name||e]||e},get(e,t){let r,i,n=this;return t||(r=n.cached(e)),r||(r=n.create(e),i=1),{e:r,u:i}},clear(e){this.$c.each(Ft,se((e+a).split(s)))},cached(e){let t,r,i=this,n=i.$c,o=i.meta(e),l=0|e.cache||o.cache;if(l&&(r=zt(o,e)),r){let e=i.$f[r];e?t=e.e:(t=n.get(r))&&Lt()-t.$b.t>l&&(n.del(r),t=0)}return t},...ue};return Dt.extend=((e,t,r)=>{function i(){Dt.call(this)}return i.$s=e,i.$c=new _(t,r),i.$f={},i.$b={},W(i,Dt,$,Jt)}),he.Service=Dt,R(x[S],ue),x.extend=function e(t,r){let i=this,n=t&&t.ctor;function o(...e){i.apply(this,e),n&&n.apply(this,e)}return o.extend=e,W(o,i,t,r)},he.Base=x,e.add(O,()=>Ot.extend()),he},{requires:["event","node","dom"]});