/*3.1.6 Licensed MIT*/define("magix",["$"],function(n){var t,e=function(n,t){n?(a(n)||(n=[n]),require(n,t)):t&&t()},r=function(){},i=function(n,t,e,i,o){return r[x]=t[x],o=new r,E(o,e),E(n,i),o.constructor=n,n[x]=o,n},o=n.isPlainObject,a=n.isArray,f=function(t,e){n(t).html(e)},u=function(t,e,r,i){e&&!u[t]&&(u[t]=1,r=n(g+j),r.length?(i=r.prop("styleSheet"),i?i.cssText+=e:r.append(e)):n("head").append('<style id="'+j+'">'+e+"</style>"))},c=0,s="",$=[],h=$.slice,l=function(){},d=",",v=null,p=window,m=document,g="#",w=JSON.stringify,y="",b="object",x="prototype",k="/",V=/[#?].*$/,q=/([^=&?\/#]+)=?([^&#?]*)/g,I=/(?!^)=|&/,S=function(n){return(n||"mx_")+c++},j=S(),T=S(),U={rootId:S(),defaultView:T,error:function(n){throw n}},A=U.hasOwnProperty,H=function(n){return typeof n==b?n:m.getElementById(n)},O=function(n,t,e){if(n=H(n),t=H(t),n&&t&&(e=n==t,!e))try{e=t.contains?t.contains(n):16&t.compareDocumentPosition(n)}catch(r){}return e},E=function(n,t,e){for(e in t)n[e]=t[e];return n},M=function(n,t,e,r,i,o){for(a(n)||(n=[n]),a(t)||(t=[t]),r=0;o=n[r];r++)try{i=o&&o.apply(e,t)}catch(f){U.error(f)}return i},P=function(n,t){return n&&A.call(n,t)},Z=function(n,t){return t.f-n.f||t.t-n.t},L=function(n,t,e,r){r=this,r.c=[],r.b=0|t||5,r.x=r.b+(n||20),r.r=e};E(L[x],{get:function(n){var t=this,e=t.c,r=e[y+n];return r&&(r.f++,r.t=c++,r=r.v),r},each:function(n,t,e,r,i){for(e=this,r=e.c,i=r.length-1;i>-1;i--)n(r[i].v,t,e)},set:function(n,t){var e=this,r=e.c,i=y+n,o=r[i],a=e.b;if(!o){if(r.length>=e.x)for(r.sort(Z);a--;)o=r.pop(),o.f>0&&e.del(o.o);o={o:n},r.push(o),r[i]=o}o.v=t,o.f=1,o.t=c++},del:function(n){n=y+n;var t=this.c,e=t[n],r=this.r;e&&(e.f=-1,e.v=s,delete t[n],r&&M(r,e.o,e))},has:function(n){return P(this.c,y+n)}});var C,D=new L,R=function(n,t,e){try{e=decodeURIComponent(e)}catch(r){}C[t]=e},B=function(n){var t,e=D.get(n);return e||(C={},t=n.replace(V,s),n==t&&I.test(t)&&(t=s),n.replace(t,s).replace(q,R),D.set(n,e={a:t,b:C})),{path:e.a,params:E({},e.b)}},F=function(n,t,e){var r,i,o,a=[];for(i in t)r=t[i]+s,(!e||r||P(e,i))&&(r=encodeURIComponent(r),a.push(o=i+"="+r));return o&&(n+=(n&&(~n.indexOf("?")?"&":"?"))+a.join("&")),n},N=function(n,t){var e,r,i,o={};if(n&&(i=n.length))for(e=0;i>e;e++)r=n[e],o[t&&r?r[t]:r]=t?r:(0|o[r])+1;return o},J=Object.keys||function(n,t,e){t=[];for(e in n)P(n,e)&&t.push(e);return t},K={config:function(n,t){return t=U,n&&(t=o(n)?E(t,n):t[n]),t},boot:function(n){E(U,n),e(U.ini,function(t){E(U,t),E(U,n),e(U.exts,function(){pn.on("changed",Sn),rn()})})},toMap:N,toTry:M,toUrl:F,parseUrl:B,mix:E,has:P,keys:J,inside:O,node:H,applyStyle:u,guid:S,Cache:L},Q="on",_={fire:function(n,t,e,r){var i,o,a,f,u=y+n,c=this,s=c[u];if(t||(t={}),t.type||(t.type=n),s)for(i=s.length,o=i-1;i--;)a=r?i:o-i,f=s[a],f.d?(s.splice(a,1),o--):M(f.f,t,c);s=c[Q+n],s&&M(s,t,c),e&&c.off(n)},on:function(n,t){var e=this,r=y+n,i=e[r]||(e[r]=[]);i.push({f:t})},off:function(n,t){var e,r,i=y+n,o=this,a=o[i];if(t){if(a)for(e=a.length;e--;)if(r=a[e],r.f==t&&!r.d){r.d=1;break}}else delete o[i],delete o[Q+n]}};K.Event=_;var z,G,W,X,Y,nn,tn,en=function(n,t,e,r,i){n=F(n,t,i),n!=e.srcHash&&(n="#!"+n,r?sn.replace(n):sn.hash=n)},rn=function(){n(p).on("hashchange",pn.diff),pn.diff()},on="path",an="view",fn="params",un=new L,cn=new L,sn=p.location,$n={params:{},href:s},hn=/(?:^.*\/\/[^\/]+|#.*$)/gi,ln=/^[^#]*#?!?/,dn=function(n){if(X||(X=U.routes||{},Y=U.unmatchView,nn=U.defaultView,tn=U.defaultPath||k,X[tn]||(X[tn]=nn)),!n[an]){var t=n.hash[on]||z&&n.query[on]||tn;n[on]=t,n[an]=X[t]||Y||nn}},vn=function(n,t){var e=n.href,r=t.href,i=e+y+r,o=cn.get(i);if(!o){var a,f,u,c;o={force:!n.href},o[fn]=c={};var s,$,h=n[fn],l=t[fn],d=[on,an].concat(J(h),J(l));for(s=d.length-1;s>=0;s--)$=d[s],1==s&&(h=n,l=t,c=o),f=h[$],u=l[$],f!=u&&(c[$]={from:f,to:u},a=1);cn.set(i,o={a:a,b:o})}return o},pn=E({parse:function(n){n=n||sn.href;var t,e,r,i,o,a=un.get(n);return a||(t=n.replace(hn,s),e=n.replace(ln,s),r=B(t),i=B(e),o=E({},r[fn]),E(o,i[fn]),a={href:n,srcQuery:t,srcHash:e,query:r,hash:i,params:o},dn(a),un.set(n,a)),a},diff:function(){var n=pn.parse(),t=vn($n,$n=n);return t.a&&(W=$n[fn],pn.fire("changed",G=t.b)),G},to:function(n,t,e){!t&&o(n)&&(t=n,n=s);var r=B(n),i=r[fn],a=r[on],f=$n[on],u=$n.query[fn];if(E(i,t),a){if(!z)for(f in u)P(i,f)||(i[f]=s)}else W&&(a=f,i=E(E({},W),i));en(a,W=i,$n,e,u)}},_);K.Router=pn;var mn,gn,wn=function(n,t,e){n.$d||n.$h||n.$cc!=n.$rc||(n.$cr||(n.$cr=1,n.$ca=0,n.fire("created")),t=n.id,e=xn[n.pId],e&&!P(e.$r,t)&&(e.$r[t]=1,e.$rc++,wn(e)))},yn=function(n,t,e,r){t||(t={}),!n.$ca&&n.$cr&&(n.$cr=0,n.$ca=1,n.fire("alter",t),e=n.id,r=xn[n.pId],r&&P(r.$r,e)&&(r.$rc--,delete r.$r[e],yn(r,t)))},bn=function(n,e){return mn||(t=m.body,n=U.rootId,e=H(n),e||(t.id=n),mn=new jn(n)),mn},xn={},kn=function(n,t){P(xn,n)||(xn[n]=t,jn.fire("add",{vframe:t}),n=H(n),n&&(n.vframe=t))},Vn=function(n,t,e){for(t=n.$il;t.length;)e=t.shift(),e.r||n.invoke(e.n,e.a),delete t[e.k]},qn=function(n,t,e){e=xn[n],e&&(delete xn[n],jn.fire("remove",{vframe:e,fcc:t}),n=H(n),n&&(n.vframe=v))},In=function(n,t){if(n&&(t=n.$v)&&t.$s>0){var e=rt(t);e&&t.render();for(var r=n.children(),i=r.length,o=0;i>o;)In(xn[r[o++]])}},Sn=function(n){var t,e=bn();(t=n.view)?e.mountView(t.to):In(e)},jn=function(n,t,e){e=this,e.id=n,e.$c={},e.$cc=0,e.$rc=0,e.$s=1,e.$r={},e.$il=[],e.pId=t,kn(n,e)};E(jn,E({all:function(){return xn},get:function(n){return xn[n]}},_)),E(E(jn[x],_),{mountView:function(n,t){var r,i,o,a=this,f=H(a.id);!a.$a&&f&&(a.$a=1,a.$t=f.innerHTML),a.unmountView(),a.$d=0,f&&n&&(a.path=n,r=B(n),o=r.path,i=++a.$s,e(o,function(e){if(i==a.$s){e||U.error(Error("cannot load:"+o)),tt(e);var f,u,c=r.params,s=xn[a.pId];if(s=s&&s.$v.$updater,s&&n.indexOf(y)>0)for(f in c)u=c[f],u.charAt(0)==y&&(c[f]=s.get(u));var $=E(c,t);o=new e({owner:a,id:a.id},$),a.$v=o,Xn(o),o.init($),o.render(),o.tmpl||o.$p||o.endUpdate()}}))},unmountView:function(){var n,t,e=this,r=e.$v;e.$il=[],r&&(gn||(t=1,gn={id:e.id}),e.$d=1,e.unmountZone(0,1),yn(e,gn),e.$v=0,it(r),n=H(e.id),n&&e.$a&&f(n,e.$t),t&&(gn=0)),e.$s++},mountVframe:function(n,t,e){var r,i=this;return yn(i),r=xn[n],r||(P(i.$c,n)||(i.$cl=s,i.$cc++),i.$c[n]=n,r=new jn(n,i.id)),r.mountView(t,e),r},mountZone:function(t,e){var r,i,o,a=this;t=t||a.id;var f=n(g+t+" [mx-view]");for(a.$h=1,r=f.length-1;r>=0;r--)i=f[r],o=i.id||(i.id=S()),a.mountVframe(o,i.getAttribute("mx-view"),e);a.$h=0,wn(a)},unmountVframe:function(n,t){var e,r,i,o=this;n=n?o.$c[n]:o.id,e=xn[n],e&&(r=e.$cr,i=e.pId,e.unmountView(),qn(n,r),e.id=e.pId=s,e=xn[i],e&&P(e.$c,n)&&(delete e.$c[n],e.$cl=s,e.$cc--,t||wn(e)))},unmountZone:function(n,t){var e,r=this,i=r.$c;for(e in i)(!n||e!=n&&O(e,n))&&r.unmountVframe(e,1);t||wn(r)},parent:function(n,t){for(t=this,n=n>>>0||1;t&&n--;)t=xn[t.pId];return t},children:function(n){return n=this,n.$cl||(n.$cl=J(n.$c))},invoke:function(n,t){var e,r,i,o,a,f,u=this;return(r=u.$v)&&r.$p?e=(i=r[n])&&M(i,t,r):(a=u.$il,o=a[f=y+n],o&&(o.r=1),o={n:n,a:t,k:f},a.push(o),a[f]=o),e}}),K.Vframe=jn;var Tn=function(n,t){t=n.data,M(t.f,n,t.v)},Un=function(t,e,r,i,o,a){i?n(t).off(e,o,r):n(t).on(e,o,a,r)},An="parentNode",Hn=new L(30,10),On=/([^\(]+)\(([\s\S]*)?\)/,En={},Mn=function(n){for(var e,r,i,o,a,f,u,c,s,h,l=n.target,d=n.type,v="mx-"+d,p=[];l!=t&&1==l.nodeType;){if(e=l.getAttribute(v)){if(p=[],a=l.$f,!a)for(f=l;f=f[An];)if(P(xn,u=f.id)){l.$f=a=u;break}a?(i=xn[a],o=i&&i.$v,o&&o.$s>0&&(c=Hn.get(e),c||(c=e.match(On)||$,c={n:c[1],i:c[2]},c.p=c.i&&M(Function("return "+c.i))||{},Hn.set(e,c)),s=c.n+y+d,h=o[s],h&&(n.currentTarget=l,n.params=c.p,M(h,n,o)))):U.error(Error("bad:"+e))}if((r=l.$)&&r[d]||n.mxStop||n.isPropagationStopped())break;p.push(l),l=l[An]||t}for(;l=p.pop();)r=l.$||(l.$={}),r[d]=1},Pn=function(n,e){var r=0|En[n],i=r>0?1:0;r+=e?-i:i,r||(Un(t,n,Mn,e),e||(r=1)),En[n]=r},Zn=/\\|'/g,Ln=/\r|\n/g,Cn=/<%([@=!])?([\s\S]+?)%>|$/g,Dn=function(n){var t=0,e="$p+='";return n.replace(Cn,function(r,i,o,a){return e+=n.slice(t,a).replace(Zn,"\\$&").replace(Ln,"\\n"),t=a+r.length,"@"==i?e+="'\n$s=$i();\n$p+=$s;\n$[$s]="+o+";\n$p+='":"="==i?e+="'+\n(($t=("+o+"))==null?'':$e($t))+\n'":"!"==i?e+="'+\n(($t=("+o+"))==null?'':$t)+\n'":o&&(e+="';\n"+o+"\n$p+='"),r}),e+="';\n",e="var $t,$p='',$em={'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;','\\'':'&#x27;','`':'&#x60;'},$er=/[&<>\"'`]/g,$ef=function(m){return $em[m]},$e=function(v){v=v==null?'':''+v;return v.replace($er,$ef)},$i=function(){return '"+y+"'+$g++},$s;\n"+e+"return $p;\n",Function("$g","$",e)},Rn=new L,Bn=function(n,t){var e=Rn.get(n);return e||(e=Dn(n),Rn.set(n,e)),e(1,t)},Fn=/\u001f/g,Nn=/\u001f(\d+)\u001f/g,Jn=function(t,e,r,i){var o=t.$v,a=o.tmpl,f=o.tmplData,u=o.id;if(e||!t.$rd)if(t.$rd&&r&&f)for(var c,s,$,h,l,d,v,p,m={},g=function(n){var t=n.id||(n.id=S());if(!m[t]){if(m[t]=1,h)for(var e=s.attrs.length-1;e>=0;e--){var r=s.attrs[e],a=Bn(r.v,i);r.p?n[r.n]=a:!a&&r.a?n.removeAttribute(r.n):n.setAttribute(r.n,a)}var f,c,l=s.view;l&&(c=xn[t],f=Bn(l,i),c&&c[f?"unmountView":"unmountVframe"]()),s.tmpl&&$&&o.setHTML(t,Bn(s.tmpl,i).replace(Fn,u)),l&&f&&o.owner.mountVframe(t,f)}},w=f.length-1;w>=0;w--){if($=0,h=0,s=f[w],l=1,v=s.mask,c=s.pKeys)for(d=c.length;--d>=0;)if(P(r,c[d])){l=0;break}if(l){for(c=s.keys,d=c.length,l=0;--d>=0;)if(P(r,c[d])){if(l=1,!v||$&&h){$=s.tmpl,h=s.attrs;break}p=v.charAt(d),$=$||1&p,h=h||2&p}if(l){var y=n(s.path.replace(Fn,u));for(d=0;d<y.length;)g(y[d++])}}}else{var b,x,k=function(n,t){return b[t].tmpl};if(f){if(!f.$)for(f.$=b={},x=f.length;x>0;){var V=f[--x];V.s&&(b[V.s]=V,V.tmpl=V.tmpl.replace(Nn,k),delete V.s)}b=f.$}t.$rd=1;var q=a.replace(Nn,k);o.setHTML(u,Bn(q,i).replace(Fn,u))}},Kn=function(n){var t=this;t.$v=n,t.$data={},t.$json={}},Qn=Kn.prototype;E(Qn,_),E(Qn,{get:function(n){var t=this.$data;return n&&(t=t[n]),t},set:function(n){var t=this;return E(t.$data,n),t},digest:function(){var n,t,e=this,r=e.$data;t={};var i,o,a,f,u=e.$json;for(o in r)i=r[o],f=0,a=w(i),P(u,o)?(f=a!=u[o],u[o]=a):(u[o]=a,f=1),f&&(t[o]=n=1);return Jn(e,n,t,r),n&&(e.fire("changed",{keys:t}),delete e.$lss),e},snapshot:function(){var n,t=this;return n=t.$json,t.$ss=w(n),t},altered:function(){var n,t=this;return n=t.$json,t.$ss?(t.$lss||(t.$lss=w(n)),t.$ss!=t.$lss):!0}});var _n=/^(\$?)([^<]+)<([^>]+)>$/,zn=function(n,t){var e,r,i=n.$r;for(e in i)r=i[e],(t||r.x)&&Gn(i,e,1)},Gn=function(n,t,e){var r,i,o=n[t];return o&&(i=o.e,r=i.destroy,r&&e&&M(r,$,i),delete n[t]),i},Wn=function(n,t,e){t=n.render,n.render=function(){e=this,e.$s>0&&(e.$s++,e.fire("rendercall"),zn(e),M(t,h.call(arguments),e))}},Xn=function(n,t){var e,r,i=n.$eo;for(e in i)Pn(e,t);for(i=n.$el,e=i.length;e--;)r=i[e],Un(r.e||g+n.id,r.n,Tn,t,r.s,{v:n,f:r.f})},Yn=[],nt={win:p,doc:m},tt=function(n){if(!n[y]){n[y]=1;var t,e,r,i,o,a,f,u,c=n[x],s={},$=[];for(f in c)if(t=c[f],e=f.match(_n))for(a=e[1],r=e[2],i=e[3].split(d);u=i.pop();)a?(o=nt[r],$.push({f:t,s:o?v:r,n:u,e:o})):(s[u]=1,c[r+y+u]=t);Wn(c),c.$eo=s,c.$el=$}},et=function(n,t,e){for(var r=0;r<n.length&&!(e=P(t,n[r]));r++);return e},rt=function(n){var t,e=n.$l;return e.f&&(e.p&&(t=G[on]),t||(t=et(e.k,G[fn]))),t},it=function(n){n.$s>0&&(n.$s=0,n.fire("destroy",0,1,1),zn(n,1),Xn(n,1)),n.$s--},ot=function(n,t){t=this,E(t,n),t.$l={k:[]},t.$r={},t.$s=1,M(Yn,n,t),t.$updater=new Kn(t)},at=ot[x];E(ot,{merge:function(n,t){t=n&&n.ctor,t&&Yn.push(t),E(at,n)},extend:function(n,t){var e=this;n=n||{};var r=n.ctor,o=function(n,t){e.call(this,n,t),r&&r.call(this,t)};return o.extend=e.extend,i(o,e,n,t)}}),E(E(at,_),{render:l,init:l,beginUpdate:function(n,t){t=this,t.$s>0&&t.$p&&t.owner.unmountZone(n,1)},endUpdate:function(n,t,e,r){t=this,t.$s>0&&(r=t.$p,t.$p=1,e=t.owner,e.mountZone(n),r||Vn(e))},wrapAsync:function(n,t){var e=this,r=e.$s;return function(){r>0&&r==e.$s&&n&&n.apply(t||e,arguments)}},observe:function(n,t){var e,r,i=this;e=i.$l,e.f=1,r=e.k,o(n)&&(t=n.path,n=n.params),e.p=t,n&&(e.k=r.concat((n+s).split(d)))},capture:function(n,t,e,r,i){return r=this.$r,t?(Gn(r,n,1),i={e:t,x:e},r[n]=i):(i=r[n],t=i&&i.e||t),t},release:function(n,t){return Gn(this.$r,n,t)},share:function(n,t){var e=this;e.$sd||(e.$sd={}),e.$sd[n]=t},getShared:function(n){var t,e=this,r=e.$sd;if(r&&(t=P(r,n)))return r[n];var i=e.owner.parent();return i?i.invoke("getShared",n):void 0},setHTML:function(n,t){var e,r=this;r.beginUpdate(n),r.$s>0&&(e=H(n),e&&f(e,t)),r.endUpdate(n)}}),K.View=ot;var ft=n.type,ut=n.proxy,ct=n.now||Date.now,st=function(){this.id=S("b"),this.$={}};E(st[x],{get:function(n,t,e){var r=this,i=arguments.length,o=i>=2,f=r.$,u=f;if(i){for(var c,$=a(n)?h.call(n):(n+s).split(".");(c=$.shift())&&u;)u=u[c];c&&(u=e)}return o&&ft(t)!=ft(u)&&(U.error(Error("type neq:"+n+"\n"+w(f))),u=t),u},set:function(n,t){var e,r=this;o(n)||(e={},e[n]=t,n=e),E(r.$,n)}});var $t=1,ht=2,lt=function(n,t,e){e=this[n],e&&(delete this[n],M(e,t,e.e))},dt=function(n,t,e,r,i,o){var a=[],f=v,u=0;return function(c,s){var $,h=this;u++;var l=h.$m,d=l.k;a[c+1]=h;var p={bag:h,error:s};if(s)f=s,t.fire("fail",p),$=1;else if(!o.has(d)){d&&o.set(d,h),l.t=ct();var m=l.a;m&&M(m,h,h),l.x&&t.clear(l.x),t.fire("done",p),$=1}if(!e.$o){var g=u==r;g&&(e.$b=0,i==ht&&(a[0]=f,M(n,a,e))),i==$t&&M(n,[s?s:v,h,g,c],e)}$&&t.fire("end",p)}},vt=function(n,t,e,r,i){if(n.$o)return n;if(n.$b)return n.enqueue(function(){vt(this,t,e,r,i)});n.$b=1;var o=n.constructor,f=o.$r;a(t)||(t=[t]);for(var u,c=t.length,s=dt(e,o,n,c,r,o.$c),$=0;c>$;$++)if(u=t[$]){var h,l=o.get(u,i),d=l.e,v=d.$m.k,p=ut(s,d,$);v&&f[v]?f[v].push(p):l.u?(v&&(h=[p],h.e=d,f[v]=h,p=ut(lt,f,v)),o.$s(d,p)):p()}return n},pt=function(){var n=this;n.id=S("s"),n.$q=[]};E(pt[x],{all:function(n,t){return vt(this,n,t,ht)},save:function(n,t){return vt(this,n,t,ht,1)},one:function(n,t){return vt(this,n,t,$t)},enqueue:function(n){var t=this;return t.$o||(t.$q.push(n),t.dequeue(t.$a)),t},dequeue:function(){var n=this,t=h.call(arguments);n.$b||n.$o||(n.$b=1,setTimeout(function(){if(n.$b=0,!n.$o){var e=n.$q.shift();e&&M(e,n.$a=t,n)}},0))},destroy:function(n){n=this,n.$o=1,n.$q=0}});var mt=function(n,t,e){return e=[w(t),w(n)],e.join(y)},gt=function(n,t,e,r){r=n&&n.$m,r&&t[r.n]&&e.del(r.k)},wt=E({add:function(n){var t=this,e=t.$m;a(n)||(n=[n]);for(var r,i,o=n.length-1;o>-1;o--)r=n[o],r&&(i=r.name,r.cache=0|r.cache,e[i]=r)},create:function(n){var t=this,e=t.meta(n),r=e.cache,i=new st;i.set(e),i.$m={n:e.name,a:e.after,x:e.cleans,k:r&&mt(e,n)},o(n)&&i.set(n);var a=e.before;return a&&M(a,i,i),t.fire("begin",{bag:i}),i},meta:function(n){var t=this,e=t.$m,r=n.name||n,i=e[r];return i||n},get:function(n,t){var e,r,i=this;return t||(e=i.cached(n)),e||(e=i.create(n),r=1),{e:e,u:r}},clear:function(n){this.$c.each(gt,N((n+s).split(d)))},cached:function(n){var t,e,r=this,i=r.$c,o=r.meta(n),a=o.cache;if(a&&(e=mt(o,n)),e){var f=r.$r,u=f[e];u?t=u.e:(t=i.get(e),t&&a>0&&ct()-t.$m.t>a&&(t=0))}return t}},_);pt.extend=function(n,t,e){var r=this,o=function(){r.call(this)};return o.$s=n,o.$c=new L(t,e),o.$r={},o.$m={},i(o,r,v,wt)},K.Service=pt;var yt=function(n,t){var e=this,r=n&&n.ctor,o=function(){var n=this,t=arguments;e.apply(n,t),r&&r.apply(n,t)};return o.extend=yt,i(o,e,n,t)};return E(l[x],_),l.extend=yt,K.Base=l,define(T,function(){return ot.extend()}),K});