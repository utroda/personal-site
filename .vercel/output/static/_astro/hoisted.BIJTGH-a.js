import{_ as n}from"./astro/assets-service.DcMRmNXG.js";function h(e,t){e.classList.toggle(t)}function a(){return document.documentElement.getAttribute("data-theme")==="dark"}typeof process<"u"&&process.stdout&&process.stdout.isTTY;const{replace:y}="",_=/[&<>'"]/g,E={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"},T=e=>E[e],L=e=>y.call(e,_,T);function H(e){return!!e&&typeof e=="object"&&typeof e.then=="function"}async function*k(e){const t=e.getReader();try{for(;;){const{done:o,value:i}=await t.read();if(o)return;yield i}}finally{t.releaseLock()}}const P=L;class p extends Uint8Array{}Object.defineProperty(p.prototype,Symbol.toStringTag,{get(){return"HTMLBytes"}});class d extends String{get[Symbol.toStringTag](){return"HTMLString"}}const R=e=>e instanceof d?e:typeof e=="string"?new d(e):e;function x(e){return Object.prototype.toString.call(e)==="[object HTMLString]"}function M(e){return new p(e)}function f(e){return typeof e.getReader=="function"}async function*m(e){if(f(e))for await(const t of k(e))yield r(t);else for await(const t of e)yield r(t)}function*v(e){for(const t of e)yield r(t)}function r(e){if(e&&typeof e=="object"){if(e instanceof Uint8Array)return M(e);if(e instanceof Response&&e.body){const t=e.body;return m(t)}else{if(typeof e.then=="function")return Promise.resolve(e).then(t=>r(t));if(Symbol.iterator in e)return v(e);if(Symbol.asyncIterator in e||f(e))return m(e)}}return R(e)}new TextEncoder;new TextDecoder;function C(e){return!!e&&typeof e=="object"&&"render"in e&&typeof e.render=="function"}function s({globResult:e,contentDir:t}){const o={};for(const i in e){const u=i.replace(new RegExp(`^${t}`),"").split("/");if(u.length<=1)continue;const l=u[0];o[l]??={},o[l][i]=e[i]}return o}const c="/src/content/",g=Object.assign({"/src/content/post/adding-unit-tests-to-our-accordion.md":()=>n(()=>import("./adding-unit-tests-to-our-accordion.DfVxLzCy.js"),__vite__mapDeps([])),"/src/content/post/building-an-accessible-accordion-component-vue.md":()=>n(()=>import("./building-an-accessible-accordion-component-vue.C9tKs0yW.js"),__vite__mapDeps([])),"/src/content/post/markdown-elements/index.md":()=>n(()=>import("./index.Bo73Uhwt.js"),__vite__mapDeps([])),"/src/content/post/setting-up-docker-node-vue-vite.md":()=>n(()=>import("./setting-up-docker-node-vue-vite.D5OTTta_.js"),__vite__mapDeps([]))});s({globResult:g,contentDir:c});const b=Object.assign({});s({globResult:b,contentDir:c});s({globResult:{...g,...b},contentDir:c});const A=Object.assign({"/src/content/post/adding-unit-tests-to-our-accordion.md":()=>n(()=>import("./adding-unit-tests-to-our-accordion.DMZ4D97K.js"),__vite__mapDeps([0,1])),"/src/content/post/building-an-accessible-accordion-component-vue.md":()=>n(()=>import("./building-an-accessible-accordion-component-vue.BQXZxJY4.js"),__vite__mapDeps([2,1])),"/src/content/post/markdown-elements/index.md":()=>n(()=>import("./index.BmHMpYKM.js"),__vite__mapDeps([3,1])),"/src/content/post/setting-up-docker-node-vue-vite.md":()=>n(()=>import("./setting-up-docker-node-vue-vite.CTDQknjq.js"),__vite__mapDeps([4,1]))});s({globResult:A,contentDir:c});const O="https://outwest.dev/";new URL(O).hostname;class S extends HTMLElement{headerEl;menuOpen;mobileButtonEl;toggleMobileMenu=()=>{h(this.headerEl,"menu-open"),this.menuOpen=!this.menuOpen,this.mobileButtonEl.setAttribute("aria-expanded",this.menuOpen.toString())};constructor(){super(),this.headerEl=document.getElementById("main-header"),this.mobileButtonEl=this.querySelector("button"),this.menuOpen=!1,this.mobileButtonEl.addEventListener("click",this.toggleMobileMenu)}}customElements.define("mobile-button",S);class w extends HTMLElement{#e;connectedCallback(){const t=this.querySelector("button");t.setAttribute("role","switch"),t.setAttribute("aria-checked",String(a()));const{signal:o}=this.#e=new AbortController;t.addEventListener("click",()=>{let i=new CustomEvent("theme-change",{detail:{theme:a()?"light":"dark"}});document.dispatchEvent(i),t.setAttribute("aria-checked",String(a()))},{signal:o})}disconnectedCallback(){this.#e?.abort()}}customElements.define("theme-toggle",w);export{d as H,C as a,H as b,P as e,x as i,R as m,r as u};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["_astro/adding-unit-tests-to-our-accordion.DMZ4D97K.js","_astro/astro/assets-service.DcMRmNXG.js","_astro/building-an-accessible-accordion-component-vue.BQXZxJY4.js","_astro/index.BmHMpYKM.js","_astro/setting-up-docker-node-vue-vite.CTDQknjq.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
