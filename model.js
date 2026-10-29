/* Deterministic school-level models; arbitrary relative quantities, not human data. */
(function(root){
const vesselTypes=[{bile:false,lipase:false},{bile:true,lipase:false},{bile:false,lipase:true},{bile:true,lipase:true}];
function vessels(t){return vesselTypes.map(v=>{const radius=v.bile?.25:1;const area=1/radius;const remaining=v.lipase?100*Math.exp(-.045*area*t):100;return {...v,radius,area,remaining,product:100-remaining};});}
function pathway(site,t,physical=true,enzyme=true){const f=enzyme&&site!=='oesophagus'?1-Math.exp(-t*.12):0;return {site,time:t,pieceSize:physical&&site!=='oesophagus'?Math.max(.25,1-t*.035):1,starch:site==='stomach'?100:100*(1-f),maltose:site==='mouth'?100*f:site==='intestine'?100*(Math.exp(-t*.12)-Math.exp(-t*.24)):0,glucose:site==='intestine'?100*(1-2*Math.exp(-t*.12)+Math.exp(-t*.24)):0,protein:100*(1-(site==='mouth'?0:f)),peptides:site==='stomach'?100*f:0,amino:site==='intestine'?100*f:0,lipid:site==='intestine'?100*(1-f):100,lipidProducts:site==='intestine'?100*f:0};}
const routes={glucose:'blood',amino:'blood',water:'blood',minerals:'blood',vitamins:'blood',fat:'lymph',starch:'blocked',protein:'blocked'};
const api={vessels,pathway,routes};root.DigestionModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
