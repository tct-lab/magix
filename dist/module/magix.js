/*!3.8.12 MIT kooboy_li@163.com*/let e=e=>Object.prototype.toString.call(e).slice(8,-1),t=t=>r=>e(r)==t,r=t("Object"),i=t("Array"),n=0,o="",l=[],a=",",f=null,s=window,d=void 0,u=document,h=s.setTimeout,$="changed",c="change",p="pageunload",m="value",g="mxs",b="#";function v(){}let y,w,x=JSON.stringify,k="\x1e",V="object",A="prototype",S="params",I="path",T="mx-view",C=/[#?].*$/,P=/([^=&?\/#]+)=?([^&#?]*)/g,E=/(?!^)=|&/,j=e=>(e||"mx_")+n++,M=j(),q={rootId:j(),defaultView:M,error(e){throw e}},O=e=>typeof e==V?e:u.getElementById(e),U=e=>!e||typeof e!=V,_=(e,t,r,i)=>{let n,o,l,a=0;for(l in e)n=e[l],o=t[l],U(n)&&o===n||J(i,l)||(r[l]=1,a=1),t[l]=n;return a},H=(e,t,r)=>{if(e=O(e),t=O(t),e&&t&&!(r=e==t))try{r=16==(16&t.compareDocumentPosition(e))}catch(e){}return r},{assign:L,keys:N,hasOwnProperty:D}=Object,R=document.head,Z=document.createElement("div"),B=(e,t)=>{t&&!B[e]&&(B[e]=1,Z.innerHTML=`<style>${t}`,R.appendChild(Z.firstChild))},z=e=>e.id||(e.$a=1,e.id=j()),F=(e,t,r,n,o)=>{t=t||l,i(e)||(e=[e]),i(t)||(t=[t]);for(o of e)try{n=o&&o.apply(r,t)}catch(e){q.error(e)}return n},J=(e,t)=>e&&D.call(e,t),Q=(e,t)=>{let r,i;if(U(t))(r=t+o)[0]==k&&J(e,r)&&(t=e[r]);else for(r in t)i=t[r],i=Q(e,i),t[r]=i;return t},W=(e,t)=>t.f-e.f||t.t-e.t;function X(e,t,r,i){(i=this).c=[],i.b=t||5,i.x=i.b+(e||20),i.r=r}L(X[A],{get(e){let t=this.c[k+e];return t&&(t.f++,t.t=n++,t=t.v),t},each(e,t,r,i,n){i=(r=this).c;for(n of i)e(n.v,t,r)},set(e,t){let r=this,i=r.c,o=k+e,l=i[o],a=r.b;if(!l){if(i.length>=r.x)for(i.sort(W);a--;)(l=i.pop()).f>0&&r.del(l.o);l={o:e},i.push(l),i[o]=l}l.v=t,l.f=1,l.t=n++},del(e){e=k+e;let t=this.c,r=t[e],i=this.r;r&&(r.f=-1,r.v=o,delete t[e],i&&F(i,r.o))},has(e){return J(this.c,k+e)}});let G=(e,t)=>{if(e)if(M==e)w||(w=rr.extend()),t(w);else{let r=[],n=0;i(e)||(e=[e]);let o=e=>i=>{r[e]=i.default,++n==r.length&&t(...r)},l=q.paths;for(let t,r,i,n=e.length;n--;)(r=(t=e[n]).indexOf("/"))>-1&&(i=t.slice(0,r),t=t.slice(r+1),t=(l[i]||`unset/${i}/path/`)+t),t.endsWith(".js")||(t+=".js"),import(t).then(o(n))}else t()};function K(){}let Y=(e,t,r,i,n)=>(K[A]=t[A],n=new K,L(n,r),L(e,i),n.constructor=e,e[A]=n,e),ee=(e,t,r)=>{let i=u.createEvent("Events");i.initEvent(t,!0,!0);for(let e in r)i[e]=r[e];e.dispatchEvent(i)},te=(e,t)=>{if(!t||!e||1!==e.nodeType)return 0;return(e.webkitMatchesSelector||e.mozMatchesSelector||e.oMatchesSelector||e.matchesSelector).call(e,t)},re=e=>e._mx||(e._mx=j("e")),ie={},ne=()=>!0,oe=()=>!1,le={preventDefault:"isDefaultPrevented",stopPropagation:"isPropagationStopped"},ae=(e,t,r,i)=>{let n=re(e),o=ie[n]||(ie[n]=[]),l={a:r&&r.i,b:i,c:t,d(t){t=(e=>{if(!e.isDefaultPrevented){for(let t in le){let r=le[t],i=e[t];e[t]=((...t)=>(e[r]=ne,i&&i.apply(e,t))),e[r]=oe}(void 0!==e.defaultPrevented?e.defaultPrevented:"returnValue"in e?!1===e.returnValue:e.getPreventDefault&&e.getPreventDefault())&&(e.isDefaultPrevented=ne)}return e})(t),i.call(e,t,r)}};o.push(l),e.addEventListener(t,l.d,r&&r.m)},fe=(e,t)=>{e.eventTarget=t.e,F(t.f,e,t.v)},se=(e,t,r,i,n)=>{i?((e,t,r,i)=>{let n=re(e),o=ie[n];if(o){let n;for(let e,l=o.length;l--;)if((e=o[l]).c==t&&e.b===i){let t=e.a;if(!r||r&&r.i==t){n=e,o.splice(l,1);break}}n&&e.removeEventListener(t,n.d,r&&r.m)}})(e,t,n,r):ae(e,t,n,r)},de=e=>e;let ue,he=new X,$e=0,ce=(e,t,r)=>{try{r=decodeURIComponent(r)}catch(e){}ue[t]=r},pe=e=>{let t,r=he.get(e);return r||(ue={},e==(t=e.replace(C,o))&&E.test(t)&&(t=o),e.replace(t,o).replace(P,ce),he.set(e,r={a:t,b:ue})),{path:r.a,params:{...r.b}}},me=(e,t,r)=>{let i,n,l,a=[];for(n in t)i=t[n]+o,(!r||i||J(r,n))&&(i=encodeURIComponent(i),a.push(l=n+"="+i));return l&&(e+=(e&&(~e.indexOf("?")?"&":"?"))+a.join("&")),e},ge=(e,t)=>{let r,i={};if(e)for(r of e)i[t&&r?r[t]:r]=t?r:1+(0|i[r]);return i},be=new X,ve=(e,t,r)=>(be.has(e)?r=be.get(e):(r=F(Function(`return ${e}`)),e.indexOf(k)>-1?Q(t,r):be.set(e,r)),r),ye={config:(e,t)=>(t=q,e&&(t=r(e)?L(t,e):t[e]),t),boot(e){L(q,e),G(q.ini,t=>{L(q,t,e),G(q.exts,()=>{We.on($,et),Te.on($,et),$e=1,ze()})})},toMap:ge,toTry:F,toUrl:me,parseUrl:pe,mix:L,has:J,keys:N,inside:H,node:O,applyStyle:B,guid:j,use:G,Cache:X,fire:ee,type:e,nodeId:z,guard:de},we={fire(e,t,r,i){let n,l,a,f,s=this,d=s[k+e];if(t||(t={}),t.type=e,d)for(l=(n=d.length)-1;n--;)(f=d[a=i?n:l-n]).f?(f.x=1,F(f.f,t,s),f.x=o):f.x||(d.splice(a,1),l--);return(d=s[`on${e}`])&&F(d,t,s),r&&s.off(e),s},on(e,t){let r=k+e;return(this[r]||(this[r]=[])).push({f:t}),this},off(e,t){let r,i=k+e,n=this,l=n[i];if(t){if(l)for(r of l)if(r.f==t){r.f=o;break}}else delete n[i],delete n[`on${e}`];return n}};ye.Event=we;let xe={},ke={},Ve={},Ae=0,Se=e=>{e=(e+o).split(",");for(let t of e)J(ke,t)?ke[t]++:ke[t]=1;return e},Ie=e=>{let t,r;for(t of e)J(ke,t)&&((r=--ke[t])||(delete ke[t],delete xe[t]))};let Te={get(e){let t=e?xe[e]:xe;return t},set(e,t){return Ae=_(e,xe,Ve,t)||Ae,this},digest(e,t){e&&Te.set(e,t),Ae&&(Ae=0,this.fire($,{keys:Ve}),Ve={})},diff:()=>Ve,clean:e=>({ctor(){e=Se(e),this.on("destroy",()=>Ie(e))}}),...we};ye.State=Te;let Ce,Pe="view",Ee=new X,je=new X,Me=s.location,qe=0,Oe={query:{},params:{},href:o},Ue=/(?:^.*\/\/[^\/]+|#.*$)/gi,_e=/^[^#]*#?!?/;function He(e,t){return this[S][e]||t!==d&&t||o}let Le,Ne,De,Re,Ze,Be=(e,t)=>{e="#!"+e,t?Me.replace(e):Me.hash=e},ze=()=>{let e,t,r=Je().srcHash;se(s,"hashchange",(i,n,l)=>{t||(n=Je(),(e=n.srcHash)!=r&&(l=(()=>{i.p=1,r=e,t=o,Be(e),Qe()}),i={reject(){i.p=1,t=o,Be(r)},resolve:l,prevent(){t=1}},We.fire(c,i),t||i.p||l()))}),se(s,"beforeunload",(e,t,r)=>{if(e=e||s.event,t={},We.fire(p,t),r=t.msg)return e&&(e.returnValue=r),r}),Qe()},Fe=u.title,Je=e=>{e=e||Me.href;let t,i,n,l,a,f=Ee.get(e);return f||(f={get:He,href:e,srcQuery:t=e.replace(Ue,o),srcHash:i=e.replace(_e,o),query:n=pe(t),hash:l=pe(i),params:a={...n[S],...l[S]}},$e&&(((e,t)=>{if(Le||(Le=q.routes||{},Ne=q.unmatchView,De=q.defaultView,Re=q.defaultPath||"/",Ze=q.rewrite),!e[Pe]){let i=e.hash[I]||Re;Ze&&(i=Ze(i,e[S],Le)),t=Le[i]||Ne||De,e[I]=i,e[Pe]=t,r(t)&&L(e,t)}})(f),Ee.set(e,f))),f},Qe=()=>{let e=Je(),t=((e,t)=>{let r=e.href,i=t.href,n=r+k+i,o=je.get(n);if(!o){let i,l;o={params:l={},force:!r};let a,f=e[S],s=t[S],d=N(f).concat(N(s)),u=e=>{let t=f[e],r=s[e];t!=r&&(l[e]={from:t,to:r},i=1)};for(a of d)u(a);f=e,s=t,l=o,u(I),u(Pe),je.set(n,o={a:i,b:o})}return o})(Oe,Oe=e);return!qe&&t.a&&((Ce=t.b)[I]&&(u.title=e.title||Fe),We.fire($,Ce)),qe=0,Ce},We={parse:Je,diff:Qe,to(e,t,i,n){!t&&r(e)&&(t=e,e=o);let l=pe(e),a=l[S],f=l[I],s=Oe[I],d=Oe[S],u=Oe.query[S];if(L(a,t),f)for(s in u)J(a,s)||(a[s]=o);else d&&(f=s,a={...d,...a});var h,$,c,p;$=Oe,c=i,p=n,(h=me(h=f,a,u))!=$.srcHash&&(qe=p,Be(h,c))},...we};ye.Router=We;let Xe,Ge,Ke=0,Ye=(e,t,r,i,n,o)=>{if(e&&e.$a!=Ke&&(r=e.$v)&&r.$a>1){(t?((e,t,r)=>{let i,n=e.$os;if(n)for(i of n)if(r=J(t,i))break;return r})(r,t):tr(r))&&r.$b(),n=e.children();for(o of n)Ye(tt[o],t)}},et=(e,t,r)=>{t=ot(),(r=e[Pe])?t.mountView(r.to):(Ke=n++,Ye(t,e.keys))},tt={},rt=e=>{if(!e.$b&&!e.$d&&e.$cc==e.$rc){e.$cr||(e.$cr=1,e.$ca=0,e.fire("created"));let{id:t,pId:r}=e,i=tt[r];i&&!J(i.$e,t)&&(i.$e[t]=1,i.$rc++,rt(i))}},it=(e,t)=>{if(!e.$ca&&e.$cr){e.$cr=0,e.$ca=1,e.fire("alter",t);let{id:r,pId:i}=e,n=tt[i];n&&J(n.$e,r)&&(n.$rc--,delete n.$e[r],it(n,t))}},nt=(e,t,r,i)=>(i=(i=(i=tt[e])&&i.$v)?i.$d.$a:{},t.indexOf(k)>0&&Q(i,r),i),ot=e=>(Xe||(y=u.body,e=q.rootId,O(e)||(y.id=e),Xe=new st(e)),Xe),lt=(e,t)=>{J(tt,e)||(tt[e]=t,st.fire("add",{vframe:t}),(e=O(e))&&(e.vframe=t))},at=(e,t,r)=>{for(t=e.$f;t.length;)(r=t.shift()).r||e.invoke(r.n,r.a),delete t[r.k]},ft=[];function st(e,t,r){(r=this).id=e,r.$c={},r.$cc=0,r.$rc=0,r.$g=r.$g||1,r.$e={},r.$f=[],r.pId=t,lt(e,r)}L(st,{all:()=>tt,get:e=>tt[e]},we),L(st[A],we,{mountView(e,t){let r,i,n,l,a,f=this,s=f.id,d=O(s),u=f.pId;!f.$h&&d&&(f.$h=1,f.$i=d.innerHTML),f.unmountView(),f.$b=0,r=pe(e||o),n=r[I],d&&n&&(f[I]=e,l=r[S],nt(u,e,l),f.$j=r[I],L(l,t),i=f.$g,G(n,e=>{if(i==f.$g){if(!e)return q.error(Error(`id:${s} cannot load:${n}`));a=er(e),n=new e(s,f,l,d,a),f.$v=n,f.$a=Ke,Xt(n),(l=F(n.init,[l,{node:d,deep:!n.tmpl}],n))||(l={then:e=>e()}),i=++f.$g,l.then(()=>{i==f.$g&&(n.$b(),n.tmpl||(f.$h=0,n.$e||n.endUpdate()))})}}))},unmountView(){let e,t,r=this,{$v:i,id:n}=r;r.$f=[],i&&(Ge||(t=1,Ge={id:n}),r.$b=1,r.unmountZone(0,1),it(r,Ge),r.$v=0,i.$a>0&&(i.$a=0,delete ct[n],delete pt[n],i.fire("destroy",0,1,1),Jt(i,1),Xt(i,1),i.owner=0),i.$a--,(e=O(n))&&r.$h&&(e.innerHTML=r.$i),t&&(Ge=0)),r.$g++},mountVframe(e,t,r){let i,n=this,o=n.id,l=n.$c;return it(n,{id:e}),(i=tt[e])||(J(l,e)||(n.$n=0,n.$cc++),l[e]=e,(i=ft.pop())?st.call(i,e,o):i=new st(e,o)),i.mountView(t,r),i},mountZone(e,t){let r,i,n=this,o=[],l=(e=>u.querySelectorAll(e))(`#${e=e||n.id} [${T}]`);n.$d=1;for(r of l)r.$b||(i=z(r),r.$b=1,o.push([i,r.getAttribute(T)]));for([i,r]of o)n.mountVframe(i,r);n.$d=0,t||rt(n)},unmountVframe(e,t){let r;if(e=e?this.$c[e]:this.id,r=tt[e]){let{$cr:l,pId:a}=r;r.unmountView(),n=l,(o=tt[i=e])&&(delete tt[i],st.fire("remove",{vframe:o,fcc:n}),(i=O(i))&&(i.$b=0,i.vframe=0,i.$a=0)),r.id=r.pId=r.$c=r.$e=0,r.$h=0,r.off("alter"),r.off("created"),ft.push(r),(r=tt[a])&&J(r.$c,e)&&(delete r.$c[e],r.$n=0,r.$cc--,t||rt(r))}var i,n,o},unmountZone(e,t){let r,i=this;for(r in i.$c)(!e||r!=e&&H(r,e))&&i.unmountVframe(r,1);t||rt(i)},parent(e,t){for(t=this,e=e>>>0||1;t&&e--;)t=tt[t.pId];return t},children(e){return(e=this).$n||(e.$n=N(e.$c))},invoke(e,t){let r,i,n,o,l,a=this.$f;return(i=this.$v)&&i.$e?r=(n=i[e])&&F(n,t,i):((o=a[l=k+e])&&(o.r=t===o.a),o={n:e,a:t,k:l},a.push(o),a[l]=o),r}}),ye.Vframe=st;let dt=new X(30,10),ut=/(?:([\w\-]+)\x1e)?([^(]+)\(([\s\S]*)?\)/,ht={},$t={},ct={},pt={},mt=0,gt=(e,t)=>{let r,i,n,o,a,f,s=[],d=e,u=e.getAttribute(`mx-${t}`),h=[],$=b,c=0;if(u&&((a=dt.get(u))||(a={v:(a=u.match(ut)||l)[1],n:a[2],i:a[3]},dt.set(u,a)),a={...a,r:u}),a&&!a.v||$t[t]){if((n=pt[i=d.$d])&&1==n[d.$e]&&(f=1,$=i),!f){for(h.push(d);d!=y&&(d=d.parentNode);){if(tt[i=d.id]||(n=pt[i=d.$d])&&1==n[d.$e]){$=i;break}h.push(d)}for(u of h)(i=pt[$])||(i=pt[$]={}),i[n=u.$e||(u.$e=++mt)]=1,u.$d=$}d=e.id,tt[d]&&(c=$=d);do{if((r=tt[$])&&(f=r.$v)){if(o=(n=f.$so)[t])for(d=o.length;d--;)n={r:i=o[d],v:$,n:i},i?!c&&te(e,i)&&s.push(n):c&&s.unshift(n);if(f.tmpl&&!c){a&&!a.v&&(a.v=$);break}c=0}}while(r&&($=r.pId))}return a&&s.push(a),s},bt=e=>{let t,r,i,n,o,l,a,f,{target:s,type:d}=e,u=[];for(;s!=y;){if((t=gt(s,d)).length){u=[];for(let{v:r,r:u,n:h,i:$}of t){if(a!=r){if(a&&e.isPropagationStopped())break;a=r}(n=(i=tt[r])&&i.$v)?(l=n[o=h+k+d])&&(e.eventTarget=s,f=$?ve($,n.$d.$a):{},e[S]=f,F(l,e,n)):e.stopPropagation()}}if((r=ct[l=s.$d])&&(r=r[s.$e])&&r[d]||e.isPropagationStopped()){u.length&&u.push(l);break}a=s.id,tt[a]&&u.push(a),u.push(s),s=s.parentNode||y}if(l=u.length)for(r=b;l--;)(n=u[l]).nodeType?((t=ct[r])||(t=ct[r]={}),(f=t[a=n.$e||(n.$e=++mt)])||(f=t[a]={}),f[d]=1):r=n},vt=(e,t,r)=>{let i=0|ht[e],n=r?-1:1;i&&r!==i||se(y,e,bt,r),ht[e]=i+n,t&&($t[e]=(0|$t[e])+n)},yt="http://www.w3.org/2000/svg",wt="http://www.w3.org/1998/Math/MathML",xt={option:[1,"<select multiple>"],thead:[1,"<table>"],col:[2,"<table><colgroup>"],tr:[2,"<table><tbody>"],td:[3,"<table><tbody><tr>"],area:[1,"<map>"],param:[1,"<object>"],g:[1,`<svg xmlns="${yt}">`],m:[1,`<math xmlns="${wt}">`],_:[0,""]},kt=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i;xt.optgroup=xt.option,xt.tbody=xt.tfoot=xt.colgroup=xt.caption=xt.thead,xt.th=xt.td;let Vt=u.implementation.createHTMLDocument(o),At=Vt.createElement("base");At.href=u.location.href,Vt.head.appendChild(At);let St=(e,t)=>{let r=z(t);e.$c[r]?e.unmountVframe(r,1):e.unmountZone(r,1)},It={INPUT:[m,"checked"],TEXTAREA:[m],OPTION:["selected"]},Tt=(e,t)=>(1==e.nodeType&&(e.$f?t=e.$g:((t=e.$a?o:e.id)||(t=e.getAttribute(g)),t||(t=e.getAttribute(T))&&(t=pe(t)[I]),e.$f=1,e.$g=t)),t),Ct=(e,t,r,i,n)=>{let o,l,a,f,s,d=e.lastChild,u=t.firstChild,h=0,$={},c={};for(;d;)h++,(a=Tt(d))&&(a=$[a]||($[a]=[])).push(d),d=d.previousSibling;for(;u;)(a=Tt(u))&&(c[a]=(c[a]||0)+1),u=u.nextSibling;for(u=t.firstChild,d=e.firstChild;u;)if(h--,o=u,u=u.nextSibling,(f=$[a=Tt(o)])&&(f=f.pop())){for(;f!=d;)s=d.nextSibling,e.appendChild(d),d=s;d=f.nextSibling,c[a]&&c[a]--,Pt(f,o,e,r,i,n)}else d?(a=Tt(l=d))&&$[a]&&c[a]?(h++,r.c=1,r.n.push([8,e,o,l])):(d=d.nextSibling,Pt(l,o,e,r,i,n)):(r.c=1,r.n.push([1,e,o]));for(l=e.lastChild;h-- >0;)St(i,l),r.n.push([2,e,l]),l=l.previousSibling,r.c=1},Pt=(e,t,r,i,n,l)=>{if(((e,t)=>{let r,i=e.nodeName,n=It[i],o=0;if(n)for(r of n)e[r]!=t[r]&&(o=1,e[r]=t[r]);return o})(e,t)||1==e.nodeType&&e.hasAttribute("mxv")||!e.isEqualNode||!e.isEqualNode(t))if(e.nodeName===t.nodeName)if(1===e.nodeType){let r=t.getAttribute(g);if(r&&r==e.getAttribute(g))return;let f,s,d,u,h,$,c,p=t.getAttribute(T),v=t.innerHTML,y=t.getAttribute("mxa"),w=!y||y!=e.getAttribute("mxa"),x=tt[e.id],k=p&&pe(p);if(p&&x&&(!t.id||t.id==e.id)&&x.$j==k[I]&&(u=x.$v)){if($=v!=x.$i,c=p!=x[I],d=e.getAttribute("mxv"),!$&&!c&&d){h=d.split(a);for(d of h)if(d==b||J(l,d)){c=1;break}}(c||$)&&((d=u.$e&&u.$f)?(h=k[S],nt(x.pId,p,h),x.$i=v,x[I]=p,k={node:t,deep:!u.tmpl,attr:w,inner:$,query:c,keys:l},F(d,[h,k],u)&&i.v.push(u),f=k.deep):(s=1,f=1))}else f=1,s=x;s&&(i.c=1,x.unmountVframe(0,1)),w&&((e,t,r,i)=>{let n,l,a,f;delete e.$f;let s=e.attributes,d=t.attributes;for(l=s.length;l--;)n=s[l].name,t.hasAttribute(n)||("id"==n?i||r.d.push([e,o]):(r.c=1,e.removeAttribute(n)));for(l=d.length;l--;)a=(n=d[l]).name,f=n[m],e.getAttribute(a)!=f&&("id"==a?r.d.push([e,f]):(r.c=1,e.setAttribute(a,f)))})(e,t,i,x&&p),f&&Ct(e,t,i,n,l)}else e.nodeValue!==t.nodeValue&&(i.c=1,e.nodeValue=t.nodeValue);else St(n,e),i.c=1,i.n.push([4,r,t,e])},Et={"&":"amp","<":"lt",">":"gt",'"':"#34","'":"#39","`":"#96"},jt=/[&<>"'\`]/g,Mt=e=>""+(null==e?"":e),qt=e=>`&${Et[e]};`,Ot=e=>Mt(e).replace(jt,qt),Ut=(e,t,r,i)=>{for(i=e[k];--i;)if(e[r=k+i]===t)return r;return e[r=k+e[k]++]=t,r},_t={"!":"%21","'":"%27","(":"%28",")":"%29","*":"%2A"},Ht=e=>_t[e],Lt=/[!')(*]/g,Nt=e=>encodeURIComponent(Mt(e)).replace(Lt,Ht),Dt=/[\\'"]/g,Rt=e=>Mt(e).replace(Dt,"\\$&"),Zt=(e,t)=>{let r,i,n=e.$k,o=e.$c,l=e.$b,a=tt[l],f=a&&a.$v,s={d:[],v:[],n:[]},d=O(l),h=e.$d,$=e.$a,c=r=>{t.i<t.length?Zt(e,t):(s=t.slice(),t.i=t.length=0,r&&f.fire("domready"),F(s))};if(t.i=t.length,e.$c=0,e.$k={},o&&f&&f.$a>0&&(r=f.tmpl)&&f.$d==e){f.fire("dompatch"),delete ct[l],delete pt[l],i=((e,t)=>{let r,i=Vt.createElement("div"),n=t.namespaceURI;r=n==yt?"g":n==wt?"m":(kt.exec(e)||[0,""])[1];let o=xt[r]||xt._;i.innerHTML=o[1]+e;let l=o[0];for(;l--;)i=i.lastChild;return i})(r(h,l,$,Ot,Mt,Nt,Ut,Rt),d),Ct(d,i,s,a,n);for(i of s.d)i[0].id=i[1];for(i of s.n)1==i[0]?i[1].appendChild(i[2]):2==i[0]?i[1].removeChild(i[2]):4==i[0]?i[1].replaceChild(i[2],i[3]):i[1].insertBefore(i[2],i[3]);a.$d=r=s.c||!f.$e;for(i of s.v)i.$b();r&&f.endUpdate(l),s.c&&ee(u,"htmlchanged",{vId:l}),c(1)}else c()};function Bt(e){let t=this;t.$b=e,t.$c=1,t.$d={vId:e},t.$a={[k]:1},t.$e=[],t.$k={}}L(Bt[A],{get(e,t){return t=this.$d,e&&(t=t[e]),t},set(e,t){let r=this;return r.$c=_(e,r.$d,r.$k,t)||r.$c,r},digest(e,t,r){let i=this.set(e,t),n=i.$e;r&&n.push(r),n.i||Zt(i,n)},snapshot(){return this.$f=x(this.$d),this},altered(){let e=this;if(e.$f)return e.$f!=x(e.$d)},translate(e){return Q(this.$d,e)},parse(e){return ve(e,this.$a)}});let zt=/^(\$?)([^<]*)<([^>]+)>(?:&(.+))?$/,Ft=(e,t,r)=>(e.a?r=e:((r=function(e){F(r.a,e,this)}).a=[e],r.b=1),r.a=r.a.concat(t.a||t),r),Jt=(e,t)=>{let r,i,n=e.$r;for(r in n)i=n[r],(t||i.x)&&Qt(n,r,1)},Qt=(e,t,r,i)=>{let n,o,a=e[t];return a&&a!=i&&((n=(o=a.e).destroy)&&r&&F(n,l,o),delete e[t]),o},Wt=(e,t,r,i,n)=>{i=e[t],e[t]=e[r]=function(...e){(n=this).$a>0&&(n.$a++,n.fire("rendercall"),Jt(n),F(i,e,n))}},Xt=(e,t)=>{let r,{$eo:i,$so:n,$el:o,id:l}=e;for(r in i)vt(r,n[r],t);for(r of o)se(r.e,r.n,fe,t,{i:l,v:e,f:r.f,m:r.m,e:r.e})},Gt={win:s,doc:u},Kt=(e,t,r)=>{let i,n,o,l,a={};for(n of e)for(i in n)o=n[i],l=a[i],"ctor"!=i?(zt.test(i)&&(l?o=Ft(l,o):o.b=1),a[i]=o):r.push(o);for(i in a)J(t,i)||(t[i]=a[i])};function Yt(...e){let t=this._||(this._=[]);return Kt(e,this[A],t),this}let er=e=>{if(!e[k]){e[k]=[];let t,r,i,n,o,l,f,s,d,u,h,$=e[A],c={},p=[],m={};(r=$.mixins)&&Kt(r,$,e[k]);for(f in $)if(t=$[f],r=f.match(zt)){if([,l,i,n,h]=r,u={},h){h=h.split(a);for(s of h)u[s]=!0}n=n.split(a);for(s of n){if(o=Gt[i],d=1,l){if(o){p.push({f:t,e:o,n:s,m:u});continue}d=2,(o=m[s])||(o=m[s]=[]),o[i]||(o[i]=1,o.push(i))}c[s]=c[s]|d,(o=$[s=i+k+s])?o.b&&(t.b?$[s]=Ft(t,o):J($,f)&&($[s]=t)):$[s]=t}}Wt($,"render","$b"),$.$eo=c,$.$el=p,$.$so=m,$.$f=$.assign}return e[k]},tr=e=>{let t,r,i,n=e.$l;if(n.f&&(n.p&&(t=Ce[I]),!t&&n.k)){i=Ce[S];for(r of n.k)if(t=J(i,r))break}return t};function rr(e,t,r,i,n){(n=this).owner=t,n.id=e,n.$l={k:[]},n.$r={},n.$a=1,n.updater=n.$d=new Bt(n.id),(e=rr._)&&F(e,[r,{node:i,deep:!n.tmpl}],n)}L(rr,{merge:Yt,extend:function e(t,r){let i=this,n=(t=t||{}).ctor,o=[];function l(e,t,r,n,a,f,s,d,u){i.call(s=this,e,t,r,n,a),f=l._,d=[r,{node:n,deep:!s.tmpl}],f&&F(f,d,s),(u=o.concat(a)).length&&F(u,d,s)}return n&&o.push(n),l.merge=Yt,l.extend=e,Y(l,i,t,r)}}),L(rr[A],we,{init:v,beginUpdate(e,t){(t=this).$a>0&&t.$e&&t.owner.unmountZone(e,1)},endUpdate(e,t,r,i,n){(r=this).$a>0&&(e=e||r.id,t?n=t:(n=r.$e,r.$e=1),(i=r.owner).mountZone(e,t),n||h(r.wrapAsync(at),0,i))},wrapAsync(e,t){let r=this,i=r.$a;return(...n)=>{if(i>0&&i==r.$a)return e.apply(t||r,n)}},observeLocation(e,t){let i;(i=this.$l).f=1,r(e)&&(t=e[I],e=e[S]),i.p=t,e&&(i.k=(e+o).split(a))},observeState(e){this.$os=(e+o).split(a)},capture(e,t,r,i){return i=this.$r,t?(Qt(i,e,1,t),i[e]={e:t,x:r}):t=(i=i[e])&&i.e,t},release(e,t){return Qt(this.$r,e,t)},leaveTip(e,t){let r=this,i=n=>{let o="a",l="b";n.type!=c&&(o="b",l="a"),i[o]?(n.prevent(),n.reject()):t()&&(n.prevent(),i[l]=1,r.leaveConfirm(()=>{i[l]=0,n.resolve()},()=>{i[l]=0,n.reject()},e))},n=r=>{t()&&(r.msg=e)};We.on(c,i),We.on(p,n),r.on("unload",i),r.on("destroy",()=>{We.off(c,i),We.off(p,n)})},render:v}),ye.View=rr;let ir=Date.now;function nr(){this.id=j("b"),this.$={}}L(nr[A],{get(t,r){let n,l=this.$;if(t){let e,r=i(t)?t.slice():(t+o).split(".");for(;(e=r.shift())&&l;)l=l[e];e&&(l=d)}return r!==d&&(n=e(r))!=e(l)&&(l=r),l},set(e,t){r(e)||(e={[e]:t}),L(this.$,e)}});function or(e,t,r){(r=this[e])&&(delete this[e],F(r,t,r.e))}let lr=(e,t,r,i,n,o)=>{let l=[],a=f,s=0;return function(d,u){s++;let h,$,c=this,p=c.$b,m=p.k;if(l[d+1]=c,u?(a=u,h=1):o.has(m)||(m&&o.set(m,c),p.t=ir(),($=p.a)&&F($,c,c),($=p.x)&&t.clear($),h=1),!r.$d){let t=s==i;t&&(r.$e=0,2==n&&(l[0]=a,F(e,l,r))),1==n&&F(e,[u||f,c,t,d],r)}h&&t.fire("end",{bag:c,error:u})}},ar=(e,t,r,n,o)=>{if(e.$d)return e;if(e.$e)return e.enqueue(ar.bind(e,e,t,r,n,o));e.$e=1,i(t)||(t=[t]);let l=e.constructor,a=0,f=l.$f,s=lr(r,l,e,t.length,n,l.$c);for(let e of t)if(e){let t,r=l.get(e,o),i=r.e,n=i.$b.k,d=s.bind(i,a++);n&&f[n]?f[n].push(d):r.u?(n&&((t=[d]).e=i,f[n]=t,d=or.bind(f,n)),l.$s(i,d)):d()}return e};function fr(){let e=this;e.id=j("s"),e.$g=[]}L(fr[A],{all(e,t){return ar(this,e,t,2)},save(e,t){return ar(this,e,t,2,1)},one(e,t){return ar(this,e,t,1)},enqueue(e){let t=this;return t.$d||(t.$g.push(e),t.dequeue(t.$h)),t},dequeue(...e){let t,r=this;r.$e||r.$d||(r.$e=1,h(()=>{r.$e=0,r.$d||(t=r.$g.shift())&&F(t,r.$h=e)},0))},destroy(e){(e=this).$d=1,e.$g=0}});let sr=(e,t)=>[x(t),x(e)].join(k),dr=(e,t,r,i)=>{(i=e&&e.$b)&&t[i.n]&&r.del(i.k)},ur={add(e){let t,r=this.$b;i(e)||(e=[e]);for(t of e)if(t){let{name:e,cache:i}=t;t.cache=0|i,r[e]=t}},create(e){let t=this.meta(e),i=0|e.cache||t.cache,n=new nr;n.set(t),n.$b={n:t.name,a:t.after,x:t.cleans,k:i&&sr(t,e)},r(e)&&n.set(e);let o=t.before;return o&&F(o,n,n),this.fire("begin",{bag:n}),n},meta(e){return this.$b[e.name||e]||e},get(e,t){let r,i,n=this;return t||(r=n.cached(e)),r||(r=n.create(e),i=1),{e:r,u:i}},clear(e){this.$c.each(dr,ge((e+o).split(a)))},cached(e){let t,r,i=this,n=i.$c,o=i.meta(e),l=0|e.cache||o.cache;if(l&&(r=sr(o,e)),r){let e=i.$f[r];e?t=e.e:(t=n.get(r))&&ir()-t.$b.t>l&&(n.del(r),t=0)}return t},...we};fr.extend=((e,t,r)=>{function i(){fr.call(this)}return i.$s=e,i.$c=new X(t,r),i.$f={},i.$b={},Y(i,fr,f,ur)}),ye.Service=fr,L(v[A],we),v.extend=function e(t,r){let i=this,n=t&&t.ctor;function o(...e){i.apply(this,e),n&&n.apply(this,e)}return o.extend=e,Y(o,i,t,r)},ye.Base=v;export default ye