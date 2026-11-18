// Fixed buffers; GPU timing is asynchronous, distinct from rAF cadence.
const PERF={active:false,tour:false,ending:false,generation:0,pending:0,frame:new Float32Array(32768),gpu:new Float32Array(32768),cpu:new Float32Array(32768),nf:0,ng:0,start:0,last:0,tourStart:0,viewport:[],report:null,frames:0,bootMs:0};
