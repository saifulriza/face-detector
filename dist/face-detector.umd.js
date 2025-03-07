(function(D){typeof define=="function"&&define.amd?define(D):D()})(function(){"use strict";const D={};D.unpack_cascade=function(e){const t=new DataView(new ArrayBuffer(4));let i=8;t.setUint8(0,e[i+0]),t.setUint8(1,e[i+1]),t.setUint8(2,e[i+2]),t.setUint8(3,e[i+3]);const c=t.getInt32(0,!0);i=i+4,t.setUint8(0,e[i+0]),t.setUint8(1,e[i+1]),t.setUint8(2,e[i+2]),t.setUint8(3,e[i+3]);const s=t.getInt32(0,!0);i=i+4;const o=[],n=[],r=[];for(let p=0;p<s;++p){Array.prototype.push.apply(o,[0,0,0,0]),Array.prototype.push.apply(o,e.slice(i,i+4*Math.pow(2,c)-4)),i=i+4*Math.pow(2,c)-4;for(let a=0;a<Math.pow(2,c);++a)t.setUint8(0,e[i+0]),t.setUint8(1,e[i+1]),t.setUint8(2,e[i+2]),t.setUint8(3,e[i+3]),n.push(t.getFloat32(0,!0)),i=i+4;t.setUint8(0,e[i+0]),t.setUint8(1,e[i+1]),t.setUint8(2,e[i+2]),t.setUint8(3,e[i+3]),r.push(t.getFloat32(0,!0)),i=i+4}const w=new Int8Array(o),f=new Float32Array(n),m=new Float32Array(r);function h(p,a,l,u,d){p=256*p,a=256*a;let M=0,_=0;const U=Math.pow(2,c)>>0;for(let x=0;x<s;++x){let P=1;for(let g=0;g<c;++g)P=2*P+(u[(p+w[M+4*P+0]*l>>8)*d+(a+w[M+4*P+1]*l>>8)]<=u[(p+w[M+4*P+2]*l>>8)*d+(a+w[M+4*P+3]*l>>8)]);if(_=_+f[U*x+P-U],_<=m[x])return-1;M+=4*U}return _-m[s-1]}return h},D.run_cascade=function(e,t,i){const c=e.pixels,s=e.nrows,o=e.ncols,n=e.ldim,r=i.shiftfactor,w=i.minsize,f=i.maxsize,m=i.scalefactor;let h=w;const p=[];for(;h<=f;){const a=Math.max(r*h,1)>>0,l=h/2+1>>0;for(let u=l;u<=s-l;u+=a)for(let d=l;d<=o-l;d+=a){const M=t(u,d,h,c,n);M>0&&p.push([u,d,h,M])}h=h*m}return p},D.cluster_detections=function(e,t){e=e.sort(function(o,n){return n[3]-o[3]});function i(o,n){const r=o[0],w=o[1],f=o[2],m=n[0],h=n[1],p=n[2],a=Math.max(0,Math.min(r+f/2,m+p/2)-Math.max(r-f/2,m-p/2)),l=Math.max(0,Math.min(w+f/2,h+p/2)-Math.max(w-f/2,h-p/2));return a*l/(f*f+p*p-a*l)}const c=new Array(e.length).fill(0),s=[];for(let o=0;o<e.length;++o)if(c[o]==0){let n=0,r=0,w=0,f=0,m=0;for(let h=o;h<e.length;++h)i(e[o],e[h])>t&&(c[h]=1,n=n+e[h][0],r=r+e[h][1],w=w+e[h][2],f=f+e[h][3],m=m+1);s.push([n/m,r/m,w/m,f])}return s},D.instantiate_detection_memory=function(e){let t=0;const i=[];for(let s=0;s<e;++s)i.push([]);function c(s){i[t]=s,t=(t+1)%i.length,s=[];for(let o=0;o<i.length;++o)s=s.concat(i[o]);return s}return c},typeof window<"u"&&(window.pico=D);const v={};v.unpack_localizer=function(e){const t=new DataView(new ArrayBuffer(4));let i=0;t.setUint8(0,e[i+0]),t.setUint8(1,e[i+1]),t.setUint8(2,e[i+2]),t.setUint8(3,e[i+3]);const c=t.getInt32(0,!0);i=i+4,t.setUint8(0,e[i+0]),t.setUint8(1,e[i+1]),t.setUint8(2,e[i+2]),t.setUint8(3,e[i+3]);const s=t.getFloat32(0,!0);i=i+4,t.setUint8(0,e[i+0]),t.setUint8(1,e[i+1]),t.setUint8(2,e[i+2]),t.setUint8(3,e[i+3]);const o=t.getInt32(0,!0);i=i+4,t.setUint8(0,e[i+0]),t.setUint8(1,e[i+1]),t.setUint8(2,e[i+2]),t.setUint8(3,e[i+3]);const n=t.getInt32(0,!0);i=i+4;const r=[],w=[];for(let a=0;a<c;++a)for(let l=0;l<o;++l){Array.prototype.push.apply(r,e.slice(i,i+4*Math.pow(2,n)-4)),i=i+4*Math.pow(2,n)-4;for(let u=0;u<Math.pow(2,n);++u)for(let d=0;d<2;++d)t.setUint8(0,e[i+0]),t.setUint8(1,e[i+1]),t.setUint8(2,e[i+2]),t.setUint8(3,e[i+3]),w.push(t.getFloat32(0,!0)),i=i+4}const f=new Int8Array(r),m=new Float32Array(w);function h(a,l,u,d,M,_,U){let x=0;const P=Math.pow(2,n)>>0;for(let F=0;F<c;++F){let V=0,z=0;for(let C=0;C<o;++C){let I=0;for(var g=0;g<n;++g){const k=Math.min(M-1,Math.max(0,256*a+f[x+4*I+0]*u>>8)),y=Math.min(_-1,Math.max(0,256*l+f[x+4*I+1]*u>>8)),W=Math.min(M-1,Math.max(0,256*a+f[x+4*I+2]*u>>8)),L=Math.min(_-1,Math.max(0,256*l+f[x+4*I+3]*u>>8));I=2*I+1+(d[k*U+y]>d[W*U+L])}const A=2*(o*P*F+P*C+I-(P-1));V+=m[A+0],z+=m[A+1],x+=4*P-4}a=a+V*u,l=l+z*u,u=u*s}return[a,l]}function p(a,l,u,d,M){const _=[],U=[];for(let x=0;x<d;++x){const P=u*(.925+.15*Math.random());let g=a+u*.15*(.5-Math.random()),F=l+u*.15*(.5-Math.random());[g,F]=h(g,F,P,M.pixels,M.nrows,M.ncols,M.ldim),_.push(g),U.push(F)}return _.sort(),U.sort(),[_[Math.round(d/2)],U[Math.round(d/2)]]}return p},typeof window<"u"&&(window.lploc=v);class T{constructor(t={}){if(this.initialized=!1,this.options={timeoutDuration:t.timeoutDuration||3e3,onFaceTimeout:t.onFaceTimeout||(()=>{}),onFaceDetected:t.onFaceDetected||(()=>{}),onPupilTimeout:t.onPupilTimeout||(()=>{}),onPupilDetected:t.onPupilDetected||(()=>{}),onInit:t.onInit||(()=>{}),showFaceCircle:t.showFaceCircle!==void 0?t.showFaceCircle:!0,showPupilPoints:t.showPupilPoints!==void 0?t.showPupilPoints:!0,faceCircleColor:t.faceCircleColor||"#ff0000",pupilPointsColor:t.pupilPointsColor||"#ff0000",faceCircleLineWidth:t.faceCircleLineWidth||3,pupilPointsLineWidth:t.pupilPointsLineWidth||3,detectionMode:t.detectionMode||"both",resources:t.resources||{facefinder:"./resources/facefinder.bin",puploc:"./resources/puploc.bin"}},!["face","pupil","both"].includes(this.options.detectionMode))throw new Error('Invalid detection mode. Must be "face", "pupil", or "both"');this.options.showFaceCircle=this.options.showFaceCircle&&(this.options.detectionMode==="face"||this.options.detectionMode==="both"),this.options.showPupilPoints=this.options.showPupilPoints&&(this.options.detectionMode==="pupil"||this.options.detectionMode==="both"),this.lastPupilDetectionTime=Date.now(),this.pupilTimeoutInterval=null,this.lastValidPupilPositions={left:null,right:null},this.smoothingFactor=.7}async init(t){if(!(t instanceof HTMLCanvasElement))throw new Error("Canvas element is required");if(this.canvas=t,this.ctx=this.canvas.getContext("2d"),this.update_memory=D.instantiate_detection_memory(5),this.options.detectionMode==="face"||this.options.detectionMode==="both"){const c=await(await fetch(this.options.resources.facefinder)).arrayBuffer(),s=new Int8Array(c);this.facefinder_classify_region=D.unpack_cascade(s)}if(this.options.detectionMode==="pupil"||this.options.detectionMode==="both"){const c=await(await fetch(this.options.resources.puploc)).arrayBuffer(),s=new Int8Array(c);this.do_puploc=v.unpack_localizer(s)}this.initialized=!0,this.options.onInit()}rgba_to_grayscale(t,i,c){for(var s=new Uint8Array(i*c),o=0;o<i;++o)for(var n=0;n<c;++n)s[o*c+n]=(2*t[o*4*c+4*n+0]+7*t[o*4*c+4*n+1]+1*t[o*4*c+4*n+2])/10;return s}processFace(t){if(!this.initialized)throw new Error("FaceDetector not initialized. Call init() first");this.ctx.drawImage(t,0,0);const i=this.ctx.getImageData(0,0,640,480).data,c={pixels:this.rgba_to_grayscale(i,480,640),nrows:480,ncols:640,ldim:640},s={shiftfactor:.1,minsize:100,maxsize:1e3,scalefactor:this.options.detectionMode==="pupil"?1.2:1.1};let o=[];if(this.facefinder_classify_region&&(o=D.run_cascade(c,this.facefinder_classify_region,s),o=this.update_memory(o),o=D.cluster_detections(o,.2)),this.options.detectionMode==="face"||this.options.detectionMode==="both"){let n=!1;for(let r=0;r<o.length;++r)o[r][3]>50&&(n=!0,this.lastFaceDetectionTime=Date.now(),this.drawDetection(o[r],c),this.options.onFaceDetected(o[r]));!n&&Date.now()-this.lastFaceDetectionTime>this.options.timeoutDuration&&(this.options.onFaceTimeout(),this.lastFaceDetectionTime=Date.now())}else if(this.options.detectionMode==="pupil"){let n=null;for(let r=0;r<o.length;++r)if(o[r][3]>20){n=o[r];break}n?(this.lastValidDet&&(n[0]=n[0]*.3+this.lastValidDet[0]*.7,n[1]=n[1]*.3+this.lastValidDet[1]*.7,n[2]=n[2]*.3+this.lastValidDet[2]*.7),this.lastValidDet=[...n]):this.lastValidDet?n=this.lastValidDet:n=[240,320,200,100],this.drawDetection(n,c)}}drawDetection(t,i){if(this.options.showFaceCircle&&["face","both"].includes(this.options.detectionMode)&&(this.ctx.beginPath(),this.ctx.arc(t[1],t[0],t[2]/2,0,2*Math.PI,!1),this.ctx.lineWidth=this.options.faceCircleLineWidth,this.ctx.strokeStyle=this.options.faceCircleColor,this.ctx.stroke()),this.options.showPupilPoints&&["pupil","both"].includes(this.options.detectionMode)){let c=!1,s=!1;if(this.do_puploc){const o=this.options.detectionMode==="pupil"?.5:.35,n=-.1*t[2];c=this.drawEye(t,i,-.2,"left",o,n),s=this.drawEye(t,i,.2,"right",o,n)}c||s?this.lastPupilDetectionTime=Date.now():Date.now()-this.lastPupilDetectionTime>this.options.timeoutDuration&&this.options.detectionMode==="pupil"&&(this.options.onPupilTimeout(),this.lastPupilDetectionTime=Date.now())}}drawEye(t,i,c,s,o=.35,n=0){let r=t[0]+n,w=t[1]+c*t[2],f=o*t[2];const m=[f,f*.8,f*1.2];let h=[-1,-1];for(let l of m){const[u,d]=this.do_puploc(r,w,l,63,i);if(u>=0&&d>=0){h=[u,d];break}}let[p,a]=h;if(p>=0&&a>=0)return this.lastValidPupilPositions[s]&&(p=p*(1-this.smoothingFactor)+this.lastValidPupilPositions[s].y*this.smoothingFactor,a=a*(1-this.smoothingFactor)+this.lastValidPupilPositions[s].x*this.smoothingFactor),this.lastValidPupilPositions[s]={x:a,y:p},this.ctx.beginPath(),this.ctx.arc(a,p,2,0,2*Math.PI,!1),this.ctx.lineWidth=this.options.pupilPointsLineWidth,this.ctx.strokeStyle=this.options.pupilPointsColor,this.ctx.stroke(),this.options.onPupilDetected({x:a,y:p,eye:s}),!0;if(this.lastValidPupilPositions[s]){const l=this.lastValidPupilPositions[s];return this.ctx.beginPath(),this.ctx.arc(l.x,l.y,2,0,2*Math.PI,!1),this.ctx.lineWidth=this.options.pupilPointsLineWidth,this.ctx.strokeStyle=this.options.pupilPointsColor,this.ctx.stroke(),!0}return!1}start(t){if(!this.initialized)throw new Error("FaceDetector must be initialized first");if(!(t instanceof HTMLVideoElement))throw new Error("Video element is required");this.processInterval=setInterval(()=>this.processFace(t),1e3/30),(this.options.detectionMode==="pupil"||this.options.detectionMode==="both")&&(this.pupilTimeoutInterval=setInterval(()=>{Date.now()-this.lastPupilDetectionTime>this.options.timeoutDuration&&this.options.onPupilTimeout()},1e3))}stop(){this.initialized=!1,this.processInterval&&(clearInterval(this.processInterval),this.processInterval=null),this.pupilTimeoutInterval&&(clearInterval(this.pupilTimeoutInterval),this.pupilTimeoutInterval=null)}}typeof module<"u"&&module.exports?module.exports=T:typeof window<"u"&&(window.pico||(window.pico=D),window.lploc||(window.lploc=v),window.FaceDetector=T)});
