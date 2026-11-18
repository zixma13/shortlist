// Guided traversal, fixed-resolution performance capture, and harness-neutral DOM diagnostics.
const LIVE=new Float32Array(600);let liveN=0,liveI=0,lastReport=0,lastFrame=0,viewIndex=0;
const percentile=(a,p)=>a[Math.max(0,Math.ceil(a.length*p)-1)]||0;
const distribution=(buffer,n)=>{const a=Array.from(buffer.subarray(0,n)).sort((a,b)=>a-b);let sum=0;for(const x of a)sum+=x;return {samples:n,meanMs:n?sum/n:0,p50Ms:percentile(a,.5),p95Ms:percentile(a,.95),p99Ms:percentile(a,.99),maxMs:a.at(-1)||0};};
const setTourButton=()=>{const b=$('tour');if(b){b.setAttribute('aria-pressed',String(PERF.tour));b.textContent=PERF.tour?'หยุดทัวร์':'ชมฉากอัตโนมัติ';}};
const selectView=(i)=>{if(PERF.active)finishBench('เปลี่ยนมุมมองระหว่างวัด');PERF.tour=false;setTourButton();viewIndex=i;lookAt(...POSES[i]);F[VX]=F[VY]=F[VZ]=0;for(const b of document.querySelectorAll('[data-view]'))b.setAttribute('aria-pressed',String(+b.dataset.view===i));};
const telemetry=()=>{
 const l=distribution(LIVE,liveN);const state={buildId:BUILD_ID,ready:true,quality:['high','medium','low'][LV],width:W,height:H,displayWidth:DW,displayHeight:DH,dpr:devicePixelRatio,detail:det,adaptive:!PERF.active&&!PERF.ending,startupMs:PERF.bootMs,gpuTimestamp:hasTS,gpuMs:F[GPU],adapter:gpuInfo,fps:l.meanMs?1000/l.meanMs:0,p95Ms:l.p95Ms,frameSamples:liveN,visible:document.visibilityState,focused:document.hasFocus(),camera:[F[CX],F[CY],F[CZ]],tour:PERF.tour,benchmark:PERF.active,coast:Wd.coast,leaves:Wd.big.n+Wd.small.n,fish:nFish,mantas:nManta};
 canvas.dataset.telemetry=JSON.stringify(state);
 if(PERF.active){const t=Math.max(0,60-(performance.now()-PERF.start)/1000);$('bench')?.setAttribute('aria-label','กำลังวัด เหลือ '+Math.ceil(t)+' วินาที');}
};
function finishBench(reason=''){
 if(!PERF.active)return;PERF.active=false;PERF.tour=false;PERF.warming=false;PERF.ending=true;PERF.finishReason=reason;PERF.endElapsed=performance.now()-PERF.start;setTourButton();if(PERF.pending===0)finalizeBench();
}
function finalizeBench(){
 if(!PERF.ending)return;PERF.ending=false;const reason=PERF.finishReason||'';
 const frame=distribution(PERF.frame,PERF.nf),gpu=distribution(PERF.gpu,PERF.ng),cpu=distribution(PERF.cpu,PERF.nf);
 const report={buildId:BUILD_ID,date:'2026-11-17',valid:!reason&&!PERF.invalid,reason:reason||PERF.invalid||'',elapsedMs:PERF.endElapsed,resolution:PERF.viewport.slice(0,2),displayResolution:PERF.viewport.slice(2,4),quality:['high','medium','low'][LV],detail:PERF.viewport[4],adaptive:false,dpr:devicePixelRatio,adapter:gpuInfo,visible:document.visibilityState,focusAtStart:PERF.focus,frame,gpu:hasTS?gpu:null,renderSubmission:cpu,averageFps:frame.meanMs?1000/frame.meanMs:0,startupMs:PERF.bootMs,rawFrameMs:Array.from(PERF.frame.subarray(0,PERF.nf)),rawGpuMs:Array.from(PERF.gpu.subarray(0,PERF.ng)),rawRenderSubmissionMs:Array.from(PERF.cpu.subarray(0,PERF.nf))};
 PERF.report=report;const el=$('result');if(el){el.dataset.report=JSON.stringify(report);el.textContent=(report.valid?'วัดครบ60วินาที':'หยุดการวัด: '+report.reason)+'\n'+W+' × '+H+' · '+['High','Medium','Low'][LV]+' · ล็อกความละเอียด\n'+report.averageFps.toFixed(1)+' FPS เฉลี่ย · p95 '+frame.p95Ms.toFixed(2)+' ms\n'+(hasTS?'GPU เฉลี่ย '+gpu.meanMs.toFixed(2)+' ms · p95 '+gpu.p95Ms.toFixed(2)+' ms':'อุปกรณ์ไม่รองรับเวลา GPU');el.hidden=false;}
 $('bench').disabled=false;$('bench').removeAttribute('aria-label');$('bench').textContent='ทดสอบเฟรม60วินาที';dynT=-300;ui(true);telemetry();
}
function startBench(){
 if(PERF.active||PERF.ending)return;PERF.generation++;PERF.pending=0;pix=Math.min(PIXMAX,DW*DH);det=1;resize();PERF.warming=true;PERF.warmUntil=performance.now()+2000;PERF.nf=PERF.ng=0;PERF.invalid='';PERF.start=performance.now();PERF.last=0;PERF.viewport=[W,H,DW,DH,det];PERF.focus=document.hasFocus();PERF.active=PERF.tour=true;PERF.tourStart=PERF.start;setTourButton();
 const r=$('result');if(r){r.hidden=false;r.textContent='กำลังทดสอบเส้นทาง60วินาที…';delete r.dataset.report;}
 $('bench').disabled=true;$('bench').textContent='กำลังทดสอบ…';release();ui(false);
}
$('tour')?.addEventListener('click',()=>{if(PERF.active){finishBench('หยุดโดยผู้ใช้');return;}PERF.tour=!PERF.tour;if(PERF.tour){PERF.warming=false;PERF.tourStart=performance.now();release();ui(false);}setTourButton();});
$('bench')?.addEventListener('click',startBench);
$('reset')?.addEventListener('click',()=>selectView(0));
for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>selectView(+b.dataset.view));
addEventListener('keydown',e=>{if(e.code==='KeyT'&&!e.repeat)$('tour')?.click();if(!menu&&e.code>='Digit1'&&e.code<='Digit6')selectView(e.code.charCodeAt(5)-49);});
// Drag-look remains usable when the host browser declines pointer lock.
let grab=false,gx=0,gy=0;
canvas.addEventListener('pointerdown',e=>{if(menu||e.button!==0||e.pointerType==='touch')return;grab=true;gx=e.clientX;gy=e.clientY;canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(grab&&document.pointerLockElement!==canvas){mdx+=(e.clientX-gx)*1.2;mdy+=(e.clientY-gy)*1.2;gx=e.clientX;gy=e.clientY;}});
for(const n of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(n,()=>grab=false);
document.addEventListener('visibilitychange',()=>{if(PERF.active&&document.hidden)PERF.invalid='แท็บถูกซ่อนระหว่างวัด';release();});
addEventListener('resize',()=>{if(PERF.active)PERF.invalid='ขนาดหน้าต่างเปลี่ยนระหว่างวัด';});
const baseRender=render;
render=()=>{
 const now=F[LAST]||performance.now(),interval=lastFrame?now-lastFrame:0;lastFrame=now;
 if(interval>0){LIVE[liveI++%LIVE.length]=interval;liveN=Math.min(LIVE.length,liveN+1);}
 if(PERF.active&&PERF.warming&&performance.now()>=PERF.warmUntil){PERF.warming=false;PERF.start=PERF.tourStart=performance.now();PERF.last=0;PERF.nf=PERF.ng=0;}
 if(PERF.tour){const elapsed=PERF.warming?0:Math.max(0,(performance.now()-PERF.tourStart)/1000);F[FLT]=Math.min(FLYT,elapsed);flyAt();if(elapsed>=FLYT&&!PERF.active){PERF.tour=false;setTourButton();}}
 const c0=performance.now();baseRender();const submission=performance.now()-c0;
 if(PERF.active){
  if(menu)PERF.invalid='เปิดเมนูระหว่างวัด';
  if(!PERF.warming&&PERF.last&&PERF.nf<PERF.frame.length){PERF.frame[PERF.nf]=now-PERF.last;PERF.cpu[PERF.nf]=submission;PERF.nf++;}PERF.last=now;
  if(!PERF.warming&&performance.now()-PERF.start>=60000)finishBench();
 }
 if(now-lastReport>500){lastReport=now;telemetry();}
};
selectView(0);telemetry();
