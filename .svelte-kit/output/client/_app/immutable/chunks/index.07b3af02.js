import{H as f,s as l}from"./index.e52dd962.js";const e=[];function h(n,u=f){let i;const o=new Set;function r(t){if(l(n,t)&&(n=t,i)){const c=!e.length;for(const s of o)s[1](),e.push(s,n);if(c){for(let s=0;s<e.length;s+=2)e[s][0](e[s+1]);e.length=0}}}function b(t){r(t(n))}function p(t,c=f){const s=[t,c];return o.add(s),o.size===1&&(i=u(r)||f),t(n),()=>{o.delete(s),o.size===0&&i&&(i(),i=null)}}return{set:r,update:b,subscribe:p}}export{h as w};
