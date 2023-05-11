"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[481],{78481:function(e,i,t){t.r(i),t.d(i,{FileHandle:function(){return o},FolderHandle:function(){return a}});var r=t(54950);let{DISALLOWED:n}=r.errors;class s{constructor(e,i){this.writer=e,this.fileEntry=i}async write(e){if("object"==typeof e){if("write"===e.type){if(Number.isInteger(e.position)&&e.position>=0&&(this.writer.seek(e.position),this.writer.position!==e.position&&(await new Promise((i,t)=>{this.writer.onwriteend=i,this.writer.onerror=t,this.writer.truncate(e.position)}),this.writer.seek(e.position))),!("data"in e))throw new DOMException("Failed to execute 'write' on 'UnderlyingSinkBase': Invalid params passed. write requires a data argument","SyntaxError");e=e.data}else if("seek"===e.type){if(Number.isInteger(e.position)&&e.position>=0){if(this.writer.seek(e.position),this.writer.position!==e.position)throw new DOMException("seeking position failed","InvalidStateError");return}throw new DOMException("Failed to execute 'write' on 'UnderlyingSinkBase': Invalid params passed. seek requires a position argument","SyntaxError")}else if("truncate"===e.type)return new Promise(i=>{if(Number.isInteger(e.size)&&e.size>=0)this.writer.onwriteend=e=>i(),this.writer.truncate(e.size);else throw new DOMException("Failed to execute 'write' on 'UnderlyingSinkBase': Invalid params passed. truncate requires a size argument","SyntaxError")})}await new Promise((i,t)=>{this.writer.onwriteend=i,this.writer.onerror=t,this.writer.write(new Blob([e]))})}close(){return new Promise(this.fileEntry.file.bind(this.fileEntry))}}class o{constructor(e,i=!0){this.file=e,this.kind="file",this.writable=i,this.readable=!0}get name(){return this.file.name}isSameEntry(e){return this.file.toURL()===e.file.toURL()}getFile(){return new Promise(this.file.file.bind(this.file))}createWritable(e){if(!this.writable)throw new DOMException(...n);return new Promise((i,t)=>this.file.createWriter(t=>{!1===e.keepExistingData?(t.onwriteend=e=>i(new s(t,this.file)),t.truncate(0)):i(new s(t,this.file))},t))}}class a{constructor(e,i=!0){this.dir=e,this.writable=i,this.readable=!0,this.kind="directory",this.name=e.name}isSameEntry(e){return this.dir.fullPath===e.dir.fullPath}async *entries(){let e=this.dir.createReader(),i=await new Promise(e.readEntries.bind(e));for(let e of i)yield[e.name,e.isFile?new o(e,this.writable):new a(e,this.writable)]}getDirectoryHandle(e,i){return new Promise((t,r)=>{this.dir.getDirectory(e,i,e=>{t(new a(e))},r)})}getFileHandle(e,i){return new Promise((t,r)=>this.dir.getFile(e,i,e=>t(new o(e)),r))}async removeEntry(e,i){let t=await this.getDirectoryHandle(e,{create:!1}).catch(i=>"TypeMismatchError"===i.name?this.getFileHandle(e,{create:!1}):i);if(t instanceof Error)throw t;return new Promise((e,r)=>{t instanceof a?i.recursive?t.dir.removeRecursively(()=>e(),r):t.dir.remove(()=>e(),r):t.file&&t.file.remove(()=>e(),r)})}}i.default=(e={})=>new Promise((i,t)=>window.webkitRequestFileSystem(e._persistent,0,e=>i(new a(e.root)),t))}}]);