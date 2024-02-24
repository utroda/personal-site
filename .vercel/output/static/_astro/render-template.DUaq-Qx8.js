import{A as g,g as u}from"./astro/assets-service.DcMRmNXG.js";import{m as a,H as m,i as d,e as $,a as S,b as A}from"./hoisted.DlncgKtM.js";function R(t){return!(t.length!==3||!t[0]||typeof t[0]!="object")}function p(t,e,r){const n=e?.split("/").pop()?.replace(".astro","")??"",s=(...o)=>{if(!R(o))throw new g({...u,message:u.message(n)});return t(...o)};return Object.defineProperty(s,"name",{value:n,writable:!1}),s.isAstroComponentFactory=!0,s.moduleId=e,s.propagation=r,s}function T(t){return p(t.factory,t.moduleId,t.propagation)}function q(t,e,r){return typeof t=="function"?p(t,e,r):T(t)}const C=Symbol.for("astro:render");function I(t){return Object.defineProperty(t,C,{value:!0})}function b(t){var e,r,n="";if(typeof t=="string"||typeof t=="number")n+=t;else if(typeof t=="object")if(Array.isArray(t)){var s=t.length;for(e=0;e<s;e++)t[e]&&(r=b(t[e]))&&(n&&(n+=" "),n+=r)}else for(r in t)t[r]&&(n&&(n+=" "),n+=r);return n}function h(){for(var t,e,r=0,n="",s=arguments.length;r<s;r++)(t=arguments[r])&&(e=b(t))&&(n&&(n+=" "),n+=e);return n}const P=/^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i,j=/^(contenteditable|draggable|spellcheck|value)$/i,x=/^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i,D=new Set(["set:html","set:text"]),i=(t,e=!0)=>e?String(t).replace(/&/g,"&#38;").replace(/"/g,"&#34;"):t,H=t=>t.toLowerCase()===t?t:t.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`),c=t=>Object.entries(t).filter(([e,r])=>typeof r=="string"&&r.trim()||typeof r=="number").map(([e,r])=>e[0]!=="-"&&e[1]!=="-"?`${H(e)}:${r}`:`${e}:${r}`).join(";");function W(t,e,r=!0){if(t==null)return"";if(t===!1)return j.test(e)||x.test(e)?a(` ${e}="false"`):"";if(D.has(e))return console.warn(`[astro] The "${e}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${e}={value}\`) instead of the dynamic spread syntax (\`{...{ "${e}": value }}\`).`),"";if(e==="class:list"){const n=i(h(t),r);return n===""?"":a(` ${e.slice(0,-5)}="${n}"`)}if(e==="style"&&!(t instanceof m)){if(Array.isArray(t)&&t.length===2)return a(` ${e}="${i(`${c(t[0])};${t[1]}`,r)}"`);if(typeof t=="object")return a(` ${e}="${i(c(t),r)}"`)}return e==="className"?a(` class="${i(t,r)}"`):t===!0&&(e.startsWith("data-")||P.test(e))?a(` ${e}`):a(` ${e}="${i(t,r)}"`)}function y(t){const e=[],r={write:s=>e.push(s)},n=t(r);return{async renderToFinalDestination(s){for(const o of e)s.write(o);r.write=o=>s.write(o),await n}}}function*_(){yield I({type:"maybe-head"})}const l=Symbol.for("astro:slot-string");class L extends m{instructions;[l];constructor(e,r){super(e),this.instructions=r,this[l]=!0}}async function f(t,e){if(e=await e,e instanceof L)t.write(e);else if(d(e))t.write(e);else if(Array.isArray(e)){const r=e.map(n=>y(s=>f(s,n)));for(const n of r)n&&await n.renderToFinalDestination(t)}else if(typeof e=="function")await f(t,e());else if(typeof e=="string")t.write(a($(e)));else if(!(!e&&e!==0))if(S(e))await e.render(t);else if(O(e))await e.render(t);else if(v(e))await e.render(t);else if(ArrayBuffer.isView(e))t.write(e);else if(typeof e=="object"&&(Symbol.asyncIterator in e||Symbol.iterator in e))for await(const r of e)await f(t,r);else t.write(e)}const M=Symbol.for("astro.componentInstance");function v(t){return typeof t=="object"&&!!t[M]}const w=Symbol.for("astro.renderTemplateResult");class F{[w]=!0;htmlParts;expressions;error;constructor(e,r){this.htmlParts=e,this.error=void 0,this.expressions=r.map(n=>A(n)?Promise.resolve(n).catch(s=>{if(!this.error)throw this.error=s,s}):n)}async render(e){const r=this.expressions.map(n=>y(s=>{if(n||n===0)return f(s,n)}));for(let n=0;n<this.htmlParts.length;n++){const s=this.htmlParts[n],o=r[n];e.write(a(s)),o&&await o.renderToFinalDestination(e)}}}function O(t){return typeof t=="object"&&!!t[w]}function E(t,...e){return new F(t,e)}export{W as a,q as c,_ as m,E as r};
