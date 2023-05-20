"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[276],{42276:function(e,n,t){t.r(n),t.d(n,{default:function(){return v}});var r=t(85893),s=t(59854),o=t.n(s),a=t(67294);let l=/^(?=.*[A-Z])(?=.*\d).{6,100}$/;var i=function(e){let{setPassword:n}=e,t=a.useRef(null),s=a.useRef(null),i=a.useRef(null),[c,d]=a.useState(!1),u=()=>{var e,r;let o=null===(e=t.current)||void 0===e?void 0:e.value,a=null===(r=s.current)||void 0===r?void 0:r.value,c=i.current,d=e=>{c&&(c.innerHTML="",e.forEach(e=>{let n=document.createElement("p");n.setAttribute("style","color: red"),n.innerHTML=e,c.appendChild(n)}))};return o&&a?o!==a?(n(void 0),d(["passwords do not match"])):l.test(o)?(c&&(c.innerHTML=""),n(o)):(n(void 0),d(["password must be at least 6 characters long, contain at least one number and one capital letter"])):(n(void 0),d(["please confirm password"]))};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("input",{ref:t,type:c?"text":"password",id:"password1",className:o().textbox,style:{marginBottom:"0.5rem"},onChange:u,placeholder:"Enter password"}),(0,r.jsx)("br",{}),(0,r.jsx)("input",{ref:s,type:c?"text":"password",id:"password2",className:o().textbox,style:{marginBottom:"0.5rem"},onChange:u,placeholder:"Confirm password"}),(0,r.jsx)("br",{}),(0,r.jsx)("button",{type:"button",style:{width:"100%"},onClick:()=>d(!c),children:"⏿"}),(0,r.jsx)("br",{}),(0,r.jsx)("div",{ref:i}),(0,r.jsx)("br",{})]})},c=t(63888);let d=e=>{let n=Math.floor(e/1e6);return n<1?"".concat(Math.floor(e/1e3),"Kb"):"".concat(n,"Mb")};var u=function(e){let{files:n,setFiles:t}=e,[s,l]=a.useState(0),i=e=>{let n=e.reduce((e,n)=>e+n.size,0);return n>25e7?alert("Total file size cannot exceed 250MB"):l(n)},u=e=>{let r=[...Array.from(e),...n];return new Set(r.map(e=>e.name)).size!==r.length&&(r=r.filter((e,n,t)=>t.findIndex(n=>n.name===e.name)===n),alert("Files cannot have duplicate names, duplicates will be removed in download")),i(r),t(r)},p=e=>{let r=n.filter(n=>n.name!==e);i(r),t(r)};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(c.b,{multiple:!0,required:!0,handleChange:u,name:"file",children:(0,r.jsxs)("div",{className:o().uploadbox,children:["Drag & Drop files here ",(0,r.jsxs)("p",{children:[d(s),"/250MB"]})]})}),(0,r.jsx)("br",{}),(0,r.jsx)("div",{className:o().filelistcontainer,children:n.length>0&&n.map(e=>(0,r.jsxs)("div",{className:o().filelistbox,children:[e.name," ",(0,r.jsxs)("p",{children:[d(e.size)," "]}),(0,r.jsx)("button",{type:"button",className:o().bigbutton,style:{padding:"0.3em"},onClick:()=>p(e.name),children:"✖"}),(0,r.jsx)("hr",{})]},e.name))})]})};let p='<!DOCTYPE html>\n<html>\n\n<head>\n    <title>Unlock GeoCrypt</title>\n    <script src="https://cdn.jsdelivr.net/gh/gildas-lormeau/zip.js@2.7.6/dist/zip-full.min.js"\n        integrity="sha384-kP13zeVm0yhzyaXbBlr4UV6cM9+M8TUBI7j2A6z2mVgyxTqchjok1k1mQGI8Le5C"\n        crossorigin="anonymous" referrerpolicy="no-referrer"></script>\n    <script>\n        const version = "2.0.0";\n        const blobString = "data:application/zip;base64,',h='";\nconst loadFiles = async () => {\n    const gcPassword = document.getElementById("passwordBox").value;\n    fetch(blobString)\n        .then(res => res.blob())\n        .then(fileBlob => {\n            if (fileBlob) {\n                const zipFileReader = new window.zip.BlobReader(fileBlob);\n                const fileList = document.getElementById("fileList");\n                const progressBar = document.createElement("progress");\n                progressBar.max = 100;\n                progressBar.value = 0;\n                document.body.appendChild(progressBar);\n\n                const zipReader = new window.zip.ZipReader(zipFileReader, {\n                    onprogress: (index, max) => {\n                        progressBar.value = index / max * 100;\n                    }\n                });\n\n                zipReader.getEntries().then((zipFiles) => {\n                    fileList.innerHTML = "";\n                    zipFiles.forEach(async function (file) {\n                        const link = document.createElement("a");\n                        link.href = "#";\n                        link.onclick = function () {\n                            if (!file.getData) return;\n                            const writer = new window.zip.BlobWriter();\n                            file.getData(writer, { password: gcPassword }).then(function (fileData) {\n                                const anchor = document.createElement("a");\n                                const clickEvent = new MouseEvent("click");\n                                anchor.href = URL.createObjectURL(fileData);\n                                anchor.download = file.filename;\n                                anchor.dispatchEvent(clickEvent);\n                            }).catch(err => alert(err));\n                        };\n                        link.innerHTML = file.filename;\n                        const listEl = document.createElement("li")\n                        listEl.appendChild(link);\n                        fileList.appendChild(listEl);\n                        document.body.removeChild(progressBar);\n                    });\n                });\n                // await zipReader.close();//TODO: you may not be able to close this because files would need loading\n            }\n        })\n}\n</script>\n</head>\n<style>\nbody {\nfont-family: tahoma;\nborder: 1px solid black;\nwidth: 30%;\nmargin: auto;\n}\n</style>\n\n<body>\n<h1>Open GeoCrypt</h1>\n<p>Enter GeoCrypt Password.</p><input type="password" id="passwordBox" name="passwordBox"\nplaceholder="Type Password Here"> <button onclick="loadFiles()">Open</button>\n<ol id="fileList"></ol>\n<hr>\n<a href="https://geocrypt.me">Made with GeoCrypt</a>\n<p>warning: please be patient after opening archive, may not work with large files on firefox</p>\n</body>\n<script>\ndocument.getElementById("passwordBox").addEventListener("keypress", function(event) {\n    if (event.key === "Enter") {\n      event.preventDefault();\n      loadFiles()\n    }\n});\n</script>\n</html>',m=new TextEncoder().encode(p).byteLength+new TextEncoder().encode(h).byteLength;var f=t(84841),b=t(38486),w=t.n(b),x=t(98390),y=t.n(x),g=t(21876).Buffer;function v(){let[e,n]=a.useState([]),[t,s]=a.useState(void 0),[l,c]=a.useState(!1),d=a.useRef(null),b=a.useRef(null),x=e=>{e&&(d.current=e)},v=e=>{e&&(b.current=e)},E=async()=>{if(void 0!==t&&await c(!0),e.length<1||!d.current||!b.current){c(!1);return}d.current.value=0,d.current.max=0;let n=new AbortController,{signal:r}=n;b.current.onclick=()=>{c(!1),n.abort("Aborted by user")};let s={password:t,signal:r,onstart(e){d.current&&(d.current.max=e)},onprogress(e,n){d.current&&(d.current.value=e,d.current.max=n)}},o=new f._Q(new f.U5("application/zip"),{bufferedWrite:!0}),a=e.map(e=>e&&o.add(e.name,new f.Nt(e),s)),l=m+e.reduce((e,n)=>e+n.size,0),i=y().createWriteStream("geocrypt-".concat(Date.now().toString(),".html"),{size:l}).getWriter();Promise.all(a).then(()=>i.write(new TextEncoder().encode(p))).then(()=>{if(!d.current||!b.current)throw Error("progressBar or cancelButton is null");d.current.max=10,d.current.value=2}).then(()=>o.close()).then(e=>e.arrayBuffer()).then(e=>w().encode(g.from(e))).then(e=>i.write(new TextEncoder().encode(e))).then(()=>{if(!d.current||!b.current)throw Error("progressBar or cancelButton is null");d.current.max=10,d.current.value=8}).then(()=>i.write(new TextEncoder().encode(h))).then(()=>i.close()).finally(()=>c(!1)).catch(e=>{c(!1),alert(e)})};return a.useEffect(()=>{let e=e=>{"Enter"===e.key&&E()};return document.addEventListener("keydown",e),()=>{document.removeEventListener("keydown",e)}}),(0,r.jsxs)("div",{className:o().card,style:{width:"30em"},children:[(0,r.jsx)("br",{}),(0,r.jsx)(u,{setFiles:n,files:e}),(0,r.jsx)("br",{}),(0,r.jsx)(i,{setPassword:s}),l?(0,r.jsxs)("span",{style:{width:"100%"},children:[(0,r.jsx)("progress",{ref:x,className:o().progressbar}),(0,r.jsx)("button",{type:"button",ref:v,className:o().bigbutton,title:"abort",children:"✖"})]}):(0,r.jsx)("button",{type:"button",className:o().bigbutton,style:{width:"100%"},onClick:()=>E(),children:"Encrypt files and download"})]})}}}]);