(()=>{"use strict";const e=(e,t)=>t.some((t=>t instanceof RegExp?t.test(e):t===e));const t=["#","＃"];function r(e){return e.normalize("NFKC").toLowerCase().replace(/[ぁ-ん]/g,(e=>String.fromCharCode(e.charCodeAt(0)+96)))}function n(t){return function(t,r){if(r={defaultProtocol:"http:",normalizeProtocol:!0,forceHttp:!1,forceHttps:!1,stripAuthentication:!0,stripHash:!1,stripTextFragment:!0,stripWWW:!0,removeQueryParameters:[/^utm_\w+/i],removeTrailingSlash:!0,removeSingleSlash:!0,removeDirectoryIndex:!1,sortQueryParameters:!0,...r},t=t.trim(),/^data:/i.test(t))return((e,{stripHash:t})=>{const r=/^data:(?<type>[^,]*?),(?<data>[^#]*?)(?:#(?<hash>.*))?$/.exec(e);if(!r)throw new Error(`Invalid URL: ${e}`);let{type:n,data:o,hash:s}=r.groups;const c=n.split(";");s=t?"":s;let a=!1;"base64"===c[c.length-1]&&(c.pop(),a=!0);const i=(c.shift()||"").toLowerCase(),l=[...c.map((e=>{let[t,r=""]=e.split("=").map((e=>e.trim()));return"charset"===t&&(r=r.toLowerCase(),"us-ascii"===r)?"":`${t}${r?`=${r}`:""}`})).filter(Boolean)];return a&&l.push("base64"),(l.length>0||i&&"text/plain"!==i)&&l.unshift(i),`data:${l.join(";")},${a?o.trim():o}${s?`#${s}`:""}`})(t,r);if(/^view-source:/i.test(t))throw new Error("`view-source:` is not supported as it is a non-standard protocol");const n=t.startsWith("//");!n&&/^\.*\//.test(t)||(t=t.replace(/^(?!(?:\w+:)?\/\/)|^\/\//,r.defaultProtocol));const o=new URL(t);if(r.forceHttp&&r.forceHttps)throw new Error("The `forceHttp` and `forceHttps` options cannot be used together");if(r.forceHttp&&"https:"===o.protocol&&(o.protocol="http:"),r.forceHttps&&"http:"===o.protocol&&(o.protocol="https:"),r.stripAuthentication&&(o.username="",o.password=""),r.stripHash?o.hash="":r.stripTextFragment&&(o.hash=o.hash.replace(/#?:~:text.*?$/i,"")),o.pathname){const e=/\b[a-z][a-z\d+\-.]{1,50}:\/\//g;let t=0,r="";for(;;){const n=e.exec(o.pathname);if(!n)break;const s=n[0],c=n.index;r+=o.pathname.slice(t,c).replace(/\/{2,}/g,"/"),r+=s,t=c+s.length}r+=o.pathname.slice(t,o.pathname.length).replace(/\/{2,}/g,"/"),o.pathname=r}if(o.pathname)try{o.pathname=decodeURI(o.pathname)}catch{}if(!0===r.removeDirectoryIndex&&(r.removeDirectoryIndex=[/^index\.[a-z]+$/]),Array.isArray(r.removeDirectoryIndex)&&r.removeDirectoryIndex.length>0){let t=o.pathname.split("/");const n=t[t.length-1];e(n,r.removeDirectoryIndex)&&(t=t.slice(0,-1),o.pathname=t.slice(1).join("/")+"/")}if(o.hostname&&(o.hostname=o.hostname.replace(/\.$/,""),r.stripWWW&&/^www\.(?!www\.)[a-z\-\d]{1,63}\.[a-z.\-\d]{2,63}$/.test(o.hostname)&&(o.hostname=o.hostname.replace(/^www\./,""))),Array.isArray(r.removeQueryParameters))for(const t of[...o.searchParams.keys()])e(t,r.removeQueryParameters)&&o.searchParams.delete(t);!0===r.removeQueryParameters&&(o.search=""),r.sortQueryParameters&&o.searchParams.sort(),r.removeTrailingSlash&&(o.pathname=o.pathname.replace(/\/$/,""));const s=t;return t=o.toString(),r.removeSingleSlash||"/"!==o.pathname||s.endsWith("/")||""!==o.hash||(t=t.replace(/\/$/,"")),(r.removeTrailingSlash||"/"===o.pathname)&&""===o.hash&&r.removeSingleSlash&&(t=t.replace(/\/$/,"")),n&&!r.normalizeProtocol&&(t=t.replace(/^http:\/\//,"//")),r.stripProtocol&&(t=t.replace(/^(?:https?:)?\/\//,"")),t}(t,{stripHash:!0,stripProtocol:!0,removeQueryParameters:!0})}function o(e){return r(e.replace(new RegExp(`^[${t.join()}]`),""))}function s(e){return r(e.replace(/^[@＠]/,""))}const c={tweet_outer:"div.css-1dbjc4n.r-1adg3ll.r-1ny4l3l",tweet_content:".css-901oao.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-bnwqim.r-qvutc0",user_name:".css-901oao.css-bfa6kz.r-1awozwy.r-6koalj.r-1tl8opc.r-a023e6.r-b88u0q.r-rjixqe.r-bcqeeo.r-1udh08x.r-3s2u2q.r-qvutc0",user_id:".css-901oao.css-bfa6kz.r-18u37iz.r-16dba41.r-bcqeeo.r-qvutc0",timeline:"main",checked_tweet_class_name:"spam-tweets-compressor-checked",media:Object.values({image:".css-1dbjc4n.r-1867qdf.r-1phboty.r-rs99b7.r-1s2bzr4.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg",video:".css-1dbjc4n.r-1867qdf.r-1phboty.r-rs99b7.r-1s2bzr4.r-1ny4l3l.r-1udh08x",summary_card:".css-1dbjc4n.r-1867qdf.r-1phboty.r-rs99b7.r-18u37iz.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg",summary_with_large_image:".css-1dbjc4n.r-1867qdf.r-1phboty.r-rs99b7.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg"}).join(","),verified_badge:"svg.r-4qtqp9.r-yyyyoo.r-1xvli5t.r-9cviqr.r-f9ja8p.r-og9te1.r-bnwqim.r-1plcrui.r-lrvibr",hashtag_link_mention:".css-4rbku5.css-18t94o4.css-901oao.css-16my406.r-1loqt21.r-poiln3.r-bcqeeo.r-qvutc0",link_scheme_outer:".css-901oao.css-16my406.r-1tl8opc.r-hiw28u.r-qvk6io.r-bcqeeo.r-qvutc0",tweet_button_inner:".css-4rbku5.css-18t94o4.css-1dbjc4n.r-42olwf.r-sdzlij.r-1phboty.r-rs99b7.r-1waj6vr.r-1loqt21.r-19yznuf.r-64el8z.r-1ny4l3l.r-o7ynqc.r-6416eg.r-lrvibr",normal_text:".css-901oao.css-16my406.r-1tl8opc.r-bcqeeo.r-qvutc0",show_tweet_button:".show-tweet-button"},a=["d","g","i","m","s","u","y"],i=new RegExp(`^/(.*)/([${a.join("")}]*)$`);function l(e){return i.test(e)}function u(e){const t=function(e){if(!l(e))return{string:e,flag:null};const t=e.replace(i,"$1"),r=new Set(e.replace(i,"$2").split("")),n=Array.from(r).filter((e=>a.includes(e)));return{string:t,flag:n.length?n.join(""):null}}(e);return t.flag?new RegExp(t.string,t.flag):new RegExp(t.string)}function h(e,t){const r=l(t);if("string"==typeof e)return r?u(t).test(e):e.includes(t);{let n=!1;return e.forEach((e=>{(r&&u(t).test(e)||e===t)&&(n=!0)})),n}}function d(e,t){let r="and"===e[0];return e[1].forEach((c=>{let a=!1;if(null!==(i=c)&&"object"==typeof i&&"mode"in i&&"type"in i&&"string"in i&&"string"==typeof i.mode&&"string"==typeof i.type&&"string"==typeof i.string){let e=!1;switch(c.type){case"text":e=h(t.content,c.string);break;case"hashtag":e=h(t.hashtag,o(c.string));break;case"id":e=h(t.user_id,s(c.string));break;case"name":e=h(t.user_name,c.string);break;case"link":e=h(t.link,l(c.string)?c.string:n(c.string))}a="include"===c.mode?e:!e}else a=d(c,t);var i;"and"!==e[0]||a?"or"===e[0]&&a&&(r=!0):r=!1})),r}function m(e,t){for(const r of t)if(r){if(l(r)&&u(r).test(e))return!0;if(e.includes(r))return!0}return!1}function _(e,t,n){const o=m(r(e.content),t.ng_word)||t.include_user_name&&m(r(e.user_name),t.ng_word)?browser.i18n.getMessage("compress_reason_ng_word"):!!d(n,e)&&browser.i18n.getMessage("compress_reason_advanced_detection_default"),s=Boolean(e.querySelector(c.verified_badge))&&!t.include_verified_account;return!1===o||s?[!1]:[!0,o]}const p={hide_completely:!1,include_verified_account:!1,include_user_name:!1,show_reason:!0,decompress_on_hover:!1,ng_word:[""],allow_list:[""],exclude_url:["https://twitter.com/home"],advanced_filter:[""],main_color:"rgb(29, 161, 242)",background_color:"rgb(0, 0, 0)",font_color:"rgb(255, 255, 255)"};class g{constructor(){this.setting=p,this.callback=void 0}async load(){const e=await browser.storage.local.get("setting"),t=p;return e.setting&&Object.keys(e.setting).filter((e=>e in p)).forEach((r=>t[r]=e.setting[r])),browser.storage.onChanged.addListener((e=>{this.setting=e.setting.newValue,this.callback&&this.callback()})),new Proxy(t,{get:(e,t)=>this.setting[t],set:(e,t,r)=>(this.setting[t]=r,this.save(),!0)})}save(){browser.storage.local.set({setting:this.setting})}onChange(e){this.callback=e}}class f{constructor(e,t){this.tweet=e,this.content_element=e.querySelector(c.tweet_content),this.emoji_detector=t,this.decompress_button=document.createElement("button")}get_text_content(e){const t=e.cloneNode(!0),r=document.createElement("div");return r.appendChild(t),r.querySelectorAll("img").forEach((e=>{const t=this.emoji_detector.get_from_url(e.src);t&&e.insertAdjacentText("afterend",t),e.remove()})),r.textContent}get content(){return this.content_element?this.get_text_content(this.content_element)||"":null}get user_name(){const e=this.tweet.querySelector(c.user_name);return e&&this.get_text_content(e)||""}get user_id(){const e=this.tweet.querySelector(c.user_id);return e?s(e.textContent||""):null}get language(){return this.get_language()}async get_language(){const e=this.content_element;let t=this.content||"";if(e){const r=e.cloneNode(!0),n=document.createElement("div");n.appendChild(r),n.querySelectorAll(c.hashtag_link_mention).forEach((e=>e.remove())),t=n.textContent||""}const r=await browser.i18n.detectLanguage(t);return r.isReliable?r.languages[0].language.replace(/-.*$/,""):this.content_element&&this.content_element.lang?this.content_element.lang:""}compress(e,t){this.decompress_button.setAttribute("class",this.tweet.getAttribute("class")||""),this.decompress_button.classList.add(c.show_tweet_button.replace(/^\./,""));const r=this.tweet.user_name,n=this.tweet.user_id;if(e){const t=browser.i18n.getMessage("decompress_button_strict_with_reason",[r,`@${n}`,e]);this.decompress_button.textContent=t}else{const e=browser.i18n.getMessage("decompress_button_strict_without_reason",[r,`@${n}`]);this.decompress_button.textContent=e}this.decompress_button.addEventListener("click",(()=>{this.tweet.style.display="block",this.decompress_button.remove()})),t&&this.decompress_button.addEventListener("mouseover",(()=>{this.tweet.style.display="block",this.decompress_button.remove()})),this.tweet.style.display="none",this.tweet.insertAdjacentElement("afterend",this.decompress_button)}hide_completely(){this.tweet.style.display="none",this.decompress_button.style.display="none"}get hashtag(){return[...this.tweet.querySelectorAll(c.hashtag_link_mention)].filter((e=>e.textContent&&t.includes(e.textContent[0]))).map((e=>o(e.textContent||"")))}get link(){return[...this.tweet.querySelectorAll(c.hashtag_link_mention)].filter((function(e){return Boolean(e.querySelector(c.link_scheme_outer))})).map((function(e){return n((e.textContent||"").replace(/…$/,""))}))}}async function w(e=!0){const t=await(new g).load(),r=document.querySelector(c.tweet_button_inner),n=getComputedStyle(document.body).backgroundColor,o=document.querySelector(c.normal_text);if(!(r&&n&&o)){if(e)return new Promise(((e,t)=>{setInterval((()=>{w(!1).then((()=>e())).catch((e=>t(e)))}),1e3)}));throw"Failed to get color setting."}t.main_color=getComputedStyle(r).backgroundColor,t.background_color=n,t.font_color=getComputedStyle(o).color}function b(e,t){return e.replace(/^rgb\(/,"rgba(").replace(/\)$/,`, ${t})`)}async function y(){const e=await(new g).load(),t=document.createElement("style");t.textContent=`\n:root {\n    --main_color: ${e.main_color};\n    --background_color: ${e.background_color};\n    --high_emphasize_text_color: ${b(e.font_color,.87)};\n    --medium_emphasize_text_color: ${b(e.font_color,.6)};\n}\n    `,document.body.appendChild(t)}async function v(e){const t=await fetch(e);return await t.json()}async function x(e){const t=[],r=await v("https://cdn.statically.io/gh/Robot-Inventor/stc-filter/main/dist/advanced_filter.json"),n=Object.keys(r).filter((t=>e.includes(r[t].id))).map((e=>r[e].url));for(const e of n){const r=await v(e);t.push(r.rule)}return["or",[...t]]}const k=new class{constructor(){this.emoji_list=void 0}async init(){const e=await fetch(browser.runtime.getURL("dist/twitter-emoji-url-list/twitter-emoji-url-list.json"));this.emoji_list=await e.json()}get_from_url(e){if(this.emoji_list&&e in this.emoji_list)return this.emoji_list[e];if(void 0===this.emoji_list)throw"Emoji.init() must be called before Emoji.using get_from_url().";return null}};k.init().then((async()=>{const e=new g,t=await e.load();async function r(){n=await x(t.advanced_filter)}let n=await x(t.advanced_filter);setInterval((()=>{r()}),86400),e.onChange((()=>{(async()=>{await r(),document.querySelectorAll(c.show_tweet_button).forEach((e=>e.click())),document.querySelectorAll("."+c.checked_tweet_class_name).forEach((e=>e.classList.remove(c.checked_tweet_class_name)))})()}));const o=document.body,a=new MutationObserver((()=>{const e=document.querySelector(c.timeline);if(e){a.disconnect(),w().then(y).catch((e=>console.error(e)));const r=e;new MutationObserver((()=>{!function(e,t){if(e.exclude_url.includes(location.href))return;const r=[...document.querySelectorAll(`${c.tweet_outer}:not(.${c.checked_tweet_class_name})`)].map((function(e){e.classList.add(c.checked_tweet_class_name);const t=new f(e,k),r="stc_show_user_id_error=true";return["/notifications"].includes(location.pathname)||null===t.content||null!==t.user_id||document.cookie.includes(r)||(alert(browser.i18n.getMessage("error_message_user_id_bug")),document.cookie="stc_show_user_id_error=true;max-age=86400"),e.content=t.content||"",e.user_name=t.user_name,e.user_id=t.user_id||"",e.language=t.language,e.compress=(e,r,n)=>{e?t.hide_completely():t.compress(r,n)},e.hashtag=t.hashtag,e.link=t.link,e}));for(const n of r){if(e.allow_list.map(s).includes(n.user_id))continue;const r=_(n,e,t);r[0]&&(e.show_reason?n.compress(e.hide_completely,r[1],e.decompress_on_hover):n.compress(e.hide_completely,void 0,e.decompress_on_hover))}}(t,n)})).observe(r,{childList:!0,subtree:!0})}}));a.observe(o,{childList:!0,subtree:!0})})).catch((e=>console.error(e)))})();