import{_ as o}from"./astro/assets-service.DcMRmNXG.js";function y(e,t){e.classList.toggle(t)}function a(){return document.documentElement.getAttribute("data-theme")==="dark"}typeof process<"u"&&process.stdout&&process.stdout.isTTY;const{replace:b}="",_=/[&<>'"]/g,E={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"},w=e=>E[e],k=e=>b.call(e,_,w);function D(e){return!!e&&typeof e=="object"&&typeof e.then=="function"}async function*L(e){const t=e.getReader();try{for(;;){const{done:n,value:i}=await t.read();if(n)return;yield i}}finally{t.releaseLock()}}const P=k;class p extends Uint8Array{}Object.defineProperty(p.prototype,Symbol.toStringTag,{get(){return"HTMLBytes"}});class u extends String{get[Symbol.toStringTag](){return"HTMLString"}}const T=e=>e instanceof u?e:typeof e=="string"?new u(e):e;function H(e){return Object.prototype.toString.call(e)==="[object HTMLString]"}function M(e){return new p(e)}function h(e){return typeof e.getReader=="function"}async function*m(e){if(h(e))for await(const t of L(e))yield s(t);else for await(const t of e)yield s(t)}function*v(e){for(const t of e)yield s(t)}function s(e){if(e&&typeof e=="object"){if(e instanceof Uint8Array)return M(e);if(e instanceof Response&&e.body){const t=e.body;return m(t)}else{if(typeof e.then=="function")return Promise.resolve(e).then(t=>s(t));if(Symbol.iterator in e)return v(e);if(Symbol.asyncIterator in e||h(e))return m(e)}}return T(e)}new TextEncoder;new TextDecoder;function x(e){return!!e&&typeof e=="object"&&"render"in e&&typeof e.render=="function"}function c({globResult:e,contentDir:t}){const n={};for(const i in e){const l=i.replace(new RegExp(`^${t}`),"").split("/");if(l.length<=1)continue;const d=l[0];n[d]??={},n[d][i]=e[i]}return n}const r="/src/content/",g=Object.assign({"/src/content/post/adding-unit-tests-to-our-accordion.md":()=>o(()=>import("./adding-unit-tests-to-our-accordion.DfVxLzCy.js"),__vite__mapDeps([])),"/src/content/post/building-an-accessible-accordion-component-vue.md":()=>o(()=>import("./building-an-accessible-accordion-component-vue.C9tKs0yW.js"),__vite__mapDeps([])),"/src/content/post/markdown-elements/index.md":()=>o(()=>import("./index.Bo73Uhwt.js"),__vite__mapDeps([])),"/src/content/post/setting-up-docker-node-vue-vite.md":()=>o(()=>import("./setting-up-docker-node-vue-vite.D5OTTta_.js"),__vite__mapDeps([]))});c({globResult:g,contentDir:r});const f=Object.assign({});c({globResult:f,contentDir:r});c({globResult:{...g,...f},contentDir:r});const S=Object.assign({"/src/content/post/adding-unit-tests-to-our-accordion.md":()=>o(()=>import("./adding-unit-tests-to-our-accordion.YPoaDUD8.js"),__vite__mapDeps([0,1])),"/src/content/post/building-an-accessible-accordion-component-vue.md":()=>o(()=>import("./building-an-accessible-accordion-component-vue.ChpSPowA.js"),__vite__mapDeps([2,1])),"/src/content/post/markdown-elements/index.md":()=>o(()=>import("./index.DPWGhdrq.js"),__vite__mapDeps([3,1])),"/src/content/post/setting-up-docker-node-vue-vite.md":()=>o(()=>import("./setting-up-docker-node-vue-vite.jpHTSbd8.js"),__vite__mapDeps([4,1]))});c({globResult:S,contentDir:r});const R="https://astro-cactus.chriswilliams.dev/";new URL(R).hostname;class A extends HTMLElement{headerEl;menuOpen;mobileButtonEl;toggleMobileMenu=()=>{y(this.headerEl,"menu-open"),this.menuOpen=!this.menuOpen,this.mobileButtonEl.setAttribute("aria-expanded",this.menuOpen.toString())};constructor(){super(),this.headerEl=document.getElementById("main-header"),this.mobileButtonEl=this.querySelector("button"),this.menuOpen=!1,this.mobileButtonEl.addEventListener("click",this.toggleMobileMenu)}}customElements.define("mobile-button",A);class I extends HTMLElement{closeBtn;dialog;dialogFrame;openBtn;closeModal=()=>{this.dialog.open&&(this.dialog.close(),window.removeEventListener("click",this.onWindowClick))};onWindowClick=t=>{("href"in(t.target||{})||document.body.contains(t.target)&&!this.dialogFrame.contains(t.target))&&this.closeModal()};onWindowKeydown=t=>{t.key==="/"&&!this.dialog.open&&(this.openModal(),t.preventDefault())};openModal=t=>{this.dialog.showModal(),this.querySelector("input")?.focus(),t?.stopPropagation(),window.addEventListener("click",this.onWindowClick)};constructor(){super(),this.openBtn=this.querySelector("button[data-open-modal]"),this.closeBtn=this.querySelector("button[data-close-modal]"),this.dialog=this.querySelector("dialog"),this.dialogFrame=this.querySelector(".dialog-frame"),this.openBtn.addEventListener("click",this.openModal),this.openBtn.disabled=!1,this.closeBtn.addEventListener("click",this.closeModal)}connectedCallback(){window.addEventListener("keydown",this.onWindowKeydown),(window.requestIdleCallback||(n=>setTimeout(n,1)))(async()=>{const{PagefindUI:n}=await o(()=>import("./ui-core.SMyfw7mc.js"),__vite__mapDeps([5,1]));new n({baseUrl:"/",bundlePath:"/".replace(/\/$/,"")+"/pagefind/",element:"#cactus__search",showImages:!1,showSubResults:!0})})}disconnectedCallback(){window.removeEventListener("keydown",this.onWindowKeydown)}}customElements.define("site-search",I);class O extends HTMLElement{#e;connectedCallback(){const t=this.querySelector("button");t.setAttribute("role","switch"),t.setAttribute("aria-checked",String(a()));const{signal:n}=this.#e=new AbortController;t.addEventListener("click",()=>{let i=new CustomEvent("theme-change",{detail:{theme:a()?"light":"dark"}});document.dispatchEvent(i),t.setAttribute("aria-checked",String(a()))},{signal:n})}disconnectedCallback(){this.#e?.abort()}}customElements.define("theme-toggle",O);export{u as H,x as a,D as b,P as e,H as i,T as m,s as u};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["_astro/adding-unit-tests-to-our-accordion.YPoaDUD8.js","_astro/astro/assets-service.DcMRmNXG.js","_astro/building-an-accessible-accordion-component-vue.ChpSPowA.js","_astro/index.DPWGhdrq.js","_astro/setting-up-docker-node-vue-vite.jpHTSbd8.js","_astro/ui-core.SMyfw7mc.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}