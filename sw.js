if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,i)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let c={};const r=e=>a(e,t),o={module:{uri:t},exports:c,require:r};s[t]=Promise.all(n.map((e=>o[e]||r(e)))).then((e=>(i(...e),c)))}}define(["./workbox-588899ac"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/OC6edi7SuF_zbi6dxvDUw/_buildManifest.js",revision:"9134f16ed3b52b8f1b1f26a093cf732d"},{url:"/_next/static/OC6edi7SuF_zbi6dxvDUw/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/12-3595da335250be03.js",revision:"3595da335250be03"},{url:"/_next/static/chunks/247-b78e82dd6c8eaed5.js",revision:"b78e82dd6c8eaed5"},{url:"/_next/static/chunks/276.63a5360563684c3f.js",revision:"63a5360563684c3f"},{url:"/_next/static/chunks/767.74d27427c1cab8e3.js",revision:"74d27427c1cab8e3"},{url:"/_next/static/chunks/framework-73b8966a3c579ab0.js",revision:"73b8966a3c579ab0"},{url:"/_next/static/chunks/main-6f56f6f0e1cf8126.js",revision:"6f56f6f0e1cf8126"},{url:"/_next/static/chunks/pages/404-0fff1806e0fdef71.js",revision:"0fff1806e0fdef71"},{url:"/_next/static/chunks/pages/500-89bfd83f64a9555b.js",revision:"89bfd83f64a9555b"},{url:"/_next/static/chunks/pages/_app-9b0d1e85fba583e4.js",revision:"9b0d1e85fba583e4"},{url:"/_next/static/chunks/pages/_error-3f6d1c55bb8051ab.js",revision:"3f6d1c55bb8051ab"},{url:"/_next/static/chunks/pages/index-ab89980256b46b70.js",revision:"ab89980256b46b70"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-2fee55587839eda8.js",revision:"2fee55587839eda8"},{url:"/_next/static/css/0a34d0de87b8687e.css",revision:"0a34d0de87b8687e"},{url:"/_next/static/css/a4b7df8b9161b0d0.css",revision:"a4b7df8b9161b0d0"},{url:"/_next/static/media/1b761fdd19cb582a-s.p.ttf",revision:"a4a7379505cd554ea9523594b7c28b2a"},{url:"/edisys.svg",revision:"e1ee821382cfed7d2378c97f62413783"},{url:"/geoCrypt.svg",revision:"a98d9e19a1cbd2d545af067d873442d2"},{url:"/logo.svg",revision:"393f93bf19c7671e1809de387bfbb735"},{url:"/manifest.json",revision:"a05e853e2bc1360a639d6516cf1f9b4a"},{url:"/maskable_icon.png",revision:"6fad0441624e0db29901f649a4dd56e1"},{url:"/maskable_icon_x192.png",revision:"c9ebfb1990e6789d03d889af30c1ac59"},{url:"/maskable_icon_x384.png",revision:"b1db320a4c56f90a5cc64d218ac94ec7"},{url:"/maskable_icon_x512.png",revision:"6d5c3a09aff0d24c16d6afaa884346f0"},{url:"/pcdprototype/assets/index-761595f1.css",revision:"fe54a2bbd86be1ef680b57a75112dc76"},{url:"/pcdprototype/assets/index-e50bbff2.js",revision:"55b01eaf520289ce4ae2a4bf8df0148a"},{url:"/pcdprototype/index.html",revision:"0254f24e2dd6b72f1d99f52082582c82"},{url:"/pcdprototype/logo.svg",revision:"393f93bf19c7671e1809de387bfbb735"},{url:"/robots.txt",revision:"48118b718bd277d81bb790f74b48a850"},{url:"/sitemap.xml",revision:"4c4c72a36ffb6fbc4fa34f77ebb0a9aa"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));