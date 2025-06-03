(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();/**
* @vue/shared v3.5.15
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**//*! #__NO_SIDE_EFFECTS__ */function xu(t){const e=Object.create(null);for(const n of t.split(","))e[n]=1;return n=>n in e}const Ue={},dr=[],En=()=>{},By=()=>!1,Ta=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&(t.charCodeAt(2)>122||t.charCodeAt(2)<97),Vu=t=>t.startsWith("onUpdate:"),Ct=Object.assign,Du=(t,e)=>{const n=t.indexOf(e);n>-1&&t.splice(n,1)},jy=Object.prototype.hasOwnProperty,Oe=(t,e)=>jy.call(t,e),pe=Array.isArray,fr=t=>qi(t)==="[object Map]",Or=t=>qi(t)==="[object Set]",Bh=t=>qi(t)==="[object Date]",be=t=>typeof t=="function",nt=t=>typeof t=="string",Rn=t=>typeof t=="symbol",$e=t=>t!==null&&typeof t=="object",pp=t=>($e(t)||be(t))&&be(t.then)&&be(t.catch),mp=Object.prototype.toString,qi=t=>mp.call(t),qy=t=>qi(t).slice(8,-1),gp=t=>qi(t)==="[object Object]",Nu=t=>nt(t)&&t!=="NaN"&&t[0]!=="-"&&""+parseInt(t,10)===t,di=xu(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),Ia=t=>{const e=Object.create(null);return n=>e[n]||(e[n]=t(n))},Hy=/-(\w)/g,tn=Ia(t=>t.replace(Hy,(e,n)=>n?n.toUpperCase():"")),Ky=/\B([A-Z])/g,Ys=Ia(t=>t.replace(Ky,"-$1").toLowerCase()),Aa=Ia(t=>t.charAt(0).toUpperCase()+t.slice(1)),Il=Ia(t=>t?`on${Aa(t)}`:""),fs=(t,e)=>!Object.is(t,e),xo=(t,...e)=>{for(let n=0;n<t.length;n++)t[n](...e)},_p=(t,e,n,s=!1)=>{Object.defineProperty(t,e,{configurable:!0,enumerable:!1,writable:s,value:n})},zo=t=>{const e=parseFloat(t);return isNaN(e)?t:e};let jh;const Ra=()=>jh||(jh=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function Sa(t){if(pe(t)){const e={};for(let n=0;n<t.length;n++){const s=t[n],r=nt(s)?Qy(s):Sa(s);if(r)for(const i in r)e[i]=r[i]}return e}else if(nt(t)||$e(t))return t}const zy=/;(?![^(]*\))/g,Gy=/:([^]+)/,Wy=/\/\*[^]*?\*\//g;function Qy(t){const e={};return t.replace(Wy,"").split(zy).forEach(n=>{if(n){const s=n.split(Gy);s.length>1&&(e[s[0].trim()]=s[1].trim())}}),e}function Jt(t){let e="";if(nt(t))e=t;else if(pe(t))for(let n=0;n<t.length;n++){const s=Jt(t[n]);s&&(e+=s+" ")}else if($e(t))for(const n in t)t[n]&&(e+=n+" ");return e.trim()}const Yy="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",Jy=xu(Yy);function yp(t){return!!t||t===""}function Xy(t,e){if(t.length!==e.length)return!1;let n=!0;for(let s=0;n&&s<t.length;s++)n=js(t[s],e[s]);return n}function js(t,e){if(t===e)return!0;let n=Bh(t),s=Bh(e);if(n||s)return n&&s?t.getTime()===e.getTime():!1;if(n=Rn(t),s=Rn(e),n||s)return t===e;if(n=pe(t),s=pe(e),n||s)return n&&s?Xy(t,e):!1;if(n=$e(t),s=$e(e),n||s){if(!n||!s)return!1;const r=Object.keys(t).length,i=Object.keys(e).length;if(r!==i)return!1;for(const o in t){const l=t.hasOwnProperty(o),u=e.hasOwnProperty(o);if(l&&!u||!l&&u||!js(t[o],e[o]))return!1}}return String(t)===String(e)}function Ou(t,e){return t.findIndex(n=>js(n,e))}const vp=t=>!!(t&&t.__v_isRef===!0),K=t=>nt(t)?t:t==null?"":pe(t)||$e(t)&&(t.toString===mp||!be(t.toString))?vp(t)?K(t.value):JSON.stringify(t,bp,2):String(t),bp=(t,e)=>vp(e)?bp(t,e.value):fr(e)?{[`Map(${e.size})`]:[...e.entries()].reduce((n,[s,r],i)=>(n[Al(s,i)+" =>"]=r,n),{})}:Or(e)?{[`Set(${e.size})`]:[...e.values()].map(n=>Al(n))}:Rn(e)?Al(e):$e(e)&&!pe(e)&&!gp(e)?String(e):e,Al=(t,e="")=>{var n;return Rn(t)?`Symbol(${(n=t.description)!=null?n:e})`:t};/**
* @vue/reactivity v3.5.15
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Mt;class Zy{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.parent=Mt,!e&&Mt&&(this.index=(Mt.scopes||(Mt.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,n;if(this.scopes)for(e=0,n=this.scopes.length;e<n;e++)this.scopes[e].pause();for(e=0,n=this.effects.length;e<n;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,n;if(this.scopes)for(e=0,n=this.scopes.length;e<n;e++)this.scopes[e].resume();for(e=0,n=this.effects.length;e<n;e++)this.effects[e].resume()}}run(e){if(this._active){const n=Mt;try{return Mt=this,e()}finally{Mt=n}}}on(){++this._on===1&&(this.prevScope=Mt,Mt=this)}off(){this._on>0&&--this._on===0&&(Mt=this.prevScope,this.prevScope=void 0)}stop(e){if(this._active){this._active=!1;let n,s;for(n=0,s=this.effects.length;n<s;n++)this.effects[n].stop();for(this.effects.length=0,n=0,s=this.cleanups.length;n<s;n++)this.cleanups[n]();if(this.cleanups.length=0,this.scopes){for(n=0,s=this.scopes.length;n<s;n++)this.scopes[n].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){const r=this.parent.scopes.pop();r&&r!==this&&(this.parent.scopes[this.index]=r,r.index=this.index)}this.parent=void 0}}}function ev(){return Mt}let Fe;const Rl=new WeakSet;class Ep{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,Mt&&Mt.active&&Mt.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Rl.has(this)&&(Rl.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Tp(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,qh(this),Ip(this);const e=Fe,n=an;Fe=this,an=!0;try{return this.fn()}finally{Ap(this),Fe=e,an=n,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)Uu(e);this.deps=this.depsTail=void 0,qh(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Rl.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Gl(this)&&this.run()}get dirty(){return Gl(this)}}let wp=0,fi,pi;function Tp(t,e=!1){if(t.flags|=8,e){t.next=pi,pi=t;return}t.next=fi,fi=t}function Mu(){wp++}function Lu(){if(--wp>0)return;if(pi){let e=pi;for(pi=void 0;e;){const n=e.next;e.next=void 0,e.flags&=-9,e=n}}let t;for(;fi;){let e=fi;for(fi=void 0;e;){const n=e.next;if(e.next=void 0,e.flags&=-9,e.flags&1)try{e.trigger()}catch(s){t||(t=s)}e=n}}if(t)throw t}function Ip(t){for(let e=t.deps;e;e=e.nextDep)e.version=-1,e.prevActiveLink=e.dep.activeLink,e.dep.activeLink=e}function Ap(t){let e,n=t.depsTail,s=n;for(;s;){const r=s.prevDep;s.version===-1?(s===n&&(n=r),Uu(s),tv(s)):e=s,s.dep.activeLink=s.prevActiveLink,s.prevActiveLink=void 0,s=r}t.deps=e,t.depsTail=n}function Gl(t){for(let e=t.deps;e;e=e.nextDep)if(e.dep.version!==e.version||e.dep.computed&&(Rp(e.dep.computed)||e.dep.version!==e.version))return!0;return!!t._dirty}function Rp(t){if(t.flags&4&&!(t.flags&16)||(t.flags&=-17,t.globalVersion===Ri)||(t.globalVersion=Ri,!t.isSSR&&t.flags&128&&(!t.deps&&!t._dirty||!Gl(t))))return;t.flags|=2;const e=t.dep,n=Fe,s=an;Fe=t,an=!0;try{Ip(t);const r=t.fn(t._value);(e.version===0||fs(r,t._value))&&(t.flags|=128,t._value=r,e.version++)}catch(r){throw e.version++,r}finally{Fe=n,an=s,Ap(t),t.flags&=-3}}function Uu(t,e=!1){const{dep:n,prevSub:s,nextSub:r}=t;if(s&&(s.nextSub=r,t.prevSub=void 0),r&&(r.prevSub=s,t.nextSub=void 0),n.subs===t&&(n.subs=s,!s&&n.computed)){n.computed.flags&=-5;for(let i=n.computed.deps;i;i=i.nextDep)Uu(i,!0)}!e&&!--n.sc&&n.map&&n.map.delete(n.key)}function tv(t){const{prevDep:e,nextDep:n}=t;e&&(e.nextDep=n,t.prevDep=void 0),n&&(n.prevDep=e,t.nextDep=void 0)}let an=!0;const Sp=[];function jn(){Sp.push(an),an=!1}function qn(){const t=Sp.pop();an=t===void 0?!0:t}function qh(t){const{cleanup:e}=t;if(t.cleanup=void 0,e){const n=Fe;Fe=void 0;try{e()}finally{Fe=n}}}let Ri=0;class nv{constructor(e,n){this.sub=e,this.dep=n,this.version=n.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class Fu{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0}track(e){if(!Fe||!an||Fe===this.computed)return;let n=this.activeLink;if(n===void 0||n.sub!==Fe)n=this.activeLink=new nv(Fe,this),Fe.deps?(n.prevDep=Fe.depsTail,Fe.depsTail.nextDep=n,Fe.depsTail=n):Fe.deps=Fe.depsTail=n,Cp(n);else if(n.version===-1&&(n.version=this.version,n.nextDep)){const s=n.nextDep;s.prevDep=n.prevDep,n.prevDep&&(n.prevDep.nextDep=s),n.prevDep=Fe.depsTail,n.nextDep=void 0,Fe.depsTail.nextDep=n,Fe.depsTail=n,Fe.deps===n&&(Fe.deps=s)}return n}trigger(e){this.version++,Ri++,this.notify(e)}notify(e){Mu();try{for(let n=this.subs;n;n=n.prevSub)n.sub.notify()&&n.sub.dep.notify()}finally{Lu()}}}function Cp(t){if(t.dep.sc++,t.sub.flags&4){const e=t.dep.computed;if(e&&!t.dep.subs){e.flags|=20;for(let s=e.deps;s;s=s.nextDep)Cp(s)}const n=t.dep.subs;n!==t&&(t.prevSub=n,n&&(n.nextSub=t)),t.dep.subs=t}}const Wl=new WeakMap,Bs=Symbol(""),Ql=Symbol(""),Si=Symbol("");function Tt(t,e,n){if(an&&Fe){let s=Wl.get(t);s||Wl.set(t,s=new Map);let r=s.get(n);r||(s.set(n,r=new Fu),r.map=s,r.key=n),r.track()}}function On(t,e,n,s,r,i){const o=Wl.get(t);if(!o){Ri++;return}const l=u=>{u&&u.trigger()};if(Mu(),e==="clear")o.forEach(l);else{const u=pe(t),c=u&&Nu(n);if(u&&n==="length"){const f=Number(s);o.forEach((p,g)=>{(g==="length"||g===Si||!Rn(g)&&g>=f)&&l(p)})}else switch((n!==void 0||o.has(void 0))&&l(o.get(n)),c&&l(o.get(Si)),e){case"add":u?c&&l(o.get("length")):(l(o.get(Bs)),fr(t)&&l(o.get(Ql)));break;case"delete":u||(l(o.get(Bs)),fr(t)&&l(o.get(Ql)));break;case"set":fr(t)&&l(o.get(Bs));break}}Lu()}function rr(t){const e=Ne(t);return e===t?e:(Tt(e,"iterate",Si),Xt(t)?e:e.map(pt))}function Ca(t){return Tt(t=Ne(t),"iterate",Si),t}const sv={__proto__:null,[Symbol.iterator](){return Sl(this,Symbol.iterator,pt)},concat(...t){return rr(this).concat(...t.map(e=>pe(e)?rr(e):e))},entries(){return Sl(this,"entries",t=>(t[1]=pt(t[1]),t))},every(t,e){return Vn(this,"every",t,e,void 0,arguments)},filter(t,e){return Vn(this,"filter",t,e,n=>n.map(pt),arguments)},find(t,e){return Vn(this,"find",t,e,pt,arguments)},findIndex(t,e){return Vn(this,"findIndex",t,e,void 0,arguments)},findLast(t,e){return Vn(this,"findLast",t,e,pt,arguments)},findLastIndex(t,e){return Vn(this,"findLastIndex",t,e,void 0,arguments)},forEach(t,e){return Vn(this,"forEach",t,e,void 0,arguments)},includes(...t){return Cl(this,"includes",t)},indexOf(...t){return Cl(this,"indexOf",t)},join(t){return rr(this).join(t)},lastIndexOf(...t){return Cl(this,"lastIndexOf",t)},map(t,e){return Vn(this,"map",t,e,void 0,arguments)},pop(){return ni(this,"pop")},push(...t){return ni(this,"push",t)},reduce(t,...e){return Hh(this,"reduce",t,e)},reduceRight(t,...e){return Hh(this,"reduceRight",t,e)},shift(){return ni(this,"shift")},some(t,e){return Vn(this,"some",t,e,void 0,arguments)},splice(...t){return ni(this,"splice",t)},toReversed(){return rr(this).toReversed()},toSorted(t){return rr(this).toSorted(t)},toSpliced(...t){return rr(this).toSpliced(...t)},unshift(...t){return ni(this,"unshift",t)},values(){return Sl(this,"values",pt)}};function Sl(t,e,n){const s=Ca(t),r=s[e]();return s!==t&&!Xt(t)&&(r._next=r.next,r.next=()=>{const i=r._next();return i.value&&(i.value=n(i.value)),i}),r}const rv=Array.prototype;function Vn(t,e,n,s,r,i){const o=Ca(t),l=o!==t&&!Xt(t),u=o[e];if(u!==rv[e]){const p=u.apply(t,i);return l?pt(p):p}let c=n;o!==t&&(l?c=function(p,g){return n.call(this,pt(p),g,t)}:n.length>2&&(c=function(p,g){return n.call(this,p,g,t)}));const f=u.call(o,c,s);return l&&r?r(f):f}function Hh(t,e,n,s){const r=Ca(t);let i=n;return r!==t&&(Xt(t)?n.length>3&&(i=function(o,l,u){return n.call(this,o,l,u,t)}):i=function(o,l,u){return n.call(this,o,pt(l),u,t)}),r[e](i,...s)}function Cl(t,e,n){const s=Ne(t);Tt(s,"iterate",Si);const r=s[e](...n);return(r===-1||r===!1)&&ju(n[0])?(n[0]=Ne(n[0]),s[e](...n)):r}function ni(t,e,n=[]){jn(),Mu();const s=Ne(t)[e].apply(t,n);return Lu(),qn(),s}const iv=xu("__proto__,__v_isRef,__isVue"),Pp=new Set(Object.getOwnPropertyNames(Symbol).filter(t=>t!=="arguments"&&t!=="caller").map(t=>Symbol[t]).filter(Rn));function ov(t){Rn(t)||(t=String(t));const e=Ne(this);return Tt(e,"has",t),e.hasOwnProperty(t)}class kp{constructor(e=!1,n=!1){this._isReadonly=e,this._isShallow=n}get(e,n,s){if(n==="__v_skip")return e.__v_skip;const r=this._isReadonly,i=this._isShallow;if(n==="__v_isReactive")return!r;if(n==="__v_isReadonly")return r;if(n==="__v_isShallow")return i;if(n==="__v_raw")return s===(r?i?gv:Np:i?Dp:Vp).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(s)?e:void 0;const o=pe(e);if(!r){let u;if(o&&(u=sv[n]))return u;if(n==="hasOwnProperty")return ov}const l=Reflect.get(e,n,St(e)?e:s);return(Rn(n)?Pp.has(n):iv(n))||(r||Tt(e,"get",n),i)?l:St(l)?o&&Nu(n)?l:l.value:$e(l)?r?Mp(l):Pa(l):l}}class xp extends kp{constructor(e=!1){super(!1,e)}set(e,n,s,r){let i=e[n];if(!this._isShallow){const u=vs(i);if(!Xt(s)&&!vs(s)&&(i=Ne(i),s=Ne(s)),!pe(e)&&St(i)&&!St(s))return u?!1:(i.value=s,!0)}const o=pe(e)&&Nu(n)?Number(n)<e.length:Oe(e,n),l=Reflect.set(e,n,s,St(e)?e:r);return e===Ne(r)&&(o?fs(s,i)&&On(e,"set",n,s):On(e,"add",n,s)),l}deleteProperty(e,n){const s=Oe(e,n);e[n];const r=Reflect.deleteProperty(e,n);return r&&s&&On(e,"delete",n,void 0),r}has(e,n){const s=Reflect.has(e,n);return(!Rn(n)||!Pp.has(n))&&Tt(e,"has",n),s}ownKeys(e){return Tt(e,"iterate",pe(e)?"length":Bs),Reflect.ownKeys(e)}}class av extends kp{constructor(e=!1){super(!0,e)}set(e,n){return!0}deleteProperty(e,n){return!0}}const lv=new xp,uv=new av,cv=new xp(!0);const Yl=t=>t,Eo=t=>Reflect.getPrototypeOf(t);function hv(t,e,n){return function(...s){const r=this.__v_raw,i=Ne(r),o=fr(i),l=t==="entries"||t===Symbol.iterator&&o,u=t==="keys"&&o,c=r[t](...s),f=n?Yl:e?Go:pt;return!e&&Tt(i,"iterate",u?Ql:Bs),{next(){const{value:p,done:g}=c.next();return g?{value:p,done:g}:{value:l?[f(p[0]),f(p[1])]:f(p),done:g}},[Symbol.iterator](){return this}}}}function wo(t){return function(...e){return t==="delete"?!1:t==="clear"?void 0:this}}function dv(t,e){const n={get(r){const i=this.__v_raw,o=Ne(i),l=Ne(r);t||(fs(r,l)&&Tt(o,"get",r),Tt(o,"get",l));const{has:u}=Eo(o),c=e?Yl:t?Go:pt;if(u.call(o,r))return c(i.get(r));if(u.call(o,l))return c(i.get(l));i!==o&&i.get(r)},get size(){const r=this.__v_raw;return!t&&Tt(Ne(r),"iterate",Bs),Reflect.get(r,"size",r)},has(r){const i=this.__v_raw,o=Ne(i),l=Ne(r);return t||(fs(r,l)&&Tt(o,"has",r),Tt(o,"has",l)),r===l?i.has(r):i.has(r)||i.has(l)},forEach(r,i){const o=this,l=o.__v_raw,u=Ne(l),c=e?Yl:t?Go:pt;return!t&&Tt(u,"iterate",Bs),l.forEach((f,p)=>r.call(i,c(f),c(p),o))}};return Ct(n,t?{add:wo("add"),set:wo("set"),delete:wo("delete"),clear:wo("clear")}:{add(r){!e&&!Xt(r)&&!vs(r)&&(r=Ne(r));const i=Ne(this);return Eo(i).has.call(i,r)||(i.add(r),On(i,"add",r,r)),this},set(r,i){!e&&!Xt(i)&&!vs(i)&&(i=Ne(i));const o=Ne(this),{has:l,get:u}=Eo(o);let c=l.call(o,r);c||(r=Ne(r),c=l.call(o,r));const f=u.call(o,r);return o.set(r,i),c?fs(i,f)&&On(o,"set",r,i):On(o,"add",r,i),this},delete(r){const i=Ne(this),{has:o,get:l}=Eo(i);let u=o.call(i,r);u||(r=Ne(r),u=o.call(i,r)),l&&l.call(i,r);const c=i.delete(r);return u&&On(i,"delete",r,void 0),c},clear(){const r=Ne(this),i=r.size!==0,o=r.clear();return i&&On(r,"clear",void 0,void 0),o}}),["keys","values","entries",Symbol.iterator].forEach(r=>{n[r]=hv(r,t,e)}),n}function $u(t,e){const n=dv(t,e);return(s,r,i)=>r==="__v_isReactive"?!t:r==="__v_isReadonly"?t:r==="__v_raw"?s:Reflect.get(Oe(n,r)&&r in s?n:s,r,i)}const fv={get:$u(!1,!1)},pv={get:$u(!1,!0)},mv={get:$u(!0,!1)};const Vp=new WeakMap,Dp=new WeakMap,Np=new WeakMap,gv=new WeakMap;function _v(t){switch(t){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function yv(t){return t.__v_skip||!Object.isExtensible(t)?0:_v(qy(t))}function Pa(t){return vs(t)?t:Bu(t,!1,lv,fv,Vp)}function Op(t){return Bu(t,!1,cv,pv,Dp)}function Mp(t){return Bu(t,!0,uv,mv,Np)}function Bu(t,e,n,s,r){if(!$e(t)||t.__v_raw&&!(e&&t.__v_isReactive))return t;const i=yv(t);if(i===0)return t;const o=r.get(t);if(o)return o;const l=new Proxy(t,i===2?s:n);return r.set(t,l),l}function pr(t){return vs(t)?pr(t.__v_raw):!!(t&&t.__v_isReactive)}function vs(t){return!!(t&&t.__v_isReadonly)}function Xt(t){return!!(t&&t.__v_isShallow)}function ju(t){return t?!!t.__v_raw:!1}function Ne(t){const e=t&&t.__v_raw;return e?Ne(e):t}function vv(t){return!Oe(t,"__v_skip")&&Object.isExtensible(t)&&_p(t,"__v_skip",!0),t}const pt=t=>$e(t)?Pa(t):t,Go=t=>$e(t)?Mp(t):t;function St(t){return t?t.__v_isRef===!0:!1}function G(t){return Lp(t,!1)}function bv(t){return Lp(t,!0)}function Lp(t,e){return St(t)?t:new Ev(t,e)}class Ev{constructor(e,n){this.dep=new Fu,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=n?e:Ne(e),this._value=n?e:pt(e),this.__v_isShallow=n}get value(){return this.dep.track(),this._value}set value(e){const n=this._rawValue,s=this.__v_isShallow||Xt(e)||vs(e);e=s?e:Ne(e),fs(e,n)&&(this._rawValue=e,this._value=s?e:pt(e),this.dep.trigger())}}function ln(t){return St(t)?t.value:t}const wv={get:(t,e,n)=>e==="__v_raw"?t:ln(Reflect.get(t,e,n)),set:(t,e,n,s)=>{const r=t[e];return St(r)&&!St(n)?(r.value=n,!0):Reflect.set(t,e,n,s)}};function Up(t){return pr(t)?t:new Proxy(t,wv)}class Tv{constructor(e,n,s){this.fn=e,this.setter=n,this._value=void 0,this.dep=new Fu(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Ri-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!n,this.isSSR=s}notify(){if(this.flags|=16,!(this.flags&8)&&Fe!==this)return Tp(this,!0),!0}get value(){const e=this.dep.track();return Rp(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}}function Iv(t,e,n=!1){let s,r;return be(t)?s=t:(s=t.get,r=t.set),new Tv(s,r,n)}const To={},Wo=new WeakMap;let Us;function Av(t,e=!1,n=Us){if(n){let s=Wo.get(n);s||Wo.set(n,s=[]),s.push(t)}}function Rv(t,e,n=Ue){const{immediate:s,deep:r,once:i,scheduler:o,augmentJob:l,call:u}=n,c=M=>r?M:Xt(M)||r===!1||r===0?Mn(M,1):Mn(M);let f,p,g,_,b=!1,y=!1;if(St(t)?(p=()=>t.value,b=Xt(t)):pr(t)?(p=()=>c(t),b=!0):pe(t)?(y=!0,b=t.some(M=>pr(M)||Xt(M)),p=()=>t.map(M=>{if(St(M))return M.value;if(pr(M))return c(M);if(be(M))return u?u(M,2):M()})):be(t)?e?p=u?()=>u(t,2):t:p=()=>{if(g){jn();try{g()}finally{qn()}}const M=Us;Us=f;try{return u?u(t,3,[_]):t(_)}finally{Us=M}}:p=En,e&&r){const M=p,W=r===!0?1/0:r;p=()=>Mn(M(),W)}const E=ev(),k=()=>{f.stop(),E&&E.active&&Du(E.effects,f)};if(i&&e){const M=e;e=(...W)=>{M(...W),k()}}let C=y?new Array(t.length).fill(To):To;const x=M=>{if(!(!(f.flags&1)||!f.dirty&&!M))if(e){const W=f.run();if(r||b||(y?W.some((le,S)=>fs(le,C[S])):fs(W,C))){g&&g();const le=Us;Us=f;try{const S=[W,C===To?void 0:y&&C[0]===To?[]:C,_];C=W,u?u(e,3,S):e(...S)}finally{Us=le}}}else f.run()};return l&&l(x),f=new Ep(p),f.scheduler=o?()=>o(x,!1):x,_=M=>Av(M,!1,f),g=f.onStop=()=>{const M=Wo.get(f);if(M){if(u)u(M,4);else for(const W of M)W();Wo.delete(f)}},e?s?x(!0):C=f.run():o?o(x.bind(null,!0),!0):f.run(),k.pause=f.pause.bind(f),k.resume=f.resume.bind(f),k.stop=k,k}function Mn(t,e=1/0,n){if(e<=0||!$e(t)||t.__v_skip||(n=n||new Set,n.has(t)))return t;if(n.add(t),e--,St(t))Mn(t.value,e,n);else if(pe(t))for(let s=0;s<t.length;s++)Mn(t[s],e,n);else if(Or(t)||fr(t))t.forEach(s=>{Mn(s,e,n)});else if(gp(t)){for(const s in t)Mn(t[s],e,n);for(const s of Object.getOwnPropertySymbols(t))Object.prototype.propertyIsEnumerable.call(t,s)&&Mn(t[s],e,n)}return t}/**
* @vue/runtime-core v3.5.15
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Hi(t,e,n,s){try{return s?t(...s):t()}catch(r){ka(r,e,n)}}function Sn(t,e,n,s){if(be(t)){const r=Hi(t,e,n,s);return r&&pp(r)&&r.catch(i=>{ka(i,e,n)}),r}if(pe(t)){const r=[];for(let i=0;i<t.length;i++)r.push(Sn(t[i],e,n,s));return r}}function ka(t,e,n,s=!0){const r=e?e.vnode:null,{errorHandler:i,throwUnhandledErrorInProduction:o}=e&&e.appContext.config||Ue;if(e){let l=e.parent;const u=e.proxy,c=`https://vuejs.org/error-reference/#runtime-${n}`;for(;l;){const f=l.ec;if(f){for(let p=0;p<f.length;p++)if(f[p](t,u,c)===!1)return}l=l.parent}if(i){jn(),Hi(i,null,10,[t,u,c]),qn();return}}Sv(t,n,r,s,o)}function Sv(t,e,n,s=!0,r=!1){if(r)throw t;console.error(t)}const Dt=[];let yn=-1;const mr=[];let is=null,ir=0;const Fp=Promise.resolve();let Qo=null;function qu(t){const e=Qo||Fp;return t?e.then(this?t.bind(this):t):e}function Cv(t){let e=yn+1,n=Dt.length;for(;e<n;){const s=e+n>>>1,r=Dt[s],i=Ci(r);i<t||i===t&&r.flags&2?e=s+1:n=s}return e}function Hu(t){if(!(t.flags&1)){const e=Ci(t),n=Dt[Dt.length-1];!n||!(t.flags&2)&&e>=Ci(n)?Dt.push(t):Dt.splice(Cv(e),0,t),t.flags|=1,$p()}}function $p(){Qo||(Qo=Fp.then(jp))}function Pv(t){pe(t)?mr.push(...t):is&&t.id===-1?is.splice(ir+1,0,t):t.flags&1||(mr.push(t),t.flags|=1),$p()}function Kh(t,e,n=yn+1){for(;n<Dt.length;n++){const s=Dt[n];if(s&&s.flags&2){if(t&&s.id!==t.uid)continue;Dt.splice(n,1),n--,s.flags&4&&(s.flags&=-2),s(),s.flags&4||(s.flags&=-2)}}}function Bp(t){if(mr.length){const e=[...new Set(mr)].sort((n,s)=>Ci(n)-Ci(s));if(mr.length=0,is){is.push(...e);return}for(is=e,ir=0;ir<is.length;ir++){const n=is[ir];n.flags&4&&(n.flags&=-2),n.flags&8||n(),n.flags&=-2}is=null,ir=0}}const Ci=t=>t.id==null?t.flags&2?-1:1/0:t.id;function jp(t){try{for(yn=0;yn<Dt.length;yn++){const e=Dt[yn];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),Hi(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;yn<Dt.length;yn++){const e=Dt[yn];e&&(e.flags&=-2)}yn=-1,Dt.length=0,Bp(),Qo=null,(Dt.length||mr.length)&&jp()}}let qt=null,qp=null;function Yo(t){const e=qt;return qt=t,qp=t&&t.type.__scopeId||null,e}function Ku(t,e=qt,n){if(!e||t._n)return t;const s=(...r)=>{s._d&&td(-1);const i=Yo(e);let o;try{o=t(...r)}finally{Yo(i),s._d&&td(1)}return o};return s._n=!0,s._c=!0,s._d=!0,s}function ie(t,e){if(qt===null)return t;const n=Na(qt),s=t.dirs||(t.dirs=[]);for(let r=0;r<e.length;r++){let[i,o,l,u=Ue]=e[r];i&&(be(i)&&(i={mounted:i,updated:i}),i.deep&&Mn(o),s.push({dir:i,instance:n,value:o,oldValue:void 0,arg:l,modifiers:u}))}return t}function Ms(t,e,n,s){const r=t.dirs,i=e&&e.dirs;for(let o=0;o<r.length;o++){const l=r[o];i&&(l.oldValue=i[o].value);let u=l.dir[s];u&&(jn(),Sn(u,n,8,[t.el,l,t,e]),qn())}}const kv=Symbol("_vte"),xv=t=>t.__isTeleport;function zu(t,e){t.shapeFlag&6&&t.component?(t.transition=e,zu(t.component.subTree,e)):t.shapeFlag&128?(t.ssContent.transition=e.clone(t.ssContent),t.ssFallback.transition=e.clone(t.ssFallback)):t.transition=e}/*! #__NO_SIDE_EFFECTS__ */function Hp(t,e){return be(t)?Ct({name:t.name},e,{setup:t}):t}function Kp(t){t.ids=[t.ids[0]+t.ids[2]+++"-",0,0]}function Jo(t,e,n,s,r=!1){if(pe(t)){t.forEach((b,y)=>Jo(b,e&&(pe(e)?e[y]:e),n,s,r));return}if(mi(s)&&!r){s.shapeFlag&512&&s.type.__asyncResolved&&s.component.subTree.component&&Jo(t,e,n,s.component.subTree);return}const i=s.shapeFlag&4?Na(s.component):s.el,o=r?null:i,{i:l,r:u}=t,c=e&&e.r,f=l.refs===Ue?l.refs={}:l.refs,p=l.setupState,g=Ne(p),_=p===Ue?()=>!1:b=>Oe(g,b);if(c!=null&&c!==u&&(nt(c)?(f[c]=null,_(c)&&(p[c]=null)):St(c)&&(c.value=null)),be(u))Hi(u,l,12,[o,f]);else{const b=nt(u),y=St(u);if(b||y){const E=()=>{if(t.f){const k=b?_(u)?p[u]:f[u]:u.value;r?pe(k)&&Du(k,i):pe(k)?k.includes(i)||k.push(i):b?(f[u]=[i],_(u)&&(p[u]=f[u])):(u.value=[i],t.k&&(f[t.k]=u.value))}else b?(f[u]=o,_(u)&&(p[u]=o)):y&&(u.value=o,t.k&&(f[t.k]=o))};o?(E.id=-1,jt(E,n)):E()}}}Ra().requestIdleCallback;Ra().cancelIdleCallback;const mi=t=>!!t.type.__asyncLoader,zp=t=>t.type.__isKeepAlive;function Vv(t,e){Gp(t,"a",e)}function Dv(t,e){Gp(t,"da",e)}function Gp(t,e,n=At){const s=t.__wdc||(t.__wdc=()=>{let r=n;for(;r;){if(r.isDeactivated)return;r=r.parent}return t()});if(xa(e,s,n),n){let r=n.parent;for(;r&&r.parent;)zp(r.parent.vnode)&&Nv(s,e,n,r),r=r.parent}}function Nv(t,e,n,s){const r=xa(e,t,s,!0);Wp(()=>{Du(s[e],r)},n)}function xa(t,e,n=At,s=!1){if(n){const r=n[t]||(n[t]=[]),i=e.__weh||(e.__weh=(...o)=>{jn();const l=Ki(n),u=Sn(e,n,t,o);return l(),qn(),u});return s?r.unshift(i):r.push(i),i}}const Wn=t=>(e,n=At)=>{(!ki||t==="sp")&&xa(t,(...s)=>e(...s),n)},Ov=Wn("bm"),Ft=Wn("m"),Mv=Wn("bu"),Lv=Wn("u"),Uv=Wn("bum"),Wp=Wn("um"),Fv=Wn("sp"),$v=Wn("rtg"),Bv=Wn("rtc");function jv(t,e=At){xa("ec",t,e)}const Qp="components",qv="directives";function Gu(t,e){return Jp(Qp,t,!0,e)||t}const Hv=Symbol.for("v-ndc");function Yp(t){return Jp(qv,t)}function Jp(t,e,n=!0,s=!1){const r=qt||At;if(r){const i=r.type;if(t===Qp){const l=xb(i,!1);if(l&&(l===e||l===tn(e)||l===Aa(tn(e))))return i}const o=zh(r[t]||i[t],e)||zh(r.appContext[t],e);return!o&&s?i:o}}function zh(t,e){return t&&(t[e]||t[tn(e)]||t[Aa(tn(e))])}function Qe(t,e,n,s){let r;const i=n,o=pe(t);if(o||nt(t)){const l=o&&pr(t);let u=!1,c=!1;l&&(u=!Xt(t),c=vs(t),t=Ca(t)),r=new Array(t.length);for(let f=0,p=t.length;f<p;f++)r[f]=e(u?c?Go(pt(t[f])):pt(t[f]):t[f],f,void 0,i)}else if(typeof t=="number"){r=new Array(t);for(let l=0;l<t;l++)r[l]=e(l+1,l,void 0,i)}else if($e(t))if(t[Symbol.iterator])r=Array.from(t,(l,u)=>e(l,u,void 0,i));else{const l=Object.keys(t);r=new Array(l.length);for(let u=0,c=l.length;u<c;u++){const f=l[u];r[u]=e(t[f],f,u,i)}}else r=[];return r}const Jl=t=>t?_m(t)?Na(t):Jl(t.parent):null,gi=Ct(Object.create(null),{$:t=>t,$el:t=>t.vnode.el,$data:t=>t.data,$props:t=>t.props,$attrs:t=>t.attrs,$slots:t=>t.slots,$refs:t=>t.refs,$parent:t=>Jl(t.parent),$root:t=>Jl(t.root),$host:t=>t.ce,$emit:t=>t.emit,$options:t=>Zp(t),$forceUpdate:t=>t.f||(t.f=()=>{Hu(t.update)}),$nextTick:t=>t.n||(t.n=qu.bind(t.proxy)),$watch:t=>hb.bind(t)}),Pl=(t,e)=>t!==Ue&&!t.__isScriptSetup&&Oe(t,e),Kv={get({_:t},e){if(e==="__v_skip")return!0;const{ctx:n,setupState:s,data:r,props:i,accessCache:o,type:l,appContext:u}=t;let c;if(e[0]!=="$"){const _=o[e];if(_!==void 0)switch(_){case 1:return s[e];case 2:return r[e];case 4:return n[e];case 3:return i[e]}else{if(Pl(s,e))return o[e]=1,s[e];if(r!==Ue&&Oe(r,e))return o[e]=2,r[e];if((c=t.propsOptions[0])&&Oe(c,e))return o[e]=3,i[e];if(n!==Ue&&Oe(n,e))return o[e]=4,n[e];Xl&&(o[e]=0)}}const f=gi[e];let p,g;if(f)return e==="$attrs"&&Tt(t.attrs,"get",""),f(t);if((p=l.__cssModules)&&(p=p[e]))return p;if(n!==Ue&&Oe(n,e))return o[e]=4,n[e];if(g=u.config.globalProperties,Oe(g,e))return g[e]},set({_:t},e,n){const{data:s,setupState:r,ctx:i}=t;return Pl(r,e)?(r[e]=n,!0):s!==Ue&&Oe(s,e)?(s[e]=n,!0):Oe(t.props,e)||e[0]==="$"&&e.slice(1)in t?!1:(i[e]=n,!0)},has({_:{data:t,setupState:e,accessCache:n,ctx:s,appContext:r,propsOptions:i}},o){let l;return!!n[o]||t!==Ue&&Oe(t,o)||Pl(e,o)||(l=i[0])&&Oe(l,o)||Oe(s,o)||Oe(gi,o)||Oe(r.config.globalProperties,o)},defineProperty(t,e,n){return n.get!=null?t._.accessCache[e]=0:Oe(n,"value")&&this.set(t,e,n.value,null),Reflect.defineProperty(t,e,n)}};function Gh(t){return pe(t)?t.reduce((e,n)=>(e[n]=null,e),{}):t}let Xl=!0;function zv(t){const e=Zp(t),n=t.proxy,s=t.ctx;Xl=!1,e.beforeCreate&&Wh(e.beforeCreate,t,"bc");const{data:r,computed:i,methods:o,watch:l,provide:u,inject:c,created:f,beforeMount:p,mounted:g,beforeUpdate:_,updated:b,activated:y,deactivated:E,beforeDestroy:k,beforeUnmount:C,destroyed:x,unmounted:M,render:W,renderTracked:le,renderTriggered:S,errorCaptured:w,serverPrefetch:I,expose:P,inheritAttrs:V,components:N,directives:R,filters:kt}=e;if(c&&Gv(c,s,null),o)for(const Se in o){const Te=o[Se];be(Te)&&(s[Se]=Te.bind(n))}if(r){const Se=r.call(n,n);$e(Se)&&(t.data=Pa(Se))}if(Xl=!0,i)for(const Se in i){const Te=i[Se],$t=be(Te)?Te.bind(n,n):be(Te.get)?Te.get.bind(n,n):En,nn=!be(Te)&&be(Te.set)?Te.set.bind(n):En,Gt=We({get:$t,set:nn});Object.defineProperty(s,Se,{enumerable:!0,configurable:!0,get:()=>Gt.value,set:He=>Gt.value=He})}if(l)for(const Se in l)Xp(l[Se],s,n,Se);if(u){const Se=be(u)?u.call(n):u;Reflect.ownKeys(Se).forEach(Te=>{Vo(Te,Se[Te])})}f&&Wh(f,t,"c");function Je(Se,Te){pe(Te)?Te.forEach($t=>Se($t.bind(n))):Te&&Se(Te.bind(n))}if(Je(Ov,p),Je(Ft,g),Je(Mv,_),Je(Lv,b),Je(Vv,y),Je(Dv,E),Je(jv,w),Je(Bv,le),Je($v,S),Je(Uv,C),Je(Wp,M),Je(Fv,I),pe(P))if(P.length){const Se=t.exposed||(t.exposed={});P.forEach(Te=>{Object.defineProperty(Se,Te,{get:()=>n[Te],set:$t=>n[Te]=$t})})}else t.exposed||(t.exposed={});W&&t.render===En&&(t.render=W),V!=null&&(t.inheritAttrs=V),N&&(t.components=N),R&&(t.directives=R),I&&Kp(t)}function Gv(t,e,n=En){pe(t)&&(t=Zl(t));for(const s in t){const r=t[s];let i;$e(r)?"default"in r?i=un(r.from||s,r.default,!0):i=un(r.from||s):i=un(r),St(i)?Object.defineProperty(e,s,{enumerable:!0,configurable:!0,get:()=>i.value,set:o=>i.value=o}):e[s]=i}}function Wh(t,e,n){Sn(pe(t)?t.map(s=>s.bind(e.proxy)):t.bind(e.proxy),e,n)}function Xp(t,e,n,s){let r=s.includes(".")?dm(n,s):()=>n[s];if(nt(t)){const i=e[t];be(i)&&_r(r,i)}else if(be(t))_r(r,t.bind(n));else if($e(t))if(pe(t))t.forEach(i=>Xp(i,e,n,s));else{const i=be(t.handler)?t.handler.bind(n):e[t.handler];be(i)&&_r(r,i,t)}}function Zp(t){const e=t.type,{mixins:n,extends:s}=e,{mixins:r,optionsCache:i,config:{optionMergeStrategies:o}}=t.appContext,l=i.get(e);let u;return l?u=l:!r.length&&!n&&!s?u=e:(u={},r.length&&r.forEach(c=>Xo(u,c,o,!0)),Xo(u,e,o)),$e(e)&&i.set(e,u),u}function Xo(t,e,n,s=!1){const{mixins:r,extends:i}=e;i&&Xo(t,i,n,!0),r&&r.forEach(o=>Xo(t,o,n,!0));for(const o in e)if(!(s&&o==="expose")){const l=Wv[o]||n&&n[o];t[o]=l?l(t[o],e[o]):e[o]}return t}const Wv={data:Qh,props:Yh,emits:Yh,methods:ii,computed:ii,beforeCreate:Vt,created:Vt,beforeMount:Vt,mounted:Vt,beforeUpdate:Vt,updated:Vt,beforeDestroy:Vt,beforeUnmount:Vt,destroyed:Vt,unmounted:Vt,activated:Vt,deactivated:Vt,errorCaptured:Vt,serverPrefetch:Vt,components:ii,directives:ii,watch:Yv,provide:Qh,inject:Qv};function Qh(t,e){return e?t?function(){return Ct(be(t)?t.call(this,this):t,be(e)?e.call(this,this):e)}:e:t}function Qv(t,e){return ii(Zl(t),Zl(e))}function Zl(t){if(pe(t)){const e={};for(let n=0;n<t.length;n++)e[t[n]]=t[n];return e}return t}function Vt(t,e){return t?[...new Set([].concat(t,e))]:e}function ii(t,e){return t?Ct(Object.create(null),t,e):e}function Yh(t,e){return t?pe(t)&&pe(e)?[...new Set([...t,...e])]:Ct(Object.create(null),Gh(t),Gh(e??{})):e}function Yv(t,e){if(!t)return e;if(!e)return t;const n=Ct(Object.create(null),t);for(const s in e)n[s]=Vt(t[s],e[s]);return n}function em(){return{app:null,config:{isNativeTag:By,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let Jv=0;function Xv(t,e){return function(s,r=null){be(s)||(s=Ct({},s)),r!=null&&!$e(r)&&(r=null);const i=em(),o=new WeakSet,l=[];let u=!1;const c=i.app={_uid:Jv++,_component:s,_props:r,_container:null,_context:i,_instance:null,version:Db,get config(){return i.config},set config(f){},use(f,...p){return o.has(f)||(f&&be(f.install)?(o.add(f),f.install(c,...p)):be(f)&&(o.add(f),f(c,...p))),c},mixin(f){return i.mixins.includes(f)||i.mixins.push(f),c},component(f,p){return p?(i.components[f]=p,c):i.components[f]},directive(f,p){return p?(i.directives[f]=p,c):i.directives[f]},mount(f,p,g){if(!u){const _=c._ceVNode||et(s,r);return _.appContext=i,g===!0?g="svg":g===!1&&(g=void 0),t(_,f,g),u=!0,c._container=f,f.__vue_app__=c,Na(_.component)}},onUnmount(f){l.push(f)},unmount(){u&&(Sn(l,c._instance,16),t(null,c._container),delete c._container.__vue_app__)},provide(f,p){return i.provides[f]=p,c},runWithContext(f){const p=gr;gr=c;try{return f()}finally{gr=p}}};return c}}let gr=null;function Vo(t,e){if(At){let n=At.provides;const s=At.parent&&At.parent.provides;s===n&&(n=At.provides=Object.create(s)),n[t]=e}}function un(t,e,n=!1){const s=At||qt;if(s||gr){let r=gr?gr._context.provides:s?s.parent==null||s.ce?s.vnode.appContext&&s.vnode.appContext.provides:s.parent.provides:void 0;if(r&&t in r)return r[t];if(arguments.length>1)return n&&be(e)?e.call(s&&s.proxy):e}}const tm={},nm=()=>Object.create(tm),sm=t=>Object.getPrototypeOf(t)===tm;function Zv(t,e,n,s=!1){const r={},i=nm();t.propsDefaults=Object.create(null),rm(t,e,r,i);for(const o in t.propsOptions[0])o in r||(r[o]=void 0);n?t.props=s?r:Op(r):t.type.props?t.props=r:t.props=i,t.attrs=i}function eb(t,e,n,s){const{props:r,attrs:i,vnode:{patchFlag:o}}=t,l=Ne(r),[u]=t.propsOptions;let c=!1;if((s||o>0)&&!(o&16)){if(o&8){const f=t.vnode.dynamicProps;for(let p=0;p<f.length;p++){let g=f[p];if(Va(t.emitsOptions,g))continue;const _=e[g];if(u)if(Oe(i,g))_!==i[g]&&(i[g]=_,c=!0);else{const b=tn(g);r[b]=eu(u,l,b,_,t,!1)}else _!==i[g]&&(i[g]=_,c=!0)}}}else{rm(t,e,r,i)&&(c=!0);let f;for(const p in l)(!e||!Oe(e,p)&&((f=Ys(p))===p||!Oe(e,f)))&&(u?n&&(n[p]!==void 0||n[f]!==void 0)&&(r[p]=eu(u,l,p,void 0,t,!0)):delete r[p]);if(i!==l)for(const p in i)(!e||!Oe(e,p))&&(delete i[p],c=!0)}c&&On(t.attrs,"set","")}function rm(t,e,n,s){const[r,i]=t.propsOptions;let o=!1,l;if(e)for(let u in e){if(di(u))continue;const c=e[u];let f;r&&Oe(r,f=tn(u))?!i||!i.includes(f)?n[f]=c:(l||(l={}))[f]=c:Va(t.emitsOptions,u)||(!(u in s)||c!==s[u])&&(s[u]=c,o=!0)}if(i){const u=Ne(n),c=l||Ue;for(let f=0;f<i.length;f++){const p=i[f];n[p]=eu(r,u,p,c[p],t,!Oe(c,p))}}return o}function eu(t,e,n,s,r,i){const o=t[n];if(o!=null){const l=Oe(o,"default");if(l&&s===void 0){const u=o.default;if(o.type!==Function&&!o.skipFactory&&be(u)){const{propsDefaults:c}=r;if(n in c)s=c[n];else{const f=Ki(r);s=c[n]=u.call(null,e),f()}}else s=u;r.ce&&r.ce._setProp(n,s)}o[0]&&(i&&!l?s=!1:o[1]&&(s===""||s===Ys(n))&&(s=!0))}return s}const tb=new WeakMap;function im(t,e,n=!1){const s=n?tb:e.propsCache,r=s.get(t);if(r)return r;const i=t.props,o={},l=[];let u=!1;if(!be(t)){const f=p=>{u=!0;const[g,_]=im(p,e,!0);Ct(o,g),_&&l.push(..._)};!n&&e.mixins.length&&e.mixins.forEach(f),t.extends&&f(t.extends),t.mixins&&t.mixins.forEach(f)}if(!i&&!u)return $e(t)&&s.set(t,dr),dr;if(pe(i))for(let f=0;f<i.length;f++){const p=tn(i[f]);Jh(p)&&(o[p]=Ue)}else if(i)for(const f in i){const p=tn(f);if(Jh(p)){const g=i[f],_=o[p]=pe(g)||be(g)?{type:g}:Ct({},g),b=_.type;let y=!1,E=!0;if(pe(b))for(let k=0;k<b.length;++k){const C=b[k],x=be(C)&&C.name;if(x==="Boolean"){y=!0;break}else x==="String"&&(E=!1)}else y=be(b)&&b.name==="Boolean";_[0]=y,_[1]=E,(y||Oe(_,"default"))&&l.push(p)}}const c=[o,l];return $e(t)&&s.set(t,c),c}function Jh(t){return t[0]!=="$"&&!di(t)}const Wu=t=>t[0]==="_"||t==="$stable",Qu=t=>pe(t)?t.map(bn):[bn(t)],nb=(t,e,n)=>{if(e._n)return e;const s=Ku((...r)=>Qu(e(...r)),n);return s._c=!1,s},om=(t,e,n)=>{const s=t._ctx;for(const r in t){if(Wu(r))continue;const i=t[r];if(be(i))e[r]=nb(r,i,s);else if(i!=null){const o=Qu(i);e[r]=()=>o}}},am=(t,e)=>{const n=Qu(e);t.slots.default=()=>n},lm=(t,e,n)=>{for(const s in e)(n||!Wu(s))&&(t[s]=e[s])},sb=(t,e,n)=>{const s=t.slots=nm();if(t.vnode.shapeFlag&32){const r=e._;r?(lm(s,e,n),n&&_p(s,"_",r,!0)):om(e,s)}else e&&am(t,e)},rb=(t,e,n)=>{const{vnode:s,slots:r}=t;let i=!0,o=Ue;if(s.shapeFlag&32){const l=e._;l?n&&l===1?i=!1:lm(r,e,n):(i=!e.$stable,om(e,r)),o=e}else e&&(am(t,e),o={default:1});if(i)for(const l in r)!Wu(l)&&o[l]==null&&delete r[l]},jt=yb;function ib(t){return ob(t)}function ob(t,e){const n=Ra();n.__VUE__=!0;const{insert:s,remove:r,patchProp:i,createElement:o,createText:l,createComment:u,setText:c,setElementText:f,parentNode:p,nextSibling:g,setScopeId:_=En,insertStaticContent:b}=t,y=(T,A,D,F=null,q=null,$=null,ee=void 0,J=null,Q=!!A.dynamicChildren)=>{if(T===A)return;T&&!si(T,A)&&(F=U(T),He(T,q,$,!0),T=null),A.patchFlag===-2&&(Q=!1,A.dynamicChildren=null);const{type:H,ref:ue,shapeFlag:Z}=A;switch(H){case Da:E(T,A,D,F);break;case bs:k(T,A,D,F);break;case Do:T==null&&C(A,D,F,ee);break;case Ve:N(T,A,D,F,q,$,ee,J,Q);break;default:Z&1?W(T,A,D,F,q,$,ee,J,Q):Z&6?R(T,A,D,F,q,$,ee,J,Q):(Z&64||Z&128)&&H.process(T,A,D,F,q,$,ee,J,Q,oe)}ue!=null&&q&&Jo(ue,T&&T.ref,$,A||T,!A)},E=(T,A,D,F)=>{if(T==null)s(A.el=l(A.children),D,F);else{const q=A.el=T.el;A.children!==T.children&&c(q,A.children)}},k=(T,A,D,F)=>{T==null?s(A.el=u(A.children||""),D,F):A.el=T.el},C=(T,A,D,F)=>{[T.el,T.anchor]=b(T.children,A,D,F,T.el,T.anchor)},x=({el:T,anchor:A},D,F)=>{let q;for(;T&&T!==A;)q=g(T),s(T,D,F),T=q;s(A,D,F)},M=({el:T,anchor:A})=>{let D;for(;T&&T!==A;)D=g(T),r(T),T=D;r(A)},W=(T,A,D,F,q,$,ee,J,Q)=>{A.type==="svg"?ee="svg":A.type==="math"&&(ee="mathml"),T==null?le(A,D,F,q,$,ee,J,Q):I(T,A,q,$,ee,J,Q)},le=(T,A,D,F,q,$,ee,J)=>{let Q,H;const{props:ue,shapeFlag:Z,transition:ae,dirs:_e}=T;if(Q=T.el=o(T.type,$,ue&&ue.is,ue),Z&8?f(Q,T.children):Z&16&&w(T.children,Q,null,F,q,kl(T,$),ee,J),_e&&Ms(T,null,F,"created"),S(Q,T,T.scopeId,ee,F),ue){for(const Ee in ue)Ee!=="value"&&!di(Ee)&&i(Q,Ee,null,ue[Ee],$,F);"value"in ue&&i(Q,"value",null,ue.value,$),(H=ue.onVnodeBeforeMount)&&_n(H,F,T)}_e&&Ms(T,null,F,"beforeMount");const de=ab(q,ae);de&&ae.beforeEnter(Q),s(Q,A,D),((H=ue&&ue.onVnodeMounted)||de||_e)&&jt(()=>{H&&_n(H,F,T),de&&ae.enter(Q),_e&&Ms(T,null,F,"mounted")},q)},S=(T,A,D,F,q)=>{if(D&&_(T,D),F)for(let $=0;$<F.length;$++)_(T,F[$]);if(q){let $=q.subTree;if(A===$||pm($.type)&&($.ssContent===A||$.ssFallback===A)){const ee=q.vnode;S(T,ee,ee.scopeId,ee.slotScopeIds,q.parent)}}},w=(T,A,D,F,q,$,ee,J,Q=0)=>{for(let H=Q;H<T.length;H++){const ue=T[H]=J?os(T[H]):bn(T[H]);y(null,ue,A,D,F,q,$,ee,J)}},I=(T,A,D,F,q,$,ee)=>{const J=A.el=T.el;let{patchFlag:Q,dynamicChildren:H,dirs:ue}=A;Q|=T.patchFlag&16;const Z=T.props||Ue,ae=A.props||Ue;let _e;if(D&&Ls(D,!1),(_e=ae.onVnodeBeforeUpdate)&&_n(_e,D,A,T),ue&&Ms(A,T,D,"beforeUpdate"),D&&Ls(D,!0),(Z.innerHTML&&ae.innerHTML==null||Z.textContent&&ae.textContent==null)&&f(J,""),H?P(T.dynamicChildren,H,J,D,F,kl(A,q),$):ee||Te(T,A,J,null,D,F,kl(A,q),$,!1),Q>0){if(Q&16)V(J,Z,ae,D,q);else if(Q&2&&Z.class!==ae.class&&i(J,"class",null,ae.class,q),Q&4&&i(J,"style",Z.style,ae.style,q),Q&8){const de=A.dynamicProps;for(let Ee=0;Ee<de.length;Ee++){const Ce=de[Ee],_t=Z[Ce],ut=ae[Ce];(ut!==_t||Ce==="value")&&i(J,Ce,_t,ut,q,D)}}Q&1&&T.children!==A.children&&f(J,A.children)}else!ee&&H==null&&V(J,Z,ae,D,q);((_e=ae.onVnodeUpdated)||ue)&&jt(()=>{_e&&_n(_e,D,A,T),ue&&Ms(A,T,D,"updated")},F)},P=(T,A,D,F,q,$,ee)=>{for(let J=0;J<A.length;J++){const Q=T[J],H=A[J],ue=Q.el&&(Q.type===Ve||!si(Q,H)||Q.shapeFlag&198)?p(Q.el):D;y(Q,H,ue,null,F,q,$,ee,!0)}},V=(T,A,D,F,q)=>{if(A!==D){if(A!==Ue)for(const $ in A)!di($)&&!($ in D)&&i(T,$,A[$],null,q,F);for(const $ in D){if(di($))continue;const ee=D[$],J=A[$];ee!==J&&$!=="value"&&i(T,$,J,ee,q,F)}"value"in D&&i(T,"value",A.value,D.value,q)}},N=(T,A,D,F,q,$,ee,J,Q)=>{const H=A.el=T?T.el:l(""),ue=A.anchor=T?T.anchor:l("");let{patchFlag:Z,dynamicChildren:ae,slotScopeIds:_e}=A;_e&&(J=J?J.concat(_e):_e),T==null?(s(H,D,F),s(ue,D,F),w(A.children||[],D,ue,q,$,ee,J,Q)):Z>0&&Z&64&&ae&&T.dynamicChildren?(P(T.dynamicChildren,ae,D,q,$,ee,J),(A.key!=null||q&&A===q.subTree)&&um(T,A,!0)):Te(T,A,D,ue,q,$,ee,J,Q)},R=(T,A,D,F,q,$,ee,J,Q)=>{A.slotScopeIds=J,T==null?A.shapeFlag&512?q.ctx.activate(A,D,F,ee,Q):kt(A,D,F,q,$,ee,Q):zt(T,A,Q)},kt=(T,A,D,F,q,$,ee)=>{const J=T.component=Rb(T,F,q);if(zp(T)&&(J.ctx.renderer=oe),Sb(J,!1,ee),J.asyncDep){if(q&&q.registerDep(J,Je,ee),!T.el){const Q=J.subTree=et(bs);k(null,Q,A,D)}}else Je(J,T,A,D,q,$,ee)},zt=(T,A,D)=>{const F=A.component=T.component;if(gb(T,A,D))if(F.asyncDep&&!F.asyncResolved){Se(F,A,D);return}else F.next=A,F.update();else A.el=T.el,F.vnode=A},Je=(T,A,D,F,q,$,ee)=>{const J=()=>{if(T.isMounted){let{next:Z,bu:ae,u:_e,parent:de,vnode:Ee}=T;{const yt=cm(T);if(yt){Z&&(Z.el=Ee.el,Se(T,Z,ee)),yt.asyncDep.then(()=>{T.isUnmounted||J()});return}}let Ce=Z,_t;Ls(T,!1),Z?(Z.el=Ee.el,Se(T,Z,ee)):Z=Ee,ae&&xo(ae),(_t=Z.props&&Z.props.onVnodeBeforeUpdate)&&_n(_t,de,Z,Ee),Ls(T,!0);const ut=Zh(T),Wt=T.subTree;T.subTree=ut,y(Wt,ut,p(Wt.el),U(Wt),T,q,$),Z.el=ut.el,Ce===null&&_b(T,ut.el),_e&&jt(_e,q),(_t=Z.props&&Z.props.onVnodeUpdated)&&jt(()=>_n(_t,de,Z,Ee),q)}else{let Z;const{el:ae,props:_e}=A,{bm:de,m:Ee,parent:Ce,root:_t,type:ut}=T,Wt=mi(A);Ls(T,!1),de&&xo(de),!Wt&&(Z=_e&&_e.onVnodeBeforeMount)&&_n(Z,Ce,A),Ls(T,!0);{_t.ce&&_t.ce._injectChildStyle(ut);const yt=T.subTree=Zh(T);y(null,yt,D,F,T,q,$),A.el=yt.el}if(Ee&&jt(Ee,q),!Wt&&(Z=_e&&_e.onVnodeMounted)){const yt=A;jt(()=>_n(Z,Ce,yt),q)}(A.shapeFlag&256||Ce&&mi(Ce.vnode)&&Ce.vnode.shapeFlag&256)&&T.a&&jt(T.a,q),T.isMounted=!0,A=D=F=null}};T.scope.on();const Q=T.effect=new Ep(J);T.scope.off();const H=T.update=Q.run.bind(Q),ue=T.job=Q.runIfDirty.bind(Q);ue.i=T,ue.id=T.uid,Q.scheduler=()=>Hu(ue),Ls(T,!0),H()},Se=(T,A,D)=>{A.component=T;const F=T.vnode.props;T.vnode=A,T.next=null,eb(T,A.props,F,D),rb(T,A.children,D),jn(),Kh(T),qn()},Te=(T,A,D,F,q,$,ee,J,Q=!1)=>{const H=T&&T.children,ue=T?T.shapeFlag:0,Z=A.children,{patchFlag:ae,shapeFlag:_e}=A;if(ae>0){if(ae&128){nn(H,Z,D,F,q,$,ee,J,Q);return}else if(ae&256){$t(H,Z,D,F,q,$,ee,J,Q);return}}_e&8?(ue&16&&Ot(H,q,$),Z!==H&&f(D,Z)):ue&16?_e&16?nn(H,Z,D,F,q,$,ee,J,Q):Ot(H,q,$,!0):(ue&8&&f(D,""),_e&16&&w(Z,D,F,q,$,ee,J,Q))},$t=(T,A,D,F,q,$,ee,J,Q)=>{T=T||dr,A=A||dr;const H=T.length,ue=A.length,Z=Math.min(H,ue);let ae;for(ae=0;ae<Z;ae++){const _e=A[ae]=Q?os(A[ae]):bn(A[ae]);y(T[ae],_e,D,null,q,$,ee,J,Q)}H>ue?Ot(T,q,$,!0,!1,Z):w(A,D,F,q,$,ee,J,Q,Z)},nn=(T,A,D,F,q,$,ee,J,Q)=>{let H=0;const ue=A.length;let Z=T.length-1,ae=ue-1;for(;H<=Z&&H<=ae;){const _e=T[H],de=A[H]=Q?os(A[H]):bn(A[H]);if(si(_e,de))y(_e,de,D,null,q,$,ee,J,Q);else break;H++}for(;H<=Z&&H<=ae;){const _e=T[Z],de=A[ae]=Q?os(A[ae]):bn(A[ae]);if(si(_e,de))y(_e,de,D,null,q,$,ee,J,Q);else break;Z--,ae--}if(H>Z){if(H<=ae){const _e=ae+1,de=_e<ue?A[_e].el:F;for(;H<=ae;)y(null,A[H]=Q?os(A[H]):bn(A[H]),D,de,q,$,ee,J,Q),H++}}else if(H>ae)for(;H<=Z;)He(T[H],q,$,!0),H++;else{const _e=H,de=H,Ee=new Map;for(H=de;H<=ae;H++){const ct=A[H]=Q?os(A[H]):bn(A[H]);ct.key!=null&&Ee.set(ct.key,H)}let Ce,_t=0;const ut=ae-de+1;let Wt=!1,yt=0;const Zn=new Array(ut);for(H=0;H<ut;H++)Zn[H]=0;for(H=_e;H<=Z;H++){const ct=T[H];if(_t>=ut){He(ct,q,$,!0);continue}let Qt;if(ct.key!=null)Qt=Ee.get(ct.key);else for(Ce=de;Ce<=ae;Ce++)if(Zn[Ce-de]===0&&si(ct,A[Ce])){Qt=Ce;break}Qt===void 0?He(ct,q,$,!0):(Zn[Qt-de]=H+1,Qt>=yt?yt=Qt:Wt=!0,y(ct,A[Qt],D,null,q,$,ee,J,Q),_t++)}const qr=Wt?lb(Zn):dr;for(Ce=qr.length-1,H=ut-1;H>=0;H--){const ct=de+H,Qt=A[ct],ro=ct+1<ue?A[ct+1].el:F;Zn[H]===0?y(null,Qt,D,ro,q,$,ee,J,Q):Wt&&(Ce<0||H!==qr[Ce]?Gt(Qt,D,ro,2):Ce--)}}},Gt=(T,A,D,F,q=null)=>{const{el:$,type:ee,transition:J,children:Q,shapeFlag:H}=T;if(H&6){Gt(T.component.subTree,A,D,F);return}if(H&128){T.suspense.move(A,D,F);return}if(H&64){ee.move(T,A,D,oe);return}if(ee===Ve){s($,A,D);for(let Z=0;Z<Q.length;Z++)Gt(Q[Z],A,D,F);s(T.anchor,A,D);return}if(ee===Do){x(T,A,D);return}if(F!==2&&H&1&&J)if(F===0)J.beforeEnter($),s($,A,D),jt(()=>J.enter($),q);else{const{leave:Z,delayLeave:ae,afterLeave:_e}=J,de=()=>{T.ctx.isUnmounted?r($):s($,A,D)},Ee=()=>{Z($,()=>{de(),_e&&_e()})};ae?ae($,de,Ee):Ee()}else s($,A,D)},He=(T,A,D,F=!1,q=!1)=>{const{type:$,props:ee,ref:J,children:Q,dynamicChildren:H,shapeFlag:ue,patchFlag:Z,dirs:ae,cacheIndex:_e}=T;if(Z===-2&&(q=!1),J!=null&&(jn(),Jo(J,null,D,T,!0),qn()),_e!=null&&(A.renderCache[_e]=void 0),ue&256){A.ctx.deactivate(T);return}const de=ue&1&&ae,Ee=!mi(T);let Ce;if(Ee&&(Ce=ee&&ee.onVnodeBeforeUnmount)&&_n(Ce,A,T),ue&6)gn(T.component,D,F);else{if(ue&128){T.suspense.unmount(D,F);return}de&&Ms(T,null,A,"beforeUnmount"),ue&64?T.type.remove(T,A,D,oe,F):H&&!H.hasOnce&&($!==Ve||Z>0&&Z&64)?Ot(H,A,D,!1,!0):($===Ve&&Z&384||!q&&ue&16)&&Ot(Q,A,D),F&&Ke(T)}(Ee&&(Ce=ee&&ee.onVnodeUnmounted)||de)&&jt(()=>{Ce&&_n(Ce,A,T),de&&Ms(T,null,A,"unmounted")},D)},Ke=T=>{const{type:A,el:D,anchor:F,transition:q}=T;if(A===Ve){Xn(D,F);return}if(A===Do){M(T);return}const $=()=>{r(D),q&&!q.persisted&&q.afterLeave&&q.afterLeave()};if(T.shapeFlag&1&&q&&!q.persisted){const{leave:ee,delayLeave:J}=q,Q=()=>ee(D,$);J?J(T.el,$,Q):Q()}else $()},Xn=(T,A)=>{let D;for(;T!==A;)D=g(T),r(T),T=D;r(A)},gn=(T,A,D)=>{const{bum:F,scope:q,job:$,subTree:ee,um:J,m:Q,a:H,parent:ue,slots:{__:Z}}=T;Xh(Q),Xh(H),F&&xo(F),ue&&pe(Z)&&Z.forEach(ae=>{ue.renderCache[ae]=void 0}),q.stop(),$&&($.flags|=8,He(ee,T,A,D)),J&&jt(J,A),jt(()=>{T.isUnmounted=!0},A),A&&A.pendingBranch&&!A.isUnmounted&&T.asyncDep&&!T.asyncResolved&&T.suspenseId===A.pendingId&&(A.deps--,A.deps===0&&A.resolve())},Ot=(T,A,D,F=!1,q=!1,$=0)=>{for(let ee=$;ee<T.length;ee++)He(T[ee],A,D,F,q)},U=T=>{if(T.shapeFlag&6)return U(T.component.subTree);if(T.shapeFlag&128)return T.suspense.next();const A=g(T.anchor||T.el),D=A&&A[kv];return D?g(D):A};let ne=!1;const te=(T,A,D)=>{T==null?A._vnode&&He(A._vnode,null,null,!0):y(A._vnode||null,T,A,null,null,null,D),A._vnode=T,ne||(ne=!0,Kh(),Bp(),ne=!1)},oe={p:y,um:He,m:Gt,r:Ke,mt:kt,mc:w,pc:Te,pbc:P,n:U,o:t};return{render:te,hydrate:void 0,createApp:Xv(te)}}function kl({type:t,props:e},n){return n==="svg"&&t==="foreignObject"||n==="mathml"&&t==="annotation-xml"&&e&&e.encoding&&e.encoding.includes("html")?void 0:n}function Ls({effect:t,job:e},n){n?(t.flags|=32,e.flags|=4):(t.flags&=-33,e.flags&=-5)}function ab(t,e){return(!t||t&&!t.pendingBranch)&&e&&!e.persisted}function um(t,e,n=!1){const s=t.children,r=e.children;if(pe(s)&&pe(r))for(let i=0;i<s.length;i++){const o=s[i];let l=r[i];l.shapeFlag&1&&!l.dynamicChildren&&((l.patchFlag<=0||l.patchFlag===32)&&(l=r[i]=os(r[i]),l.el=o.el),!n&&l.patchFlag!==-2&&um(o,l)),l.type===Da&&(l.el=o.el),l.type===bs&&!l.el&&(l.el=o.el)}}function lb(t){const e=t.slice(),n=[0];let s,r,i,o,l;const u=t.length;for(s=0;s<u;s++){const c=t[s];if(c!==0){if(r=n[n.length-1],t[r]<c){e[s]=r,n.push(s);continue}for(i=0,o=n.length-1;i<o;)l=i+o>>1,t[n[l]]<c?i=l+1:o=l;c<t[n[i]]&&(i>0&&(e[s]=n[i-1]),n[i]=s)}}for(i=n.length,o=n[i-1];i-- >0;)n[i]=o,o=e[o];return n}function cm(t){const e=t.subTree.component;if(e)return e.asyncDep&&!e.asyncResolved?e:cm(e)}function Xh(t){if(t)for(let e=0;e<t.length;e++)t[e].flags|=8}const ub=Symbol.for("v-scx"),cb=()=>un(ub);function _r(t,e,n){return hm(t,e,n)}function hm(t,e,n=Ue){const{immediate:s,deep:r,flush:i,once:o}=n,l=Ct({},n),u=e&&s||!e&&i!=="post";let c;if(ki){if(i==="sync"){const _=cb();c=_.__watcherHandles||(_.__watcherHandles=[])}else if(!u){const _=()=>{};return _.stop=En,_.resume=En,_.pause=En,_}}const f=At;l.call=(_,b,y)=>Sn(_,f,b,y);let p=!1;i==="post"?l.scheduler=_=>{jt(_,f&&f.suspense)}:i!=="sync"&&(p=!0,l.scheduler=(_,b)=>{b?_():Hu(_)}),l.augmentJob=_=>{e&&(_.flags|=4),p&&(_.flags|=2,f&&(_.id=f.uid,_.i=f))};const g=Rv(t,e,l);return ki&&(c?c.push(g):u&&g()),g}function hb(t,e,n){const s=this.proxy,r=nt(t)?t.includes(".")?dm(s,t):()=>s[t]:t.bind(s,s);let i;be(e)?i=e:(i=e.handler,n=e);const o=Ki(this),l=hm(r,i.bind(s),n);return o(),l}function dm(t,e){const n=e.split(".");return()=>{let s=t;for(let r=0;r<n.length&&s;r++)s=s[n[r]];return s}}const db=(t,e)=>e==="modelValue"||e==="model-value"?t.modelModifiers:t[`${e}Modifiers`]||t[`${tn(e)}Modifiers`]||t[`${Ys(e)}Modifiers`];function fb(t,e,...n){if(t.isUnmounted)return;const s=t.vnode.props||Ue;let r=n;const i=e.startsWith("update:"),o=i&&db(s,e.slice(7));o&&(o.trim&&(r=n.map(f=>nt(f)?f.trim():f)),o.number&&(r=n.map(zo)));let l,u=s[l=Il(e)]||s[l=Il(tn(e))];!u&&i&&(u=s[l=Il(Ys(e))]),u&&Sn(u,t,6,r);const c=s[l+"Once"];if(c){if(!t.emitted)t.emitted={};else if(t.emitted[l])return;t.emitted[l]=!0,Sn(c,t,6,r)}}function fm(t,e,n=!1){const s=e.emitsCache,r=s.get(t);if(r!==void 0)return r;const i=t.emits;let o={},l=!1;if(!be(t)){const u=c=>{const f=fm(c,e,!0);f&&(l=!0,Ct(o,f))};!n&&e.mixins.length&&e.mixins.forEach(u),t.extends&&u(t.extends),t.mixins&&t.mixins.forEach(u)}return!i&&!l?($e(t)&&s.set(t,null),null):(pe(i)?i.forEach(u=>o[u]=null):Ct(o,i),$e(t)&&s.set(t,o),o)}function Va(t,e){return!t||!Ta(e)?!1:(e=e.slice(2).replace(/Once$/,""),Oe(t,e[0].toLowerCase()+e.slice(1))||Oe(t,Ys(e))||Oe(t,e))}function Zh(t){const{type:e,vnode:n,proxy:s,withProxy:r,propsOptions:[i],slots:o,attrs:l,emit:u,render:c,renderCache:f,props:p,data:g,setupState:_,ctx:b,inheritAttrs:y}=t,E=Yo(t);let k,C;try{if(n.shapeFlag&4){const M=r||s,W=M;k=bn(c.call(W,M,f,p,_,g,b)),C=l}else{const M=e;k=bn(M.length>1?M(p,{attrs:l,slots:o,emit:u}):M(p,null)),C=e.props?l:pb(l)}}catch(M){_i.length=0,ka(M,t,1),k=et(bs)}let x=k;if(C&&y!==!1){const M=Object.keys(C),{shapeFlag:W}=x;M.length&&W&7&&(i&&M.some(Vu)&&(C=mb(C,i)),x=wr(x,C,!1,!0))}return n.dirs&&(x=wr(x,null,!1,!0),x.dirs=x.dirs?x.dirs.concat(n.dirs):n.dirs),n.transition&&zu(x,n.transition),k=x,Yo(E),k}const pb=t=>{let e;for(const n in t)(n==="class"||n==="style"||Ta(n))&&((e||(e={}))[n]=t[n]);return e},mb=(t,e)=>{const n={};for(const s in t)(!Vu(s)||!(s.slice(9)in e))&&(n[s]=t[s]);return n};function gb(t,e,n){const{props:s,children:r,component:i}=t,{props:o,children:l,patchFlag:u}=e,c=i.emitsOptions;if(e.dirs||e.transition)return!0;if(n&&u>=0){if(u&1024)return!0;if(u&16)return s?ed(s,o,c):!!o;if(u&8){const f=e.dynamicProps;for(let p=0;p<f.length;p++){const g=f[p];if(o[g]!==s[g]&&!Va(c,g))return!0}}}else return(r||l)&&(!l||!l.$stable)?!0:s===o?!1:s?o?ed(s,o,c):!0:!!o;return!1}function ed(t,e,n){const s=Object.keys(e);if(s.length!==Object.keys(t).length)return!0;for(let r=0;r<s.length;r++){const i=s[r];if(e[i]!==t[i]&&!Va(n,i))return!0}return!1}function _b({vnode:t,parent:e},n){for(;e;){const s=e.subTree;if(s.suspense&&s.suspense.activeBranch===t&&(s.el=t.el),s===t)(t=e.vnode).el=n,e=e.parent;else break}}const pm=t=>t.__isSuspense;function yb(t,e){e&&e.pendingBranch?pe(t)?e.effects.push(...t):e.effects.push(t):Pv(t)}const Ve=Symbol.for("v-fgt"),Da=Symbol.for("v-txt"),bs=Symbol.for("v-cmt"),Do=Symbol.for("v-stc"),_i=[];let Ht=null;function z(t=!1){_i.push(Ht=t?null:[])}function vb(){_i.pop(),Ht=_i[_i.length-1]||null}let Pi=1;function td(t,e=!1){Pi+=t,t<0&&Ht&&e&&(Ht.hasOnce=!0)}function mm(t){return t.dynamicChildren=Pi>0?Ht||dr:null,vb(),Pi>0&&Ht&&Ht.push(t),t}function Y(t,e,n,s,r,i){return mm(d(t,e,n,s,r,i,!0))}function rn(t,e,n,s,r){return mm(et(t,e,n,s,r,!0))}function Zo(t){return t?t.__v_isVNode===!0:!1}function si(t,e){return t.type===e.type&&t.key===e.key}const gm=({key:t})=>t??null,No=({ref:t,ref_key:e,ref_for:n})=>(typeof t=="number"&&(t=""+t),t!=null?nt(t)||St(t)||be(t)?{i:qt,r:t,k:e,f:!!n}:t:null);function d(t,e=null,n=null,s=0,r=null,i=t===Ve?0:1,o=!1,l=!1){const u={__v_isVNode:!0,__v_skip:!0,type:t,props:e,key:e&&gm(e),ref:e&&No(e),scopeId:qp,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:i,patchFlag:s,dynamicProps:r,dynamicChildren:null,appContext:null,ctx:qt};return l?(Yu(u,n),i&128&&t.normalize(u)):n&&(u.shapeFlag|=nt(n)?8:16),Pi>0&&!o&&Ht&&(u.patchFlag>0||i&6)&&u.patchFlag!==32&&Ht.push(u),u}const et=bb;function bb(t,e=null,n=null,s=0,r=null,i=!1){if((!t||t===Hv)&&(t=bs),Zo(t)){const l=wr(t,e,!0);return n&&Yu(l,n),Pi>0&&!i&&Ht&&(l.shapeFlag&6?Ht[Ht.indexOf(t)]=l:Ht.push(l)),l.patchFlag=-2,l}if(Vb(t)&&(t=t.__vccOpts),e){e=Eb(e);let{class:l,style:u}=e;l&&!nt(l)&&(e.class=Jt(l)),$e(u)&&(ju(u)&&!pe(u)&&(u=Ct({},u)),e.style=Sa(u))}const o=nt(t)?1:pm(t)?128:xv(t)?64:$e(t)?4:be(t)?2:0;return d(t,e,n,s,r,o,i,!0)}function Eb(t){return t?ju(t)||sm(t)?Ct({},t):t:null}function wr(t,e,n=!1,s=!1){const{props:r,ref:i,patchFlag:o,children:l,transition:u}=t,c=e?Tb(r||{},e):r,f={__v_isVNode:!0,__v_skip:!0,type:t.type,props:c,key:c&&gm(c),ref:e&&e.ref?n&&i?pe(i)?i.concat(No(e)):[i,No(e)]:No(e):i,scopeId:t.scopeId,slotScopeIds:t.slotScopeIds,children:l,target:t.target,targetStart:t.targetStart,targetAnchor:t.targetAnchor,staticCount:t.staticCount,shapeFlag:t.shapeFlag,patchFlag:e&&t.type!==Ve?o===-1?16:o|16:o,dynamicProps:t.dynamicProps,dynamicChildren:t.dynamicChildren,appContext:t.appContext,dirs:t.dirs,transition:u,component:t.component,suspense:t.suspense,ssContent:t.ssContent&&wr(t.ssContent),ssFallback:t.ssFallback&&wr(t.ssFallback),el:t.el,anchor:t.anchor,ctx:t.ctx,ce:t.ce};return u&&s&&zu(f,u.clone(f)),f}function ft(t=" ",e=0){return et(Da,null,t,e)}function wb(t,e){const n=et(Do,null,t);return n.staticCount=e,n}function tt(t="",e=!1){return e?(z(),rn(bs,null,t)):et(bs,null,t)}function bn(t){return t==null||typeof t=="boolean"?et(bs):pe(t)?et(Ve,null,t.slice()):Zo(t)?os(t):et(Da,null,String(t))}function os(t){return t.el===null&&t.patchFlag!==-1||t.memo?t:wr(t)}function Yu(t,e){let n=0;const{shapeFlag:s}=t;if(e==null)e=null;else if(pe(e))n=16;else if(typeof e=="object")if(s&65){const r=e.default;r&&(r._c&&(r._d=!1),Yu(t,r()),r._c&&(r._d=!0));return}else{n=32;const r=e._;!r&&!sm(e)?e._ctx=qt:r===3&&qt&&(qt.slots._===1?e._=1:(e._=2,t.patchFlag|=1024))}else be(e)?(e={default:e,_ctx:qt},n=32):(e=String(e),s&64?(n=16,e=[ft(e)]):n=8);t.children=e,t.shapeFlag|=n}function Tb(...t){const e={};for(let n=0;n<t.length;n++){const s=t[n];for(const r in s)if(r==="class")e.class!==s.class&&(e.class=Jt([e.class,s.class]));else if(r==="style")e.style=Sa([e.style,s.style]);else if(Ta(r)){const i=e[r],o=s[r];o&&i!==o&&!(pe(i)&&i.includes(o))&&(e[r]=i?[].concat(i,o):o)}else r!==""&&(e[r]=s[r])}return e}function _n(t,e,n,s=null){Sn(t,e,7,[n,s])}const Ib=em();let Ab=0;function Rb(t,e,n){const s=t.type,r=(e?e.appContext:t.appContext)||Ib,i={uid:Ab++,vnode:t,type:s,parent:e,appContext:r,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new Zy(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(r.provides),ids:e?e.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:im(s,r),emitsOptions:fm(s,r),emit:null,emitted:null,propsDefaults:Ue,inheritAttrs:s.inheritAttrs,ctx:Ue,data:Ue,props:Ue,attrs:Ue,slots:Ue,refs:Ue,setupState:Ue,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return i.ctx={_:i},i.root=e?e.root:i,i.emit=fb.bind(null,i),t.ce&&t.ce(i),i}let At=null,ea,tu;{const t=Ra(),e=(n,s)=>{let r;return(r=t[n])||(r=t[n]=[]),r.push(s),i=>{r.length>1?r.forEach(o=>o(i)):r[0](i)}};ea=e("__VUE_INSTANCE_SETTERS__",n=>At=n),tu=e("__VUE_SSR_SETTERS__",n=>ki=n)}const Ki=t=>{const e=At;return ea(t),t.scope.on(),()=>{t.scope.off(),ea(e)}},nd=()=>{At&&At.scope.off(),ea(null)};function _m(t){return t.vnode.shapeFlag&4}let ki=!1;function Sb(t,e=!1,n=!1){e&&tu(e);const{props:s,children:r}=t.vnode,i=_m(t);Zv(t,s,i,e),sb(t,r,n||e);const o=i?Cb(t,e):void 0;return e&&tu(!1),o}function Cb(t,e){const n=t.type;t.accessCache=Object.create(null),t.proxy=new Proxy(t.ctx,Kv);const{setup:s}=n;if(s){jn();const r=t.setupContext=s.length>1?kb(t):null,i=Ki(t),o=Hi(s,t,0,[t.props,r]),l=pp(o);if(qn(),i(),(l||t.sp)&&!mi(t)&&Kp(t),l){if(o.then(nd,nd),e)return o.then(u=>{sd(t,u)}).catch(u=>{ka(u,t,0)});t.asyncDep=o}else sd(t,o)}else ym(t)}function sd(t,e,n){be(e)?t.type.__ssrInlineRender?t.ssrRender=e:t.render=e:$e(e)&&(t.setupState=Up(e)),ym(t)}function ym(t,e,n){const s=t.type;t.render||(t.render=s.render||En);{const r=Ki(t);jn();try{zv(t)}finally{qn(),r()}}}const Pb={get(t,e){return Tt(t,"get",""),t[e]}};function kb(t){const e=n=>{t.exposed=n||{}};return{attrs:new Proxy(t.attrs,Pb),slots:t.slots,emit:t.emit,expose:e}}function Na(t){return t.exposed?t.exposeProxy||(t.exposeProxy=new Proxy(Up(vv(t.exposed)),{get(e,n){if(n in e)return e[n];if(n in gi)return gi[n](t)},has(e,n){return n in e||n in gi}})):t.proxy}function xb(t,e=!0){return be(t)?t.displayName||t.name:t.name||e&&t.__name}function Vb(t){return be(t)&&"__vccOpts"in t}const We=(t,e)=>Iv(t,e,ki);function vm(t,e,n){const s=arguments.length;return s===2?$e(e)&&!pe(e)?Zo(e)?et(t,null,[e]):et(t,e):et(t,null,e):(s>3?n=Array.prototype.slice.call(arguments,2):s===3&&Zo(n)&&(n=[n]),et(t,e,n))}const Db="3.5.15";/**
* @vue/runtime-dom v3.5.15
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let nu;const rd=typeof window<"u"&&window.trustedTypes;if(rd)try{nu=rd.createPolicy("vue",{createHTML:t=>t})}catch{}const bm=nu?t=>nu.createHTML(t):t=>t,Nb="http://www.w3.org/2000/svg",Ob="http://www.w3.org/1998/Math/MathML",Nn=typeof document<"u"?document:null,id=Nn&&Nn.createElement("template"),Mb={insert:(t,e,n)=>{e.insertBefore(t,n||null)},remove:t=>{const e=t.parentNode;e&&e.removeChild(t)},createElement:(t,e,n,s)=>{const r=e==="svg"?Nn.createElementNS(Nb,t):e==="mathml"?Nn.createElementNS(Ob,t):n?Nn.createElement(t,{is:n}):Nn.createElement(t);return t==="select"&&s&&s.multiple!=null&&r.setAttribute("multiple",s.multiple),r},createText:t=>Nn.createTextNode(t),createComment:t=>Nn.createComment(t),setText:(t,e)=>{t.nodeValue=e},setElementText:(t,e)=>{t.textContent=e},parentNode:t=>t.parentNode,nextSibling:t=>t.nextSibling,querySelector:t=>Nn.querySelector(t),setScopeId(t,e){t.setAttribute(e,"")},insertStaticContent(t,e,n,s,r,i){const o=n?n.previousSibling:e.lastChild;if(r&&(r===i||r.nextSibling))for(;e.insertBefore(r.cloneNode(!0),n),!(r===i||!(r=r.nextSibling)););else{id.innerHTML=bm(s==="svg"?`<svg>${t}</svg>`:s==="mathml"?`<math>${t}</math>`:t);const l=id.content;if(s==="svg"||s==="mathml"){const u=l.firstChild;for(;u.firstChild;)l.appendChild(u.firstChild);l.removeChild(u)}e.insertBefore(l,n)}return[o?o.nextSibling:e.firstChild,n?n.previousSibling:e.lastChild]}},Lb=Symbol("_vtc");function Ub(t,e,n){const s=t[Lb];s&&(e=(e?[e,...s]:[...s]).join(" ")),e==null?t.removeAttribute("class"):n?t.setAttribute("class",e):t.className=e}const od=Symbol("_vod"),Fb=Symbol("_vsh"),$b=Symbol(""),Bb=/(^|;)\s*display\s*:/;function jb(t,e,n){const s=t.style,r=nt(n);let i=!1;if(n&&!r){if(e)if(nt(e))for(const o of e.split(";")){const l=o.slice(0,o.indexOf(":")).trim();n[l]==null&&Oo(s,l,"")}else for(const o in e)n[o]==null&&Oo(s,o,"");for(const o in n)o==="display"&&(i=!0),Oo(s,o,n[o])}else if(r){if(e!==n){const o=s[$b];o&&(n+=";"+o),s.cssText=n,i=Bb.test(n)}}else e&&t.removeAttribute("style");od in t&&(t[od]=i?s.display:"",t[Fb]&&(s.display="none"))}const ad=/\s*!important$/;function Oo(t,e,n){if(pe(n))n.forEach(s=>Oo(t,e,s));else if(n==null&&(n=""),e.startsWith("--"))t.setProperty(e,n);else{const s=qb(t,e);ad.test(n)?t.setProperty(Ys(s),n.replace(ad,""),"important"):t[s]=n}}const ld=["Webkit","Moz","ms"],xl={};function qb(t,e){const n=xl[e];if(n)return n;let s=tn(e);if(s!=="filter"&&s in t)return xl[e]=s;s=Aa(s);for(let r=0;r<ld.length;r++){const i=ld[r]+s;if(i in t)return xl[e]=i}return e}const ud="http://www.w3.org/1999/xlink";function cd(t,e,n,s,r,i=Jy(e)){s&&e.startsWith("xlink:")?n==null?t.removeAttributeNS(ud,e.slice(6,e.length)):t.setAttributeNS(ud,e,n):n==null||i&&!yp(n)?t.removeAttribute(e):t.setAttribute(e,i?"":Rn(n)?String(n):n)}function hd(t,e,n,s,r){if(e==="innerHTML"||e==="textContent"){n!=null&&(t[e]=e==="innerHTML"?bm(n):n);return}const i=t.tagName;if(e==="value"&&i!=="PROGRESS"&&!i.includes("-")){const l=i==="OPTION"?t.getAttribute("value")||"":t.value,u=n==null?t.type==="checkbox"?"on":"":String(n);(l!==u||!("_value"in t))&&(t.value=u),n==null&&t.removeAttribute(e),t._value=n;return}let o=!1;if(n===""||n==null){const l=typeof t[e];l==="boolean"?n=yp(n):n==null&&l==="string"?(n="",o=!0):l==="number"&&(n=0,o=!0)}try{t[e]=n}catch{}o&&t.removeAttribute(r||e)}function Ln(t,e,n,s){t.addEventListener(e,n,s)}function Hb(t,e,n,s){t.removeEventListener(e,n,s)}const dd=Symbol("_vei");function Kb(t,e,n,s,r=null){const i=t[dd]||(t[dd]={}),o=i[e];if(s&&o)o.value=s;else{const[l,u]=zb(e);if(s){const c=i[e]=Qb(s,r);Ln(t,l,c,u)}else o&&(Hb(t,l,o,u),i[e]=void 0)}}const fd=/(?:Once|Passive|Capture)$/;function zb(t){let e;if(fd.test(t)){e={};let s;for(;s=t.match(fd);)t=t.slice(0,t.length-s[0].length),e[s[0].toLowerCase()]=!0}return[t[2]===":"?t.slice(3):Ys(t.slice(2)),e]}let Vl=0;const Gb=Promise.resolve(),Wb=()=>Vl||(Gb.then(()=>Vl=0),Vl=Date.now());function Qb(t,e){const n=s=>{if(!s._vts)s._vts=Date.now();else if(s._vts<=n.attached)return;Sn(Yb(s,n.value),e,5,[s])};return n.value=t,n.attached=Wb(),n}function Yb(t,e){if(pe(e)){const n=t.stopImmediatePropagation;return t.stopImmediatePropagation=()=>{n.call(t),t._stopped=!0},e.map(s=>r=>!r._stopped&&s&&s(r))}else return e}const pd=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&t.charCodeAt(2)>96&&t.charCodeAt(2)<123,Jb=(t,e,n,s,r,i)=>{const o=r==="svg";e==="class"?Ub(t,s,o):e==="style"?jb(t,n,s):Ta(e)?Vu(e)||Kb(t,e,n,s,i):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):Xb(t,e,s,o))?(hd(t,e,s),!t.tagName.includes("-")&&(e==="value"||e==="checked"||e==="selected")&&cd(t,e,s,o,i,e!=="value")):t._isVueCE&&(/[A-Z]/.test(e)||!nt(s))?hd(t,tn(e),s,i,e):(e==="true-value"?t._trueValue=s:e==="false-value"&&(t._falseValue=s),cd(t,e,s,o))};function Xb(t,e,n,s){if(s)return!!(e==="innerHTML"||e==="textContent"||e in t&&pd(e)&&be(n));if(e==="spellcheck"||e==="draggable"||e==="translate"||e==="autocorrect"||e==="form"||e==="list"&&t.tagName==="INPUT"||e==="type"&&t.tagName==="TEXTAREA")return!1;if(e==="width"||e==="height"){const r=t.tagName;if(r==="IMG"||r==="VIDEO"||r==="CANVAS"||r==="SOURCE")return!1}return pd(e)&&nt(n)?!1:e in t}const Es=t=>{const e=t.props["onUpdate:modelValue"]||!1;return pe(e)?n=>xo(e,n):e};function Zb(t){t.target.composing=!0}function md(t){const e=t.target;e.composing&&(e.composing=!1,e.dispatchEvent(new Event("input")))}const Zt=Symbol("_assign"),fe={created(t,{modifiers:{lazy:e,trim:n,number:s}},r){t[Zt]=Es(r);const i=s||r.props&&r.props.type==="number";Ln(t,e?"change":"input",o=>{if(o.target.composing)return;let l=t.value;n&&(l=l.trim()),i&&(l=zo(l)),t[Zt](l)}),n&&Ln(t,"change",()=>{t.value=t.value.trim()}),e||(Ln(t,"compositionstart",Zb),Ln(t,"compositionend",md),Ln(t,"change",md))},mounted(t,{value:e}){t.value=e??""},beforeUpdate(t,{value:e,oldValue:n,modifiers:{lazy:s,trim:r,number:i}},o){if(t[Zt]=Es(o),t.composing)return;const l=(i||t.type==="number")&&!/^0\d/.test(t.value)?zo(t.value):t.value,u=e??"";l!==u&&(document.activeElement===t&&t.type!=="range"&&(s&&e===n||r&&t.value.trim()===u)||(t.value=u))}},Tr={deep:!0,created(t,e,n){t[Zt]=Es(n),Ln(t,"change",()=>{const s=t._modelValue,r=Ir(t),i=t.checked,o=t[Zt];if(pe(s)){const l=Ou(s,r),u=l!==-1;if(i&&!u)o(s.concat(r));else if(!i&&u){const c=[...s];c.splice(l,1),o(c)}}else if(Or(s)){const l=new Set(s);i?l.add(r):l.delete(r),o(l)}else o(Em(t,i))})},mounted:gd,beforeUpdate(t,e,n){t[Zt]=Es(n),gd(t,e,n)}};function gd(t,{value:e,oldValue:n},s){t._modelValue=e;let r;if(pe(e))r=Ou(e,s.props.value)>-1;else if(Or(e))r=e.has(s.props.value);else{if(e===n)return;r=js(e,Em(t,!0))}t.checked!==r&&(t.checked=r)}const eE={created(t,{value:e},n){t.checked=js(e,n.props.value),t[Zt]=Es(n),Ln(t,"change",()=>{t[Zt](Ir(t))})},beforeUpdate(t,{value:e,oldValue:n},s){t[Zt]=Es(s),e!==n&&(t.checked=js(e,s.props.value))}},cn={deep:!0,created(t,{value:e,modifiers:{number:n}},s){const r=Or(e);Ln(t,"change",()=>{const i=Array.prototype.filter.call(t.options,o=>o.selected).map(o=>n?zo(Ir(o)):Ir(o));t[Zt](t.multiple?r?new Set(i):i:i[0]),t._assigning=!0,qu(()=>{t._assigning=!1})}),t[Zt]=Es(s)},mounted(t,{value:e}){_d(t,e)},beforeUpdate(t,e,n){t[Zt]=Es(n)},updated(t,{value:e}){t._assigning||_d(t,e)}};function _d(t,e){const n=t.multiple,s=pe(e);if(!(n&&!s&&!Or(e))){for(let r=0,i=t.options.length;r<i;r++){const o=t.options[r],l=Ir(o);if(n)if(s){const u=typeof l;u==="string"||u==="number"?o.selected=e.some(c=>String(c)===String(l)):o.selected=Ou(e,l)>-1}else o.selected=e.has(l);else if(js(Ir(o),e)){t.selectedIndex!==r&&(t.selectedIndex=r);return}}!n&&t.selectedIndex!==-1&&(t.selectedIndex=-1)}}function Ir(t){return"_value"in t?t._value:t.value}function Em(t,e){const n=e?"_trueValue":"_falseValue";return n in t?t[n]:e}const tE={created(t,e,n){Io(t,e,n,null,"created")},mounted(t,e,n){Io(t,e,n,null,"mounted")},beforeUpdate(t,e,n,s){Io(t,e,n,s,"beforeUpdate")},updated(t,e,n,s){Io(t,e,n,s,"updated")}};function nE(t,e){switch(t){case"SELECT":return cn;case"TEXTAREA":return fe;default:switch(e){case"checkbox":return Tr;case"radio":return eE;default:return fe}}}function Io(t,e,n,s,r){const o=nE(t.tagName,n.props&&n.props.type)[r];o&&o(t,e,n,s)}const sE=["ctrl","shift","alt","meta"],rE={stop:t=>t.stopPropagation(),prevent:t=>t.preventDefault(),self:t=>t.target!==t.currentTarget,ctrl:t=>!t.ctrlKey,shift:t=>!t.shiftKey,alt:t=>!t.altKey,meta:t=>!t.metaKey,left:t=>"button"in t&&t.button!==0,middle:t=>"button"in t&&t.button!==1,right:t=>"button"in t&&t.button!==2,exact:(t,e)=>sE.some(n=>t[`${n}Key`]&&!e.includes(n))},st=(t,e)=>{const n=t._withMods||(t._withMods={}),s=e.join(".");return n[s]||(n[s]=(r,...i)=>{for(let o=0;o<e.length;o++){const l=rE[e[o]];if(l&&l(r,e))return}return t(r,...i)})},iE=Ct({patchProp:Jb},Mb);let yd;function oE(){return yd||(yd=ib(iE))}const aE=(...t)=>{const e=oE().createApp(...t),{mount:n}=e;return e.mount=s=>{const r=uE(s);if(!r)return;const i=e._component;!be(i)&&!i.render&&!i.template&&(i.template=r.innerHTML),r.nodeType===1&&(r.textContent="");const o=n(r,!1,lE(r));return r instanceof Element&&(r.removeAttribute("v-cloak"),r.setAttribute("data-v-app","")),o},e};function lE(t){if(t instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&t instanceof MathMLElement)return"mathml"}function uE(t){return nt(t)?document.querySelector(t):t}/*!
  * vue-router v4.5.1
  * (c) 2025 Eduardo San Martin Morote
  * @license MIT
  */const or=typeof document<"u";function wm(t){return typeof t=="object"||"displayName"in t||"props"in t||"__vccOpts"in t}function cE(t){return t.__esModule||t[Symbol.toStringTag]==="Module"||t.default&&wm(t.default)}const De=Object.assign;function Dl(t,e){const n={};for(const s in e){const r=e[s];n[s]=dn(r)?r.map(t):t(r)}return n}const yi=()=>{},dn=Array.isArray,Tm=/#/g,hE=/&/g,dE=/\//g,fE=/=/g,pE=/\?/g,Im=/\+/g,mE=/%5B/g,gE=/%5D/g,Am=/%5E/g,_E=/%60/g,Rm=/%7B/g,yE=/%7C/g,Sm=/%7D/g,vE=/%20/g;function Ju(t){return encodeURI(""+t).replace(yE,"|").replace(mE,"[").replace(gE,"]")}function bE(t){return Ju(t).replace(Rm,"{").replace(Sm,"}").replace(Am,"^")}function su(t){return Ju(t).replace(Im,"%2B").replace(vE,"+").replace(Tm,"%23").replace(hE,"%26").replace(_E,"`").replace(Rm,"{").replace(Sm,"}").replace(Am,"^")}function EE(t){return su(t).replace(fE,"%3D")}function wE(t){return Ju(t).replace(Tm,"%23").replace(pE,"%3F")}function TE(t){return t==null?"":wE(t).replace(dE,"%2F")}function xi(t){try{return decodeURIComponent(""+t)}catch{}return""+t}const IE=/\/$/,AE=t=>t.replace(IE,"");function Nl(t,e,n="/"){let s,r={},i="",o="";const l=e.indexOf("#");let u=e.indexOf("?");return l<u&&l>=0&&(u=-1),u>-1&&(s=e.slice(0,u),i=e.slice(u+1,l>-1?l:e.length),r=t(i)),l>-1&&(s=s||e.slice(0,l),o=e.slice(l,e.length)),s=PE(s??e,n),{fullPath:s+(i&&"?")+i+o,path:s,query:r,hash:xi(o)}}function RE(t,e){const n=e.query?t(e.query):"";return e.path+(n&&"?")+n+(e.hash||"")}function vd(t,e){return!e||!t.toLowerCase().startsWith(e.toLowerCase())?t:t.slice(e.length)||"/"}function SE(t,e,n){const s=e.matched.length-1,r=n.matched.length-1;return s>-1&&s===r&&Ar(e.matched[s],n.matched[r])&&Cm(e.params,n.params)&&t(e.query)===t(n.query)&&e.hash===n.hash}function Ar(t,e){return(t.aliasOf||t)===(e.aliasOf||e)}function Cm(t,e){if(Object.keys(t).length!==Object.keys(e).length)return!1;for(const n in t)if(!CE(t[n],e[n]))return!1;return!0}function CE(t,e){return dn(t)?bd(t,e):dn(e)?bd(e,t):t===e}function bd(t,e){return dn(e)?t.length===e.length&&t.every((n,s)=>n===e[s]):t.length===1&&t[0]===e}function PE(t,e){if(t.startsWith("/"))return t;if(!t)return e;const n=e.split("/"),s=t.split("/"),r=s[s.length-1];(r===".."||r===".")&&s.push("");let i=n.length-1,o,l;for(o=0;o<s.length;o++)if(l=s[o],l!==".")if(l==="..")i>1&&i--;else break;return n.slice(0,i).join("/")+"/"+s.slice(o).join("/")}const ss={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0};var Vi;(function(t){t.pop="pop",t.push="push"})(Vi||(Vi={}));var vi;(function(t){t.back="back",t.forward="forward",t.unknown=""})(vi||(vi={}));function kE(t){if(!t)if(or){const e=document.querySelector("base");t=e&&e.getAttribute("href")||"/",t=t.replace(/^\w+:\/\/[^\/]+/,"")}else t="/";return t[0]!=="/"&&t[0]!=="#"&&(t="/"+t),AE(t)}const xE=/^[^#]+#/;function VE(t,e){return t.replace(xE,"#")+e}function DE(t,e){const n=document.documentElement.getBoundingClientRect(),s=t.getBoundingClientRect();return{behavior:e.behavior,left:s.left-n.left-(e.left||0),top:s.top-n.top-(e.top||0)}}const Oa=()=>({left:window.scrollX,top:window.scrollY});function NE(t){let e;if("el"in t){const n=t.el,s=typeof n=="string"&&n.startsWith("#"),r=typeof n=="string"?s?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!r)return;e=DE(r,t)}else e=t;"scrollBehavior"in document.documentElement.style?window.scrollTo(e):window.scrollTo(e.left!=null?e.left:window.scrollX,e.top!=null?e.top:window.scrollY)}function Ed(t,e){return(history.state?history.state.position-e:-1)+t}const ru=new Map;function OE(t,e){ru.set(t,e)}function ME(t){const e=ru.get(t);return ru.delete(t),e}let LE=()=>location.protocol+"//"+location.host;function Pm(t,e){const{pathname:n,search:s,hash:r}=e,i=t.indexOf("#");if(i>-1){let l=r.includes(t.slice(i))?t.slice(i).length:1,u=r.slice(l);return u[0]!=="/"&&(u="/"+u),vd(u,"")}return vd(n,t)+s+r}function UE(t,e,n,s){let r=[],i=[],o=null;const l=({state:g})=>{const _=Pm(t,location),b=n.value,y=e.value;let E=0;if(g){if(n.value=_,e.value=g,o&&o===b){o=null;return}E=y?g.position-y.position:0}else s(_);r.forEach(k=>{k(n.value,b,{delta:E,type:Vi.pop,direction:E?E>0?vi.forward:vi.back:vi.unknown})})};function u(){o=n.value}function c(g){r.push(g);const _=()=>{const b=r.indexOf(g);b>-1&&r.splice(b,1)};return i.push(_),_}function f(){const{history:g}=window;g.state&&g.replaceState(De({},g.state,{scroll:Oa()}),"")}function p(){for(const g of i)g();i=[],window.removeEventListener("popstate",l),window.removeEventListener("beforeunload",f)}return window.addEventListener("popstate",l),window.addEventListener("beforeunload",f,{passive:!0}),{pauseListeners:u,listen:c,destroy:p}}function wd(t,e,n,s=!1,r=!1){return{back:t,current:e,forward:n,replaced:s,position:window.history.length,scroll:r?Oa():null}}function FE(t){const{history:e,location:n}=window,s={value:Pm(t,n)},r={value:e.state};r.value||i(s.value,{back:null,current:s.value,forward:null,position:e.length-1,replaced:!0,scroll:null},!0);function i(u,c,f){const p=t.indexOf("#"),g=p>-1?(n.host&&document.querySelector("base")?t:t.slice(p))+u:LE()+t+u;try{e[f?"replaceState":"pushState"](c,"",g),r.value=c}catch(_){console.error(_),n[f?"replace":"assign"](g)}}function o(u,c){const f=De({},e.state,wd(r.value.back,u,r.value.forward,!0),c,{position:r.value.position});i(u,f,!0),s.value=u}function l(u,c){const f=De({},r.value,e.state,{forward:u,scroll:Oa()});i(f.current,f,!0);const p=De({},wd(s.value,u,null),{position:f.position+1},c);i(u,p,!1),s.value=u}return{location:s,state:r,push:l,replace:o}}function $E(t){t=kE(t);const e=FE(t),n=UE(t,e.state,e.location,e.replace);function s(i,o=!0){o||n.pauseListeners(),history.go(i)}const r=De({location:"",base:t,go:s,createHref:VE.bind(null,t)},e,n);return Object.defineProperty(r,"location",{enumerable:!0,get:()=>e.location.value}),Object.defineProperty(r,"state",{enumerable:!0,get:()=>e.state.value}),r}function BE(t){return typeof t=="string"||t&&typeof t=="object"}function km(t){return typeof t=="string"||typeof t=="symbol"}const xm=Symbol("");var Td;(function(t){t[t.aborted=4]="aborted",t[t.cancelled=8]="cancelled",t[t.duplicated=16]="duplicated"})(Td||(Td={}));function Rr(t,e){return De(new Error,{type:t,[xm]:!0},e)}function Dn(t,e){return t instanceof Error&&xm in t&&(e==null||!!(t.type&e))}const Id="[^/]+?",jE={sensitive:!1,strict:!1,start:!0,end:!0},qE=/[.+*?^${}()[\]/\\]/g;function HE(t,e){const n=De({},jE,e),s=[];let r=n.start?"^":"";const i=[];for(const c of t){const f=c.length?[]:[90];n.strict&&!c.length&&(r+="/");for(let p=0;p<c.length;p++){const g=c[p];let _=40+(n.sensitive?.25:0);if(g.type===0)p||(r+="/"),r+=g.value.replace(qE,"\\$&"),_+=40;else if(g.type===1){const{value:b,repeatable:y,optional:E,regexp:k}=g;i.push({name:b,repeatable:y,optional:E});const C=k||Id;if(C!==Id){_+=10;try{new RegExp(`(${C})`)}catch(M){throw new Error(`Invalid custom RegExp for param "${b}" (${C}): `+M.message)}}let x=y?`((?:${C})(?:/(?:${C}))*)`:`(${C})`;p||(x=E&&c.length<2?`(?:/${x})`:"/"+x),E&&(x+="?"),r+=x,_+=20,E&&(_+=-8),y&&(_+=-20),C===".*"&&(_+=-50)}f.push(_)}s.push(f)}if(n.strict&&n.end){const c=s.length-1;s[c][s[c].length-1]+=.7000000000000001}n.strict||(r+="/?"),n.end?r+="$":n.strict&&!r.endsWith("/")&&(r+="(?:/|$)");const o=new RegExp(r,n.sensitive?"":"i");function l(c){const f=c.match(o),p={};if(!f)return null;for(let g=1;g<f.length;g++){const _=f[g]||"",b=i[g-1];p[b.name]=_&&b.repeatable?_.split("/"):_}return p}function u(c){let f="",p=!1;for(const g of t){(!p||!f.endsWith("/"))&&(f+="/"),p=!1;for(const _ of g)if(_.type===0)f+=_.value;else if(_.type===1){const{value:b,repeatable:y,optional:E}=_,k=b in c?c[b]:"";if(dn(k)&&!y)throw new Error(`Provided param "${b}" is an array but it is not repeatable (* or + modifiers)`);const C=dn(k)?k.join("/"):k;if(!C)if(E)g.length<2&&(f.endsWith("/")?f=f.slice(0,-1):p=!0);else throw new Error(`Missing required param "${b}"`);f+=C}}return f||"/"}return{re:o,score:s,keys:i,parse:l,stringify:u}}function KE(t,e){let n=0;for(;n<t.length&&n<e.length;){const s=e[n]-t[n];if(s)return s;n++}return t.length<e.length?t.length===1&&t[0]===80?-1:1:t.length>e.length?e.length===1&&e[0]===80?1:-1:0}function Vm(t,e){let n=0;const s=t.score,r=e.score;for(;n<s.length&&n<r.length;){const i=KE(s[n],r[n]);if(i)return i;n++}if(Math.abs(r.length-s.length)===1){if(Ad(s))return 1;if(Ad(r))return-1}return r.length-s.length}function Ad(t){const e=t[t.length-1];return t.length>0&&e[e.length-1]<0}const zE={type:0,value:""},GE=/[a-zA-Z0-9_]/;function WE(t){if(!t)return[[]];if(t==="/")return[[zE]];if(!t.startsWith("/"))throw new Error(`Invalid path "${t}"`);function e(_){throw new Error(`ERR (${n})/"${c}": ${_}`)}let n=0,s=n;const r=[];let i;function o(){i&&r.push(i),i=[]}let l=0,u,c="",f="";function p(){c&&(n===0?i.push({type:0,value:c}):n===1||n===2||n===3?(i.length>1&&(u==="*"||u==="+")&&e(`A repeatable param (${c}) must be alone in its segment. eg: '/:ids+.`),i.push({type:1,value:c,regexp:f,repeatable:u==="*"||u==="+",optional:u==="*"||u==="?"})):e("Invalid state to consume buffer"),c="")}function g(){c+=u}for(;l<t.length;){if(u=t[l++],u==="\\"&&n!==2){s=n,n=4;continue}switch(n){case 0:u==="/"?(c&&p(),o()):u===":"?(p(),n=1):g();break;case 4:g(),n=s;break;case 1:u==="("?n=2:GE.test(u)?g():(p(),n=0,u!=="*"&&u!=="?"&&u!=="+"&&l--);break;case 2:u===")"?f[f.length-1]=="\\"?f=f.slice(0,-1)+u:n=3:f+=u;break;case 3:p(),n=0,u!=="*"&&u!=="?"&&u!=="+"&&l--,f="";break;default:e("Unknown state");break}}return n===2&&e(`Unfinished custom RegExp for param "${c}"`),p(),o(),r}function QE(t,e,n){const s=HE(WE(t.path),n),r=De(s,{record:t,parent:e,children:[],alias:[]});return e&&!r.record.aliasOf==!e.record.aliasOf&&e.children.push(r),r}function YE(t,e){const n=[],s=new Map;e=Pd({strict:!1,end:!0,sensitive:!1},e);function r(p){return s.get(p)}function i(p,g,_){const b=!_,y=Sd(p);y.aliasOf=_&&_.record;const E=Pd(e,p),k=[y];if("alias"in p){const M=typeof p.alias=="string"?[p.alias]:p.alias;for(const W of M)k.push(Sd(De({},y,{components:_?_.record.components:y.components,path:W,aliasOf:_?_.record:y})))}let C,x;for(const M of k){const{path:W}=M;if(g&&W[0]!=="/"){const le=g.record.path,S=le[le.length-1]==="/"?"":"/";M.path=g.record.path+(W&&S+W)}if(C=QE(M,g,E),_?_.alias.push(C):(x=x||C,x!==C&&x.alias.push(C),b&&p.name&&!Cd(C)&&o(p.name)),Dm(C)&&u(C),y.children){const le=y.children;for(let S=0;S<le.length;S++)i(le[S],C,_&&_.children[S])}_=_||C}return x?()=>{o(x)}:yi}function o(p){if(km(p)){const g=s.get(p);g&&(s.delete(p),n.splice(n.indexOf(g),1),g.children.forEach(o),g.alias.forEach(o))}else{const g=n.indexOf(p);g>-1&&(n.splice(g,1),p.record.name&&s.delete(p.record.name),p.children.forEach(o),p.alias.forEach(o))}}function l(){return n}function u(p){const g=ZE(p,n);n.splice(g,0,p),p.record.name&&!Cd(p)&&s.set(p.record.name,p)}function c(p,g){let _,b={},y,E;if("name"in p&&p.name){if(_=s.get(p.name),!_)throw Rr(1,{location:p});E=_.record.name,b=De(Rd(g.params,_.keys.filter(x=>!x.optional).concat(_.parent?_.parent.keys.filter(x=>x.optional):[]).map(x=>x.name)),p.params&&Rd(p.params,_.keys.map(x=>x.name))),y=_.stringify(b)}else if(p.path!=null)y=p.path,_=n.find(x=>x.re.test(y)),_&&(b=_.parse(y),E=_.record.name);else{if(_=g.name?s.get(g.name):n.find(x=>x.re.test(g.path)),!_)throw Rr(1,{location:p,currentLocation:g});E=_.record.name,b=De({},g.params,p.params),y=_.stringify(b)}const k=[];let C=_;for(;C;)k.unshift(C.record),C=C.parent;return{name:E,path:y,params:b,matched:k,meta:XE(k)}}t.forEach(p=>i(p));function f(){n.length=0,s.clear()}return{addRoute:i,resolve:c,removeRoute:o,clearRoutes:f,getRoutes:l,getRecordMatcher:r}}function Rd(t,e){const n={};for(const s of e)s in t&&(n[s]=t[s]);return n}function Sd(t){const e={path:t.path,redirect:t.redirect,name:t.name,meta:t.meta||{},aliasOf:t.aliasOf,beforeEnter:t.beforeEnter,props:JE(t),children:t.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in t?t.components||null:t.component&&{default:t.component}};return Object.defineProperty(e,"mods",{value:{}}),e}function JE(t){const e={},n=t.props||!1;if("component"in t)e.default=n;else for(const s in t.components)e[s]=typeof n=="object"?n[s]:n;return e}function Cd(t){for(;t;){if(t.record.aliasOf)return!0;t=t.parent}return!1}function XE(t){return t.reduce((e,n)=>De(e,n.meta),{})}function Pd(t,e){const n={};for(const s in t)n[s]=s in e?e[s]:t[s];return n}function ZE(t,e){let n=0,s=e.length;for(;n!==s;){const i=n+s>>1;Vm(t,e[i])<0?s=i:n=i+1}const r=ew(t);return r&&(s=e.lastIndexOf(r,s-1)),s}function ew(t){let e=t;for(;e=e.parent;)if(Dm(e)&&Vm(t,e)===0)return e}function Dm({record:t}){return!!(t.name||t.components&&Object.keys(t.components).length||t.redirect)}function tw(t){const e={};if(t===""||t==="?")return e;const s=(t[0]==="?"?t.slice(1):t).split("&");for(let r=0;r<s.length;++r){const i=s[r].replace(Im," "),o=i.indexOf("="),l=xi(o<0?i:i.slice(0,o)),u=o<0?null:xi(i.slice(o+1));if(l in e){let c=e[l];dn(c)||(c=e[l]=[c]),c.push(u)}else e[l]=u}return e}function kd(t){let e="";for(let n in t){const s=t[n];if(n=EE(n),s==null){s!==void 0&&(e+=(e.length?"&":"")+n);continue}(dn(s)?s.map(i=>i&&su(i)):[s&&su(s)]).forEach(i=>{i!==void 0&&(e+=(e.length?"&":"")+n,i!=null&&(e+="="+i))})}return e}function nw(t){const e={};for(const n in t){const s=t[n];s!==void 0&&(e[n]=dn(s)?s.map(r=>r==null?null:""+r):s==null?s:""+s)}return e}const sw=Symbol(""),xd=Symbol(""),Ma=Symbol(""),Xu=Symbol(""),iu=Symbol("");function ri(){let t=[];function e(s){return t.push(s),()=>{const r=t.indexOf(s);r>-1&&t.splice(r,1)}}function n(){t=[]}return{add:e,list:()=>t.slice(),reset:n}}function as(t,e,n,s,r,i=o=>o()){const o=s&&(s.enterCallbacks[r]=s.enterCallbacks[r]||[]);return()=>new Promise((l,u)=>{const c=g=>{g===!1?u(Rr(4,{from:n,to:e})):g instanceof Error?u(g):BE(g)?u(Rr(2,{from:e,to:g})):(o&&s.enterCallbacks[r]===o&&typeof g=="function"&&o.push(g),l())},f=i(()=>t.call(s&&s.instances[r],e,n,c));let p=Promise.resolve(f);t.length<3&&(p=p.then(c)),p.catch(g=>u(g))})}function Ol(t,e,n,s,r=i=>i()){const i=[];for(const o of t)for(const l in o.components){let u=o.components[l];if(!(e!=="beforeRouteEnter"&&!o.instances[l]))if(wm(u)){const f=(u.__vccOpts||u)[e];f&&i.push(as(f,n,s,o,l,r))}else{let c=u();i.push(()=>c.then(f=>{if(!f)throw new Error(`Couldn't resolve component "${l}" at "${o.path}"`);const p=cE(f)?f.default:f;o.mods[l]=f,o.components[l]=p;const _=(p.__vccOpts||p)[e];return _&&as(_,n,s,o,l,r)()}))}}return i}function Vd(t){const e=un(Ma),n=un(Xu),s=We(()=>{const u=ln(t.to);return e.resolve(u)}),r=We(()=>{const{matched:u}=s.value,{length:c}=u,f=u[c-1],p=n.matched;if(!f||!p.length)return-1;const g=p.findIndex(Ar.bind(null,f));if(g>-1)return g;const _=Dd(u[c-2]);return c>1&&Dd(f)===_&&p[p.length-1].path!==_?p.findIndex(Ar.bind(null,u[c-2])):g}),i=We(()=>r.value>-1&&lw(n.params,s.value.params)),o=We(()=>r.value>-1&&r.value===n.matched.length-1&&Cm(n.params,s.value.params));function l(u={}){if(aw(u)){const c=e[ln(t.replace)?"replace":"push"](ln(t.to)).catch(yi);return t.viewTransition&&typeof document<"u"&&"startViewTransition"in document&&document.startViewTransition(()=>c),c}return Promise.resolve()}return{route:s,href:We(()=>s.value.href),isActive:i,isExactActive:o,navigate:l}}function rw(t){return t.length===1?t[0]:t}const iw=Hp({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"},viewTransition:Boolean},useLink:Vd,setup(t,{slots:e}){const n=Pa(Vd(t)),{options:s}=un(Ma),r=We(()=>({[Nd(t.activeClass,s.linkActiveClass,"router-link-active")]:n.isActive,[Nd(t.exactActiveClass,s.linkExactActiveClass,"router-link-exact-active")]:n.isExactActive}));return()=>{const i=e.default&&rw(e.default(n));return t.custom?i:vm("a",{"aria-current":n.isExactActive?t.ariaCurrentValue:null,href:n.href,onClick:n.navigate,class:r.value},i)}}}),ow=iw;function aw(t){if(!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)&&!t.defaultPrevented&&!(t.button!==void 0&&t.button!==0)){if(t.currentTarget&&t.currentTarget.getAttribute){const e=t.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(e))return}return t.preventDefault&&t.preventDefault(),!0}}function lw(t,e){for(const n in e){const s=e[n],r=t[n];if(typeof s=="string"){if(s!==r)return!1}else if(!dn(r)||r.length!==s.length||s.some((i,o)=>i!==r[o]))return!1}return!0}function Dd(t){return t?t.aliasOf?t.aliasOf.path:t.path:""}const Nd=(t,e,n)=>t??e??n,uw=Hp({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(t,{attrs:e,slots:n}){const s=un(iu),r=We(()=>t.route||s.value),i=un(xd,0),o=We(()=>{let c=ln(i);const{matched:f}=r.value;let p;for(;(p=f[c])&&!p.components;)c++;return c}),l=We(()=>r.value.matched[o.value]);Vo(xd,We(()=>o.value+1)),Vo(sw,l),Vo(iu,r);const u=G();return _r(()=>[u.value,l.value,t.name],([c,f,p],[g,_,b])=>{f&&(f.instances[p]=c,_&&_!==f&&c&&c===g&&(f.leaveGuards.size||(f.leaveGuards=_.leaveGuards),f.updateGuards.size||(f.updateGuards=_.updateGuards))),c&&f&&(!_||!Ar(f,_)||!g)&&(f.enterCallbacks[p]||[]).forEach(y=>y(c))},{flush:"post"}),()=>{const c=r.value,f=t.name,p=l.value,g=p&&p.components[f];if(!g)return Od(n.default,{Component:g,route:c});const _=p.props[f],b=_?_===!0?c.params:typeof _=="function"?_(c):_:null,E=vm(g,De({},b,e,{onVnodeUnmounted:k=>{k.component.isUnmounted&&(p.instances[f]=null)},ref:u}));return Od(n.default,{Component:E,route:c})||E}}});function Od(t,e){if(!t)return null;const n=t(e);return n.length===1?n[0]:n}const cw=uw;function hw(t){const e=YE(t.routes,t),n=t.parseQuery||tw,s=t.stringifyQuery||kd,r=t.history,i=ri(),o=ri(),l=ri(),u=bv(ss);let c=ss;or&&t.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const f=Dl.bind(null,U=>""+U),p=Dl.bind(null,TE),g=Dl.bind(null,xi);function _(U,ne){let te,oe;return km(U)?(te=e.getRecordMatcher(U),oe=ne):oe=U,e.addRoute(oe,te)}function b(U){const ne=e.getRecordMatcher(U);ne&&e.removeRoute(ne)}function y(){return e.getRoutes().map(U=>U.record)}function E(U){return!!e.getRecordMatcher(U)}function k(U,ne){if(ne=De({},ne||u.value),typeof U=="string"){const D=Nl(n,U,ne.path),F=e.resolve({path:D.path},ne),q=r.createHref(D.fullPath);return De(D,F,{params:g(F.params),hash:xi(D.hash),redirectedFrom:void 0,href:q})}let te;if(U.path!=null)te=De({},U,{path:Nl(n,U.path,ne.path).path});else{const D=De({},U.params);for(const F in D)D[F]==null&&delete D[F];te=De({},U,{params:p(D)}),ne.params=p(ne.params)}const oe=e.resolve(te,ne),ke=U.hash||"";oe.params=f(g(oe.params));const T=RE(s,De({},U,{hash:bE(ke),path:oe.path})),A=r.createHref(T);return De({fullPath:T,hash:ke,query:s===kd?nw(U.query):U.query||{}},oe,{redirectedFrom:void 0,href:A})}function C(U){return typeof U=="string"?Nl(n,U,u.value.path):De({},U)}function x(U,ne){if(c!==U)return Rr(8,{from:ne,to:U})}function M(U){return S(U)}function W(U){return M(De(C(U),{replace:!0}))}function le(U){const ne=U.matched[U.matched.length-1];if(ne&&ne.redirect){const{redirect:te}=ne;let oe=typeof te=="function"?te(U):te;return typeof oe=="string"&&(oe=oe.includes("?")||oe.includes("#")?oe=C(oe):{path:oe},oe.params={}),De({query:U.query,hash:U.hash,params:oe.path!=null?{}:U.params},oe)}}function S(U,ne){const te=c=k(U),oe=u.value,ke=U.state,T=U.force,A=U.replace===!0,D=le(te);if(D)return S(De(C(D),{state:typeof D=="object"?De({},ke,D.state):ke,force:T,replace:A}),ne||te);const F=te;F.redirectedFrom=ne;let q;return!T&&SE(s,oe,te)&&(q=Rr(16,{to:F,from:oe}),Gt(oe,oe,!0,!1)),(q?Promise.resolve(q):P(F,oe)).catch($=>Dn($)?Dn($,2)?$:nn($):Te($,F,oe)).then($=>{if($){if(Dn($,2))return S(De({replace:A},C($.to),{state:typeof $.to=="object"?De({},ke,$.to.state):ke,force:T}),ne||F)}else $=N(F,oe,!0,A,ke);return V(F,oe,$),$})}function w(U,ne){const te=x(U,ne);return te?Promise.reject(te):Promise.resolve()}function I(U){const ne=Xn.values().next().value;return ne&&typeof ne.runWithContext=="function"?ne.runWithContext(U):U()}function P(U,ne){let te;const[oe,ke,T]=dw(U,ne);te=Ol(oe.reverse(),"beforeRouteLeave",U,ne);for(const D of oe)D.leaveGuards.forEach(F=>{te.push(as(F,U,ne))});const A=w.bind(null,U,ne);return te.push(A),Ot(te).then(()=>{te=[];for(const D of i.list())te.push(as(D,U,ne));return te.push(A),Ot(te)}).then(()=>{te=Ol(ke,"beforeRouteUpdate",U,ne);for(const D of ke)D.updateGuards.forEach(F=>{te.push(as(F,U,ne))});return te.push(A),Ot(te)}).then(()=>{te=[];for(const D of T)if(D.beforeEnter)if(dn(D.beforeEnter))for(const F of D.beforeEnter)te.push(as(F,U,ne));else te.push(as(D.beforeEnter,U,ne));return te.push(A),Ot(te)}).then(()=>(U.matched.forEach(D=>D.enterCallbacks={}),te=Ol(T,"beforeRouteEnter",U,ne,I),te.push(A),Ot(te))).then(()=>{te=[];for(const D of o.list())te.push(as(D,U,ne));return te.push(A),Ot(te)}).catch(D=>Dn(D,8)?D:Promise.reject(D))}function V(U,ne,te){l.list().forEach(oe=>I(()=>oe(U,ne,te)))}function N(U,ne,te,oe,ke){const T=x(U,ne);if(T)return T;const A=ne===ss,D=or?history.state:{};te&&(oe||A?r.replace(U.fullPath,De({scroll:A&&D&&D.scroll},ke)):r.push(U.fullPath,ke)),u.value=U,Gt(U,ne,te,A),nn()}let R;function kt(){R||(R=r.listen((U,ne,te)=>{if(!gn.listening)return;const oe=k(U),ke=le(oe);if(ke){S(De(ke,{replace:!0,force:!0}),oe).catch(yi);return}c=oe;const T=u.value;or&&OE(Ed(T.fullPath,te.delta),Oa()),P(oe,T).catch(A=>Dn(A,12)?A:Dn(A,2)?(S(De(C(A.to),{force:!0}),oe).then(D=>{Dn(D,20)&&!te.delta&&te.type===Vi.pop&&r.go(-1,!1)}).catch(yi),Promise.reject()):(te.delta&&r.go(-te.delta,!1),Te(A,oe,T))).then(A=>{A=A||N(oe,T,!1),A&&(te.delta&&!Dn(A,8)?r.go(-te.delta,!1):te.type===Vi.pop&&Dn(A,20)&&r.go(-1,!1)),V(oe,T,A)}).catch(yi)}))}let zt=ri(),Je=ri(),Se;function Te(U,ne,te){nn(U);const oe=Je.list();return oe.length?oe.forEach(ke=>ke(U,ne,te)):console.error(U),Promise.reject(U)}function $t(){return Se&&u.value!==ss?Promise.resolve():new Promise((U,ne)=>{zt.add([U,ne])})}function nn(U){return Se||(Se=!U,kt(),zt.list().forEach(([ne,te])=>U?te(U):ne()),zt.reset()),U}function Gt(U,ne,te,oe){const{scrollBehavior:ke}=t;if(!or||!ke)return Promise.resolve();const T=!te&&ME(Ed(U.fullPath,0))||(oe||!te)&&history.state&&history.state.scroll||null;return qu().then(()=>ke(U,ne,T)).then(A=>A&&NE(A)).catch(A=>Te(A,U,ne))}const He=U=>r.go(U);let Ke;const Xn=new Set,gn={currentRoute:u,listening:!0,addRoute:_,removeRoute:b,clearRoutes:e.clearRoutes,hasRoute:E,getRoutes:y,resolve:k,options:t,push:M,replace:W,go:He,back:()=>He(-1),forward:()=>He(1),beforeEach:i.add,beforeResolve:o.add,afterEach:l.add,onError:Je.add,isReady:$t,install(U){const ne=this;U.component("RouterLink",ow),U.component("RouterView",cw),U.config.globalProperties.$router=ne,Object.defineProperty(U.config.globalProperties,"$route",{enumerable:!0,get:()=>ln(u)}),or&&!Ke&&u.value===ss&&(Ke=!0,M(r.location).catch(ke=>{}));const te={};for(const ke in ss)Object.defineProperty(te,ke,{get:()=>u.value[ke],enumerable:!0});U.provide(Ma,ne),U.provide(Xu,Op(te)),U.provide(iu,u);const oe=U.unmount;Xn.add(U),U.unmount=function(){Xn.delete(U),Xn.size<1&&(c=ss,R&&R(),R=null,u.value=ss,Ke=!1,Se=!1),oe()}}};function Ot(U){return U.reduce((ne,te)=>ne.then(()=>I(te)),Promise.resolve())}return gn}function dw(t,e){const n=[],s=[],r=[],i=Math.max(e.matched.length,t.matched.length);for(let o=0;o<i;o++){const l=e.matched[o];l&&(t.matched.find(c=>Ar(c,l))?s.push(l):n.push(l));const u=t.matched[o];u&&(e.matched.find(c=>Ar(c,u))||r.push(u))}return[n,s,r]}function Nm(){return un(Ma)}function Om(t){return un(Xu)}const fw=()=>{};var Md={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mm=function(t){const e=[];let n=0;for(let s=0;s<t.length;s++){let r=t.charCodeAt(s);r<128?e[n++]=r:r<2048?(e[n++]=r>>6|192,e[n++]=r&63|128):(r&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=r>>18|240,e[n++]=r>>12&63|128,e[n++]=r>>6&63|128,e[n++]=r&63|128):(e[n++]=r>>12|224,e[n++]=r>>6&63|128,e[n++]=r&63|128)}return e},pw=function(t){const e=[];let n=0,s=0;for(;n<t.length;){const r=t[n++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const i=t[n++];e[s++]=String.fromCharCode((r&31)<<6|i&63)}else if(r>239&&r<365){const i=t[n++],o=t[n++],l=t[n++],u=((r&7)<<18|(i&63)<<12|(o&63)<<6|l&63)-65536;e[s++]=String.fromCharCode(55296+(u>>10)),e[s++]=String.fromCharCode(56320+(u&1023))}else{const i=t[n++],o=t[n++];e[s++]=String.fromCharCode((r&15)<<12|(i&63)<<6|o&63)}}return e.join("")},Lm={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<t.length;r+=3){const i=t[r],o=r+1<t.length,l=o?t[r+1]:0,u=r+2<t.length,c=u?t[r+2]:0,f=i>>2,p=(i&3)<<4|l>>4;let g=(l&15)<<2|c>>6,_=c&63;u||(_=64,o||(g=64)),s.push(n[f],n[p],n[g],n[_])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Mm(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):pw(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<t.length;){const i=n[t.charAt(r++)],l=r<t.length?n[t.charAt(r)]:0;++r;const c=r<t.length?n[t.charAt(r)]:64;++r;const p=r<t.length?n[t.charAt(r)]:64;if(++r,i==null||l==null||c==null||p==null)throw new mw;const g=i<<2|l>>4;if(s.push(g),c!==64){const _=l<<4&240|c>>2;if(s.push(_),p!==64){const b=c<<6&192|p;s.push(b)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class mw extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const gw=function(t){const e=Mm(t);return Lm.encodeByteArray(e,!0)},ta=function(t){return gw(t).replace(/\./g,"")},Um=function(t){try{return Lm.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _w(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yw=()=>_w().__FIREBASE_DEFAULTS__,vw=()=>{if(typeof process>"u"||typeof Md>"u")return;const t=Md.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},bw=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Um(t[1]);return e&&JSON.parse(e)},La=()=>{try{return fw()||yw()||vw()||bw()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Fm=t=>{var e,n;return(n=(e=La())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},Ew=t=>{const e=Fm(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),s]:[e.substring(0,n),s]},$m=()=>{var t;return(t=La())===null||t===void 0?void 0:t.config},Bm=t=>{var e;return(e=La())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ww{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zi(t){return t.endsWith(".cloudworkstations.dev")}async function jm(t){return(await fetch(t,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tw(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},s=e||"demo-project",r=t.iat||0,i=t.sub||t.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:r,exp:r+3600,auth_time:r,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},t);return[ta(JSON.stringify(n)),ta(JSON.stringify(o)),""].join(".")}const bi={};function Iw(){const t={prod:[],emulator:[]};for(const e of Object.keys(bi))bi[e]?t.emulator.push(e):t.prod.push(e);return t}function Aw(t){let e=document.getElementById(t),n=!1;return e||(e=document.createElement("div"),e.setAttribute("id",t),n=!0),{created:n,element:e}}let Ld=!1;function qm(t,e){if(typeof window>"u"||typeof document>"u"||!zi(window.location.host)||bi[t]===e||bi[t]||Ld)return;bi[t]=e;function n(g){return`__firebase__banner__${g}`}const s="__firebase__banner",i=Iw().prod.length>0;function o(){const g=document.getElementById(s);g&&g.remove()}function l(g){g.style.display="flex",g.style.background="#7faaf0",g.style.position="fixed",g.style.bottom="5px",g.style.left="5px",g.style.padding=".5em",g.style.borderRadius="5px",g.style.alignItems="center"}function u(g,_){g.setAttribute("width","24"),g.setAttribute("id",_),g.setAttribute("height","24"),g.setAttribute("viewBox","0 0 24 24"),g.setAttribute("fill","none"),g.style.marginLeft="-6px"}function c(){const g=document.createElement("span");return g.style.cursor="pointer",g.style.marginLeft="16px",g.style.fontSize="24px",g.innerHTML=" &times;",g.onclick=()=>{Ld=!0,o()},g}function f(g,_){g.setAttribute("id",_),g.innerText="Learn more",g.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",g.setAttribute("target","__blank"),g.style.paddingLeft="5px",g.style.textDecoration="underline"}function p(){const g=Aw(s),_=n("text"),b=document.getElementById(_)||document.createElement("span"),y=n("learnmore"),E=document.getElementById(y)||document.createElement("a"),k=n("preprendIcon"),C=document.getElementById(k)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(g.created){const x=g.element;l(x),f(E,y);const M=c();u(C,k),x.append(C,b,E,M),document.body.appendChild(x)}i?(b.innerText="Preview backend disconnected.",C.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(C.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,b.innerText="Preview backend running in this workspace."),b.setAttribute("id",_)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",p):p()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Rw(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Pt())}function Sw(){var t;const e=(t=La())===null||t===void 0?void 0:t.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Cw(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Pw(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function kw(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function xw(){const t=Pt();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function Vw(){return!Sw()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Dw(){try{return typeof indexedDB=="object"}catch{return!1}}function Nw(){return new Promise((t,e)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),n||self.indexedDB.deleteDatabase(s),t(!0)},r.onupgradeneeded=()=>{n=!1},r.onerror=()=>{var i;e(((i=r.error)===null||i===void 0?void 0:i.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ow="FirebaseError";class Qn extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=Ow,Object.setPrototypeOf(this,Qn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Gi.prototype.create)}}class Gi{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){const s=n[0]||{},r=`${this.service}/${e}`,i=this.errors[e],o=i?Mw(i,s):"Error",l=`${this.serviceName}: ${o} (${r}).`;return new Qn(r,l,s)}}function Mw(t,e){return t.replace(Lw,(n,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const Lw=/\{\$([^}]+)}/g;function Uw(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function qs(t,e){if(t===e)return!0;const n=Object.keys(t),s=Object.keys(e);for(const r of n){if(!s.includes(r))return!1;const i=t[r],o=e[r];if(Ud(i)&&Ud(o)){if(!qs(i,o))return!1}else if(i!==o)return!1}for(const r of s)if(!n.includes(r))return!1;return!0}function Ud(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wi(t){const e=[];for(const[n,s]of Object.entries(t))Array.isArray(s)?s.forEach(r=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function oi(t){const e={};return t.replace(/^\?/,"").split("&").forEach(s=>{if(s){const[r,i]=s.split("=");e[decodeURIComponent(r)]=decodeURIComponent(i)}}),e}function ai(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function Fw(t,e){const n=new $w(t,e);return n.subscribe.bind(n)}class $w{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,s){let r;if(e===void 0&&n===void 0&&s===void 0)throw new Error("Missing Observer.");Bw(e,["next","error","complete"])?r=e:r={next:e,error:n,complete:s},r.next===void 0&&(r.next=Ml),r.error===void 0&&(r.error=Ml),r.complete===void 0&&(r.complete=Ml);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Bw(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Ml(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function at(t){return t&&t._delegate?t._delegate:t}class Hs{constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fs="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jw{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const s=new ww;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:n});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Hw(e))try{this.getOrInitializeService({instanceIdentifier:Fs})}catch{}for(const[n,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:r});s.resolve(i)}catch{}}}}clearInstance(e=Fs){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Fs){return this.instances.has(e)}getOptions(e=Fs){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[i,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(i);s===l&&o.resolve(r)}return r}onInit(e,n){var s;const r=this.normalizeInstanceIdentifier(n),i=(s=this.onInitCallbacks.get(r))!==null&&s!==void 0?s:new Set;i.add(e),this.onInitCallbacks.set(r,i);const o=this.instances.get(r);return o&&e(o,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const s=this.onInitCallbacks.get(n);if(s)for(const r of s)try{r(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:qw(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=Fs){return this.component?this.component.multipleInstances?e:Fs:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function qw(t){return t===Fs?void 0:t}function Hw(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kw{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new jw(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ie;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(Ie||(Ie={}));const zw={debug:Ie.DEBUG,verbose:Ie.VERBOSE,info:Ie.INFO,warn:Ie.WARN,error:Ie.ERROR,silent:Ie.SILENT},Gw=Ie.INFO,Ww={[Ie.DEBUG]:"log",[Ie.VERBOSE]:"log",[Ie.INFO]:"info",[Ie.WARN]:"warn",[Ie.ERROR]:"error"},Qw=(t,e,...n)=>{if(e<t.logLevel)return;const s=new Date().toISOString(),r=Ww[e];if(r)console[r](`[${s}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Zu{constructor(e){this.name=e,this._logLevel=Gw,this._logHandler=Qw,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Ie))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?zw[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Ie.DEBUG,...e),this._logHandler(this,Ie.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Ie.VERBOSE,...e),this._logHandler(this,Ie.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Ie.INFO,...e),this._logHandler(this,Ie.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Ie.WARN,...e),this._logHandler(this,Ie.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Ie.ERROR,...e),this._logHandler(this,Ie.ERROR,...e)}}const Yw=(t,e)=>e.some(n=>t instanceof n);let Fd,$d;function Jw(){return Fd||(Fd=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Xw(){return $d||($d=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Hm=new WeakMap,ou=new WeakMap,Km=new WeakMap,Ll=new WeakMap,ec=new WeakMap;function Zw(t){const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("success",i),t.removeEventListener("error",o)},i=()=>{n(ps(t.result)),r()},o=()=>{s(t.error),r()};t.addEventListener("success",i),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&Hm.set(n,t)}).catch(()=>{}),ec.set(e,t),e}function eT(t){if(ou.has(t))return;const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("complete",i),t.removeEventListener("error",o),t.removeEventListener("abort",o)},i=()=>{n(),r()},o=()=>{s(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",i),t.addEventListener("error",o),t.addEventListener("abort",o)});ou.set(t,e)}let au={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return ou.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Km.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return ps(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function tT(t){au=t(au)}function nT(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const s=t.call(Ul(this),e,...n);return Km.set(s,e.sort?e.sort():[e]),ps(s)}:Xw().includes(t)?function(...e){return t.apply(Ul(this),e),ps(Hm.get(this))}:function(...e){return ps(t.apply(Ul(this),e))}}function sT(t){return typeof t=="function"?nT(t):(t instanceof IDBTransaction&&eT(t),Yw(t,Jw())?new Proxy(t,au):t)}function ps(t){if(t instanceof IDBRequest)return Zw(t);if(Ll.has(t))return Ll.get(t);const e=sT(t);return e!==t&&(Ll.set(t,e),ec.set(e,t)),e}const Ul=t=>ec.get(t);function rT(t,e,{blocked:n,upgrade:s,blocking:r,terminated:i}={}){const o=indexedDB.open(t,e),l=ps(o);return s&&o.addEventListener("upgradeneeded",u=>{s(ps(o.result),u.oldVersion,u.newVersion,ps(o.transaction),u)}),n&&o.addEventListener("blocked",u=>n(u.oldVersion,u.newVersion,u)),l.then(u=>{i&&u.addEventListener("close",()=>i()),r&&u.addEventListener("versionchange",c=>r(c.oldVersion,c.newVersion,c))}).catch(()=>{}),l}const iT=["get","getKey","getAll","getAllKeys","count"],oT=["put","add","delete","clear"],Fl=new Map;function Bd(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Fl.get(e))return Fl.get(e);const n=e.replace(/FromIndex$/,""),s=e!==n,r=oT.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(r||iT.includes(n)))return;const i=async function(o,...l){const u=this.transaction(o,r?"readwrite":"readonly");let c=u.store;return s&&(c=c.index(l.shift())),(await Promise.all([c[n](...l),r&&u.done]))[0]};return Fl.set(e,i),i}tT(t=>({...t,get:(e,n,s)=>Bd(e,n)||t.get(e,n,s),has:(e,n)=>!!Bd(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aT{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(lT(n)){const s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}}function lT(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const lu="@firebase/app",jd="0.13.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hn=new Zu("@firebase/app"),uT="@firebase/app-compat",cT="@firebase/analytics-compat",hT="@firebase/analytics",dT="@firebase/app-check-compat",fT="@firebase/app-check",pT="@firebase/auth",mT="@firebase/auth-compat",gT="@firebase/database",_T="@firebase/data-connect",yT="@firebase/database-compat",vT="@firebase/functions",bT="@firebase/functions-compat",ET="@firebase/installations",wT="@firebase/installations-compat",TT="@firebase/messaging",IT="@firebase/messaging-compat",AT="@firebase/performance",RT="@firebase/performance-compat",ST="@firebase/remote-config",CT="@firebase/remote-config-compat",PT="@firebase/storage",kT="@firebase/storage-compat",xT="@firebase/firestore",VT="@firebase/ai",DT="@firebase/firestore-compat",NT="firebase",OT="11.8.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uu="[DEFAULT]",MT={[lu]:"fire-core",[uT]:"fire-core-compat",[hT]:"fire-analytics",[cT]:"fire-analytics-compat",[fT]:"fire-app-check",[dT]:"fire-app-check-compat",[pT]:"fire-auth",[mT]:"fire-auth-compat",[gT]:"fire-rtdb",[_T]:"fire-data-connect",[yT]:"fire-rtdb-compat",[vT]:"fire-fn",[bT]:"fire-fn-compat",[ET]:"fire-iid",[wT]:"fire-iid-compat",[TT]:"fire-fcm",[IT]:"fire-fcm-compat",[AT]:"fire-perf",[RT]:"fire-perf-compat",[ST]:"fire-rc",[CT]:"fire-rc-compat",[PT]:"fire-gcs",[kT]:"fire-gcs-compat",[xT]:"fire-fst",[DT]:"fire-fst-compat",[VT]:"fire-vertex","fire-js":"fire-js",[NT]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const na=new Map,LT=new Map,cu=new Map;function qd(t,e){try{t.container.addComponent(e)}catch(n){Hn.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Sr(t){const e=t.name;if(cu.has(e))return Hn.debug(`There were multiple attempts to register component ${e}.`),!1;cu.set(e,t);for(const n of na.values())qd(n,t);for(const n of LT.values())qd(n,t);return!0}function tc(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Yt(t){return t==null?!1:t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const UT={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ms=new Gi("app","Firebase",UT);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FT{constructor(e,n,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new Hs("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ms.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mr=OT;function zm(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const s=Object.assign({name:uu,automaticDataCollectionEnabled:!0},e),r=s.name;if(typeof r!="string"||!r)throw ms.create("bad-app-name",{appName:String(r)});if(n||(n=$m()),!n)throw ms.create("no-options");const i=na.get(r);if(i){if(qs(n,i.options)&&qs(s,i.config))return i;throw ms.create("duplicate-app",{appName:r})}const o=new Kw(r);for(const u of cu.values())o.addComponent(u);const l=new FT(n,s,o);return na.set(r,l),l}function Gm(t=uu){const e=na.get(t);if(!e&&t===uu&&$m())return zm();if(!e)throw ms.create("no-app",{appName:t});return e}function gs(t,e,n){var s;let r=(s=MT[t])!==null&&s!==void 0?s:t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),o=e.match(/\s|\//);if(i||o){const l=[`Unable to register library "${r}" with version "${e}":`];i&&l.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Hn.warn(l.join(" "));return}Sr(new Hs(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $T="firebase-heartbeat-database",BT=1,Di="firebase-heartbeat-store";let $l=null;function Wm(){return $l||($l=rT($T,BT,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Di)}catch(n){console.warn(n)}}}}).catch(t=>{throw ms.create("idb-open",{originalErrorMessage:t.message})})),$l}async function jT(t){try{const n=(await Wm()).transaction(Di),s=await n.objectStore(Di).get(Qm(t));return await n.done,s}catch(e){if(e instanceof Qn)Hn.warn(e.message);else{const n=ms.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Hn.warn(n.message)}}}async function Hd(t,e){try{const s=(await Wm()).transaction(Di,"readwrite");await s.objectStore(Di).put(e,Qm(t)),await s.done}catch(n){if(n instanceof Qn)Hn.warn(n.message);else{const s=ms.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Hn.warn(s.message)}}}function Qm(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qT=1024,HT=30;class KT{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new GT(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,n;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Kd();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:r}),this._heartbeatsCache.heartbeats.length>HT){const o=WT(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){Hn.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Kd(),{heartbeatsToSend:s,unsentEntries:r}=zT(this._heartbeatsCache.heartbeats),i=ta(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=n,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(n){return Hn.warn(n),""}}}function Kd(){return new Date().toISOString().substring(0,10)}function zT(t,e=qT){const n=[];let s=t.slice();for(const r of t){const i=n.find(o=>o.agent===r.agent);if(i){if(i.dates.push(r.date),zd(n)>e){i.dates.pop();break}}else if(n.push({agent:r.agent,dates:[r.date]}),zd(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class GT{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Dw()?Nw().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await jT(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return Hd(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return Hd(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function zd(t){return ta(JSON.stringify({version:2,heartbeats:t})).length}function WT(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let s=1;s<t.length;s++)t[s].date<n&&(n=t[s].date,e=s);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function QT(t){Sr(new Hs("platform-logger",e=>new aT(e),"PRIVATE")),Sr(new Hs("heartbeat",e=>new KT(e),"PRIVATE")),gs(lu,jd,t),gs(lu,jd,"esm2017"),gs("fire-js","")}QT("");function nc(t,e){var n={};for(var s in t)Object.prototype.hasOwnProperty.call(t,s)&&e.indexOf(s)<0&&(n[s]=t[s]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,s=Object.getOwnPropertySymbols(t);r<s.length;r++)e.indexOf(s[r])<0&&Object.prototype.propertyIsEnumerable.call(t,s[r])&&(n[s[r]]=t[s[r]]);return n}function Ym(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const YT=Ym,Jm=new Gi("auth","Firebase",Ym());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sa=new Zu("@firebase/auth");function JT(t,...e){sa.logLevel<=Ie.WARN&&sa.warn(`Auth (${Mr}): ${t}`,...e)}function Mo(t,...e){sa.logLevel<=Ie.ERROR&&sa.error(`Auth (${Mr}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fn(t,...e){throw sc(t,...e)}function wn(t,...e){return sc(t,...e)}function Xm(t,e,n){const s=Object.assign(Object.assign({},YT()),{[e]:n});return new Gi("auth","Firebase",s).create(e,{appName:t.name})}function $n(t){return Xm(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function sc(t,...e){if(typeof t!="string"){const n=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=t.name),t._errorFactory.create(n,...s)}return Jm.create(t,...e)}function me(t,e,...n){if(!t)throw sc(e,...n)}function Un(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Mo(e),new Error(e)}function Kn(t,e){t||Un(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hu(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function XT(){return Gd()==="http:"||Gd()==="https:"}function Gd(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ZT(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(XT()||Pw()||"connection"in navigator)?navigator.onLine:!0}function eI(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qi{constructor(e,n){this.shortDelay=e,this.longDelay=n,Kn(n>e,"Short delay should be less than long delay!"),this.isMobile=Rw()||kw()}get(){return ZT()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rc(t,e){Kn(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zm{static initialize(e,n,s){this.fetchImpl=e,n&&(this.headersImpl=n),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Un("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Un("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Un("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tI={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nI=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],sI=new Qi(3e4,6e4);function Yn(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function Jn(t,e,n,s,r={}){return eg(t,r,async()=>{let i={},o={};s&&(e==="GET"?o=s:i={body:JSON.stringify(s)});const l=Wi(Object.assign({key:t.config.apiKey},o)).slice(1),u=await t._getAdditionalHeaders();u["Content-Type"]="application/json",t.languageCode&&(u["X-Firebase-Locale"]=t.languageCode);const c=Object.assign({method:e,headers:u},i);return Cw()||(c.referrerPolicy="no-referrer"),t.emulatorConfig&&zi(t.emulatorConfig.host)&&(c.credentials="include"),Zm.fetch()(await tg(t,t.config.apiHost,n,l),c)})}async function eg(t,e,n){t._canInitEmulator=!1;const s=Object.assign(Object.assign({},tI),e);try{const r=new iI(t),i=await Promise.race([n(),r.promise]);r.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw Ao(t,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const l=i.ok?o.errorMessage:o.error.message,[u,c]=l.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw Ao(t,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw Ao(t,"email-already-in-use",o);if(u==="USER_DISABLED")throw Ao(t,"user-disabled",o);const f=s[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw Xm(t,f,c);fn(t,f)}}catch(r){if(r instanceof Qn)throw r;fn(t,"network-request-failed",{message:String(r)})}}async function Yi(t,e,n,s,r={}){const i=await Jn(t,e,n,s,r);return"mfaPendingCredential"in i&&fn(t,"multi-factor-auth-required",{_serverResponse:i}),i}async function tg(t,e,n,s){const r=`${e}${n}?${s}`,i=t,o=i.config.emulator?rc(t.config,r):`${t.config.apiScheme}://${r}`;return nI.includes(n)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(o).toString():o}function rI(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class iI{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,s)=>{this.timer=setTimeout(()=>s(wn(this.auth,"network-request-failed")),sI.get())})}}function Ao(t,e,n){const s={appName:t.name};n.email&&(s.email=n.email),n.phoneNumber&&(s.phoneNumber=n.phoneNumber);const r=wn(t,e,s);return r.customData._tokenResponse=n,r}function Wd(t){return t!==void 0&&t.enterprise!==void 0}class oI{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return rI(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function aI(t,e){return Jn(t,"GET","/v2/recaptchaConfig",Yn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lI(t,e){return Jn(t,"POST","/v1/accounts:delete",e)}async function ra(t,e){return Jn(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ei(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function uI(t,e=!1){const n=at(t),s=await n.getIdToken(e),r=ic(s);me(r&&r.exp&&r.auth_time&&r.iat,n.auth,"internal-error");const i=typeof r.firebase=="object"?r.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:r,token:s,authTime:Ei(Bl(r.auth_time)),issuedAtTime:Ei(Bl(r.iat)),expirationTime:Ei(Bl(r.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function Bl(t){return Number(t)*1e3}function ic(t){const[e,n,s]=t.split(".");if(e===void 0||n===void 0||s===void 0)return Mo("JWT malformed, contained fewer than 3 sections"),null;try{const r=Um(n);return r?JSON.parse(r):(Mo("Failed to decode base64 JWT payload"),null)}catch(r){return Mo("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function Qd(t){const e=ic(t);return me(e,"internal-error"),me(typeof e.exp<"u","internal-error"),me(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ni(t,e,n=!1){if(n)return e;try{return await e}catch(s){throw s instanceof Qn&&cI(s)&&t.auth.currentUser===t&&await t.auth.signOut(),s}}function cI({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hI{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const r=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class du{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ei(this.lastLoginAt),this.creationTime=Ei(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ia(t){var e;const n=t.auth,s=await t.getIdToken(),r=await Ni(t,ra(n,{idToken:s}));me(r==null?void 0:r.users.length,n,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const o=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?ng(i.providerUserInfo):[],l=fI(t.providerData,o),u=t.isAnonymous,c=!(t.email&&i.passwordHash)&&!(l!=null&&l.length),f=u?c:!1,p={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:l,metadata:new du(i.createdAt,i.lastLoginAt),isAnonymous:f};Object.assign(t,p)}async function dI(t){const e=at(t);await ia(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function fI(t,e){return[...t.filter(s=>!e.some(r=>r.providerId===s.providerId)),...e]}function ng(t){return t.map(e=>{var{providerId:n}=e,s=nc(e,["providerId"]);return{providerId:n,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pI(t,e){const n=await eg(t,{},async()=>{const s=Wi({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:i}=t.config,o=await tg(t,r,"/v1/token",`key=${i}`),l=await t._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",Zm.fetch()(o,{method:"POST",headers:l,body:s})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function mI(t,e){return Jn(t,"POST","/v2/accounts:revokeToken",Yn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){me(e.idToken,"internal-error"),me(typeof e.idToken<"u","internal-error"),me(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Qd(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){me(e.length!==0,"internal-error");const n=Qd(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(me(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:s,refreshToken:r,expiresIn:i}=await pI(e,n);this.updateTokensAndExpiration(s,r,Number(i))}updateTokensAndExpiration(e,n,s){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,n){const{refreshToken:s,accessToken:r,expirationTime:i}=n,o=new yr;return s&&(me(typeof s=="string","internal-error",{appName:e}),o.refreshToken=s),r&&(me(typeof r=="string","internal-error",{appName:e}),o.accessToken=r),i&&(me(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new yr,this.toJSON())}_performRefresh(){return Un("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rs(t,e){me(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class on{constructor(e){var{uid:n,auth:s,stsTokenManager:r}=e,i=nc(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new hI(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=s,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new du(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Ni(this,this.stsTokenManager.getToken(this.auth,e));return me(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return uI(this,e)}reload(){return dI(this)}_assign(e){this!==e&&(me(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new on(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){me(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),n&&await ia(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Yt(this.auth.app))return Promise.reject($n(this.auth));const e=await this.getIdToken();return await Ni(this,lI(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var s,r,i,o,l,u,c,f;const p=(s=n.displayName)!==null&&s!==void 0?s:void 0,g=(r=n.email)!==null&&r!==void 0?r:void 0,_=(i=n.phoneNumber)!==null&&i!==void 0?i:void 0,b=(o=n.photoURL)!==null&&o!==void 0?o:void 0,y=(l=n.tenantId)!==null&&l!==void 0?l:void 0,E=(u=n._redirectEventId)!==null&&u!==void 0?u:void 0,k=(c=n.createdAt)!==null&&c!==void 0?c:void 0,C=(f=n.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:x,emailVerified:M,isAnonymous:W,providerData:le,stsTokenManager:S}=n;me(x&&S,e,"internal-error");const w=yr.fromJSON(this.name,S);me(typeof x=="string",e,"internal-error"),rs(p,e.name),rs(g,e.name),me(typeof M=="boolean",e,"internal-error"),me(typeof W=="boolean",e,"internal-error"),rs(_,e.name),rs(b,e.name),rs(y,e.name),rs(E,e.name),rs(k,e.name),rs(C,e.name);const I=new on({uid:x,auth:e,email:g,emailVerified:M,displayName:p,isAnonymous:W,photoURL:b,phoneNumber:_,tenantId:y,stsTokenManager:w,createdAt:k,lastLoginAt:C});return le&&Array.isArray(le)&&(I.providerData=le.map(P=>Object.assign({},P))),E&&(I._redirectEventId=E),I}static async _fromIdTokenResponse(e,n,s=!1){const r=new yr;r.updateFromServerResponse(n);const i=new on({uid:n.localId,auth:e,stsTokenManager:r,isAnonymous:s});return await ia(i),i}static async _fromGetAccountInfoResponse(e,n,s){const r=n.users[0];me(r.localId!==void 0,"internal-error");const i=r.providerUserInfo!==void 0?ng(r.providerUserInfo):[],o=!(r.email&&r.passwordHash)&&!(i!=null&&i.length),l=new yr;l.updateFromIdToken(s);const u=new on({uid:r.localId,auth:e,stsTokenManager:l,isAnonymous:o}),c={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:i,metadata:new du(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(i!=null&&i.length)};return Object.assign(u,c),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yd=new Map;function Fn(t){Kn(t instanceof Function,"Expected a class definition");let e=Yd.get(t);return e?(Kn(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Yd.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sg{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}sg.type="NONE";const Jd=sg;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lo(t,e,n){return`firebase:${t}:${e}:${n}`}class vr{constructor(e,n,s){this.persistence=e,this.auth=n,this.userKey=s;const{config:r,name:i}=this.auth;this.fullUserKey=Lo(this.userKey,r.apiKey,i),this.fullPersistenceKey=Lo("persistence",r.apiKey,i),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await ra(this.auth,{idToken:e}).catch(()=>{});return n?on._fromGetAccountInfoResponse(this.auth,n,e):null}return on._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,s="authUser"){if(!n.length)return new vr(Fn(Jd),e,s);const r=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let i=r[0]||Fn(Jd);const o=Lo(s,e.config.apiKey,e.name);let l=null;for(const c of n)try{const f=await c._get(o);if(f){let p;if(typeof f=="string"){const g=await ra(e,{idToken:f}).catch(()=>{});if(!g)break;p=await on._fromGetAccountInfoResponse(e,g,f)}else p=on._fromJSON(e,f);c!==i&&(l=p),i=c;break}}catch{}const u=r.filter(c=>c._shouldAllowMigration);return!i._shouldAllowMigration||!u.length?new vr(i,e,s):(i=u[0],l&&await i._set(o,l.toJSON()),await Promise.all(n.map(async c=>{if(c!==i)try{await c._remove(o)}catch{}})),new vr(i,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xd(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(ag(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(rg(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(ug(e))return"Blackberry";if(cg(e))return"Webos";if(ig(e))return"Safari";if((e.includes("chrome/")||og(e))&&!e.includes("edge/"))return"Chrome";if(lg(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=t.match(n);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function rg(t=Pt()){return/firefox\//i.test(t)}function ig(t=Pt()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function og(t=Pt()){return/crios\//i.test(t)}function ag(t=Pt()){return/iemobile/i.test(t)}function lg(t=Pt()){return/android/i.test(t)}function ug(t=Pt()){return/blackberry/i.test(t)}function cg(t=Pt()){return/webos/i.test(t)}function oc(t=Pt()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function gI(t=Pt()){var e;return oc(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function _I(){return xw()&&document.documentMode===10}function hg(t=Pt()){return oc(t)||lg(t)||cg(t)||ug(t)||/windows phone/i.test(t)||ag(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dg(t,e=[]){let n;switch(t){case"Browser":n=Xd(Pt());break;case"Worker":n=`${Xd(Pt())}-${t}`;break;default:n=t}const s=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Mr}/${s}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yI{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const s=i=>new Promise((o,l)=>{try{const u=e(i);o(u)}catch(u){l(u)}});s.onAbort=n,this.queue.push(s);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const s of this.queue)await s(e),s.onAbort&&n.push(s.onAbort)}catch(s){n.reverse();for(const r of n)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vI(t,e={}){return Jn(t,"GET","/v2/passwordPolicy",Yn(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bI=6;class EI{constructor(e){var n,s,r,i;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:bI,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(r=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&r!==void 0?r:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,s,r,i,o,l;const u={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,u),this.validatePasswordCharacterOptions(e,u),u.isValid&&(u.isValid=(n=u.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),u.isValid&&(u.isValid=(s=u.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),u.isValid&&(u.isValid=(r=u.containsLowercaseLetter)!==null&&r!==void 0?r:!0),u.isValid&&(u.isValid=(i=u.containsUppercaseLetter)!==null&&i!==void 0?i:!0),u.isValid&&(u.isValid=(o=u.containsNumericCharacter)!==null&&o!==void 0?o:!0),u.isValid&&(u.isValid=(l=u.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),u}validatePasswordLengthOptions(e,n){const s=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;s&&(n.meetsMinPasswordLength=e.length>=s),r&&(n.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let s;for(let r=0;r<e.length;r++)s=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(n,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,n,s,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wI{constructor(e,n,s,r){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=s,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Zd(this),this.idTokenSubscription=new Zd(this),this.beforeStateQueue=new yI(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Jm,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Fn(n)),this._initializationPromise=this.queue(async()=>{var s,r,i;if(!this._deleted&&(this.persistenceManager=await vr.create(this,e),(s=this._resolvePersistenceManagerAvailable)===null||s===void 0||s.call(this),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await ra(this,{idToken:e}),s=await on._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(s)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(Yt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let r=s,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,l=r==null?void 0:r._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===l)&&(u!=null&&u.user)&&(r=u.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return me(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await ia(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=eI()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Yt(this.app))return Promise.reject($n(this));const n=e?at(e):null;return n&&me(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&me(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Yt(this.app)?Promise.reject($n(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Yt(this.app)?Promise.reject($n(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Fn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await vI(this),n=new EI(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Gi("auth","Firebase",e())}onAuthStateChanged(e,n,s){return this.registerStateListener(this.authStateSubscription,e,n,s)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,s){return this.registerStateListener(this.idTokenSubscription,e,n,s)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(s.tenantId=this.tenantId),await mI(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const s=await this.getOrInitRedirectPersistenceManager(n);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Fn(e)||this._popupRedirectResolver;me(n,this,"argument-error"),this.redirectPersistenceManager=await vr.create(this,[Fn(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,s;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,s,r){if(this._deleted)return()=>{};const i=typeof n=="function"?n:n.next.bind(n);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(me(l,this,"internal-error"),l.then(()=>{o||i(this.currentUser)}),typeof n=="function"){const u=e.addObserver(n,s,r);return()=>{o=!0,u()}}else{const u=e.addObserver(n);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return me(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=dg(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(n["X-Firebase-Client"]=s);const r=await this._getAppCheckToken();return r&&(n["X-Firebase-AppCheck"]=r),n}async _getAppCheckToken(){var e;if(Yt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&JT(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function Cs(t){return at(t)}class Zd{constructor(e){this.auth=e,this.observer=null,this.addObserver=Fw(n=>this.observer=n)}get next(){return me(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ua={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function TI(t){Ua=t}function fg(t){return Ua.loadJS(t)}function II(){return Ua.recaptchaEnterpriseScript}function AI(){return Ua.gapiScript}function RI(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class SI{constructor(){this.enterprise=new CI}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class CI{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}const PI="recaptcha-enterprise",pg="NO_RECAPTCHA";class kI{constructor(e){this.type=PI,this.auth=Cs(e)}async verify(e="verify",n=!1){async function s(i){if(!n){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,l)=>{aI(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const c=new oI(u);return i.tenantId==null?i._agentRecaptchaConfig=c:i._tenantRecaptchaConfigs[i.tenantId]=c,o(c.siteKey)}}).catch(u=>{l(u)})})}function r(i,o,l){const u=window.grecaptcha;Wd(u)?u.enterprise.ready(()=>{u.enterprise.execute(i,{action:e}).then(c=>{o(c)}).catch(()=>{o(pg)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new SI().execute("siteKey",{action:"verify"}):new Promise((i,o)=>{s(this.auth).then(l=>{if(!n&&Wd(window.grecaptcha))r(l,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=II();u.length!==0&&(u+=l),fg(u).then(()=>{r(l,i,o)}).catch(c=>{o(c)})}}).catch(l=>{o(l)})})}}async function ef(t,e,n,s=!1,r=!1){const i=new kI(t);let o;if(r)o=pg;else try{o=await i.verify(n)}catch{o=await i.verify(n,!0)}const l=Object.assign({},e);if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in l){const u=l.phoneEnrollmentInfo.phoneNumber,c=l.phoneEnrollmentInfo.recaptchaToken;Object.assign(l,{phoneEnrollmentInfo:{phoneNumber:u,recaptchaToken:c,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in l){const u=l.phoneSignInInfo.recaptchaToken;Object.assign(l,{phoneSignInInfo:{recaptchaToken:u,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return l}return s?Object.assign(l,{captchaResp:o}):Object.assign(l,{captchaResponse:o}),Object.assign(l,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(l,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),l}async function oa(t,e,n,s,r){var i;if(!((i=t._getRecaptchaConfig())===null||i===void 0)&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const o=await ef(t,e,n,n==="getOobCode");return s(t,o)}else return s(t,e).catch(async o=>{if(o.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const l=await ef(t,e,n,n==="getOobCode");return s(t,l)}else return Promise.reject(o)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xI(t,e){const n=tc(t,"auth");if(n.isInitialized()){const r=n.getImmediate(),i=n.getOptions();if(qs(i,e??{}))return r;fn(r,"already-initialized")}return n.initialize({options:e})}function VI(t,e){const n=(e==null?void 0:e.persistence)||[],s=(Array.isArray(n)?n:[n]).map(Fn);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function DI(t,e,n){const s=Cs(t);me(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const r=!1,i=mg(e),{host:o,port:l}=NI(e),u=l===null?"":`:${l}`,c={url:`${i}//${o}${u}/`},f=Object.freeze({host:o,port:l,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:r})});if(!s._canInitEmulator){me(s.config.emulator&&s.emulatorConfig,s,"emulator-config-failed"),me(qs(c,s.config.emulator)&&qs(f,s.emulatorConfig),s,"emulator-config-failed");return}s.config.emulator=c,s.emulatorConfig=f,s.settings.appVerificationDisabledForTesting=!0,zi(o)?(jm(`${i}//${o}${u}`),qm("Auth",!0)):OI()}function mg(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function NI(t){const e=mg(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const s=n[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(s);if(r){const i=r[1];return{host:i,port:tf(s.substr(i.length+1))}}else{const[i,o]=s.split(":");return{host:i,port:tf(o)}}}function tf(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function OI(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ac{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Un("not implemented")}_getIdTokenResponse(e){return Un("not implemented")}_linkToIdToken(e,n){return Un("not implemented")}_getReauthenticationResolver(e){return Un("not implemented")}}async function MI(t,e){return Jn(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function LI(t,e){return Yi(t,"POST","/v1/accounts:signInWithPassword",Yn(t,e))}async function UI(t,e){return Jn(t,"POST","/v1/accounts:sendOobCode",Yn(t,e))}async function FI(t,e){return UI(t,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $I(t,e){return Yi(t,"POST","/v1/accounts:signInWithEmailLink",Yn(t,e))}async function BI(t,e){return Yi(t,"POST","/v1/accounts:signInWithEmailLink",Yn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oi extends ac{constructor(e,n,s,r=null){super("password",s),this._email=e,this._password=n,this._tenantId=r}static _fromEmailAndPassword(e,n){return new Oi(e,n,"password")}static _fromEmailAndCode(e,n,s=null){return new Oi(e,n,"emailLink",s)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return oa(e,n,"signInWithPassword",LI);case"emailLink":return $I(e,{email:this._email,oobCode:this._password});default:fn(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const s={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return oa(e,s,"signUpPassword",MI);case"emailLink":return BI(e,{idToken:n,email:this._email,oobCode:this._password});default:fn(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function br(t,e){return Yi(t,"POST","/v1/accounts:signInWithIdp",Yn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jI="http://localhost";class Ks extends ac{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Ks(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):fn("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:r}=n,i=nc(n,["providerId","signInMethod"]);if(!s||!r)return null;const o=new Ks(s,r);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return br(e,n)}_linkToIdToken(e,n){const s=this.buildRequest();return s.idToken=n,br(e,s)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,br(e,n)}buildRequest(){const e={requestUri:jI,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Wi(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qI(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function HI(t){const e=oi(ai(t)).link,n=e?oi(ai(e)).deep_link_id:null,s=oi(ai(t)).deep_link_id;return(s?oi(ai(s)).link:null)||s||n||e||t}class lc{constructor(e){var n,s,r,i,o,l;const u=oi(ai(e)),c=(n=u.apiKey)!==null&&n!==void 0?n:null,f=(s=u.oobCode)!==null&&s!==void 0?s:null,p=qI((r=u.mode)!==null&&r!==void 0?r:null);me(c&&f&&p,"argument-error"),this.apiKey=c,this.operation=p,this.code=f,this.continueUrl=(i=u.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(o=u.lang)!==null&&o!==void 0?o:null,this.tenantId=(l=u.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const n=HI(e);try{return new lc(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lr{constructor(){this.providerId=Lr.PROVIDER_ID}static credential(e,n){return Oi._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const s=lc.parseLink(n);return me(s,"argument-error"),Oi._fromEmailAndCode(e,s.code,s.tenantId)}}Lr.PROVIDER_ID="password";Lr.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Lr.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gg{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ji extends gg{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ls extends Ji{constructor(){super("facebook.com")}static credential(e){return Ks._fromParams({providerId:ls.PROVIDER_ID,signInMethod:ls.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ls.credentialFromTaggedObject(e)}static credentialFromError(e){return ls.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ls.credential(e.oauthAccessToken)}catch{return null}}}ls.FACEBOOK_SIGN_IN_METHOD="facebook.com";ls.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class us extends Ji{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Ks._fromParams({providerId:us.PROVIDER_ID,signInMethod:us.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return us.credentialFromTaggedObject(e)}static credentialFromError(e){return us.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:s}=e;if(!n&&!s)return null;try{return us.credential(n,s)}catch{return null}}}us.GOOGLE_SIGN_IN_METHOD="google.com";us.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cs extends Ji{constructor(){super("github.com")}static credential(e){return Ks._fromParams({providerId:cs.PROVIDER_ID,signInMethod:cs.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return cs.credentialFromTaggedObject(e)}static credentialFromError(e){return cs.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return cs.credential(e.oauthAccessToken)}catch{return null}}}cs.GITHUB_SIGN_IN_METHOD="github.com";cs.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hs extends Ji{constructor(){super("twitter.com")}static credential(e,n){return Ks._fromParams({providerId:hs.PROVIDER_ID,signInMethod:hs.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return hs.credentialFromTaggedObject(e)}static credentialFromError(e){return hs.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:s}=e;if(!n||!s)return null;try{return hs.credential(n,s)}catch{return null}}}hs.TWITTER_SIGN_IN_METHOD="twitter.com";hs.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function KI(t,e){return Yi(t,"POST","/v1/accounts:signUp",Yn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zs{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,s,r=!1){const i=await on._fromIdTokenResponse(e,s,r),o=nf(s);return new zs({user:i,providerId:o,_tokenResponse:s,operationType:n})}static async _forOperation(e,n,s){await e._updateTokensIfNecessary(s,!0);const r=nf(s);return new zs({user:e,providerId:r,_tokenResponse:s,operationType:n})}}function nf(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aa extends Qn{constructor(e,n,s,r){var i;super(n.code,n.message),this.operationType=s,this.user=r,Object.setPrototypeOf(this,aa.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:n.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,n,s,r){return new aa(e,n,s,r)}}function _g(t,e,n,s){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?aa._fromErrorAndOperation(t,i,e,s):i})}async function zI(t,e,n=!1){const s=await Ni(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return zs._forOperation(t,"link",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function GI(t,e,n=!1){const{auth:s}=t;if(Yt(s.app))return Promise.reject($n(s));const r="reauthenticate";try{const i=await Ni(t,_g(s,r,e,t),n);me(i.idToken,s,"internal-error");const o=ic(i.idToken);me(o,s,"internal-error");const{sub:l}=o;return me(t.uid===l,s,"user-mismatch"),zs._forOperation(t,r,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&fn(s,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yg(t,e,n=!1){if(Yt(t.app))return Promise.reject($n(t));const s="signIn",r=await _g(t,s,e),i=await zs._fromIdTokenResponse(t,s,r);return n||await t._updateCurrentUser(i.user),i}async function WI(t,e){return yg(Cs(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vg(t){const e=Cs(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function uc(t,e,n){const s=Cs(t);await oa(s,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",FI)}async function QI(t,e,n){if(Yt(t.app))return Promise.reject($n(t));const s=Cs(t),o=await oa(s,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",KI).catch(u=>{throw u.code==="auth/password-does-not-meet-requirements"&&vg(t),u}),l=await zs._fromIdTokenResponse(s,"signIn",o);return await s._updateCurrentUser(l.user),l}function YI(t,e,n){return Yt(t.app)?Promise.reject($n(t)):WI(at(t),Lr.credential(e,n)).catch(async s=>{throw s.code==="auth/password-does-not-meet-requirements"&&vg(t),s})}function JI(t,e,n,s){return at(t).onIdTokenChanged(e,n,s)}function XI(t,e,n){return at(t).beforeAuthStateChanged(e,n)}function bg(t,e,n,s){return at(t).onAuthStateChanged(e,n,s)}function ZI(t){return at(t).signOut()}const la="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eg{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(la,"1"),this.storage.removeItem(la),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const e0=1e3,t0=10;class wg extends Eg{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=hg(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const s=this.storage.getItem(n),r=this.localCache[n];s!==r&&e(n,r,s)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,l,u)=>{this.notifyListeners(o,u)});return}const s=e.key;n?this.detachListener():this.stopPolling();const r=()=>{const o=this.storage.getItem(s);!n&&this.localCache[s]===o||this.notifyListeners(s,o)},i=this.storage.getItem(s);_I()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,t0):r()}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:s}),!0)})},e0)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}wg.type="LOCAL";const n0=wg;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tg extends Eg{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Tg.type="SESSION";const Ig=Tg;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function s0(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fa{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(r=>r.isListeningto(e));if(n)return n;const s=new Fa(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:s,eventType:r,data:i}=n.data,o=this.handlersMap[r];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:s,eventType:r});const l=Array.from(o).map(async c=>c(n.origin,i)),u=await s0(l);n.ports[0].postMessage({status:"done",eventId:s,eventType:r,response:u})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Fa.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cc(t="",e=10){let n="";for(let s=0;s<e;s++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class r0{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,s=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,o;return new Promise((l,u)=>{const c=cc("",20);r.port1.start();const f=setTimeout(()=>{u(new Error("unsupported_event"))},s);o={messageChannel:r,onMessage(p){const g=p;if(g.data.eventId===c)switch(g.data.status){case"ack":clearTimeout(f),i=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),l(g.data.response);break;default:clearTimeout(f),clearTimeout(i),u(new Error("invalid_response"));break}}},this.handlers.add(o),r.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[r.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tn(){return window}function i0(t){Tn().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ag(){return typeof Tn().WorkerGlobalScope<"u"&&typeof Tn().importScripts=="function"}async function o0(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function a0(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function l0(){return Ag()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rg="firebaseLocalStorageDb",u0=1,ua="firebaseLocalStorage",Sg="fbase_key";class Xi{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function $a(t,e){return t.transaction([ua],e?"readwrite":"readonly").objectStore(ua)}function c0(){const t=indexedDB.deleteDatabase(Rg);return new Xi(t).toPromise()}function fu(){const t=indexedDB.open(Rg,u0);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const s=t.result;try{s.createObjectStore(ua,{keyPath:Sg})}catch(r){n(r)}}),t.addEventListener("success",async()=>{const s=t.result;s.objectStoreNames.contains(ua)?e(s):(s.close(),await c0(),e(await fu()))})})}async function sf(t,e,n){const s=$a(t,!0).put({[Sg]:e,value:n});return new Xi(s).toPromise()}async function h0(t,e){const n=$a(t,!1).get(e),s=await new Xi(n).toPromise();return s===void 0?null:s.value}function rf(t,e){const n=$a(t,!0).delete(e);return new Xi(n).toPromise()}const d0=800,f0=3;class Cg{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await fu(),this.db)}async _withRetries(e){let n=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(n++>f0)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Ag()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Fa._getInstance(l0()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await o0(),!this.activeServiceWorker)return;this.sender=new r0(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((n=s[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||a0()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await fu();return await sf(e,la,"1"),await rf(e,la),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(s=>sf(s,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(s=>h0(s,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>rf(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const i=$a(r,!1).getAll();return new Xi(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],s=new Set;if(e.length!==0)for(const{fbase_key:r,value:i}of e)s.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),n.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!s.has(r)&&(this.notifyListeners(r,null),n.push(r));return n}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),d0)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Cg.type="LOCAL";const p0=Cg;new Qi(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function m0(t,e){return e?Fn(e):(me(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hc extends ac{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return br(e,this._buildIdpRequest())}_linkToIdToken(e,n){return br(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return br(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function g0(t){return yg(t.auth,new hc(t),t.bypassAuthState)}function _0(t){const{auth:e,user:n}=t;return me(n,e,"internal-error"),GI(n,new hc(t),t.bypassAuthState)}async function y0(t){const{auth:e,user:n}=t;return me(n,e,"internal-error"),zI(n,new hc(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pg{constructor(e,n,s,r,i=!1){this.auth=e,this.resolver=s,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:s,postBody:r,tenantId:i,error:o,type:l}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:n,sessionId:s,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(u))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return g0;case"linkViaPopup":case"linkViaRedirect":return y0;case"reauthViaPopup":case"reauthViaRedirect":return _0;default:fn(this.auth,"internal-error")}}resolve(e){Kn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Kn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const v0=new Qi(2e3,1e4);class hr extends Pg{constructor(e,n,s,r,i){super(e,n,r,i),this.provider=s,this.authWindow=null,this.pollId=null,hr.currentPopupAction&&hr.currentPopupAction.cancel(),hr.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return me(e,this.auth,"internal-error"),e}async onExecution(){Kn(this.filter.length===1,"Popup operations only handle one event");const e=cc();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(wn(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(wn(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,hr.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,s;if(!((s=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(wn(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,v0.get())};e()}}hr.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b0="pendingRedirect",Uo=new Map;class E0 extends Pg{constructor(e,n,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,s),this.eventId=null}async execute(){let e=Uo.get(this.auth._key());if(!e){try{const s=await w0(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(n){e=()=>Promise.reject(n)}Uo.set(this.auth._key(),e)}return this.bypassAuthState||Uo.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function w0(t,e){const n=A0(e),s=I0(t);if(!await s._isAvailable())return!1;const r=await s._get(n)==="true";return await s._remove(n),r}function T0(t,e){Uo.set(t._key(),e)}function I0(t){return Fn(t._redirectPersistence)}function A0(t){return Lo(b0,t.config.apiKey,t.name)}async function R0(t,e,n=!1){if(Yt(t.app))return Promise.reject($n(t));const s=Cs(t),r=m0(s,e),o=await new E0(s,r,n).execute();return o&&!n&&(delete o.user._redirectEventId,await s._persistUserIfCurrent(o.user),await s._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S0=10*60*1e3;class C0{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(n=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!P0(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var s;if(e.error&&!kg(e)){const r=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";n.onError(wn(this.auth,r))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const s=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=S0&&this.cachedEventUids.clear(),this.cachedEventUids.has(of(e))}saveEventToCache(e){this.cachedEventUids.add(of(e)),this.lastProcessedEventTime=Date.now()}}function of(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function kg({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function P0(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return kg(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function k0(t,e={}){return Jn(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x0=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,V0=/^https?/;async function D0(t){if(t.config.emulator)return;const{authorizedDomains:e}=await k0(t);for(const n of e)try{if(N0(n))return}catch{}fn(t,"unauthorized-domain")}function N0(t){const e=hu(),{protocol:n,hostname:s}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&s===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===s}if(!V0.test(n))return!1;if(x0.test(t))return s===t;const r=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(s)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const O0=new Qi(3e4,6e4);function af(){const t=Tn().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function M0(t){return new Promise((e,n)=>{var s,r,i;function o(){af(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{af(),n(wn(t,"network-request-failed"))},timeout:O0.get()})}if(!((r=(s=Tn().gapi)===null||s===void 0?void 0:s.iframes)===null||r===void 0)&&r.Iframe)e(gapi.iframes.getContext());else if(!((i=Tn().gapi)===null||i===void 0)&&i.load)o();else{const l=RI("iframefcb");return Tn()[l]=()=>{gapi.load?o():n(wn(t,"network-request-failed"))},fg(`${AI()}?onload=${l}`).catch(u=>n(u))}}).catch(e=>{throw Fo=null,e})}let Fo=null;function L0(t){return Fo=Fo||M0(t),Fo}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const U0=new Qi(5e3,15e3),F0="__/auth/iframe",$0="emulator/auth/iframe",B0={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},j0=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function q0(t){const e=t.config;me(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?rc(e,$0):`https://${t.config.authDomain}/${F0}`,s={apiKey:e.apiKey,appName:t.name,v:Mr},r=j0.get(t.config.apiHost);r&&(s.eid=r);const i=t._getFrameworks();return i.length&&(s.fw=i.join(",")),`${n}?${Wi(s).slice(1)}`}async function H0(t){const e=await L0(t),n=Tn().gapi;return me(n,t,"internal-error"),e.open({where:document.body,url:q0(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:B0,dontclear:!0},s=>new Promise(async(r,i)=>{await s.restyle({setHideOnLeave:!1});const o=wn(t,"network-request-failed"),l=Tn().setTimeout(()=>{i(o)},U0.get());function u(){Tn().clearTimeout(l),r(s)}s.ping(u).then(u,()=>{i(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const K0={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},z0=500,G0=600,W0="_blank",Q0="http://localhost";class lf{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Y0(t,e,n,s=z0,r=G0){const i=Math.max((window.screen.availHeight-r)/2,0).toString(),o=Math.max((window.screen.availWidth-s)/2,0).toString();let l="";const u=Object.assign(Object.assign({},K0),{width:s.toString(),height:r.toString(),top:i,left:o}),c=Pt().toLowerCase();n&&(l=og(c)?W0:n),rg(c)&&(e=e||Q0,u.scrollbars="yes");const f=Object.entries(u).reduce((g,[_,b])=>`${g}${_}=${b},`,"");if(gI(c)&&l!=="_self")return J0(e||"",l),new lf(null);const p=window.open(e||"",l,f);me(p,t,"popup-blocked");try{p.focus()}catch{}return new lf(p)}function J0(t,e){const n=document.createElement("a");n.href=t,n.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const X0="__/auth/handler",Z0="emulator/auth/handler",eA=encodeURIComponent("fac");async function uf(t,e,n,s,r,i){me(t.config.authDomain,t,"auth-domain-config-required"),me(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:s,v:Mr,eventId:r};if(e instanceof gg){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",Uw(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,p]of Object.entries({}))o[f]=p}if(e instanceof Ji){const f=e.getScopes().filter(p=>p!=="");f.length>0&&(o.scopes=f.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const u=await t._getAppCheckToken(),c=u?`#${eA}=${encodeURIComponent(u)}`:"";return`${tA(t)}?${Wi(l).slice(1)}${c}`}function tA({config:t}){return t.emulator?rc(t,Z0):`https://${t.authDomain}/${X0}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jl="webStorageSupport";class nA{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Ig,this._completeRedirectFn=R0,this._overrideRedirectResult=T0}async _openPopup(e,n,s,r){var i;Kn((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const o=await uf(e,n,s,hu(),r);return Y0(e,o,cc())}async _openRedirect(e,n,s,r){await this._originValidation(e);const i=await uf(e,n,s,hu(),r);return i0(i),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:r,promise:i}=this.eventManagers[n];return r?Promise.resolve(r):(Kn(i,"If manager is not set, promise should be"),i)}const s=this.initAndGetManager(e);return this.eventManagers[n]={promise:s},s.catch(()=>{delete this.eventManagers[n]}),s}async initAndGetManager(e){const n=await H0(e),s=new C0(e);return n.register("authEvent",r=>(me(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:s.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=n,s}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(jl,{type:jl},r=>{var i;const o=(i=r==null?void 0:r[0])===null||i===void 0?void 0:i[jl];o!==void 0&&n(!!o),fn(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=D0(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return hg()||ig()||oc()}}const sA=nA;var cf="@firebase/auth",hf="1.10.6";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rA{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){me(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iA(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function oA(t){Sr(new Hs("auth",(e,{options:n})=>{const s=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=s.options;me(o&&!o.includes(":"),"invalid-api-key",{appName:s.name});const u={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:dg(t)},c=new wI(s,r,i,u);return VI(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,s)=>{e.getProvider("auth-internal").initialize()})),Sr(new Hs("auth-internal",e=>{const n=Cs(e.getProvider("auth").getImmediate());return(s=>new rA(s))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),gs(cf,hf,iA(t)),gs(cf,hf,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aA=5*60,lA=Bm("authIdTokenMaxAge")||aA;let df=null;const uA=t=>async e=>{const n=e&&await e.getIdTokenResult(),s=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(s&&s>lA)return;const r=n==null?void 0:n.token;df!==r&&(df=r,await fetch(t,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function Ba(t=Gm()){const e=tc(t,"auth");if(e.isInitialized())return e.getImmediate();const n=xI(t,{popupRedirectResolver:sA,persistence:[p0,n0,Ig]}),s=Bm("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(s,location.origin);if(location.origin===i.origin){const o=uA(i.toString());XI(n,o,()=>o(n.currentUser)),JI(n,l=>o(l))}}const r=Fm("auth");return r&&DI(n,`http://${r}`),n}function cA(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}TI({loadJS(t){return new Promise((e,n)=>{const s=document.createElement("script");s.setAttribute("src",t),s.onload=e,s.onerror=r=>{const i=wn("internal-error");i.customData=r,n(i)},s.type="text/javascript",s.charset="UTF-8",cA().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});oA("Browser");var ff=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var _s,xg;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(S,w){function I(){}I.prototype=w.prototype,S.D=w.prototype,S.prototype=new I,S.prototype.constructor=S,S.C=function(P,V,N){for(var R=Array(arguments.length-2),kt=2;kt<arguments.length;kt++)R[kt-2]=arguments[kt];return w.prototype[V].apply(P,R)}}function n(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,n),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function r(S,w,I){I||(I=0);var P=Array(16);if(typeof w=="string")for(var V=0;16>V;++V)P[V]=w.charCodeAt(I++)|w.charCodeAt(I++)<<8|w.charCodeAt(I++)<<16|w.charCodeAt(I++)<<24;else for(V=0;16>V;++V)P[V]=w[I++]|w[I++]<<8|w[I++]<<16|w[I++]<<24;w=S.g[0],I=S.g[1],V=S.g[2];var N=S.g[3],R=w+(N^I&(V^N))+P[0]+3614090360&4294967295;w=I+(R<<7&4294967295|R>>>25),R=N+(V^w&(I^V))+P[1]+3905402710&4294967295,N=w+(R<<12&4294967295|R>>>20),R=V+(I^N&(w^I))+P[2]+606105819&4294967295,V=N+(R<<17&4294967295|R>>>15),R=I+(w^V&(N^w))+P[3]+3250441966&4294967295,I=V+(R<<22&4294967295|R>>>10),R=w+(N^I&(V^N))+P[4]+4118548399&4294967295,w=I+(R<<7&4294967295|R>>>25),R=N+(V^w&(I^V))+P[5]+1200080426&4294967295,N=w+(R<<12&4294967295|R>>>20),R=V+(I^N&(w^I))+P[6]+2821735955&4294967295,V=N+(R<<17&4294967295|R>>>15),R=I+(w^V&(N^w))+P[7]+4249261313&4294967295,I=V+(R<<22&4294967295|R>>>10),R=w+(N^I&(V^N))+P[8]+1770035416&4294967295,w=I+(R<<7&4294967295|R>>>25),R=N+(V^w&(I^V))+P[9]+2336552879&4294967295,N=w+(R<<12&4294967295|R>>>20),R=V+(I^N&(w^I))+P[10]+4294925233&4294967295,V=N+(R<<17&4294967295|R>>>15),R=I+(w^V&(N^w))+P[11]+2304563134&4294967295,I=V+(R<<22&4294967295|R>>>10),R=w+(N^I&(V^N))+P[12]+1804603682&4294967295,w=I+(R<<7&4294967295|R>>>25),R=N+(V^w&(I^V))+P[13]+4254626195&4294967295,N=w+(R<<12&4294967295|R>>>20),R=V+(I^N&(w^I))+P[14]+2792965006&4294967295,V=N+(R<<17&4294967295|R>>>15),R=I+(w^V&(N^w))+P[15]+1236535329&4294967295,I=V+(R<<22&4294967295|R>>>10),R=w+(V^N&(I^V))+P[1]+4129170786&4294967295,w=I+(R<<5&4294967295|R>>>27),R=N+(I^V&(w^I))+P[6]+3225465664&4294967295,N=w+(R<<9&4294967295|R>>>23),R=V+(w^I&(N^w))+P[11]+643717713&4294967295,V=N+(R<<14&4294967295|R>>>18),R=I+(N^w&(V^N))+P[0]+3921069994&4294967295,I=V+(R<<20&4294967295|R>>>12),R=w+(V^N&(I^V))+P[5]+3593408605&4294967295,w=I+(R<<5&4294967295|R>>>27),R=N+(I^V&(w^I))+P[10]+38016083&4294967295,N=w+(R<<9&4294967295|R>>>23),R=V+(w^I&(N^w))+P[15]+3634488961&4294967295,V=N+(R<<14&4294967295|R>>>18),R=I+(N^w&(V^N))+P[4]+3889429448&4294967295,I=V+(R<<20&4294967295|R>>>12),R=w+(V^N&(I^V))+P[9]+568446438&4294967295,w=I+(R<<5&4294967295|R>>>27),R=N+(I^V&(w^I))+P[14]+3275163606&4294967295,N=w+(R<<9&4294967295|R>>>23),R=V+(w^I&(N^w))+P[3]+4107603335&4294967295,V=N+(R<<14&4294967295|R>>>18),R=I+(N^w&(V^N))+P[8]+1163531501&4294967295,I=V+(R<<20&4294967295|R>>>12),R=w+(V^N&(I^V))+P[13]+2850285829&4294967295,w=I+(R<<5&4294967295|R>>>27),R=N+(I^V&(w^I))+P[2]+4243563512&4294967295,N=w+(R<<9&4294967295|R>>>23),R=V+(w^I&(N^w))+P[7]+1735328473&4294967295,V=N+(R<<14&4294967295|R>>>18),R=I+(N^w&(V^N))+P[12]+2368359562&4294967295,I=V+(R<<20&4294967295|R>>>12),R=w+(I^V^N)+P[5]+4294588738&4294967295,w=I+(R<<4&4294967295|R>>>28),R=N+(w^I^V)+P[8]+2272392833&4294967295,N=w+(R<<11&4294967295|R>>>21),R=V+(N^w^I)+P[11]+1839030562&4294967295,V=N+(R<<16&4294967295|R>>>16),R=I+(V^N^w)+P[14]+4259657740&4294967295,I=V+(R<<23&4294967295|R>>>9),R=w+(I^V^N)+P[1]+2763975236&4294967295,w=I+(R<<4&4294967295|R>>>28),R=N+(w^I^V)+P[4]+1272893353&4294967295,N=w+(R<<11&4294967295|R>>>21),R=V+(N^w^I)+P[7]+4139469664&4294967295,V=N+(R<<16&4294967295|R>>>16),R=I+(V^N^w)+P[10]+3200236656&4294967295,I=V+(R<<23&4294967295|R>>>9),R=w+(I^V^N)+P[13]+681279174&4294967295,w=I+(R<<4&4294967295|R>>>28),R=N+(w^I^V)+P[0]+3936430074&4294967295,N=w+(R<<11&4294967295|R>>>21),R=V+(N^w^I)+P[3]+3572445317&4294967295,V=N+(R<<16&4294967295|R>>>16),R=I+(V^N^w)+P[6]+76029189&4294967295,I=V+(R<<23&4294967295|R>>>9),R=w+(I^V^N)+P[9]+3654602809&4294967295,w=I+(R<<4&4294967295|R>>>28),R=N+(w^I^V)+P[12]+3873151461&4294967295,N=w+(R<<11&4294967295|R>>>21),R=V+(N^w^I)+P[15]+530742520&4294967295,V=N+(R<<16&4294967295|R>>>16),R=I+(V^N^w)+P[2]+3299628645&4294967295,I=V+(R<<23&4294967295|R>>>9),R=w+(V^(I|~N))+P[0]+4096336452&4294967295,w=I+(R<<6&4294967295|R>>>26),R=N+(I^(w|~V))+P[7]+1126891415&4294967295,N=w+(R<<10&4294967295|R>>>22),R=V+(w^(N|~I))+P[14]+2878612391&4294967295,V=N+(R<<15&4294967295|R>>>17),R=I+(N^(V|~w))+P[5]+4237533241&4294967295,I=V+(R<<21&4294967295|R>>>11),R=w+(V^(I|~N))+P[12]+1700485571&4294967295,w=I+(R<<6&4294967295|R>>>26),R=N+(I^(w|~V))+P[3]+2399980690&4294967295,N=w+(R<<10&4294967295|R>>>22),R=V+(w^(N|~I))+P[10]+4293915773&4294967295,V=N+(R<<15&4294967295|R>>>17),R=I+(N^(V|~w))+P[1]+2240044497&4294967295,I=V+(R<<21&4294967295|R>>>11),R=w+(V^(I|~N))+P[8]+1873313359&4294967295,w=I+(R<<6&4294967295|R>>>26),R=N+(I^(w|~V))+P[15]+4264355552&4294967295,N=w+(R<<10&4294967295|R>>>22),R=V+(w^(N|~I))+P[6]+2734768916&4294967295,V=N+(R<<15&4294967295|R>>>17),R=I+(N^(V|~w))+P[13]+1309151649&4294967295,I=V+(R<<21&4294967295|R>>>11),R=w+(V^(I|~N))+P[4]+4149444226&4294967295,w=I+(R<<6&4294967295|R>>>26),R=N+(I^(w|~V))+P[11]+3174756917&4294967295,N=w+(R<<10&4294967295|R>>>22),R=V+(w^(N|~I))+P[2]+718787259&4294967295,V=N+(R<<15&4294967295|R>>>17),R=I+(N^(V|~w))+P[9]+3951481745&4294967295,S.g[0]=S.g[0]+w&4294967295,S.g[1]=S.g[1]+(V+(R<<21&4294967295|R>>>11))&4294967295,S.g[2]=S.g[2]+V&4294967295,S.g[3]=S.g[3]+N&4294967295}s.prototype.u=function(S,w){w===void 0&&(w=S.length);for(var I=w-this.blockSize,P=this.B,V=this.h,N=0;N<w;){if(V==0)for(;N<=I;)r(this,S,N),N+=this.blockSize;if(typeof S=="string"){for(;N<w;)if(P[V++]=S.charCodeAt(N++),V==this.blockSize){r(this,P),V=0;break}}else for(;N<w;)if(P[V++]=S[N++],V==this.blockSize){r(this,P),V=0;break}}this.h=V,this.o+=w},s.prototype.v=function(){var S=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);S[0]=128;for(var w=1;w<S.length-8;++w)S[w]=0;var I=8*this.o;for(w=S.length-8;w<S.length;++w)S[w]=I&255,I/=256;for(this.u(S),S=Array(16),w=I=0;4>w;++w)for(var P=0;32>P;P+=8)S[I++]=this.g[w]>>>P&255;return S};function i(S,w){var I=l;return Object.prototype.hasOwnProperty.call(I,S)?I[S]:I[S]=w(S)}function o(S,w){this.h=w;for(var I=[],P=!0,V=S.length-1;0<=V;V--){var N=S[V]|0;P&&N==w||(I[V]=N,P=!1)}this.g=I}var l={};function u(S){return-128<=S&&128>S?i(S,function(w){return new o([w|0],0>w?-1:0)}):new o([S|0],0>S?-1:0)}function c(S){if(isNaN(S)||!isFinite(S))return p;if(0>S)return E(c(-S));for(var w=[],I=1,P=0;S>=I;P++)w[P]=S/I|0,I*=4294967296;return new o(w,0)}function f(S,w){if(S.length==0)throw Error("number format error: empty string");if(w=w||10,2>w||36<w)throw Error("radix out of range: "+w);if(S.charAt(0)=="-")return E(f(S.substring(1),w));if(0<=S.indexOf("-"))throw Error('number format error: interior "-" character');for(var I=c(Math.pow(w,8)),P=p,V=0;V<S.length;V+=8){var N=Math.min(8,S.length-V),R=parseInt(S.substring(V,V+N),w);8>N?(N=c(Math.pow(w,N)),P=P.j(N).add(c(R))):(P=P.j(I),P=P.add(c(R)))}return P}var p=u(0),g=u(1),_=u(16777216);t=o.prototype,t.m=function(){if(y(this))return-E(this).m();for(var S=0,w=1,I=0;I<this.g.length;I++){var P=this.i(I);S+=(0<=P?P:4294967296+P)*w,w*=4294967296}return S},t.toString=function(S){if(S=S||10,2>S||36<S)throw Error("radix out of range: "+S);if(b(this))return"0";if(y(this))return"-"+E(this).toString(S);for(var w=c(Math.pow(S,6)),I=this,P="";;){var V=M(I,w).g;I=k(I,V.j(w));var N=((0<I.g.length?I.g[0]:I.h)>>>0).toString(S);if(I=V,b(I))return N+P;for(;6>N.length;)N="0"+N;P=N+P}},t.i=function(S){return 0>S?0:S<this.g.length?this.g[S]:this.h};function b(S){if(S.h!=0)return!1;for(var w=0;w<S.g.length;w++)if(S.g[w]!=0)return!1;return!0}function y(S){return S.h==-1}t.l=function(S){return S=k(this,S),y(S)?-1:b(S)?0:1};function E(S){for(var w=S.g.length,I=[],P=0;P<w;P++)I[P]=~S.g[P];return new o(I,~S.h).add(g)}t.abs=function(){return y(this)?E(this):this},t.add=function(S){for(var w=Math.max(this.g.length,S.g.length),I=[],P=0,V=0;V<=w;V++){var N=P+(this.i(V)&65535)+(S.i(V)&65535),R=(N>>>16)+(this.i(V)>>>16)+(S.i(V)>>>16);P=R>>>16,N&=65535,R&=65535,I[V]=R<<16|N}return new o(I,I[I.length-1]&-2147483648?-1:0)};function k(S,w){return S.add(E(w))}t.j=function(S){if(b(this)||b(S))return p;if(y(this))return y(S)?E(this).j(E(S)):E(E(this).j(S));if(y(S))return E(this.j(E(S)));if(0>this.l(_)&&0>S.l(_))return c(this.m()*S.m());for(var w=this.g.length+S.g.length,I=[],P=0;P<2*w;P++)I[P]=0;for(P=0;P<this.g.length;P++)for(var V=0;V<S.g.length;V++){var N=this.i(P)>>>16,R=this.i(P)&65535,kt=S.i(V)>>>16,zt=S.i(V)&65535;I[2*P+2*V]+=R*zt,C(I,2*P+2*V),I[2*P+2*V+1]+=N*zt,C(I,2*P+2*V+1),I[2*P+2*V+1]+=R*kt,C(I,2*P+2*V+1),I[2*P+2*V+2]+=N*kt,C(I,2*P+2*V+2)}for(P=0;P<w;P++)I[P]=I[2*P+1]<<16|I[2*P];for(P=w;P<2*w;P++)I[P]=0;return new o(I,0)};function C(S,w){for(;(S[w]&65535)!=S[w];)S[w+1]+=S[w]>>>16,S[w]&=65535,w++}function x(S,w){this.g=S,this.h=w}function M(S,w){if(b(w))throw Error("division by zero");if(b(S))return new x(p,p);if(y(S))return w=M(E(S),w),new x(E(w.g),E(w.h));if(y(w))return w=M(S,E(w)),new x(E(w.g),w.h);if(30<S.g.length){if(y(S)||y(w))throw Error("slowDivide_ only works with positive integers.");for(var I=g,P=w;0>=P.l(S);)I=W(I),P=W(P);var V=le(I,1),N=le(P,1);for(P=le(P,2),I=le(I,2);!b(P);){var R=N.add(P);0>=R.l(S)&&(V=V.add(I),N=R),P=le(P,1),I=le(I,1)}return w=k(S,V.j(w)),new x(V,w)}for(V=p;0<=S.l(w);){for(I=Math.max(1,Math.floor(S.m()/w.m())),P=Math.ceil(Math.log(I)/Math.LN2),P=48>=P?1:Math.pow(2,P-48),N=c(I),R=N.j(w);y(R)||0<R.l(S);)I-=P,N=c(I),R=N.j(w);b(N)&&(N=g),V=V.add(N),S=k(S,R)}return new x(V,S)}t.A=function(S){return M(this,S).h},t.and=function(S){for(var w=Math.max(this.g.length,S.g.length),I=[],P=0;P<w;P++)I[P]=this.i(P)&S.i(P);return new o(I,this.h&S.h)},t.or=function(S){for(var w=Math.max(this.g.length,S.g.length),I=[],P=0;P<w;P++)I[P]=this.i(P)|S.i(P);return new o(I,this.h|S.h)},t.xor=function(S){for(var w=Math.max(this.g.length,S.g.length),I=[],P=0;P<w;P++)I[P]=this.i(P)^S.i(P);return new o(I,this.h^S.h)};function W(S){for(var w=S.g.length+1,I=[],P=0;P<w;P++)I[P]=S.i(P)<<1|S.i(P-1)>>>31;return new o(I,S.h)}function le(S,w){var I=w>>5;w%=32;for(var P=S.g.length-I,V=[],N=0;N<P;N++)V[N]=0<w?S.i(N+I)>>>w|S.i(N+I+1)<<32-w:S.i(N+I);return new o(V,S.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,xg=s,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=c,o.fromString=f,_s=o}).apply(typeof ff<"u"?ff:typeof self<"u"?self:typeof window<"u"?window:{});var Ro=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Vg,li,Dg,$o,pu,Ng,Og,Mg;(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,h,m){return a==Array.prototype||a==Object.prototype||(a[h]=m.value),a};function n(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Ro=="object"&&Ro];for(var h=0;h<a.length;++h){var m=a[h];if(m&&m.Math==Math)return m}throw Error("Cannot find global object")}var s=n(this);function r(a,h){if(h)e:{var m=s;a=a.split(".");for(var v=0;v<a.length-1;v++){var O=a[v];if(!(O in m))break e;m=m[O]}a=a[a.length-1],v=m[a],h=h(v),h!=v&&h!=null&&e(m,a,{configurable:!0,writable:!0,value:h})}}function i(a,h){a instanceof String&&(a+="");var m=0,v=!1,O={next:function(){if(!v&&m<a.length){var L=m++;return{value:h(L,a[L]),done:!1}}return v=!0,{done:!0,value:void 0}}};return O[Symbol.iterator]=function(){return O},O}r("Array.prototype.values",function(a){return a||function(){return i(this,function(h,m){return m})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function u(a){var h=typeof a;return h=h!="object"?h:a?Array.isArray(a)?"array":h:"null",h=="array"||h=="object"&&typeof a.length=="number"}function c(a){var h=typeof a;return h=="object"&&a!=null||h=="function"}function f(a,h,m){return a.call.apply(a.bind,arguments)}function p(a,h,m){if(!a)throw Error();if(2<arguments.length){var v=Array.prototype.slice.call(arguments,2);return function(){var O=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(O,v),a.apply(h,O)}}return function(){return a.apply(h,arguments)}}function g(a,h,m){return g=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:p,g.apply(null,arguments)}function _(a,h){var m=Array.prototype.slice.call(arguments,1);return function(){var v=m.slice();return v.push.apply(v,arguments),a.apply(this,v)}}function b(a,h){function m(){}m.prototype=h.prototype,a.aa=h.prototype,a.prototype=new m,a.prototype.constructor=a,a.Qb=function(v,O,L){for(var X=Array(arguments.length-2),Le=2;Le<arguments.length;Le++)X[Le-2]=arguments[Le];return h.prototype[O].apply(v,X)}}function y(a){const h=a.length;if(0<h){const m=Array(h);for(let v=0;v<h;v++)m[v]=a[v];return m}return[]}function E(a,h){for(let m=1;m<arguments.length;m++){const v=arguments[m];if(u(v)){const O=a.length||0,L=v.length||0;a.length=O+L;for(let X=0;X<L;X++)a[O+X]=v[X]}else a.push(v)}}class k{constructor(h,m){this.i=h,this.j=m,this.h=0,this.g=null}get(){let h;return 0<this.h?(this.h--,h=this.g,this.g=h.next,h.next=null):h=this.i(),h}}function C(a){return/^[\s\xa0]*$/.test(a)}function x(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function M(a){return M[" "](a),a}M[" "]=function(){};var W=x().indexOf("Gecko")!=-1&&!(x().toLowerCase().indexOf("webkit")!=-1&&x().indexOf("Edge")==-1)&&!(x().indexOf("Trident")!=-1||x().indexOf("MSIE")!=-1)&&x().indexOf("Edge")==-1;function le(a,h,m){for(const v in a)h.call(m,a[v],v,a)}function S(a,h){for(const m in a)h.call(void 0,a[m],m,a)}function w(a){const h={};for(const m in a)h[m]=a[m];return h}const I="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function P(a,h){let m,v;for(let O=1;O<arguments.length;O++){v=arguments[O];for(m in v)a[m]=v[m];for(let L=0;L<I.length;L++)m=I[L],Object.prototype.hasOwnProperty.call(v,m)&&(a[m]=v[m])}}function V(a){var h=1;a=a.split(":");const m=[];for(;0<h&&a.length;)m.push(a.shift()),h--;return a.length&&m.push(a.join(":")),m}function N(a){l.setTimeout(()=>{throw a},0)}function R(){var a=$t;let h=null;return a.g&&(h=a.g,a.g=a.g.next,a.g||(a.h=null),h.next=null),h}class kt{constructor(){this.h=this.g=null}add(h,m){const v=zt.get();v.set(h,m),this.h?this.h.next=v:this.g=v,this.h=v}}var zt=new k(()=>new Je,a=>a.reset());class Je{constructor(){this.next=this.g=this.h=null}set(h,m){this.h=h,this.g=m,this.next=null}reset(){this.next=this.g=this.h=null}}let Se,Te=!1,$t=new kt,nn=()=>{const a=l.Promise.resolve(void 0);Se=()=>{a.then(Gt)}};var Gt=()=>{for(var a;a=R();){try{a.h.call(a.g)}catch(m){N(m)}var h=zt;h.j(a),100>h.h&&(h.h++,a.next=h.g,h.g=a)}Te=!1};function He(){this.s=this.s,this.C=this.C}He.prototype.s=!1,He.prototype.ma=function(){this.s||(this.s=!0,this.N())},He.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Ke(a,h){this.type=a,this.g=this.target=h,this.defaultPrevented=!1}Ke.prototype.h=function(){this.defaultPrevented=!0};var Xn=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,h=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const m=()=>{};l.addEventListener("test",m,h),l.removeEventListener("test",m,h)}catch{}return a}();function gn(a,h){if(Ke.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var m=this.type=a.type,v=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=h,h=a.relatedTarget){if(W){e:{try{M(h.nodeName);var O=!0;break e}catch{}O=!1}O||(h=null)}}else m=="mouseover"?h=a.fromElement:m=="mouseout"&&(h=a.toElement);this.relatedTarget=h,v?(this.clientX=v.clientX!==void 0?v.clientX:v.pageX,this.clientY=v.clientY!==void 0?v.clientY:v.pageY,this.screenX=v.screenX||0,this.screenY=v.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:Ot[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&gn.aa.h.call(this)}}b(gn,Ke);var Ot={2:"touch",3:"pen",4:"mouse"};gn.prototype.h=function(){gn.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var U="closure_listenable_"+(1e6*Math.random()|0),ne=0;function te(a,h,m,v,O){this.listener=a,this.proxy=null,this.src=h,this.type=m,this.capture=!!v,this.ha=O,this.key=++ne,this.da=this.fa=!1}function oe(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function ke(a){this.src=a,this.g={},this.h=0}ke.prototype.add=function(a,h,m,v,O){var L=a.toString();a=this.g[L],a||(a=this.g[L]=[],this.h++);var X=A(a,h,v,O);return-1<X?(h=a[X],m||(h.fa=!1)):(h=new te(h,this.src,L,!!v,O),h.fa=m,a.push(h)),h};function T(a,h){var m=h.type;if(m in a.g){var v=a.g[m],O=Array.prototype.indexOf.call(v,h,void 0),L;(L=0<=O)&&Array.prototype.splice.call(v,O,1),L&&(oe(h),a.g[m].length==0&&(delete a.g[m],a.h--))}}function A(a,h,m,v){for(var O=0;O<a.length;++O){var L=a[O];if(!L.da&&L.listener==h&&L.capture==!!m&&L.ha==v)return O}return-1}var D="closure_lm_"+(1e6*Math.random()|0),F={};function q(a,h,m,v,O){if(Array.isArray(h)){for(var L=0;L<h.length;L++)q(a,h[L],m,v,O);return null}return m=_e(m),a&&a[U]?a.K(h,m,c(v)?!!v.capture:!1,O):$(a,h,m,!1,v,O)}function $(a,h,m,v,O,L){if(!h)throw Error("Invalid event type");var X=c(O)?!!O.capture:!!O,Le=Z(a);if(Le||(a[D]=Le=new ke(a)),m=Le.add(h,m,v,X,L),m.proxy)return m;if(v=ee(),m.proxy=v,v.src=a,v.listener=m,a.addEventListener)Xn||(O=X),O===void 0&&(O=!1),a.addEventListener(h.toString(),v,O);else if(a.attachEvent)a.attachEvent(H(h.toString()),v);else if(a.addListener&&a.removeListener)a.addListener(v);else throw Error("addEventListener and attachEvent are unavailable.");return m}function ee(){function a(m){return h.call(a.src,a.listener,m)}const h=ue;return a}function J(a,h,m,v,O){if(Array.isArray(h))for(var L=0;L<h.length;L++)J(a,h[L],m,v,O);else v=c(v)?!!v.capture:!!v,m=_e(m),a&&a[U]?(a=a.i,h=String(h).toString(),h in a.g&&(L=a.g[h],m=A(L,m,v,O),-1<m&&(oe(L[m]),Array.prototype.splice.call(L,m,1),L.length==0&&(delete a.g[h],a.h--)))):a&&(a=Z(a))&&(h=a.g[h.toString()],a=-1,h&&(a=A(h,m,v,O)),(m=-1<a?h[a]:null)&&Q(m))}function Q(a){if(typeof a!="number"&&a&&!a.da){var h=a.src;if(h&&h[U])T(h.i,a);else{var m=a.type,v=a.proxy;h.removeEventListener?h.removeEventListener(m,v,a.capture):h.detachEvent?h.detachEvent(H(m),v):h.addListener&&h.removeListener&&h.removeListener(v),(m=Z(h))?(T(m,a),m.h==0&&(m.src=null,h[D]=null)):oe(a)}}}function H(a){return a in F?F[a]:F[a]="on"+a}function ue(a,h){if(a.da)a=!0;else{h=new gn(h,this);var m=a.listener,v=a.ha||a.src;a.fa&&Q(a),a=m.call(v,h)}return a}function Z(a){return a=a[D],a instanceof ke?a:null}var ae="__closure_events_fn_"+(1e9*Math.random()>>>0);function _e(a){return typeof a=="function"?a:(a[ae]||(a[ae]=function(h){return a.handleEvent(h)}),a[ae])}function de(){He.call(this),this.i=new ke(this),this.M=this,this.F=null}b(de,He),de.prototype[U]=!0,de.prototype.removeEventListener=function(a,h,m,v){J(this,a,h,m,v)};function Ee(a,h){var m,v=a.F;if(v)for(m=[];v;v=v.F)m.push(v);if(a=a.M,v=h.type||h,typeof h=="string")h=new Ke(h,a);else if(h instanceof Ke)h.target=h.target||a;else{var O=h;h=new Ke(v,a),P(h,O)}if(O=!0,m)for(var L=m.length-1;0<=L;L--){var X=h.g=m[L];O=Ce(X,v,!0,h)&&O}if(X=h.g=a,O=Ce(X,v,!0,h)&&O,O=Ce(X,v,!1,h)&&O,m)for(L=0;L<m.length;L++)X=h.g=m[L],O=Ce(X,v,!1,h)&&O}de.prototype.N=function(){if(de.aa.N.call(this),this.i){var a=this.i,h;for(h in a.g){for(var m=a.g[h],v=0;v<m.length;v++)oe(m[v]);delete a.g[h],a.h--}}this.F=null},de.prototype.K=function(a,h,m,v){return this.i.add(String(a),h,!1,m,v)},de.prototype.L=function(a,h,m,v){return this.i.add(String(a),h,!0,m,v)};function Ce(a,h,m,v){if(h=a.i.g[String(h)],!h)return!0;h=h.concat();for(var O=!0,L=0;L<h.length;++L){var X=h[L];if(X&&!X.da&&X.capture==m){var Le=X.listener,ht=X.ha||X.src;X.fa&&T(a.i,X),O=Le.call(ht,v)!==!1&&O}}return O&&!v.defaultPrevented}function _t(a,h,m){if(typeof a=="function")m&&(a=g(a,m));else if(a&&typeof a.handleEvent=="function")a=g(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(h)?-1:l.setTimeout(a,h||0)}function ut(a){a.g=_t(()=>{a.g=null,a.i&&(a.i=!1,ut(a))},a.l);const h=a.h;a.h=null,a.m.apply(null,h)}class Wt extends He{constructor(h,m){super(),this.m=h,this.l=m,this.h=null,this.i=!1,this.g=null}j(h){this.h=arguments,this.g?this.i=!0:ut(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function yt(a){He.call(this),this.h=a,this.g={}}b(yt,He);var Zn=[];function qr(a){le(a.g,function(h,m){this.g.hasOwnProperty(m)&&Q(h)},a),a.g={}}yt.prototype.N=function(){yt.aa.N.call(this),qr(this)},yt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ct=l.JSON.stringify,Qt=l.JSON.parse,ro=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function ul(){}ul.prototype.h=null;function Yc(a){return a.h||(a.h=a.i())}function Jc(){}var Hr={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function cl(){Ke.call(this,"d")}b(cl,Ke);function hl(){Ke.call(this,"c")}b(hl,Ke);var Vs={},Xc=null;function io(){return Xc=Xc||new de}Vs.La="serverreachability";function Zc(a){Ke.call(this,Vs.La,a)}b(Zc,Ke);function Kr(a){const h=io();Ee(h,new Zc(h))}Vs.STAT_EVENT="statevent";function eh(a,h){Ke.call(this,Vs.STAT_EVENT,a),this.stat=h}b(eh,Ke);function xt(a){const h=io();Ee(h,new eh(h,a))}Vs.Ma="timingevent";function th(a,h){Ke.call(this,Vs.Ma,a),this.size=h}b(th,Ke);function zr(a,h){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},h)}function Gr(){this.g=!0}Gr.prototype.xa=function(){this.g=!1};function yy(a,h,m,v,O,L){a.info(function(){if(a.g)if(L)for(var X="",Le=L.split("&"),ht=0;ht<Le.length;ht++){var xe=Le[ht].split("=");if(1<xe.length){var vt=xe[0];xe=xe[1];var bt=vt.split("_");X=2<=bt.length&&bt[1]=="type"?X+(vt+"="+xe+"&"):X+(vt+"=redacted&")}}else X=null;else X=L;return"XMLHTTP REQ ("+v+") [attempt "+O+"]: "+h+`
`+m+`
`+X})}function vy(a,h,m,v,O,L,X){a.info(function(){return"XMLHTTP RESP ("+v+") [ attempt "+O+"]: "+h+`
`+m+`
`+L+" "+X})}function er(a,h,m,v){a.info(function(){return"XMLHTTP TEXT ("+h+"): "+Ey(a,m)+(v?" "+v:"")})}function by(a,h){a.info(function(){return"TIMEOUT: "+h})}Gr.prototype.info=function(){};function Ey(a,h){if(!a.g)return h;if(!h)return null;try{var m=JSON.parse(h);if(m){for(a=0;a<m.length;a++)if(Array.isArray(m[a])){var v=m[a];if(!(2>v.length)){var O=v[1];if(Array.isArray(O)&&!(1>O.length)){var L=O[0];if(L!="noop"&&L!="stop"&&L!="close")for(var X=1;X<O.length;X++)O[X]=""}}}}return ct(m)}catch{return h}}var oo={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},nh={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},dl;function ao(){}b(ao,ul),ao.prototype.g=function(){return new XMLHttpRequest},ao.prototype.i=function(){return{}},dl=new ao;function es(a,h,m,v){this.j=a,this.i=h,this.l=m,this.R=v||1,this.U=new yt(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new sh}function sh(){this.i=null,this.g="",this.h=!1}var rh={},fl={};function pl(a,h,m){a.L=1,a.v=ho(kn(h)),a.m=m,a.P=!0,ih(a,null)}function ih(a,h){a.F=Date.now(),lo(a),a.A=kn(a.v);var m=a.A,v=a.R;Array.isArray(v)||(v=[String(v)]),vh(m.i,"t",v),a.C=0,m=a.j.J,a.h=new sh,a.g=Lh(a.j,m?h:null,!a.m),0<a.O&&(a.M=new Wt(g(a.Y,a,a.g),a.O)),h=a.U,m=a.g,v=a.ca;var O="readystatechange";Array.isArray(O)||(O&&(Zn[0]=O.toString()),O=Zn);for(var L=0;L<O.length;L++){var X=q(m,O[L],v||h.handleEvent,!1,h.h||h);if(!X)break;h.g[X.key]=X}h=a.H?w(a.H):{},a.m?(a.u||(a.u="POST"),h["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,h)):(a.u="GET",a.g.ea(a.A,a.u,null,h)),Kr(),yy(a.i,a.u,a.A,a.l,a.R,a.m)}es.prototype.ca=function(a){a=a.target;const h=this.M;h&&xn(a)==3?h.j():this.Y(a)},es.prototype.Y=function(a){try{if(a==this.g)e:{const bt=xn(this.g);var h=this.g.Ba();const sr=this.g.Z();if(!(3>bt)&&(bt!=3||this.g&&(this.h.h||this.g.oa()||Rh(this.g)))){this.J||bt!=4||h==7||(h==8||0>=sr?Kr(3):Kr(2)),ml(this);var m=this.g.Z();this.X=m;t:if(oh(this)){var v=Rh(this.g);a="";var O=v.length,L=xn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Ds(this),Wr(this);var X="";break t}this.h.i=new l.TextDecoder}for(h=0;h<O;h++)this.h.h=!0,a+=this.h.i.decode(v[h],{stream:!(L&&h==O-1)});v.length=0,this.h.g+=a,this.C=0,X=this.h.g}else X=this.g.oa();if(this.o=m==200,vy(this.i,this.u,this.A,this.l,this.R,bt,m),this.o){if(this.T&&!this.K){t:{if(this.g){var Le,ht=this.g;if((Le=ht.g?ht.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!C(Le)){var xe=Le;break t}}xe=null}if(m=xe)er(this.i,this.l,m,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,gl(this,m);else{this.o=!1,this.s=3,xt(12),Ds(this),Wr(this);break e}}if(this.P){m=!0;let sn;for(;!this.J&&this.C<X.length;)if(sn=wy(this,X),sn==fl){bt==4&&(this.s=4,xt(14),m=!1),er(this.i,this.l,null,"[Incomplete Response]");break}else if(sn==rh){this.s=4,xt(15),er(this.i,this.l,X,"[Invalid Chunk]"),m=!1;break}else er(this.i,this.l,sn,null),gl(this,sn);if(oh(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),bt!=4||X.length!=0||this.h.h||(this.s=1,xt(16),m=!1),this.o=this.o&&m,!m)er(this.i,this.l,X,"[Invalid Chunked Response]"),Ds(this),Wr(this);else if(0<X.length&&!this.W){this.W=!0;var vt=this.j;vt.g==this&&vt.ba&&!vt.M&&(vt.j.info("Great, no buffering proxy detected. Bytes received: "+X.length),wl(vt),vt.M=!0,xt(11))}}else er(this.i,this.l,X,null),gl(this,X);bt==4&&Ds(this),this.o&&!this.J&&(bt==4?Dh(this.j,this):(this.o=!1,lo(this)))}else Fy(this.g),m==400&&0<X.indexOf("Unknown SID")?(this.s=3,xt(12)):(this.s=0,xt(13)),Ds(this),Wr(this)}}}catch{}finally{}};function oh(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function wy(a,h){var m=a.C,v=h.indexOf(`
`,m);return v==-1?fl:(m=Number(h.substring(m,v)),isNaN(m)?rh:(v+=1,v+m>h.length?fl:(h=h.slice(v,v+m),a.C=v+m,h)))}es.prototype.cancel=function(){this.J=!0,Ds(this)};function lo(a){a.S=Date.now()+a.I,ah(a,a.I)}function ah(a,h){if(a.B!=null)throw Error("WatchDog timer not null");a.B=zr(g(a.ba,a),h)}function ml(a){a.B&&(l.clearTimeout(a.B),a.B=null)}es.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(by(this.i,this.A),this.L!=2&&(Kr(),xt(17)),Ds(this),this.s=2,Wr(this)):ah(this,this.S-a)};function Wr(a){a.j.G==0||a.J||Dh(a.j,a)}function Ds(a){ml(a);var h=a.M;h&&typeof h.ma=="function"&&h.ma(),a.M=null,qr(a.U),a.g&&(h=a.g,a.g=null,h.abort(),h.ma())}function gl(a,h){try{var m=a.j;if(m.G!=0&&(m.g==a||_l(m.h,a))){if(!a.K&&_l(m.h,a)&&m.G==3){try{var v=m.Da.g.parse(h)}catch{v=null}if(Array.isArray(v)&&v.length==3){var O=v;if(O[0]==0){e:if(!m.u){if(m.g)if(m.g.F+3e3<a.F)yo(m),go(m);else break e;El(m),xt(18)}}else m.za=O[1],0<m.za-m.T&&37500>O[2]&&m.F&&m.v==0&&!m.C&&(m.C=zr(g(m.Za,m),6e3));if(1>=ch(m.h)&&m.ca){try{m.ca()}catch{}m.ca=void 0}}else Os(m,11)}else if((a.K||m.g==a)&&yo(m),!C(h))for(O=m.Da.g.parse(h),h=0;h<O.length;h++){let xe=O[h];if(m.T=xe[0],xe=xe[1],m.G==2)if(xe[0]=="c"){m.K=xe[1],m.ia=xe[2];const vt=xe[3];vt!=null&&(m.la=vt,m.j.info("VER="+m.la));const bt=xe[4];bt!=null&&(m.Aa=bt,m.j.info("SVER="+m.Aa));const sr=xe[5];sr!=null&&typeof sr=="number"&&0<sr&&(v=1.5*sr,m.L=v,m.j.info("backChannelRequestTimeoutMs_="+v)),v=m;const sn=a.g;if(sn){const bo=sn.g?sn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(bo){var L=v.h;L.g||bo.indexOf("spdy")==-1&&bo.indexOf("quic")==-1&&bo.indexOf("h2")==-1||(L.j=L.l,L.g=new Set,L.h&&(yl(L,L.h),L.h=null))}if(v.D){const Tl=sn.g?sn.g.getResponseHeader("X-HTTP-Session-Id"):null;Tl&&(v.ya=Tl,Be(v.I,v.D,Tl))}}m.G=3,m.l&&m.l.ua(),m.ba&&(m.R=Date.now()-a.F,m.j.info("Handshake RTT: "+m.R+"ms")),v=m;var X=a;if(v.qa=Mh(v,v.J?v.ia:null,v.W),X.K){hh(v.h,X);var Le=X,ht=v.L;ht&&(Le.I=ht),Le.B&&(ml(Le),lo(Le)),v.g=X}else xh(v);0<m.i.length&&_o(m)}else xe[0]!="stop"&&xe[0]!="close"||Os(m,7);else m.G==3&&(xe[0]=="stop"||xe[0]=="close"?xe[0]=="stop"?Os(m,7):bl(m):xe[0]!="noop"&&m.l&&m.l.ta(xe),m.v=0)}}Kr(4)}catch{}}var Ty=class{constructor(a,h){this.g=a,this.map=h}};function lh(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function uh(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function ch(a){return a.h?1:a.g?a.g.size:0}function _l(a,h){return a.h?a.h==h:a.g?a.g.has(h):!1}function yl(a,h){a.g?a.g.add(h):a.h=h}function hh(a,h){a.h&&a.h==h?a.h=null:a.g&&a.g.has(h)&&a.g.delete(h)}lh.prototype.cancel=function(){if(this.i=dh(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function dh(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let h=a.i;for(const m of a.g.values())h=h.concat(m.D);return h}return y(a.i)}function Iy(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(u(a)){for(var h=[],m=a.length,v=0;v<m;v++)h.push(a[v]);return h}h=[],m=0;for(v in a)h[m++]=a[v];return h}function Ay(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(u(a)||typeof a=="string"){var h=[];a=a.length;for(var m=0;m<a;m++)h.push(m);return h}h=[],m=0;for(const v in a)h[m++]=v;return h}}}function fh(a,h){if(a.forEach&&typeof a.forEach=="function")a.forEach(h,void 0);else if(u(a)||typeof a=="string")Array.prototype.forEach.call(a,h,void 0);else for(var m=Ay(a),v=Iy(a),O=v.length,L=0;L<O;L++)h.call(void 0,v[L],m&&m[L],a)}var ph=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Ry(a,h){if(a){a=a.split("&");for(var m=0;m<a.length;m++){var v=a[m].indexOf("="),O=null;if(0<=v){var L=a[m].substring(0,v);O=a[m].substring(v+1)}else L=a[m];h(L,O?decodeURIComponent(O.replace(/\+/g," ")):"")}}}function Ns(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof Ns){this.h=a.h,uo(this,a.j),this.o=a.o,this.g=a.g,co(this,a.s),this.l=a.l;var h=a.i,m=new Jr;m.i=h.i,h.g&&(m.g=new Map(h.g),m.h=h.h),mh(this,m),this.m=a.m}else a&&(h=String(a).match(ph))?(this.h=!1,uo(this,h[1]||"",!0),this.o=Qr(h[2]||""),this.g=Qr(h[3]||"",!0),co(this,h[4]),this.l=Qr(h[5]||"",!0),mh(this,h[6]||"",!0),this.m=Qr(h[7]||"")):(this.h=!1,this.i=new Jr(null,this.h))}Ns.prototype.toString=function(){var a=[],h=this.j;h&&a.push(Yr(h,gh,!0),":");var m=this.g;return(m||h=="file")&&(a.push("//"),(h=this.o)&&a.push(Yr(h,gh,!0),"@"),a.push(encodeURIComponent(String(m)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),m=this.s,m!=null&&a.push(":",String(m))),(m=this.l)&&(this.g&&m.charAt(0)!="/"&&a.push("/"),a.push(Yr(m,m.charAt(0)=="/"?Py:Cy,!0))),(m=this.i.toString())&&a.push("?",m),(m=this.m)&&a.push("#",Yr(m,xy)),a.join("")};function kn(a){return new Ns(a)}function uo(a,h,m){a.j=m?Qr(h,!0):h,a.j&&(a.j=a.j.replace(/:$/,""))}function co(a,h){if(h){if(h=Number(h),isNaN(h)||0>h)throw Error("Bad port number "+h);a.s=h}else a.s=null}function mh(a,h,m){h instanceof Jr?(a.i=h,Vy(a.i,a.h)):(m||(h=Yr(h,ky)),a.i=new Jr(h,a.h))}function Be(a,h,m){a.i.set(h,m)}function ho(a){return Be(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function Qr(a,h){return a?h?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function Yr(a,h,m){return typeof a=="string"?(a=encodeURI(a).replace(h,Sy),m&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function Sy(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var gh=/[#\/\?@]/g,Cy=/[#\?:]/g,Py=/[#\?]/g,ky=/[#\?@]/g,xy=/#/g;function Jr(a,h){this.h=this.g=null,this.i=a||null,this.j=!!h}function ts(a){a.g||(a.g=new Map,a.h=0,a.i&&Ry(a.i,function(h,m){a.add(decodeURIComponent(h.replace(/\+/g," ")),m)}))}t=Jr.prototype,t.add=function(a,h){ts(this),this.i=null,a=tr(this,a);var m=this.g.get(a);return m||this.g.set(a,m=[]),m.push(h),this.h+=1,this};function _h(a,h){ts(a),h=tr(a,h),a.g.has(h)&&(a.i=null,a.h-=a.g.get(h).length,a.g.delete(h))}function yh(a,h){return ts(a),h=tr(a,h),a.g.has(h)}t.forEach=function(a,h){ts(this),this.g.forEach(function(m,v){m.forEach(function(O){a.call(h,O,v,this)},this)},this)},t.na=function(){ts(this);const a=Array.from(this.g.values()),h=Array.from(this.g.keys()),m=[];for(let v=0;v<h.length;v++){const O=a[v];for(let L=0;L<O.length;L++)m.push(h[v])}return m},t.V=function(a){ts(this);let h=[];if(typeof a=="string")yh(this,a)&&(h=h.concat(this.g.get(tr(this,a))));else{a=Array.from(this.g.values());for(let m=0;m<a.length;m++)h=h.concat(a[m])}return h},t.set=function(a,h){return ts(this),this.i=null,a=tr(this,a),yh(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[h]),this.h+=1,this},t.get=function(a,h){return a?(a=this.V(a),0<a.length?String(a[0]):h):h};function vh(a,h,m){_h(a,h),0<m.length&&(a.i=null,a.g.set(tr(a,h),y(m)),a.h+=m.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],h=Array.from(this.g.keys());for(var m=0;m<h.length;m++){var v=h[m];const L=encodeURIComponent(String(v)),X=this.V(v);for(v=0;v<X.length;v++){var O=L;X[v]!==""&&(O+="="+encodeURIComponent(String(X[v]))),a.push(O)}}return this.i=a.join("&")};function tr(a,h){return h=String(h),a.j&&(h=h.toLowerCase()),h}function Vy(a,h){h&&!a.j&&(ts(a),a.i=null,a.g.forEach(function(m,v){var O=v.toLowerCase();v!=O&&(_h(this,v),vh(this,O,m))},a)),a.j=h}function Dy(a,h){const m=new Gr;if(l.Image){const v=new Image;v.onload=_(ns,m,"TestLoadImage: loaded",!0,h,v),v.onerror=_(ns,m,"TestLoadImage: error",!1,h,v),v.onabort=_(ns,m,"TestLoadImage: abort",!1,h,v),v.ontimeout=_(ns,m,"TestLoadImage: timeout",!1,h,v),l.setTimeout(function(){v.ontimeout&&v.ontimeout()},1e4),v.src=a}else h(!1)}function Ny(a,h){const m=new Gr,v=new AbortController,O=setTimeout(()=>{v.abort(),ns(m,"TestPingServer: timeout",!1,h)},1e4);fetch(a,{signal:v.signal}).then(L=>{clearTimeout(O),L.ok?ns(m,"TestPingServer: ok",!0,h):ns(m,"TestPingServer: server error",!1,h)}).catch(()=>{clearTimeout(O),ns(m,"TestPingServer: error",!1,h)})}function ns(a,h,m,v,O){try{O&&(O.onload=null,O.onerror=null,O.onabort=null,O.ontimeout=null),v(m)}catch{}}function Oy(){this.g=new ro}function My(a,h,m){const v=m||"";try{fh(a,function(O,L){let X=O;c(O)&&(X=ct(O)),h.push(v+L+"="+encodeURIComponent(X))})}catch(O){throw h.push(v+"type="+encodeURIComponent("_badmap")),O}}function fo(a){this.l=a.Ub||null,this.j=a.eb||!1}b(fo,ul),fo.prototype.g=function(){return new po(this.l,this.j)},fo.prototype.i=function(a){return function(){return a}}({});function po(a,h){de.call(this),this.D=a,this.o=h,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}b(po,de),t=po.prototype,t.open=function(a,h){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=h,this.readyState=1,Zr(this)},t.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const h={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(h.body=a),(this.D||l).fetch(new Request(this.A,h)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Xr(this)),this.readyState=0},t.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Zr(this)),this.g&&(this.readyState=3,Zr(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;bh(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function bh(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}t.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var h=a.value?a.value:new Uint8Array(0);(h=this.v.decode(h,{stream:!a.done}))&&(this.response=this.responseText+=h)}a.done?Xr(this):Zr(this),this.readyState==3&&bh(this)}},t.Ra=function(a){this.g&&(this.response=this.responseText=a,Xr(this))},t.Qa=function(a){this.g&&(this.response=a,Xr(this))},t.ga=function(){this.g&&Xr(this)};function Xr(a){a.readyState=4,a.l=null,a.j=null,a.v=null,Zr(a)}t.setRequestHeader=function(a,h){this.u.append(a,h)},t.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],h=this.h.entries();for(var m=h.next();!m.done;)m=m.value,a.push(m[0]+": "+m[1]),m=h.next();return a.join(`\r
`)};function Zr(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(po.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Eh(a){let h="";return le(a,function(m,v){h+=v,h+=":",h+=m,h+=`\r
`}),h}function vl(a,h,m){e:{for(v in m){var v=!1;break e}v=!0}v||(m=Eh(m),typeof a=="string"?m!=null&&encodeURIComponent(String(m)):Be(a,h,m))}function Ge(a){de.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}b(Ge,de);var Ly=/^https?$/i,Uy=["POST","PUT"];t=Ge.prototype,t.Ha=function(a){this.J=a},t.ea=function(a,h,m,v){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);h=h?h.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():dl.g(),this.v=this.o?Yc(this.o):Yc(dl),this.g.onreadystatechange=g(this.Ea,this);try{this.B=!0,this.g.open(h,String(a),!0),this.B=!1}catch(L){wh(this,L);return}if(a=m||"",m=new Map(this.headers),v)if(Object.getPrototypeOf(v)===Object.prototype)for(var O in v)m.set(O,v[O]);else if(typeof v.keys=="function"&&typeof v.get=="function")for(const L of v.keys())m.set(L,v.get(L));else throw Error("Unknown input type for opt_headers: "+String(v));v=Array.from(m.keys()).find(L=>L.toLowerCase()=="content-type"),O=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(Uy,h,void 0))||v||O||m.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[L,X]of m)this.g.setRequestHeader(L,X);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Ah(this),this.u=!0,this.g.send(a),this.u=!1}catch(L){wh(this,L)}};function wh(a,h){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=h,a.m=5,Th(a),mo(a)}function Th(a){a.A||(a.A=!0,Ee(a,"complete"),Ee(a,"error"))}t.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,Ee(this,"complete"),Ee(this,"abort"),mo(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),mo(this,!0)),Ge.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?Ih(this):this.bb())},t.bb=function(){Ih(this)};function Ih(a){if(a.h&&typeof o<"u"&&(!a.v[1]||xn(a)!=4||a.Z()!=2)){if(a.u&&xn(a)==4)_t(a.Ea,0,a);else if(Ee(a,"readystatechange"),xn(a)==4){a.h=!1;try{const X=a.Z();e:switch(X){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var h=!0;break e;default:h=!1}var m;if(!(m=h)){var v;if(v=X===0){var O=String(a.D).match(ph)[1]||null;!O&&l.self&&l.self.location&&(O=l.self.location.protocol.slice(0,-1)),v=!Ly.test(O?O.toLowerCase():"")}m=v}if(m)Ee(a,"complete"),Ee(a,"success");else{a.m=6;try{var L=2<xn(a)?a.g.statusText:""}catch{L=""}a.l=L+" ["+a.Z()+"]",Th(a)}}finally{mo(a)}}}}function mo(a,h){if(a.g){Ah(a);const m=a.g,v=a.v[0]?()=>{}:null;a.g=null,a.v=null,h||Ee(a,"ready");try{m.onreadystatechange=v}catch{}}}function Ah(a){a.I&&(l.clearTimeout(a.I),a.I=null)}t.isActive=function(){return!!this.g};function xn(a){return a.g?a.g.readyState:0}t.Z=function(){try{return 2<xn(this)?this.g.status:-1}catch{return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.Oa=function(a){if(this.g){var h=this.g.responseText;return a&&h.indexOf(a)==0&&(h=h.substring(a.length)),Qt(h)}};function Rh(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function Fy(a){const h={};a=(a.g&&2<=xn(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let v=0;v<a.length;v++){if(C(a[v]))continue;var m=V(a[v]);const O=m[0];if(m=m[1],typeof m!="string")continue;m=m.trim();const L=h[O]||[];h[O]=L,L.push(m)}S(h,function(v){return v.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function ei(a,h,m){return m&&m.internalChannelParams&&m.internalChannelParams[a]||h}function Sh(a){this.Aa=0,this.i=[],this.j=new Gr,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=ei("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=ei("baseRetryDelayMs",5e3,a),this.cb=ei("retryDelaySeedMs",1e4,a),this.Wa=ei("forwardChannelMaxRetries",2,a),this.wa=ei("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new lh(a&&a.concurrentRequestLimit),this.Da=new Oy,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=Sh.prototype,t.la=8,t.G=1,t.connect=function(a,h,m,v){xt(0),this.W=a,this.H=h||{},m&&v!==void 0&&(this.H.OSID=m,this.H.OAID=v),this.F=this.X,this.I=Mh(this,null,this.W),_o(this)};function bl(a){if(Ch(a),a.G==3){var h=a.U++,m=kn(a.I);if(Be(m,"SID",a.K),Be(m,"RID",h),Be(m,"TYPE","terminate"),ti(a,m),h=new es(a,a.j,h),h.L=2,h.v=ho(kn(m)),m=!1,l.navigator&&l.navigator.sendBeacon)try{m=l.navigator.sendBeacon(h.v.toString(),"")}catch{}!m&&l.Image&&(new Image().src=h.v,m=!0),m||(h.g=Lh(h.j,null),h.g.ea(h.v)),h.F=Date.now(),lo(h)}Oh(a)}function go(a){a.g&&(wl(a),a.g.cancel(),a.g=null)}function Ch(a){go(a),a.u&&(l.clearTimeout(a.u),a.u=null),yo(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function _o(a){if(!uh(a.h)&&!a.s){a.s=!0;var h=a.Ga;Se||nn(),Te||(Se(),Te=!0),$t.add(h,a),a.B=0}}function $y(a,h){return ch(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=h.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=zr(g(a.Ga,a,h),Nh(a,a.B)),a.B++,!0)}t.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const O=new es(this,this.j,a);let L=this.o;if(this.S&&(L?(L=w(L),P(L,this.S)):L=this.S),this.m!==null||this.O||(O.H=L,L=null),this.P)e:{for(var h=0,m=0;m<this.i.length;m++){t:{var v=this.i[m];if("__data__"in v.map&&(v=v.map.__data__,typeof v=="string")){v=v.length;break t}v=void 0}if(v===void 0)break;if(h+=v,4096<h){h=m;break e}if(h===4096||m===this.i.length-1){h=m+1;break e}}h=1e3}else h=1e3;h=kh(this,O,h),m=kn(this.I),Be(m,"RID",a),Be(m,"CVER",22),this.D&&Be(m,"X-HTTP-Session-Id",this.D),ti(this,m),L&&(this.O?h="headers="+encodeURIComponent(String(Eh(L)))+"&"+h:this.m&&vl(m,this.m,L)),yl(this.h,O),this.Ua&&Be(m,"TYPE","init"),this.P?(Be(m,"$req",h),Be(m,"SID","null"),O.T=!0,pl(O,m,null)):pl(O,m,h),this.G=2}}else this.G==3&&(a?Ph(this,a):this.i.length==0||uh(this.h)||Ph(this))};function Ph(a,h){var m;h?m=h.l:m=a.U++;const v=kn(a.I);Be(v,"SID",a.K),Be(v,"RID",m),Be(v,"AID",a.T),ti(a,v),a.m&&a.o&&vl(v,a.m,a.o),m=new es(a,a.j,m,a.B+1),a.m===null&&(m.H=a.o),h&&(a.i=h.D.concat(a.i)),h=kh(a,m,1e3),m.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),yl(a.h,m),pl(m,v,h)}function ti(a,h){a.H&&le(a.H,function(m,v){Be(h,v,m)}),a.l&&fh({},function(m,v){Be(h,v,m)})}function kh(a,h,m){m=Math.min(a.i.length,m);var v=a.l?g(a.l.Na,a.l,a):null;e:{var O=a.i;let L=-1;for(;;){const X=["count="+m];L==-1?0<m?(L=O[0].g,X.push("ofs="+L)):L=0:X.push("ofs="+L);let Le=!0;for(let ht=0;ht<m;ht++){let xe=O[ht].g;const vt=O[ht].map;if(xe-=L,0>xe)L=Math.max(0,O[ht].g-100),Le=!1;else try{My(vt,X,"req"+xe+"_")}catch{v&&v(vt)}}if(Le){v=X.join("&");break e}}}return a=a.i.splice(0,m),h.D=a,v}function xh(a){if(!a.g&&!a.u){a.Y=1;var h=a.Fa;Se||nn(),Te||(Se(),Te=!0),$t.add(h,a),a.v=0}}function El(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=zr(g(a.Fa,a),Nh(a,a.v)),a.v++,!0)}t.Fa=function(){if(this.u=null,Vh(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=zr(g(this.ab,this),a)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,xt(10),go(this),Vh(this))};function wl(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function Vh(a){a.g=new es(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var h=kn(a.qa);Be(h,"RID","rpc"),Be(h,"SID",a.K),Be(h,"AID",a.T),Be(h,"CI",a.F?"0":"1"),!a.F&&a.ja&&Be(h,"TO",a.ja),Be(h,"TYPE","xmlhttp"),ti(a,h),a.m&&a.o&&vl(h,a.m,a.o),a.L&&(a.g.I=a.L);var m=a.g;a=a.ia,m.L=1,m.v=ho(kn(h)),m.m=null,m.P=!0,ih(m,a)}t.Za=function(){this.C!=null&&(this.C=null,go(this),El(this),xt(19))};function yo(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function Dh(a,h){var m=null;if(a.g==h){yo(a),wl(a),a.g=null;var v=2}else if(_l(a.h,h))m=h.D,hh(a.h,h),v=1;else return;if(a.G!=0){if(h.o)if(v==1){m=h.m?h.m.length:0,h=Date.now()-h.F;var O=a.B;v=io(),Ee(v,new th(v,m)),_o(a)}else xh(a);else if(O=h.s,O==3||O==0&&0<h.X||!(v==1&&$y(a,h)||v==2&&El(a)))switch(m&&0<m.length&&(h=a.h,h.i=h.i.concat(m)),O){case 1:Os(a,5);break;case 4:Os(a,10);break;case 3:Os(a,6);break;default:Os(a,2)}}}function Nh(a,h){let m=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(m*=2),m*h}function Os(a,h){if(a.j.info("Error code "+h),h==2){var m=g(a.fb,a),v=a.Xa;const O=!v;v=new Ns(v||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||uo(v,"https"),ho(v),O?Dy(v.toString(),m):Ny(v.toString(),m)}else xt(2);a.G=0,a.l&&a.l.sa(h),Oh(a),Ch(a)}t.fb=function(a){a?(this.j.info("Successfully pinged google.com"),xt(2)):(this.j.info("Failed to ping google.com"),xt(1))};function Oh(a){if(a.G=0,a.ka=[],a.l){const h=dh(a.h);(h.length!=0||a.i.length!=0)&&(E(a.ka,h),E(a.ka,a.i),a.h.i.length=0,y(a.i),a.i.length=0),a.l.ra()}}function Mh(a,h,m){var v=m instanceof Ns?kn(m):new Ns(m);if(v.g!="")h&&(v.g=h+"."+v.g),co(v,v.s);else{var O=l.location;v=O.protocol,h=h?h+"."+O.hostname:O.hostname,O=+O.port;var L=new Ns(null);v&&uo(L,v),h&&(L.g=h),O&&co(L,O),m&&(L.l=m),v=L}return m=a.D,h=a.ya,m&&h&&Be(v,m,h),Be(v,"VER",a.la),ti(a,v),v}function Lh(a,h,m){if(h&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return h=a.Ca&&!a.pa?new Ge(new fo({eb:m})):new Ge(a.pa),h.Ha(a.J),h}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function Uh(){}t=Uh.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function vo(){}vo.prototype.g=function(a,h){return new Bt(a,h)};function Bt(a,h){de.call(this),this.g=new Sh(h),this.l=a,this.h=h&&h.messageUrlParams||null,a=h&&h.messageHeaders||null,h&&h.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=h&&h.initMessageHeaders||null,h&&h.messageContentType&&(a?a["X-WebChannel-Content-Type"]=h.messageContentType:a={"X-WebChannel-Content-Type":h.messageContentType}),h&&h.va&&(a?a["X-WebChannel-Client-Profile"]=h.va:a={"X-WebChannel-Client-Profile":h.va}),this.g.S=a,(a=h&&h.Sb)&&!C(a)&&(this.g.m=a),this.v=h&&h.supportsCrossDomainXhr||!1,this.u=h&&h.sendRawJson||!1,(h=h&&h.httpSessionIdParam)&&!C(h)&&(this.g.D=h,a=this.h,a!==null&&h in a&&(a=this.h,h in a&&delete a[h])),this.j=new nr(this)}b(Bt,de),Bt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Bt.prototype.close=function(){bl(this.g)},Bt.prototype.o=function(a){var h=this.g;if(typeof a=="string"){var m={};m.__data__=a,a=m}else this.u&&(m={},m.__data__=ct(a),a=m);h.i.push(new Ty(h.Ya++,a)),h.G==3&&_o(h)},Bt.prototype.N=function(){this.g.l=null,delete this.j,bl(this.g),delete this.g,Bt.aa.N.call(this)};function Fh(a){cl.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var h=a.__sm__;if(h){e:{for(const m in h){a=m;break e}a=void 0}(this.i=a)&&(a=this.i,h=h!==null&&a in h?h[a]:void 0),this.data=h}else this.data=a}b(Fh,cl);function $h(){hl.call(this),this.status=1}b($h,hl);function nr(a){this.g=a}b(nr,Uh),nr.prototype.ua=function(){Ee(this.g,"a")},nr.prototype.ta=function(a){Ee(this.g,new Fh(a))},nr.prototype.sa=function(a){Ee(this.g,new $h)},nr.prototype.ra=function(){Ee(this.g,"b")},vo.prototype.createWebChannel=vo.prototype.g,Bt.prototype.send=Bt.prototype.o,Bt.prototype.open=Bt.prototype.m,Bt.prototype.close=Bt.prototype.close,Mg=function(){return new vo},Og=function(){return io()},Ng=Vs,pu={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},oo.NO_ERROR=0,oo.TIMEOUT=8,oo.HTTP_ERROR=6,$o=oo,nh.COMPLETE="complete",Dg=nh,Jc.EventType=Hr,Hr.OPEN="a",Hr.CLOSE="b",Hr.ERROR="c",Hr.MESSAGE="d",de.prototype.listen=de.prototype.K,li=Jc,Ge.prototype.listenOnce=Ge.prototype.L,Ge.prototype.getLastError=Ge.prototype.Ka,Ge.prototype.getLastErrorCode=Ge.prototype.Ba,Ge.prototype.getStatus=Ge.prototype.Z,Ge.prototype.getResponseJson=Ge.prototype.Oa,Ge.prototype.getResponseText=Ge.prototype.oa,Ge.prototype.send=Ge.prototype.ea,Ge.prototype.setWithCredentials=Ge.prototype.Ha,Vg=Ge}).apply(typeof Ro<"u"?Ro:typeof self<"u"?self:typeof window<"u"?window:{});const pf="@firebase/firestore",mf="4.7.16";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}wt.UNAUTHENTICATED=new wt(null),wt.GOOGLE_CREDENTIALS=new wt("google-credentials-uid"),wt.FIRST_PARTY=new wt("first-party-uid"),wt.MOCK_USER=new wt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ur="11.8.1";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gs=new Zu("@firebase/firestore");function ar(){return Gs.logLevel}function se(t,...e){if(Gs.logLevel<=Ie.DEBUG){const n=e.map(dc);Gs.debug(`Firestore (${Ur}): ${t}`,...n)}}function zn(t,...e){if(Gs.logLevel<=Ie.ERROR){const n=e.map(dc);Gs.error(`Firestore (${Ur}): ${t}`,...n)}}function Cr(t,...e){if(Gs.logLevel<=Ie.WARN){const n=e.map(dc);Gs.warn(`Firestore (${Ur}): ${t}`,...n)}}function dc(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(n){return JSON.stringify(n)}(t)}catch{return t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ge(t,e,n){let s="Unexpected state";typeof e=="string"?s=e:n=e,Lg(t,s,n)}function Lg(t,e,n){let s=`FIRESTORE (${Ur}) INTERNAL ASSERTION FAILED: ${e} (ID: ${t.toString(16)})`;if(n!==void 0)try{s+=" CONTEXT: "+JSON.stringify(n)}catch{s+=" CONTEXT: "+n}throw zn(s),new Error(s)}function Me(t,e,n,s){let r="Unexpected state";typeof n=="string"?r=n:s=n,t||Lg(e,r,s)}function ve(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const B={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class re extends Qn{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bn{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ug{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class hA{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(wt.UNAUTHENTICATED))}shutdown(){}}class dA{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class fA{constructor(e){this.t=e,this.currentUser=wt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){Me(this.o===void 0,42304);let s=this.i;const r=u=>this.i!==s?(s=this.i,n(u)):Promise.resolve();let i=new Bn;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Bn,e.enqueueRetryable(()=>r(this.currentUser))};const o=()=>{const u=i;e.enqueueRetryable(async()=>{await u.promise,await r(this.currentUser)})},l=u=>{se("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(u=>l(u)),setTimeout(()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?l(u):(se("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Bn)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(s=>this.i!==e?(se("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(Me(typeof s.accessToken=="string",31837,{l:s}),new Ug(s.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Me(e===null||typeof e=="string",2055,{h:e}),new wt(e)}}class pA{constructor(e,n,s){this.P=e,this.T=n,this.I=s,this.type="FirstParty",this.user=wt.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class mA{constructor(e,n,s){this.P=e,this.T=n,this.I=s}getToken(){return Promise.resolve(new pA(this.P,this.T,this.I))}start(e,n){e.enqueueRetryable(()=>n(wt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class gf{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class gA{constructor(e,n){this.V=n,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Yt(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,n){Me(this.o===void 0,3512);const s=i=>{i.error!=null&&se("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.m;return this.m=i.token,se("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>s(i))};const r=i=>{se("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(i=>r(i)),setTimeout(()=>{if(!this.appCheck){const i=this.V.getImmediate({optional:!0});i?r(i):se("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new gf(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(Me(typeof n.token=="string",44558,{tokenResult:n}),this.m=n.token,new gf(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _A(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let s=0;s<t;s++)n[s]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fg(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $g{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=62*Math.floor(4.129032258064516);let s="";for(;s.length<20;){const r=_A(40);for(let i=0;i<r.length;++i)s.length<20&&r[i]<n&&(s+=e.charAt(r[i]%62))}return s}}function we(t,e){return t<e?-1:t>e?1:0}function mu(t,e){let n=0;for(;n<t.length&&n<e.length;){const s=t.codePointAt(n),r=e.codePointAt(n);if(s!==r){if(s<128&&r<128)return we(s,r);{const i=Fg(),o=yA(i.encode(_f(t,n)),i.encode(_f(e,n)));return o!==0?o:we(s,r)}}n+=s>65535?2:1}return we(t.length,e.length)}function _f(t,e){return t.codePointAt(e)>65535?t.substring(e,e+2):t.substring(e,e+1)}function yA(t,e){for(let n=0;n<t.length&&n<e.length;++n)if(t[n]!==e[n])return we(t[n],e[n]);return we(t.length,e.length)}function Pr(t,e,n){return t.length===e.length&&t.every((s,r)=>n(s,e[r]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yf=-62135596800,vf=1e6;class rt{static now(){return rt.fromMillis(Date.now())}static fromDate(e){return rt.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),s=Math.floor((e-1e3*n)*vf);return new rt(n,s)}constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new re(B.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new re(B.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<yf)throw new re(B.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new re(B.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/vf}_compareTo(e){return this.seconds===e.seconds?we(this.nanoseconds,e.nanoseconds):we(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds-yf;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ye{static fromTimestamp(e){return new ye(e)}static min(){return new ye(new rt(0,0))}static max(){return new ye(new rt(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bf="__name__";class vn{constructor(e,n,s){n===void 0?n=0:n>e.length&&ge(637,{offset:n,range:e.length}),s===void 0?s=e.length-n:s>e.length-n&&ge(1746,{length:s,range:e.length-n}),this.segments=e,this.offset=n,this.len=s}get length(){return this.len}isEqual(e){return vn.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof vn?e.forEach(s=>{n.push(s)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,s=this.limit();n<s;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const s=Math.min(e.length,n.length);for(let r=0;r<s;r++){const i=vn.compareSegments(e.get(r),n.get(r));if(i!==0)return i}return we(e.length,n.length)}static compareSegments(e,n){const s=vn.isNumericId(e),r=vn.isNumericId(n);return s&&!r?-1:!s&&r?1:s&&r?vn.extractNumericId(e).compare(vn.extractNumericId(n)):mu(e,n)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return _s.fromString(e.substring(4,e.length-2))}}class je extends vn{construct(e,n,s){return new je(e,n,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const s of e){if(s.indexOf("//")>=0)throw new re(B.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);n.push(...s.split("/").filter(r=>r.length>0))}return new je(n)}static emptyPath(){return new je([])}}const vA=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class mt extends vn{construct(e,n,s){return new mt(e,n,s)}static isValidIdentifier(e){return vA.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),mt.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===bf}static keyField(){return new mt([bf])}static fromServerFormat(e){const n=[];let s="",r=0;const i=()=>{if(s.length===0)throw new re(B.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(s),s=""};let o=!1;for(;r<e.length;){const l=e[r];if(l==="\\"){if(r+1===e.length)throw new re(B.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[r+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new re(B.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=u,r+=2}else l==="`"?(o=!o,r++):l!=="."||o?(s+=l,r++):(i(),r++)}if(i(),o)throw new re(B.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new mt(n)}static emptyPath(){return new mt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ce{constructor(e){this.path=e}static fromPath(e){return new ce(je.fromString(e))}static fromName(e){return new ce(je.fromString(e).popFirst(5))}static empty(){return new ce(je.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&je.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return je.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new ce(new je(e.slice()))}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mi=-1;function bA(t,e){const n=t.toTimestamp().seconds,s=t.toTimestamp().nanoseconds+1,r=ye.fromTimestamp(s===1e9?new rt(n+1,0):new rt(n,s));return new ws(r,ce.empty(),e)}function EA(t){return new ws(t.readTime,t.key,Mi)}class ws{constructor(e,n,s){this.readTime=e,this.documentKey=n,this.largestBatchId=s}static min(){return new ws(ye.min(),ce.empty(),Mi)}static max(){return new ws(ye.max(),ce.empty(),Mi)}}function wA(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=ce.comparator(t.documentKey,e.documentKey),n!==0?n:we(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TA="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class IA{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fr(t){if(t.code!==B.FAILED_PRECONDITION||t.message!==TA)throw t;se("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&ge(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new j((s,r)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(s,r)},this.catchCallback=i=>{this.wrapFailure(n,i).next(s,r)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof j?n:j.resolve(n)}catch(n){return j.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):j.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):j.reject(n)}static resolve(e){return new j((n,s)=>{n(e)})}static reject(e){return new j((n,s)=>{s(e)})}static waitFor(e){return new j((n,s)=>{let r=0,i=0,o=!1;e.forEach(l=>{++r,l.next(()=>{++i,o&&i===r&&n()},u=>s(u))}),o=!0,i===r&&n()})}static or(e){let n=j.resolve(!1);for(const s of e)n=n.next(r=>r?j.resolve(r):s());return n}static forEach(e,n){const s=[];return e.forEach((r,i)=>{s.push(n.call(this,r,i))}),this.waitFor(s)}static mapArray(e,n){return new j((s,r)=>{const i=e.length,o=new Array(i);let l=0;for(let u=0;u<i;u++){const c=u;n(e[c]).next(f=>{o[c]=f,++l,l===i&&s(o)},f=>r(f))}})}static doWhile(e,n){return new j((s,r)=>{const i=()=>{e()===!0?n().next(()=>{i()},r):s()};i()})}}function AA(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function $r(t){return t.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ja{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=s=>this.ue(s),this.ce=s=>n.writeSequenceNumber(s))}ue(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ce&&this.ce(e),e}}ja.le=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fc=-1;function qa(t){return t==null}function ca(t){return t===0&&1/t==-1/0}function RA(t){return typeof t=="number"&&Number.isInteger(t)&&!ca(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bg="";function SA(t){let e="";for(let n=0;n<t.length;n++)e.length>0&&(e=Ef(e)),e=CA(t.get(n),e);return Ef(e)}function CA(t,e){let n=e;const s=t.length;for(let r=0;r<s;r++){const i=t.charAt(r);switch(i){case"\0":n+="";break;case Bg:n+="";break;default:n+=i}}return n}function Ef(t){return t+Bg+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wf(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function Ps(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function jg(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ze{constructor(e,n){this.comparator=e,this.root=n||dt.EMPTY}insert(e,n){return new ze(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,dt.BLACK,null,null))}remove(e){return new ze(this.comparator,this.root.remove(e,this.comparator).copy(null,null,dt.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return n.value;s<0?n=n.left:s>0&&(n=n.right)}return null}indexOf(e){let n=0,s=this.root;for(;!s.isEmpty();){const r=this.comparator(e,s.key);if(r===0)return n+s.left.size;r<0?s=s.left:(n+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,s)=>(e(n,s),!1))}toString(){const e=[];return this.inorderTraversal((n,s)=>(e.push(`${n}:${s}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new So(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new So(this.root,e,this.comparator,!1)}getReverseIterator(){return new So(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new So(this.root,e,this.comparator,!0)}}class So{constructor(e,n,s,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=n?s(e.key,n):1,n&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class dt{constructor(e,n,s,r,i){this.key=e,this.value=n,this.color=s??dt.RED,this.left=r??dt.EMPTY,this.right=i??dt.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,s,r,i){return new dt(e??this.key,n??this.value,s??this.color,r??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,s){let r=this;const i=s(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,n,s),null):i===0?r.copy(null,n,null,null,null):r.copy(null,null,null,null,r.right.insert(e,n,s)),r.fixUp()}removeMin(){if(this.left.isEmpty())return dt.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let s,r=this;if(n(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,n),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),n(e,r.key)===0){if(r.right.isEmpty())return dt.EMPTY;s=r.right.min(),r=r.copy(s.key,s.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,n))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,dt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,dt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw ge(43730,{key:this.key,value:this.value});if(this.right.isRed())throw ge(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw ge(27949);return e+(this.isRed()?0:1)}}dt.EMPTY=null,dt.RED=!0,dt.BLACK=!1;dt.EMPTY=new class{constructor(){this.size=0}get key(){throw ge(57766)}get value(){throw ge(16141)}get color(){throw ge(16727)}get left(){throw ge(29726)}get right(){throw ge(36894)}copy(e,n,s,r,i){return this}insert(e,n,s){return new dt(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(e){this.comparator=e,this.data=new ze(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,s)=>(e(n),!1))}forEachInRange(e,n){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const r=s.getNext();if(this.comparator(r.key,e[1])>=0)return;n(r.key)}}forEachWhile(e,n){let s;for(s=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new Tf(this.data.getIterator())}getIteratorFrom(e){return new Tf(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(s=>{n=n.add(s)}),n}isEqual(e){if(!(e instanceof it)||this.size!==e.size)return!1;const n=this.data.getIterator(),s=e.data.getIterator();for(;n.hasNext();){const r=n.getNext().key,i=s.getNext().key;if(this.comparator(r,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new it(this.comparator);return n.data=e,n}}class Tf{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kt{constructor(e){this.fields=e,e.sort(mt.comparator)}static empty(){return new Kt([])}unionWith(e){let n=new it(mt.comparator);for(const s of this.fields)n=n.add(s);for(const s of e)n=n.add(s);return new Kt(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return Pr(this.fields,e.fields,(n,s)=>n.isEqual(s))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qg extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(r){try{return atob(r)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new qg("Invalid base64 string: "+i):i}}(e);return new gt(n)}static fromUint8Array(e){const n=function(r){let i="";for(let o=0;o<r.length;++o)i+=String.fromCharCode(r[o]);return i}(e);return new gt(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const s=new Uint8Array(n.length);for(let r=0;r<n.length;r++)s[r]=n.charCodeAt(r);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return we(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}gt.EMPTY_BYTE_STRING=new gt("");const PA=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Ts(t){if(Me(!!t,39018),typeof t=="string"){let e=0;const n=PA.exec(t);if(Me(!!n,46558,{timestamp:t}),n[1]){let r=n[1];r=(r+"000000000").substr(0,9),e=Number(r)}const s=new Date(t);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:Ye(t.seconds),nanos:Ye(t.nanos)}}function Ye(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function Is(t){return typeof t=="string"?gt.fromBase64String(t):gt.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hg="server_timestamp",Kg="__type__",zg="__previous_value__",Gg="__local_write_time__";function pc(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{})[Kg])===null||n===void 0?void 0:n.stringValue)===Hg}function Ha(t){const e=t.mapValue.fields[zg];return pc(e)?Ha(e):e}function Li(t){const e=Ts(t.mapValue.fields[Gg].timestampValue);return new rt(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kA{constructor(e,n,s,r,i,o,l,u,c,f){this.databaseId=e,this.appId=n,this.persistenceKey=s,this.host=r,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=u,this.useFetchStreams=c,this.isUsingEmulator=f}}const ha="(default)";class Ui{constructor(e,n){this.projectId=e,this.database=n||ha}static empty(){return new Ui("","")}get isDefaultDatabase(){return this.database===ha}isEqual(e){return e instanceof Ui&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wg="__type__",xA="__max__",Co={mapValue:{}},Qg="__vector__",da="value";function As(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?pc(t)?4:DA(t)?9007199254740991:VA(t)?10:11:ge(28295,{value:t})}function Cn(t,e){if(t===e)return!0;const n=As(t);if(n!==As(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return Li(t).isEqual(Li(e));case 3:return function(r,i){if(typeof r.timestampValue=="string"&&typeof i.timestampValue=="string"&&r.timestampValue.length===i.timestampValue.length)return r.timestampValue===i.timestampValue;const o=Ts(r.timestampValue),l=Ts(i.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(r,i){return Is(r.bytesValue).isEqual(Is(i.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(r,i){return Ye(r.geoPointValue.latitude)===Ye(i.geoPointValue.latitude)&&Ye(r.geoPointValue.longitude)===Ye(i.geoPointValue.longitude)}(t,e);case 2:return function(r,i){if("integerValue"in r&&"integerValue"in i)return Ye(r.integerValue)===Ye(i.integerValue);if("doubleValue"in r&&"doubleValue"in i){const o=Ye(r.doubleValue),l=Ye(i.doubleValue);return o===l?ca(o)===ca(l):isNaN(o)&&isNaN(l)}return!1}(t,e);case 9:return Pr(t.arrayValue.values||[],e.arrayValue.values||[],Cn);case 10:case 11:return function(r,i){const o=r.mapValue.fields||{},l=i.mapValue.fields||{};if(wf(o)!==wf(l))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(l[u]===void 0||!Cn(o[u],l[u])))return!1;return!0}(t,e);default:return ge(52216,{left:t})}}function Fi(t,e){return(t.values||[]).find(n=>Cn(n,e))!==void 0}function kr(t,e){if(t===e)return 0;const n=As(t),s=As(e);if(n!==s)return we(n,s);switch(n){case 0:case 9007199254740991:return 0;case 1:return we(t.booleanValue,e.booleanValue);case 2:return function(i,o){const l=Ye(i.integerValue||i.doubleValue),u=Ye(o.integerValue||o.doubleValue);return l<u?-1:l>u?1:l===u?0:isNaN(l)?isNaN(u)?0:-1:1}(t,e);case 3:return If(t.timestampValue,e.timestampValue);case 4:return If(Li(t),Li(e));case 5:return mu(t.stringValue,e.stringValue);case 6:return function(i,o){const l=Is(i),u=Is(o);return l.compareTo(u)}(t.bytesValue,e.bytesValue);case 7:return function(i,o){const l=i.split("/"),u=o.split("/");for(let c=0;c<l.length&&c<u.length;c++){const f=we(l[c],u[c]);if(f!==0)return f}return we(l.length,u.length)}(t.referenceValue,e.referenceValue);case 8:return function(i,o){const l=we(Ye(i.latitude),Ye(o.latitude));return l!==0?l:we(Ye(i.longitude),Ye(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return Af(t.arrayValue,e.arrayValue);case 10:return function(i,o){var l,u,c,f;const p=i.fields||{},g=o.fields||{},_=(l=p[da])===null||l===void 0?void 0:l.arrayValue,b=(u=g[da])===null||u===void 0?void 0:u.arrayValue,y=we(((c=_==null?void 0:_.values)===null||c===void 0?void 0:c.length)||0,((f=b==null?void 0:b.values)===null||f===void 0?void 0:f.length)||0);return y!==0?y:Af(_,b)}(t.mapValue,e.mapValue);case 11:return function(i,o){if(i===Co.mapValue&&o===Co.mapValue)return 0;if(i===Co.mapValue)return 1;if(o===Co.mapValue)return-1;const l=i.fields||{},u=Object.keys(l),c=o.fields||{},f=Object.keys(c);u.sort(),f.sort();for(let p=0;p<u.length&&p<f.length;++p){const g=mu(u[p],f[p]);if(g!==0)return g;const _=kr(l[u[p]],c[f[p]]);if(_!==0)return _}return we(u.length,f.length)}(t.mapValue,e.mapValue);default:throw ge(23264,{Pe:n})}}function If(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return we(t,e);const n=Ts(t),s=Ts(e),r=we(n.seconds,s.seconds);return r!==0?r:we(n.nanos,s.nanos)}function Af(t,e){const n=t.values||[],s=e.values||[];for(let r=0;r<n.length&&r<s.length;++r){const i=kr(n[r],s[r]);if(i)return i}return we(n.length,s.length)}function xr(t){return gu(t)}function gu(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const s=Ts(n);return`time(${s.seconds},${s.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return Is(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return ce.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let s="[",r=!0;for(const i of n.values||[])r?r=!1:s+=",",s+=gu(i);return s+"]"}(t.arrayValue):"mapValue"in t?function(n){const s=Object.keys(n.fields||{}).sort();let r="{",i=!0;for(const o of s)i?i=!1:r+=",",r+=`${o}:${gu(n.fields[o])}`;return r+"}"}(t.mapValue):ge(61005,{value:t})}function Bo(t){switch(As(t)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Ha(t);return e?16+Bo(e):16;case 5:return 2*t.stringValue.length;case 6:return Is(t.bytesValue).approximateByteSize();case 7:return t.referenceValue.length;case 9:return function(s){return(s.values||[]).reduce((r,i)=>r+Bo(i),0)}(t.arrayValue);case 10:case 11:return function(s){let r=0;return Ps(s.fields,(i,o)=>{r+=i.length+Bo(o)}),r}(t.mapValue);default:throw ge(13486,{value:t})}}function Rf(t,e){return{referenceValue:`projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`}}function _u(t){return!!t&&"integerValue"in t}function mc(t){return!!t&&"arrayValue"in t}function Sf(t){return!!t&&"nullValue"in t}function Cf(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function jo(t){return!!t&&"mapValue"in t}function VA(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{})[Wg])===null||n===void 0?void 0:n.stringValue)===Qg}function wi(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return Ps(t.mapValue.fields,(n,s)=>e.mapValue.fields[n]=wi(s)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=wi(t.arrayValue.values[n]);return e}return Object.assign({},t)}function DA(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue===xA}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ut{constructor(e){this.value=e}static empty(){return new Ut({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let s=0;s<e.length-1;++s)if(n=(n.mapValue.fields||{})[e.get(s)],!jo(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=wi(n)}setAll(e){let n=mt.emptyPath(),s={},r=[];e.forEach((o,l)=>{if(!n.isImmediateParentOf(l)){const u=this.getFieldsMap(n);this.applyChanges(u,s,r),s={},r=[],n=l.popLast()}o?s[l.lastSegment()]=wi(o):r.push(l.lastSegment())});const i=this.getFieldsMap(n);this.applyChanges(i,s,r)}delete(e){const n=this.field(e.popLast());jo(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return Cn(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let s=0;s<e.length;++s){let r=n.mapValue.fields[e.get(s)];jo(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},n.mapValue.fields[e.get(s)]=r),n=r}return n.mapValue.fields}applyChanges(e,n,s){Ps(n,(r,i)=>e[r]=i);for(const r of s)delete e[r]}clone(){return new Ut(wi(this.value))}}function Yg(t){const e=[];return Ps(t.fields,(n,s)=>{const r=new mt([n]);if(jo(s)){const i=Yg(s.mapValue).fields;if(i.length===0)e.push(r);else for(const o of i)e.push(r.child(o))}else e.push(r)}),new Kt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class It{constructor(e,n,s,r,i,o,l){this.key=e,this.documentType=n,this.version=s,this.readTime=r,this.createTime=i,this.data=o,this.documentState=l}static newInvalidDocument(e){return new It(e,0,ye.min(),ye.min(),ye.min(),Ut.empty(),0)}static newFoundDocument(e,n,s,r){return new It(e,1,n,ye.min(),s,r,0)}static newNoDocument(e,n){return new It(e,2,n,ye.min(),ye.min(),Ut.empty(),0)}static newUnknownDocument(e,n){return new It(e,3,n,ye.min(),ye.min(),Ut.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(ye.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ut.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ut.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=ye.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof It&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new It(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fa{constructor(e,n){this.position=e,this.inclusive=n}}function Pf(t,e,n){let s=0;for(let r=0;r<t.position.length;r++){const i=e[r],o=t.position[r];if(i.field.isKeyField()?s=ce.comparator(ce.fromName(o.referenceValue),n.key):s=kr(o,n.data.field(i.field)),i.dir==="desc"&&(s*=-1),s!==0)break}return s}function kf(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!Cn(t.position[n],e.position[n]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $i{constructor(e,n="asc"){this.field=e,this.dir=n}}function NA(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jg{}class Ze extends Jg{constructor(e,n,s){super(),this.field=e,this.op=n,this.value=s}static create(e,n,s){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,s):new MA(e,n,s):n==="array-contains"?new FA(e,s):n==="in"?new $A(e,s):n==="not-in"?new BA(e,s):n==="array-contains-any"?new jA(e,s):new Ze(e,n,s)}static createKeyFieldInFilter(e,n,s){return n==="in"?new LA(e,s):new UA(e,s)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&n.nullValue===void 0&&this.matchesComparison(kr(n,this.value)):n!==null&&As(this.value)===As(n)&&this.matchesComparison(kr(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return ge(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class pn extends Jg{constructor(e,n){super(),this.filters=e,this.op=n,this.Te=null}static create(e,n){return new pn(e,n)}matches(e){return Xg(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.Te!==null||(this.Te=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.Te}getFilters(){return Object.assign([],this.filters)}}function Xg(t){return t.op==="and"}function Zg(t){return OA(t)&&Xg(t)}function OA(t){for(const e of t.filters)if(e instanceof pn)return!1;return!0}function yu(t){if(t instanceof Ze)return t.field.canonicalString()+t.op.toString()+xr(t.value);if(Zg(t))return t.filters.map(e=>yu(e)).join(",");{const e=t.filters.map(n=>yu(n)).join(",");return`${t.op}(${e})`}}function e_(t,e){return t instanceof Ze?function(s,r){return r instanceof Ze&&s.op===r.op&&s.field.isEqual(r.field)&&Cn(s.value,r.value)}(t,e):t instanceof pn?function(s,r){return r instanceof pn&&s.op===r.op&&s.filters.length===r.filters.length?s.filters.reduce((i,o,l)=>i&&e_(o,r.filters[l]),!0):!1}(t,e):void ge(19439)}function t_(t){return t instanceof Ze?function(n){return`${n.field.canonicalString()} ${n.op} ${xr(n.value)}`}(t):t instanceof pn?function(n){return n.op.toString()+" {"+n.getFilters().map(t_).join(" ,")+"}"}(t):"Filter"}class MA extends Ze{constructor(e,n,s){super(e,n,s),this.key=ce.fromName(s.referenceValue)}matches(e){const n=ce.comparator(e.key,this.key);return this.matchesComparison(n)}}class LA extends Ze{constructor(e,n){super(e,"in",n),this.keys=n_("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class UA extends Ze{constructor(e,n){super(e,"not-in",n),this.keys=n_("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function n_(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(s=>ce.fromName(s.referenceValue))}class FA extends Ze{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return mc(n)&&Fi(n.arrayValue,this.value)}}class $A extends Ze{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&Fi(this.value.arrayValue,n)}}class BA extends Ze{constructor(e,n){super(e,"not-in",n)}matches(e){if(Fi(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&n.nullValue===void 0&&!Fi(this.value.arrayValue,n)}}class jA extends Ze{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!mc(n)||!n.arrayValue.values)&&n.arrayValue.values.some(s=>Fi(this.value.arrayValue,s))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qA{constructor(e,n=null,s=[],r=[],i=null,o=null,l=null){this.path=e,this.collectionGroup=n,this.orderBy=s,this.filters=r,this.limit=i,this.startAt=o,this.endAt=l,this.Ie=null}}function xf(t,e=null,n=[],s=[],r=null,i=null,o=null){return new qA(t,e,n,s,r,i,o)}function gc(t){const e=ve(t);if(e.Ie===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(s=>yu(s)).join(","),n+="|ob:",n+=e.orderBy.map(s=>function(i){return i.field.canonicalString()+i.dir}(s)).join(","),qa(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(s=>xr(s)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(s=>xr(s)).join(",")),e.Ie=n}return e.Ie}function _c(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!NA(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!e_(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!kf(t.startAt,e.startAt)&&kf(t.endAt,e.endAt)}function vu(t){return ce.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Br{constructor(e,n=null,s=[],r=[],i=null,o="F",l=null,u=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=s,this.filters=r,this.limit=i,this.limitType=o,this.startAt=l,this.endAt=u,this.Ee=null,this.de=null,this.Ae=null,this.startAt,this.endAt}}function HA(t,e,n,s,r,i,o,l){return new Br(t,e,n,s,r,i,o,l)}function yc(t){return new Br(t)}function Vf(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function s_(t){return t.collectionGroup!==null}function Ti(t){const e=ve(t);if(e.Ee===null){e.Ee=[];const n=new Set;for(const i of e.explicitOrderBy)e.Ee.push(i),n.add(i.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new it(mt.comparator);return o.filters.forEach(u=>{u.getFlattenedFilters().forEach(c=>{c.isInequality()&&(l=l.add(c.field))})}),l})(e).forEach(i=>{n.has(i.canonicalString())||i.isKeyField()||e.Ee.push(new $i(i,s))}),n.has(mt.keyField().canonicalString())||e.Ee.push(new $i(mt.keyField(),s))}return e.Ee}function In(t){const e=ve(t);return e.de||(e.de=KA(e,Ti(t))),e.de}function KA(t,e){if(t.limitType==="F")return xf(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(r=>{const i=r.dir==="desc"?"asc":"desc";return new $i(r.field,i)});const n=t.endAt?new fa(t.endAt.position,t.endAt.inclusive):null,s=t.startAt?new fa(t.startAt.position,t.startAt.inclusive):null;return xf(t.path,t.collectionGroup,e,t.filters,t.limit,n,s)}}function bu(t,e){const n=t.filters.concat([e]);return new Br(t.path,t.collectionGroup,t.explicitOrderBy.slice(),n,t.limit,t.limitType,t.startAt,t.endAt)}function pa(t,e,n){return new Br(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function Ka(t,e){return _c(In(t),In(e))&&t.limitType===e.limitType}function r_(t){return`${gc(In(t))}|lt:${t.limitType}`}function lr(t){return`Query(target=${function(n){let s=n.path.canonicalString();return n.collectionGroup!==null&&(s+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(s+=`, filters: [${n.filters.map(r=>t_(r)).join(", ")}]`),qa(n.limit)||(s+=", limit: "+n.limit),n.orderBy.length>0&&(s+=`, orderBy: [${n.orderBy.map(r=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(r)).join(", ")}]`),n.startAt&&(s+=", startAt: ",s+=n.startAt.inclusive?"b:":"a:",s+=n.startAt.position.map(r=>xr(r)).join(",")),n.endAt&&(s+=", endAt: ",s+=n.endAt.inclusive?"a:":"b:",s+=n.endAt.position.map(r=>xr(r)).join(",")),`Target(${s})`}(In(t))}; limitType=${t.limitType})`}function za(t,e){return e.isFoundDocument()&&function(s,r){const i=r.key.path;return s.collectionGroup!==null?r.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(i):ce.isDocumentKey(s.path)?s.path.isEqual(i):s.path.isImmediateParentOf(i)}(t,e)&&function(s,r){for(const i of Ti(s))if(!i.field.isKeyField()&&r.data.field(i.field)===null)return!1;return!0}(t,e)&&function(s,r){for(const i of s.filters)if(!i.matches(r))return!1;return!0}(t,e)&&function(s,r){return!(s.startAt&&!function(o,l,u){const c=Pf(o,l,u);return o.inclusive?c<=0:c<0}(s.startAt,Ti(s),r)||s.endAt&&!function(o,l,u){const c=Pf(o,l,u);return o.inclusive?c>=0:c>0}(s.endAt,Ti(s),r))}(t,e)}function zA(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function i_(t){return(e,n)=>{let s=!1;for(const r of Ti(t)){const i=GA(r,e,n);if(i!==0)return i;s=s||r.field.isKeyField()}return 0}}function GA(t,e,n){const s=t.field.isKeyField()?ce.comparator(e.key,n.key):function(i,o,l){const u=o.data.field(i),c=l.data.field(i);return u!==null&&c!==null?kr(u,c):ge(42886)}(t.field,e,n);switch(t.dir){case"asc":return s;case"desc":return-1*s;default:return ge(19790,{direction:t.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Js{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),s=this.inner[n];if(s!==void 0){for(const[r,i]of s)if(this.equalsFn(r,e))return i}}has(e){return this.get(e)!==void 0}set(e,n){const s=this.mapKeyFn(e),r=this.inner[s];if(r===void 0)return this.inner[s]=[[e,n]],void this.innerSize++;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return void(r[i]=[e,n]);r.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return!1;for(let r=0;r<s.length;r++)if(this.equalsFn(s[r][0],e))return s.length===1?delete this.inner[n]:s.splice(r,1),this.innerSize--,!0;return!1}forEach(e){Ps(this.inner,(n,s)=>{for(const[r,i]of s)e(r,i)})}isEmpty(){return jg(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const WA=new ze(ce.comparator);function Gn(){return WA}const o_=new ze(ce.comparator);function ui(...t){let e=o_;for(const n of t)e=e.insert(n.key,n);return e}function a_(t){let e=o_;return t.forEach((n,s)=>e=e.insert(n,s.overlayedDocument)),e}function $s(){return Ii()}function l_(){return Ii()}function Ii(){return new Js(t=>t.toString(),(t,e)=>t.isEqual(e))}const QA=new ze(ce.comparator),YA=new it(ce.comparator);function Ae(...t){let e=YA;for(const n of t)e=e.add(n);return e}const JA=new it(we);function XA(){return JA}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vc(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:ca(e)?"-0":e}}function u_(t){return{integerValue:""+t}}function ZA(t,e){return RA(e)?u_(e):vc(t,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ga{constructor(){this._=void 0}}function e1(t,e,n){return t instanceof ma?function(r,i){const o={fields:{[Kg]:{stringValue:Hg},[Gg]:{timestampValue:{seconds:r.seconds,nanos:r.nanoseconds}}}};return i&&pc(i)&&(i=Ha(i)),i&&(o.fields[zg]=i),{mapValue:o}}(n,e):t instanceof Bi?h_(t,e):t instanceof ji?d_(t,e):function(r,i){const o=c_(r,i),l=Df(o)+Df(r.Re);return _u(o)&&_u(r.Re)?u_(l):vc(r.serializer,l)}(t,e)}function t1(t,e,n){return t instanceof Bi?h_(t,e):t instanceof ji?d_(t,e):n}function c_(t,e){return t instanceof ga?function(s){return _u(s)||function(i){return!!i&&"doubleValue"in i}(s)}(e)?e:{integerValue:0}:null}class ma extends Ga{}class Bi extends Ga{constructor(e){super(),this.elements=e}}function h_(t,e){const n=f_(e);for(const s of t.elements)n.some(r=>Cn(r,s))||n.push(s);return{arrayValue:{values:n}}}class ji extends Ga{constructor(e){super(),this.elements=e}}function d_(t,e){let n=f_(e);for(const s of t.elements)n=n.filter(r=>!Cn(r,s));return{arrayValue:{values:n}}}class ga extends Ga{constructor(e,n){super(),this.serializer=e,this.Re=n}}function Df(t){return Ye(t.integerValue||t.doubleValue)}function f_(t){return mc(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}function n1(t,e){return t.field.isEqual(e.field)&&function(s,r){return s instanceof Bi&&r instanceof Bi||s instanceof ji&&r instanceof ji?Pr(s.elements,r.elements,Cn):s instanceof ga&&r instanceof ga?Cn(s.Re,r.Re):s instanceof ma&&r instanceof ma}(t.transform,e.transform)}class s1{constructor(e,n){this.version=e,this.transformResults=n}}class en{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new en}static exists(e){return new en(void 0,e)}static updateTime(e){return new en(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function qo(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class Wa{}function p_(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new bc(t.key,en.none()):new Zi(t.key,t.data,en.none());{const n=t.data,s=Ut.empty();let r=new it(mt.comparator);for(let i of e.fields)if(!r.has(i)){let o=n.field(i);o===null&&i.length>1&&(i=i.popLast(),o=n.field(i)),o===null?s.delete(i):s.set(i,o),r=r.add(i)}return new ks(t.key,s,new Kt(r.toArray()),en.none())}}function r1(t,e,n){t instanceof Zi?function(r,i,o){const l=r.value.clone(),u=Of(r.fieldTransforms,i,o.transformResults);l.setAll(u),i.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(t,e,n):t instanceof ks?function(r,i,o){if(!qo(r.precondition,i))return void i.convertToUnknownDocument(o.version);const l=Of(r.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(m_(r)),u.setAll(l),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()}(t,e,n):function(r,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function Ai(t,e,n,s){return t instanceof Zi?function(i,o,l,u){if(!qo(i.precondition,o))return l;const c=i.value.clone(),f=Mf(i.fieldTransforms,u,o);return c.setAll(f),o.convertToFoundDocument(o.version,c).setHasLocalMutations(),null}(t,e,n,s):t instanceof ks?function(i,o,l,u){if(!qo(i.precondition,o))return l;const c=Mf(i.fieldTransforms,u,o),f=o.data;return f.setAll(m_(i)),f.setAll(c),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),l===null?null:l.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(p=>p.field))}(t,e,n,s):function(i,o,l){return qo(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(t,e,n)}function i1(t,e){let n=null;for(const s of t.fieldTransforms){const r=e.data.field(s.field),i=c_(s.transform,r||null);i!=null&&(n===null&&(n=Ut.empty()),n.set(s.field,i))}return n||null}function Nf(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(s,r){return s===void 0&&r===void 0||!(!s||!r)&&Pr(s,r,(i,o)=>n1(i,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class Zi extends Wa{constructor(e,n,s,r=[]){super(),this.key=e,this.value=n,this.precondition=s,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class ks extends Wa{constructor(e,n,s,r,i=[]){super(),this.key=e,this.data=n,this.fieldMask=s,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function m_(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const s=t.data.field(n);e.set(n,s)}}),e}function Of(t,e,n){const s=new Map;Me(t.length===n.length,32656,{Ve:n.length,me:t.length});for(let r=0;r<n.length;r++){const i=t[r],o=i.transform,l=e.data.field(i.field);s.set(i.field,t1(o,l,n[r]))}return s}function Mf(t,e,n){const s=new Map;for(const r of t){const i=r.transform,o=n.data.field(r.field);s.set(r.field,e1(i,o,e))}return s}class bc extends Wa{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class o1 extends Wa{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class a1{constructor(e,n,s,r){this.batchId=e,this.localWriteTime=n,this.baseMutations=s,this.mutations=r}applyToRemoteDocument(e,n){const s=n.mutationResults;for(let r=0;r<this.mutations.length;r++){const i=this.mutations[r];i.key.isEqual(e.key)&&r1(i,e,s[r])}}applyToLocalView(e,n){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(n=Ai(s,e,n,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(n=Ai(s,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const s=l_();return this.mutations.forEach(r=>{const i=e.get(r.key),o=i.overlayedDocument;let l=this.applyToLocalView(o,i.mutatedFields);l=n.has(r.key)?null:l;const u=p_(o,l);u!==null&&s.set(r.key,u),o.isValidDocument()||o.convertToNoDocument(ye.min())}),s}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),Ae())}isEqual(e){return this.batchId===e.batchId&&Pr(this.mutations,e.mutations,(n,s)=>Nf(n,s))&&Pr(this.baseMutations,e.baseMutations,(n,s)=>Nf(n,s))}}class Ec{constructor(e,n,s,r){this.batch=e,this.commitVersion=n,this.mutationResults=s,this.docVersions=r}static from(e,n,s){Me(e.mutations.length===s.length,58842,{fe:e.mutations.length,ge:s.length});let r=function(){return QA}();const i=e.mutations;for(let o=0;o<i.length;o++)r=r.insert(i[o].key,s[o].version);return new Ec(e,n,s,r)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class l1{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class u1{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Xe,Pe;function c1(t){switch(t){case B.OK:return ge(64938);case B.CANCELLED:case B.UNKNOWN:case B.DEADLINE_EXCEEDED:case B.RESOURCE_EXHAUSTED:case B.INTERNAL:case B.UNAVAILABLE:case B.UNAUTHENTICATED:return!1;case B.INVALID_ARGUMENT:case B.NOT_FOUND:case B.ALREADY_EXISTS:case B.PERMISSION_DENIED:case B.FAILED_PRECONDITION:case B.ABORTED:case B.OUT_OF_RANGE:case B.UNIMPLEMENTED:case B.DATA_LOSS:return!0;default:return ge(15467,{code:t})}}function g_(t){if(t===void 0)return zn("GRPC error has no .code"),B.UNKNOWN;switch(t){case Xe.OK:return B.OK;case Xe.CANCELLED:return B.CANCELLED;case Xe.UNKNOWN:return B.UNKNOWN;case Xe.DEADLINE_EXCEEDED:return B.DEADLINE_EXCEEDED;case Xe.RESOURCE_EXHAUSTED:return B.RESOURCE_EXHAUSTED;case Xe.INTERNAL:return B.INTERNAL;case Xe.UNAVAILABLE:return B.UNAVAILABLE;case Xe.UNAUTHENTICATED:return B.UNAUTHENTICATED;case Xe.INVALID_ARGUMENT:return B.INVALID_ARGUMENT;case Xe.NOT_FOUND:return B.NOT_FOUND;case Xe.ALREADY_EXISTS:return B.ALREADY_EXISTS;case Xe.PERMISSION_DENIED:return B.PERMISSION_DENIED;case Xe.FAILED_PRECONDITION:return B.FAILED_PRECONDITION;case Xe.ABORTED:return B.ABORTED;case Xe.OUT_OF_RANGE:return B.OUT_OF_RANGE;case Xe.UNIMPLEMENTED:return B.UNIMPLEMENTED;case Xe.DATA_LOSS:return B.DATA_LOSS;default:return ge(39323,{code:t})}}(Pe=Xe||(Xe={}))[Pe.OK=0]="OK",Pe[Pe.CANCELLED=1]="CANCELLED",Pe[Pe.UNKNOWN=2]="UNKNOWN",Pe[Pe.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Pe[Pe.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Pe[Pe.NOT_FOUND=5]="NOT_FOUND",Pe[Pe.ALREADY_EXISTS=6]="ALREADY_EXISTS",Pe[Pe.PERMISSION_DENIED=7]="PERMISSION_DENIED",Pe[Pe.UNAUTHENTICATED=16]="UNAUTHENTICATED",Pe[Pe.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Pe[Pe.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Pe[Pe.ABORTED=10]="ABORTED",Pe[Pe.OUT_OF_RANGE=11]="OUT_OF_RANGE",Pe[Pe.UNIMPLEMENTED=12]="UNIMPLEMENTED",Pe[Pe.INTERNAL=13]="INTERNAL",Pe[Pe.UNAVAILABLE=14]="UNAVAILABLE",Pe[Pe.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const h1=new _s([4294967295,4294967295],0);function Lf(t){const e=Fg().encode(t),n=new xg;return n.update(e),new Uint8Array(n.digest())}function Uf(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),s=e.getUint32(4,!0),r=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new _s([n,s],0),new _s([r,i],0)]}class wc{constructor(e,n,s){if(this.bitmap=e,this.padding=n,this.hashCount=s,n<0||n>=8)throw new ci(`Invalid padding: ${n}`);if(s<0)throw new ci(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new ci(`Invalid hash count: ${s}`);if(e.length===0&&n!==0)throw new ci(`Invalid padding when bitmap length is 0: ${n}`);this.pe=8*e.length-n,this.ye=_s.fromNumber(this.pe)}we(e,n,s){let r=e.add(n.multiply(_s.fromNumber(s)));return r.compare(h1)===1&&(r=new _s([r.getBits(0),r.getBits(1)],0)),r.modulo(this.ye).toNumber()}Se(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.pe===0)return!1;const n=Lf(e),[s,r]=Uf(n);for(let i=0;i<this.hashCount;i++){const o=this.we(s,r,i);if(!this.Se(o))return!1}return!0}static create(e,n,s){const r=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new wc(i,r,n);return s.forEach(l=>o.insert(l)),o}insert(e){if(this.pe===0)return;const n=Lf(e),[s,r]=Uf(n);for(let i=0;i<this.hashCount;i++){const o=this.we(s,r,i);this.be(o)}}be(e){const n=Math.floor(e/8),s=e%8;this.bitmap[n]|=1<<s}}class ci extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qa{constructor(e,n,s,r,i){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=s,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,n,s){const r=new Map;return r.set(e,eo.createSynthesizedTargetChangeForCurrentChange(e,n,s)),new Qa(ye.min(),r,new ze(we),Gn(),Ae())}}class eo{constructor(e,n,s,r,i){this.resumeToken=e,this.current=n,this.addedDocuments=s,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,n,s){return new eo(s,n,Ae(),Ae(),Ae())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ho{constructor(e,n,s,r){this.De=e,this.removedTargetIds=n,this.key=s,this.ve=r}}class __{constructor(e,n){this.targetId=e,this.Ce=n}}class y_{constructor(e,n,s=gt.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=n,this.resumeToken=s,this.cause=r}}class Ff{constructor(){this.Fe=0,this.Me=$f(),this.xe=gt.EMPTY_BYTE_STRING,this.Oe=!1,this.Ne=!0}get current(){return this.Oe}get resumeToken(){return this.xe}get Be(){return this.Fe!==0}get Le(){return this.Ne}ke(e){e.approximateByteSize()>0&&(this.Ne=!0,this.xe=e)}qe(){let e=Ae(),n=Ae(),s=Ae();return this.Me.forEach((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:n=n.add(r);break;case 1:s=s.add(r);break;default:ge(38017,{changeType:i})}}),new eo(this.xe,this.Oe,e,n,s)}Qe(){this.Ne=!1,this.Me=$f()}$e(e,n){this.Ne=!0,this.Me=this.Me.insert(e,n)}Ue(e){this.Ne=!0,this.Me=this.Me.remove(e)}Ke(){this.Fe+=1}We(){this.Fe-=1,Me(this.Fe>=0,3241,{Fe:this.Fe})}Ge(){this.Ne=!0,this.Oe=!0}}class d1{constructor(e){this.ze=e,this.je=new Map,this.He=Gn(),this.Je=Po(),this.Ye=Po(),this.Ze=new ze(we)}Xe(e){for(const n of e.De)e.ve&&e.ve.isFoundDocument()?this.et(n,e.ve):this.tt(n,e.key,e.ve);for(const n of e.removedTargetIds)this.tt(n,e.key,e.ve)}nt(e){this.forEachTarget(e,n=>{const s=this.rt(n);switch(e.state){case 0:this.it(n)&&s.ke(e.resumeToken);break;case 1:s.We(),s.Be||s.Qe(),s.ke(e.resumeToken);break;case 2:s.We(),s.Be||this.removeTarget(n);break;case 3:this.it(n)&&(s.Ge(),s.ke(e.resumeToken));break;case 4:this.it(n)&&(this.st(n),s.ke(e.resumeToken));break;default:ge(56790,{state:e.state})}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.je.forEach((s,r)=>{this.it(r)&&n(r)})}ot(e){const n=e.targetId,s=e.Ce.count,r=this._t(n);if(r){const i=r.target;if(vu(i))if(s===0){const o=new ce(i.path);this.tt(n,o,It.newNoDocument(o,ye.min()))}else Me(s===1,20013,{expectedCount:s});else{const o=this.ut(n);if(o!==s){const l=this.ct(e),u=l?this.lt(l,e,o):1;if(u!==0){this.st(n);const c=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(n,c)}}}}}ct(e){const n=e.Ce.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:s="",padding:r=0},hashCount:i=0}=n;let o,l;try{o=Is(s).toUint8Array()}catch(u){if(u instanceof qg)return Cr("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{l=new wc(o,r,i)}catch(u){return Cr(u instanceof ci?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return l.pe===0?null:l}lt(e,n,s){return n.Ce.count===s-this.Tt(e,n.targetId)?0:2}Tt(e,n){const s=this.ze.getRemoteKeysForTarget(n);let r=0;return s.forEach(i=>{const o=this.ze.Pt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(l)||(this.tt(n,i,null),r++)}),r}It(e){const n=new Map;this.je.forEach((i,o)=>{const l=this._t(o);if(l){if(i.current&&vu(l.target)){const u=new ce(l.target.path);this.Et(u).has(o)||this.dt(o,u)||this.tt(o,u,It.newNoDocument(u,e))}i.Le&&(n.set(o,i.qe()),i.Qe())}});let s=Ae();this.Ye.forEach((i,o)=>{let l=!0;o.forEachWhile(u=>{const c=this._t(u);return!c||c.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(s=s.add(i))}),this.He.forEach((i,o)=>o.setReadTime(e));const r=new Qa(e,n,this.Ze,this.He,s);return this.He=Gn(),this.Je=Po(),this.Ye=Po(),this.Ze=new ze(we),r}et(e,n){if(!this.it(e))return;const s=this.dt(e,n.key)?2:0;this.rt(e).$e(n.key,s),this.He=this.He.insert(n.key,n),this.Je=this.Je.insert(n.key,this.Et(n.key).add(e)),this.Ye=this.Ye.insert(n.key,this.At(n.key).add(e))}tt(e,n,s){if(!this.it(e))return;const r=this.rt(e);this.dt(e,n)?r.$e(n,1):r.Ue(n),this.Ye=this.Ye.insert(n,this.At(n).delete(e)),this.Ye=this.Ye.insert(n,this.At(n).add(e)),s&&(this.He=this.He.insert(n,s))}removeTarget(e){this.je.delete(e)}ut(e){const n=this.rt(e).qe();return this.ze.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}Ke(e){this.rt(e).Ke()}rt(e){let n=this.je.get(e);return n||(n=new Ff,this.je.set(e,n)),n}At(e){let n=this.Ye.get(e);return n||(n=new it(we),this.Ye=this.Ye.insert(e,n)),n}Et(e){let n=this.Je.get(e);return n||(n=new it(we),this.Je=this.Je.insert(e,n)),n}it(e){const n=this._t(e)!==null;return n||se("WatchChangeAggregator","Detected inactive target",e),n}_t(e){const n=this.je.get(e);return n&&n.Be?null:this.ze.Rt(e)}st(e){this.je.set(e,new Ff),this.ze.getRemoteKeysForTarget(e).forEach(n=>{this.tt(e,n,null)})}dt(e,n){return this.ze.getRemoteKeysForTarget(e).has(n)}}function Po(){return new ze(ce.comparator)}function $f(){return new ze(ce.comparator)}const f1={asc:"ASCENDING",desc:"DESCENDING"},p1={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},m1={and:"AND",or:"OR"};class g1{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function Eu(t,e){return t.useProto3Json||qa(e)?e:{value:e}}function _a(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function v_(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function _1(t,e){return _a(t,e.toTimestamp())}function An(t){return Me(!!t,49232),ye.fromTimestamp(function(n){const s=Ts(n);return new rt(s.seconds,s.nanos)}(t))}function Tc(t,e){return wu(t,e).canonicalString()}function wu(t,e){const n=function(r){return new je(["projects",r.projectId,"databases",r.database])}(t).child("documents");return e===void 0?n:n.child(e)}function b_(t){const e=je.fromString(t);return Me(A_(e),10190,{key:e.toString()}),e}function Tu(t,e){return Tc(t.databaseId,e.path)}function ql(t,e){const n=b_(e);if(n.get(1)!==t.databaseId.projectId)throw new re(B.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new re(B.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new ce(w_(n))}function E_(t,e){return Tc(t.databaseId,e)}function y1(t){const e=b_(t);return e.length===4?je.emptyPath():w_(e)}function Iu(t){return new je(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function w_(t){return Me(t.length>4&&t.get(4)==="documents",29091,{key:t.toString()}),t.popFirst(5)}function Bf(t,e,n){return{name:Tu(t,e),fields:n.value.mapValue.fields}}function v1(t,e){let n;if("targetChange"in e){e.targetChange;const s=function(c){return c==="NO_CHANGE"?0:c==="ADD"?1:c==="REMOVE"?2:c==="CURRENT"?3:c==="RESET"?4:ge(39313,{state:c})}(e.targetChange.targetChangeType||"NO_CHANGE"),r=e.targetChange.targetIds||[],i=function(c,f){return c.useProto3Json?(Me(f===void 0||typeof f=="string",58123),gt.fromBase64String(f||"")):(Me(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),gt.fromUint8Array(f||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(c){const f=c.code===void 0?B.UNKNOWN:g_(c.code);return new re(f,c.message||"")}(o);n=new y_(s,r,i,l||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const r=ql(t,s.document.name),i=An(s.document.updateTime),o=s.document.createTime?An(s.document.createTime):ye.min(),l=new Ut({mapValue:{fields:s.document.fields}}),u=It.newFoundDocument(r,i,o,l),c=s.targetIds||[],f=s.removedTargetIds||[];n=new Ho(c,f,u.key,u)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const r=ql(t,s.document),i=s.readTime?An(s.readTime):ye.min(),o=It.newNoDocument(r,i),l=s.removedTargetIds||[];n=new Ho([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const r=ql(t,s.document),i=s.removedTargetIds||[];n=new Ho([],i,r,null)}else{if(!("filter"in e))return ge(11601,{Vt:e});{e.filter;const s=e.filter;s.targetId;const{count:r=0,unchangedNames:i}=s,o=new u1(r,i),l=s.targetId;n=new __(l,o)}}return n}function b1(t,e){let n;if(e instanceof Zi)n={update:Bf(t,e.key,e.value)};else if(e instanceof bc)n={delete:Tu(t,e.key)};else if(e instanceof ks)n={update:Bf(t,e.key,e.data),updateMask:P1(e.fieldMask)};else{if(!(e instanceof o1))return ge(16599,{ft:e.type});n={verify:Tu(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(s=>function(i,o){const l=o.transform;if(l instanceof ma)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof Bi)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof ji)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof ga)return{fieldPath:o.field.canonicalString(),increment:l.Re};throw ge(20930,{transform:o.transform})}(0,s))),e.precondition.isNone||(n.currentDocument=function(r,i){return i.updateTime!==void 0?{updateTime:_1(r,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:ge(27497)}(t,e.precondition)),n}function E1(t,e){return t&&t.length>0?(Me(e!==void 0,14353),t.map(n=>function(r,i){let o=r.updateTime?An(r.updateTime):An(i);return o.isEqual(ye.min())&&(o=An(i)),new s1(o,r.transformResults||[])}(n,e))):[]}function w1(t,e){return{documents:[E_(t,e.path)]}}function T1(t,e){const n={structuredQuery:{}},s=e.path;let r;e.collectionGroup!==null?(r=s,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(r=s.popLast(),n.structuredQuery.from=[{collectionId:s.lastSegment()}]),n.parent=E_(t,r);const i=function(c){if(c.length!==0)return I_(pn.create(c,"and"))}(e.filters);i&&(n.structuredQuery.where=i);const o=function(c){if(c.length!==0)return c.map(f=>function(g){return{field:ur(g.field),direction:R1(g.dir)}}(f))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const l=Eu(t,e.limit);return l!==null&&(n.structuredQuery.limit=l),e.startAt&&(n.structuredQuery.startAt=function(c){return{before:c.inclusive,values:c.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(c){return{before:!c.inclusive,values:c.position}}(e.endAt)),{gt:n,parent:r}}function I1(t){let e=y1(t.parent);const n=t.structuredQuery,s=n.from?n.from.length:0;let r=null;if(s>0){Me(s===1,65062);const f=n.from[0];f.allDescendants?r=f.collectionId:e=e.child(f.collectionId)}let i=[];n.where&&(i=function(p){const g=T_(p);return g instanceof pn&&Zg(g)?g.getFilters():[g]}(n.where));let o=[];n.orderBy&&(o=function(p){return p.map(g=>function(b){return new $i(cr(b.field),function(E){switch(E){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(b.direction))}(g))}(n.orderBy));let l=null;n.limit&&(l=function(p){let g;return g=typeof p=="object"?p.value:p,qa(g)?null:g}(n.limit));let u=null;n.startAt&&(u=function(p){const g=!!p.before,_=p.values||[];return new fa(_,g)}(n.startAt));let c=null;return n.endAt&&(c=function(p){const g=!p.before,_=p.values||[];return new fa(_,g)}(n.endAt)),HA(e,r,o,i,l,"F",u,c)}function A1(t,e){const n=function(r){switch(r){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return ge(28987,{purpose:r})}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function T_(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const s=cr(n.unaryFilter.field);return Ze.create(s,"==",{doubleValue:NaN});case"IS_NULL":const r=cr(n.unaryFilter.field);return Ze.create(r,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=cr(n.unaryFilter.field);return Ze.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=cr(n.unaryFilter.field);return Ze.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return ge(61313);default:return ge(60726)}}(t):t.fieldFilter!==void 0?function(n){return Ze.create(cr(n.fieldFilter.field),function(r){switch(r){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return ge(58110);default:return ge(50506)}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return pn.create(n.compositeFilter.filters.map(s=>T_(s)),function(r){switch(r){case"AND":return"and";case"OR":return"or";default:return ge(1026)}}(n.compositeFilter.op))}(t):ge(30097,{filter:t})}function R1(t){return f1[t]}function S1(t){return p1[t]}function C1(t){return m1[t]}function ur(t){return{fieldPath:t.canonicalString()}}function cr(t){return mt.fromServerFormat(t.fieldPath)}function I_(t){return t instanceof Ze?function(n){if(n.op==="=="){if(Cf(n.value))return{unaryFilter:{field:ur(n.field),op:"IS_NAN"}};if(Sf(n.value))return{unaryFilter:{field:ur(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(Cf(n.value))return{unaryFilter:{field:ur(n.field),op:"IS_NOT_NAN"}};if(Sf(n.value))return{unaryFilter:{field:ur(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ur(n.field),op:S1(n.op),value:n.value}}}(t):t instanceof pn?function(n){const s=n.getFilters().map(r=>I_(r));return s.length===1?s[0]:{compositeFilter:{op:C1(n.op),filters:s}}}(t):ge(54877,{filter:t})}function P1(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function A_(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ds{constructor(e,n,s,r,i=ye.min(),o=ye.min(),l=gt.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=n,this.purpose=s,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=u}withSequenceNumber(e){return new ds(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new ds(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new ds(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new ds(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class k1{constructor(e){this.wt=e}}function x1(t){const e=I1({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?pa(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V1{constructor(){this.Cn=new D1}addToCollectionParentIndex(e,n){return this.Cn.add(n),j.resolve()}getCollectionParents(e,n){return j.resolve(this.Cn.getEntries(n))}addFieldIndex(e,n){return j.resolve()}deleteFieldIndex(e,n){return j.resolve()}deleteAllFieldIndexes(e){return j.resolve()}createTargetIndexes(e,n){return j.resolve()}getDocumentsMatchingTarget(e,n){return j.resolve(null)}getIndexType(e,n){return j.resolve(0)}getFieldIndexes(e,n){return j.resolve([])}getNextCollectionGroupToUpdate(e){return j.resolve(null)}getMinOffset(e,n){return j.resolve(ws.min())}getMinOffsetFromCollectionGroup(e,n){return j.resolve(ws.min())}updateCollectionGroup(e,n,s){return j.resolve()}updateIndexEntries(e,n){return j.resolve()}}class D1{constructor(){this.index={}}add(e){const n=e.lastSegment(),s=e.popLast(),r=this.index[n]||new it(je.comparator),i=!r.has(s);return this.index[n]=r.add(s),i}has(e){const n=e.lastSegment(),s=e.popLast(),r=this.index[n];return r&&r.has(s)}getEntries(e){return(this.index[e]||new it(je.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jf={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},R_=41943040;class Lt{static withCacheSize(e){return new Lt(e,Lt.DEFAULT_COLLECTION_PERCENTILE,Lt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,n,s){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=n,this.maximumSequenceNumbersToCollect=s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Lt.DEFAULT_COLLECTION_PERCENTILE=10,Lt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Lt.DEFAULT=new Lt(R_,Lt.DEFAULT_COLLECTION_PERCENTILE,Lt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Lt.DISABLED=new Lt(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vr{constructor(e){this.ur=e}next(){return this.ur+=2,this.ur}static cr(){return new Vr(0)}static lr(){return new Vr(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qf="LruGarbageCollector",N1=1048576;function Hf([t,e],[n,s]){const r=we(t,n);return r===0?we(e,s):r}class O1{constructor(e){this.Er=e,this.buffer=new it(Hf),this.dr=0}Ar(){return++this.dr}Rr(e){const n=[e,this.Ar()];if(this.buffer.size<this.Er)this.buffer=this.buffer.add(n);else{const s=this.buffer.last();Hf(n,s)<0&&(this.buffer=this.buffer.delete(s).add(n))}}get maxValue(){return this.buffer.last()[0]}}class M1{constructor(e,n,s){this.garbageCollector=e,this.asyncQueue=n,this.localStore=s,this.Vr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.mr(6e4)}stop(){this.Vr&&(this.Vr.cancel(),this.Vr=null)}get started(){return this.Vr!==null}mr(e){se(qf,`Garbage collection scheduled in ${e}ms`),this.Vr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Vr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(n){$r(n)?se(qf,"Ignoring IndexedDB error during garbage collection: ",n):await Fr(n)}await this.mr(3e5)})}}class L1{constructor(e,n){this.gr=e,this.params=n}calculateTargetCount(e,n){return this.gr.pr(e).next(s=>Math.floor(n/100*s))}nthSequenceNumber(e,n){if(n===0)return j.resolve(ja.le);const s=new O1(n);return this.gr.forEachTarget(e,r=>s.Rr(r.sequenceNumber)).next(()=>this.gr.yr(e,r=>s.Rr(r))).next(()=>s.maxValue)}removeTargets(e,n,s){return this.gr.removeTargets(e,n,s)}removeOrphanedDocuments(e,n){return this.gr.removeOrphanedDocuments(e,n)}collect(e,n){return this.params.cacheSizeCollectionThreshold===-1?(se("LruGarbageCollector","Garbage collection skipped; disabled"),j.resolve(jf)):this.getCacheSize(e).next(s=>s<this.params.cacheSizeCollectionThreshold?(se("LruGarbageCollector",`Garbage collection skipped; Cache size ${s} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),jf):this.wr(e,n))}getCacheSize(e){return this.gr.getCacheSize(e)}wr(e,n){let s,r,i,o,l,u,c;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(p=>(p>this.params.maximumSequenceNumbersToCollect?(se("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${p}`),r=this.params.maximumSequenceNumbersToCollect):r=p,o=Date.now(),this.nthSequenceNumber(e,r))).next(p=>(s=p,l=Date.now(),this.removeTargets(e,s,n))).next(p=>(i=p,u=Date.now(),this.removeOrphanedDocuments(e,s))).next(p=>(c=Date.now(),ar()<=Ie.DEBUG&&se("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-f}ms
	Determined least recently used ${r} in `+(l-o)+`ms
	Removed ${i} targets in `+(u-l)+`ms
	Removed ${p} documents in `+(c-u)+`ms
Total Duration: ${c-f}ms`),j.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:i,documentsRemoved:p})))}}function U1(t,e){return new L1(t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F1{constructor(){this.changes=new Js(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,It.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const s=this.changes.get(n);return s!==void 0?j.resolve(s):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $1{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B1{constructor(e,n,s,r){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=s,this.indexManager=r}getDocument(e,n){let s=null;return this.documentOverlayCache.getOverlay(e,n).next(r=>(s=r,this.remoteDocumentCache.getEntry(e,n))).next(r=>(s!==null&&Ai(s.mutation,r,Kt.empty(),rt.now()),r))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(s=>this.getLocalViewOfDocuments(e,s,Ae()).next(()=>s))}getLocalViewOfDocuments(e,n,s=Ae()){const r=$s();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,s).next(i=>{let o=ui();return i.forEach((l,u)=>{o=o.insert(l,u.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const s=$s();return this.populateOverlays(e,s,n).next(()=>this.computeViews(e,n,s,Ae()))}populateOverlays(e,n,s){const r=[];return s.forEach(i=>{n.has(i)||r.push(i)}),this.documentOverlayCache.getOverlays(e,r).next(i=>{i.forEach((o,l)=>{n.set(o,l)})})}computeViews(e,n,s,r){let i=Gn();const o=Ii(),l=function(){return Ii()}();return n.forEach((u,c)=>{const f=s.get(c.key);r.has(c.key)&&(f===void 0||f.mutation instanceof ks)?i=i.insert(c.key,c):f!==void 0?(o.set(c.key,f.mutation.getFieldMask()),Ai(f.mutation,c,f.mutation.getFieldMask(),rt.now())):o.set(c.key,Kt.empty())}),this.recalculateAndSaveOverlays(e,i).next(u=>(u.forEach((c,f)=>o.set(c,f)),n.forEach((c,f)=>{var p;return l.set(c,new $1(f,(p=o.get(c))!==null&&p!==void 0?p:null))}),l))}recalculateAndSaveOverlays(e,n){const s=Ii();let r=new ze((o,l)=>o-l),i=Ae();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const l of o)l.keys().forEach(u=>{const c=n.get(u);if(c===null)return;let f=s.get(u)||Kt.empty();f=l.applyToLocalView(c,f),s.set(u,f);const p=(r.get(l.batchId)||Ae()).add(u);r=r.insert(l.batchId,p)})}).next(()=>{const o=[],l=r.getReverseIterator();for(;l.hasNext();){const u=l.getNext(),c=u.key,f=u.value,p=l_();f.forEach(g=>{if(!i.has(g)){const _=p_(n.get(g),s.get(g));_!==null&&p.set(g,_),i=i.add(g)}}),o.push(this.documentOverlayCache.saveOverlays(e,c,p))}return j.waitFor(o)}).next(()=>s)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(s=>this.recalculateAndSaveOverlays(e,s))}getDocumentsMatchingQuery(e,n,s,r){return function(o){return ce.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):s_(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,s,r):this.getDocumentsMatchingCollectionQuery(e,n,s,r)}getNextDocuments(e,n,s,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,s,r).next(i=>{const o=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,s.largestBatchId,r-i.size):j.resolve($s());let l=Mi,u=i;return o.next(c=>j.forEach(c,(f,p)=>(l<p.largestBatchId&&(l=p.largestBatchId),i.get(f)?j.resolve():this.remoteDocumentCache.getEntry(e,f).next(g=>{u=u.insert(f,g)}))).next(()=>this.populateOverlays(e,c,i)).next(()=>this.computeViews(e,u,c,Ae())).next(f=>({batchId:l,changes:a_(f)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new ce(n)).next(s=>{let r=ui();return s.isFoundDocument()&&(r=r.insert(s.key,s)),r})}getDocumentsMatchingCollectionGroupQuery(e,n,s,r){const i=n.collectionGroup;let o=ui();return this.indexManager.getCollectionParents(e,i).next(l=>j.forEach(l,u=>{const c=function(p,g){return new Br(g,null,p.explicitOrderBy.slice(),p.filters.slice(),p.limit,p.limitType,p.startAt,p.endAt)}(n,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,c,s,r).next(f=>{f.forEach((p,g)=>{o=o.insert(p,g)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,s,r){let i;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,s.largestBatchId).next(o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,s,i,r))).next(o=>{i.forEach((u,c)=>{const f=c.getKey();o.get(f)===null&&(o=o.insert(f,It.newInvalidDocument(f)))});let l=ui();return o.forEach((u,c)=>{const f=i.get(u);f!==void 0&&Ai(f.mutation,c,Kt.empty(),rt.now()),za(n,c)&&(l=l.insert(u,c))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j1{constructor(e){this.serializer=e,this.kr=new Map,this.qr=new Map}getBundleMetadata(e,n){return j.resolve(this.kr.get(n))}saveBundleMetadata(e,n){return this.kr.set(n.id,function(r){return{id:r.id,version:r.version,createTime:An(r.createTime)}}(n)),j.resolve()}getNamedQuery(e,n){return j.resolve(this.qr.get(n))}saveNamedQuery(e,n){return this.qr.set(n.name,function(r){return{name:r.name,query:x1(r.bundledQuery),readTime:An(r.readTime)}}(n)),j.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q1{constructor(){this.overlays=new ze(ce.comparator),this.Qr=new Map}getOverlay(e,n){return j.resolve(this.overlays.get(n))}getOverlays(e,n){const s=$s();return j.forEach(n,r=>this.getOverlay(e,r).next(i=>{i!==null&&s.set(r,i)})).next(()=>s)}saveOverlays(e,n,s){return s.forEach((r,i)=>{this.bt(e,n,i)}),j.resolve()}removeOverlaysForBatchId(e,n,s){const r=this.Qr.get(s);return r!==void 0&&(r.forEach(i=>this.overlays=this.overlays.remove(i)),this.Qr.delete(s)),j.resolve()}getOverlaysForCollection(e,n,s){const r=$s(),i=n.length+1,o=new ce(n.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const u=l.getNext().value,c=u.getKey();if(!n.isPrefixOf(c.path))break;c.path.length===i&&u.largestBatchId>s&&r.set(u.getKey(),u)}return j.resolve(r)}getOverlaysForCollectionGroup(e,n,s,r){let i=new ze((c,f)=>c-f);const o=this.overlays.getIterator();for(;o.hasNext();){const c=o.getNext().value;if(c.getKey().getCollectionGroup()===n&&c.largestBatchId>s){let f=i.get(c.largestBatchId);f===null&&(f=$s(),i=i.insert(c.largestBatchId,f)),f.set(c.getKey(),c)}}const l=$s(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((c,f)=>l.set(c,f)),!(l.size()>=r)););return j.resolve(l)}bt(e,n,s){const r=this.overlays.get(s.key);if(r!==null){const o=this.Qr.get(r.largestBatchId).delete(s.key);this.Qr.set(r.largestBatchId,o)}this.overlays=this.overlays.insert(s.key,new l1(n,s));let i=this.Qr.get(n);i===void 0&&(i=Ae(),this.Qr.set(n,i)),this.Qr.set(n,i.add(s.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H1{constructor(){this.sessionToken=gt.EMPTY_BYTE_STRING}getSessionToken(e){return j.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,j.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ic{constructor(){this.$r=new it(ot.Ur),this.Kr=new it(ot.Wr)}isEmpty(){return this.$r.isEmpty()}addReference(e,n){const s=new ot(e,n);this.$r=this.$r.add(s),this.Kr=this.Kr.add(s)}Gr(e,n){e.forEach(s=>this.addReference(s,n))}removeReference(e,n){this.zr(new ot(e,n))}jr(e,n){e.forEach(s=>this.removeReference(s,n))}Hr(e){const n=new ce(new je([])),s=new ot(n,e),r=new ot(n,e+1),i=[];return this.Kr.forEachInRange([s,r],o=>{this.zr(o),i.push(o.key)}),i}Jr(){this.$r.forEach(e=>this.zr(e))}zr(e){this.$r=this.$r.delete(e),this.Kr=this.Kr.delete(e)}Yr(e){const n=new ce(new je([])),s=new ot(n,e),r=new ot(n,e+1);let i=Ae();return this.Kr.forEachInRange([s,r],o=>{i=i.add(o.key)}),i}containsKey(e){const n=new ot(e,0),s=this.$r.firstAfterOrEqual(n);return s!==null&&e.isEqual(s.key)}}class ot{constructor(e,n){this.key=e,this.Zr=n}static Ur(e,n){return ce.comparator(e.key,n.key)||we(e.Zr,n.Zr)}static Wr(e,n){return we(e.Zr,n.Zr)||ce.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K1{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.nr=1,this.Xr=new it(ot.Ur)}checkEmpty(e){return j.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,s,r){const i=this.nr;this.nr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new a1(i,n,s,r);this.mutationQueue.push(o);for(const l of r)this.Xr=this.Xr.add(new ot(l.key,i)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return j.resolve(o)}lookupMutationBatch(e,n){return j.resolve(this.ei(n))}getNextMutationBatchAfterBatchId(e,n){const s=n+1,r=this.ti(s),i=r<0?0:r;return j.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return j.resolve(this.mutationQueue.length===0?fc:this.nr-1)}getAllMutationBatches(e){return j.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const s=new ot(n,0),r=new ot(n,Number.POSITIVE_INFINITY),i=[];return this.Xr.forEachInRange([s,r],o=>{const l=this.ei(o.Zr);i.push(l)}),j.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,n){let s=new it(we);return n.forEach(r=>{const i=new ot(r,0),o=new ot(r,Number.POSITIVE_INFINITY);this.Xr.forEachInRange([i,o],l=>{s=s.add(l.Zr)})}),j.resolve(this.ni(s))}getAllMutationBatchesAffectingQuery(e,n){const s=n.path,r=s.length+1;let i=s;ce.isDocumentKey(i)||(i=i.child(""));const o=new ot(new ce(i),0);let l=new it(we);return this.Xr.forEachWhile(u=>{const c=u.key.path;return!!s.isPrefixOf(c)&&(c.length===r&&(l=l.add(u.Zr)),!0)},o),j.resolve(this.ni(l))}ni(e){const n=[];return e.forEach(s=>{const r=this.ei(s);r!==null&&n.push(r)}),n}removeMutationBatch(e,n){Me(this.ri(n.batchId,"removed")===0,55003),this.mutationQueue.shift();let s=this.Xr;return j.forEach(n.mutations,r=>{const i=new ot(r.key,n.batchId);return s=s.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.Xr=s})}sr(e){}containsKey(e,n){const s=new ot(n,0),r=this.Xr.firstAfterOrEqual(s);return j.resolve(n.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,j.resolve()}ri(e,n){return this.ti(e)}ti(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}ei(e){const n=this.ti(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z1{constructor(e){this.ii=e,this.docs=function(){return new ze(ce.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const s=n.key,r=this.docs.get(s),i=r?r.size:0,o=this.ii(n);return this.docs=this.docs.insert(s,{document:n.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const s=this.docs.get(n);return j.resolve(s?s.document.mutableCopy():It.newInvalidDocument(n))}getEntries(e,n){let s=Gn();return n.forEach(r=>{const i=this.docs.get(r);s=s.insert(r,i?i.document.mutableCopy():It.newInvalidDocument(r))}),j.resolve(s)}getDocumentsMatchingQuery(e,n,s,r){let i=Gn();const o=n.path,l=new ce(o.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(l);for(;u.hasNext();){const{key:c,value:{document:f}}=u.getNext();if(!o.isPrefixOf(c.path))break;c.path.length>o.length+1||wA(EA(f),s)<=0||(r.has(f.key)||za(n,f))&&(i=i.insert(f.key,f.mutableCopy()))}return j.resolve(i)}getAllFromCollectionGroup(e,n,s,r){ge(9500)}si(e,n){return j.forEach(this.docs,s=>n(s))}newChangeBuffer(e){return new G1(this)}getSize(e){return j.resolve(this.size)}}class G1 extends F1{constructor(e){super(),this.Br=e}applyChanges(e){const n=[];return this.changes.forEach((s,r)=>{r.isValidDocument()?n.push(this.Br.addEntry(e,r)):this.Br.removeEntry(s)}),j.waitFor(n)}getFromCache(e,n){return this.Br.getEntry(e,n)}getAllFromCache(e,n){return this.Br.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W1{constructor(e){this.persistence=e,this.oi=new Js(n=>gc(n),_c),this.lastRemoteSnapshotVersion=ye.min(),this.highestTargetId=0,this._i=0,this.ai=new Ic,this.targetCount=0,this.ui=Vr.cr()}forEachTarget(e,n){return this.oi.forEach((s,r)=>n(r)),j.resolve()}getLastRemoteSnapshotVersion(e){return j.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return j.resolve(this._i)}allocateTargetId(e){return this.highestTargetId=this.ui.next(),j.resolve(this.highestTargetId)}setTargetsMetadata(e,n,s){return s&&(this.lastRemoteSnapshotVersion=s),n>this._i&&(this._i=n),j.resolve()}Tr(e){this.oi.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.ui=new Vr(n),this.highestTargetId=n),e.sequenceNumber>this._i&&(this._i=e.sequenceNumber)}addTargetData(e,n){return this.Tr(n),this.targetCount+=1,j.resolve()}updateTargetData(e,n){return this.Tr(n),j.resolve()}removeTargetData(e,n){return this.oi.delete(n.target),this.ai.Hr(n.targetId),this.targetCount-=1,j.resolve()}removeTargets(e,n,s){let r=0;const i=[];return this.oi.forEach((o,l)=>{l.sequenceNumber<=n&&s.get(l.targetId)===null&&(this.oi.delete(o),i.push(this.removeMatchingKeysForTargetId(e,l.targetId)),r++)}),j.waitFor(i).next(()=>r)}getTargetCount(e){return j.resolve(this.targetCount)}getTargetData(e,n){const s=this.oi.get(n)||null;return j.resolve(s)}addMatchingKeys(e,n,s){return this.ai.Gr(n,s),j.resolve()}removeMatchingKeys(e,n,s){this.ai.jr(n,s);const r=this.persistence.referenceDelegate,i=[];return r&&n.forEach(o=>{i.push(r.markPotentiallyOrphaned(e,o))}),j.waitFor(i)}removeMatchingKeysForTargetId(e,n){return this.ai.Hr(n),j.resolve()}getMatchingKeysForTargetId(e,n){const s=this.ai.Yr(n);return j.resolve(s)}containsKey(e,n){return j.resolve(this.ai.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S_{constructor(e,n){this.ci={},this.overlays={},this.li=new ja(0),this.hi=!1,this.hi=!0,this.Pi=new H1,this.referenceDelegate=e(this),this.Ti=new W1(this),this.indexManager=new V1,this.remoteDocumentCache=function(r){return new z1(r)}(s=>this.referenceDelegate.Ii(s)),this.serializer=new k1(n),this.Ei=new j1(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.hi=!1,Promise.resolve()}get started(){return this.hi}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new q1,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let s=this.ci[e.toKey()];return s||(s=new K1(n,this.referenceDelegate),this.ci[e.toKey()]=s),s}getGlobalsCache(){return this.Pi}getTargetCache(){return this.Ti}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ei}runTransaction(e,n,s){se("MemoryPersistence","Starting transaction:",e);const r=new Q1(this.li.next());return this.referenceDelegate.di(),s(r).next(i=>this.referenceDelegate.Ai(r).next(()=>i)).toPromise().then(i=>(r.raiseOnCommittedEvent(),i))}Ri(e,n){return j.or(Object.values(this.ci).map(s=>()=>s.containsKey(e,n)))}}class Q1 extends IA{constructor(e){super(),this.currentSequenceNumber=e}}class Ac{constructor(e){this.persistence=e,this.Vi=new Ic,this.mi=null}static fi(e){return new Ac(e)}get gi(){if(this.mi)return this.mi;throw ge(60996)}addReference(e,n,s){return this.Vi.addReference(s,n),this.gi.delete(s.toString()),j.resolve()}removeReference(e,n,s){return this.Vi.removeReference(s,n),this.gi.add(s.toString()),j.resolve()}markPotentiallyOrphaned(e,n){return this.gi.add(n.toString()),j.resolve()}removeTarget(e,n){this.Vi.Hr(n.targetId).forEach(r=>this.gi.add(r.toString()));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,n.targetId).next(r=>{r.forEach(i=>this.gi.add(i.toString()))}).next(()=>s.removeTargetData(e,n))}di(){this.mi=new Set}Ai(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return j.forEach(this.gi,s=>{const r=ce.fromPath(s);return this.pi(e,r).next(i=>{i||n.removeEntry(r,ye.min())})}).next(()=>(this.mi=null,n.apply(e)))}updateLimboDocument(e,n){return this.pi(e,n).next(s=>{s?this.gi.delete(n.toString()):this.gi.add(n.toString())})}Ii(e){return 0}pi(e,n){return j.or([()=>j.resolve(this.Vi.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Ri(e,n)])}}class ya{constructor(e,n){this.persistence=e,this.yi=new Js(s=>SA(s.path),(s,r)=>s.isEqual(r)),this.garbageCollector=U1(this,n)}static fi(e,n){return new ya(e,n)}di(){}Ai(e){return j.resolve()}forEachTarget(e,n){return this.persistence.getTargetCache().forEachTarget(e,n)}pr(e){const n=this.Sr(e);return this.persistence.getTargetCache().getTargetCount(e).next(s=>n.next(r=>s+r))}Sr(e){let n=0;return this.yr(e,s=>{n++}).next(()=>n)}yr(e,n){return j.forEach(this.yi,(s,r)=>this.Dr(e,s,r).next(i=>i?j.resolve():n(r)))}removeTargets(e,n,s){return this.persistence.getTargetCache().removeTargets(e,n,s)}removeOrphanedDocuments(e,n){let s=0;const r=this.persistence.getRemoteDocumentCache(),i=r.newChangeBuffer();return r.si(e,o=>this.Dr(e,o,n).next(l=>{l||(s++,i.removeEntry(o,ye.min()))})).next(()=>i.apply(e)).next(()=>s)}markPotentiallyOrphaned(e,n){return this.yi.set(n,e.currentSequenceNumber),j.resolve()}removeTarget(e,n){const s=n.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,s)}addReference(e,n,s){return this.yi.set(s,e.currentSequenceNumber),j.resolve()}removeReference(e,n,s){return this.yi.set(s,e.currentSequenceNumber),j.resolve()}updateLimboDocument(e,n){return this.yi.set(n,e.currentSequenceNumber),j.resolve()}Ii(e){let n=e.key.toString().length;return e.isFoundDocument()&&(n+=Bo(e.data.value)),n}Dr(e,n,s){return j.or([()=>this.persistence.Ri(e,n),()=>this.persistence.getTargetCache().containsKey(e,n),()=>{const r=this.yi.get(n);return j.resolve(r!==void 0&&r>s)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rc{constructor(e,n,s,r){this.targetId=e,this.fromCache=n,this.ds=s,this.As=r}static Rs(e,n){let s=Ae(),r=Ae();for(const i of n.docChanges)switch(i.type){case 0:s=s.add(i.doc.key);break;case 1:r=r.add(i.doc.key)}return new Rc(e,n.fromCache,s,r)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y1{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J1{constructor(){this.Vs=!1,this.fs=!1,this.gs=100,this.ps=function(){return Vw()?8:AA(Pt())>0?6:4}()}initialize(e,n){this.ys=e,this.indexManager=n,this.Vs=!0}getDocumentsMatchingQuery(e,n,s,r){const i={result:null};return this.ws(e,n).next(o=>{i.result=o}).next(()=>{if(!i.result)return this.Ss(e,n,r,s).next(o=>{i.result=o})}).next(()=>{if(i.result)return;const o=new Y1;return this.bs(e,n,o).next(l=>{if(i.result=l,this.fs)return this.Ds(e,n,o,l.size)})}).next(()=>i.result)}Ds(e,n,s,r){return s.documentReadCount<this.gs?(ar()<=Ie.DEBUG&&se("QueryEngine","SDK will not create cache indexes for query:",lr(n),"since it only creates cache indexes for collection contains","more than or equal to",this.gs,"documents"),j.resolve()):(ar()<=Ie.DEBUG&&se("QueryEngine","Query:",lr(n),"scans",s.documentReadCount,"local documents and returns",r,"documents as results."),s.documentReadCount>this.ps*r?(ar()<=Ie.DEBUG&&se("QueryEngine","The SDK decides to create cache indexes for query:",lr(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,In(n))):j.resolve())}ws(e,n){if(Vf(n))return j.resolve(null);let s=In(n);return this.indexManager.getIndexType(e,s).next(r=>r===0?null:(n.limit!==null&&r===1&&(n=pa(n,null,"F"),s=In(n)),this.indexManager.getDocumentsMatchingTarget(e,s).next(i=>{const o=Ae(...i);return this.ys.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,s).next(u=>{const c=this.vs(n,l);return this.Cs(n,c,o,u.readTime)?this.ws(e,pa(n,null,"F")):this.Fs(e,c,n,u)}))})))}Ss(e,n,s,r){return Vf(n)||r.isEqual(ye.min())?j.resolve(null):this.ys.getDocuments(e,s).next(i=>{const o=this.vs(n,i);return this.Cs(n,o,s,r)?j.resolve(null):(ar()<=Ie.DEBUG&&se("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),lr(n)),this.Fs(e,o,n,bA(r,Mi)).next(l=>l))})}vs(e,n){let s=new it(i_(e));return n.forEach((r,i)=>{za(e,i)&&(s=s.add(i))}),s}Cs(e,n,s,r){if(e.limit===null)return!1;if(s.size!==n.size)return!0;const i=e.limitType==="F"?n.last():n.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}bs(e,n,s){return ar()<=Ie.DEBUG&&se("QueryEngine","Using full collection scan to execute query:",lr(n)),this.ys.getDocumentsMatchingQuery(e,n,ws.min(),s)}Fs(e,n,s,r){return this.ys.getDocumentsMatchingQuery(e,s,r).next(i=>(n.forEach(o=>{i=i.insert(o.key,o)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sc="LocalStore",X1=3e8;class Z1{constructor(e,n,s,r){this.persistence=e,this.Ms=n,this.serializer=r,this.xs=new ze(we),this.Os=new Js(i=>gc(i),_c),this.Ns=new Map,this.Bs=e.getRemoteDocumentCache(),this.Ti=e.getTargetCache(),this.Ei=e.getBundleCache(),this.Ls(s)}Ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new B1(this.Bs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Bs.setIndexManager(this.indexManager),this.Ms.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.xs))}}function eR(t,e,n,s){return new Z1(t,e,n,s)}async function C_(t,e){const n=ve(t);return await n.persistence.runTransaction("Handle user change","readonly",s=>{let r;return n.mutationQueue.getAllMutationBatches(s).next(i=>(r=i,n.Ls(e),n.mutationQueue.getAllMutationBatches(s))).next(i=>{const o=[],l=[];let u=Ae();for(const c of r){o.push(c.batchId);for(const f of c.mutations)u=u.add(f.key)}for(const c of i){l.push(c.batchId);for(const f of c.mutations)u=u.add(f.key)}return n.localDocuments.getDocuments(s,u).next(c=>({ks:c,removedBatchIds:o,addedBatchIds:l}))})})}function tR(t,e){const n=ve(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",s=>{const r=e.batch.keys(),i=n.Bs.newChangeBuffer({trackRemovals:!0});return function(l,u,c,f){const p=c.batch,g=p.keys();let _=j.resolve();return g.forEach(b=>{_=_.next(()=>f.getEntry(u,b)).next(y=>{const E=c.docVersions.get(b);Me(E!==null,48541),y.version.compareTo(E)<0&&(p.applyToRemoteDocument(y,c),y.isValidDocument()&&(y.setReadTime(c.commitVersion),f.addEntry(y)))})}),_.next(()=>l.mutationQueue.removeMutationBatch(u,p))}(n,s,e,i).next(()=>i.apply(s)).next(()=>n.mutationQueue.performConsistencyCheck(s)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(s,r,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,function(l){let u=Ae();for(let c=0;c<l.mutationResults.length;++c)l.mutationResults[c].transformResults.length>0&&(u=u.add(l.batch.mutations[c].key));return u}(e))).next(()=>n.localDocuments.getDocuments(s,r))})}function P_(t){const e=ve(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Ti.getLastRemoteSnapshotVersion(n))}function nR(t,e){const n=ve(t),s=e.snapshotVersion;let r=n.xs;return n.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const o=n.Bs.newChangeBuffer({trackRemovals:!0});r=n.xs;const l=[];e.targetChanges.forEach((f,p)=>{const g=r.get(p);if(!g)return;l.push(n.Ti.removeMatchingKeys(i,f.removedDocuments,p).next(()=>n.Ti.addMatchingKeys(i,f.addedDocuments,p)));let _=g.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(p)!==null?_=_.withResumeToken(gt.EMPTY_BYTE_STRING,ye.min()).withLastLimboFreeSnapshotVersion(ye.min()):f.resumeToken.approximateByteSize()>0&&(_=_.withResumeToken(f.resumeToken,s)),r=r.insert(p,_),function(y,E,k){return y.resumeToken.approximateByteSize()===0||E.snapshotVersion.toMicroseconds()-y.snapshotVersion.toMicroseconds()>=X1?!0:k.addedDocuments.size+k.modifiedDocuments.size+k.removedDocuments.size>0}(g,_,f)&&l.push(n.Ti.updateTargetData(i,_))});let u=Gn(),c=Ae();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&l.push(n.persistence.referenceDelegate.updateLimboDocument(i,f))}),l.push(sR(i,o,e.documentUpdates).next(f=>{u=f.qs,c=f.Qs})),!s.isEqual(ye.min())){const f=n.Ti.getLastRemoteSnapshotVersion(i).next(p=>n.Ti.setTargetsMetadata(i,i.currentSequenceNumber,s));l.push(f)}return j.waitFor(l).next(()=>o.apply(i)).next(()=>n.localDocuments.getLocalViewOfDocuments(i,u,c)).next(()=>u)}).then(i=>(n.xs=r,i))}function sR(t,e,n){let s=Ae(),r=Ae();return n.forEach(i=>s=s.add(i)),e.getEntries(t,s).next(i=>{let o=Gn();return n.forEach((l,u)=>{const c=i.get(l);u.isFoundDocument()!==c.isFoundDocument()&&(r=r.add(l)),u.isNoDocument()&&u.version.isEqual(ye.min())?(e.removeEntry(l,u.readTime),o=o.insert(l,u)):!c.isValidDocument()||u.version.compareTo(c.version)>0||u.version.compareTo(c.version)===0&&c.hasPendingWrites?(e.addEntry(u),o=o.insert(l,u)):se(Sc,"Ignoring outdated watch update for ",l,". Current version:",c.version," Watch version:",u.version)}),{qs:o,Qs:r}})}function rR(t,e){const n=ve(t);return n.persistence.runTransaction("Get next mutation batch","readonly",s=>(e===void 0&&(e=fc),n.mutationQueue.getNextMutationBatchAfterBatchId(s,e)))}function iR(t,e){const n=ve(t);return n.persistence.runTransaction("Allocate target","readwrite",s=>{let r;return n.Ti.getTargetData(s,e).next(i=>i?(r=i,j.resolve(r)):n.Ti.allocateTargetId(s).next(o=>(r=new ds(e,o,"TargetPurposeListen",s.currentSequenceNumber),n.Ti.addTargetData(s,r).next(()=>r))))}).then(s=>{const r=n.xs.get(s.targetId);return(r===null||s.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(n.xs=n.xs.insert(s.targetId,s),n.Os.set(e,s.targetId)),s})}async function Au(t,e,n){const s=ve(t),r=s.xs.get(e),i=n?"readwrite":"readwrite-primary";try{n||await s.persistence.runTransaction("Release target",i,o=>s.persistence.referenceDelegate.removeTarget(o,r))}catch(o){if(!$r(o))throw o;se(Sc,`Failed to update sequence numbers for target ${e}: ${o}`)}s.xs=s.xs.remove(e),s.Os.delete(r.target)}function Kf(t,e,n){const s=ve(t);let r=ye.min(),i=Ae();return s.persistence.runTransaction("Execute query","readwrite",o=>function(u,c,f){const p=ve(u),g=p.Os.get(f);return g!==void 0?j.resolve(p.xs.get(g)):p.Ti.getTargetData(c,f)}(s,o,In(e)).next(l=>{if(l)return r=l.lastLimboFreeSnapshotVersion,s.Ti.getMatchingKeysForTargetId(o,l.targetId).next(u=>{i=u})}).next(()=>s.Ms.getDocumentsMatchingQuery(o,e,n?r:ye.min(),n?i:Ae())).next(l=>(oR(s,zA(e),l),{documents:l,$s:i})))}function oR(t,e,n){let s=t.Ns.get(e)||ye.min();n.forEach((r,i)=>{i.readTime.compareTo(s)>0&&(s=i.readTime)}),t.Ns.set(e,s)}class zf{constructor(){this.activeTargetIds=XA()}js(e){this.activeTargetIds=this.activeTargetIds.add(e)}Hs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}zs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class aR{constructor(){this.xo=new zf,this.Oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,s){}addLocalQueryTarget(e,n=!0){return n&&this.xo.js(e),this.Oo[e]||"not-current"}updateQueryState(e,n,s){this.Oo[e]=n}removeLocalQueryTarget(e){this.xo.Hs(e)}isLocalQueryTarget(e){return this.xo.activeTargetIds.has(e)}clearQueryState(e){delete this.Oo[e]}getAllActiveQueryTargets(){return this.xo.activeTargetIds}isActiveQueryTarget(e){return this.xo.activeTargetIds.has(e)}start(){return this.xo=new zf,Promise.resolve()}handleUserChange(e,n,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lR{No(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gf="ConnectivityMonitor";class Wf{constructor(){this.Bo=()=>this.Lo(),this.ko=()=>this.qo(),this.Qo=[],this.$o()}No(e){this.Qo.push(e)}shutdown(){window.removeEventListener("online",this.Bo),window.removeEventListener("offline",this.ko)}$o(){window.addEventListener("online",this.Bo),window.addEventListener("offline",this.ko)}Lo(){se(Gf,"Network connectivity changed: AVAILABLE");for(const e of this.Qo)e(0)}qo(){se(Gf,"Network connectivity changed: UNAVAILABLE");for(const e of this.Qo)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ko=null;function Ru(){return ko===null?ko=function(){return 268435456+Math.round(2147483648*Math.random())}():ko++,"0x"+ko.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hl="RestConnection",uR={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class cR{get Uo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const n=e.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.Ko=n+"://"+e.host,this.Wo=`projects/${s}/databases/${r}`,this.Go=this.databaseId.database===ha?`project_id=${s}`:`project_id=${s}&database_id=${r}`}zo(e,n,s,r,i){const o=Ru(),l=this.jo(e,n.toUriEncodedString());se(Hl,`Sending RPC '${e}' ${o}:`,l,s);const u={"google-cloud-resource-prefix":this.Wo,"x-goog-request-params":this.Go};this.Ho(u,r,i);const{host:c}=new URL(l),f=zi(c);return this.Jo(e,l,u,s,f).then(p=>(se(Hl,`Received RPC '${e}' ${o}: `,p),p),p=>{throw Cr(Hl,`RPC '${e}' ${o} failed with error: `,p,"url: ",l,"request:",s),p})}Yo(e,n,s,r,i,o){return this.zo(e,n,s,r,i)}Ho(e,n,s){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Ur}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach((r,i)=>e[i]=r),s&&s.headers.forEach((r,i)=>e[i]=r)}jo(e,n){const s=uR[e];return`${this.Ko}/v1/${n}:${s}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hR{constructor(e){this.Zo=e.Zo,this.Xo=e.Xo}e_(e){this.t_=e}n_(e){this.r_=e}i_(e){this.s_=e}onMessage(e){this.o_=e}close(){this.Xo()}send(e){this.Zo(e)}__(){this.t_()}a_(){this.r_()}u_(e){this.s_(e)}c_(e){this.o_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Et="WebChannelConnection";class dR extends cR{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Jo(e,n,s,r,i){const o=Ru();return new Promise((l,u)=>{const c=new Vg;c.setWithCredentials(!0),c.listenOnce(Dg.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case $o.NO_ERROR:const p=c.getResponseJson();se(Et,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(p)),l(p);break;case $o.TIMEOUT:se(Et,`RPC '${e}' ${o} timed out`),u(new re(B.DEADLINE_EXCEEDED,"Request time out"));break;case $o.HTTP_ERROR:const g=c.getStatus();if(se(Et,`RPC '${e}' ${o} failed with status:`,g,"response text:",c.getResponseText()),g>0){let _=c.getResponseJson();Array.isArray(_)&&(_=_[0]);const b=_==null?void 0:_.error;if(b&&b.status&&b.message){const y=function(k){const C=k.toLowerCase().replace(/_/g,"-");return Object.values(B).indexOf(C)>=0?C:B.UNKNOWN}(b.status);u(new re(y,b.message))}else u(new re(B.UNKNOWN,"Server responded with status "+c.getStatus()))}else u(new re(B.UNAVAILABLE,"Connection failed."));break;default:ge(9055,{l_:e,streamId:o,h_:c.getLastErrorCode(),P_:c.getLastError()})}}finally{se(Et,`RPC '${e}' ${o} completed.`)}});const f=JSON.stringify(r);se(Et,`RPC '${e}' ${o} sending request:`,r),c.send(n,"POST",f,s,15)})}T_(e,n,s){const r=Ru(),i=[this.Ko,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=Mg(),l=Og(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;c!==void 0&&(u.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(u.useFetchStreams=!0),this.Ho(u.initMessageHeaders,n,s),u.encodeInitMessageHeaders=!0;const f=i.join("");se(Et,`Creating RPC '${e}' stream ${r}: ${f}`,u);const p=o.createWebChannel(f,u);let g=!1,_=!1;const b=new hR({Zo:E=>{_?se(Et,`Not sending because RPC '${e}' stream ${r} is closed:`,E):(g||(se(Et,`Opening RPC '${e}' stream ${r} transport.`),p.open(),g=!0),se(Et,`RPC '${e}' stream ${r} sending:`,E),p.send(E))},Xo:()=>p.close()}),y=(E,k,C)=>{E.listen(k,x=>{try{C(x)}catch(M){setTimeout(()=>{throw M},0)}})};return y(p,li.EventType.OPEN,()=>{_||(se(Et,`RPC '${e}' stream ${r} transport opened.`),b.__())}),y(p,li.EventType.CLOSE,()=>{_||(_=!0,se(Et,`RPC '${e}' stream ${r} transport closed`),b.u_())}),y(p,li.EventType.ERROR,E=>{_||(_=!0,Cr(Et,`RPC '${e}' stream ${r} transport errored. Name:`,E.name,"Message:",E.message),b.u_(new re(B.UNAVAILABLE,"The operation could not be completed")))}),y(p,li.EventType.MESSAGE,E=>{var k;if(!_){const C=E.data[0];Me(!!C,16349);const x=C,M=(x==null?void 0:x.error)||((k=x[0])===null||k===void 0?void 0:k.error);if(M){se(Et,`RPC '${e}' stream ${r} received error:`,M);const W=M.status;let le=function(I){const P=Xe[I];if(P!==void 0)return g_(P)}(W),S=M.message;le===void 0&&(le=B.INTERNAL,S="Unknown error status: "+W+" with message "+M.message),_=!0,b.u_(new re(le,S)),p.close()}else se(Et,`RPC '${e}' stream ${r} received:`,C),b.c_(C)}}),y(l,Ng.STAT_EVENT,E=>{E.stat===pu.PROXY?se(Et,`RPC '${e}' stream ${r} detected buffering proxy`):E.stat===pu.NOPROXY&&se(Et,`RPC '${e}' stream ${r} detected no buffering proxy`)}),setTimeout(()=>{b.a_()},0),b}}function Kl(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ya(t){return new g1(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class k_{constructor(e,n,s=1e3,r=1.5,i=6e4){this.xi=e,this.timerId=n,this.I_=s,this.E_=r,this.d_=i,this.A_=0,this.R_=null,this.V_=Date.now(),this.reset()}reset(){this.A_=0}m_(){this.A_=this.d_}f_(e){this.cancel();const n=Math.floor(this.A_+this.g_()),s=Math.max(0,Date.now()-this.V_),r=Math.max(0,n-s);r>0&&se("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.A_} ms, delay with jitter: ${n} ms, last attempt: ${s} ms ago)`),this.R_=this.xi.enqueueAfterDelay(this.timerId,r,()=>(this.V_=Date.now(),e())),this.A_*=this.E_,this.A_<this.I_&&(this.A_=this.I_),this.A_>this.d_&&(this.A_=this.d_)}p_(){this.R_!==null&&(this.R_.skipDelay(),this.R_=null)}cancel(){this.R_!==null&&(this.R_.cancel(),this.R_=null)}g_(){return(Math.random()-.5)*this.A_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qf="PersistentStream";class x_{constructor(e,n,s,r,i,o,l,u){this.xi=e,this.y_=s,this.w_=r,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=u,this.state=0,this.S_=0,this.b_=null,this.D_=null,this.stream=null,this.v_=0,this.C_=new k_(e,n)}F_(){return this.state===1||this.state===5||this.M_()}M_(){return this.state===2||this.state===3}start(){this.v_=0,this.state!==4?this.auth():this.x_()}async stop(){this.F_()&&await this.close(0)}O_(){this.state=0,this.C_.reset()}N_(){this.M_()&&this.b_===null&&(this.b_=this.xi.enqueueAfterDelay(this.y_,6e4,()=>this.B_()))}L_(e){this.k_(),this.stream.send(e)}async B_(){if(this.M_())return this.close(0)}k_(){this.b_&&(this.b_.cancel(),this.b_=null)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}async close(e,n){this.k_(),this.q_(),this.C_.cancel(),this.S_++,e!==4?this.C_.reset():n&&n.code===B.RESOURCE_EXHAUSTED?(zn(n.toString()),zn("Using maximum backoff delay to prevent overloading the backend."),this.C_.m_()):n&&n.code===B.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.Q_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.i_(n)}Q_(){}auth(){this.state=1;const e=this.U_(this.S_),n=this.S_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([s,r])=>{this.S_===n&&this.K_(s,r)},s=>{e(()=>{const r=new re(B.UNKNOWN,"Fetching auth token failed: "+s.message);return this.W_(r)})})}K_(e,n){const s=this.U_(this.S_);this.stream=this.G_(e,n),this.stream.e_(()=>{s(()=>this.listener.e_())}),this.stream.n_(()=>{s(()=>(this.state=2,this.D_=this.xi.enqueueAfterDelay(this.w_,1e4,()=>(this.M_()&&(this.state=3),Promise.resolve())),this.listener.n_()))}),this.stream.i_(r=>{s(()=>this.W_(r))}),this.stream.onMessage(r=>{s(()=>++this.v_==1?this.z_(r):this.onNext(r))})}x_(){this.state=5,this.C_.f_(async()=>{this.state=0,this.start()})}W_(e){return se(Qf,`close with error: ${e}`),this.stream=null,this.close(4,e)}U_(e){return n=>{this.xi.enqueueAndForget(()=>this.S_===e?n():(se(Qf,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class fR extends x_{constructor(e,n,s,r,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,s,r,o),this.serializer=i}G_(e,n){return this.connection.T_("Listen",e,n)}z_(e){return this.onNext(e)}onNext(e){this.C_.reset();const n=v1(this.serializer,e),s=function(i){if(!("targetChange"in i))return ye.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?ye.min():o.readTime?An(o.readTime):ye.min()}(e);return this.listener.j_(n,s)}H_(e){const n={};n.database=Iu(this.serializer),n.addTarget=function(i,o){let l;const u=o.target;if(l=vu(u)?{documents:w1(i,u)}:{query:T1(i,u).gt},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=v_(i,o.resumeToken);const c=Eu(i,o.expectedCount);c!==null&&(l.expectedCount=c)}else if(o.snapshotVersion.compareTo(ye.min())>0){l.readTime=_a(i,o.snapshotVersion.toTimestamp());const c=Eu(i,o.expectedCount);c!==null&&(l.expectedCount=c)}return l}(this.serializer,e);const s=A1(this.serializer,e);s&&(n.labels=s),this.L_(n)}J_(e){const n={};n.database=Iu(this.serializer),n.removeTarget=e,this.L_(n)}}class pR extends x_{constructor(e,n,s,r,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,s,r,o),this.serializer=i}get Y_(){return this.v_>0}start(){this.lastStreamToken=void 0,super.start()}Q_(){this.Y_&&this.Z_([])}G_(e,n){return this.connection.T_("Write",e,n)}z_(e){return Me(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Me(!e.writeResults||e.writeResults.length===0,55816),this.listener.X_()}onNext(e){Me(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.C_.reset();const n=E1(e.writeResults,e.commitTime),s=An(e.commitTime);return this.listener.ea(s,n)}ta(){const e={};e.database=Iu(this.serializer),this.L_(e)}Z_(e){const n={streamToken:this.lastStreamToken,writes:e.map(s=>b1(this.serializer,s))};this.L_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mR{}class gR extends mR{constructor(e,n,s,r){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=s,this.serializer=r,this.na=!1}ra(){if(this.na)throw new re(B.FAILED_PRECONDITION,"The client has already been terminated.")}zo(e,n,s,r){return this.ra(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,o])=>this.connection.zo(e,wu(n,s),r,i,o)).catch(i=>{throw i.name==="FirebaseError"?(i.code===B.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new re(B.UNKNOWN,i.toString())})}Yo(e,n,s,r,i){return this.ra(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.Yo(e,wu(n,s),r,o,l,i)).catch(o=>{throw o.name==="FirebaseError"?(o.code===B.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new re(B.UNKNOWN,o.toString())})}terminate(){this.na=!0,this.connection.terminate()}}class _R{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.ia=0,this.sa=null,this.oa=!0}_a(){this.ia===0&&(this.aa("Unknown"),this.sa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.sa=null,this.ua("Backend didn't respond within 10 seconds."),this.aa("Offline"),Promise.resolve())))}ca(e){this.state==="Online"?this.aa("Unknown"):(this.ia++,this.ia>=1&&(this.la(),this.ua(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.aa("Offline")))}set(e){this.la(),this.ia=0,e==="Online"&&(this.oa=!1),this.aa(e)}aa(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ua(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.oa?(zn(n),this.oa=!1):se("OnlineStateTracker",n)}la(){this.sa!==null&&(this.sa.cancel(),this.sa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ws="RemoteStore";class yR{constructor(e,n,s,r,i){this.localStore=e,this.datastore=n,this.asyncQueue=s,this.remoteSyncer={},this.ha=[],this.Pa=new Map,this.Ta=new Set,this.Ia=[],this.Ea=i,this.Ea.No(o=>{s.enqueueAndForget(async()=>{Xs(this)&&(se(Ws,"Restarting streams for network reachability change."),await async function(u){const c=ve(u);c.Ta.add(4),await to(c),c.da.set("Unknown"),c.Ta.delete(4),await Ja(c)}(this))})}),this.da=new _R(s,r)}}async function Ja(t){if(Xs(t))for(const e of t.Ia)await e(!0)}async function to(t){for(const e of t.Ia)await e(!1)}function V_(t,e){const n=ve(t);n.Pa.has(e.targetId)||(n.Pa.set(e.targetId,e),xc(n)?kc(n):jr(n).M_()&&Pc(n,e))}function Cc(t,e){const n=ve(t),s=jr(n);n.Pa.delete(e),s.M_()&&D_(n,e),n.Pa.size===0&&(s.M_()?s.N_():Xs(n)&&n.da.set("Unknown"))}function Pc(t,e){if(t.Aa.Ke(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(ye.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}jr(t).H_(e)}function D_(t,e){t.Aa.Ke(e),jr(t).J_(e)}function kc(t){t.Aa=new d1({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),Rt:e=>t.Pa.get(e)||null,Pt:()=>t.datastore.serializer.databaseId}),jr(t).start(),t.da._a()}function xc(t){return Xs(t)&&!jr(t).F_()&&t.Pa.size>0}function Xs(t){return ve(t).Ta.size===0}function N_(t){t.Aa=void 0}async function vR(t){t.da.set("Online")}async function bR(t){t.Pa.forEach((e,n)=>{Pc(t,e)})}async function ER(t,e){N_(t),xc(t)?(t.da.ca(e),kc(t)):t.da.set("Unknown")}async function wR(t,e,n){if(t.da.set("Online"),e instanceof y_&&e.state===2&&e.cause)try{await async function(r,i){const o=i.cause;for(const l of i.targetIds)r.Pa.has(l)&&(await r.remoteSyncer.rejectListen(l,o),r.Pa.delete(l),r.Aa.removeTarget(l))}(t,e)}catch(s){se(Ws,"Failed to remove targets %s: %s ",e.targetIds.join(","),s),await va(t,s)}else if(e instanceof Ho?t.Aa.Xe(e):e instanceof __?t.Aa.ot(e):t.Aa.nt(e),!n.isEqual(ye.min()))try{const s=await P_(t.localStore);n.compareTo(s)>=0&&await function(i,o){const l=i.Aa.It(o);return l.targetChanges.forEach((u,c)=>{if(u.resumeToken.approximateByteSize()>0){const f=i.Pa.get(c);f&&i.Pa.set(c,f.withResumeToken(u.resumeToken,o))}}),l.targetMismatches.forEach((u,c)=>{const f=i.Pa.get(u);if(!f)return;i.Pa.set(u,f.withResumeToken(gt.EMPTY_BYTE_STRING,f.snapshotVersion)),D_(i,u);const p=new ds(f.target,u,c,f.sequenceNumber);Pc(i,p)}),i.remoteSyncer.applyRemoteEvent(l)}(t,n)}catch(s){se(Ws,"Failed to raise snapshot:",s),await va(t,s)}}async function va(t,e,n){if(!$r(e))throw e;t.Ta.add(1),await to(t),t.da.set("Offline"),n||(n=()=>P_(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{se(Ws,"Retrying IndexedDB access"),await n(),t.Ta.delete(1),await Ja(t)})}function O_(t,e){return e().catch(n=>va(t,n,e))}async function Xa(t){const e=ve(t),n=Rs(e);let s=e.ha.length>0?e.ha[e.ha.length-1].batchId:fc;for(;TR(e);)try{const r=await rR(e.localStore,s);if(r===null){e.ha.length===0&&n.N_();break}s=r.batchId,IR(e,r)}catch(r){await va(e,r)}M_(e)&&L_(e)}function TR(t){return Xs(t)&&t.ha.length<10}function IR(t,e){t.ha.push(e);const n=Rs(t);n.M_()&&n.Y_&&n.Z_(e.mutations)}function M_(t){return Xs(t)&&!Rs(t).F_()&&t.ha.length>0}function L_(t){Rs(t).start()}async function AR(t){Rs(t).ta()}async function RR(t){const e=Rs(t);for(const n of t.ha)e.Z_(n.mutations)}async function SR(t,e,n){const s=t.ha.shift(),r=Ec.from(s,e,n);await O_(t,()=>t.remoteSyncer.applySuccessfulWrite(r)),await Xa(t)}async function CR(t,e){e&&Rs(t).Y_&&await async function(s,r){if(function(o){return c1(o)&&o!==B.ABORTED}(r.code)){const i=s.ha.shift();Rs(s).O_(),await O_(s,()=>s.remoteSyncer.rejectFailedWrite(i.batchId,r)),await Xa(s)}}(t,e),M_(t)&&L_(t)}async function Yf(t,e){const n=ve(t);n.asyncQueue.verifyOperationInProgress(),se(Ws,"RemoteStore received new credentials");const s=Xs(n);n.Ta.add(3),await to(n),s&&n.da.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.Ta.delete(3),await Ja(n)}async function PR(t,e){const n=ve(t);e?(n.Ta.delete(2),await Ja(n)):e||(n.Ta.add(2),await to(n),n.da.set("Unknown"))}function jr(t){return t.Ra||(t.Ra=function(n,s,r){const i=ve(n);return i.ra(),new fR(s,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,r)}(t.datastore,t.asyncQueue,{e_:vR.bind(null,t),n_:bR.bind(null,t),i_:ER.bind(null,t),j_:wR.bind(null,t)}),t.Ia.push(async e=>{e?(t.Ra.O_(),xc(t)?kc(t):t.da.set("Unknown")):(await t.Ra.stop(),N_(t))})),t.Ra}function Rs(t){return t.Va||(t.Va=function(n,s,r){const i=ve(n);return i.ra(),new pR(s,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,r)}(t.datastore,t.asyncQueue,{e_:()=>Promise.resolve(),n_:AR.bind(null,t),i_:CR.bind(null,t),X_:RR.bind(null,t),ea:SR.bind(null,t)}),t.Ia.push(async e=>{e?(t.Va.O_(),await Xa(t)):(await t.Va.stop(),t.ha.length>0&&(se(Ws,`Stopping write stream with ${t.ha.length} pending writes`),t.ha=[]))})),t.Va}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vc{constructor(e,n,s,r,i){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=s,this.op=r,this.removalCallback=i,this.deferred=new Bn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,s,r,i){const o=Date.now()+s,l=new Vc(e,n,o,r,i);return l.start(s),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new re(B.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Dc(t,e){if(zn("AsyncQueue",`${e}: ${t}`),$r(t))return new re(B.UNAVAILABLE,`${e}: ${t}`);throw t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Er{static emptySet(e){return new Er(e.comparator)}constructor(e){this.comparator=e?(n,s)=>e(n,s)||ce.comparator(n.key,s.key):(n,s)=>ce.comparator(n.key,s.key),this.keyedMap=ui(),this.sortedSet=new ze(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,s)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof Er)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;n.hasNext();){const r=n.getNext().key,i=s.getNext().key;if(!r.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const s=new Er;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=n,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jf{constructor(){this.ma=new ze(ce.comparator)}track(e){const n=e.doc.key,s=this.ma.get(n);s?e.type!==0&&s.type===3?this.ma=this.ma.insert(n,e):e.type===3&&s.type!==1?this.ma=this.ma.insert(n,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.ma=this.ma.insert(n,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.ma=this.ma.insert(n,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.ma=this.ma.remove(n):e.type===1&&s.type===2?this.ma=this.ma.insert(n,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.ma=this.ma.insert(n,{type:2,doc:e.doc}):ge(63341,{Vt:e,fa:s}):this.ma=this.ma.insert(n,e)}ga(){const e=[];return this.ma.inorderTraversal((n,s)=>{e.push(s)}),e}}class Dr{constructor(e,n,s,r,i,o,l,u,c){this.query=e,this.docs=n,this.oldDocs=s,this.docChanges=r,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=u,this.hasCachedResults=c}static fromInitialDocuments(e,n,s,r,i){const o=[];return n.forEach(l=>{o.push({type:0,doc:l})}),new Dr(e,n,Er.emptySet(n),o,s,r,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Ka(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,s=e.docChanges;if(n.length!==s.length)return!1;for(let r=0;r<n.length;r++)if(n[r].type!==s[r].type||!n[r].doc.isEqual(s[r].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kR{constructor(){this.pa=void 0,this.ya=[]}wa(){return this.ya.some(e=>e.Sa())}}class xR{constructor(){this.queries=Xf(),this.onlineState="Unknown",this.ba=new Set}terminate(){(function(n,s){const r=ve(n),i=r.queries;r.queries=Xf(),i.forEach((o,l)=>{for(const u of l.ya)u.onError(s)})})(this,new re(B.ABORTED,"Firestore shutting down"))}}function Xf(){return new Js(t=>r_(t),Ka)}async function U_(t,e){const n=ve(t);let s=3;const r=e.query;let i=n.queries.get(r);i?!i.wa()&&e.Sa()&&(s=2):(i=new kR,s=e.Sa()?0:1);try{switch(s){case 0:i.pa=await n.onListen(r,!0);break;case 1:i.pa=await n.onListen(r,!1);break;case 2:await n.onFirstRemoteStoreListen(r)}}catch(o){const l=Dc(o,`Initialization of query '${lr(e.query)}' failed`);return void e.onError(l)}n.queries.set(r,i),i.ya.push(e),e.Da(n.onlineState),i.pa&&e.va(i.pa)&&Nc(n)}async function F_(t,e){const n=ve(t),s=e.query;let r=3;const i=n.queries.get(s);if(i){const o=i.ya.indexOf(e);o>=0&&(i.ya.splice(o,1),i.ya.length===0?r=e.Sa()?0:1:!i.wa()&&e.Sa()&&(r=2))}switch(r){case 0:return n.queries.delete(s),n.onUnlisten(s,!0);case 1:return n.queries.delete(s),n.onUnlisten(s,!1);case 2:return n.onLastRemoteStoreUnlisten(s);default:return}}function VR(t,e){const n=ve(t);let s=!1;for(const r of e){const i=r.query,o=n.queries.get(i);if(o){for(const l of o.ya)l.va(r)&&(s=!0);o.pa=r}}s&&Nc(n)}function DR(t,e,n){const s=ve(t),r=s.queries.get(e);if(r)for(const i of r.ya)i.onError(n);s.queries.delete(e)}function Nc(t){t.ba.forEach(e=>{e.next()})}var Su,Zf;(Zf=Su||(Su={})).Ca="default",Zf.Cache="cache";class $_{constructor(e,n,s){this.query=e,this.Fa=n,this.Ma=!1,this.xa=null,this.onlineState="Unknown",this.options=s||{}}va(e){if(!this.options.includeMetadataChanges){const s=[];for(const r of e.docChanges)r.type!==3&&s.push(r);e=new Dr(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.Ma?this.Oa(e)&&(this.Fa.next(e),n=!0):this.Na(e,this.onlineState)&&(this.Ba(e),n=!0),this.xa=e,n}onError(e){this.Fa.error(e)}Da(e){this.onlineState=e;let n=!1;return this.xa&&!this.Ma&&this.Na(this.xa,e)&&(this.Ba(this.xa),n=!0),n}Na(e,n){if(!e.fromCache||!this.Sa())return!0;const s=n!=="Offline";return(!this.options.La||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}Oa(e){if(e.docChanges.length>0)return!0;const n=this.xa&&this.xa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}Ba(e){e=Dr.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Ma=!0,this.Fa.next(e)}Sa(){return this.options.source!==Su.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B_{constructor(e){this.key=e}}class j_{constructor(e){this.key=e}}class NR{constructor(e,n){this.query=e,this.Ga=n,this.za=null,this.hasCachedResults=!1,this.current=!1,this.ja=Ae(),this.mutatedKeys=Ae(),this.Ha=i_(e),this.Ja=new Er(this.Ha)}get Ya(){return this.Ga}Za(e,n){const s=n?n.Xa:new Jf,r=n?n.Ja:this.Ja;let i=n?n.mutatedKeys:this.mutatedKeys,o=r,l=!1;const u=this.query.limitType==="F"&&r.size===this.query.limit?r.last():null,c=this.query.limitType==="L"&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((f,p)=>{const g=r.get(f),_=za(this.query,p)?p:null,b=!!g&&this.mutatedKeys.has(g.key),y=!!_&&(_.hasLocalMutations||this.mutatedKeys.has(_.key)&&_.hasCommittedMutations);let E=!1;g&&_?g.data.isEqual(_.data)?b!==y&&(s.track({type:3,doc:_}),E=!0):this.eu(g,_)||(s.track({type:2,doc:_}),E=!0,(u&&this.Ha(_,u)>0||c&&this.Ha(_,c)<0)&&(l=!0)):!g&&_?(s.track({type:0,doc:_}),E=!0):g&&!_&&(s.track({type:1,doc:g}),E=!0,(u||c)&&(l=!0)),E&&(_?(o=o.add(_),i=y?i.add(f):i.delete(f)):(o=o.delete(f),i=i.delete(f)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),i=i.delete(f.key),s.track({type:1,doc:f})}return{Ja:o,Xa:s,Cs:l,mutatedKeys:i}}eu(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,s,r){const i=this.Ja;this.Ja=e.Ja,this.mutatedKeys=e.mutatedKeys;const o=e.Xa.ga();o.sort((f,p)=>function(_,b){const y=E=>{switch(E){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return ge(20277,{Vt:E})}};return y(_)-y(b)}(f.type,p.type)||this.Ha(f.doc,p.doc)),this.tu(s),r=r!=null&&r;const l=n&&!r?this.nu():[],u=this.ja.size===0&&this.current&&!r?1:0,c=u!==this.za;return this.za=u,o.length!==0||c?{snapshot:new Dr(this.query,e.Ja,i,o,e.mutatedKeys,u===0,c,!1,!!s&&s.resumeToken.approximateByteSize()>0),ru:l}:{ru:l}}Da(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ja:this.Ja,Xa:new Jf,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{ru:[]}}iu(e){return!this.Ga.has(e)&&!!this.Ja.has(e)&&!this.Ja.get(e).hasLocalMutations}tu(e){e&&(e.addedDocuments.forEach(n=>this.Ga=this.Ga.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.Ga=this.Ga.delete(n)),this.current=e.current)}nu(){if(!this.current)return[];const e=this.ja;this.ja=Ae(),this.Ja.forEach(s=>{this.iu(s.key)&&(this.ja=this.ja.add(s.key))});const n=[];return e.forEach(s=>{this.ja.has(s)||n.push(new j_(s))}),this.ja.forEach(s=>{e.has(s)||n.push(new B_(s))}),n}su(e){this.Ga=e.$s,this.ja=Ae();const n=this.Za(e.documents);return this.applyChanges(n,!0)}ou(){return Dr.fromInitialDocuments(this.query,this.Ja,this.mutatedKeys,this.za===0,this.hasCachedResults)}}const Oc="SyncEngine";class OR{constructor(e,n,s){this.query=e,this.targetId=n,this.view=s}}class MR{constructor(e){this.key=e,this._u=!1}}class LR{constructor(e,n,s,r,i,o){this.localStore=e,this.remoteStore=n,this.eventManager=s,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.au={},this.uu=new Js(l=>r_(l),Ka),this.cu=new Map,this.lu=new Set,this.hu=new ze(ce.comparator),this.Pu=new Map,this.Tu=new Ic,this.Iu={},this.Eu=new Map,this.du=Vr.lr(),this.onlineState="Unknown",this.Au=void 0}get isPrimaryClient(){return this.Au===!0}}async function UR(t,e,n=!0){const s=W_(t);let r;const i=s.uu.get(e);return i?(s.sharedClientState.addLocalQueryTarget(i.targetId),r=i.view.ou()):r=await q_(s,e,n,!0),r}async function FR(t,e){const n=W_(t);await q_(n,e,!0,!1)}async function q_(t,e,n,s){const r=await iR(t.localStore,In(e)),i=r.targetId,o=t.sharedClientState.addLocalQueryTarget(i,n);let l;return s&&(l=await $R(t,e,i,o==="current",r.resumeToken)),t.isPrimaryClient&&n&&V_(t.remoteStore,r),l}async function $R(t,e,n,s,r){t.Ru=(p,g,_)=>async function(y,E,k,C){let x=E.view.Za(k);x.Cs&&(x=await Kf(y.localStore,E.query,!1).then(({documents:S})=>E.view.Za(S,x)));const M=C&&C.targetChanges.get(E.targetId),W=C&&C.targetMismatches.get(E.targetId)!=null,le=E.view.applyChanges(x,y.isPrimaryClient,M,W);return tp(y,E.targetId,le.ru),le.snapshot}(t,p,g,_);const i=await Kf(t.localStore,e,!0),o=new NR(e,i.$s),l=o.Za(i.documents),u=eo.createSynthesizedTargetChangeForCurrentChange(n,s&&t.onlineState!=="Offline",r),c=o.applyChanges(l,t.isPrimaryClient,u);tp(t,n,c.ru);const f=new OR(e,n,o);return t.uu.set(e,f),t.cu.has(n)?t.cu.get(n).push(e):t.cu.set(n,[e]),c.snapshot}async function BR(t,e,n){const s=ve(t),r=s.uu.get(e),i=s.cu.get(r.targetId);if(i.length>1)return s.cu.set(r.targetId,i.filter(o=>!Ka(o,e))),void s.uu.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(r.targetId),s.sharedClientState.isActiveQueryTarget(r.targetId)||await Au(s.localStore,r.targetId,!1).then(()=>{s.sharedClientState.clearQueryState(r.targetId),n&&Cc(s.remoteStore,r.targetId),Cu(s,r.targetId)}).catch(Fr)):(Cu(s,r.targetId),await Au(s.localStore,r.targetId,!0))}async function jR(t,e){const n=ve(t),s=n.uu.get(e),r=n.cu.get(s.targetId);n.isPrimaryClient&&r.length===1&&(n.sharedClientState.removeLocalQueryTarget(s.targetId),Cc(n.remoteStore,s.targetId))}async function qR(t,e,n){const s=YR(t);try{const r=await function(o,l){const u=ve(o),c=rt.now(),f=l.reduce((_,b)=>_.add(b.key),Ae());let p,g;return u.persistence.runTransaction("Locally write mutations","readwrite",_=>{let b=Gn(),y=Ae();return u.Bs.getEntries(_,f).next(E=>{b=E,b.forEach((k,C)=>{C.isValidDocument()||(y=y.add(k))})}).next(()=>u.localDocuments.getOverlayedDocuments(_,b)).next(E=>{p=E;const k=[];for(const C of l){const x=i1(C,p.get(C.key).overlayedDocument);x!=null&&k.push(new ks(C.key,x,Yg(x.value.mapValue),en.exists(!0)))}return u.mutationQueue.addMutationBatch(_,c,k,l)}).next(E=>{g=E;const k=E.applyToLocalDocumentSet(p,y);return u.documentOverlayCache.saveOverlays(_,E.batchId,k)})}).then(()=>({batchId:g.batchId,changes:a_(p)}))}(s.localStore,e);s.sharedClientState.addPendingMutation(r.batchId),function(o,l,u){let c=o.Iu[o.currentUser.toKey()];c||(c=new ze(we)),c=c.insert(l,u),o.Iu[o.currentUser.toKey()]=c}(s,r.batchId,n),await no(s,r.changes),await Xa(s.remoteStore)}catch(r){const i=Dc(r,"Failed to persist write");n.reject(i)}}async function H_(t,e){const n=ve(t);try{const s=await nR(n.localStore,e);e.targetChanges.forEach((r,i)=>{const o=n.Pu.get(i);o&&(Me(r.addedDocuments.size+r.modifiedDocuments.size+r.removedDocuments.size<=1,22616),r.addedDocuments.size>0?o._u=!0:r.modifiedDocuments.size>0?Me(o._u,14607):r.removedDocuments.size>0&&(Me(o._u,42227),o._u=!1))}),await no(n,s,e)}catch(s){await Fr(s)}}function ep(t,e,n){const s=ve(t);if(s.isPrimaryClient&&n===0||!s.isPrimaryClient&&n===1){const r=[];s.uu.forEach((i,o)=>{const l=o.view.Da(e);l.snapshot&&r.push(l.snapshot)}),function(o,l){const u=ve(o);u.onlineState=l;let c=!1;u.queries.forEach((f,p)=>{for(const g of p.ya)g.Da(l)&&(c=!0)}),c&&Nc(u)}(s.eventManager,e),r.length&&s.au.j_(r),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function HR(t,e,n){const s=ve(t);s.sharedClientState.updateQueryState(e,"rejected",n);const r=s.Pu.get(e),i=r&&r.key;if(i){let o=new ze(ce.comparator);o=o.insert(i,It.newNoDocument(i,ye.min()));const l=Ae().add(i),u=new Qa(ye.min(),new Map,new ze(we),o,l);await H_(s,u),s.hu=s.hu.remove(i),s.Pu.delete(e),Mc(s)}else await Au(s.localStore,e,!1).then(()=>Cu(s,e,n)).catch(Fr)}async function KR(t,e){const n=ve(t),s=e.batch.batchId;try{const r=await tR(n.localStore,e);z_(n,s,null),K_(n,s),n.sharedClientState.updateMutationState(s,"acknowledged"),await no(n,r)}catch(r){await Fr(r)}}async function zR(t,e,n){const s=ve(t);try{const r=await function(o,l){const u=ve(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",c=>{let f;return u.mutationQueue.lookupMutationBatch(c,l).next(p=>(Me(p!==null,37113),f=p.keys(),u.mutationQueue.removeMutationBatch(c,p))).next(()=>u.mutationQueue.performConsistencyCheck(c)).next(()=>u.documentOverlayCache.removeOverlaysForBatchId(c,f,l)).next(()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(c,f)).next(()=>u.localDocuments.getDocuments(c,f))})}(s.localStore,e);z_(s,e,n),K_(s,e),s.sharedClientState.updateMutationState(e,"rejected",n),await no(s,r)}catch(r){await Fr(r)}}function K_(t,e){(t.Eu.get(e)||[]).forEach(n=>{n.resolve()}),t.Eu.delete(e)}function z_(t,e,n){const s=ve(t);let r=s.Iu[s.currentUser.toKey()];if(r){const i=r.get(e);i&&(n?i.reject(n):i.resolve(),r=r.remove(e)),s.Iu[s.currentUser.toKey()]=r}}function Cu(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const s of t.cu.get(e))t.uu.delete(s),n&&t.au.Vu(s,n);t.cu.delete(e),t.isPrimaryClient&&t.Tu.Hr(e).forEach(s=>{t.Tu.containsKey(s)||G_(t,s)})}function G_(t,e){t.lu.delete(e.path.canonicalString());const n=t.hu.get(e);n!==null&&(Cc(t.remoteStore,n),t.hu=t.hu.remove(e),t.Pu.delete(n),Mc(t))}function tp(t,e,n){for(const s of n)s instanceof B_?(t.Tu.addReference(s.key,e),GR(t,s)):s instanceof j_?(se(Oc,"Document no longer in limbo: "+s.key),t.Tu.removeReference(s.key,e),t.Tu.containsKey(s.key)||G_(t,s.key)):ge(19791,{mu:s})}function GR(t,e){const n=e.key,s=n.path.canonicalString();t.hu.get(n)||t.lu.has(s)||(se(Oc,"New document in limbo: "+n),t.lu.add(s),Mc(t))}function Mc(t){for(;t.lu.size>0&&t.hu.size<t.maxConcurrentLimboResolutions;){const e=t.lu.values().next().value;t.lu.delete(e);const n=new ce(je.fromString(e)),s=t.du.next();t.Pu.set(s,new MR(n)),t.hu=t.hu.insert(n,s),V_(t.remoteStore,new ds(In(yc(n.path)),s,"TargetPurposeLimboResolution",ja.le))}}async function no(t,e,n){const s=ve(t),r=[],i=[],o=[];s.uu.isEmpty()||(s.uu.forEach((l,u)=>{o.push(s.Ru(u,e,n).then(c=>{var f;if((c||n)&&s.isPrimaryClient){const p=c?!c.fromCache:(f=n==null?void 0:n.targetChanges.get(u.targetId))===null||f===void 0?void 0:f.current;s.sharedClientState.updateQueryState(u.targetId,p?"current":"not-current")}if(c){r.push(c);const p=Rc.Rs(u.targetId,c);i.push(p)}}))}),await Promise.all(o),s.au.j_(r),await async function(u,c){const f=ve(u);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",p=>j.forEach(c,g=>j.forEach(g.ds,_=>f.persistence.referenceDelegate.addReference(p,g.targetId,_)).next(()=>j.forEach(g.As,_=>f.persistence.referenceDelegate.removeReference(p,g.targetId,_)))))}catch(p){if(!$r(p))throw p;se(Sc,"Failed to update sequence numbers: "+p)}for(const p of c){const g=p.targetId;if(!p.fromCache){const _=f.xs.get(g),b=_.snapshotVersion,y=_.withLastLimboFreeSnapshotVersion(b);f.xs=f.xs.insert(g,y)}}}(s.localStore,i))}async function WR(t,e){const n=ve(t);if(!n.currentUser.isEqual(e)){se(Oc,"User change. New user:",e.toKey());const s=await C_(n.localStore,e);n.currentUser=e,function(i,o){i.Eu.forEach(l=>{l.forEach(u=>{u.reject(new re(B.CANCELLED,o))})}),i.Eu.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await no(n,s.ks)}}function QR(t,e){const n=ve(t),s=n.Pu.get(e);if(s&&s._u)return Ae().add(s.key);{let r=Ae();const i=n.cu.get(e);if(!i)return r;for(const o of i){const l=n.uu.get(o);r=r.unionWith(l.view.Ya)}return r}}function W_(t){const e=ve(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=H_.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=QR.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=HR.bind(null,e),e.au.j_=VR.bind(null,e.eventManager),e.au.Vu=DR.bind(null,e.eventManager),e}function YR(t){const e=ve(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=KR.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=zR.bind(null,e),e}class ba{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Ya(e.databaseInfo.databaseId),this.sharedClientState=this.pu(e),this.persistence=this.yu(e),await this.persistence.start(),this.localStore=this.wu(e),this.gcScheduler=this.Su(e,this.localStore),this.indexBackfillerScheduler=this.bu(e,this.localStore)}Su(e,n){return null}bu(e,n){return null}wu(e){return eR(this.persistence,new J1,e.initialUser,this.serializer)}yu(e){return new S_(Ac.fi,this.serializer)}pu(e){return new aR}async terminate(){var e,n;(e=this.gcScheduler)===null||e===void 0||e.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}ba.provider={build:()=>new ba};class JR extends ba{constructor(e){super(),this.cacheSizeBytes=e}Su(e,n){Me(this.persistence.referenceDelegate instanceof ya,46915);const s=this.persistence.referenceDelegate.garbageCollector;return new M1(s,e.asyncQueue,n)}yu(e){const n=this.cacheSizeBytes!==void 0?Lt.withCacheSize(this.cacheSizeBytes):Lt.DEFAULT;return new S_(s=>ya.fi(s,n),this.serializer)}}class Pu{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>ep(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=WR.bind(null,this.syncEngine),await PR(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new xR}()}createDatastore(e){const n=Ya(e.databaseInfo.databaseId),s=function(i){return new dR(i)}(e.databaseInfo);return function(i,o,l,u){return new gR(i,o,l,u)}(e.authCredentials,e.appCheckCredentials,s,n)}createRemoteStore(e){return function(s,r,i,o,l){return new yR(s,r,i,o,l)}(this.localStore,this.datastore,e.asyncQueue,n=>ep(this.syncEngine,n,0),function(){return Wf.C()?new Wf:new lR}())}createSyncEngine(e,n){return function(r,i,o,l,u,c,f){const p=new LR(r,i,o,l,u,c);return f&&(p.Au=!0),p}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(r){const i=ve(r);se(Ws,"RemoteStore shutting down."),i.Ta.add(5),await to(i),i.Ea.shutdown(),i.da.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(n=this.eventManager)===null||n===void 0||n.terminate()}}Pu.provider={build:()=>new Pu};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q_{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.vu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.vu(this.observer.error,e):zn("Uncaught Error in snapshot listener:",e.toString()))}Cu(){this.muted=!0}vu(e,n){setTimeout(()=>{this.muted||e(n)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ss="FirestoreClient";class XR{constructor(e,n,s,r,i){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=s,this.databaseInfo=r,this.user=wt.UNAUTHENTICATED,this.clientId=$g.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(s,async o=>{se(Ss,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(s,o=>(se(Ss,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Bn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const s=Dc(n,"Failed to shutdown persistence");e.reject(s)}}),e.promise}}async function zl(t,e){t.asyncQueue.verifyOperationInProgress(),se(Ss,"Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let s=n.initialUser;t.setCredentialChangeListener(async r=>{s.isEqual(r)||(await C_(e.localStore,r),s=r)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function np(t,e){t.asyncQueue.verifyOperationInProgress();const n=await ZR(t);se(Ss,"Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(s=>Yf(e.remoteStore,s)),t.setAppCheckTokenChangeListener((s,r)=>Yf(e.remoteStore,r)),t._onlineComponents=e}async function ZR(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){se(Ss,"Using user provided OfflineComponentProvider");try{await zl(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(r){return r.name==="FirebaseError"?r.code===B.FAILED_PRECONDITION||r.code===B.UNIMPLEMENTED:!(typeof DOMException<"u"&&r instanceof DOMException)||r.code===22||r.code===20||r.code===11}(n))throw n;Cr("Error using user provided cache. Falling back to memory cache: "+n),await zl(t,new ba)}}else se(Ss,"Using default OfflineComponentProvider"),await zl(t,new JR(void 0));return t._offlineComponents}async function Y_(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(se(Ss,"Using user provided OnlineComponentProvider"),await np(t,t._uninitializedComponentsProvider._online)):(se(Ss,"Using default OnlineComponentProvider"),await np(t,new Pu))),t._onlineComponents}function eS(t){return Y_(t).then(e=>e.syncEngine)}async function J_(t){const e=await Y_(t),n=e.eventManager;return n.onListen=UR.bind(null,e.syncEngine),n.onUnlisten=BR.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=FR.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=jR.bind(null,e.syncEngine),n}function tS(t,e,n={}){const s=new Bn;return t.asyncQueue.enqueueAndForget(async()=>function(i,o,l,u,c){const f=new Q_({next:g=>{f.Cu(),o.enqueueAndForget(()=>F_(i,p));const _=g.docs.has(l);!_&&g.fromCache?c.reject(new re(B.UNAVAILABLE,"Failed to get document because the client is offline.")):_&&g.fromCache&&u&&u.source==="server"?c.reject(new re(B.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):c.resolve(g)},error:g=>c.reject(g)}),p=new $_(yc(l.path),f,{includeMetadataChanges:!0,La:!0});return U_(i,p)}(await J_(t),t.asyncQueue,e,n,s)),s.promise}function nS(t,e,n={}){const s=new Bn;return t.asyncQueue.enqueueAndForget(async()=>function(i,o,l,u,c){const f=new Q_({next:g=>{f.Cu(),o.enqueueAndForget(()=>F_(i,p)),g.fromCache&&u.source==="server"?c.reject(new re(B.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):c.resolve(g)},error:g=>c.reject(g)}),p=new $_(l,f,{includeMetadataChanges:!0,La:!0});return U_(i,p)}(await J_(t),t.asyncQueue,e,n,s)),s.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function X_(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sp=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Z_(t,e,n){if(!n)throw new re(B.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function sS(t,e,n,s){if(e===!0&&s===!0)throw new re(B.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function rp(t){if(!ce.isDocumentKey(t))throw new re(B.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function ip(t){if(ce.isDocumentKey(t))throw new re(B.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function Za(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(s){return s.constructor?s.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":ge(12329,{type:typeof t})}function mn(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new re(B.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=Za(t);throw new re(B.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ey="firestore.googleapis.com",op=!0;class ap{constructor(e){var n,s;if(e.host===void 0){if(e.ssl!==void 0)throw new re(B.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=ey,this.ssl=op}else this.host=e.host,this.ssl=(n=e.ssl)!==null&&n!==void 0?n:op;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=R_;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<N1)throw new re(B.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}sS("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=X_((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new re(B.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new re(B.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new re(B.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(s,r){return s.timeoutSeconds===r.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class el{constructor(e,n,s,r){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=s,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ap({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new re(B.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new re(B.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ap(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new hA;switch(s.type){case"firstParty":return new mA(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new re(B.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const s=sp.get(n);s&&(se("ComponentProvider","Removing Datastore"),sp.delete(n),s.terminate())}(this),Promise.resolve()}}function rS(t,e,n,s={}){var r;t=mn(t,el);const i=zi(e),o=t._getSettings(),l=Object.assign(Object.assign({},o),{emulatorOptions:t._getEmulatorOptions()}),u=`${e}:${n}`;i&&(jm(`https://${u}`),qm("Firestore",!0)),o.host!==ey&&o.host!==u&&Cr("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const c=Object.assign(Object.assign({},o),{host:u,ssl:i,emulatorOptions:s});if(!qs(c,l)&&(t._setSettings(c),s.mockUserToken)){let f,p;if(typeof s.mockUserToken=="string")f=s.mockUserToken,p=wt.MOCK_USER;else{f=Tw(s.mockUserToken,(r=t._app)===null||r===void 0?void 0:r.options.projectId);const g=s.mockUserToken.sub||s.mockUserToken.user_id;if(!g)throw new re(B.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");p=new wt(g)}t._authCredentials=new dA(new Ug(f,p))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xs{constructor(e,n,s){this.converter=n,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new xs(this.firestore,e,this._query)}}class Nt{constructor(e,n,s){this.converter=n,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ys(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Nt(this.firestore,e,this._key)}}class ys extends xs{constructor(e,n,s){super(e,n,yc(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Nt(this.firestore,null,new ce(e))}withConverter(e){return new ys(this.firestore,e,this._path)}}function Re(t,e,...n){if(t=at(t),Z_("collection","path",e),t instanceof el){const s=je.fromString(e,...n);return ip(s),new ys(t,null,s)}{if(!(t instanceof Nt||t instanceof ys))throw new re(B.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=t._path.child(je.fromString(e,...n));return ip(s),new ys(t.firestore,null,s)}}function lt(t,e,...n){if(t=at(t),arguments.length===1&&(e=$g.newId()),Z_("doc","path",e),t instanceof el){const s=je.fromString(e,...n);return rp(s),new Nt(t,null,new ce(s))}{if(!(t instanceof Nt||t instanceof ys))throw new re(B.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=t._path.child(je.fromString(e,...n));return rp(s),new Nt(t.firestore,t instanceof ys?t.converter:null,new ce(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lp="AsyncQueue";class up{constructor(e=Promise.resolve()){this.zu=[],this.ju=!1,this.Hu=[],this.Ju=null,this.Yu=!1,this.Zu=!1,this.Xu=[],this.C_=new k_(this,"async_queue_retry"),this.ec=()=>{const s=Kl();s&&se(lp,"Visibility state changed to "+s.visibilityState),this.C_.p_()},this.tc=e;const n=Kl();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.ec)}get isShuttingDown(){return this.ju}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.nc(),this.rc(e)}enterRestrictedMode(e){if(!this.ju){this.ju=!0,this.Zu=e||!1;const n=Kl();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.ec)}}enqueue(e){if(this.nc(),this.ju)return new Promise(()=>{});const n=new Bn;return this.rc(()=>this.ju&&this.Zu?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.zu.push(e),this.sc()))}async sc(){if(this.zu.length!==0){try{await this.zu[0](),this.zu.shift(),this.C_.reset()}catch(e){if(!$r(e))throw e;se(lp,"Operation failed with retryable error: "+e)}this.zu.length>0&&this.C_.f_(()=>this.sc())}}rc(e){const n=this.tc.then(()=>(this.Yu=!0,e().catch(s=>{throw this.Ju=s,this.Yu=!1,zn("INTERNAL UNHANDLED ERROR: ",cp(s)),s}).then(s=>(this.Yu=!1,s))));return this.tc=n,n}enqueueAfterDelay(e,n,s){this.nc(),this.Xu.indexOf(e)>-1&&(n=0);const r=Vc.createAndSchedule(this,e,n,s,i=>this.oc(i));return this.Hu.push(r),r}nc(){this.Ju&&ge(47125,{_c:cp(this.Ju)})}verifyOperationInProgress(){}async ac(){let e;do e=this.tc,await e;while(e!==this.tc)}uc(e){for(const n of this.Hu)if(n.timerId===e)return!0;return!1}cc(e){return this.ac().then(()=>{this.Hu.sort((n,s)=>n.targetTimeMs-s.targetTimeMs);for(const n of this.Hu)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.ac()})}lc(e){this.Xu.push(e)}oc(e){const n=this.Hu.indexOf(e);this.Hu.splice(n,1)}}function cp(t){let e=t.message||"";return t.stack&&(e=t.stack.includes(t.message)?t.stack:t.message+`
`+t.stack),e}class Zs extends el{constructor(e,n,s,r){super(e,n,s,r),this.type="firestore",this._queue=new up,this._persistenceKey=(r==null?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new up(e),this._firestoreClient=void 0,await e}}}function iS(t,e){const n=typeof t=="object"?t:Gm(),s=typeof t=="string"?t:ha,r=tc(n,"firestore").getImmediate({identifier:s});if(!r._initialized){const i=Ew("firestore");i&&rS(r,...i)}return r}function Lc(t){if(t._terminated)throw new re(B.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||oS(t),t._firestoreClient}function oS(t){var e,n,s;const r=t._freezeSettings(),i=function(l,u,c,f){return new kA(l,u,c,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,X_(f.experimentalLongPollingOptions),f.useFetchStreams,f.isUsingEmulator)}(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,r);t._componentsProvider||!((n=r.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((s=r.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(t._componentsProvider={_offline:r.localCache._offlineComponentProvider,_online:r.localCache._onlineComponentProvider}),t._firestoreClient=new XR(t._authCredentials,t._appCheckCredentials,t._queue,i,t._componentsProvider&&function(l){const u=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(u),_online:u}}(t._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nr{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Nr(gt.fromBase64String(e))}catch(n){throw new re(B.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Nr(gt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tl{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new re(B.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new mt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uc{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fc{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new re(B.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new re(B.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return we(this._lat,e._lat)||we(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $c{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(s,r){if(s.length!==r.length)return!1;for(let i=0;i<s.length;++i)if(s[i]!==r[i])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aS=/^__.*__$/;class lS{constructor(e,n,s){this.data=e,this.fieldMask=n,this.fieldTransforms=s}toMutation(e,n){return this.fieldMask!==null?new ks(e,this.data,this.fieldMask,n,this.fieldTransforms):new Zi(e,this.data,n,this.fieldTransforms)}}class ty{constructor(e,n,s){this.data=e,this.fieldMask=n,this.fieldTransforms=s}toMutation(e,n){return new ks(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function ny(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw ge(40011,{hc:t})}}class Bc{constructor(e,n,s,r,i,o){this.settings=e,this.databaseId=n,this.serializer=s,this.ignoreUndefinedProperties=r,i===void 0&&this.Pc(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get hc(){return this.settings.hc}Tc(e){return new Bc(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Ic(e){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(e),r=this.Tc({path:s,Ec:!1});return r.dc(e),r}Ac(e){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(e),r=this.Tc({path:s,Ec:!1});return r.Pc(),r}Rc(e){return this.Tc({path:void 0,Ec:!0})}Vc(e){return Ea(e,this.settings.methodName,this.settings.mc||!1,this.path,this.settings.fc)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}Pc(){if(this.path)for(let e=0;e<this.path.length;e++)this.dc(this.path.get(e))}dc(e){if(e.length===0)throw this.Vc("Document fields must not be empty");if(ny(this.hc)&&aS.test(e))throw this.Vc('Document fields cannot begin and end with "__"')}}class uS{constructor(e,n,s){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=s||Ya(e)}gc(e,n,s,r=!1){return new Bc({hc:e,methodName:n,fc:s,path:mt.emptyPath(),Ec:!1,mc:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function nl(t){const e=t._freezeSettings(),n=Ya(t._databaseId);return new uS(t._databaseId,!!e.ignoreUndefinedProperties,n)}function sy(t,e,n,s,r,i={}){const o=t.gc(i.merge||i.mergeFields?2:0,e,n,r);jc("Data must be an object, but it was:",o,s);const l=ry(s,o);let u,c;if(i.merge)u=new Kt(o.fieldMask),c=o.fieldTransforms;else if(i.mergeFields){const f=[];for(const p of i.mergeFields){const g=ku(e,p,n);if(!o.contains(g))throw new re(B.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);oy(f,g)||f.push(g)}u=new Kt(f),c=o.fieldTransforms.filter(p=>u.covers(p.field))}else u=null,c=o.fieldTransforms;return new lS(new Ut(l),u,c)}class sl extends Uc{_toFieldTransform(e){if(e.hc!==2)throw e.hc===1?e.Vc(`${this._methodName}() can only appear at the top level of your update data`):e.Vc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof sl}}function cS(t,e,n,s){const r=t.gc(1,e,n);jc("Data must be an object, but it was:",r,s);const i=[],o=Ut.empty();Ps(s,(u,c)=>{const f=qc(e,u,n);c=at(c);const p=r.Ac(f);if(c instanceof sl)i.push(f);else{const g=so(c,p);g!=null&&(i.push(f),o.set(f,g))}});const l=new Kt(i);return new ty(o,l,r.fieldTransforms)}function hS(t,e,n,s,r,i){const o=t.gc(1,e,n),l=[ku(e,s,n)],u=[r];if(i.length%2!=0)throw new re(B.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let g=0;g<i.length;g+=2)l.push(ku(e,i[g])),u.push(i[g+1]);const c=[],f=Ut.empty();for(let g=l.length-1;g>=0;--g)if(!oy(c,l[g])){const _=l[g];let b=u[g];b=at(b);const y=o.Ac(_);if(b instanceof sl)c.push(_);else{const E=so(b,y);E!=null&&(c.push(_),f.set(_,E))}}const p=new Kt(c);return new ty(f,p,o.fieldTransforms)}function dS(t,e,n,s=!1){return so(n,t.gc(s?4:3,e))}function so(t,e){if(iy(t=at(t)))return jc("Unsupported field value:",e,t),ry(t,e);if(t instanceof Uc)return function(s,r){if(!ny(r.hc))throw r.Vc(`${s._methodName}() can only be used with update() and set()`);if(!r.path)throw r.Vc(`${s._methodName}() is not currently supported inside arrays`);const i=s._toFieldTransform(r);i&&r.fieldTransforms.push(i)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.Ec&&e.hc!==4)throw e.Vc("Nested arrays are not supported");return function(s,r){const i=[];let o=0;for(const l of s){let u=so(l,r.Rc(o));u==null&&(u={nullValue:"NULL_VALUE"}),i.push(u),o++}return{arrayValue:{values:i}}}(t,e)}return function(s,r){if((s=at(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return ZA(r.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const i=rt.fromDate(s);return{timestampValue:_a(r.serializer,i)}}if(s instanceof rt){const i=new rt(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:_a(r.serializer,i)}}if(s instanceof Fc)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Nr)return{bytesValue:v_(r.serializer,s._byteString)};if(s instanceof Nt){const i=r.databaseId,o=s.firestore._databaseId;if(!o.isEqual(i))throw r.Vc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Tc(s.firestore._databaseId||r.databaseId,s._key.path)}}if(s instanceof $c)return function(o,l){return{mapValue:{fields:{[Wg]:{stringValue:Qg},[da]:{arrayValue:{values:o.toArray().map(c=>{if(typeof c!="number")throw l.Vc("VectorValues must only contain numeric values.");return vc(l.serializer,c)})}}}}}}(s,r);throw r.Vc(`Unsupported field value: ${Za(s)}`)}(t,e)}function ry(t,e){const n={};return jg(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Ps(t,(s,r)=>{const i=so(r,e.Ic(s));i!=null&&(n[s]=i)}),{mapValue:{fields:n}}}function iy(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof rt||t instanceof Fc||t instanceof Nr||t instanceof Nt||t instanceof Uc||t instanceof $c)}function jc(t,e,n){if(!iy(n)||!function(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}(n)){const s=Za(n);throw s==="an object"?e.Vc(t+" a custom object"):e.Vc(t+" "+s)}}function ku(t,e,n){if((e=at(e))instanceof tl)return e._internalPath;if(typeof e=="string")return qc(t,e);throw Ea("Field path arguments must be of type string or ",t,!1,void 0,n)}const fS=new RegExp("[~\\*/\\[\\]]");function qc(t,e,n){if(e.search(fS)>=0)throw Ea(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new tl(...e.split("."))._internalPath}catch{throw Ea(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function Ea(t,e,n,s,r){const i=s&&!s.isEmpty(),o=r!==void 0;let l=`Function ${e}() called with invalid data`;n&&(l+=" (via `toFirestore()`)"),l+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${s}`),o&&(u+=` in document ${r}`),u+=")"),new re(B.INVALID_ARGUMENT,l+t+u)}function oy(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ay{constructor(e,n,s,r,i){this._firestore=e,this._userDataWriter=n,this._key=s,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Nt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new pS(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(rl("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class pS extends ay{data(){return super.data()}}function rl(t,e){return typeof e=="string"?qc(t,e):e instanceof tl?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mS(t){if(t.limitType==="L"&&t.explicitOrderBy.length===0)throw new re(B.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Hc{}class Kc extends Hc{}function hn(t,e,...n){let s=[];e instanceof Hc&&s.push(e),s=s.concat(n),function(i){const o=i.filter(u=>u instanceof zc).length,l=i.filter(u=>u instanceof il).length;if(o>1||o>0&&l>0)throw new re(B.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(s);for(const r of s)t=r._apply(t);return t}class il extends Kc{constructor(e,n,s){super(),this._field=e,this._op=n,this._value=s,this.type="where"}static _create(e,n,s){return new il(e,n,s)}_apply(e){const n=this._parse(e);return cy(e._query,n),new xs(e.firestore,e.converter,bu(e._query,n))}_parse(e){const n=nl(e.firestore);return function(i,o,l,u,c,f,p){let g;if(c.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new re(B.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){dp(p,f);const b=[];for(const y of p)b.push(hp(u,i,y));g={arrayValue:{values:b}}}else g=hp(u,i,p)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||dp(p,f),g=dS(l,o,p,f==="in"||f==="not-in");return Ze.create(c,f,g)}(e._query,"where",n,e.firestore._databaseId,this._field,this._op,this._value)}}function Rt(t,e,n){const s=e,r=rl("where",t);return il._create(r,s,n)}class zc extends Hc{constructor(e,n){super(),this.type=e,this._queryConstraints=n}static _create(e,n){return new zc(e,n)}_parse(e){const n=this._queryConstraints.map(s=>s._parse(e)).filter(s=>s.getFilters().length>0);return n.length===1?n[0]:pn.create(n,this._getOperator())}_apply(e){const n=this._parse(e);return n.getFilters().length===0?e:(function(r,i){let o=r;const l=i.getFlattenedFilters();for(const u of l)cy(o,u),o=bu(o,u)}(e._query,n),new xs(e.firestore,e.converter,bu(e._query,n)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Gc extends Kc{constructor(e,n){super(),this._field=e,this._direction=n,this.type="orderBy"}static _create(e,n){return new Gc(e,n)}_apply(e){const n=function(r,i,o){if(r.startAt!==null)throw new re(B.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(r.endAt!==null)throw new re(B.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new $i(i,o)}(e._query,this._field,this._direction);return new xs(e.firestore,e.converter,function(r,i){const o=r.explicitOrderBy.concat([i]);return new Br(r.path,r.collectionGroup,o,r.filters.slice(),r.limit,r.limitType,r.startAt,r.endAt)}(e._query,n))}}function ly(t,e="asc"){const n=e,s=rl("orderBy",t);return Gc._create(s,n)}class Wc extends Kc{constructor(e,n,s){super(),this.type=e,this._limit=n,this._limitType=s}static _create(e,n,s){return new Wc(e,n,s)}_apply(e){return new xs(e.firestore,e.converter,pa(e._query,this._limit,this._limitType))}}function uy(t){return Wc._create("limit",t,"F")}function hp(t,e,n){if(typeof(n=at(n))=="string"){if(n==="")throw new re(B.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!s_(e)&&n.indexOf("/")!==-1)throw new re(B.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const s=e.path.child(je.fromString(n));if(!ce.isDocumentKey(s))throw new re(B.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return Rf(t,new ce(s))}if(n instanceof Nt)return Rf(t,n._key);throw new re(B.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Za(n)}.`)}function dp(t,e){if(!Array.isArray(t)||t.length===0)throw new re(B.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function cy(t,e){const n=function(r,i){for(const o of r)for(const l of o.getFlattenedFilters())if(i.indexOf(l.op)>=0)return l.op;return null}(t.filters,function(r){switch(r){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(n!==null)throw n===e.op?new re(B.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new re(B.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`)}class gS{convertValue(e,n="none"){switch(As(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Ye(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(Is(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw ge(62114,{value:e})}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const s={};return Ps(e,(r,i)=>{s[r]=this.convertValue(i,n)}),s}convertVectorValue(e){var n,s,r;const i=(r=(s=(n=e.fields)===null||n===void 0?void 0:n[da].arrayValue)===null||s===void 0?void 0:s.values)===null||r===void 0?void 0:r.map(o=>Ye(o.doubleValue));return new $c(i)}convertGeoPoint(e){return new Fc(Ye(e.latitude),Ye(e.longitude))}convertArray(e,n){return(e.values||[]).map(s=>this.convertValue(s,n))}convertServerTimestamp(e,n){switch(n){case"previous":const s=Ha(e);return s==null?null:this.convertValue(s,n);case"estimate":return this.convertTimestamp(Li(e));default:return null}}convertTimestamp(e){const n=Ts(e);return new rt(n.seconds,n.nanos)}convertDocumentKey(e,n){const s=je.fromString(e);Me(A_(s),9688,{name:e});const r=new Ui(s.get(1),s.get(3)),i=new ce(s.popFirst(5));return r.isEqual(n)||zn(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hy(t,e,n){let s;return s=t?t.toFirestore(e):e,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hi{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class dy extends ay{constructor(e,n,s,r,i,o){super(e,n,s,r,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new Ko(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const s=this._document.data.field(rl("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,n.serverTimestamps)}}}class Ko extends dy{data(e={}){return super.data(e)}}class _S{constructor(e,n,s,r){this._firestore=e,this._userDataWriter=n,this._snapshot=r,this.metadata=new hi(r.hasPendingWrites,r.fromCache),this.query=s}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(s=>{e.call(n,new Ko(this._firestore,this._userDataWriter,s.key,s,new hi(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new re(B.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(r,i){if(r._snapshot.oldDocs.isEmpty()){let o=0;return r._snapshot.docChanges.map(l=>{const u=new Ko(r._firestore,r._userDataWriter,l.doc.key,l.doc,new hi(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);return l.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}})}{let o=r._snapshot.oldDocs;return r._snapshot.docChanges.filter(l=>i||l.type!==3).map(l=>{const u=new Ko(r._firestore,r._userDataWriter,l.doc.key,l.doc,new hi(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);let c=-1,f=-1;return l.type!==0&&(c=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),f=o.indexOf(l.doc.key)),{type:yS(l.type),doc:u,oldIndex:c,newIndex:f}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}}function yS(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return ge(61501,{type:t})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ol(t){t=mn(t,Nt);const e=mn(t.firestore,Zs);return tS(Lc(e),t._key).then(n=>vS(e,t,n))}class fy extends gS{constructor(e){super(),this.firestore=e}convertBytes(e){return new Nr(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new Nt(this.firestore,null,n)}}function qe(t){t=mn(t,xs);const e=mn(t.firestore,Zs),n=Lc(e),s=new fy(e);return mS(t._query),nS(n,t._query).then(r=>new _S(e,s,t,r))}function py(t,e,n){t=mn(t,Nt);const s=mn(t.firestore,Zs),r=hy(t.converter,e);return ll(s,[sy(nl(s),"setDoc",t._key,r,t.converter!==null,n).toMutation(t._key,en.none())])}function al(t,e,n,...s){t=mn(t,Nt);const r=mn(t.firestore,Zs),i=nl(r);let o;return o=typeof(e=at(e))=="string"||e instanceof tl?hS(i,"updateDoc",t._key,e,n,s):cS(i,"updateDoc",t._key,e),ll(r,[o.toMutation(t._key,en.exists(!0))])}function Qs(t){return ll(mn(t.firestore,Zs),[new bc(t._key,en.none())])}function Pn(t,e){const n=mn(t.firestore,Zs),s=lt(t),r=hy(t.converter,e);return ll(n,[sy(nl(t.firestore),"addDoc",s._key,r,t.converter!==null,{}).toMutation(s._key,en.exists(!1))]).then(()=>s)}function ll(t,e){return function(s,r){const i=new Bn;return s.asyncQueue.enqueueAndForget(async()=>qR(await eS(s),r,i)),i.promise}(Lc(t),e)}function vS(t,e,n){const s=n.docs.get(e._key),r=new fy(t);return new dy(t,r,e._key,s,new hi(n.hasPendingWrites,n.fromCache),e.converter)}(function(e,n=!0){(function(r){Ur=r})(Mr),Sr(new Hs("firestore",(s,{instanceIdentifier:r,options:i})=>{const o=s.getProvider("app").getImmediate(),l=new Zs(new fA(s.getProvider("auth-internal")),new gA(o,s.getProvider("app-check-internal")),function(c,f){if(!Object.prototype.hasOwnProperty.apply(c.options,["projectId"]))throw new re(B.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ui(c.options.projectId,f)}(o,r),o);return i=Object.assign({useFetchStreams:n},i),l._setSettings(i),l},"PUBLIC").setMultipleInstances(!0)),gs(pf,mf,e),gs(pf,mf,"esm2017")})();var bS="firebase",ES="11.8.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */gs(bS,ES,"app");const wS={apiKey:"AIzaSyBQbijFIV0LEavSNMxaa46b43ZkCCr6OK4",authDomain:"akyildiz-yonetim.firebaseapp.com",projectId:"akyildiz-yonetim",storageBucket:"akyildiz-yonetim.firebasestorage.app",messagingSenderId:"1049267525895",appId:"1:1049267525895:web:bff98aec91ad8fd69ecda2",measurementId:"G-921KP8N3WW"},my=zm(wS),he=iS(my),wa=Ba(my),TS=(t,e)=>{const n=t.__vccOpts||t;for(const[s,r]of e)n[s]=r;return n},IS={class:"relative bg-gray-800 py-6 border-b border-gray-700 text-center shadow text-white"},AS={key:0,class:"absolute top-4 right-6 flex items-center gap-4"},RS={class:"text-sm text-gray-200 font-medium"},SS={__name:"Header",setup(t){const e=G(null),n=Nm(),s=Ba();Ft(()=>{bg(s,async o=>{if(o){const l=await ol(lt(he,"users",o.uid));l.exists()&&(e.value=l.data())}})});const r=async()=>{await ZI(s),n.push("/login")},i=async()=>{const o=s.currentUser;o&&(await uc(s,o.email),alert("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."))};return(o,l)=>(z(),Y("header",IS,[l[0]||(l[0]=d("div",null,[d("h1",{class:"text-4xl font-cormorant"},"AKYILDIZ İŞ MERKEZİ"),d("p",{class:"text-3xl font-cormorantSC"},"Yönetim Sistemi")],-1)),e.value?(z(),Y("div",AS,[d("span",RS,K(e.value.firstName)+" "+K(e.value.lastName),1),d("a",{href:"#",onClick:st(i,["prevent"]),class:"text-sm text-cyan-400 hover:underline"},"Şifre Değiştir"),d("button",{onClick:r,class:"bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"}," Çıkış Yap ")])):tt("",!0)]))}},CS=TS(SS,[["__scopeId","data-v-71575d68"]]),PS={class:"bg-gray-800 px-6 py-4 border-b border-gray-700 flex flex-col md:flex-row justify-center items-center gap-3 text-white"},kS={class:"flex flex-wrap justify-center gap-4"},xS={__name:"TabMenu",setup(t){const e=[{label:"📊 Özet",value:"dashboard",route:"/dashboard"},{label:"🏢 Kiracılar",value:"tenants",route:"/tenants"},{label:"💸 Ödemeler",value:"payments",route:"/payments"},{label:"📉 Yönetim Giderleri",value:"expenses",route:"/expenses"},{label:"⚙️ Sayaçlar",value:"utilities",route:"/utilities"},{label:"🛠️ Yönetim",value:"admin",route:"/admin"}];return(n,s)=>{const r=Gu("router-link");return z(),Y("nav",PS,[d("div",kS,[(z(),Y(Ve,null,Qe(e,i=>et(r,{key:i.value,to:i.route,class:Jt(["btn btn-md transition",n.$route.path===i.route?"btn-primary btn-outline":"btn-outline btn-info"])},{default:Ku(()=>[ft(K(i.label),1)]),_:2},1032,["to","class"])),64))])])}}},VS={class:"min-h-screen bg-base-200"},DS={class:"max-w-6xl mx-auto bg-base-100 shadow-lg rounded-xl overflow-hidden"},NS={__name:"App",setup(t){const e=Om();return(n,s)=>{const r=Gu("router-view");return z(),Y("div",VS,[d("div",DS,[ln(e).meta.hideLayout?tt("",!0):(z(),rn(CS,{key:0})),ln(e).meta.hideLayout?tt("",!0):(z(),rn(xS,{key:1})),et(r,{class:"p-6"})])])}}},OS={class:"min-h-screen bg-base-200 p-6"},MS={__name:"Dashboard",setup(t){return(e,n)=>(z(),Y("section",OS,n[0]||(n[0]=[wb('<div class="max-w-6xl mx-auto space-y-8"><div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="card bg-base-100 shadow-md"><div class="card-body text-center"><h3 class="text-center text-sm text-base-content/70 font-medium uppercase tracking-wide">Kasa Bakiyesi</h3><p class="text-3xl font-bold text-green-600">₺12.450</p></div></div><div class="card bg-base-100 shadow-md"><div class="card-body text-center"><h3 class="text-center text-sm text-base-content/70 font-medium uppercase tracking-wide">Toplam Gelir</h3><p class="text-3xl font-bold text-blue-600">₺20.000</p></div></div><div class="card bg-base-100 shadow-md"><div class="card-body text-center"><h3 class="text-center text-sm text-base-content/70 font-medium uppercase tracking-wide">Toplam Gider</h3><p class="text-3xl font-bold text-red-600">₺7.550</p></div></div></div><div class="card bg-base-100 shadow-md"><div class="card-body"><h4 class="text-center text-lg font-semibold text-base-content mb-4">Son İşlemler</h4><div class="overflow-x-auto"><div class="overflow-x-auto rounded-lg border border-base-300"><table class="table table-zebra w-full text-sm"><thead><tr><th class="text-center">Tarih</th><th class="text-center">Açıklama</th><th class="text-center">Tutar</th></tr></thead><tbody><tr><td class="text-center">2024-05-25</td><td class="text-center">Elektrik Faturası</td><td class="text-center text-red-600 font-medium">-₺1.250</td></tr><tr><td class="text-center">2024-05-24</td><td class="text-center">Aidat Tahsilatı</td><td class="text-center text-green-600 font-medium">₺4.000</td></tr><tr><td class="text-center">2024-05-23</td><td class="text-center">Temizlik Gideri</td><td class="text-center text-red-600 font-medium">-₺800</td></tr></tbody></table></div></div></div></div></div>',1)])))}},LS={class:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"},US={class:"bg-base-200 dark:bg-gray-800 dark:text-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl p-6 space-y-6 relative"},FS={class:"text-2xl font-bold text-center"},$S={class:"grid grid-cols-1 md:grid-cols-2 gap-4"},BS={class:"card bg-base-100 dark:bg-gray-700 shadow-md border border-base-200 p-4 space-y-2"},jS={class:"card bg-base-100 dark:bg-gray-700 shadow-md border border-base-200 p-4 space-y-2"},qS={key:0,class:"overflow-x-auto"},HS={class:"table table-sm w-full border"},KS={key:1,class:"text-gray-500 dark:text-gray-400 italic"},zS={class:"flex justify-end gap-3"},GS={__name:"TenantSummary",props:{tenant:Object},setup(t){const e=t,n=G([]),s=G([]),r=G([]),i=G(0),o=G(0),l=G(0),u=G([]),c=async()=>{var k;if(!((k=e.tenant)!=null&&k.id))return;const p=hn(Re(he,"payments"),Rt("tenantId","==",e.tenant.id)),g=await qe(p);n.value=g.docs.map(C=>C.data()),i.value=n.value.reduce((C,x)=>C+(x.amount||0),0),u.value=n.value.sort((C,x)=>new Date(x.date)-new Date(C.date)).slice(0,5);const _=hn(Re(he,"expenses"),Rt("tenantId","==",e.tenant.id)),b=await qe(_);s.value=b.docs.map(C=>C.data());const y=hn(Re(he,"readings"),Rt("tenantId","==",e.tenant.id)),E=await qe(y);r.value=E.docs.map(C=>C.data()),l.value=r.value.reduce((C,x)=>C+(x.toplamTutar||0),0),o.value=s.value.reduce((C,x)=>C+(x.amount||0),0)+l.value},f=We(()=>o.value-i.value);return _r(()=>{var p;return(p=e.tenant)==null?void 0:p.id},c,{immediate:!0}),(p,g)=>{const _=Gu("RouterLink");return z(),Y("div",LS,[d("div",US,[d("button",{onClick:g[0]||(g[0]=b=>p.$emit("close")),class:"absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"},"✕"),d("h2",FS,K(t.tenant.company)+" – Özet Bilgiler",1),d("div",$S,[d("div",BS,[d("p",null,[g[2]||(g[2]=d("span",{class:"font-semibold"},"👤 Ad Soyad:",-1)),ft(" "+K(t.tenant.firstName)+" "+K(t.tenant.lastName),1)]),d("p",null,[g[3]||(g[3]=d("span",{class:"font-semibold"},"📞 Telefon:",-1)),ft(" "+K(t.tenant.phone),1)]),d("p",null,[g[4]||(g[4]=d("span",{class:"font-semibold"},"✉️ E-posta:",-1)),ft(" "+K(t.tenant.email),1)]),d("p",null,[g[5]||(g[5]=d("span",{class:"font-semibold"},"🏢 Kat:",-1)),d("span",null,K(Array.isArray(t.tenant.units)?t.tenant.units.join(", "):t.tenant.unit),1)])]),d("div",jS,[d("p",null,[g[6]||(g[6]=d("span",{class:"font-semibold text-green-600 dark:text-green-400"},"💰 Toplam Ödeme:",-1)),ft(" "+K(i.value.toLocaleString())+" ₺",1)]),d("p",null,[g[7]||(g[7]=d("span",{class:"font-semibold text-red-600 dark:text-red-400"},"📉 Toplam Borç:",-1)),ft(" "+K(o.value.toLocaleString())+" ₺",1)]),d("p",null,[g[8]||(g[8]=d("span",{class:"font-semibold text-blue-600 dark:text-blue-400"},"🧾 Kalan Bakiye:",-1)),ft(" "+K(f.value.toLocaleString())+" ₺",1)])])]),d("div",null,[g[10]||(g[10]=d("h3",{class:"text-lg font-semibold mb-2"},"🕑 Son 5 Ödeme",-1)),u.value.length?(z(),Y("div",qS,[d("table",HS,[g[9]||(g[9]=d("thead",null,[d("tr",null,[d("th",null,"Tarih"),d("th",null,"Tutar (₺)"),d("th",null,"Tip")])],-1)),d("tbody",null,[(z(!0),Y(Ve,null,Qe(u.value,(b,y)=>(z(),Y("tr",{key:y},[d("td",null,K(b.date),1),d("td",null,K(b.amount.toLocaleString()),1),d("td",null,K(b.type),1)]))),128))])])])):(z(),Y("p",KS,"Henüz ödeme bulunmuyor."))]),d("div",zS,[et(_,{to:`/tenant/${t.tenant.id}`,class:"btn btn-info btn-sm"},{default:Ku(()=>g[11]||(g[11]=[ft("Detay Sayfa")])),_:1,__:[11]},8,["to"]),d("button",{onClick:g[1]||(g[1]=b=>p.$emit("close")),class:"btn btn-outline btn-secondary btn-sm"},"Kapat")])])])}}},WS=["open"],QS={key:0,class:"modal-box max-w-2xl"},YS={class:"grid grid-cols-1 md:grid-cols-2 gap-4"},JS={class:"md:col-span-2"},XS={class:"md:col-span-2"},ZS={class:"flex flex-wrap gap-3"},eC=["value","disabled"],tC={class:"md:col-span-2 flex items-center gap-2"},nC={class:"modal-action mt-6"},sC={__name:"TenantEditModal",props:{tenant:Object,unitOptions:Array,visible:Boolean,allTenants:Array},emits:["save","close"],setup(t,{emit:e}){const n=t,s=o=>n.allTenants.some(l=>{var u;return l.id!==n.tenant.id&&l.isActive&&((u=l.units)==null?void 0:u.includes(o))}),r=e,i=()=>{r("save")};return(o,l)=>{const u=Yp("mask");return z(),Y("dialog",{id:"editTenantModal",class:"modal",open:t.visible},[t.tenant?(z(),Y("div",QS,[l[16]||(l[16]=d("h3",{class:"font-bold text-lg mb-4"},"Kiracı Bilgilerini Güncelle",-1)),d("form",{onSubmit:st(i,["prevent"])},[d("div",YS,[d("div",null,[l[8]||(l[8]=d("label",{class:"label font-semibold"},"Ad",-1)),ie(d("input",{"onUpdate:modelValue":l[0]||(l[0]=c=>t.tenant.firstName=c),class:"input input-bordered w-full",required:""},null,512),[[fe,t.tenant.firstName]])]),d("div",null,[l[9]||(l[9]=d("label",{class:"label font-semibold"},"Soyad",-1)),ie(d("input",{"onUpdate:modelValue":l[1]||(l[1]=c=>t.tenant.lastName=c),class:"input input-bordered w-full",required:""},null,512),[[fe,t.tenant.lastName]])]),d("div",null,[l[10]||(l[10]=d("label",{class:"label font-semibold"},"Telefon",-1)),ie(d("input",{"onUpdate:modelValue":l[2]||(l[2]=c=>t.tenant.phone=c),class:"input input-bordered w-full",required:""},null,512),[[u,"+90 (###) ### ## ##"],[fe,t.tenant.phone]])]),d("div",null,[l[11]||(l[11]=d("label",{class:"label font-semibold"},"E-posta",-1)),ie(d("input",{type:"email","onUpdate:modelValue":l[3]||(l[3]=c=>t.tenant.email=c),class:"input input-bordered w-full"},null,512),[[fe,t.tenant.email]])]),d("div",JS,[l[12]||(l[12]=d("label",{class:"label font-semibold"},"Şirket Unvanı",-1)),ie(d("input",{"onUpdate:modelValue":l[4]||(l[4]=c=>t.tenant.company=c),class:"input input-bordered w-full",required:""},null,512),[[fe,t.tenant.company]])]),d("div",XS,[l[13]||(l[13]=d("label",{class:"label font-semibold"},"Katlar",-1)),d("div",ZS,[(z(!0),Y(Ve,null,Qe(t.unitOptions,c=>(z(),Y("label",{key:c,class:"flex items-center gap-2"},[ie(d("input",{type:"checkbox",value:c,"onUpdate:modelValue":l[5]||(l[5]=f=>t.tenant.units=f),disabled:s(c)},null,8,eC),[[Tr,t.tenant.units]]),d("span",{class:Jt(s(c)?"text-gray-400 line-through":"")},K(c),3)]))),128))])]),d("div",tC,[ie(d("input",{type:"checkbox","onUpdate:modelValue":l[6]||(l[6]=c=>t.tenant.isActive=c),class:"toggle toggle-success"},null,512),[[Tr,t.tenant.isActive]]),l[14]||(l[14]=d("label",{class:"label font-semibold"},"Aktif",-1))])]),d("div",nC,[l[15]||(l[15]=d("button",{type:"submit",class:"btn btn-success"},"Kaydet",-1)),d("button",{type:"button",onClick:l[7]||(l[7]=c=>o.$emit("close")),class:"btn btn-ghost"},"Kapat")])],32)])):tt("",!0)],8,WS)}}},rC=["open"],iC={class:"modal-box max-w-2xl p-0 overflow-hidden"},oC={class:"px-6 overflow-y-auto max-h-[70vh]"},aC={class:"grid grid-cols-1 md:grid-cols-2 gap-4"},lC={class:"md:col-span-2"},uC={class:"md:col-span-2"},cC={class:"flex flex-wrap gap-3"},hC=["value","disabled"],dC={class:"md:col-span-2"},fC={class:"md:col-span-2 flex items-center gap-2"},pC={class:"modal-action px-6 pb-6 pt-4 border-t"},mC={__name:"TenantCreateModal",props:{visible:Boolean,unitOptions:Array,allTenants:Array},emits:["save","close"],setup(t,{emit:e}){const n=t,s=e,r=()=>({firstName:"",lastName:"",phone:"",email:"",company:"",units:[],entryDate:new Date().toISOString().slice(0,10),isActive:!0}),i=G(r());_r(()=>n.visible,u=>{u&&(i.value=r())});const o=u=>n.allTenants.some(c=>{var f;return c.isActive&&((f=c.units)==null?void 0:f.includes(u))}),l=()=>{s("save",i.value),i.value=r()};return(u,c)=>{const f=Yp("mask");return z(),Y("dialog",{id:"createTenantModal",class:"modal",open:t.visible},[d("div",iC,[c[18]||(c[18]=d("div",{class:"px-6 pt-6"},[d("h3",{class:"font-bold text-lg mb-4"},"Yeni Kiracı Ekle")],-1)),d("div",oC,[d("form",{onSubmit:st(l,["prevent"]),id:"tenantForm"},[d("div",aC,[d("div",null,[c[9]||(c[9]=d("label",{class:"label font-semibold"},"Ad",-1)),ie(d("input",{"onUpdate:modelValue":c[0]||(c[0]=p=>i.value.firstName=p),class:"input input-bordered w-full",required:""},null,512),[[fe,i.value.firstName]])]),d("div",null,[c[10]||(c[10]=d("label",{class:"label font-semibold"},"Soyad",-1)),ie(d("input",{"onUpdate:modelValue":c[1]||(c[1]=p=>i.value.lastName=p),class:"input input-bordered w-full",required:""},null,512),[[fe,i.value.lastName]])]),d("div",null,[c[11]||(c[11]=d("label",{class:"label font-semibold"},"Telefon",-1)),ie(d("input",{"onUpdate:modelValue":c[2]||(c[2]=p=>i.value.phone=p),class:"input input-bordered w-full",required:""},null,512),[[f,"+90 (###) ### ## ##"],[fe,i.value.phone]])]),d("div",null,[c[12]||(c[12]=d("label",{class:"label font-semibold"},"E-posta",-1)),ie(d("input",{type:"email","onUpdate:modelValue":c[3]||(c[3]=p=>i.value.email=p),class:"input input-bordered w-full"},null,512),[[fe,i.value.email]])]),d("div",lC,[c[13]||(c[13]=d("label",{class:"label font-semibold"},"Şirket Unvanı",-1)),ie(d("input",{"onUpdate:modelValue":c[4]||(c[4]=p=>i.value.company=p),class:"input input-bordered w-full",required:""},null,512),[[fe,i.value.company]])]),d("div",uC,[c[14]||(c[14]=d("label",{class:"label font-semibold"},"Katlar",-1)),d("div",cC,[(z(!0),Y(Ve,null,Qe(t.unitOptions,p=>(z(),Y("label",{key:p,class:"flex items-center gap-2"},[ie(d("input",{type:"checkbox",value:p,"onUpdate:modelValue":c[5]||(c[5]=g=>i.value.units=g),disabled:o(p)},null,8,hC),[[Tr,i.value.units]]),d("span",{class:Jt(o(p)?"text-gray-400 line-through":"")},K(p),3)]))),128))])]),d("div",dC,[c[15]||(c[15]=d("label",{class:"label font-semibold"},"Giriş Tarihi",-1)),ie(d("input",{type:"date","onUpdate:modelValue":c[6]||(c[6]=p=>i.value.entryDate=p),class:"input input-bordered w-full",required:""},null,512),[[fe,i.value.entryDate]])]),d("div",fC,[ie(d("input",{type:"checkbox","onUpdate:modelValue":c[7]||(c[7]=p=>i.value.isActive=p),class:"toggle toggle-success"},null,512),[[Tr,i.value.isActive]]),c[16]||(c[16]=d("label",{class:"label font-semibold"},"Aktif",-1))])])],32)]),d("div",pC,[c[17]||(c[17]=d("button",{form:"tenantForm",type:"submit",class:"btn btn-success"},"Kaydet",-1)),d("button",{type:"button",onClick:c[8]||(c[8]=p=>u.$emit("close")),class:"btn btn-ghost"},"İptal")])])],8,rC)}}},fp=["-3. Kat ve -4. Kat","-1. Kat","Zemin Kat A","Zemin Kat B","1. Kat","2. Kat A","2. Kat B","3. Kat","4. Kat","5. Kat","6. Kat","7. Kat"],gC=["open"],_C={class:"modal-box max-w-md"},yC={class:"py-4"},vC={class:"modal-action"},bC={__name:"ConfirmDeleteModal",props:{tenant:Object,visible:Boolean},emits:["confirm","close"],setup(t){return(e,n)=>{var s,r;return z(),Y("dialog",{id:"deleteConfirmModal",class:"modal",open:t.visible},[d("div",_C,[n[3]||(n[3]=d("h3",{class:"font-bold text-lg"},"Silme Onayı",-1)),d("p",yC,[d("strong",null,K((s=t.tenant)==null?void 0:s.firstName)+" "+K((r=t.tenant)==null?void 0:r.lastName),1),n[2]||(n[2]=ft(" isimli kiracıyı silmek istediğinize emin misiniz? "))]),d("div",vC,[d("button",{class:"btn btn-error",onClick:n[0]||(n[0]=i=>e.$emit("confirm"))},"Evet, Sil"),d("button",{class:"btn",onClick:n[1]||(n[1]=i=>e.$emit("cancel"))},"İptal")])])],8,gC)}}},EC={class:"p-4 space-y-6 max-w-5xl mx-auto"},wC={class:"flex justify-end"},TC={class:"card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl"},IC={class:"overflow-x-auto"},AC={class:"flex gap-2 justify-end mb-4"},RC={class:"table table-zebra w-full text-sm"},SC={class:"text-center"},CC={class:"text-center"},PC={class:"text-center"},kC={class:"text-center"},xC={class:"text-center whitespace-nowrap"},VC={class:"text-center"},DC={class:"text-center"},NC={class:"text-center"},OC={class:"dropdown dropdown-end"},MC={class:"dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36"},LC=["onClick"],UC=["onClick"],FC=["onClick"],$C={__name:"Tenants",setup(t){const e=G([]),n=G(null),s=G(!1),r=G(!1),i=G(!1),o=G("all"),l=G(!1),u=G(null),c=C=>{u.value=C,l.value=!0},f=async()=>{await Qs(lt(he,"tenants",u.value.id)),e.value=e.value.filter(C=>C.id!==u.value.id),l.value=!1},p=async()=>{e.value=[],(await qe(Re(he,"tenants"))).forEach(x=>{e.value.push({id:x.id,...x.data()})})},g=We(()=>o.value==="active"?e.value.filter(C=>C.isActive):o.value==="passive"?e.value.filter(C=>!C.isActive):e.value),_=C=>{if(!C)return"";const x=C.replace(/\D/g,"");return x.length===11&&x.startsWith("0")?`+90 (${x.slice(1,4)}) ${x.slice(4,7)} ${x.slice(7,9)} ${x.slice(9,11)}`:C},b=async C=>{await Pn(Re(he,"tenants"),{...C}),p(),showCreateModal.value=!1},y=C=>{n.value={...C},r.value=!0},E=async()=>{var C;if((C=n.value)!=null&&C.id){const x=lt(he,"tenants",n.value.id);await al(x,{...n.value}),p(),r.value=!1}},k=C=>{n.value=C,s.value=!0};return Ft(p),(C,x)=>(z(),Y("section",EC,[d("div",wC,[d("button",{class:"btn btn-primary",onClick:x[0]||(x[0]=M=>i.value=!0)},"Yeni Kiracı Ekle")]),d("div",TC,[x[10]||(x[10]=d("h3",{class:"text-center text-lg font-semibold mb-4"},"Kiracılar",-1)),d("div",IC,[d("div",AC,[d("button",{class:Jt(["btn btn-sm",{"btn-primary":o.value==="all"}]),onClick:x[1]||(x[1]=M=>o.value="all")},"Tümü",2),d("button",{class:Jt(["btn btn-sm",{"btn-success":o.value==="active"}]),onClick:x[2]||(x[2]=M=>o.value="active")},"Aktif",2),d("button",{class:Jt(["btn btn-sm",{"btn-error":o.value==="passive"}]),onClick:x[3]||(x[3]=M=>o.value="passive")},"Pasif",2)]),d("table",RC,[x[9]||(x[9]=d("thead",null,[d("tr",null,[d("th",{class:"text-center"},"Kat(lar)"),d("th",{class:"text-center"},"Şirket"),d("th",{class:"text-center"},"Ad"),d("th",{class:"text-center"},"Soyad"),d("th",{class:"text-center"},"Telefon"),d("th",{class:"text-center"},"E-posta"),d("th",{class:"text-center"},"Giriş Tarihi"),d("th",{class:"text-center"},"İşlem")])],-1)),d("tbody",null,[(z(!0),Y(Ve,null,Qe(g.value,(M,W)=>{var le;return z(),Y("tr",{key:W},[d("td",SC,K((le=M.units)==null?void 0:le.join(", ")),1),d("td",CC,K(M.company),1),d("td",PC,K(M.firstName),1),d("td",kC,K(M.lastName),1),d("td",xC,K(_(M.phone)),1),d("td",VC,K(M.email),1),d("td",DC,K(M.entryDate),1),d("td",NC,[d("div",OC,[x[8]||(x[8]=d("div",{tabindex:"0",role:"button",class:"btn btn-sm m-1"},"İşlem",-1)),d("ul",MC,[d("li",null,[d("button",{onClick:st(S=>y(M),["stop","prevent"])},"Düzenle",8,LC)]),d("li",null,[d("button",{onClick:st(S=>k(M),["stop","prevent"])},"Özet",8,UC)]),d("li",null,[d("button",{onClick:st(S=>c(M),["stop","prevent"]),class:"text-error"},"Sil",8,FC)])])])])])}),128))])])])]),s.value?(z(),rn(GS,{key:0,tenant:n.value,onClose:x[4]||(x[4]=M=>s.value=!1)},null,8,["tenant"])):tt("",!0),et(sC,{tenant:n.value,visible:r.value,"unit-options":ln(fp),"all-tenants":e.value,onSave:E,onClose:x[5]||(x[5]=M=>r.value=!1)},null,8,["tenant","visible","unit-options","all-tenants"]),et(mC,{visible:i.value,"unit-options":ln(fp),"all-tenants":e.value,onSave:b,onClose:x[6]||(x[6]=M=>i.value=!1)},null,8,["visible","unit-options","all-tenants"]),et(bC,{visible:l.value,tenant:u.value,onConfirm:f,onCancel:x[7]||(x[7]=M=>l.value=!1)},null,8,["visible","tenant"])]))}},BC={class:"p-4 space-y-6 max-w-5xl mx-auto"},jC={class:"card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl"},qC={class:"text-center text-lg font-semibold mb-4"},HC=["value"],KC=["value"],zC={class:"md:col-span-3 flex justify-end gap-2"},GC={type:"submit",class:"btn btn-success"},WC={class:"card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl"},QC={class:"overflow-x-auto"},YC={class:"table table-zebra w-full text-sm"},JC={class:"text-center"},XC={class:"text-center"},ZC={class:"text-center text-green-600"},eP={class:"text-center"},tP={class:"text-center"},nP={class:"text-center"},sP={class:"flex justify-center gap-2"},rP=["onClick"],iP=["onClick"],oP={__name:"Payments",setup(t){const e=G([]),n=G([]),s=G(["Ziraat","İş Bankası","Garanti","Yapı Kredi","Halkbank"]),r=G({date:new Date().toISOString().substring(0,10),tenantId:"",amount:null,type:"",bank:""}),i=G(!1),o=G(null),l=async()=>{e.value=[],(await qe(Re(he,"payments"))).forEach(y=>{e.value.push({id:y.id,...y.data()})})},u=async()=>{n.value=[],(await qe(Re(he,"tenants"))).forEach(y=>{n.value.push({id:y.id,...y.data()})})},c=b=>{const y=n.value.find(E=>E.id===b);return y?y.company:"Bilinmiyor"},f=async()=>{if(i.value&&o.value){const b=lt(he,"payments",o.value);await al(b,{...r.value})}else await Pn(Re(he,"payments"),{...r.value});r.value={date:new Date().toISOString().substring(0,10),tenantId:"",amount:null,type:"",bank:""},i.value=!1,o.value=null,await l()},p=async b=>{await Qs(lt(he,"payments",b)),e.value=e.value.filter(y=>y.id!==b)},g=b=>{r.value={date:b.date,tenantId:b.tenantId,amount:b.amount,type:b.type,bank:b.bank},o.value=b.id,i.value=!0},_=()=>{r.value={date:new Date().toISOString().substring(0,10),tenantId:"",amount:null,type:"",bank:""},i.value=!1,o.value=null};return Ft(()=>{u(),l()}),(b,y)=>(z(),Y("section",BC,[d("div",jC,[d("h2",qC,"Ödeme "+K(i.value?"Güncelle":"Ekle"),1),d("form",{onSubmit:st(f,["prevent"]),class:"grid grid-cols-1 md:grid-cols-3 gap-4"},[ie(d("input",{"onUpdate:modelValue":y[0]||(y[0]=E=>r.value.date=E),type:"date",class:"input input-bordered w-full",required:""},null,512),[[fe,r.value.date]]),ie(d("select",{"onUpdate:modelValue":y[1]||(y[1]=E=>r.value.tenantId=E),class:"select select-bordered w-full",required:""},[y[5]||(y[5]=d("option",{disabled:"",value:""},"Kiracı seçin",-1)),(z(!0),Y(Ve,null,Qe(n.value,E=>(z(),Y("option",{key:E.id,value:E.id},K(E.company),9,HC))),128))],512),[[cn,r.value.tenantId]]),ie(d("input",{"onUpdate:modelValue":y[2]||(y[2]=E=>r.value.amount=E),type:"number",placeholder:"Tutar (₺)",class:"input input-bordered w-full",required:""},null,512),[[fe,r.value.amount,void 0,{number:!0}]]),ie(d("select",{"onUpdate:modelValue":y[3]||(y[3]=E=>r.value.type=E),class:"select select-bordered w-full",required:""},y[6]||(y[6]=[d("option",{disabled:"",value:""},"Ödeme Tipi",-1),d("option",{value:"Aidat"},"Aidat",-1),d("option",{value:"Elektrik"},"Elektrik",-1),d("option",{value:"Su"},"Su",-1)]),512),[[cn,r.value.type]]),ie(d("select",{"onUpdate:modelValue":y[4]||(y[4]=E=>r.value.bank=E),class:"select select-bordered w-full",required:""},[y[7]||(y[7]=d("option",{disabled:"",value:""},"Banka Seçin",-1)),(z(!0),Y(Ve,null,Qe(s.value,E=>(z(),Y("option",{key:E,value:E},K(E),9,KC))),128))],512),[[cn,r.value.bank]]),d("div",zC,[d("button",GC,K(i.value?"Kaydet":"Ekle"),1),i.value?(z(),Y("button",{key:0,type:"button",onClick:_,class:"btn btn-outline btn-warning"},"Vazgeç")):tt("",!0)])],32)]),d("div",WC,[y[9]||(y[9]=d("h3",{class:"text-center text-lg font-semibold mb-4"},"Ödeme Geçmişi",-1)),d("div",QC,[d("table",YC,[y[8]||(y[8]=d("thead",null,[d("tr",null,[d("th",{class:"text-center"},"Tarih"),d("th",{class:"text-center"},"Firma"),d("th",{class:"text-center"},"Tutar"),d("th",{class:"text-center"},"Tip"),d("th",{class:"text-center"},"Banka"),d("th",{class:"text-center"},"İşlem")])],-1)),d("tbody",null,[(z(!0),Y(Ve,null,Qe(e.value,(E,k)=>(z(),Y("tr",{key:k},[d("td",JC,K(E.date),1),d("td",XC,K(c(E.tenantId)),1),d("td",ZC,K(E.amount)+" ₺",1),d("td",eP,K(E.type),1),d("td",tP,K(E.bank),1),d("td",nP,[d("div",sP,[d("button",{onClick:C=>g(E),class:"btn btn-xs btn-info"},"Düzenle",8,rP),d("button",{onClick:C=>p(E.id),class:"btn btn-xs btn-error"},"Sil",8,iP)])])]))),128))])])])])]))}},aP={class:"p-4 space-y-6 max-w-5xl mx-auto"},lP={class:"card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl"},uP={class:"form-control md:col-span-1"},cP=["value"],hP={class:"form-control md:col-span-1"},dP={class:"form-control md:col-span-1"},fP={class:"form-control md:col-span-3"},pP={class:"md:col-span-3 flex justify-end gap-2 pt-2"},mP={type:"submit",class:"btn btn-primary"},gP={class:"card bg-base-100 shadow-lg border border-base-300 p-6 rounded-xl"},_P={class:"overflow-x-auto rounded-lg border border-base-300"},yP={class:"table table-zebra w-full text-sm"},vP={class:"text-center"},bP={class:"text-center"},EP={class:"text-center text-red-600 font-medium"},wP={class:"text-center"},TP={class:"text-center"},IP={class:"dropdown dropdown-end"},AP={tabindex:"0",class:"dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32"},RP=["onClick"],SP=["onClick"],CP={__name:"Expenses",setup(t){const e=["Elektrik (Genel)","Su (Genel)","Maaş","Vergi","Bakım","Temizlik","Yönetici Ücreti","Diğer"],n=new Date().toISOString().substr(0,10),s=G({date:n,description:"",amount:"",type:""}),r=G(!1),i=G(null),o=G([]),l=_=>_==null||isNaN(_)?"-":Number(_).toLocaleString("tr-TR",{style:"currency",currency:"TRY"}),u=_=>{s.value={date:_.date,description:_.description,amount:_.amount,type:_.type},i.value=_.id,r.value=!0},c=()=>{s.value={date:n,description:"",amount:"",type:""},r.value=!1,i.value=null},f=async _=>{try{await Qs(lt(he,"expenses",_)),o.value=o.value.filter(b=>b.id!==_)}catch(b){console.error("Silme işlemi başarısız:",b)}},p=async()=>{try{if(r.value&&i.value){const _=lt(he,"expenses",i.value);await al(_,{...s.value})}else await Pn(Re(he,"expenses"),{...s.value});c(),await g(),alert("Gider başarıyla kaydedildi.")}catch(_){console.error("Kayıt hatası:",_)}},g=async()=>{o.value=[],(await qe(Re(he,"expenses"))).forEach(b=>{o.value.push({id:b.id,...b.data()})})};return Ft(()=>{g()}),(_,b)=>(z(),Y("section",aP,[d("div",lP,[b[9]||(b[9]=d("h2",{class:"text-center text-lg font-semibold text-base-content mb-4"},"Gider Ekle",-1)),d("form",{onSubmit:st(p,["prevent"]),class:"grid grid-cols-1 md:grid-cols-3 gap-4"},[d("div",uP,[b[5]||(b[5]=d("label",{class:"label font-semibold"},"Gider Tipi",-1)),ie(d("select",{"onUpdate:modelValue":b[0]||(b[0]=y=>s.value.type=y),class:"select select-bordered w-full",required:""},[b[4]||(b[4]=d("option",{disabled:"",value:""},"Seçiniz",-1)),(z(),Y(Ve,null,Qe(e,y=>d("option",{key:y,value:y},K(y),9,cP)),64))],512),[[cn,s.value.type]])]),d("div",hP,[b[6]||(b[6]=d("label",{class:"label font-semibold"},"Tarih",-1)),ie(d("input",{"onUpdate:modelValue":b[1]||(b[1]=y=>s.value.date=y),type:"date",class:"input input-bordered w-full",required:""},null,512),[[fe,s.value.date]])]),d("div",dP,[b[7]||(b[7]=d("label",{class:"label font-semibold"},"Tutar (₺)",-1)),ie(d("input",{"onUpdate:modelValue":b[2]||(b[2]=y=>s.value.amount=y),type:"number",min:"0",step:"0.01",class:"input input-bordered w-full",required:""},null,512),[[fe,s.value.amount]])]),d("div",fP,[b[8]||(b[8]=d("label",{class:"label font-semibold"},"Açıklama",-1)),ie(d("input",{"onUpdate:modelValue":b[3]||(b[3]=y=>s.value.description=y),placeholder:"Açıklama giriniz",class:"input input-bordered w-full",required:""},null,512),[[fe,s.value.description]])]),d("div",pP,[d("button",mP,K(r.value?"Kaydet":"Ekle"),1),r.value?(z(),Y("button",{key:0,type:"button",onClick:c,class:"btn btn-outline btn-warning"},"Vazgeç")):tt("",!0)])],32)]),d("div",gP,[b[12]||(b[12]=d("h3",{class:"text-center text-lg font-semibold text-base-content mb-4"},"Gider Listesi",-1)),d("div",_P,[d("table",yP,[b[11]||(b[11]=d("thead",null,[d("tr",null,[d("th",{class:"text-center"},"Tarih"),d("th",{class:"text-center"},"Açıklama"),d("th",{class:"text-center"},"Tutar"),d("th",{class:"text-center"},"Tip"),d("th",{class:"text-center"},"İşlem")])],-1)),d("tbody",null,[(z(!0),Y(Ve,null,Qe(o.value,(y,E)=>(z(),Y("tr",{key:E},[d("td",vP,K(y.date),1),d("td",bP,K(y.description),1),d("td",EP,K(l(y.amount)),1),d("td",wP,K(y.type),1),d("td",TP,[d("div",IP,[b[10]||(b[10]=d("label",{tabindex:"0",class:"btn btn-xs btn-outline"},"İşlemler",-1)),d("ul",AP,[d("li",null,[d("a",{onClick:st(k=>u(y),["prevent"])},"Düzenle",8,RP)]),d("li",null,[d("a",{onClick:st(k=>f(y.id),["prevent"])},"Sil",8,SP)])])])])]))),128))])])])])]))}},PP={id:"electricityModal",class:"modal",open:""},kP={class:"modal-box max-w-6xl"},xP={class:"form-control w-48 mt-4"},VP={class:"flex flex-wrap gap-4 mt-2"},DP={class:"form-control"},NP={class:"form-control"},OP={class:"form-control"},MP={class:"form-control"},LP=["value"],UP={class:"overflow-x-auto mt-6"},FP={class:"table w-full border"},$P=["onUpdate:modelValue","onInput"],BP=["onUpdate:modelValue","onInput"],jP=["onUpdate:modelValue","onInput"],qP=["value"],HP={class:"modal-action flex justify-between"},KP={__name:"ElectricityModal",setup(t){const e=G(new Date().toISOString().slice(0,7)),n=G([]),s=G(""),r=G(""),i=G(""),o=We(()=>{if(!s.value||!r.value)return 0;const _=new Date(s.value),y=new Date(r.value)-_;return Math.floor(y/(1e3*60*60*24))}),l=_=>{const b=n.value[_],y=Number(b.kdvHaric)*.2;b.toplamTutar=+(Number(b.kdvHaric)+y).toFixed(2)},u=async()=>{const _=await qe(Re(he,"tenants"));n.value=[];const b=new Set,y=[{tenantId:"mescit",unit:"MESCİT",company:"MESCİT"},{tenantId:"ortak",unit:"ORTAK ALAN",company:"ORTAK ALAN"}];for(const E of y){const k=await c(E.unit);n.value.push({...E,previous:k,current:0,usage:0,kdvHaric:0,toplamTutar:0}),b.add(E.unit)}_.forEach(E=>{const k=E.data();if(k.isActive)for(const C of k.units||[])b.has(C)||(b.add(C),c(C).then(x=>{n.value.push({tenantId:E.id,unit:C,company:k.company,previous:x,current:0,usage:0,kdvHaric:0,toplamTutar:0})}))})},c=async _=>{const b=hn(Re(he,"readings"),Rt("unit","==",_),Rt("type","==","electricity"),ly("endDate","desc"),uy(1)),y=await qe(b);return y.empty?0:y.docs[0].data().currentValue||0},f=_=>{const b=n.value[_];b.usage=b.current-b.previous,l(_)},p=async()=>{const _=Re(he,"readings");for(const b of n.value)await Pn(_,{tenantId:b.tenantId,unit:b.unit,period:e.value,type:"electricity",previousValue:b.previous,currentValue:b.current,consumption:b.usage,kdvHaric:b.kdvHaric,toplamTutar:b.toplamTutar,company:b.company,startDate:s.value,endDate:r.value,dueDate:i.value,dayCount:o.value});alert("Tüm elektrik sayaç kayıtları eklendi."),n.value=[],u()},g=async()=>{const _=Re(he,"readings"),b=n.value.filter(y=>y.current>0);for(const y of b)await Pn(_,{tenantId:y.tenantId,unit:y.unit,period:e.value,type:"electricity",previousValue:y.previous,currentValue:y.current,consumption:y.usage,kdvHaric:y.kdvHaric,toplamTutar:y.toplamTutar,company:y.company,startDate:s.value,endDate:r.value,dueDate:i.value,dayCount:o.value});alert("Girilen elektrik kayıtları başarıyla eklendi."),u()};return Ft(u),(_,b)=>(z(),Y("dialog",PP,[d("div",kP,[b[11]||(b[11]=d("h3",{class:"font-bold text-lg"},"Elektrik Sayaç Girişi",-1)),d("div",xP,[b[5]||(b[5]=d("label",{class:"label"},[d("span",{class:"label-text font-semibold"},"Dönem")],-1)),ie(d("input",{type:"month","onUpdate:modelValue":b[0]||(b[0]=y=>e.value=y),class:"input input-bordered"},null,512),[[fe,e.value]])]),d("div",VP,[d("div",DP,[b[6]||(b[6]=d("label",{class:"label"},[d("span",{class:"label-text font-semibold"},"İlk Okuma Tarihi")],-1)),ie(d("input",{type:"date","onUpdate:modelValue":b[1]||(b[1]=y=>s.value=y),class:"input input-bordered"},null,512),[[fe,s.value]])]),d("div",NP,[b[7]||(b[7]=d("label",{class:"label"},[d("span",{class:"label-text font-semibold"},"Son Okuma Tarihi")],-1)),ie(d("input",{type:"date","onUpdate:modelValue":b[2]||(b[2]=y=>r.value=y),class:"input input-bordered"},null,512),[[fe,r.value]])]),d("div",OP,[b[8]||(b[8]=d("label",{class:"label"},[d("span",{class:"label-text font-semibold"},"Son Ödeme Tarihi")],-1)),ie(d("input",{type:"date","onUpdate:modelValue":b[3]||(b[3]=y=>i.value=y),class:"input input-bordered"},null,512),[[fe,i.value]])]),d("div",MP,[b[9]||(b[9]=d("label",{class:"label"},[d("span",{class:"label-text font-semibold"},"Gün Sayısı")],-1)),d("input",{type:"number",value:o.value,disabled:"",class:"input input-bordered"},null,8,LP)])]),d("div",UP,[d("table",FP,[b[10]||(b[10]=d("thead",null,[d("tr",null,[d("th",null,"Kat"),d("th",null,"Şirket"),d("th",null,"Önceki Sayaç"),d("th",null,"Yeni Sayaç"),d("th",null,"Tüketim"),d("th",null,"KDV Hariç Tutar"),d("th",null,"Toplam Tutar")])],-1)),d("tbody",null,[(z(!0),Y(Ve,null,Qe(n.value,(y,E)=>(z(),Y("tr",{key:E},[d("td",null,K(y.unit),1),d("td",null,K(y.company),1),d("td",null,[ie(d("input",{type:"number",class:"input input-bordered w-24","onUpdate:modelValue":k=>y.previous=k,onInput:k=>f(E)},null,40,$P),[[fe,y.previous,void 0,{number:!0}]])]),d("td",null,[ie(d("input",{type:"number",class:"input input-bordered w-24","onUpdate:modelValue":k=>y.current=k,onInput:k=>f(E)},null,40,BP),[[fe,y.current,void 0,{number:!0}]])]),d("td",null,K(y.usage),1),d("td",null,[ie(d("input",{type:"number",class:"input input-bordered w-28","onUpdate:modelValue":k=>y.kdvHaric=k,onInput:k=>l(E)},null,40,jP),[[fe,y.kdvHaric,void 0,{number:!0}]])]),d("td",null,[d("input",{type:"number",class:"input input-bordered w-28 bg-base-200",value:y.toplamTutar,disabled:""},null,8,qP)])]))),128))])])]),d("div",HP,[d("div",{class:"space-x-2"},[d("button",{class:"btn btn-success",onClick:g},"Girilenleri Kaydet"),d("button",{class:"btn btn-primary",onClick:p},"Tümünü Kaydet")]),d("button",{class:"btn",onClick:b[4]||(b[4]=y=>_.$emit("close"))},"Kapat")])])]))}},zP={id:"waterModal",class:"modal",open:""},GP={class:"modal-box max-w-6xl"},WP={class:"form-control w-48 mt-4"},QP={class:"flex flex-wrap gap-4 mt-2"},YP={class:"form-control"},JP={class:"form-control"},XP={class:"form-control"},ZP={class:"form-control"},ek=["value"],tk={class:"flex gap-4 mt-4"},nk={class:"form-control w-60"},sk={class:"form-control w-60"},rk={class:"overflow-x-auto mt-6"},ik={class:"table w-full border"},ok=["onUpdate:modelValue"],ak=["onUpdate:modelValue","onInput"],lk={class:"modal-action flex justify-between"},uk={__name:"WaterModal",setup(t){const e=G([]),n=G([]),s=G(new Date().toISOString().slice(0,7)),r=G(""),i=G(""),o=G(""),l=G(0),u=G(0),c=We(()=>{if(!r.value||!i.value)return 0;const y=new Date(r.value),k=new Date(i.value)-y;return Math.floor(k/(1e3*60*60*24))}),f=async y=>{const E=hn(Re(he,"readings"),Rt("unit","==",y),Rt("type","==","water"),ly("endDate","desc"),uy(1)),k=await qe(E);return k.empty?0:k.docs[0].data().currentValue||0},p=async()=>{const y=await qe(Re(he,"tenants"));e.value=[],n.value=[];const E=[{tenantId:"ortak",unit:"ORTAK ALAN",name:"ORTAK ALAN"},{tenantId:"mescit",unit:"MESCİT",name:"MESCİT"}];for(const k of E){const C=await f(k.unit);n.value.push({...k,previous:C,current:0,usage:0,kdvHaric:0,toplamTutar:0})}y.forEach(async k=>{const C=k.data();if(C.isActive)for(const x of C.units||[]){const M=await f(x);n.value.push({tenantId:k.id,unit:x,name:C.company,previous:M,current:0,usage:0,kdvHaric:0,toplamTutar:0})}})},g=y=>{const E=n.value[y];E.usage=E.current-E.previous,E.kdvHaric=E.usage*(l.value+u.value),E.toplamTutar=E.kdvHaric*1.11},_=async()=>{if(!r.value||!i.value||c.value<=0){alert("Lütfen geçerli bir tarih aralığı seçin.");return}const y=Re(he,"readings");for(const E of n.value)await Pn(y,{tenantId:E.tenantId,unit:E.unit,period:s.value,type:"water",previousValue:E.previous,currentValue:E.current,usage:E.usage,kdvHaric:E.kdvHaric,toplamTutar:E.toplamTutar,startDate:r.value,endDate:i.value,dueDate:o.value,dayCount:c.value,waterUnitPrice:l.value,wasteUnitPrice:u.value});alert("Tüm kayıtlar başarıyla eklendi."),n.value=[],p()},b=async()=>{if(!r.value||!i.value||c.value<=0){alert("Lütfen geçerli bir tarih aralığı seçin.");return}const y=Re(he,"readings"),E=n.value.filter(k=>k.previous&&k.current);for(const k of E)await Pn(y,{tenantId:k.tenantId,unit:k.unit,period:s.value,type:"water",previousValue:k.previous,currentValue:k.current,usage:k.usage,kdvHaric:k.kdvHaric,toplamTutar:k.toplamTutar,startDate:r.value,endDate:i.value,dueDate:o.value,dayCount:c.value,waterUnitPrice:l.value,wasteUnitPrice:u.value});alert("Girilen kayıtlar başarıyla eklendi."),p()};return Ft(p),(y,E)=>(z(),Y("dialog",zP,[d("div",GP,[E[15]||(E[15]=d("h3",{class:"font-bold text-lg"},"Su Sayaç Girişi",-1)),d("div",WP,[E[7]||(E[7]=d("label",{class:"label"},[d("span",{class:"label-text font-semibold"},"Dönem")],-1)),ie(d("input",{type:"month","onUpdate:modelValue":E[0]||(E[0]=k=>s.value=k),class:"input input-bordered"},null,512),[[fe,s.value]])]),d("div",QP,[d("div",YP,[E[8]||(E[8]=d("label",{class:"label"},[d("span",{class:"label-text font-semibold"},"Başlangıç Tarihi")],-1)),ie(d("input",{type:"date","onUpdate:modelValue":E[1]||(E[1]=k=>r.value=k),class:"input input-bordered"},null,512),[[fe,r.value]])]),d("div",JP,[E[9]||(E[9]=d("label",{class:"label"},[d("span",{class:"label-text font-semibold"},"Bitiş Tarihi")],-1)),ie(d("input",{type:"date","onUpdate:modelValue":E[2]||(E[2]=k=>i.value=k),class:"input input-bordered"},null,512),[[fe,i.value]])]),d("div",XP,[E[10]||(E[10]=d("label",{class:"label"},[d("span",{class:"label-text font-semibold"},"Son Ödeme Tarihi")],-1)),ie(d("input",{type:"date","onUpdate:modelValue":E[3]||(E[3]=k=>o.value=k),class:"input input-bordered"},null,512),[[fe,o.value]])]),d("div",ZP,[E[11]||(E[11]=d("label",{class:"label"},[d("span",{class:"label-text font-semibold"},"Gün Sayısı")],-1)),d("input",{type:"number",value:c.value,disabled:"",class:"input input-bordered"},null,8,ek)])]),d("div",tk,[d("div",nk,[E[12]||(E[12]=d("label",{class:"label"},[d("span",{class:"label-text font-semibold"},"Su Birim Fiyatı (₺)")],-1)),ie(d("input",{type:"number","onUpdate:modelValue":E[4]||(E[4]=k=>l.value=k),class:"input input-bordered",step:"0.01"},null,512),[[fe,l.value,void 0,{number:!0}]])]),d("div",sk,[E[13]||(E[13]=d("label",{class:"label"},[d("span",{class:"label-text font-semibold"},"Atık Su Birim Fiyatı (₺)")],-1)),ie(d("input",{type:"number","onUpdate:modelValue":E[5]||(E[5]=k=>u.value=k),class:"input input-bordered",step:"0.01"},null,512),[[fe,u.value,void 0,{number:!0}]])])]),d("div",rk,[d("table",ik,[E[14]||(E[14]=d("thead",null,[d("tr",null,[d("th",null,"Kat"),d("th",null,"Şirket"),d("th",null,"Önceki Sayaç"),d("th",null,"Yeni Sayaç"),d("th",null,"Tüketim"),d("th",null,"KDV Hariç"),d("th",null,"Toplam")])],-1)),d("tbody",null,[(z(!0),Y(Ve,null,Qe(n.value,(k,C)=>(z(),Y("tr",{key:C},[d("td",null,K(k.unit),1),d("td",null,K(k.name),1),d("td",null,[ie(d("input",{type:"number",class:"input input-bordered w-24","onUpdate:modelValue":x=>k.previous=x},null,8,ok),[[fe,k.previous,void 0,{number:!0}]])]),d("td",null,[ie(d("input",{type:"number",class:"input input-bordered w-24","onUpdate:modelValue":x=>k.current=x,onInput:x=>g(C)},null,40,ak),[[fe,k.current,void 0,{number:!0}]])]),d("td",null,K(k.usage),1),d("td",null,K(k.kdvHaric.toFixed(2)),1),d("td",null,K(k.toplamTutar.toFixed(2)),1)]))),128))])])]),d("div",lk,[d("div",{class:"space-x-2"},[d("button",{class:"btn btn-success",onClick:b},"Girilenleri Kaydet"),d("button",{class:"btn btn-primary",onClick:_},"Tümünü Kaydet")]),d("button",{class:"btn",onClick:E[6]||(E[6]=k=>y.$emit("close"))},"Kapat")])])]))}},ck={open:"",class:"modal"},hk={class:"modal-box max-w-xl"},dk={class:"grid grid-cols-1 md:grid-cols-2 gap-4"},fk={class:"form-control"},pk={class:"form-control"},mk={__name:"AidatModal",emits:["close","refresh"],setup(t,{emit:e}){const n=e,s=G(""),r=G(""),i=()=>{n("close")},o=async()=>{try{if(!s.value||!r.value){alert("Lütfen dönem ve son ödeme tarihini giriniz.");return}const l=parseInt(s.value.slice(0,4)),u=await qe(hn(Re(he,"annualDues"),Rt("year","==",l))),c=[];if(u.forEach(f=>{const p=f.data();if(p.amount>0){const g=parseFloat((p.amount*1.2).toFixed(2));c.push({tenantId:p.tenantId,kdvHaric:p.amount,toplamTutar:g})}}),c.length===0){alert("Bu yıla ait tanımlı aidat bilgisi bulunamadı.");return}for(const f of c)await Pn(Re(he,"readings"),{tenantId:f.tenantId,period:s.value,dueDate:r.value,kdvHaric:f.kdvHaric,toplamTutar:f.toplamTutar,type:"aidat"});alert("Aidatlar başarıyla oluşturuldu."),n("refresh"),n("close")}catch(l){console.error("Aidat kayıt hatası:",l),alert("Bir hata oluştu. Konsolu kontrol ediniz.")}};return(l,u)=>(z(),Y("dialog",ck,[d("div",hk,[u[5]||(u[5]=d("h3",{class:"font-bold text-lg mb-6 text-center"},"Aidat Oluştur",-1)),d("form",{onSubmit:st(o,["prevent"]),class:"space-y-4"},[d("div",dk,[d("div",fk,[u[2]||(u[2]=d("label",{class:"label font-semibold"},"Dönem",-1)),ie(d("input",{type:"month","onUpdate:modelValue":u[0]||(u[0]=c=>s.value=c),class:"input input-bordered w-full",required:""},null,512),[[fe,s.value]])]),d("div",pk,[u[3]||(u[3]=d("label",{class:"label font-semibold"},"Son Ödeme Tarihi",-1)),ie(d("input",{type:"date","onUpdate:modelValue":u[1]||(u[1]=c=>r.value=c),class:"input input-bordered w-full",required:""},null,512),[[fe,r.value]])])]),d("div",{class:"flex justify-end mt-6"},[d("button",{type:"button",class:"btn btn-outline mr-2",onClick:i},"İptal"),u[4]||(u[4]=d("button",{type:"submit",class:"btn btn-primary"},"Oluştur",-1))])],32)])]))}},gk={open:"",class:"modal"},_k={class:"modal-box max-w-6xl"},yk={class:"font-bold text-lg mb-4"},vk={class:"flex flex-wrap gap-4 mb-4"},bk={class:"form-control"},Ek={class:"form-control"},wk={class:"form-control"},Tk={class:"overflow-x-auto"},Ik={class:"table w-full"},Ak=["onUpdate:modelValue"],Rk=["onUpdate:modelValue"],Sk=["onUpdate:modelValue"],Ck={class:"modal-action"},Pk={__name:"EditElectricityModal",props:{period:String},emits:["close","updated"],setup(t,{emit:e}){const n=t,s=e,r=G([]),i=G(""),o=G(""),l=G(""),u=p=>isNaN(p)?"-":p.toLocaleString("tr-TR",{style:"currency",currency:"TRY"}),c=async()=>{const p=hn(Re(he,"readings"),Rt("type","==","electricity"),Rt("period","==",n.period)),g=await qe(p);r.value=g.docs.map(_=>{const b=_.data();return!i.value&&b.startDate&&(i.value=b.startDate),!o.value&&b.endDate&&(o.value=b.endDate),!l.value&&b.dueDate&&(l.value=b.dueDate),{id:_.id,...b,company:b.company||"-"}})},f=async()=>{for(const p of r.value){const g=lt(he,"readings",p.id);await al(g,{previousValue:p.previousValue,currentValue:p.currentValue,kdvHaric:p.kdvHaric,toplamTutar:+(p.kdvHaric*1.2).toFixed(2),startDate:i.value,endDate:o.value,dueDate:l.value})}alert("Kayıtlar başarıyla güncellendi."),s("updated"),s("close")};return Ft(c),(p,g)=>(z(),Y("dialog",gk,[d("div",_k,[d("h3",yk,"Elektrik Kayıtlarını Düzenle - "+K(t.period),1),d("div",vk,[d("div",bk,[g[4]||(g[4]=d("label",{class:"label font-semibold"},"İlk Okuma Tarihi",-1)),ie(d("input",{type:"date","onUpdate:modelValue":g[0]||(g[0]=_=>i.value=_),class:"input input-bordered"},null,512),[[fe,i.value]])]),d("div",Ek,[g[5]||(g[5]=d("label",{class:"label font-semibold"},"Son Okuma Tarihi",-1)),ie(d("input",{type:"date","onUpdate:modelValue":g[1]||(g[1]=_=>o.value=_),class:"input input-bordered"},null,512),[[fe,o.value]])]),d("div",wk,[g[6]||(g[6]=d("label",{class:"label font-semibold"},"Son Ödeme Tarihi",-1)),ie(d("input",{type:"date","onUpdate:modelValue":g[2]||(g[2]=_=>l.value=_),class:"input input-bordered"},null,512),[[fe,l.value]])])]),d("div",Tk,[d("table",Ik,[g[7]||(g[7]=d("thead",null,[d("tr",null,[d("th",null,"Kat"),d("th",null,"Şirket"),d("th",null,"Önceki"),d("th",null,"Yeni"),d("th",null,"KDV Hariç"),d("th",null,"Toplam")])],-1)),d("tbody",null,[(z(!0),Y(Ve,null,Qe(r.value,(_,b)=>(z(),Y("tr",{key:_.id},[d("td",null,K(_.unit),1),d("td",null,K(_.company),1),d("td",null,[ie(d("input",{"onUpdate:modelValue":y=>_.previousValue=y,type:"number",class:"input input-sm"},null,8,Ak),[[fe,_.previousValue,void 0,{number:!0}]])]),d("td",null,[ie(d("input",{"onUpdate:modelValue":y=>_.currentValue=y,type:"number",class:"input input-sm"},null,8,Rk),[[fe,_.currentValue,void 0,{number:!0}]])]),d("td",null,[ie(d("input",{"onUpdate:modelValue":y=>_.kdvHaric=y,type:"number",class:"input input-sm"},null,8,Sk),[[fe,_.kdvHaric,void 0,{number:!0}]])]),d("td",null,K(u(_.kdvHaric*1.2)),1)]))),128))])])]),d("div",Ck,[d("button",{class:"btn btn-outline",onClick:g[3]||(g[3]=_=>p.$emit("close"))},"Kapat"),d("button",{class:"btn btn-primary",onClick:f},"Kaydet")])])]))}},kk={class:"p-4 max-w-5xl mx-auto space-y-6"},xk={class:"flex gap-4 justify-center"},Vk={class:"flex flex-wrap gap-4 items-center mt-4"},Dk=["disabled"],Nk=["disabled"],Ok={class:"overflow-x-auto mt-6"},Mk={class:"table table-zebra w-full border text-sm text-white dark:bg-gray-800 dark:text-gray-100"},Lk={key:0},Uk={key:1},Fk={key:2},$k={class:"text-right font-semibold text-blue-300"},Bk={class:"dropdown dropdown-end"},jk={tabindex:"0",class:"dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32"},qk=["onClick"],Hk=["onClick"],Kk=["open"],zk={class:"modal-box"},Gk={class:"form-control mb-2"},Wk={class:"form-control mb-4"},Qk={class:"modal-action"},Yk={__name:"Utilities",setup(t){const e=G(!1),n=G(!1),s=G(!1),r=G(!1),i=G(!1),o=G([]),l=G(""),u=G(""),c=G("all"),f=We(()=>o.value.filter(x=>{var S;const M=(S=x.tenantName)==null?void 0:S.toLowerCase().includes(l.value.toLowerCase()),W=u.value===""||x.period===u.value,le=c.value==="all"||x.type===c.value;return M&&W&&le})),p=x=>x==null||isNaN(x)?"-":x.toLocaleString("tr-TR",{style:"currency",currency:"TRY"}),g=async()=>{o.value=[];const x=await qe(Re(he,"tenants")),M={};x.forEach(le=>{const S=le.data();M[le.id]=S.company}),(await qe(Re(he,"readings"))).forEach(le=>{const S=le.data(),w=S.tenantId==="ortak"?"Ortak Alan":S.tenantId==="mescit"?"Mescit":M[S.tenantId]||"-";o.value.push({id:le.id,...S,tenantName:w})})},_=async()=>{if(!u.value||c.value==="all"){alert("Lütfen dönem ve gider tipini seçiniz.");return}const x=hn(Re(he,"readings"),Rt("period","==",u.value),Rt("type","==",c.value),Rt("tenantId","in",["ortak","mescit"])),M=await qe(x);let W=0;M.forEach(I=>{W+=Number(I.data().toplamTutar||0)});const le=await qe(Re(he,"tenants")),S=[];le.forEach(I=>{const P=I.data();P.units&&Array.isArray(P.units)&&P.units.forEach(V=>{S.push({tenantId:I.id,tenantName:P.company,unit:V})})});const w=W/S.length;for(const I of S)await Pn(Re(he,"readings"),{tenantId:I.tenantId,tenantName:I.tenantName,unit:I.unit,period:u.value,type:c.value,consumption:null,kdvHaric:null,toplamTutar:w.toFixed(2)});alert("Paylaştırma tamamlandı."),i.value=!1,g()},b=()=>{e.value=!1,n.value=!1,s.value=!1,g()},y=async()=>{if(!u.value)return;const x=hn(Re(he,"readings"),Rt("period","==",u.value)),M=await qe(x);await Promise.all(M.docs.map(W=>Qs(lt(he,"readings",W.id)))),alert("Kayıtlar silindi."),g()},E=async x=>{confirm("Bu kaydı silmek istediğinizden emin misiniz?")&&(await Qs(lt(he,"readings",x)),o.value=o.value.filter(M=>M.id!==x))},k=x=>{alert(`Düzenleme işlemi için kayıt: ${x.unit||"-"} (${x.period})`)},C=()=>{if(!u.value){alert("Lütfen önce dönem seçiniz.");return}r.value=!0};return Ft(g),(x,M)=>(z(),Y("section",kk,[M[19]||(M[19]=d("h2",{class:"text-2xl font-bold text-center text-white dark:bg-gray-900 dark:text-white"},"Sayaç Kayıtları",-1)),d("div",xk,[d("button",{class:"btn btn-primary",onClick:M[0]||(M[0]=W=>e.value=!0)},"⚡ Elektrik Girişi"),d("button",{class:"btn btn-secondary",onClick:M[1]||(M[1]=W=>n.value=!0)},"💧 Su Girişi"),d("button",{class:"btn btn-primary mb-4",onClick:M[2]||(M[2]=W=>s.value=!0)},"💰 Aidat Girişi")]),d("div",Vk,[ie(d("input",{"onUpdate:modelValue":M[3]||(M[3]=W=>l.value=W),type:"text",placeholder:"Şirket Ara...",class:"input input-bordered w-48"},null,512),[[fe,l.value]]),ie(d("input",{"onUpdate:modelValue":M[4]||(M[4]=W=>u.value=W),type:"month",class:"input input-bordered w-40"},null,512),[[fe,u.value]]),ie(d("select",{"onUpdate:modelValue":M[5]||(M[5]=W=>c.value=W),class:"select select-bordered w-40"},M[12]||(M[12]=[d("option",{value:"all"},"Tümü",-1),d("option",{value:"electricity"},"Elektrik",-1),d("option",{value:"water"},"Su",-1),d("option",{value:"aidat"},"Aidat",-1)]),512),[[cn,c.value]]),d("button",{class:"btn btn-error btn-sm",onClick:y,disabled:!u.value},"Seçilen Dönemi Sil",8,Dk),d("button",{class:"btn btn-outline btn-sm",onClick:C,disabled:!u.value},"Elektrik Kayıtlarını Düzenle",8,Nk),d("button",{onClick:M[6]||(M[6]=W=>i.value=!0),class:"btn btn-warning"},"⚡ Ortak Gider Paylaştır")]),d("div",Ok,[d("table",Mk,[M[14]||(M[14]=d("thead",null,[d("tr",null,[d("th",null,"Dönem"),d("th",null,"Kat"),d("th",null,"Şirket"),d("th",null,"Tip"),d("th",null,"Tüketim"),d("th",null,"KDV Hariç"),d("th",null,"Toplam (₺)"),d("th",null,"İşlem")])],-1)),d("tbody",null,[(z(!0),Y(Ve,null,Qe(f.value,W=>(z(),Y("tr",{key:W.id},[d("td",null,K(W.period),1),d("td",null,K(W.unit||"-"),1),d("td",null,[W.tenantId==="ortak"?(z(),Y("span",Lk,"Ortak Alan")):W.tenantId==="mescit"?(z(),Y("span",Uk,"Mescit")):(z(),Y("span",Fk,K(W.tenantName||"-"),1))]),d("td",null,[d("span",{class:Jt({"text-yellow-600 dark:text-yellow-400":W.type==="electricity","text-blue-600 dark:text-blue-400":W.type==="water","text-green-600 dark:text-green-400":W.type==="aidat"})},K(W.type==="electricity"?"Elektrik":W.type==="water"?"Su":"Aidat"),3)]),d("td",null,K(W.consumption??W.usage??"-"),1),d("td",null,K(p(W.kdvHaric)),1),d("td",$k,K(p(W.toplamTutar??W.amount)),1),d("td",null,[d("div",Bk,[M[13]||(M[13]=d("label",{tabindex:"0",class:"btn btn-xs btn-outline"},"İşlemler",-1)),d("ul",jk,[d("li",null,[d("a",{onClick:st(le=>k(W),["prevent"])},"Düzenle",8,qk)]),d("li",null,[d("a",{onClick:st(le=>E(W.id),["prevent"])},"Sil",8,Hk)])])])])]))),128))])])]),e.value?(z(),rn(KP,{key:0,onClose:b})):tt("",!0),n.value?(z(),rn(uk,{key:1,onClose:b})):tt("",!0),s.value?(z(),rn(mk,{key:2,onClose:M[7]||(M[7]=()=>s.value=!1),onRefresh:g})):tt("",!0),r.value?(z(),rn(Pk,{key:3,period:u.value,onClose:M[8]||(M[8]=()=>r.value=!1),onUpdated:g},null,8,["period"])):tt("",!0),d("dialog",{id:"distributeModal",class:"modal",open:i.value},[d("div",zk,[M[18]||(M[18]=d("h3",{class:"font-bold text-lg mb-4"},"Ortak Gider Paylaştır",-1)),d("div",Gk,[M[15]||(M[15]=d("label",{class:"label"},"Dönem",-1)),ie(d("input",{type:"month","onUpdate:modelValue":M[9]||(M[9]=W=>u.value=W),class:"input input-bordered"},null,512),[[fe,u.value]])]),d("div",Wk,[M[17]||(M[17]=d("label",{class:"label"},"Gider Tipi",-1)),ie(d("select",{"onUpdate:modelValue":M[10]||(M[10]=W=>c.value=W),class:"select select-bordered"},M[16]||(M[16]=[d("option",{value:"electricity"},"Elektrik",-1),d("option",{value:"water"},"Su",-1)]),512),[[cn,c.value]])]),d("div",Qk,[d("button",{onClick:_,class:"btn btn-success"},"Paylaştır"),d("button",{onClick:M[11]||(M[11]=W=>i.value=!1),class:"btn"},"Kapat")])])],8,Kk)]))}},Jk={class:"min-h-screen bg-base-200 dark:bg-gray-900 py-10"},Xk={class:"max-w-4xl mx-auto bg-base-100 dark:bg-gray-800 shadow-lg rounded-xl p-6 space-y-8 text-white dark:text-gray-100"},Zk={class:"text-2xl font-bold text-center"},ex={key:0},tx={class:"grid grid-cols-1 md:grid-cols-2 gap-4"},nx={class:"card bg-base-100 dark:bg-gray-700 border border-base-300 p-4 space-y-2 shadow-md"},sx={class:"card bg-base-100 dark:bg-gray-700 border border-base-300 p-4 space-y-2 shadow-md"},rx={key:0,class:"overflow-x-auto"},ix={class:"table table-sm w-full border"},ox={key:1,class:"text-gray-400 italic"},ax={key:0,class:"overflow-x-auto"},lx={class:"table table-sm w-full border"},ux={key:1,class:"text-gray-400 italic"},cx={key:1,class:"text-center text-gray-400"},hx={__name:"TenantDetailPage",setup(t){const n=Om().params.id,s=G(null),r=G([]),i=G([]),o=G(0),l=G(0),u=We(()=>l.value-o.value),c=We(()=>[...r.value].sort((b,y)=>new Date(b.date)-new Date(y.date))),f=We(()=>[...i.value].sort((b,y)=>new Date(b.period)-new Date(y.period))),p=async()=>{const b=lt(he,"tenants",n),y=await ol(b);y.exists()&&(s.value=y.data())},g=async()=>{const b=hn(Re(he,"payments"),Rt("tenantId","==",n)),y=await qe(b);r.value=y.docs.map(E=>E.data()),o.value=r.value.reduce((E,k)=>E+(k.amount||0),0)},_=async()=>{const b=hn(Re(he,"readings"),Rt("tenantId","==",n)),y=await qe(b);i.value=y.docs.map(E=>E.data()),l.value=i.value.reduce((E,k)=>E+(Number(k.toplamTutar)||0),0)};return Ft(()=>{p(),g(),_()}),(b,y)=>{var E;return z(),Y("div",Jk,[d("div",Xk,[d("h1",Zk,K((E=s.value)==null?void 0:E.company)+" – Kiracı Detayları",1),s.value?(z(),Y("div",ex,[d("div",tx,[d("div",nx,[d("p",null,[y[0]||(y[0]=d("strong",null,"👤 Ad Soyad:",-1)),ft(" "+K(s.value.firstName)+" "+K(s.value.lastName),1)]),d("p",null,[y[1]||(y[1]=d("strong",null,"📞 Telefon:",-1)),ft(" "+K(s.value.phone),1)]),d("p",null,[y[2]||(y[2]=d("strong",null,"✉️ E-posta:",-1)),ft(" "+K(s.value.email),1)]),d("p",null,[y[3]||(y[3]=d("strong",null,"🏢 Kat:",-1)),ft(" "+K(Array.isArray(s.value.units)?s.value.units.join(", "):s.value.unit),1)])]),d("div",sx,[d("p",null,[y[4]||(y[4]=d("strong",{class:"text-green-500"},"💰 Toplam Ödeme:",-1)),ft(" "+K(o.value.toLocaleString("tr-TR"))+" ₺",1)]),d("p",null,[y[5]||(y[5]=d("strong",{class:"text-red-500"},"📉 Toplam Borç:",-1)),ft(" "+K(l.value.toLocaleString("tr-TR"))+" ₺",1)]),d("p",null,[y[6]||(y[6]=d("strong",{class:"text-blue-400"},"🧾 Bakiye:",-1)),ft(" "+K(u.value.toLocaleString("tr-TR"))+" ₺",1)])])]),d("div",null,[y[8]||(y[8]=d("h3",{class:"text-lg font-semibold mt-6 mb-2"},"🕑 Ödeme Geçmişi",-1)),r.value.length?(z(),Y("div",rx,[d("table",ix,[y[7]||(y[7]=d("thead",null,[d("tr",null,[d("th",null,"Dönem"),d("th",null,"Tutar (₺)"),d("th",null,"Tip")])],-1)),d("tbody",null,[(z(!0),Y(Ve,null,Qe(c.value,(k,C)=>(z(),Y("tr",{key:C},[d("td",null,K(k.date),1),d("td",null,K(k.amount.toLocaleString("tr-TR")),1),d("td",null,K(k.type),1)]))),128))])])])):(z(),Y("p",ox,"Ödeme bulunmuyor."))]),d("div",null,[y[10]||(y[10]=d("h3",{class:"text-lg font-semibold mt-6 mb-2"},"💸 Gider Geçmişi",-1)),i.value.length?(z(),Y("div",ax,[d("table",lx,[y[9]||(y[9]=d("thead",null,[d("tr",null,[d("th",null,"Dönem"),d("th",null,"Tutar (₺)"),d("th",null,"Tip"),d("th",null,"Son Ödeme")])],-1)),d("tbody",null,[(z(!0),Y(Ve,null,Qe(f.value,(k,C)=>(z(),Y("tr",{key:C},[d("td",null,K(k.period||"-"),1),d("td",null,K(k.toplamTutar!=null?k.toplamTutar.toLocaleString("tr-TR"):"-"),1),d("td",null,[d("span",{class:Jt({"text-yellow-400":k.type==="electricity","text-blue-400":k.type==="water","text-green-400":k.type==="aidat"})},K(k.type==="electricity"?"Elektrik":k.type==="water"?"Su":"Aidat"),3)]),d("td",null,K(k.dueDate||"-"),1)]))),128))])])])):(z(),Y("p",ux,"Sayaç verisi bulunmuyor."))])])):(z(),Y("div",cx,"Kiracı bilgisi yükleniyor..."))])])}}},dx={class:"max-w-3xl mx-auto p-6 space-y-6"},fx={class:"grid grid-cols-1 md:grid-cols-5 gap-4"},px=["value"],mx=["disabled"],gx=["value"],_x=["value"],yx=["value"],vx={key:0,class:"overflow-x-auto mt-6"},bx={class:"table w-full table-zebra text-sm"},Ex={class:"text-right text-green-700 font-semibold"},wx={class:"text-center"},Tx={class:"dropdown dropdown-end"},Ix={tabindex:"0",class:"dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 z-10"},Ax=["onClick"],Rx=["onClick"],Sx={__name:"AidatPanel",setup(t){const e=G([]),n=G(""),s=G(""),r=G(new Date().getFullYear()),i=G(""),o=G([]),l=G(null),u=k=>parseFloat(k).toLocaleString("tr-TR",{minimumFractionDigits:2})+" ₺",c=()=>{const k=i.value.replace(/\./g,"").replace(",",".");return parseFloat(k)||0},f=We(()=>(c()*1.2).toLocaleString("tr-TR",{minimumFractionDigits:2})+" ₺"),p=k=>{let C=k.target.value.replace(/\D/g,"");i.value=new Intl.NumberFormat("tr-TR").format(Number(C))},g=We(()=>{const k=e.value.find(C=>C.id===n.value);return k?k.units||[]:[]}),_=async()=>{o.value=[],(await qe(Re(he,"annualDues"))).forEach(C=>{const x=C.data(),M=e.value.find(W=>W.id===x.tenantId);M&&o.value.push({id:C.id,year:x.year,amount:x.amount,vatIncludedAmount:x.vatIncludedAmount,unit:x.unit,company:M.company,tenantId:x.tenantId})})},b=async k=>{confirm("Bu aidat kaydını silmek istiyor musunuz?")&&(await Qs(lt(he,"annualDues",k)),await _())},y=k=>{n.value=k.tenantId,s.value=k.unit,i.value=new Intl.NumberFormat("tr-TR").format(k.amount),r.value=k.year,l.value=k.id},E=async()=>{const k=c();if(!n.value||!s.value||k<=0||r.value<2020){alert("Lütfen tüm alanları eksiksiz doldurun.");return}const C=parseFloat((k*1.2).toFixed(2));if(l.value){const x=lt(he,"annualDues",l.value);await py(x,{tenantId:n.value,unit:s.value,year:r.value,amount:k,vatIncludedAmount:C}),alert("Aidat güncellendi.")}else{if(o.value.find(M=>M.year===r.value&&M.tenantId===n.value&&M.unit===s.value)){alert("Bu şirketin bu katı için bu yıl zaten aidat tanımlanmış.");return}await Pn(Re(he,"annualDues"),{tenantId:n.value,unit:s.value,year:r.value,amount:k,vatIncludedAmount:C}),alert("Aidat kaydı eklendi.")}n.value="",s.value="",i.value="",l.value=null,await _()};return Ft(async()=>{const k=await qe(Re(he,"tenants"));e.value=k.docs.map(C=>({id:C.id,...C.data()})),_()}),(k,C)=>(z(),Y("section",dx,[C[14]||(C[14]=d("h2",{class:"text-xl font-bold text-center"},"Yıllık Aidat Tutarı Tanımlama",-1)),d("form",{onSubmit:st(E,["prevent"]),class:"space-y-4 bg-base-100 p-4 rounded-xl shadow"},[d("div",fx,[d("div",null,[C[3]||(C[3]=d("label",{class:"label"},"Yıl",-1)),ie(d("input",{type:"number","onUpdate:modelValue":C[0]||(C[0]=x=>r.value=x),class:"input input-bordered w-full",min:"2020"},null,512),[[fe,r.value,void 0,{number:!0}]])]),d("div",null,[C[5]||(C[5]=d("label",{class:"label"},"Şirket",-1)),ie(d("select",{"onUpdate:modelValue":C[1]||(C[1]=x=>n.value=x),class:"select select-bordered w-full"},[C[4]||(C[4]=d("option",{disabled:"",value:""},"Seçiniz",-1)),(z(!0),Y(Ve,null,Qe(e.value,x=>(z(),Y("option",{key:x.id,value:x.id},K(x.company),9,px))),128))],512),[[cn,n.value]])]),d("div",null,[C[7]||(C[7]=d("label",{class:"label"},"Kat",-1)),ie(d("select",{"onUpdate:modelValue":C[2]||(C[2]=x=>s.value=x),class:"select select-bordered w-full",disabled:!n.value},[C[6]||(C[6]=d("option",{disabled:"",value:""},"Seçiniz",-1)),(z(!0),Y(Ve,null,Qe(g.value,x=>(z(),Y("option",{key:x,value:x},K(x),9,gx))),128))],8,mx),[[cn,s.value]])]),d("div",null,[C[8]||(C[8]=d("label",{class:"label"},"Aidat (KDV Hariç)",-1)),d("input",{value:i.value,onInput:p,class:"input input-bordered w-full",inputmode:"numeric",placeholder:"Örn: 2.500"},null,40,_x)]),d("div",null,[C[9]||(C[9]=d("label",{class:"label"},"KDV Dahil",-1)),d("input",{value:f.value,class:"input input-bordered w-full bg-base-200",disabled:""},null,8,yx)])]),C[10]||(C[10]=d("div",{class:"flex justify-end"},[d("button",{class:"btn btn-primary",type:"submit"},"Kaydet")],-1))],32),o.value.length?(z(),Y("div",vx,[C[13]||(C[13]=d("h3",{class:"font-semibold mb-2"},"Kayıtlı Aidat Tutarları",-1)),d("table",bx,[C[12]||(C[12]=d("thead",null,[d("tr",null,[d("th",null,"Yıl"),d("th",null,"Şirket"),d("th",null,"Kat"),d("th",null,"KDV Dahil"),d("th",null,"İşlem")])],-1)),d("tbody",null,[(z(!0),Y(Ve,null,Qe(o.value,x=>(z(),Y("tr",{key:x.id},[d("td",null,K(x.year),1),d("td",null,K(x.company),1),d("td",null,K(x.unit),1),d("td",Ex,K(u(x.vatIncludedAmount||x.amount*1.2)),1),d("td",wx,[d("div",Tx,[C[11]||(C[11]=d("label",{tabindex:"0",class:"btn btn-sm btn-outline"},"İşlemler",-1)),d("ul",Ix,[d("li",null,[d("a",{onClick:st(M=>y(x),["prevent"])},"Düzenle",8,Ax)]),d("li",null,[d("a",{onClick:st(M=>b(x.id),["prevent"])},"Sil",8,Rx)])])])])]))),128))])])])):tt("",!0)]))}},Cx={class:"bg-base-200 p-6 rounded-xl"},Px={class:"grid grid-cols-1 md:grid-cols-2 gap-4"},kx={key:0},xx=["value"],Vx={__name:"UserAddPanel",setup(t){const e=G(""),n=G(""),s=G(""),r=G(""),i=G(""),o=G([]);Ft(async()=>{const u=await qe(Re(he,"tenants"));o.value=u.docs.map(c=>({id:c.id,name:c.data().company}))});const l=async()=>{try{const u=Math.random().toString(36).slice(-8),{user:c}=await QI(wa,e.value,u);await py(lt(he,"users",c.uid),{firstName:n.value,lastName:s.value,email:e.value,role:r.value,companyId:r.value==="tenant"?i.value:null}),await uc(wa,e.value),alert("Kullanıcı eklendi. Şifre oluşturma bağlantısı e-posta ile gönderildi."),e.value="",n.value="",s.value="",r.value="",i.value=""}catch(u){alert("Hata: "+u.message)}};return(u,c)=>(z(),Y("div",Cx,[c[10]||(c[10]=d("h2",{class:"text-xl font-bold mb-4"},"Yeni Kullanıcı Ekle",-1)),d("form",{onSubmit:st(l,["prevent"]),class:"space-y-4"},[d("div",Px,[ie(d("input",{"onUpdate:modelValue":c[0]||(c[0]=f=>n.value=f),class:"input input-bordered w-full",placeholder:"Ad",required:""},null,512),[[fe,n.value]]),ie(d("input",{"onUpdate:modelValue":c[1]||(c[1]=f=>s.value=f),class:"input input-bordered w-full",placeholder:"Soyad",required:""},null,512),[[fe,s.value]])]),ie(d("input",{"onUpdate:modelValue":c[2]||(c[2]=f=>e.value=f),class:"input input-bordered w-full",type:"email",placeholder:"E-posta",required:""},null,512),[[fe,e.value]]),d("div",null,[c[6]||(c[6]=d("label",{class:"label"},"Rol",-1)),ie(d("select",{"onUpdate:modelValue":c[3]||(c[3]=f=>r.value=f),class:"select select-bordered w-full",required:""},c[5]||(c[5]=[d("option",{disabled:"",value:""},"Rol Seçin",-1),d("option",{value:"admin"},"Admin",-1),d("option",{value:"manager"},"Yönetici",-1),d("option",{value:"tenant"},"Kiracı",-1)]),512),[[cn,r.value]])]),r.value==="tenant"?(z(),Y("div",kx,[c[8]||(c[8]=d("label",{class:"label"},"Firma",-1)),ie(d("select",{"onUpdate:modelValue":c[4]||(c[4]=f=>i.value=f),class:"select select-bordered w-full",required:""},[c[7]||(c[7]=d("option",{disabled:"",value:""},"Firma Seçin",-1)),(z(!0),Y(Ve,null,Qe(o.value,f=>(z(),Y("option",{key:f.id,value:f.id},K(f.name),9,xx))),128))],512),[[cn,i.value]])])):tt("",!0),c[9]||(c[9]=d("button",{class:"btn btn-primary w-full"},"Kaydet",-1))],32)]))}},Dx={class:"bg-base-200 p-6 rounded-xl"},Nx={class:"table w-full"},Ox=["onClick"],Mx={__name:"UserListPanel",setup(t){const e=G([]),n=G([]),s=G("");Ft(async()=>{await r(),await i()});const r=async()=>{const c=await qe(Re(he,"companies"));e.value=c.docs.map(f=>({id:f.id,...f.data()}))},i=async()=>{const c=await qe(Re(he,"users"));n.value=c.docs.map(f=>({id:f.id,...f.data()}))},o=async c=>{confirm("Kullanıcıyı silmek istediğinize emin misiniz?")&&(await Qs(lt(he,"users",c)),await i())},l=c=>{const f=e.value.find(p=>p.id===c);return f?f.name:"-"},u=We(()=>{const c=s.value.toLowerCase();return n.value.filter(f=>(f.firstName||"").toLowerCase().includes(c)||(f.lastName||"").toLowerCase().includes(c)||(f.email||"").toLowerCase().includes(c))});return(c,f)=>(z(),Y("div",Dx,[f[2]||(f[2]=d("h2",{class:"text-xl font-bold mb-4"},"Kullanıcılar",-1)),ie(d("input",{"onUpdate:modelValue":f[0]||(f[0]=p=>s.value=p),class:"input input-bordered mb-4 w-full",placeholder:"Ad, soyad veya e-posta ile ara"},null,512),[[fe,s.value]]),d("table",Nx,[f[1]||(f[1]=d("thead",null,[d("tr",null,[d("th",null,"Ad Soyad"),d("th",null,"E-posta"),d("th",null,"Rol"),d("th",null,"Firma"),d("th",null,"İşlem")])],-1)),d("tbody",null,[(z(!0),Y(Ve,null,Qe(u.value,p=>(z(),Y("tr",{key:p.id},[d("td",null,K(p.firstName)+" "+K(p.lastName),1),d("td",null,K(p.email),1),d("td",null,K(p.role),1),d("td",null,K(l(p.companyId)),1),d("td",null,[d("button",{onClick:g=>o(p.id),class:"btn btn-sm btn-error"},"Sil",8,Ox)])]))),128))])])]))}},Lx={class:"max-w-5xl mx-auto p-6 space-y-6"},Ux={class:"flex justify-center gap-4 mb-6 flex-wrap"},Fx=["onClick"],$x={__name:"AdminDashboard",setup(t){const e=G("dues"),n=[{key:"dues",label:"Aidat Tanımlama",icon:"📆"},{key:"addUser",label:"Kullanıcı Ekle",icon:"➕"},{key:"userList",label:"Kullanıcı Listesi",icon:"👥"}];return(s,r)=>(z(),Y("section",Lx,[d("div",Ux,[(z(),Y(Ve,null,Qe(n,i=>d("button",{key:i.key,onClick:o=>e.value=i.key,class:Jt(["btn","btn-md",e.value===i.key?"btn-primary":"btn-outline btn-info"])},K(i.icon)+" "+K(i.label),11,Fx)),64))]),d("div",null,[e.value==="dues"?(z(),rn(Sx,{key:0})):tt("",!0),e.value==="addUser"?(z(),rn(Vx,{key:1})):tt("",!0),e.value==="userList"?(z(),rn(Mx,{key:2})):tt("",!0)])]))}},Bx="/assets/background-DZPRnSrd.png",jx={class:"relative z-10 bg-white p-8 rounded-md shadow-lg w-full max-w-md"},qx={class:"relative"},Hx=["type"],Kx={class:"flex items-center justify-between text-sm mt-2"},zx={class:"flex items-center gap-2 text-gray-800"},Gx={key:0,class:"text-red-500 text-sm text-center"},Wx={key:0,class:"modal",open:""},Qx={class:"modal-box max-w-sm"},Yx={key:0,class:"text-green-600 text-sm text-center mb-2"},Jx={key:1,class:"text-red-500 text-sm text-center mb-2"},Xx={class:"modal-action"},Zx={__name:"LoginView",setup(t){const e=G(""),n=G(""),s=G(""),r=G(!1),i=G(!1),o=G(!1),l=G(""),u=G(""),c=G(""),f=Nm();Ft(()=>{Ba().currentUser&&f.push("/dashboard")});const p=()=>{i.value=!i.value},g=async()=>{if(u.value="",c.value="",!l.value){c.value="Lütfen e-posta adresinizi girin.";return}try{await uc(wa,l.value),u.value="Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",setTimeout(()=>{o.value=!1,l.value="",u.value=""},1500)}catch(b){c.value="Gönderim başarısız: "+(b.message||"Hata oluştu.")}},_=async()=>{try{const{user:b}=await YI(wa,e.value,n.value),y=await ol(lt(he,"users",b.uid));if(!y.exists())throw new Error("Kullanıcı bilgileri eksik.");const E=y.data().role;E==="admin"?f.push("/admin"):E==="manager"?f.push("/dashboard"):f.push("/profile")}catch(b){s.value="Giriş başarısız: "+(b.message||"Bilinmeyen hata.")}};return(b,y)=>(z(),Y("div",{class:"bg-gray-100 min-h-screen flex items-center justify-center relative",style:Sa({backgroundImage:`url(${ln(Bx)})`,backgroundSize:"cover",backgroundPosition:"center"})},[y[13]||(y[13]=d("div",{class:"absolute inset-0 bg-black opacity-50 z-0"},null,-1)),d("div",jx,[y[12]||(y[12]=d("h1",{class:"text-2xl font-bold mb-6 text-center text-gray-800"},"Akyıldız Yönetim Giriş",-1)),d("form",{onSubmit:st(_,["prevent"]),class:"space-y-4 text-gray-800"},[d("div",null,[y[6]||(y[6]=d("label",{class:"block font-semibold mb-1",for:"email"},"Email",-1)),ie(d("input",{"onUpdate:modelValue":y[0]||(y[0]=E=>e.value=E),id:"email",type:"email",placeholder:"ornek@firma.com",class:"bg-white text-gray-800 placeholder-gray-400 appearance-none border rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400",required:""},null,512),[[fe,e.value]])]),d("div",null,[y[7]||(y[7]=d("label",{class:"block font-semibold mb-1",for:"password"},"Şifre",-1)),d("div",qx,[ie(d("input",{"onUpdate:modelValue":y[1]||(y[1]=E=>n.value=E),type:i.value?"text":"password",id:"password",placeholder:"••••••••",class:"bg-white text-gray-800 placeholder-gray-400 appearance-none border rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400",required:""},null,8,Hx),[[tE,n.value]]),d("button",{type:"button",class:"absolute inset-y-0 right-2 px-2 text-sm text-cyan-600",onClick:p},K(i.value?"Gizle":"Göster"),1)])]),d("div",Kx,[d("label",zx,[ie(d("input",{type:"checkbox","onUpdate:modelValue":y[2]||(y[2]=E=>r.value=E),class:"w-5 h-5 accent-cyan-600 border-gray-400 rounded focus:ring-2 focus:ring-cyan-400 transition duration-200"},null,512),[[Tr,r.value]]),y[8]||(y[8]=d("span",null,"Beni Hatırla",-1))]),d("a",{href:"#",onClick:y[3]||(y[3]=st(E=>o.value=!0,["prevent"])),class:"text-cyan-600 hover:text-cyan-800 hover:underline transition"}," Şifremi unuttum? ")]),s.value?(z(),Y("div",Gx,K(s.value),1)):tt("",!0),y[9]||(y[9]=d("button",{type:"submit",class:"bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300 w-full mt-2"}," Giriş Yap ",-1))],32),o.value?(z(),Y("dialog",Wx,[d("div",Qx,[y[10]||(y[10]=d("h3",{class:"text-lg font-bold mb-2"},"Şifre Sıfırlama",-1)),y[11]||(y[11]=d("p",{class:"text-sm text-gray-600 mb-3"},"Kayıtlı e-posta adresinizi girin:",-1)),ie(d("input",{"onUpdate:modelValue":y[4]||(y[4]=E=>l.value=E),type:"email",placeholder:"ornek@firma.com",class:"input input-bordered w-full mb-3"},null,512),[[fe,l.value]]),u.value?(z(),Y("div",Yx,K(u.value),1)):tt("",!0),c.value?(z(),Y("div",Jx,K(c.value),1)):tt("",!0),d("div",Xx,[d("button",{class:"btn btn-primary",onClick:g},"Gönder"),d("button",{class:"btn",onClick:y[5]||(y[5]=E=>o.value=!1)},"Kapat")])])])):tt("",!0)])],4))}},eV=[{path:"/",redirect:"/dashboard"},{path:"/dashboard",name:"Dashboard",component:MS},{path:"/tenants",name:"Tenants",component:$C},{path:"/payments",name:"Payments",component:oP},{path:"/expenses",name:"Expenses",component:CP},{path:"/utilities",name:"Utilities",component:Yk},{path:"/tenant/:id",name:"TenantDetail",component:hx},{path:"/admin",name:"Admin",component:$x,meta:{requiresAdmin:!0}},{path:"/login",name:"Login",component:Zx,meta:{public:!0,hideLayout:!0}}],gy=hw({history:$E(),routes:eV});gy.beforeEach((t,e,n)=>{const s=!t.meta.public,r=t.meta.requiresAdmin,i=bg(Ba(),async o=>{if(i(),!o&&s)return n("/login");if(r){const l=lt(he,"users",o.uid),u=await ol(l);if((u.exists()?u.data().role:null)!=="admin")return n("/dashboard")}return n()})});var tV=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},_y={exports:{}};(function(t,e){(function(n,s){t.exports=s()})(tV,function(){return function(n){function s(i){if(r[i])return r[i].exports;var o=r[i]={i,l:!1,exports:{}};return n[i].call(o.exports,o,o.exports,s),o.l=!0,o.exports}var r={};return s.m=n,s.c=r,s.i=function(i){return i},s.d=function(i,o,l){s.o(i,o)||Object.defineProperty(i,o,{configurable:!1,enumerable:!0,get:l})},s.n=function(i){var o=i&&i.__esModule?function(){return i.default}:function(){return i};return s.d(o,"a",o),o},s.o=function(i,o){return Object.prototype.hasOwnProperty.call(i,o)},s.p=".",s(s.s=10)}([function(n,s){n.exports={"#":{pattern:/\d/},X:{pattern:/[0-9a-zA-Z]/},S:{pattern:/[a-zA-Z]/},A:{pattern:/[a-zA-Z]/,transform:function(r){return r.toLocaleUpperCase()}},a:{pattern:/[a-zA-Z]/,transform:function(r){return r.toLocaleLowerCase()}},"!":{escape:!0}}},function(n,s,r){function i(c){var f=document.createEvent("Event");return f.initEvent(c,!0,!0),f}var o=r(2),l=r(0),u=r.n(l);s.a=function(c,f){var p=f.value;if((Array.isArray(p)||typeof p=="string")&&(p={mask:p,tokens:u.a}),c.tagName.toLocaleUpperCase()!=="INPUT"){var g=c.getElementsByTagName("input");if(g.length!==1)throw new Error("v-mask directive requires 1 input, found "+g.length);c=g[0]}c.oninput=function(b){if(b.isTrusted){var y=c.selectionEnd,E=c.value[y-1];for(c.value=r.i(o.a)(c.value,p.mask,!0,p.tokens);y<c.value.length&&c.value.charAt(y-1)!==E;)y++;c===document.activeElement&&(c.setSelectionRange(y,y),setTimeout(function(){c.setSelectionRange(y,y)},0)),c.dispatchEvent(i("input"))}};var _=r.i(o.a)(c.value,p.mask,!0,p.tokens);_!==c.value&&(c.value=_,c.dispatchEvent(i("input")))}},function(n,s,r){var i=r(6),o=r(5);s.a=function(l,u){var c=!(arguments.length>2&&arguments[2]!==void 0)||arguments[2],f=arguments[3];return Array.isArray(u)?r.i(o.a)(i.a,u,f)(l,u,c,f):r.i(i.a)(l,u,c,f)}},function(n,s,r){function i(g){g.component(f.a.name,f.a),g.directive("mask",u.a)}Object.defineProperty(s,"__esModule",{value:!0});var o=r(0),l=r.n(o),u=r(1),c=r(7),f=r.n(c);r.d(s,"TheMask",function(){return f.a}),r.d(s,"mask",function(){return u.a}),r.d(s,"tokens",function(){return l.a}),r.d(s,"version",function(){return p});var p="0.11.1";s.default=i,typeof window<"u"&&window.Vue&&window.Vue.use(i)},function(n,s,r){Object.defineProperty(s,"__esModule",{value:!0});var i=r(1),o=r(0),l=r.n(o),u=r(2);s.default={name:"TheMask",props:{value:[String,Number],mask:{type:[String,Array],required:!0},masked:{type:Boolean,default:!1},tokens:{type:Object,default:function(){return l.a}}},directives:{mask:i.a},data:function(){return{lastValue:null,display:this.value}},watch:{value:function(c){c!==this.lastValue&&(this.display=c)},masked:function(){this.refresh(this.display)}},computed:{config:function(){return{mask:this.mask,tokens:this.tokens,masked:this.masked}}},methods:{onInput:function(c){c.isTrusted||this.refresh(c.target.value)},refresh:function(f){this.display=f;var f=r.i(u.a)(f,this.mask,this.masked,this.tokens);f!==this.lastValue&&(this.lastValue=f,this.$emit("input",f))}}}},function(n,s,r){function i(o,l,u){return l=l.sort(function(c,f){return c.length-f.length}),function(c,f){for(var p=!(arguments.length>2&&arguments[2]!==void 0)||arguments[2],g=0;g<l.length;){var _=l[g];g++;var b=l[g];if(!(b&&o(c,b,!0,u).length>_.length))return o(c,_,p,u)}return""}}s.a=i},function(n,s,r){function i(o,l){var u=!(arguments.length>2&&arguments[2]!==void 0)||arguments[2],c=arguments[3];o=o||"",l=l||"";for(var f=0,p=0,g="";f<l.length&&p<o.length;){var _=l[f],b=c[_],y=o[p];b&&!b.escape?(b.pattern.test(y)&&(g+=b.transform?b.transform(y):y,f++),p++):(b&&b.escape&&(f++,_=l[f]),u&&(g+=_),y===_&&p++,f++)}for(var E="";f<l.length&&u;){var _=l[f];if(c[_]){E="";break}E+=_,f++}return g+E}s.a=i},function(n,s,r){var i=r(8)(r(4),r(9),null,null);n.exports=i.exports},function(n,s){n.exports=function(r,i,o,l){var u,c=r=r||{},f=typeof r.default;f!=="object"&&f!=="function"||(u=r,c=r.default);var p=typeof c=="function"?c.options:c;if(i&&(p.render=i.render,p.staticRenderFns=i.staticRenderFns),o&&(p._scopeId=o),l){var g=p.computed||(p.computed={});Object.keys(l).forEach(function(_){var b=l[_];g[_]=function(){return b}})}return{esModule:u,exports:c,options:p}}},function(n,s){n.exports={render:function(){var r=this,i=r.$createElement;return(r._self._c||i)("input",{directives:[{name:"mask",rawName:"v-mask",value:r.config,expression:"config"}],attrs:{type:"text"},domProps:{value:r.display},on:{input:r.onInput}})},staticRenderFns:[]}},function(n,s,r){n.exports=r(3)}])})})(_y);var nV=_y.exports;const Qc=aE(NS);Qc.use(gy);Qc.directive("mask",nV.mask);Qc.mount("#app");
